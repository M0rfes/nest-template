import { Module, Scope, Global } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from 'src/database/public/entities/tenant.entity';
import type { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { getTenantConnection } from 'src/utils/get-tenant-connection';
import { CONNECTION } from 'src/utils/symbols';

const connectionFactory = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  useFactory: (request: Request) => {
    const { tenantId } = request as Request & { tenantId?: string };
    if (tenantId) {
      return getTenantConnection(tenantId);
    }
    return null;
  },
  incject: [REQUEST],
};
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantService, connectionFactory],
  controllers: [TenantController],
  exports: [TenantService, connectionFactory],
})
export class TenantModule {}
