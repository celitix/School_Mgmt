import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    example: 'phone',
    description: 'phone',
  })
  @IsString()
  phone: string;
}
