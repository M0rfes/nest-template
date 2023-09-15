import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import helmet from 'helmet';
import * as morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppConfigService } from './config/app-config/app-config.service';
import { JwtAuthGuard, RolesGuard } from './core/guards';
import { ResponseInterceptor, HttpExceptionFilter } from './core/interceptors';

import { asyncStorageMiddleware } from './middlwares/async-storage.middleware';
import { CustomLoggerService } from './logger';

async function bootstrap() {
  const baseUrl = '/api';
  const app = await NestFactory.create(AppModule);
  // use this if default nest logs to use your custom logger
  app.useLogger(app.get(CustomLoggerService));

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix(baseUrl);
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
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );
  app.use(morgan('combined'));
  app.use(helmet());

  // app.use(AsyncLocalStorageMiddleware);

  const config = app.get(AppConfigService);
  if (config.get('NODE_ENV') === 'dev') {
    const swagerConfig = new DocumentBuilder()
      .setTitle('nestjs template example')
      .setDescription('The nestjs template API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swagerConfig);
    SwaggerModule.setup('doc', app, document);
  }

  if (config.get('SET_REQID_IN_LOG')) {
    app.use(asyncStorageMiddleware);
  }

  await app.listen(config.get('PORT'));
}

// const asyncStorageMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   // use x-request-id or fallback to a nanoid
//   const requestId: string = req.headers['x-request-id'] || Math.random();
//   // every other Koa middleware will run within the AsyncLocalStorage context
//   await asyncLocalStorage.run({ requestId }, async () => {
//     return next();
//   });
// };

bootstrap();
