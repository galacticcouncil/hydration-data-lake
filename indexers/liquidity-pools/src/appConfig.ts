import { transformAndValidateSync } from 'class-transformer-validator';
import 'reflect-metadata';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsBoolean,
  ValidationError,
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
import { ChainName, NodeEnv } from './utils/types';
import { isHex } from '@polkadot/util';

dotenv.config({
  path: (() => {
    let envFileName = '.env.hydration';

    if (process.env.CHAIN === 'hydration') envFileName = '.env.hydration';
    if (process.env.CHAIN === 'hydration_paseo')
      envFileName = '.env.hydration-paseo';
    // if (process.env.CHAIN === 'hydration_paseo_next')
    //   envFileName = '.env.hydration-paseo-next';

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

  @Transform(({ value }: { value: string }) => +value)
  readonly ASSET_HIST_DATA_TS_PULLING_BATCH_SIZE: number = 1000;

  @Transform(({ value }: { value: string }) => +value)
  readonly MAX_JOB_BATCH_SIZE: number = 10;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly PERSIST_HIST_DATA_ONLY_ON_CHANGE: boolean = false;

  @IsNotEmpty()
  @IsString()
  readonly INDEXER_ID!: string;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly ALL_IN_ONE_PROCESSOR_MODE: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly IS_CORE_PROCESSOR: boolean = false;

  @Transform(({ value }: { value: string }) => value === 'true')
  readonly IS_SPOT_PRICES_PROCESSOR: boolean = false;

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
  readonly ARTIFICIAL_OMNIPOOL_ASSET_IDS_SET: Set<string> = [
    '0x34d5ffb83d14d82f87aaf2f13be895a3c814c2ad',
  ];

  @Transform(({ value }: { value: string }) => value)
  readonly XYKPOOL_ASSET_PRICE_INTERIM_ASSET_ID: string = '5';

  @Transform(({ value }: { value: string }) => value)
  readonly XYKPOOL_ASSET_PRICE_FALLBACK_INTERIM_ASSET_ID: string = '0';

  @Transform(({ value }: { value: string }) => +value)
  readonly ASYNC_OPERATIONS_CONCURRENCY_COMMON: number = 50;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly USE_XYKPOOLS_DATA_IN_TRADE_ROUTER: boolean = false;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES: boolean = true;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  readonly USE_HIST_DATA_FROM_REDIS_TIME_SERIES: boolean = true;

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

  getEventsToListen() {
    let events = null;
    switch (this.CHAIN) {
      case ChainName.hydration:
        events = hydrationEvents;
        break;
      case ChainName.hydration_paseo:
        events = hydrationPaseoEvents;
        break;
      // case ChainName.hydration_paseo_next:
      //   events = hydrationPaseoNextEvents;
      //   break;
      default:
        return [];
    }

    const eventsToListen = [
      events.balances.transfer.name,
      events.tokens.transfer.name,
      events.currencies.transferred.name,
      events.assetRegistry.registered.name,
      events.assetRegistry.updated.name,
      events.assetRegistry.locationSet.name,
      events.broadcast.swapped.name,
      events.evm.log.name,
      events.evmAccounts.bound.name,
    ];

    if (this.CHAIN === ChainName.hydration) {
      eventsToListen.push(hydrationEvents.broadcast.swapped2.name);
      eventsToListen.push(hydrationEvents.broadcast.swapped3.name);
    }

    // if (this.CHAIN === ChainName.hydration_paseo_next) {
    //   eventsToListen.push(hydrationPaseoNextEvents.ammSupport.swapped.name);
    // }

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
      // case ChainName.hydration_paseo_next:
      //   calls = hydrationPaseoNextCalls;
      //   break;
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
