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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.classAndSectionsService.findOne(+id);
  // }

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
