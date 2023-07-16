import { Expose } from 'class-transformer';

export class OfferResponseViewModel {
  @Expose()
  rateId: string;

  @Expose()
  sourceCurrencyName: string;

  @Expose()
  targetCurrencyName: string;

  @Expose()
  sourceCurrencyCode: string;

  @Expose()
  targetCurrencyCode: string;

  @Expose()
  price: number;

  @Expose()
  validUntil: string;
}
