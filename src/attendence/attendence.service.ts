import { Injectable } from '@nestjs/common';
import { CreateAttendenceDto } from './dto/create-attendence.dto';
import { UpdateAttendenceDto } from './dto/update-attendence.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttendenceService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateAttendenceDto) {
    return await this.prisma.attendance.create({ data });
  }

  async findAll(
    startDate: Date,
    endDate: Date,
    classId: string,
    sectionId: string,
    studentId: string,
  ) {
    let where: any = {};

    if (classId) where.classId = classId;
    if (sectionId) where.sectionId = sectionId;
    if (studentId) where.studentId = studentId;

    if (startDate || endDate) {
      where.date = {};

      if (startDate) {
        where.date.gte = startDate;
      }

      if (endDate) {
        where.date.lte = endDate;
      }
    }

    return await this.prisma.attendance.findMany({
      where,
      include: {},
      orderBy: { date: 'asc' },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} attendence`;
  }

  update(id: string, data: UpdateAttendenceDto) {
    return `This action updates a #${id} attendence`;
  }

  remove(id: string) {
    return `This action removes a #${id} attendence`;
  }

  async isStudentExist(studentId: string) {
    return await this.prisma.student.findUnique({ where: { id: studentId } });
  }

  async isClassExist(classId: string) {
    return await this.prisma.class.findUnique({ where: { id: classId } });
  }

  async isSectionExist(sectionId: string) {
    return await this.prisma.section.findUnique({ where: { id: sectionId } });
  }

  async isAttendenceMarkforDate(
    classId: string,
    sectionId: string,
    date: string,
  ) {
    return await this.prisma.attendance.findFirst({
      where: { classId, sectionId, date: new Date(date) },
    });
  }
}
