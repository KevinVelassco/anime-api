import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '../../modules/user/user.entity';
import { IS_ADMIN_KEY } from '../decorators/admin.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!isAdmin) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.user as User;

    return user.isAdmin;
  }
}
