import { NextFunction } from 'express';

import { AppConfigService } from 'src/config/app-config/app-config.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { asyncLocalStorage } from 'src/logger';

@Injectable()
export class AsyncLocalStorageMiddleware implements NestMiddleware {
  constructor(private readonly appConfigService: AppConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const setREQId = this.appConfigService.get('SET_REQID_IN_LOG');
    if (setREQId) {
      const reqFromHeader = req.headers['x-request-id'];
      const requestId: string = reqFromHeader || Math.random();
      console.log('requestId', requestId);
      await asyncLocalStorage.run({ requestId }, async () => {
        return next();
      });
    }
    next();
  }
}
