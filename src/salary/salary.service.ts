import { Injectable } from '@nestjs/common';
import { CreateSalaryStructureDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdjustementType } from 'generated/prisma/enums';
import { CreateSalaryAdjustmentDto } from './dto/salary-adjusment.dto';

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

  async isSalaryProcessed(userId: string) {
    const now = new Date();

    const existingSalary = await this.prisma.salaryPayment.findFirst({
      where: {
        userId,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    });

    return !!existingSalary;
  }
  async isMonthlySalaryExist(id: string) {
    const existingSalary = await this.prisma.salaryPayment.findUnique({
      where: {
        id,
      },
    });
    return !!existingSalary;
  }
  async salaryAdjustment(
    salaryId: string,
    title: string,
    type: AdjustementType,
    amount: number,
  ) {
    return await this.prisma.salaryAdjustment.create({
      data: {
        title,
        type,
        amount,
        salaryId,
      },
    });
  }

  async getMonthlySalary(userId: string, month: number, year: number) {
    return await this.prisma.salaryPayment.findFirst({
      where: {
        userId,
        month,
        year,
      },
      include: {
        adjustments: true,
      },
    });
  }

  async addSalaryAdjustment(id: string, data: CreateSalaryAdjustmentDto) {
    
  }
  async markSalaryAsPay(id: string) {
    let allowanceTotal = 0;
    let deductionTotal = 0;

    const salary = await this.prisma.salaryPayment.findFirst({
      where: {
        id,
      },
      include: {
        adjustments: true,
      },
    });

    if (!salary) {
      return false;
    }

    for (const adjustment of salary.adjustments) {
      if (adjustment.type === AdjustementType.ALLOWANCE) {
        allowanceTotal += adjustment.amount;
      } else {
        deductionTotal += adjustment.amount;
      }
    }

    console.log('allowanceTotal', allowanceTotal);
    console.log('deductionTotal', deductionTotal);
    return true;
  }
}
