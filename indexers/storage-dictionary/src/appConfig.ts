import { transformAndValidateSync } from 'class-transformer-validator';
import 'reflect-metadata';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, ValidationError } from 'class-validator';
import dotenv from 'dotenv';

import { NodeEnv } from './utils/types';

dotenv.config();

export class AppConfig {
  private static instance: AppConfig;

  @IsNotEmpty()
  readonly NODE_ENV!: NodeEnv;

  @Transform(({ value }: { value: string }) => +value)
  @IsNotEmpty()
  readonly GQL_PORT: number = 8080;

  readonly BASE_PATH?: string;

  @IsNotEmpty()
  readonly DB_HOST: string = 'localhost';

  @IsNotEmpty()
  readonly DB_NAME: string = 'postgres';

  @IsNotEmpty()
  readonly DB_USER: string = 'postgres';

  @IsNotEmpty()
  readonly DB_PASS: string = 'postgres';

  @Transform(({ value }: { value: string }) => +value)
  @IsNotEmpty()
  readonly DB_PORT: number = 5432;

  @IsNotEmpty()
  readonly RPC_HYDRATION_URL!: string;

  @IsNotEmpty()
  readonly GATEWAY_HYDRATION_HTTPS!: string;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsNotEmpty()
  readonly PROCESS_LBP_POOLS!: boolean;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsNotEmpty()
  readonly PROCESS_XYK_POOLS!: boolean;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsNotEmpty()
  readonly PROCESS_OMNIPOOLS!: boolean;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsNotEmpty()
  readonly PROCESS_STABLEPOOLS!: boolean;

  @IsNotEmpty()
  @IsString()
  readonly OMNIPOOL_ADDRESS!: string;

  @Transform(({ value }: { value: string }) => +value)
  readonly START_BLOCK?: number;

  @Transform(({ value }: { value: string }) => +value)
  readonly END_BLOCK?: number;

  @IsNotEmpty()
  readonly STATE_SCHEMA_NAME: string = 'squid_processor';

  @Transform(({ value }: { value: string }) => value.split(','))
  @IsNotEmpty()
  readonly ALL_STATE_SCHEMAS_LIST: string[] = ['squid_processor'];

  @Transform(({ value }: { value: string }) => +value)
  @IsNotEmpty()
  readonly INDEXER_MAX_SUB_BATCH_SIZE: number = 1500;

  @Transform(({ value }: { value: string }) => +value)
  @IsNotEmpty()
  readonly SUB_BATCH_MAX_TIMEOUT_MS: number = 500;

  @Transform(({ value }: { value: string }) => +value)
  readonly INDEXER_SUB_PROCESSORS_NUMBER: number = 5;

  @Transform(
    ({ value }: { value: string }) =>
      new Map(
        value.split(';').map((str) => {
          const parsedRange = str.split(':');
          return [
            parsedRange[0],
            { from: +parsedRange[1], to: +parsedRange[2] },
          ];
        })
      )
  )
  readonly SUB_PROCESSORS_RANGES: Map<string, { from: number; to: number }> =
    new Map();

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    try {
      return transformAndValidateSync(AppConfig, process.env, {
        validator: { stopAtFirstError: true },
      });
    } catch (errors) {
      if (Array.isArray(errors) && errors[0] instanceof ValidationError) {
        errors.forEach((error: ValidationError) => {
          // @ts-ignore
          Object.values(error.constraints).forEach((msg) => console.error(msg));
        });
      } else {
        console.error('Unexpected error during the environment validation');
      }
      throw new Error('Failed to validate environment variables');
    }
  }
}
