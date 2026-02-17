import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { TeachersModule } from './teachers/teachers.module';
import { ClassAndSectionsModule } from './class-and-sections/class-and-sections.module';
import configurations from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configurations], isGlobal: true }),
    PrismaModule,
    AuthModule,
    StudentModule,
    TeachersModule,
    ClassAndSectionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
