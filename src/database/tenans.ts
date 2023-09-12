import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import * as path from 'path';
dotenvConfig({ path: '.env' });
import conf from './typeorm';
import { DataSource } from 'typeorm';

const config = {
  ...conf(),
  entities: [path.join(__dirname, 'tenancy/entities/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'tenancy/migrations/*{.ts,.js}')],
};

export default registerAs('tenans', () => config);
export const connectionSource = new DataSource(config);
