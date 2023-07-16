import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BaseService,
  CustomException,
  ErrorMessages,
  RegEx,
} from '@modules/common';
import { CreateOfferDto } from '@modules/offer/dto/create-offer.dto';
import { Offer } from '@modules/offer/entities/offer.entity';
import { OfferResponseViewModel } from '@modules/offer/response-models/offer.response';
import { Rate } from '@modules/currency/entities/rate.entity';
import { Wallet } from '@modules/user/entities/wallet.entity';
import { WalletResponseViewModel } from '@modules/user/response-models/wallet.response';

@Injectable()
export class OfferService extends BaseService {
  constructor(
    @InjectRepository(Rate) private rateRepository: Repository<Rate>,
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
  ) {
    super();
  }
  async createOffer(
    createOfferDto: CreateOfferDto,
    userId: string,
  ): Promise<OfferResponseViewModel> {
    const { deposit, sourceId, targetId } = createOfferDto;
    const rate = await this.rateRepository.findOneBy({
      sourceId,
      targetId,
    });

    const offer = await this.offerRepository.save({
      price: deposit / (rate.ratePrice + rate.markupRatePrice),
      rateId: rate.id,
      userId: userId,
      rate,
      validUntil: new Date(new Date().getTime() + 3 * 60000).toISOString(),
    });
    const response: OfferResponseViewModel = new OfferResponseViewModel();
    response.rateId = rate.id;
    response.sourceCurrencyCode = rate.source.currencyCode;
    response.sourceCurrencyName = rate.source.name;
    response.targetCurrencyCode = rate.target.currencyCode;
    response.targetCurrencyName = rate.target.name;
    response.price = offer.price;
    response.validUntil = offer.validUntil;
    return response;
  }

  async acceptOffer(
    offerId: string,
    userId: string,
  ): Promise<WalletResponseViewModel> {
    const offer = await this.offerRepository.findOneBy({ id: offerId });
    if (!offer) throw new CustomException(ErrorMessages.CouldNotFound);
    if (offer.userId !== userId)
      throw new CustomException(ErrorMessages.CouldNotFound);

    await this.offerRepository.save({
      id: offerId,
      isAccepted: true,
    });

    const newWallet = await this.walletRepository.save({
      userId: offer.userId,
      balance: offer.price,
      currencyId: offer.rate.targetId,
    });

    return this.mapSourceToTarget<Wallet, WalletResponseViewModel>(
      newWallet,
      WalletResponseViewModel,
    ) as WalletResponseViewModel;
  }

  async findAll(withDeleted = false) {
    const offers = await this.offerRepository.find({ withDeleted });
    return this.mapSourceToTarget<Offer[], OfferResponseViewModel>(
      offers,
      OfferResponseViewModel,
    ) as OfferResponseViewModel[];
  }

  async findOne(id: string, withDeleted = false) {
    const offer = await this.offerRepository.findOne({
      where: { id },
      withDeleted,
    });
    if (!offer) throw new CustomException(ErrorMessages.CouldNotFound);
    return this.mapSourceToTarget<Offer, OfferResponseViewModel>(
      offer,
      OfferResponseViewModel,
    ) as OfferResponseViewModel;
  }

  async remove(id: string) {
    if (RegEx.GUID.test(id))
      throw new CustomException(ErrorMessages.IdIsNotInCorrectFormat);
    this.offerRepository.softDelete({ id });
    return true;
  }
}
