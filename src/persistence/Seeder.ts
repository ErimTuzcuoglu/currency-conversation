import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as crypto from 'crypto';
import { User } from '@modules/user/entities/user.entity';
import { EnvironmentVariables } from '@config/environment/EnvironmentVariables';

export class Seeder {
  constructor(private readonly configService: ConfigService) {}
  dataSource: DataSource | undefined;

  async seedAll() {
    await this.users()
      .then((completed) => {
        Logger.debug('Successfuly completed seeding users...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        Logger.error('Failed seeding users...');
        Promise.reject(error);
      });

    await this.dataSource.destroy();
  }

  async createConnection() {
    this.dataSource = await new DataSource(
      this.configService.get('database'),
    ).initialize();
  }

  async users() {
    if (!this.dataSource) await this.createConnection();

    const userRepository = this.dataSource.manager.getRepository(User);

    const users = await userRepository.find();
    if (users !== undefined && users.length > 0) return;

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto
      .pbkdf2Sync(
        this.configService.get(EnvironmentVariables.SEED_USER_PASSWORD),
        salt,
        1000,
        64,
        `sha512`,
      )
      .toString(`hex`);

    const user = userRepository.save({
      email: this.configService.get(EnvironmentVariables.SEED_USER_MAIL),
      name: this.configService.get(EnvironmentVariables.SEED_USER_NAME),
      salt,
      hashedPassword,
      refreshToken: '',
    });

    return await Promise.all([user])
      .then((createdUser) => {
        // Can also use logger.verbose('...');
        Logger.debug('Master User Created');
        return Promise.resolve(true);
      })
      .catch((error) => Promise.reject(error));
  }
}
