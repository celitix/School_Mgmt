import { forwardRef, Module } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { TimetablesController } from './timetables.controller';
import { TeachersModule } from 'src/teachers/teachers.module';
import { ClassAndSectionsModule } from 'src/class-and-sections/class-and-sections.module';

@Module({
  imports: [
    forwardRef(() => TeachersModule),
    forwardRef(() => ClassAndSectionsModule),
  ],
  controllers: [TimetablesController],
  providers: [TimetablesService],
})
export class TimetablesModule {}
