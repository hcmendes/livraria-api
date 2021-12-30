import { Test, TestingModule } from '@nestjs/testing';
import { GCSImagemService } from './gsc-imagem.service';

describe('ImagensService', () => {
  let service: GCSImagemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GCSImagemService],
    }).compile();

    service = module.get<GCSImagemService>(GCSImagemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
