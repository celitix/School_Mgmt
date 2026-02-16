import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTeacherDto {
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
    example: 'ENR12345',
    description: 'Unique enrollment number of employee',
  })
  @IsString()
  enrollmentNo: string;

  @ApiProperty({
    example: 'B.Tech Computer Science',
    description: 'Educational qualification of employee',
  })
  @IsString()
  qualification: string;

  @ApiProperty({
    example: '3 years in backend development',
    description: 'Total work experience',
  })
  @IsString()
  exoperience: string;

  @ApiProperty({
    example: '2026-02-16',
    description: 'Joining date in ISO format (YYYY-MM-DD)',
  })
  @IsDateString()
  joiningDate: Date;
}
