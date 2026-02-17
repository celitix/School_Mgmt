import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateClassDto } from './dto/update-class.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class ClassAndSectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createClass(data: CreateClassDto) {
    return await this.prisma.class.create({ data });
  }

  async createSection(data: CreateSectionDto) {
    return await this.prisma.section.create({ data });
  }

  async isClassExist(name: string) {
    return await this.prisma.class.findUnique({ where: { name } });
  }

  async isSectionExist(name: string, classId: string) {
    return await this.prisma.section.findUnique({
      where: {
        section_unique_2: {
          name,
          classId,
        },
      },
    });
  }

  async getAllClass() {
    return await this.prisma.class.findMany();
  }

  async getAllSections(classId: string) {
    return this.prisma.section.findMany({ where: { classId } });
  }

  async findStudentsInSection(id: string) {
    return this.prisma.section.findMany({
      where: { id },
      include: {
        class: true,
        students: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async updateClass(id: string, data: UpdateClassDto) {
    return await this.prisma.class.update({
      where: { id },
      data,
    });
  }

  async updateSection(id: string, data: UpdateSectionDto) {
    return await this.prisma.section.update({
      where: { id },
      data,
    });
  }
}
