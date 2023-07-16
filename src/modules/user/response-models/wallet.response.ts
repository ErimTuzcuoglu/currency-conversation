import { Expose } from 'class-transformer';

export class WalletResponseViewModel {
  constructor(data?: Partial<WalletResponseViewModel>) {
    Object.assign(this, data);
  }
  @Expose()
  id: string;
  @Expose()
  balance: number;
  @Expose()
  userId: string;
  @Expose()
  currencyId: string;
}
