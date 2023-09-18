import { NextFunction } from 'express';

import { randomUUID } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
export const asyncLocalStorage = new AsyncLocalStorage<{ requestId: string }>();
export const asyncLocalStorageMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId: string = req.headers['x-request-id'] || randomUUID();

  await asyncLocalStorage.run({ requestId }, async () => {
    return next();
  });
};
