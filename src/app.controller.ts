import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './core/decorators';
import { CustomLoggerService } from './logger/winston-logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: CustomLoggerService,
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
