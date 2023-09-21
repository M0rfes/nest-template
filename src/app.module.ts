import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Logger } from './logger/logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { validateENV } from './config/env.validation';
import { AppConfigService } from './config/app-config/app-config.service';
import { JwtAuthGuard } from './core/guards/auth.guard';
import { RolesGuard } from './core/guards';
import { ResponseInterceptor, HttpExceptionFilter } from './core/interceptors';
import { JwtStrategy } from './core/stratiges';
import { JwtModule } from '@nestjs/jwt';
import { BasicCommand } from './app.command';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateENV,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXP_IN') },
        global: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BasicCommand,
    Logger,
    AppConfigService,
    JwtAuthGuard,
    RolesGuard,
    ResponseInterceptor,
    HttpExceptionFilter,
    JwtStrategy,
  ],
})
export class AppModule {}
