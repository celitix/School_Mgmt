import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateTeacherDto) {
    const { name, phone, address, email, ...rest } = data;
    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          name,
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
    return await this.prisma.account.findUnique({ where: { phone } });
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
        where: {
          user: {
            leftAt: null,
          },
        },
        select: {
          id: true,
          enrollmentNo: true,
          joiningDate: true,
          exoperience: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              account: {
                select: {
                  phone: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc', // optional but recommended
        },
      }),
      this.prisma.teachers.count({
        where: {
          user: {
            leftAt: null,
          },
        },
      }),
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
        user: {
          leftAt: null,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: string, data: UpdateTeacherDto) {
    const { name, phone, address, email, ...teacher } = data;

    const userData: any = {};
    if (name !== undefined) userData.name = name;
    if (phone !== undefined) userData.phone = phone;
    if (address !== undefined) userData.address = address;
    if (email !== undefined) userData.email = email;

    return await this.prisma.$transaction(async (tx) => {
      const student = await tx.teachers.update({
        where: { id },
        data: teacher,
      });

      if (Object.keys(userData).length > 0) {
        await tx.users.update({
          where: { id: student.userId },
          data: userData,
        });
      }
      return student;
    });
  }

  async remove(id: string) {
    return await this.prisma.users.update({
      where: { id },
      data: {
        leftAt: new Date(),
      },
    });
  }

  // async createSalaryStructure(data: CreateSalaryStructureDto) {
  //   return await this.prisma.salaryStructure.create({
  //     data,
  //   });
  // }

  // async getTeacherSalaryStructure(userId: string) {
  //   return await this.prisma.salaryStructure.findMany({
  //     where: { userId },
  //   });
  // }

  async isUserExist(userId: string) {
    return await this.prisma.users.findUnique({ where: { id: userId } });
  }

  async isSectionExist(sectionId: string) {
    return await this.prisma.section.findUnique({ where: { id: sectionId } });
  }
  async assignTeacherToSection(teacherId: string, sectionId: string) {
    return await this.prisma.section.update({
      where: { id: sectionId },
      data: {
        supervisorId: teacherId,
      },
    });
  }
}
