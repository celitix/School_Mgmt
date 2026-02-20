import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { AdjustementType } from 'generated/prisma/enums';

export class CreateSalaryAdjustmentDto {
  @ApiProperty({
    example: 'salary-uuid',
    description: 'Salary id',
  })
  @IsString()
  salaryId: string;

  @ApiProperty({
    example: 'late punch',
    description: 'name of the adjustment',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: AdjustementType.ALLOWANCE,
    description: 'name of the adjustment',
    enum: AdjustementType,
  })
  @IsEnum(AdjustementType)
  type: AdjustementType;

  @ApiProperty({
    example: 500,
    description: 'amount of the adjustment',
  })
  @IsInt()
  amount: number;
}
