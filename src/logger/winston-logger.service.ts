import { LoggerService } from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

import { AppConfigService } from 'src/config/app-config/app-config.service';
import { asyncLocalStorage } from 'src/middlwares/async-storage.middleware';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor(private readonly config: AppConfigService) {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize({ all: true }),
        winston.format.printf(
          ({ timestamp, level, message, context, requestId, ...metadata }) => {
            const colorizeRequestId = '\x1b[36m'; // Cyan
            const colorizeTimestamp = '\x1b[35m'; // Magenta
            const resetColor = '\x1b[0m'; // Reset color

            let logMessage = `${colorizeTimestamp}[${timestamp}]${resetColor} [${level}]`;
            if (context) {
              logMessage += ` [${context}]`;
            }
            if (requestId) {
              logMessage += ` ${colorizeRequestId}[ReqID: ${requestId}]${resetColor}`;
            }

            logMessage += ` - ${message}`;

            if (Object.keys(metadata).length > 0) {
              logMessage += ` ${JSON.stringify(metadata, null, 2)}`;
            }
            return logMessage;
          },
        ),
      ),

      transports: [new winston.transports.Console()],
    });
  }

  log(message: string, context?: string, ...metadata: any[]) {
    const requestId = this.getRequestId();
    this.logger.log('info', message, { context, requestId, ...metadata });
  }

  error(message: string, trace: string, context?: string, ...metadata: any[]) {
    const requestId = this.getRequestId();
    this.logger.error(message, { trace, context, requestId, ...metadata });
  }

  warn(message: string, context?: string, ...metadata: any[]) {
    const requestId = this.getRequestId();
    this.logger.warn(message, { context, requestId, ...metadata });
  }

  debug(message: string, context?: string, ...metadata: any[]) {
    // super.debug(message, context);
    const requestId = this.getRequestId();
    this.logger.debug(message, { context, requestId, ...metadata });
  }

  private getRequestId(): string | void {
    if (this.config?.get('SET_REQID_IN_LOG'))
      return asyncLocalStorage.getStore()?.requestId;
    else return;
  }
}
