import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentGurdianDto } from './dto/create-gurdian.dto';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateStudentDto) {
    const { name, address, email, ...rest } = data;
    return await this.prisma.$transaction(async (tx) => {
      // const isPhoneExist = await this.prisma.account.findUnique({
      //   where: {
      //     phone,
      //   },
      // });
      // let accountId: string;

      // if (isPhoneExist) {
      //   accountId = isPhoneExist.id;
      // } else {
      //   const account = await tx.account.create({
      //     data: {
      //       phone,
      //     },
      //   });
      //   accountId = account.id;
      // }
      const user = await tx.users.create({
        data: {
          name,
          // accountId,
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
    return await this.prisma.account.findUnique({ where: { phone } });
  }

  async isStudentExistById(id: string) {
    return await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            account: {
              select: {
                phone: true,
              },
            },
          },
        },
        gurdians: {
          select: {
            id: true,
            isPrimary: true,
            gurdian: {
              select: {
                id: true,
                occupation: true,
                type: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    address: true,
                    leftAt: true,
                  },
                },
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
            leftAt: null,
          },
        },
        select: {
          id: true,
          dob: true,
          gender: true,
          admissionNo: true,
          admissionDate: true,
          academicYear: {
            select: {
              fromYear: true,
              toYear: true,
            },
          },
          section: {
            select: {
              name: true,
              class: {
                select: {
                  name: true,
                },
              },
            },
          },
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
            leftAt: null,
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
          leftAt: null,
        },
      },
      include: {
        user: true,
        academicYear: {
          select: {
            id: true,
            fromYear: true,
            toYear: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
            class: {
              select: {
                name: true,
              },
            },
          },
        },
        gurdians: {
          select: {
            id: true,
            isPrimary: true,
            gurdian: {
              select: {
                id: true,
                occupation: true,
                type: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    address: true,
                    leftAt: true,
                    account: {
                      select: {
                        phone: true,
                      },
                    },
                  },
                },
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
    const { name, address, email, ...studentData } = dto;
    const userData: any = {};
    if (name !== undefined) userData.name = name;
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
          select: {
            accountId: true,
          },
        });
      }

      return student;
    });
  }
  async remove(id: string) {
    return await this.prisma.$transaction(async (tx) => {
      // await tx.account.update({
      //   where: { userId: id },
      //   data: {
      //     isActive: false,
      //   },
      // })
      return await tx.users.update({
        where: { id },
        data: {
          leftAt: new Date(),
        },
      });
    });
  }

  async createGurdian(data: CreateStudentGurdianDto) {
    const { name, phone, address, email, isPrimary, ...rest } = data;
    return await this.prisma.$transaction(async (tx) => {
      const isPhoneExist = await this.prisma.account.findUnique({
        where: {
          phone,
        },
      });
      let accountId: string;

      if (isPhoneExist) {
        accountId = isPhoneExist.id;
      } else {
        const account = await tx.account.create({
          data: {
            phone,
          },
        });
        accountId = account.id;
      }
      const user = await tx.users.create({
        data: {
          name,
          accountId,
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

      await tx.studentGurdians.updateMany({
        where: {
          studentId: rest.studentId,
        },
        data: {
          isPrimary: false,
        },
      });
      return await tx.studentGurdians.create({
        data: {
          studentId: rest.studentId,
          gurdianId: gurdians.id,
          isPrimary,
        },
      });
    });
  }

  async isStudentGurdianTypeExist(studentId: string, type: string) {
    return await this.prisma.studentGurdians.findFirst({
      where: {
        studentId,
        gurdian: {
          type,
        },
      },
    });
  }
}
