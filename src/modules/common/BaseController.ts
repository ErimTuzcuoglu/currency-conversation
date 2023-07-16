import { Controller } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@modules/auth/auth.service';

@Controller()
export class BaseController {
  constructor(private _authService: AuthService) {}
  private decodeToken(token: string) {
    return this._authService.verifyToken(token?.replace('Bearer ', ''));
  }
  getUserId(request: Request): string {
    return this.decodeToken(request.headers.authorization).id as string;
  }
  getUserEmail(request: Request): string {
    return this.decodeToken(request.headers.authorization).email as string;
  }
}
