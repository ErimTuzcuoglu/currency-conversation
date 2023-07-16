import { Expose } from 'class-transformer';

export class LoginResponseViewModel {
  constructor(data?: Partial<LoginResponseViewModel>) {
    Object.assign(this, data);
  }

  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
