import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { EnvironmentVariables } from '@config/environment/EnvironmentVariables';
import { Environments } from '@config/environment/Environments';
import { AllowUnauthorizedRequest } from '@modules/auth/decorator/AllowUnauthorizedRequest';

@Controller()
export class AppController {
  @Get()
  @AllowUnauthorizedRequest()
  home(@Res() res: Response) {
    if (
      process.env[EnvironmentVariables.NODE_ENV] === Environments.development
    ) {
      return res.redirect('/swagger');
    }
    return res.send('Hello');
  }
}
