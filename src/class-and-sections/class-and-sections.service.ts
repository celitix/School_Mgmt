import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassAndSectionsService {
  createClass(any: any) {
    return 'This action adds a new classAndSection';
  }

  createSection(any: any) {
    return 'This action adds a new classAndSection';
  }
  findAll() {
    return `This action returns all classAndSections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classAndSection`;
  }

  update(id: number, updateClassAndSectionDto: any) {
    return `This action updates a #${id} classAndSection`;
  }

  remove(id: number) {
    return `This action removes a #${id} classAndSection`;
  }
}
