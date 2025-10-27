import { transformAndValidateSync } from 'class-transformer-validator';
import 'reflect-metadata';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsBoolean,
  ValidationError,
  IsEnum,
} from 'class-validator';
import dotenv from 'dotenv';

import {
  calls as hydrationCalls,
  events as hydrationEvents,
} from './parsers/chains/hydration/typegenTypes';
import {
  calls as hydrationPaseoCalls,
  events as hydrationPaseoEvents,
} from './parsers/chains/hydration-paseo/typegenTypes';
import {
  calls as hydrationPaseoNextCalls,
  events as hydrationPaseoNextEvents,
} from './parsers/chains/hydration-paseo-next/typegenTypes';
import { ChainName, MultiFlowProcessingPhase, NodeEnv } from './utils/types';
import { isHex } from '@polkadot/util';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: (() => {
      let envFileName = '.env.hydration';

      if (process.env.CHAIN === 'hydration') envFileName = '.env.hydration';
      if (process.env.CHAIN === 'hydration_paseo')
        envFileName = '.env.hydration-paseo';
      if (process.env.CHAIN === 'hydration_paseo_next')
        envFileName = '.env.hydration-paseo-next';

      switch (process.env.NODE_ENV as NodeEnv) {
        case NodeEnv.TEST:
          envFileName = envFileName + '.test';
          break;
        default:
          envFileName = envFileName + '.local';
      }

      console.log(`${__dirname}/../${envFileName}`);

      return `${__dirname}/../${envFileName}`;
    })(),
  });
} else {
  dotenv.config();
}

class LogConfig {
  private static instance: LogConfig;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly HLOG_LOG_FILE_ENABLED: boolean = false;

  @IsString()
  readonly HLOG_LOG_FILE_PATH: string = './logs/app.log';

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly HLOG_CONSOLE_LOGS_ENABLED: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly HLOG_CONSOLE_LOGS_VERBOSE: boolean = false;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly HLOG_DB_FLUSH_ENABLED: boolean = false;

  @Transform(({ value }: { value: string }) => +value)
  readonly HLOG_DB_FLUSH_MAX_BATCH_SIZE: number = 100;

  @Transform(({ value }: { value: string }) => +value)
  readonly HLOG_DB_FLUSH_INTERVAL_MS: number = 1000;

