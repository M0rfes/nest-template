import { Injectable, LoggerService, Inject } from '@nestjs/common';
import { LOGGER_KEY } from './logger';

@Injectable()
export class AppService {
  constructor(@Inject(LOGGER_KEY) private readonly logger: LoggerService) {}

  getHello(): string {
    this.logger.log('hello');
    return 'Hello World!';
  }
}
