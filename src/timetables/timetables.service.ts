import { Injectable } from '@nestjs/common';
import {
  CreateTimeSlotDto,
  CreateTimetableDto,
} from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WeekDay } from 'generated/prisma/enums';
import { TeachersService } from 'src/teachers/teachers.service';
import { ClassAndSectionsService } from 'src/class-and-sections/class-and-sections.service';

@Injectable()
export class TimetablesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teachersService: TeachersService,
    private readonly classService: ClassAndSectionsService,
  ) {}
  async createTimeSlot(data: CreateTimeSlotDto) {
    return await this.prisma.timeSlot.create({ data });
  }
  async createTimeTable(data: CreateTimetableDto) {
    return await this.prisma.timetable.create({ data });
  }

  async findAllTimeSlots(page: number = 1, limit: number = 10) {
    return await this.prisma.timeSlot.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOneTimeSlots(id: string) {
    return await this.prisma.timeSlot.findUnique({ where: { id } });
  }

  async findAllTimeTables(
    page: number = 1,
    limit: number = 10,
    classId: string,
  ) {
    const [data, total] = await Promise.all([
      this.prisma.timetable.findMany({
        where: {
          classId,
        },
        include: {
          timeSlot: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.timetable.count({
        where: {
          classId,
        },
      }),
    ]);

    return {
      data,
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

  async findOneTimeTable(id: string) {
    return await this.prisma.timetable.findUnique({
      where: { id },
      include: {
        timeSlot: true,
      },
    });
  }

  async update(id: string, data: UpdateTimetableDto) {
    return `This action updates a #${id} timetable`;
  }

  async remove(id: string) {
    return `This action removes a #${id} timetable`;
  }

  async isTeacherAssignedTheTimeSlot(
    dayOfWeek: WeekDay,
    teacherId: string,
    timeSlotId: string,
  ) {
    return await this.prisma.timetable.findUnique({
      where: {
        teacherId_dayOfWeek_timeSlotId: {
          dayOfWeek,
          teacherId,
          timeSlotId,
        },
      },
    });
  }

  async isTeacherAssignedClass(
    sectionId: string,
    timeSlotId: string,
    classId: string,
    dayOfWeek: WeekDay,
  ) {
    return await this.prisma.timetable.findUnique({
      where: {
        classId_sectionId_dayOfWeek_timeSlotId: {
          dayOfWeek,
          sectionId,
          classId,
          timeSlotId,
        },
      },
    });
  }

  async isTeacherExist(teacherId: string) {
    return await this.teachersService.isTeacherExistById(teacherId);
  }

  async isClassExist(classId: string) {
    return await this.classService.isClassExist(classId);
  }

  async isSectionExist(classId: string, sectionId: string) {
    return await this.classService.isSectionExist(classId, sectionId);
  }
}
