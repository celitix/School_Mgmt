import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentGurdianDto } from './dto/create-gurdian.dto';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateStudentDto) {
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

      return await tx.student.create({
        data: {
          ...rest,
          userId: user.id,
        },
      });
    });
  }

  async isStudentExist(phone: string) {
    return await this.prisma.users.findUnique({ where: { phone } });
  }

  async isStudentExistById(id: string) {
    return await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        gurdians: {
          select: {
            gurdian: {
              select: {
                id: true,
                occupation: true,
                user: true,
                type: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where: {
          user: {
            isActive: true,
          },
        },
        select: {
          id: true,
          dob: true,
          gender: true,
          admissionNo: true,
          admissionDate: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          // gurdians: {
          //   select: {
          //     gurdian: {
          //       select: {
          //         id: true,
          //         occupation: true,
          //         user: true,
          //         type: true,
          //       },
          //     },
          //   },
          // },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc', // optional but recommended
        },
      }),
      this.prisma.student.count({
        where: {
          user: {
            isActive: true,
          },
        },
      }),
    ]);

    return {
      data: students,
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
    return await this.prisma.student.findUnique({
      where: {
        id,
        user: {
          isActive: true,
        },
      },
      include: {
        user: true,
        gurdians: {
          select: {
            gurdian: {
              select: {
                id: true,
                occupation: true,
                user: true,
              },
            },
          },
        },
      },
    });
  }

  // async update(id: string, updateStudentDto: UpdateStudentDto) {
  //   return await this.prisma.student.update({
  //     where: {
  //       id,
  //     },
  //     data: updateStudentDto,
  //   });
  // }

  async update(id: string, dto: UpdateStudentDto) {
    const { name, phone, address, email, ...studentData } = dto;
    const userData: any = {};
    if (name !== undefined) userData.name = name;
    if (phone !== undefined) userData.phone = phone;
    if (address !== undefined) userData.address = address;
    if (email !== undefined) userData.email = email;

    return await this.prisma.$transaction(async (tx) => {
      const { academicYearId, sectionId, ...restStudentData } = studentData;

      const student = await tx.student.update({
        where: { id },
        data: {
          ...restStudentData,

          ...(academicYearId && {
            academicYear: {
              connect: { id: academicYearId },
            },
          }),

          ...(sectionId && {
            section: {
              connect: { id: sectionId },
            },
          }),
        },
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
        isActive: false,
        leftAt: new Date(),
      },
    });
  }

  async createGurdian(data: CreateStudentGurdianDto) {
    const { name, phone, address, email, ...rest } = data;
    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          name,
          phone,
          address,
          email,
          roleId: 4,
        },
      });

      const gurdians = await tx.gurdians.create({
        data: {
          occupation: rest.occupation,
          userId: user.id,
          type: rest.type,
        },
      });
      return await tx.studentGurdians.create({
        data: {
          studentId: rest.studentId,
          gurdianId: gurdians.id,
        },
      });
    });
  }
}
