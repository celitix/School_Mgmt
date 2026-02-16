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

export class VerifyOtpDto {
  @ApiProperty({
    example: 'phone',
    description: 'phone',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: '62495011-ee1b-4368-bb3f-58dfa513f4ce',
    description: 'Otp Id',
  })
  @IsString()
  otpId: string;

  @ApiProperty({
    example: '123456',
    description: 'Otp',
  })
  @IsString()
  otp: string;
}
