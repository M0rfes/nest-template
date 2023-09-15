import { Module, Provider } from '@nestjs/common';

import { TsLogLoggerService } from './tslog-logger.service';
import {
  LoggerService,
  //  LogLevel,
} from '@nestjs/common';

// todo
const loggerType = 'ts';

export const LOGGER_KEY = 'LOGGER_KEY';

export const MyLogger: Provider<LoggerService> = {
  provide: LOGGER_KEY,
  useFactory: () => {
    if (loggerType === 'ts') {
      return new TsLogLoggerService();
      // } else if (loggerType === 'winston') {
      //   return new WinstonLoggerService();
    } else {
      throw new Error(`Unsupported logger type: ${loggerType}`);
    }
  },
};

@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule {}
