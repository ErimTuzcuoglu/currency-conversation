import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EnvironmentModule } from '@config/environment/environment.module';
import { UserModule } from '@modules/user/user.module';
import { DatabaseModule } from '@persistence/database.module';
import { AuthModule } from '@modules/auth/auth.module';
import { JWTAuthGuard } from '@modules/auth/JWTAuthGuard';
import { CurrencyModule } from '@modules/currency/currency.module';
import { OfferModule } from '@modules/offer/offer.module';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    EnvironmentModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    CurrencyModule,
    OfferModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard,
    },
  ],
})
export class AppModule {}
