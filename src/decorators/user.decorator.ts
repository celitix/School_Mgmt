import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IUserTokenInfo } from '../interfaces/user.interfaces';

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext): IUserTokenInfo => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request['user'] as IUserTokenInfo;
    return user;
  },
);
