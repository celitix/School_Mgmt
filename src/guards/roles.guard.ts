import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    if (!user.role || !Array.isArray(user.role)) {
      throw new ForbiddenException('Invalid user information');
    }

    const userRoleNames = user.role.map((r) => r.name);
    const userRoles = requiredRoles.some((role) =>
      userRoleNames.includes(role),
    );

    if (!userRoles) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }
    return true;
  }
}
