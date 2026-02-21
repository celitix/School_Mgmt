import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAcademicYearDto {
  @ApiProperty({
    example: '2026',
    description: 'Start Year',
  })
  @IsString()
  fromYear: string;

  @ApiProperty({
    example: '2026',
    description: 'End Year',
  })
  @IsString()
  toYear: string;
}
