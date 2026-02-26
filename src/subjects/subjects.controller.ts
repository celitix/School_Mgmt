import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/auth.decorator';
import { UserRoles } from 'src/interfaces/user.interfaces';

@Controller('subjects')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Subject (For Admin , Clerk Only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject Created successfully',
  })
  async create(@Body() data: CreateSubjectDto) {
    const isSubjectExist = await this.subjectsService.isSubjectExist(data.name);

    if (isSubjectExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Subject already exist.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const subject = await this.subjectsService.createSubject(data);

    if (!subject) {
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
        subject,
        message: 'Subject created successfully',
      },
      error: null,
    };
  }

  @Get('')
  async allSubjects() {
    const data = await this.subjectsService.allSubjects();
    return {
      isSuccess: true,
      data: {
        message: 'Subjects Fetched successfully',
        data,
      },
      error: null,
    };
  }

  @Get('class/:classId')
  async findAll(@Param('classId') classId: string) {
    const data = await this.subjectsService.findAllSubjects(classId);
    return {
      isSuccess: true,
      data: {
        message: 'Subjects Fetched successfully',
        data,
      },
      error: null,
    };
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.subjectsService.findOne(+id);
  // }

  @Patch(':id')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Subject (For Admin , Clerk Only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject Updated successfully',
  })
  async update(@Param('id') id: string, @Body() data: UpdateSubjectDto) {
    const isExist = await this.subjectsService.findOne(id);

    if (isExist && isExist.id !== id) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Subject already exists.',
          },
        },
        HttpStatus.CONFLICT,
      );
    }

    const isUpdate = await this.subjectsService.update(id, data);

    if (!isUpdate) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Something went wrong.',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      isSuccess: true,
      data: {
        message: 'Subject updated successfully',
      },
      error: null,
    };
  }

  @Delete(':id')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Subject (For Admin , Clerk Only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject deleted successfully',
  })
  async remove(@Param('id') id: string) {
    const isdelete = await this.subjectsService.remove(id);

    if (!isdelete) {
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
        message: 'Subject deleted successfully',
      },
      error: null,
    };
  }

  @Post('/:subjectId/class/:classId')
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign Subject to Class (For Admin , Clerk Only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject assigned successfully',
  })
  async addSubjectToClass(
    @Param('classId') classId: string,
    @Param('subjectId') subjectId: string,
  ) {
    const isSubjectExist = await this.subjectsService.findOne(subjectId);

    if (!isSubjectExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Subject not found.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isClassExist = await this.subjectsService.isClassExist(classId);

    if (!isClassExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Class not found.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isClassSubjectExist = await this.subjectsService.isClassSubjectExist(
      classId,
      subjectId,
    );

    if (isClassSubjectExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Subject already assigned.',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const data = await this.subjectsService.addSubjectToClass(
      classId,
      subjectId,
    );

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
        message: 'Subject assigned successfully',
        data,
      },
      error: null,
    };
  }
}
