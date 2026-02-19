import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    example: 'Maths',
    description: 'Student Name',
  })
  @IsString()
  name: string;
}

export class AssignSubjectToClassDto {
  @ApiProperty({
    example: 'class-uuid',
    description: 'Class id',
  })
  @IsString()
  classId: string;

  @ApiProperty({
    example: 'subject-uuid',
    description: 'Subject id',
  })
  @IsString()
  subjectId: string;
}
