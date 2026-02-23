import { Injectable } from '@nestjs/common';
import { SendOtpDto } from './dto/auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { otpExpiry } from 'helpers/authUtils';
import { Prisma, Users } from 'generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async isPhoneExist(phone: string) {
    return await this.prisma.account.findFirst({
      where: {
        phone,
        isActive: true,
      },
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

  async isOtpExist(otpId: string, phone: string) {
    return await this.prisma.otp.findUnique({
      where: { id: otpId, phone },
    });
  }

  async addAttempt(otpId: string) {
    return await this.prisma.otp.update({
      where: { id: otpId },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
  }

  async findUser(phone: string) {
    return await this.prisma.account.findUnique({
      where: { phone },
      include: {
        users: {
          where: { leftAt: null },
          select: {
            id: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findAccountWithUsers(phone: string) {
    return await this.prisma.account.findUnique({
      where: { phone },
      include: {
        users: {
          where: { leftAt: null },
          select: {
            id: true,
            name: true,
            role: {
              select: { name: true },
            },
          },
        },
      },
    });
  }

  async createUser(data: any) {
    const { phone, ...rest } = data;
    return await this.prisma.$transaction(async (tx) => {
      const account = await tx.account.create({ data: { phone } });
      return await tx.users.create({
        data: {
          ...rest,
          accountId: account.id,
        },
      });
    });
  }

  async seedRoles(data: string[]) {
    const rolePromises = data.map((roleName) =>
      this.prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: {
          name: roleName,
        },
      }),
    );

    try {
      await Promise.all(rolePromises);
      return true;
    } catch (error) {
      console.error('❌ Error seeding roles:', error);
      return false;
    }
  }
}
