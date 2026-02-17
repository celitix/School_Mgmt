import { Test, TestingModule } from '@nestjs/testing';
import { ClassAndSectionsService } from './class-and-sections.service';

describe('ClassAndSectionsService', () => {
  let service: ClassAndSectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassAndSectionsService],
    }).compile();

    service = module.get<ClassAndSectionsService>(ClassAndSectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
