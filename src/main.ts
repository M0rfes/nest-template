import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppConfigService } from './config/app-config/app-config.service';
import { JwtAuthGuard, RolesGuard } from './core/guards';
import { ResponseInterceptor, HttpExceptionFilter } from './core/interceptors';
import { version, description, name } from '../package.json';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const baseUrl = '/api';
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const config = app.get(AppConfigService);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix(baseUrl);
  setupGlobalSetups(app);
  setupRateLimit(app, config);
  app.use(helmet());
  app.useLogger(app.get(Logger));
  setupSwagger(app, config);

  await app.listen(config.get('PORT'));
  const logger = app.get(Logger);
  logger.log(`Server is running on: http://localhost:${config.get('PORT')}`);
}

function setupGlobalSetups(app: INestApplication) {
  const moduleRef = app.select(AppModule);
  const reflector = moduleRef.get(Reflector);
  app.useGlobalInterceptors(
    new ResponseInterceptor(reflector),
    new ClassSerializerInterceptor(reflector),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}

function setupSwagger(app: INestApplication, config: AppConfigService) {
  if (config.get('NODE_ENV') === 'dev') {
    const swagerConfig = new DocumentBuilder()
      .setTitle(name)
      .setDescription(description)
      .setVersion(version)
      .build();
    const document = SwaggerModule.createDocument(app, swagerConfig);
    SwaggerModule.setup('doc', app, document);
  }
}

function setupRateLimit(app: INestApplication, config: AppConfigService) {
  if (config.get('RATE_LIMIT_ENABLED')) {
    app.use(
      rateLimit({
        windowMs: config.get('RATE_LIMIT_WINDOW_MS'),
        max: config.get('RATE_LIMIT_MAX'),
      }),
    );
  }
}
bootstrap();
