import { Expose } from 'class-transformer';

export class UserResponseViewModel {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;
}
