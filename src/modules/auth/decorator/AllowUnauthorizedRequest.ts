import { SetMetadata } from '@nestjs/common';
import { Decorator } from '@modules/common';

export const AllowUnauthorizedRequest = () =>
  SetMetadata(Decorator.allowUnauthorizedRequest, true);
