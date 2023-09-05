import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from 'src/config/app-config/app-config.service';
import { EnvironmentType } from 'src/config/env.validation';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as path from 'path';

const databaseProviders = [
  {
    provide: DataSource,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: AppConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        poolSize: config.get('POOL_SIZE'),
        logging: config.get('NODE_ENV') === EnvironmentType.Dev,
        namingStrategy: new SnakeNamingStrategy(),
        entities: [path.join(__dirname, 'entities/*.entity{.ts,.js}')],
        migrations: [path.join(__dirname + 'migrations/*{.ts,.js}')],
        schema: 'public',
      });
      return dataSource.initialize();
    },
  },
];

@Global()
@Module({
  imports: [],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
