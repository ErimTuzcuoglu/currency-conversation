import { Expose } from 'class-transformer';

export class CreateUserResponseViewModel {
  constructor(data?: Partial<CreateUserResponseViewModel>) {
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
