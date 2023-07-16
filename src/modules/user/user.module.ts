import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { Wallet } from '@modules/user/entities/wallet.entity';
import { User } from '@modules/user/entities/user.entity';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
})
export class UserModule {}
