import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  HttpException,
  Query,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/auth.decorator';
import { UserRoles } from 'src/interfaces/user.interfaces';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateSalaryStructureDto } from './dto/create-salary-structure.dto';

@Controller('teachers')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Roles(
  UserRoles.SUPERADMIN,
  UserRoles.ADMIN,
  UserRoles.CLERK,
  UserRoles.TEACHER,
)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Teacher (For Admin , Clerk Only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher Created successfully',
  })
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    const isStudentExist = await this.teachersService.isTeacherExist(
      createTeacherDto.phone,
    );

    if (isStudentExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Teacher already exist.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isCreate = await this.teachersService.create(createTeacherDto);

    if (!isCreate) {
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
    return {
      isSuccess: true,
      data: {
        message: 'Teacher Created successfully',
      },
      error: null,
    };
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const data = await this.teachersService.findAll(page, limit);

    return {
      isSuccess: true,
      data: {
        teachers: data?.data,
        meta: data?.meta,
        message: 'Teacher fetched successfully',
      },
      error: null,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const isTeacherExist = await this.teachersService.isTeacherExistById(id);
    if (!isTeacherExist) {
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
    return {
      isSuccess: true,
      data: {
        isTeacherExist,
        message: 'Teacher fetched successfully',
      },
      error: null,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Single Teacher' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher fetched successfully',
  })
  async remove(@Param('id') id: string) {
    const isTeacherExist = await this.teachersService.isTeacherExistById(id);
    if (!isTeacherExist) {
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
    const isDeleted = await this.teachersService.remove(isTeacherExist.userId);

    if (!isDeleted) {
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
    return {
      isSuccess: true,
      data: {
        message: 'Teacher deleted successfully',
      },
      error: null,
    };
  }

  @Post('/salary-structure')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Salary Structure' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Salary Structure Created successfully',
  })
  async createSalaryStructure(@Body() data: CreateSalaryStructureDto) {
    const isUserExist = await this.teachersService.isUserExist(data.userId);

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
    const isCreate = await this.teachersService.createSalaryStructure(data);

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

  @Get('/salary-structure/:id')
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
  async getSalaryStructure(@Param('id') id: string) {
    const isUserExist = await this.teachersService.isUserExist(id);

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
    const data = await this.teachersService.getTeacherSalaryStructure(id);

    return {
      isSuccess: true,
      data: {
        data,
        message: 'Salary Structure fetched successfully',
      },
      error: null,
    };
  }

  @Get('/:teacherId/assign/:sectionId')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign Teacher to Section' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher assigned successfully',
  })
  async assignTeacherToSection(
    @Param('teacherId') teacherId: string,
    @Param('sectionId') sectionId: string,
  ) {
    const isUserExist = await this.teachersService.isUserExist(teacherId);

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

    const isSectionExist = await this.teachersService.isSectionExist(sectionId);

    if (!isSectionExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Section not found.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const data = await this.teachersService.assignTeacherToSection(
      teacherId,
      sectionId,
    );

    return {
      isSuccess: true,
      data: {
        data,
        message: 'Teacher assigned successfully',
      },
      error: null,
    };
  }
}
