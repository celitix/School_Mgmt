import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
          sectionId: '',
          academicYearId: '',
          userId: user.id,
        },
      });
    });
  }

  async isStudentExist(phone: string) {
    return await this.prisma.users.findUnique({ where: { phone } });
  }

  async findAll() {
    return await this.prisma.student.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    return await this.prisma.student.update({
      where: {
        id,
      },
      data: updateStudentDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.users.delete({ where: { id } });
  }
}
