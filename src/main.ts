import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from './logger/logger.service';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.validation';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(new ValidationPipe({ transform: true, whitelist: true }));

  const config = app.get(ConfigService<EnvironmentVariables, true>);
  if (config.get('NODE_ENV') === 'dev') {
    const swagerConfig = new DocumentBuilder()
      .setTitle('nestjs template example')
      .setDescription('The nestjs template API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swagerConfig);
    SwaggerModule.setup('doc', app, document);
  }

  await app.listen(config.get('PORT'));
}
bootstrap();
