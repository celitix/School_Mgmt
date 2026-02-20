import { Injectable } from '@nestjs/common';
import { CreateSalaryStructureDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SalaryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateSalaryStructureDto) {
    return await this.prisma.$transaction(async (tx) => {
      await tx.salaryStructure.updateMany({
        where: {
          userId: data.userId,
          effectiveTo: null,
        },
        data: {
          effectiveTo: new Date(data.effectiveFrom),
        },
      });

      const structure = await tx.salaryStructure.create({
        data,
      });

      return structure;
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

  async processMontlySalary(userId: string) {
    const now = new Date();

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const salaryStructure = await this.prisma.salaryStructure.findFirst({
      where: {
        userId,
        effectiveFrom: {
          lte: monthEnd,
        },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: monthStart } }],
      },
      orderBy: {
        effectiveFrom: 'desc',
      },
    });

    const grossSalary =
      salaryStructure?.basicSalary! +
      (salaryStructure?.hra || 0) +
      (salaryStructure?.allowance || 0);

    const fixedDeductions =
      (salaryStructure?.pf || 0) +
      (salaryStructure?.esi || 0) +
      (salaryStructure?.professionalTax || 0);

    const netSalary = grossSalary - fixedDeductions;
    console.log('grossSalary', netSalary);

    return await this.prisma.salaryPayment.create({
      data: {
        userId,
        salaryStructureId: salaryStructure?.id!,
        grossSalary,
        fixedDeductions,
        netSalary,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        basic: salaryStructure?.basicSalary!,
        hra: salaryStructure?.hra,
        allowance: salaryStructure?.allowance,
      },
    });
  }
}
