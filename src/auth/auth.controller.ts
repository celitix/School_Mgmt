import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { generateCode, hashValue } from 'helpers/authUtils';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
// @ApiBearerAuth('access-token')
// @UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('/sendOtp')
  @HttpCode(HttpStatus.OK)
  //   @Roles(UserRoles.MENTOR)
  @ApiOperation({ summary: 'Send Otp' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Otp sent successfully',
  })
  async sendOtp(@Body() data: SendOtpDto) {
    const isPhoneExist = this.authService.isPhoneExist(data.phone);

    if (!isPhoneExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'User not found.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    let otp = generateCode(6, 'number');
    const appEnv = this.config.get('env');

    console.log('appEnv', appEnv);

    if (appEnv == 'development') {
      otp = '123456';
    }

    const hasedOtp = await hashValue(otp);

    if (!hasedOtp) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Error sending Otp. Please try again.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const saveOtp = await this.authService.saveOtp(hasedOtp, data.phone);

    if (!saveOtp)
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Error sending Otp. Please try again.',
          },
        },
        HttpStatus.NOT_FOUND,
      );

    return {
      isSuccess: true,
      data: {
        otpId: saveOtp.id,
        message: 'Otp sent successfully',
      },
      error: null,
    };
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
