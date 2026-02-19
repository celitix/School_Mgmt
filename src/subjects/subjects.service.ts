import { Injectable } from '@nestjs/common';
import {
  AssignSubjectToClassDto,
  CreateSubjectDto,
} from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubject(data: CreateSubjectDto) {
    return await this.prisma.subjects.create({ data });
  }

  async toggleSubjectAssignment(data: AssignSubjectToClassDto) {
    return await this.prisma.$transaction(async (tx) => {
      const existing = await tx.classSubject.findUnique({
        where: {
          classId_subjectId: {
            classId: data.classId,
            subjectId: data.subjectId,
          },
        },
      });

      if (existing) {
        await tx.classSubject.delete({
          where: {
            classId_subjectId: {
              classId: data.classId,
              subjectId: data.subjectId,
            },
          },
        });

        return {
          isSuccess: true,
          message: 'Subject unassigned successfully',
        };
      }

      await tx.classSubject.create({
        data: {
          classId: data.classId,
          subjectId: data.subjectId,
        },
      });

      return {
        isSuccess: true,
        message: 'Subject assigned successfully',
      };
    });
  }

  async findAllSubjects(classId: string) {
    return await this.prisma.classSubject.findMany({
      where: {
        classId,
      },
      select: {
        id: true,
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.subjects.findUnique({ where: { id } });
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    return await this.prisma.subjects.update({
      where: {
        id,
      },
      data: updateSubjectDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.subjects.delete({ where: { id } });
  }

  async isSubjectExist(name: string) {
    return await this.prisma.subjects.findUnique({
      where: {
        name,
      },
    });
  }
}
