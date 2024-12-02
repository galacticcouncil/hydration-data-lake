import { transformAndValidateSync } from 'class-transformer-validator';
import 'reflect-metadata';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  ValidationError,
  IsPositive,
} from 'class-validator';
import dotenv from 'dotenv';

import { NodeEnv } from './utils/types';

dotenv.config({
  path: (() => {
    let envFileName = '.env';

    switch (process.env.NODE_ENV as NodeEnv) {
      case NodeEnv.TEST:
        envFileName = envFileName + '.test';
        break;
      default:
        envFileName = envFileName + '.local';
    }

    return `${__dirname}/../${envFileName}`;
  })(),
});

export class AppConfig {
  private static instance: AppConfig;

  @IsNotEmpty()
  readonly NODE_ENV!: NodeEnv;

  @Transform(({ value }: { value: string }) => +value)
  readonly GQL_PORT: number = 8090;

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
  readonly DB_PORT: number = 5432;

  /**
   * RPC endpoint URL (either http(s) or ws(s))
   */
  readonly RPC_URL: string | null = null;

  /**
   * Maximum number of ongoing concurrent requests
   */
  readonly RPC_CAPACITY: number = 1_000;
  /**
   * Maximum number of requests per second
   */
  readonly RPC_RATE_LIMIT: number = 1_000;
  /**
   * Maximum number of requests in a single batch call
   */
  readonly RPC_MAX_BATCH_CALL_SIZE: number = 1_000;
  /**
   * Request timeout in ms
   */
  readonly RPC_REQUEST_TIMEOUT: number = 3_000;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly IGNORE_ARCHIVE_DATA_SOURCE: boolean = false;

  readonly GATEWAY_HYDRATION_HTTPS: string | null = null;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_LBP_POOLS: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_XYK_POOLS: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_OMNIPOOLS: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_STABLEPOOLS: boolean = true;

  @IsString()
  readonly OMNIPOOL_ADDRESS: string =
    '0x6d6f646c6f6d6e69706f6f6c0000000000000000000000000000000000000000';

  @Transform(({ value }: { value: string }) => +value)
  readonly PROCESS_FROM_BLOCK: number = 0;

  @Transform(({ value }: { value: string }) => +value)
  readonly PROCESS_TO_BLOCK: number = -1;

  @IsNotEmpty()
  readonly STATE_SCHEMA_NAME: string = 'squid_processor';

  @IsNotEmpty()
  readonly ASSETS_ACTUALISATION_PROC_STATE_SCHEMA_NAME: string =
    'squid_processor';

  @Transform(({ value }: { value: string }) => +value)
  @IsNotEmpty()
  readonly INDEXER_MAX_SUB_BATCH_SIZE: number = 1500;

  @Transform(({ value }: { value: string }) => +value)
  @IsNotEmpty()
  readonly SUB_BATCH_MAX_TIMEOUT_MS: number = 500;

  @Transform(({ value }: { value: string }) => +value)
  readonly INDEXER_SUB_PROCESSORS_NUMBER: number = 1;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly ASSETS_TRACKER_PROCESSOR: boolean = true;

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
  SUB_PROCESSORS_RANGES: Map<string, { from: number; to: number }> = new Map();

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    try {
      const config = transformAndValidateSync(AppConfig, process.env, {
        validator: { stopAtFirstError: true },
      });

      if (
        !config.SUB_PROCESSORS_RANGES ||
        config.SUB_PROCESSORS_RANGES.size === 0
      ) {
        config.SUB_PROCESSORS_RANGES = new Map([
          [
            config.STATE_SCHEMA_NAME,
            { from: config.PROCESS_FROM_BLOCK, to: config.PROCESS_TO_BLOCK },
          ],
        ]);
      }

      return config;
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
