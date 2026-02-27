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
  Query,
} from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import {
  CreateTimeSlotDto,
  CreateTimetableDto,
} from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('timetable')
export class TimetablesController {
  constructor(private readonly timetablesService: TimetablesService) {}

  @Post('/time-slot')
  async createTimeSlot(@Body() data: CreateTimeSlotDto) {
    const isCreate = await this.timetablesService.createTimeSlot(data);

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
        message: 'Time Slot Created successfully',
      },
      error: null,
    };
  }

  @Post()
  async createTimeTable(@Body() data: CreateTimetableDto) {
    const isTeacherExist = await this.timetablesService.isTeacherExist(
      data.teacherId,
    );

    if (!isTeacherExist) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Teacher not found.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isClassExist = await this.timetablesService.isClassExist(
      data.classId,
    );

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

    const isSectionExist = await this.timetablesService.isSectionExist(
      data.classId,
      data.sectionId,
    );

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

    const isisTeacherAssignedTheTimeSlot =
      await this.timetablesService.isTeacherAssignedTheTimeSlot(
        data.dayOfWeek,
        data.teacherId,
        data.timeSlotId,
      );

    const isTeacherAssignedClass =
      await this.timetablesService.isTeacherAssignedClass(
        data.sectionId,
        data.timeSlotId,
        data.classId,
        data.dayOfWeek,
      );

    if (isisTeacherAssignedTheTimeSlot || isTeacherAssignedClass) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Time Slot already assigned to teacher or class.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const isCreate = await this.timetablesService.createTimeTable(data);

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
        message: 'Time Table Created successfully',
      },
      error: null,
    };
  }

  @Get('/time-slots')
  async findAllTimeSlots() {
    const slots = await this.timetablesService.findAllTimeSlots();

    return {
      isSuccess: true,
      data: {
        message: 'Time Slots fetched successfully',
        slots,
      },
      error: null,
    };
  }

  @Get('/time-slots/:id')
  async findOneTimeSlot(@Param('id') id: string) {
    const slot = await this.timetablesService.findOneTimeSlots(id);

    if (!slot) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Time Slot not found.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      isSuccess: true,
      data: {
        message: 'Time Slot fetched successfully',
        slot,
      },
      error: null,
    };
  }

  @Get('/:classId')
  @ApiQuery({ name: 'page', required: true, example: '1' })
  @ApiQuery({ name: 'limit', required: true, example: '10' })
  @ApiQuery({ name: 'classSectionId', required: false })
  async findAllTimeTables(
    @Param('classId') classId: string,
    @Query('classSectionId') classSectionId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const timetables = await this.timetablesService.findAllTimeTables(
      page,
      limit,
      classId,
      classSectionId,
    );

    return {
      isSuccess: true,
      data: {
        message: 'Time Tables fetched successfully',
        timetables: timetables.data,
        meta: timetables.meta,
      },
      error: null,
    };
  }

  @Get(':id')
  async findOneTimeTables(@Param('id') id: string) {
    const timetable = await this.timetablesService.findOneTimeTable(id);

    if (!timetable) {
      throw new HttpException(
        {
          isSuccess: false,
          data: null,
          error: {
            message: 'Time Table not found.',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      isSuccess: true,
      data: {
        message: 'Time Tables fetched successfully',
        timetable,
      },
      error: null,
    };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTimetableDto: UpdateTimetableDto) {
  //   return this.timetablesService.update(+id, updateTimetableDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.timetablesService.remove(+id);
  // }
}
