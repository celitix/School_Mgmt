import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({
    example: 'Arihant',
    description: 'Student Name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'class-uuid',
    description: 'Class id',
  })
  @IsString()
  classId: string;

  @ApiProperty({
    example: 'class-teacher-uuid',
    description: 'Class Teacher id',
  })
  @IsString()
  supervisorId: string;
}
