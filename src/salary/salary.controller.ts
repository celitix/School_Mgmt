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
} from '@nestjs/common';
import { SalaryService } from './salary.service';
import { CreateSalaryStructureDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { Roles } from 'src/decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRoles } from 'src/interfaces/user.interfaces';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

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

  // @Get()
  // async findAll() {
  //   return this.salaryService.findAll();
  // }

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
  async findSalaryStructure(@Param('userId') userId: string) {
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

  @Patch(':id')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
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
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
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
