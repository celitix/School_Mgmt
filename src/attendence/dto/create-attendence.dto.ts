import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString } from 'class-validator';
import { AttendanceStatus } from 'generated/prisma/enums';

export class CreateAttendenceDto {
  @ApiProperty({
    example: 'student-uuid',
    description: 'Student id',
  })
  @IsString()
  studentId: string;

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
    example: '2024-04-01T00:00:00.000Z',
    description: 'Date',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: AttendanceStatus.PRESENT,
    description: 'Status',
    enum: AttendanceStatus,
  })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({
    example: 'Remarks',
    description: 'Remarks',
    required: false,
  })
  @IsString()
  remarks: string;
}
