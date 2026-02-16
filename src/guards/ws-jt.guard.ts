// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { verifyJwt } from 'src/utils/functions';

// @Injectable()
// export class WsJwtGuard implements CanActivate {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly prismaService: PrismaService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const client = context.switchToWs().getClient();
//     const handshake = client.handshake;
//     const jwtSecret = this.configService.getOrThrow<string>('jwt.secret');

//     // If frontend sent it via `auth.token`, make it look like a header
//     if (handshake?.auth?.token && !handshake.headers?.authorization) {
//       handshake.headers = handshake.headers || {};
//       handshake.headers.authorization = `Bearer ${handshake.auth.token}`;
//     }

//     // 🔹 Extract token from all potential sources
//     const token =
//       handshake?.auth?.token ||
//       handshake?.query?.token ||
//       (handshake?.headers?.authorization?.startsWith('Bearer ')
//         ? handshake.headers.authorization.split(' ')[1]
//         : undefined) ||
//       handshake?.headers?.cookie
//         ?.split('; ')
//         ?.find((c) => c.startsWith('access_token='))
//         ?.split('=')[1]
//         ?.replace(/^s%3A/, '')
//         ?.split('.')[0];

//     if (!token) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     try {
//       const decodedToken = verifyJwt(token, jwtSecret);
//       const user = await this.prismaService.user.findUnique({
//         where: { id: decodedToken.id },
//         include: { connections: true, settings: true, profile: true },
//       });

//       if (!user) {
//         throw new UnauthorizedException('Invalid token');
//       }
//       decodedToken.role = [user.role];
//       client.user = decodedToken;
//       return true;
//     } catch (error) {
//       if (error.name === 'TokenExpiredError') {
//         throw new UnauthorizedException('Token expired');
//       }
//       throw new UnauthorizedException('Invalid token');
//     }
//   }
// }
