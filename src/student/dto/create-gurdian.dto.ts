import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateStudentGurdianDto {
  @ApiProperty({
    example: 'Arihant',
    description: 'Student Name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '96XXXXXXXX',
    description: 'phone',
  })
  @IsString()
  phone: string;

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

  @ApiProperty({
    example: 'Software Engineer',
    description: 'occupation of the gurdian',
    required: false,
  })
  @IsString()
  occupation: string;

  @ApiProperty({
    example: 'uuid-of-student',
    description: 'student id',
    required: false,
  })
  @IsString()
  studentId: string;

  @ApiProperty({
    example: 'Father',
    description: 'type of gurdian',
  })
  @IsString()
  type: string;
}
