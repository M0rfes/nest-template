import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from './logger/logger.service';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const swagerConfig = new DocumentBuilder()
    .setTitle('nestjs template example')
    .setDescription('The nestjs template API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swagerConfig);
  SwaggerModule.setup('doc', app, document);

  const config = app.get(ConfigService);

  await app.listen(config.get('PORT'));
}
bootstrap();
