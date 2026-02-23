import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    example: 'Arihant',
    description: 'Student Name',
  })
  @IsString()
  name: string;

  // @ApiProperty({
  //   example: '96XXXXXXXX',
  //   description: 'phone',
  // })
  // @IsString()
  // phone: string;

  @ApiProperty({
    example: 'abc@gmail',
    description: 'registered email',
    required: false,
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'Flat no 123, Jaipur',
    description: 'registered address. format address 1, address 2, address 3',
    required: false,
  })
  @IsString()
  address: string;

  @ApiProperty({ example: 14 })
  @IsInt()
  age: number;

  @ApiProperty({ example: '2010-05-12' })
  @IsDateString()
  dob: string;

  @ApiProperty({ example: 'male' })
  @IsString()
  gender: string;

  @ApiProperty({ example: 'O+', required: false })
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @ApiProperty({ example: 'ADM1023' })
  @IsString()
  admissionNo: string;

  @ApiProperty({ example: 12 })
  @IsInt()
  rollNo: number;

  @ApiProperty({ example: 'section-uuid' })
  @IsString()
  sectionId: string;

  @ApiProperty({ example: 'academic-year-uuid' })
  @IsString()
  academicYearId: string;

  @ApiProperty({ example: '2024-04-01T00:00:00.000Z' })
  @IsDateString()
  admissionDate: string;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  photo?: string;
}
