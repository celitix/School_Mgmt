import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { WeekDay } from 'generated/prisma/enums';

export class CreateTimeSlotDto {
  @ApiProperty({
    example: 'Period 1',
    description: 'Period Name',
  })
  @IsString()
  label: string;

  @ApiProperty({
    example: '09:00 AM',
    description: 'Period Start Time',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    example: '09:45 AM',
    description: 'Period End Time',
  })
  @IsString()
  endTime: string;
}

export class CreateTimetableDto {
  @ApiProperty({
    example: 'class-uuid',
    description: 'Class id',
  })
  @IsString()
  classId: string;

  @ApiProperty({
    example: 'section-uuid',
    description: 'Section id',
  })
  @IsString()
  sectionId: string;

  @ApiProperty({
    example: 'subject-uuid',
    description: 'Subject id',
  })
  @IsString()
  subjectId: string;

  @ApiProperty({
    example: 'teacher-uuid',
    description: 'Teacher id',
  })
  @IsString()
  teacherId: string;

  @ApiProperty({
    example: WeekDay.MONDAY,
    description: 'Day of week',
    enum: WeekDay,
  })
  @IsEnum(WeekDay)
  dayOfWeek: WeekDay;

  @ApiProperty({
    example: 'timeslot-uuid',
    description: 'Time slot id',
  })
  @IsString()
  timeSlotId: string;
}
