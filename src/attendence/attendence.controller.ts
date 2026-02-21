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
} from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { CreateAttendenceDto } from './dto/create-attendence.dto';
import { UpdateAttendenceDto } from './dto/update-attendence.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create Salary Structure' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Salary Structure Created successfully',
  })
  async create(@Body() data: CreateAttendenceDto) {
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
  async findAll() {
    // return this.attendenceService.findAll('sdd', 'sdd', 'sdd', 'sdd', 'sdd');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.attendenceService.findOne(id);
  }

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