  static getInstance(): LogConfig {
    if (LogConfig.instance) return LogConfig.instance;

    try {
      LogConfig.instance = transformAndValidateSync(LogConfig, process.env, {
        validator: { stopAtFirstError: true },
      });
      return LogConfig.instance;
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
  readonly EVM_CONTRACT_CALL_RETRIES: number = 2;

  @Transform(({ value }: { value: string }) => +value)
  readonly RUNTIME_API_CALLS_CONCURRENCY: number = 50;

  static getInstance(): ConcurrencyConfig {
    if (ConcurrencyConfig.instance) return ConcurrencyConfig.instance;

    try {
      ConcurrencyConfig.instance = transformAndValidateSync(
        ConcurrencyConfig,
        process.env,
        {
          validator: { stopAtFirstError: true },
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

class RedisConfig {
  private static instance: RedisConfig;

  @Transform(({ value }: { value: string }) => +value)
  readonly TIME_SERIES_DATA_SCRAPPER_TIMEOUT_MS: number = 5_000;

  static getInstance(): RedisConfig {
    if (RedisConfig.instance) return RedisConfig.instance;

    try {
      RedisConfig.instance = transformAndValidateSync(
        RedisConfig,
        process.env,
        {
          validator: { stopAtFirstError: true },
        }
      );
      return RedisConfig.instance;
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

  @IsNotEmpty()
  @IsString()
  readonly HSMPOOL_FICILITATOR_ADDRESS: string =
    '0x6d6f646c70792f68736d6f640000000000000000';

  @IsNotEmpty()
  @IsString()
  readonly HOLLAR_CONTRACT_ADDRESS: string =
    '0x531a654d1696ed52e7275a8cede955e82620f99a';

  static getInstance(): EvmConfig {
    if (EvmConfig.instance) return EvmConfig.instance;

    try {
      EvmConfig.instance = transformAndValidateSync(EvmConfig, process.env, {
        validator: { stopAtFirstError: true },
      });
      return EvmConfig.instance;
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

class ProcessingModeConfig {
  private static instance: ProcessingModeConfig;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly ALL_IN_ONE_PROCESSOR_MODE: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly ALL_IN_ONE_MULTI_FLOW_PROCESSOR_MODE: boolean = false;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly SIMPLIFIED_PROCESSING: boolean = false;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly REAGGREGATION_PROCESSING_MODE: boolean = false;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly IS_CORE_PROCESSOR: boolean = false;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly IS_SPOT_PRICES_PROCESSOR: boolean = false;

  @IsEnum(MultiFlowProcessingPhase)
  readonly MULTI_FLOW_PROCESSING_PHASE: MultiFlowProcessingPhase =
    MultiFlowProcessingPhase.INITIAL;

  static getInstance(): ProcessingModeConfig {
    if (ProcessingModeConfig.instance) return ProcessingModeConfig.instance;

    try {
      ProcessingModeConfig.instance = transformAndValidateSync(
        ProcessingModeConfig,
        process.env,
        {
          validator: { stopAtFirstError: true },
        }
      );
      return ProcessingModeConfig.instance;
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

  @IsNotEmpty()
  readonly CHAIN!: ChainName;

  @Transform(({ value }: { value: string }) => +value)
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
  readonly DB_PORT: number = 5432;

  @Transform(({ value }: { value: string }) => +value)
  readonly DB_ACTION_RETRIES_NUMBER: number = 3;

  @Transform(({ value }: { value: string }) => +value)
  readonly DB_ACTION_RETRIES_BASE_DELAY_MS: number = 50;

  @Transform(({ value }: { value: string }) => +value)
  readonly DB_ACTION_RETRIES_MAX_DELAY_MS: number = 1000;

  @Transform(({ value }: { value: string }) => +value)
  readonly DB_ACTION_MAX_BATCH_SIZE: number = 2500;

  @Transform(({ value }: { value: string }) => +value)
  readonly DB_POOL_MAX_SIZE: number = 2;

  @IsNotEmpty()
  readonly ORCHESTRATOR_QUEUE_REDIS_HOST: string = 'localhost';

  @IsNotEmpty()
  readonly ORCHESTRATOR_QUEUE_REDIS_PASS: string = 'orchestra';

  @Transform(({ value }: { value: string }) => +value)
  readonly ORCHESTRATOR_QUEUE_REDIS_PORT: number = 6379;

  @IsNotEmpty()
  readonly TS_REDIS_HOST: string = 'localhost';

  @IsNotEmpty()
  readonly TS_REDIS_PASS: string = 'orchestra';

  @Transform(({ value }: { value: string }) => +value)
  readonly TS_REDIS_PORT: number = 6379;

  @Transform(({ value }: { value: string }) => +value)
  readonly TS_REDIS_KEY_SPACE_ID: number = 3;

  /**
   * RPC endpoint URL (either http(s) or ws(s))
   */
  readonly RPC_URL: string | null = null;

  readonly RPC_URL_HTTPS: string | null = null;

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
  readonly RPC_REQUEST_TIMEOUT: number = 30_000;

  readonly ASSET_HUB_RPC_URL: string =
    'wss://polkadot-asset-hub-rpc.polkadot.io';

  @Transform(({ value }: { value: string }) => +value)
  readonly ASSET_HIST_DATA_TS_PULLING_BATCH_SIZE: number = 1000;

  @Transform(({ value }: { value: string }) => +value)
  readonly MAX_JOB_BATCH_SIZE: number = 10;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PERSIST_HIST_DATA_ONLY_ON_CHANGE: boolean = false;

  @IsNotEmpty()
  @IsString()
  readonly INDEXER_ID!: string;

  @IsString()
  readonly STATE_SCHEMA_NAME: string = 'squid_processor';

  @Transform(({ value }: { value: string }) => {
    if (value.length === 0) return ['squid_processor'];
    return value.split(';');
  })
  SUB_PROCESSOR_SCHEMAS: string[] = ['squid_processor'];

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly INDEXING_IS_PAUSED: boolean = false;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly IGNORE_ARCHIVE_DATA_SOURCE: boolean = false;

  readonly GATEWAY_HYDRATION_HTTPS: string | null = null;

  @Transform(({ value }: { value: string }) => +value)
  readonly PROCESS_FROM_BLOCK: number = 0;

  @Transform(({ value }: { value: string }) => +value)
  readonly PROCESS_TO_BLOCK: number = -1;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_LBP_POOLS: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_XYK_POOLS: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_OMNIPOOLS: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_STABLEPOOLS: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_DCA: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PROCESS_OTC: boolean = true;

  @IsString()
  readonly OMNIPOOL_ADDRESS: string =
    '0x6d6f646c6f6d6e69706f6f6c0000000000000000000000000000000000000000';

  @IsString()
  readonly HSMPOOL_ADDRESS: string =
    '0x6d6f646c70792f68736d6f640000000000000000000000000000000000000000';

  @IsString()
  readonly OMNIPOOL_PROTOCOL_ASSET_ID: string = '1';

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly USE_STORAGE_DICTIONARY: boolean = true;

  @IsString()
  readonly STORAGE_DICTIONARY_LBPPOOL_URL: string = '';

  @IsString()
  readonly STORAGE_DICTIONARY_XYKPOOL_URL: string = '';

  @IsString()
  readonly STORAGE_DICTIONARY_OMNIPOOL_URL: string = '';

  @IsString()
  readonly STORAGE_DICTIONARY_STABLEPOOL_URL: string = '';

  @IsString()
  readonly STORAGE_DICTIONARY_GEN_HIST_DATA_URL: string = '';

  @IsString()
  readonly STORAGE_DICTIONARY_ACCOUNT_HIST_DATA_URL: string = '';

  @Transform(({ value }: { value: string }) => +value)
  readonly STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE: number = 300;

  @IsString()
  readonly SUBSCAN_PRO_API_SECRET: string = '';

  @Transform(({ value }: { value: string }) => value.split('::'))
  @IsArray()
  readonly SUBSCAN_PROXY_API_CORS_ALLOWED_SUFFIXES: string[] = [];

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly SUBSCAN_PROXY_API_CORS_ALLOW_LOCALHOST: boolean = true;

  @Transform(({ value }: { value: string }) => +value)
  readonly UNIFIED_EVENTS_GENESIS_SPEC_VERSION: number = -1;

  @Transform(({ value }: { value: string }) => +value)
  readonly ASSETS_ACTUALISATION_BLOCKS_PERIOD: number = 3000;

  @Transform(({ value }: { value: string }) => +value)
  readonly API_CACHE_TTL_MS: number = 600000;

  @Transform(({ value }: { value: string }) => +value)
  readonly HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE: number = 300;

  /**
   * Can be configured to "false" in case normal mono-processor run. In normal
   * processing flow spot price calculation requires data which already must be
   * existing in current batch cache. If processing is happening in multiple
   * processors of multiple layers, this variable must be set to "true", to be
   * sure that all required for spot price data are existing in cache.
   *
   */
  @Transform(({ value }: { value: string }) => value === 'true')
  readonly ENSURE_PREFETCH_PERSISTENT_DATA_FOR_SPOT_PRICE: boolean = true;

  @Transform(({ value }: { value: string }) =>
    value.split(',').filter((id) => !Number.isNaN(+id) || isHex(id))
  )
  readonly ASSET_SPOT_PRICE_ASSET_OUT_IDS: string[] = ['10'];

  @Transform(({ value }: { value: string }) => value)
  readonly ASSET_PRICE_BASE_ASSET_ID: string = '10';

  @Transform(
    ({ value }: { value: string }) =>
      new Set(value.split(',').filter((id) => !Number.isNaN(+id) || isHex(id)))
  )
  readonly ARTIFICIAL_OMNIPOOL_ASSET_IDS_SET: Set<string> = new Set([
    '0x34d5ffb83d14d82f87aaf2f13be895a3c814c2ad',
    '34',
    '1000765',
    '103',
    '110',
    '111',
    '112',
    '113',
    '15',
    '19',
    '22',
    '420',
    '5',
    '690',
  ]);

  @Transform(({ value }: { value: string }) => value)
  readonly XYKPOOL_ASSET_PRICE_INTERIM_ASSET_ID: string = '5';

  @Transform(({ value }: { value: string }) => value)
  readonly XYKPOOL_ASSET_PRICE_FALLBACK_INTERIM_ASSET_ID: string = '0';

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly USE_XYKPOOLS_DATA_IN_TRADE_ROUTER: boolean = false;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly USE_HIST_DATA_FROM_REDIS_TIME_SERIES: boolean = true;

  readonly concurrency: ConcurrencyConfig = new ConcurrencyConfig();

  readonly redis: RedisConfig = new RedisConfig();

  readonly evm: EvmConfig = new EvmConfig();

  readonly log: LogConfig = LogConfig.getInstance();

  readonly processingMode: ProcessingModeConfig =
    ProcessingModeConfig.getInstance();

  static getInstance(): AppConfig {
    if (AppConfig.instance) return AppConfig.instance;
    try {
      AppConfig.instance = transformAndValidateSync(AppConfig, process.env, {
        validator: { stopAtFirstError: true },
      });
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
    let events = null;
    switch (this.CHAIN) {
      case ChainName.hydration:
        events = hydrationEvents;
        break;
      case ChainName.hydration_paseo:
        events = hydrationPaseoEvents;
        break;
      case ChainName.hydration_paseo_next:
        events = hydrationPaseoNextEvents;
        break;
      default:
        return [];
    }

    const eventsToListen = [
      events.assetRegistry.registered.name,
      events.assetRegistry.updated.name,
      events.assetRegistry.locationSet.name,
      // events.broadcast.swapped.name,
      events.evm.log.name,
      events.evmAccounts.bound.name,

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

      events.duster.dusted.name,
    ];

    if (
      this.CHAIN === ChainName.hydration ||
      this.CHAIN === ChainName.hydration_paseo
    ) {
      eventsToListen.push(hydrationEvents.broadcast.swapped.name);
      eventsToListen.push(hydrationEvents.broadcast.swapped2.name);
      eventsToListen.push(hydrationEvents.broadcast.swapped3.name);
    }

    if (this.CHAIN === ChainName.hydration_paseo_next) {
      eventsToListen.push(hydrationPaseoNextEvents.broadcast.swapped3.name);
    }

    if (this.PROCESS_LBP_POOLS) {
      eventsToListen.push(
        ...[
          events.lbp.poolCreated.name,
          events.lbp.poolUpdated.name,
          events.lbp.buyExecuted.name,
          events.lbp.sellExecuted.name,
        ]
      );
    }
    if (this.PROCESS_XYK_POOLS) {
      eventsToListen.push(
        ...[
          events.xyk.poolCreated.name,
          events.xyk.poolDestroyed.name,
          events.xyk.buyExecuted.name,
          events.xyk.sellExecuted.name,
        ]
      );
    }
    if (this.PROCESS_OMNIPOOLS) {
      eventsToListen.push(
        ...[
          events.omnipool.tokenAdded.name,
          events.omnipool.tokenRemoved.name,
          events.omnipool.buyExecuted.name,
          events.omnipool.sellExecuted.name,
        ]
      );
    }
    if (this.PROCESS_STABLEPOOLS) {
      eventsToListen.push(
        ...[
          events.stableswap.poolCreated.name,
          events.stableswap.liquidityAdded.name,
          events.stableswap.liquidityRemoved.name,
          events.stableswap.buyExecuted.name,
          events.stableswap.sellExecuted.name,
        ]
      );
    }
    if (this.PROCESS_DCA) {
      eventsToListen.push(
        ...[
          events.dca.scheduled.name,
          events.dca.completed.name,
          events.dca.executionPlanned.name,
          events.dca.executionStarted.name,
          events.dca.tradeExecuted.name,
          events.dca.tradeFailed.name,
          events.dca.randomnessGenerationFailed.name,
          events.dca.terminated.name,
        ]
      );
    }
    if (this.PROCESS_OTC) {
      eventsToListen.push(
        ...[
          events.otc.placed.name,
          events.otc.filled.name,
          events.otc.cancelled.name,
          events.otc.partiallyFilled.name,
        ]
      );
    }

    return eventsToListen;
  }

  getCallsToListen() {
    let calls = null;
    switch (this.CHAIN) {
      case ChainName.hydration:
        calls = hydrationCalls;
        break;
      case ChainName.hydration_paseo:
        calls = hydrationPaseoCalls;
        break;
      case ChainName.hydration_paseo_next:
        calls = hydrationPaseoNextCalls;
        break;
      default:
        return [];
    }

    const callsToListen = [
      calls.utility.forceBatch.name,
      calls.utility.batch.name,
      calls.utility.batchAll.name,

      calls.parachainSystem.setValidationData.name,
      calls.router.sell.name,
      calls.router.buy.name,
      calls.lbp.buy.name,
      calls.lbp.sell.name,
      calls.xyk.buy.name,
      calls.xyk.sell.name,
      calls.stableswap.buy.name,
      calls.stableswap.sell.name,
      calls.omnipool.buy.name,
      calls.omnipool.sell.name,
      calls.balances.forceSetBalance.name,
      calls.balances.forceAdjustTotalIssuance.name,
      calls.balances.forceTransfer.name,
      calls.balances.forceUnreserve.name,
      calls.balances.transferAll.name,
      calls.balances.transferAllowDeath.name,
      calls.balances.transferKeepAlive.name,
      calls.balances.upgradeAccounts.name,

      calls.tokens.transfer.name,
      calls.tokens.transferAll.name,
      calls.tokens.transferKeepAlive.name,
      calls.tokens.forceTransfer.name,
      calls.tokens.setBalance.name,

      // calls.omnipoolLiquidityMining.claimRewards.name,
      // calls.omnipoolLiquidityMining.createGlobalFarm.name,
      // calls.omnipoolLiquidityMining.createYieldFarm.name,
      // calls.omnipoolLiquidityMining.depositShares.name,
      // calls.omnipoolLiquidityMining.redepositShares.name,
      // calls.omnipoolLiquidityMining.resumeYieldFarm.name,
      // calls.omnipoolLiquidityMining.stopYieldFarm.name,
      // calls.omnipoolLiquidityMining.terminateGlobalFarm.name,
      // calls.omnipoolLiquidityMining.terminateYieldFarm.name,
      // calls.omnipoolLiquidityMining.updateGlobalFarm.name,
      // calls.omnipoolLiquidityMining.updateYieldFarm.name,
      // calls.omnipoolLiquidityMining.withdrawShares.name,
    ];

    if (this.CHAIN === ChainName.hydration) {
      callsToListen.push(hydrationCalls.sudo.sudo.name);
      callsToListen.push(hydrationCalls.sudo.sudoAs.name);
      callsToListen.push(hydrationCalls.sudo.setKey.name);
      callsToListen.push(hydrationCalls.sudo.sudoUncheckedWeight.name);
      callsToListen.push(hydrationCalls.balances.transfer.name);
      callsToListen.push(hydrationCalls.balances.setBalanceDeprecated.name);
      callsToListen.push(hydrationCalls.balances.setBalance.name);
    }

    if (this.PROCESS_LBP_POOLS) {
      callsToListen.push(...[calls.lbp.createPool.name]);
    }
    if (this.PROCESS_XYK_POOLS) {
      callsToListen.push(...[calls.xyk.createPool.name]);
    }

    return callsToListen;
  }
}
