import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateClassDto {
  @ApiProperty({
    example: 'Arihant',
    description: 'Student Name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 5,
    description: 'No of sections in a class',
    required: false,
  })
  @IsNumber()
  noOfSections: string;
}
