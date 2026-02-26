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
import { AttendenceService } from './attendence.service';
import { CreateAttendenceDto } from './dto/create-attendence.dto';
import { UpdateAttendenceDto } from './dto/update-attendence.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/auth.decorator';
import { UserRoles } from 'src/interfaces/user.interfaces';

@Controller('attendence')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
export class AttendenceController {
  constructor(private readonly attendenceService: AttendenceService) {}

  @Post()
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark attendence' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attendence created successfully',
  })
  async create(@Body() data: CreateAttendenceDto) {
    const isStudentExist = await this.attendenceService.isStudentExist(
      data.studentId,
    );

    if (!isStudentExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Student does not exist.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isClassExist = await this.attendenceService.isClassExist(
      data.classId,
    );

    if (!isClassExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Class does not exist.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isSectionExist = await this.attendenceService.isSectionExist(
      data.sectionId,
    );

    if (!isSectionExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Section does not exist.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isAttendenceMarkforDate =
      await this.attendenceService.isAttendenceMarkforDate(
        data.classId,
        data.sectionId,
        data.date,
      );

    if (isAttendenceMarkforDate) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Attendence already marked for this date.',
          },
        },
        HttpStatus.CONFLICT,
      );
    }
    const isCreate = await this.attendenceService.create(data);

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
        message: 'Attendence created successfully.',
      },
      error: null,
    };
  }

  @Get()
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Attendence' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Attendence fetched successfully.',
  })
  @ApiQuery({
    name: 'startDate',
    example: '2024-04-01T00:00:00.000Z',
    required: false,
  })
  @ApiQuery({
    name: 'endDate',
    example: '2024-04-01T00:00:00.000Z',
    required: false,
  })
  @ApiQuery({
    name: 'classId',
    required: false,
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
  })
  @ApiQuery({
    name: 'sectionId',
    required: false,
  })
  async findAll(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('classId') classId: string,
    @Query('studentId') studentId: string,
    @Query('sectionId') sectionId: string,
  ) {
    const data = await this.attendenceService.findAll(
      startDate,
      endDate,
      classId,
      sectionId,
      studentId,
    );

    return {
      isSuccess: true,
      data: {
        attendence: data,
        message: 'Attendence fetched successfully.',
      },
      error: null,
    };
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.attendenceService.findOne(id);
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateAttendenceDto: UpdateAttendenceDto,
  // ) {
  //   return this.attendenceService.update(id, updateAttendenceDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.attendenceService.remove(id);
  // }
}
