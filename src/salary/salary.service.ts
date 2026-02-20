import { Injectable } from '@nestjs/common';
import { CreateSalaryStructureDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SalaryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateSalaryStructureDto) {
    return await this.prisma.salaryStructure.create({
      data,
    });
  }

  findAll() {
    return `This action returns all salary`;
  }

  async findOne(userId: string) {
    return await this.prisma.salaryStructure.findMany({
      where: { userId },
    });
  }

  async update(id: string, data: UpdateSalaryDto) {
    const { userId, ...rest } = data;
    return await this.prisma.salaryStructure.update({
      where: { id },
      data: {
        ...rest,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.salaryStructure.delete({ where: { id } });
  }

  async isUserExist(userId: string) {
    return await this.prisma.users.findUnique({ where: { id: userId } });
  }

  async isIdExist(id: string) {
    return await this.prisma.salaryStructure.findUnique({ where: { id } });
  }
}
