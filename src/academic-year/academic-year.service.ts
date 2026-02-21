import { Injectable } from '@nestjs/common';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AcademicYearService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAcademicYearDto) {
    return await this.prisma.academicYear.create({ data });
  }

  async findAll() {
    return await this.prisma.academicYear.findMany();
  }

  async findOne(id: number) {
    return `This action returns a #${id} academicYear`;
  }

  async update(id: string, data: UpdateAcademicYearDto) {
    return await this.prisma.academicYear.update({ where: { id }, data });
  }

  async remove(id: string) {
    return await this.prisma.academicYear.delete({ where: { id } });
  }

  async isAcademicYearExistById(id: string) {
    return await this.prisma.academicYear.findUnique({ where: { id } });
  }

  async isAcademicYearExist(from: string, to: string) {
    return await this.prisma.academicYear.findUnique({
      where: {
        fromYear_toYear: { fromYear: from, toYear: to },
      },
    });
  }
}
