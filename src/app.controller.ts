import {
  Controller,
  Get,
  Version,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './core/decorators';
import { LOGGER_KEY } from './logger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_KEY) private readonly logger: LoggerService,
  ) {}
  /**
   * This is a hello handeler
   */
  @Public()
  @Get('/')
  @Version('1')
  getHello(): string {
    this.logger.log('hello');
    this.logger.log('hello');
    return this.appService.getHello();
  }
}
