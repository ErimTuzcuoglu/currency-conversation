import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTStrategy } from '@modules/auth/JWTStrategy';
import { AuthService } from '@modules/auth/auth.service';
import { User } from '@modules/user/entities/user.entity';
import { EnvironmentVariables } from '@config/environment/EnvironmentVariables';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(EnvironmentVariables.JWT_SECRET_KEY),
        signOptions: {
          expiresIn: `${configService.get(
            EnvironmentVariables.JWT_EXPIRATION_TIME,
          )} s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JWTStrategy],
  exports: [AuthService],
})
export class AuthModule {}
