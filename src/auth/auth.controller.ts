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
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import {
  compareValue,
  generateAccessToken,
  generateCode,
  hashValue,
  isOtpExpired,
} from 'helpers/authUtils';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Verify } from 'crypto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserInfo } from 'src/decorators/user.decorator';
import type { IUserTokenInfo } from 'src/interfaces/user.interfaces';
import { UserRoles } from '../interfaces/user.interfaces';
import { Roles } from 'src/decorators/auth.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('Auth')
@Controller('auth')
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
    const isPhoneExist = await this.authService.isPhoneExist(data.phone);

    if (!isPhoneExist || !isPhoneExist.isActive) {
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

  @Post('/verifyOtp')
  @HttpCode(HttpStatus.OK)
  //   @Roles(UserRoles.MENTOR)
  @ApiOperation({ summary: 'Verify Otp' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Otp verified successfully',
  })
  async verifyOtp(@Body() data: VerifyOtpDto) {
    const isOtpExist = await this.authService.isOtpExist(
      data.otpId,
      data.phone,
    );

    if (!isOtpExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Invalid Otp.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isOtpExpire = isOtpExpired(isOtpExist.expiresAt);

    if (isOtpExpire) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Otp Expired.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (isOtpExist.attempts >= 5) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Too many attempts. Please resend Otp.',
          },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const isOtpSame = await compareValue(data.otp, isOtpExist.otp);

    if (!isOtpSame) {
      await this.authService.addAttempt(data.otpId);
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Invalid Otp.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.authService.findUser(data.phone);

    const token = generateAccessToken(
      { id: user?.users[0]?.id!, role: user?.users[0]?.role?.name! },
      this.config.get('jwt.expiresIn') as number,
      this.config.get('jwt.secret') as string,
    );

    return {
      isSuccess: true,
      data: {
        token,
        role: user?.users[0]?.role?.name!,
        message: 'Otp verified successfully',
      },
      error: null,
    };
  }

  @Get('/seedRoles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Seed Roles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Seed Roles',
  })
  async seedRoles() {
    const data = [
      UserRoles.SUPERADMIN,
      UserRoles.ADMIN,
      UserRoles.STUDENT,
      UserRoles.TEACHER,
      UserRoles.ACCOUNTANT,
      UserRoles.CLERK,
      UserRoles.PARENT,
    ];

    return this.authService.seedRoles(data);
  }

  @Get('/seedUser')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Seed Super Admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Seed Super Admin',
  })
  async seedUser() {
    const data = {
      name: 'Arihant Jain',
      phone: '9672670732',
      email: 'arihantj916@gmail.com',
      address: 'Jaipur',
      roleId: 1,
    };

    const isPhoneExist = await this.authService.isPhoneExist('9672670732');

    if (isPhoneExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'User found in db.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.authService.createUser(data);
  }

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
