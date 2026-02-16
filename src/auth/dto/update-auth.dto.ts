import { PartialType } from '@nestjs/mapped-types';
import { SendOtpDto } from './auth.dto';

export class UpdateAuthDto extends PartialType(SendOtpDto) {}
