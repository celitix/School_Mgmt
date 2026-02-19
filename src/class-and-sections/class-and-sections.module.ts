import { Module } from '@nestjs/common';
import { ClassAndSectionsService } from './class-and-sections.service';
import { ClassAndSectionsController } from './class-and-sections.controller';
import { SubjectsModule } from 'src/subjects/subjects.module';

@Module({
  imports: [SubjectsModule],
  controllers: [ClassAndSectionsController],
  providers: [ClassAndSectionsService],
  exports: [ClassAndSectionsService],
})
export class ClassAndSectionsModule {}
