import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class TenantIdMiddelware implements NestMiddleware {
  use(
    req: Request & { tenantId?: string },
    _res: Response,
    next: NextFunction,
  ) {
    const tenantId = req.headers['x-tenant-id'];
    if (tenantId) {
      req.tenantId = tenantId.toString();
    }
    next();
  }
}
