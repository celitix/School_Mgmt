import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSalaryStructureDto } from './dto/create-salary-structure.dto';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateTeacherDto) {
    const { name, phone, address, email, ...rest } = data;
    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          name,
          phone,
          address,
          email,
          roleId: 3,
        },
      });

      return await tx.teachers.create({
        data: {
          ...rest,
          userId: user.id,
        },
      });
    });
  }

  async isTeacherExist(phone: string) {
    return await this.prisma.users.findUnique({ where: { phone } });
  }
  async isTeacherExistById(id: string) {
    return await this.prisma.teachers.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [teachers, total] = await Promise.all([
      this.prisma.teachers.findMany({
        include: {
          user: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc', // optional but recommended
        },
      }),
      this.prisma.teachers.count(),
    ]);

    return {
      data: teachers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    return await this.prisma.teachers.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  async remove(id: string) {
    return await this.prisma.users.delete({ where: { id } });
  }

  async createSalaryStructure(data: CreateSalaryStructureDto) {
    return await this.prisma.salaryStructure.create({
      data,
    });
  }

  async getTeacherSalaryStructure(userId: string) {
    return await this.prisma.salaryStructure.findMany({
      where: { userId },
    });
  }

  async isUserExist(userId: string) {
    return await this.prisma.users.findUnique({ where: { id: userId } });
  }
}
