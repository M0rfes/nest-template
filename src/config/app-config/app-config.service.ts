import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../env.validation';

@Injectable()
export class AppConfigService extends ConfigService<
  EnvironmentVariables,
  true
> {}
