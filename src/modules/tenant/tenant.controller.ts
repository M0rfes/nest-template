import { Controller, Post, Version, Body } from '@nestjs/common';
import { Public } from 'src/core/decorators';
import { CreateTenantDTO } from './dto/create-tenant.dto';
import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}
  @Version('1')
  @Public()
  @Post()
  async create(@Body() body: CreateTenantDTO) {
    return this, this.tenantService.create(body);
  }
}
