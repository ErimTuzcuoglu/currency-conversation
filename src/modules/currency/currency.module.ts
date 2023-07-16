import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Currency } from '@modules/currency/entities/currency.entity';
import { CurrencyController } from '@modules/currency/currency.controller';
import { CurrencyService } from '@modules/currency/currency.service';
import { Rate } from '@modules/currency/entities/rate.entity';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService],
  imports: [
    TypeOrmModule.forFeature([Currency]),
    TypeOrmModule.forFeature([Rate]),
    AuthModule,
  ],
})
export class CurrencyModule {}
