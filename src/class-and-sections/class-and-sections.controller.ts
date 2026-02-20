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
} from '@nestjs/common';
import { ClassAndSectionsService } from './class-and-sections.service';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/auth.decorator';
import { UserRoles } from 'src/interfaces/user.interfaces';
import { AssignSubjectToClassDto } from 'src/subjects/dto/create-subject.dto';

@Controller('class')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.CLERK)
export class ClassAndSectionsController {
  constructor(
    private readonly classAndSectionsService: ClassAndSectionsService,
  ) {}

  @Post('/create')
  async createClass(@Body() data: CreateClassDto) {
    const isClassExist = await this.classAndSectionsService.isClassExist(
      data.name,
    );

    if (isClassExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Class already exist.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const isCreate = await this.classAndSectionsService.createClass(data);

    if (!isCreate) {
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
        message: 'Class Created successfully',
      },
      error: null,
    };
  }

  @Post('/create-section')
  async createSection(@Body() data: CreateSectionDto) {
    const isCreate = await this.classAndSectionsService.createSection(data);

    if (!isCreate) {
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
        message: 'Section Created successfully',
      },
      error: null,
    };
  }

  @Get()
  async findAllClass() {
    const allClass = await this.classAndSectionsService.getAllClass();

    return {
      isSuccess: true,
      data: {
        message: 'Class Fetched successfully',
        allClass,
      },
      error: null,
    };
  }
  @Get('section/:classId')
  async getAllSections(@Param('classId') classId: string) {
    const sections = await this.classAndSectionsService.getAllSections(classId);

    return {
      isSuccess: true,
      data: {
        message: 'Section Fetched successfully',
        sections,
      },
      error: null,
    };
  }

  @Post('/toggleSubjectAssignment')
  async toggleSubjectAssignment(@Body() data: AssignSubjectToClassDto) {
    const isToggle =
      await this.classAndSectionsService.toggleSubjectAssignment(data);

    if (!isToggle.isSuccess) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: isToggle.message,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      isSuccess: true,
      data: {
        message: isToggle.message,
      },
      error: null,
    };
  }

  @Get('/subject/:id')
  async findAllClassSubjects(@Param('id') id: string) {
    const isClassExist =
      await this.classAndSectionsService.isClassExistById(id);

    if (!isClassExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Class not found.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const data = await this.classAndSectionsService.findAllSubjects(id);

    return {
      isSuccess: true,
      data: {
        message: 'Subjects Fetched successfully',
        data,
      },
      error: null,
    };
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateClassAndSectionDto: UpdateClassAndSectionDto,
  // ) {
  //   return this.classAndSectionsService.update(+id, updateClassAndSectionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.classAndSectionsService.remove(+id);
  // }
}
