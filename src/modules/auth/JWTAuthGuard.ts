import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Decorator } from '@modules/common';
import { AuthService } from '@modules/auth/auth.service';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      Decorator.allowUnauthorizedRequest,
      context.getHandler(),
    );
    return (
      allowUnauthorizedRequest ||
      this.authService.validateUser(request.headers?.authorization)
    );
  }
}
