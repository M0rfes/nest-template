import type { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { getTenantConnection } from './utils/get-tenant-connection';

export const tenantMiddelware = async (
  req: Request & { tenantId?: string; dataSource?: DataSource },
  _res: Response,
  next: NextFunction,
) => {
  const tenantId = req.headers['x-tenant-id'];
  if (tenantId) {
    req.tenantId = tenantId.toString();
    req.dataSource = await getTenantConnection(req.tenantId);
  }
  next();
};
