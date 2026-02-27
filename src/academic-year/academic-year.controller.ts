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
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AcademicYearService } from './academic-year.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from 'src/interfaces/user.interfaces';
import { Roles } from 'src/decorators/auth.decorator';

@Controller('academic-year')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @Post()
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create academic year' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Academic year created successfully',
  })
  async create(@Body() createAcademicYearDto: CreateAcademicYearDto) {
    const isAcademicYearExist =
      await this.academicYearService.isAcademicYearExist(
        createAcademicYearDto.fromYear,
        createAcademicYearDto.toYear,
      );

    if (isAcademicYearExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Academic year already exist.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isCreated = await this.academicYearService.create(
      createAcademicYearDto,
    );

    if (!isCreated) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Something went wrong.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      isSuccess: true,
      data: {
        message: 'Academic year created successfully',
      },
      error: null,
    };
  }

  @Get()
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get academic year' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Academic year fetched successfully',
  })
  async findAll() {
    const data = await this.academicYearService.findAll();

    return {
      isSuccess: true,
      data: {
        academicYears: data,
        message: 'Academic years fetched successfully',
      },
      error: null,
    };
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.academicYearService.findOne(id);
  // }

  @Patch(':id')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update academic year' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Academic year updated successfully',
  })
  async update(@Param('id') id: string, @Body() data: UpdateAcademicYearDto) {
    const isAcademicYearExist = await this.academicYearService.findOne(id);

    if (!isAcademicYearExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Academic year does not exist.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isUpdated = await this.academicYearService.update(id, data);

    if (!isUpdated) {
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
        message: 'Academic year updated successfully',
      },
      error: null,
    };
  }

  @Delete(':id')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete academic year' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Academic year deleted successfully',
  })
  async remove(@Param('id') id: string) {
    const isAcademicYearExist = await this.academicYearService.findOne(id);

    if (!isAcademicYearExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Academic year does not exist.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isDeleted = await this.academicYearService.remove(id);

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
        message: 'Academic year deleted successfully',
      },
      error: null,
    };
  }
}
