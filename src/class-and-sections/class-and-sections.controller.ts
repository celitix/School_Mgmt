import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassAndSectionsService } from './class-and-sections.service';
import { CreateClassAndSectionDto } from './dto/create-class.dto';
import { UpdateClassAndSectionDto } from './dto/update-class.dto';

@Controller('class-and-sections')
export class ClassAndSectionsController {
  constructor(
    private readonly classAndSectionsService: ClassAndSectionsService,
  ) {}

  @Post()
  create(@Body() createClassAndSectionDto: CreateClassAndSectionDto) {
    return this.classAndSectionsService.create(createClassAndSectionDto);
  }

  @Get()
  findAll() {
    return this.classAndSectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classAndSectionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassAndSectionDto: UpdateClassAndSectionDto,
  ) {
    return this.classAndSectionsService.update(+id, updateClassAndSectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classAndSectionsService.remove(+id);
  }
}
