import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { verifyToken } from 'helpers/authUtils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const cookieToken = request.signedCookies?.ACCESS_TOKEN;

    const token =
      cookieToken ||
      (authHeader && authHeader.startsWith('Bearer')
        ? authHeader.split(' ')[1]
        : null);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    let decodedToken: any;
    try {
      decodedToken = verifyToken(token, this.configService.get('jwt.secret')!);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      throw new UnauthorizedException('Authentication failed');
    }

    if (!decodedToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.prisma.users.findUnique({
      where: { id: decodedToken.id },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    decodedToken.role = [user.role];
    request.user = decodedToken;

    return true;
  }
}
