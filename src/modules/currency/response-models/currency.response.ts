import { Expose } from 'class-transformer';

export class CurrencyResponseViewModel {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  currencyCode: string;
}
