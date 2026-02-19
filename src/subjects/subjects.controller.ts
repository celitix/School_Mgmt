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
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
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
  async create(@Body() data: CreateSubjectDto) {
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

  // @Get()
  // findAll() {
  //   return this.subjectsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.subjectsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
  //   return this.subjectsService.update(+id, updateSubjectDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.subjectsService.remove(+id);
  // }
}
