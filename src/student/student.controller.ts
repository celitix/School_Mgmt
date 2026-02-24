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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRoles } from 'src/interfaces/user.interfaces';
import { Roles } from 'src/decorators/auth.decorator';
import { CreateStudentGurdianDto } from './dto/create-gurdian.dto';

@Controller('student')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Roles(
  UserRoles.SUPERADMIN,
  UserRoles.ADMIN,
  UserRoles.CLERK,
  UserRoles.STUDENT,
)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Student (For Admin , Clerk Only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student Created successfully',
  })
  async create(@Body() createStudentDto: CreateStudentDto) {
    // const isStudentExist = await this.studentService.isStudentExist(
    //   createStudentDto.phone,
    // );

    // if (isStudentExist) {
    //   throw new HttpException(
    //     {
    //       isSuccess: false,
    //       data: null,
    //       error: {
    //         message: 'Student already exist.',
    //       },
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    const isCreate = await this.studentService.create(createStudentDto);

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
        message: 'Student Created successfully',
      },
      error: null,
    };
  }

  @Get()
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All Students (For Admin , Clerk Only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student fetched successfully',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const allStudents = await this.studentService.findAll(page, limit);
    return {
      isSuccess: true,
      data: {
        students: allStudents?.data,
        meta: allStudents?.meta,
        message: 'Student fetched successfully',
      },
      error: null,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Single Students' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student fetched successfully',
  })
  async findOne(@Param('id') id: string) {
    const isStudentExist = await this.studentService.findOne(id);

    if (!isStudentExist) {
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
        isStudentExist,
        message: 'Student fetched successfully',
      },
      error: null,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const isUpdate = await this.studentService.update(id, updateStudentDto);

    if (!isUpdate) {
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
        message: 'Student updated successfully',
      },
      error: null,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Single Students' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Students fetched successfully',
  })
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  async remove(@Param('id') id: string) {
    const isStudentExist = await this.studentService.isStudentExistById(id);

    if (!isStudentExist) {
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

    const isDeleted = await this.studentService.remove(isStudentExist.userId);

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
        message: 'Student deleted successfully',
      },
      error: null,
    };
  }

  @Post('/gurdian')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Student Gurdians (For Admin , Clerk Only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student Gurdians Created successfully',
  })
  async createGuardian(@Body() data: CreateStudentGurdianDto) {
    const isStudentGurdianTypeExist =
      await this.studentService.isStudentGurdianTypeExist(
        data.studentId,
        data.type,
      );

    if (isStudentGurdianTypeExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: `Gurdian with type ${data.type} already exist.`,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const isCreate = await this.studentService.createGurdian(data);

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
        message: 'Student Gurdians Created successfully',
      },
      error: null,
    };
  }
}
