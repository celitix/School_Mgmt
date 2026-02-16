import { Injectable } from '@nestjs/common';
import { SendOtpDto } from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { otpExpiry } from 'helpers/authUtils';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async isPhoneExist(phone: string) {
    return await this.prisma.users.findUnique({
      where: { phone },
    });
  }

  async saveOtp(otp: string, phone: string) {
    const expiresAt = otpExpiry(5);
    return await this.prisma.otp.create({
      data: {
        otp,
        phone,
        expiresAt,
      },
    });
  }
}
