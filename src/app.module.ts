import { Module, ModuleMetadata } from '@nestjs/common';
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
import { SentryModule } from '@ntegral/nestjs-sentry';
import dotenv from 'dotenv';
dotenv.config();

const imports: ModuleMetadata['imports'] = [
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
];

if (process.env.NODE_ENV === 'SENTRY_DSN') {
  imports.push(
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: AppConfigService) => ({
        dsn: config.get('SENTRY_DSN'),
        debug: config.get('SENTRY_DEBUG'),
        environment: config.get('SENTRY_ENV'),
        release: config.get('SENTRY_RELEASE'), // must create a release in sentry.io dashboard
        logLevels: config.get('SENTRY_LOG_LEVELS'), //based on sentry.io loglevel //
      }),
      inject: [ConfigService],
    }),
  );
}

@Module({
  imports,
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
