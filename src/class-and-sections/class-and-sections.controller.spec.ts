import { Test, TestingModule } from '@nestjs/testing';
import { ClassAndSectionsController } from './class-and-sections.controller';
import { ClassAndSectionsService } from './class-and-sections.service';

describe('ClassAndSectionsController', () => {
  let controller: ClassAndSectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassAndSectionsController],
      providers: [ClassAndSectionsService],
    }).compile();

    controller = module.get<ClassAndSectionsController>(ClassAndSectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
