import { Test, TestingModule } from '@nestjs/testing';
import { TenantIdMiddelware } from './tenant-id.middelware';

describe('TenantIdService', () => {
  let service: TenantIdMiddelware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantIdMiddelware],
    }).compile();

    service = module.get<TenantIdMiddelware>(TenantIdMiddelware);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
