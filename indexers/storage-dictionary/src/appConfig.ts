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
import { events } from './typegenTypes';

import { NodeEnv } from './utils/types';

dotenv.config({
  path: (() => {
    let envFileName = '.env.hydration';

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

class EvmConfig {
  private static instance: EvmConfig;

  @IsNotEmpty()
  @IsString()
  readonly ATOKEN_CONTRACT_ADDRESS: string =
    '0xc0DF4c545BaFA1788a4Ee55f79704D12fC2c7B5C';

  @IsNotEmpty()
  @IsString()
  readonly UI_POOL_DATA_PROVIDER_CONTRACT_ADDRESS: string =
    '0x112b087b60C1a166130d59266363C45F8aa99db0';

  @IsNotEmpty()
  @IsString()
  readonly POOL_ADDRESS_PROVIDER_CONTRACT_ADDRESS: string =
    '0xf3Ba4D1b50f78301BDD7EAEa9B67822A15FCA691';

  @IsNotEmpty()
  @IsString()
  readonly POOL_IMPLEMENTATION_PROXY_CONTRACT_ADDRESS: string =
    '0x1b02e051683b5cfac5929c25e84adb26ecf87b38';

  static getInstance(): EvmConfig {
    if (!EvmConfig.instance) {
      EvmConfig.instance = new EvmConfig();
    }
    try {
      return transformAndValidateSync(EvmConfig, process.env, {
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

class ConcurrencyConfig {
  private static instance: ConcurrencyConfig;

  @Transform(({ value }: { value: string }) => +value)
  readonly ASYNC_OPERATIONS_CONCURRENCY_COMMON: number = 50;

  @Transform(({ value }: { value: string }) => +value)
  readonly EVM_CONTRACT_CALL_CONCURRENCY: number = 250;

  @Transform(({ value }: { value: string }) => +value)
  readonly RUNTIME_API_CALLS_CONCURRENCY: number = 50;

  @Transform(({ value }: { value: string }) => +value)
  readonly EVM_CONTRACT_CALL_RETRIES: number = 2;

  // static getInstance(): ConcurrencyConfig {
  //   if (!ConcurrencyConfig.instance) {
  //     ConcurrencyConfig.instance = new ConcurrencyConfig();
  //   }
  //   try {
  //     return transformAndValidateSync(ConcurrencyConfig, process.env, {
  //       validator: { stopAtFirstError: true },
  //     });
  //   } catch (errors) {
  //     if (Array.isArray(errors) && errors[0] instanceof ValidationError) {
  //       errors.forEach((error: ValidationError) => {
  //         // @ts-ignore
  //         Object.values(error.constraints).forEach((msg) => console.error(msg));
  //       });
  //     } else {
  //       console.error('Unexpected error during the environment validation');
  //     }
  //     throw new Error('Failed to validate environment variables');
  //   }
  // }

  static getInstance(): ConcurrencyConfig {
    if (ConcurrencyConfig.instance) return ConcurrencyConfig.instance;

    try {
      ConcurrencyConfig.instance = transformAndValidateSync(
        ConcurrencyConfig,
        process.env,
        {
          validator: { stopAtFirstError: true, whitelist: true },
        }
      );
      return ConcurrencyConfig.instance;
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

  readonly RPC_URL_HTTPS: string | null = null;

  /**
   * Maximum number of ongoing concurrent requests (default 10)
   */
  readonly RPC_CAPACITY: number = 6;
  /**
   * Maximum number of requests per second
   */
  readonly RPC_RATE_LIMIT: number = 500;
  /**
   * Maximum number of requests in a single batch call
   */
  readonly RPC_MAX_BATCH_CALL_SIZE: number = 1_000;
  /**
   * Request timeout in ms
   */
  readonly RPC_REQUEST_TIMEOUT: number = 20_000;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly INDEXING_IS_PAUSED: boolean = false;

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

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_GENERIC_HIST_DATA: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_ACCOUNTS: boolean = true;

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
  readonly SUB_BATCH_MAX_TIMEOUT_MS: number = 1000;

  @Transform(({ value }: { value: string }) => +value)
  readonly INDEXER_SUB_PROCESSORS_NUMBER: number = 1;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly ASSETS_TRACKER_PROCESSOR: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_ONLY_MISSED_BLOCKS: boolean = false;

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

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PERSIST_HIST_DATA_ONLY_ON_CHANGE: boolean = false;

  @Transform(({ value }: { value: string }) => +value)
  readonly ASYNC_OPERATIONS_CONCURRENCY_COMMON: number = 100;

  @Transform(
    ({ value }: { value: string }) =>
      new Set(
        value
          .split(',')
          .filter((str) => !!str && str.length > 0 && str.startsWith('0x'))
      )
  )
  BLACKLISTED_ASSET_IDS: Set<string> = new Set([
    '0x2514a429e5f6ae70806ccf4a0657bfc926b498dd',
    '0x32a8090e20748e530670ff520c4abc903db7e127',
    '0x34321cb7334807eb718b3e1ddfaeb0c6c0403f1a',
    '0x5c2209375bbf32ac443ba9f10b9a7558cd7f99e6',
    '0x6bc2a0ac2495c0cdf5116d0df5d8052fccbc4d4e',
    '0x6efd31920f48d9e82ae262c9c6bd7660fb807a8a',
    '0x89c28953e5aa32fa61cd2314868461b77b3d88e7',
    '0xa8733d52c53ec96e44dd171dc6c2bff4f8132947',
    '0xf006621efdc155f5996c3afa23f5a6379c578010',
    '0xfb2e66d76d2841443ab41102369ff33df9bc9a93',
  ]);

  readonly evm: EvmConfig = new EvmConfig();

  readonly concurrency: ConcurrencyConfig = new ConcurrencyConfig();

  static getInstance(): AppConfig {
    if (AppConfig.instance) return AppConfig.instance;

    try {
      AppConfig.instance = transformAndValidateSync(AppConfig, process.env, {
        validator: { stopAtFirstError: true },
      });

      if (
        !AppConfig.instance.SUB_PROCESSORS_RANGES ||
        AppConfig.instance.SUB_PROCESSORS_RANGES.size === 0
      ) {
        AppConfig.instance.SUB_PROCESSORS_RANGES = new Map([
          [
            AppConfig.instance.STATE_SCHEMA_NAME,
            {
              from: AppConfig.instance.PROCESS_FROM_BLOCK,
              to: AppConfig.instance.PROCESS_TO_BLOCK,
            },
          ],
        ]);
      }

      return AppConfig.instance;
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

  getEventsToListen() {
    const eventsToListen = [
      events.relayChainInfo.currentBlockNumbers.name,

      events.evm.log.name,

      events.currencies.balanceUpdated.name,
      events.currencies.deposited.name,
      events.currencies.withdrawn.name,
      events.currencies.transferred.name,

      events.tokens.balanceSet.name,
      events.tokens.deposited.name,
      events.tokens.dustLost.name,
      events.tokens.endowed.name,
      events.tokens.issued.name,
      events.tokens.locked.name,
      events.tokens.lockRemoved.name,
      events.tokens.lockSet.name,
      events.tokens.rescinded.name,
      events.tokens.reserved.name,
      events.tokens.reserveRepatriated.name,
      events.tokens.slashed.name,
      events.tokens.totalIssuanceSet.name,
      events.tokens.transfer.name,
      events.tokens.unlocked.name,
      events.tokens.unreserved.name,
      events.tokens.withdrawn.name,

      events.balances.balanceSet.name,
      events.balances.burned.name,
      events.balances.deposit.name,
      events.balances.dustLost.name,
      events.balances.endowed.name,
      events.balances.frozen.name,
      events.balances.issued.name,
      events.balances.locked.name,
      events.balances.minted.name,
      events.balances.rescinded.name,
      events.balances.reserved.name,
      events.balances.reserveRepatriated.name,
      events.balances.reserved.name,
      events.balances.slashed.name,
      events.balances.suspended.name,
      events.balances.thawed.name,
      events.balances.totalIssuanceForced.name,
      events.balances.transfer.name,
      events.balances.unlocked.name,
      events.balances.unreserved.name,
      events.balances.upgraded.name,
      events.balances.withdraw.name,
    ];

    return eventsToListen;
  }
}
