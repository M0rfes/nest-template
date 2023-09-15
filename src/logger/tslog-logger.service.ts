import { Injectable } from '@nestjs/common';
import { Logger } from 'tslog';
import { AsyncLocalStorage } from 'async_hooks';
export const asyncLocalStorage = new AsyncLocalStorage<{ requestId: string }>();
import {
  LoggerService,
  //  LogLevel,
} from '@nestjs/common';

@Injectable()
export class TsLogLoggerService implements LoggerService {
  private logger: Logger<unknown>;

  constructor() {
    this.logger = new Logger(
      {
        name: 'Server',
        hideLogPositionForProduction: true,

        //   prefix: [],
      },
      //   {
      //     requestId: () => asyncLocalStorage.getStore()?.requestId,
      //   },
    );
  }

  log(message: string, data: unknown): void {
    const requestId = this.getRequestId();
    this.logger.info(requestId, message, data);
  }

  info(message: string, data: unknown): void {
    const requestId = this.getRequestId();
    this.logger.info(requestId, message, data);
  }

  error(message: string, data: unknown): void {
    const requestId = this.getRequestId();
    this.logger.error(requestId, message, data);
  }

  warn(message: string, data: unknown): void {
    const requestId = this.getRequestId();
    this.logger.warn(requestId, message, data);
  }

  debug(message: string, data: unknown): void {
    const requestId = this.getRequestId();
    this.logger.debug(requestId, message, data);
  }

  //  verbose doesn't exist for tslog
  verbose(message: string, data: unknown): void {
    // const requestId = this.getRequestId();
    this.logger.debug(message, data);
  }

  fatal?(message: string, data: unknown): void {
    // const requestId = this.getRequestId();
    this.logger.fatal(message, data);
  }

  private getRequestId(): string {
    return asyncLocalStorage.getStore()?.requestId;
  }
}
