import { Module } from '@nestjs/common';
import { ClassAndSectionsService } from './class-and-sections.service';
import { ClassAndSectionsController } from './class-and-sections.controller';

@Module({
  controllers: [ClassAndSectionsController],
  providers: [ClassAndSectionsService],
  exports: [ClassAndSectionsService],
})
export class ClassAndSectionsModule {}
