import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
dotenvConfig({ path: '.env' });

const config: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [path.join(__dirname, 'public/entities/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'public/migrations/*{.ts,.js}')],
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
