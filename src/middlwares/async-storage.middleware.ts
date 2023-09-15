import { NextFunction } from 'express';

import { randomUUID } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
export const asyncLocalStorage = new AsyncLocalStorage<{ requestId: string }>();
export const asyncStorageMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // use x-request-id or fallback to a nanoid
  const requestId: string = req.headers['x-request-id'] || randomUUID();
  // every other Koa middleware will run within the AsyncLocalStorage context
  await asyncLocalStorage.run({ requestId }, async () => {
    return next();
  });
};
