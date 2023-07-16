import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
/* #region Local Imports */
import { CreateUserDto } from '@modules/user/dto/create-user.dto';
import { LoginDto } from '@modules/user/dto/login.dto';
import { UpdateUserDto } from '@modules/user/dto/update-user.dto';
import { UserService } from '@modules/user/user.service';
import { BaseController } from '@modules/common/BaseController';
import { AllowUnauthorizedRequest } from '@modules/auth/decorator/AllowUnauthorizedRequest';
import { AuthService } from '@modules/auth/auth.service';
/* #endregion */

@ApiTags('User')
@Controller('user')
export class UserController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super(authService);
  }

  @ApiBearerAuth('jwt')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth('jwt')
  @Get()
  findAll(
    @Query('withDeleted', {
      transform(value, metadata) {
        return value && value !== 'false';
      },
    })
    withDeleted?: boolean,
  ) {
    return this.userService.findAll(withDeleted);
  }

  @ApiBearerAuth('jwt')
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('withDeleted') withDeleted?: boolean,
  ) {
    return this.userService.findOne(id, withDeleted);
  }

  @ApiBearerAuth('jwt')
  @Get('wallets')
  findWallets(
    @Req() request: Request,
    @Query('withDeleted') withDeleted?: boolean,
  ) {
    return this.userService.findWallets(this.getUserId(request), withDeleted);
  }

  @ApiBearerAuth('jwt')
  @Get('wallet/:id')
  findWallet(
    @Param('id') id: string,
    @Query('withDeleted') withDeleted?: boolean,
  ) {
    return this.userService.findWallet(id, withDeleted);
  }

  @AllowUnauthorizedRequest()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @ApiBearerAuth('jwt')
  @Put()
  update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(this.getUserId(request), updateUserDto);
  }

  @ApiBearerAuth('jwt')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
