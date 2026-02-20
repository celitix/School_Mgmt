import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSalaryStructureDto {
  @ApiProperty({
    example: '2024-04-01T00:00:00.000Z',
    description: 'Effective From',
  })
  @IsDateString()
  effectiveFrom: string;

  @ApiProperty({
    example: '2024-04-01T00:00:00.000Z',
    description: 'Effective To',
    required: false,
  })
  @IsDateString()
  effectiveTo?: string;

  @ApiProperty({
    example: '50000',
    description: 'Basic Salary',
  })
  @IsInt()
  basicSalary: number;

  @ApiProperty({
    example: '5000',
    description: 'House Rent Allowance',
    required: false,
  })
  @IsInt()
  hra: number;

  @ApiProperty({
    example: '5050',
    description: 'Allowance',
    required: false,
  })
  @IsInt()
  allowance: number;

  @ApiProperty({
    example: '500',
    description: 'Provident Fund',
    required: false,
  })
  @IsInt()
  pf: number;

  @ApiProperty({
    example: '100',
    description: "Employees' State Insurance",
    required: false,
  })
  @IsInt()
  esi: number;

  // @ApiProperty({
  //   example: '50000',
  //   description: 'Net Salary',
  // })
  // @IsInt()
  // netSalary: number;

  @ApiProperty({
    example: '100',
    description: 'Professional Tax',
    required: false,
  })
  @IsInt()
  professionalTax: number;

  @ApiProperty({
    example: 'user-uuid',
    description: 'User Id',
  })
  @IsString()
  userId: string;
}
