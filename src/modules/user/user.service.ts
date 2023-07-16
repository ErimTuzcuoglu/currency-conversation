import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
/* #region Local Imports */
import {
  BaseService,
  CustomException,
  ErrorMessages,
  RegEx,
} from '@modules/common';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { CreateUserResponseViewModel } from '@modules/user/response-models/create-user.response';
import { CreateWalletDto } from '@modules/user/dto/create-wallet.dto';
import { LoginDto } from '@modules/user/dto/login.dto';
import { LoginResponseViewModel } from '@modules/user/response-models/login.response';
import { UpdateUserDto } from '@modules/user/dto/update-user.dto';
import { User } from '@modules/user/entities/user.entity';
import { UserResponseViewModel } from '@modules/user/response-models/user.response';
import { Wallet } from '@modules/user/entities/wallet.entity';
import { WalletResponseViewModel } from '@modules/user/response-models/wallet.response';
import { AuthService } from '@modules/auth/auth.service';
import { EnvironmentVariables } from '@config/environment/EnvironmentVariables';
/* #endregion */

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super();
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseViewModel> {
    if (!RegEx.EMAIL.test(createUserDto.email))
      throw new CustomException(ErrorMessages.EmailIsNotInCorrectFormat);

    const userInDB = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userInDB) throw new CustomException(ErrorMessages.UserAlreadyExist);

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto
      .pbkdf2Sync(createUserDto.password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    const user = await this.userRepository.save({
      email: createUserDto.email,
      name: createUserDto.name,
      salt,
      hashedPassword,
      refreshToken: '',
    });

    const accessToken = await this.authService.generateToken({
      id: user.id,
      email: user.email,
    });

    const refreshToken = await this.authService.generateToken(
      { id: user.id, email: user.email },
      {
        secret: this.configService.get(
          EnvironmentVariables.JWT_REFRESH_SECRET_KEY,
        ),
      },
    );

    this.userRepository.save({
      id: user.id,
      refreshToken: refreshToken,
    });

    return new CreateUserResponseViewModel({
      email: user.email,
      id: user.id,
      name: user.name,
      refreshToken: refreshToken,
      accessToken: accessToken,
    });
  }

  async createWallet(
    createWalletDto: CreateWalletDto,
  ): Promise<WalletResponseViewModel> {
    const { balance, currencyId, userId } = createWalletDto;
    const wallet = await this.walletRepository.save({
      balance,
      currencyId: currencyId,
      userId: userId,
    });

    return new WalletResponseViewModel({
      balance,
      currencyId,
      id: wallet.id,
      userId,
    });
  }

  async login(loginDto: LoginDto) {
    if (!RegEx.EMAIL.test(loginDto.email))
      throw new CustomException(ErrorMessages.EmailIsNotInCorrectFormat);

    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) throw new CustomException(ErrorMessages.UserCouldNotFound);

    const hashedPassword = crypto
      .pbkdf2Sync(loginDto.password, user.salt, 1000, 64, `sha512`)
      .toString(`hex`);
    if (hashedPassword !== user.hashedPassword)
      throw new CustomException(ErrorMessages.YourPasswordIsWrong);

    const accessToken = await this.authService.generateToken({
      id: user.id,
      email: user.email,
    });

    const refreshToken = await this.authService.generateToken(
      { id: user.id, email: user.email },
      {
        secret: this.configService.get(
          EnvironmentVariables.JWT_REFRESH_SECRET_KEY,
        ),
      },
    );

    this.userRepository.save({
      id: user.id,
      lastLoginDate: new Date(),
      refreshToken,
    });

    return new LoginResponseViewModel({
      email: user.email,
      id: user.id,
      name: user.name,
      refreshToken: refreshToken,
      accessToken: accessToken,
    });
  }

  async findAll(withDeleted = false): Promise<UserResponseViewModel[]> {
    const users = await this.userRepository.find({
      withDeleted,
    });
    return this.mapSourceToTarget<User[], UserResponseViewModel>(
      users,
      UserResponseViewModel,
    ) as UserResponseViewModel[];
  }

  async findOne(
    id: string,
    withDeleted = false,
  ): Promise<UserResponseViewModel> {
    if (RegEx.GUID.test(id))
      throw new CustomException(ErrorMessages.IdIsNotInCorrectFormat);
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted,
    });
    if (!user) throw new CustomException(ErrorMessages.UserCouldNotFound);
    return this.mapSourceToTarget<User, UserResponseViewModel>(
      user,
      UserResponseViewModel,
    ) as UserResponseViewModel;
  }

  async findWallets(
    userId: string,
    withDeleted = false,
  ): Promise<WalletResponseViewModel[]> {
    const wallets = await this.walletRepository.find({
      where: { userId },
      withDeleted,
    });
    return this.mapSourceToTarget<Wallet[], WalletResponseViewModel>(
      wallets,
      WalletResponseViewModel,
    ) as WalletResponseViewModel[];
  }

  async findWallet(
    id: string,
    withDeleted = false,
  ): Promise<WalletResponseViewModel> {
    const wallet = await this.walletRepository.findOne({
      where: { id },
      withDeleted,
    });
    if (!wallet) throw new CustomException(ErrorMessages.CouldNotFound);
    return this.mapSourceToTarget<Wallet, WalletResponseViewModel>(
      wallet,
      WalletResponseViewModel,
    ) as WalletResponseViewModel;
  }

  async update(requesterUserId: string, updateUserDto: UpdateUserDto) {
    const { email: newEmail, id, name, password } = updateUserDto;
    if (!RegEx.GUID.test(id))
      throw new CustomException(ErrorMessages.IdIsNotInCorrectFormat);
    if (requesterUserId !== id)
      throw new CustomException(ErrorMessages.YouAreNotGranted);

    const userInDB = await this.userRepository.findOne({ where: { id } });
    if (!userInDB) throw new CustomException(ErrorMessages.UserCouldNotFound);
    if (userInDB && userInDB.deletedAt)
      throw new CustomException(ErrorMessages.UserIsDeleted);
    let updatedUser: Record<string, unknown> = { ...userInDB }; //{ id, name: userInDB.name };

    if (!!newEmail && userInDB.email !== newEmail) {
      const isEmailExists = await this.userRepository.findOne({
        where: { email: newEmail },
      });
      if (isEmailExists)
        throw new CustomException(ErrorMessages.EmailAlreadyExists);

      updatedUser = { ...updatedUser, email: newEmail };
    }
    if (password) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);
      updatedUser = { ...updatedUser, salt, hashedPassword };
    }

    if (!!name && userInDB.name !== name)
      updatedUser = { ...updatedUser, name };

    const user = await this.userRepository.save(updatedUser);

    return this.mapSourceToTarget<User, UserResponseViewModel>(
      user,
      UserResponseViewModel,
    ) as UserResponseViewModel;
  }

  async remove(id: string) {
    if (RegEx.GUID.test(id))
      throw new CustomException(ErrorMessages.IdIsNotInCorrectFormat);
    await this.userRepository.softDelete({ id });

    return true;
  }
}
