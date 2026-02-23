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
    example: '2024-04-01T00:00:00.000Z',
    description: 'Joining date in ISO format (YYYY-MM-DD)',
  })
  @IsDateString()
  joiningDate: Date;

  @ApiProperty({
    example: '9687445525',
    description: 'Alternate phone number 1',
    required: false,
  })
  @IsString()
  altPhone1?: string;

  @ApiProperty({
    example: '9687445526',
    description: 'Alternate phone number 2',
    required: false,
  })
  @IsString()
  altPhone2?: string;
}
