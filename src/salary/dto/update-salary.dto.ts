import { PartialType } from '@nestjs/swagger';
import { CreateSalaryStructureDto } from './create-salary.dto';

export class UpdateSalaryDto extends PartialType(CreateSalaryStructureDto) {}
