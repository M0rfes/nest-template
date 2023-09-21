import { Transform, Type, plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export enum EnvironmentType {
  Dev = 'dev',
  Prod = 'prod',
}

export class EnvironmentVariables {
  @IsEnum(EnvironmentType)
  NODE_ENV: EnvironmentType;

  @IsNumber()
  @Type(() => Number)
  PORT: number;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXP_IN: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  RATE_LIMIT_MAX = 900000;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  RATE_LIMIT_WINDOW_MS = 10;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  RATE_LIMIT_ENABLED = true;
}

export function validateENV(configuration: Record<string, unknown>) {
  const finalConfig = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig);

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return finalConfig;
}
