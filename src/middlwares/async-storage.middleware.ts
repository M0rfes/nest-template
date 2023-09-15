import { NextFunction } from 'express';
import { asyncLocalStorage } from 'src/logger';
import { randomUUID } from 'node:crypto';

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
