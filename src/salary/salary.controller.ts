import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SalaryService } from './salary.service';
import { CreateSalaryStructureDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { Roles } from 'src/decorators/auth.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { UserRoles } from 'src/interfaces/user.interfaces';
import type { IUserTokenInfo } from 'src/interfaces/user.interfaces';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import {
  CreateSalaryAdjustmentBulkDto,
  CreateSalaryAdjustmentDto,
} from './dto/salary-adjusment.dto';
import { UserInfo } from 'src/decorators/user.decorator';

@Controller('salary')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post()
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Salary Structure' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Salary Structure Created successfully',
  })
  async create(@Body() data: CreateSalaryStructureDto) {
    const isUserExist = await this.salaryService.isUserExist(data.userId);

    if (!isUserExist) {
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
    const isCreate = await this.salaryService.create(data);

    if (!isCreate) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Something went wrong.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      isSuccess: true,
      data: {
        message: 'Salary Structure Created successfully',
      },
      error: null,
    };
  }

  @Get('/process-monthly-salary/:userId')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process Monthly Salary' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Monthly Salary processed successfully',
  })
  async processMontlySalary(@Param('userId') userId: string) {
    const isSalarySturctureExist = await this.salaryService.findOne(userId);

    if (!isSalarySturctureExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Salary Structure not found.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const isSalaryProcessed =
      await this.salaryService.isSalaryProcessed(userId);

    if (isSalaryProcessed) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Monthly Salary already processed.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = await this.salaryService.processMontlySalary(userId);

    if (!data) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Something went wrong.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      isSuccess: true,
      data: {
        message: 'Monthly Salary processed successfully',
      },
      error: null,
    };
  }

  @Get('/getMonthlySalary/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Monthly Salary' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Monthly Salary fetched successfully',
  })
  @Roles(
    UserRoles.SUPERADMIN,
    UserRoles.ADMIN,
    UserRoles.CLERK,
    UserRoles.TEACHER,
  )
  @ApiQuery({ name: 'month', type: Number, required: true, example: 2 })
  @ApiQuery({ name: 'year', type: Number, required: true, example: 2026 })
  async getMonthlySalary(
    @Param('userId') userId: string,
    @Query('month') month: number,
    @Query('year') year: number,
    @UserInfo() user: IUserTokenInfo,
  ) {
    const role = user?.role[0]?.name;
    const loggedInUserId = user?.id;

    if (
      role !== 'ADMIN' &&
      role !== 'SUPER_ADMIN' &&
      userId !== loggedInUserId
    ) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'You can only access your own salary structure.',
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const data = await this.salaryService.getMonthlySalary(userId, month, year);
    if (!data) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Monthly Salary not found.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      isSuccess: true,
      data: {
        data,
        message: 'Monthly Salary fetched successfully',
      },
      error: null,
    };
  }

  @Get(':userId')
  @Roles(
    UserRoles.SUPERADMIN,
    UserRoles.ADMIN,
    UserRoles.CLERK,
    UserRoles.TEACHER,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Salary Structure' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Salary Structure fetched successfully',
  })
  async findSalaryStructure(
    @Param('userId') userId: string,
    @UserInfo() user: IUserTokenInfo,
  ) {
    const role = user?.role[0]?.name;
    const loggedInUserId = user?.id;

    if (
      role !== 'ADMIN' &&
      role !== 'SUPER_ADMIN' &&
      userId !== loggedInUserId
    ) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'You can only access your own salary structure.',
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const isUserExist = await this.salaryService.isUserExist(userId);

    if (!isUserExist) {
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

    const data = await this.salaryService.findOne(userId);

    return {
      isSuccess: true,
      data: {
        data,
        message: 'Salary Structure fetched successfully',
      },
      error: null,
    };
  }

  @Post('/pay/:id')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  async paySalary(@Param('id') id: string) {
    const isSalaryProcessed = await this.salaryService.isMonthlySalaryExist(id);

    if (!isSalaryProcessed) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Monthly Salary not found.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isMontlySalaryPaid = await this.salaryService.isMontlySalaryPaid(id);

    if (isMontlySalaryPaid) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Monthly Salary already paid.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const res = await this.salaryService.markSalaryAsPay(id);

    if (!res) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Something went wrong.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      isSuccess: true,
      data: {
        message: 'Salary paid successfully',
      },
      error: null,
    };
  }

  @Post('/addSalaryAdjustment')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  async addSalaryAdjustment(@Body() data: CreateSalaryAdjustmentDto) {
    const res = await this.salaryService.addSalaryAdjustment(data);

    if (!res) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Something went wrong.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      isSuccess: false,
      data: {
        message: 'Salary Adjustment added successfully',
      },
      error: null,
    };
  }
  @Post('/addSalaryAdjustmentBulk')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  async addSalaryAdjustmentBulk(@Body() data: CreateSalaryAdjustmentBulkDto) {
    if (data.data.length == 0) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'No data found.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const res = await this.salaryService.addSalaryAdjustmentBulk(data);

    if (!res) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Something went wrong.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      isSuccess: false,
      data: {
        message: 'Salary Adjustment added successfully',
      },
      error: null,
    };
  }

  @Patch(':id')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Salary Structure' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Salary Structure updated successfully',
  })
  async update(@Param('id') id: string, @Body() data: UpdateSalaryDto) {
    const isIdExist = await this.salaryService.isIdExist(id);

    if (!isIdExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Salary Structure not found.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const isUpdate = await this.salaryService.update(id, data);

    if (!isUpdate) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Something went wrong.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      isSuccess: true,
      data: {
        message: 'Salary Structure updated successfully',
      },
      error: null,
    };
  }

  @Delete(':id')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Salary Structure' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Salary Structure deleted successfully',
  })
  async remove(@Param('id') id: string) {
    const isIdExist = await this.salaryService.isIdExist(id);

    if (!isIdExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Salary Structure not found.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const isDeleted = await this.salaryService.remove(id);

    if (!isDeleted) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Something went wrong.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      isSuccess: true,
      data: {
        message: 'Salary Structure deleted successfully',
      },
      error: null,
    };
  }
}
