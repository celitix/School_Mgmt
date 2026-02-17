import { PartialType } from '@nestjs/swagger';
import { CreateClassAndSectionDto } from './create-class-and-section.dto';

export class UpdateClassAndSectionDto extends PartialType(CreateClassAndSectionDto) {}
