import { Injectable } from '@nestjs/common';
import { CreateClassAndSectionDto } from './dto/create-class-and-section.dto';
import { UpdateClassAndSectionDto } from './dto/update-class-and-section.dto';

@Injectable()
export class ClassAndSectionsService {
  create(createClassAndSectionDto: CreateClassAndSectionDto) {
    return 'This action adds a new classAndSection';
  }

  findAll() {
    return `This action returns all classAndSections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classAndSection`;
  }

  update(id: number, updateClassAndSectionDto: UpdateClassAndSectionDto) {
    return `This action updates a #${id} classAndSection`;
  }

  remove(id: number) {
    return `This action removes a #${id} classAndSection`;
  }
}
