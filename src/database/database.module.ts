import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentType } from 'src/config/env.validation';
import { DataSource } from 'typeorm';
import dbConf from './typeorm';
const databaseProviders = [
  {
    provide: DataSource,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const dataSource = new DataSource({
        ...dbConf(),
        logging: config.get('NODE_ENV') === EnvironmentType.Dev,
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
