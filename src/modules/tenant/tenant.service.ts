import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from 'src/database/public/entities/tenant.entity';
import { Repository } from 'typeorm';
import { CreateTenantDTO } from './dto/create-tenant.dto';
import { getTenantConnection } from 'src/utils/get-tenant-connection';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async create(dto: CreateTenantDTO) {
    try {
      const newTenant = this.tenantRepository.create(dto);
      const tenant = await this.tenantRepository.save(newTenant);
      const schemaName = `tenant_${tenant.id}`;
      await this.tenantRepository.query(
        `CREATE SCHEMA IF NOT EXISTS ${schemaName}`,
      );
      const connection = await getTenantConnection(tenant.id);
      await connection.runMigrations();
      await connection.destroy();
      return tenant;
    } catch (error) {
      this.logger.error(this.logger.error(error));
      throw error;
    }
  }
}
