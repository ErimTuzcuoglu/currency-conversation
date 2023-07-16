import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from '@modules/offer/entities/offer.entity';
import { OfferController } from '@modules/offer/offer.controller';
import { OfferService } from '@modules/offer/offer.service';
import { AuthModule } from 'modules/auth/auth.module';
import { Rate } from '@modules/currency/entities/rate.entity';
import { Wallet } from '@modules/user/entities/wallet.entity';

@Module({
  controllers: [OfferController],
  providers: [OfferService],
  imports: [
    TypeOrmModule.forFeature([Rate]),
    TypeOrmModule.forFeature([Wallet]),
    TypeOrmModule.forFeature([Offer]),
    AuthModule,
  ],
})
export class OfferModule {}
