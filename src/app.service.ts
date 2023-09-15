import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from './logger';

@Injectable()
export class AppService {
  constructor(private readonly logger: CustomLoggerService) {}

  getHello(): string {
    this.logger.log('hello', 'AppService', {
      a: 'b',
    });
    return 'Hello World!';
  }
}
