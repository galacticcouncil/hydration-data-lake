import { transformAndValidateSync } from 'class-transformer-validator';
import 'reflect-metadata';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, ValidationError } from 'class-validator';
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

// dotenv.config();

dotenv.config({
  path: (() => {
    let envFileName = '.env';
    if (process.env.CHAIN === 'hydration') envFileName = '.env.hydration';
    if (process.env.CHAIN === 'hydration_paseo')
      envFileName = '.env.hydration-paseo';
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

  readonly GATEWAY_HYDRATION_HTTPS: string | null = null;

  @Transform(({ value }: { value: string }) => +value)
  readonly INDEX_FROM_BLOCK: number = 0;

  @Transform(({ value }: { value: string }) => +value)
  readonly INDEX_TO_BLOCK: number | null = null;

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

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsNotEmpty()
  readonly USE_STORAGE_DICTIONARY!: boolean;

  @IsNotEmpty()
  @IsString()
  readonly HYDRATION_STORAGE_DICTIONARY_LBPPOOL_URL!: string;

  @IsNotEmpty()
  @IsString()
  readonly HYDRATION_STORAGE_DICTIONARY_XYKPOOL_URL!: string;

  @IsNotEmpty()
  @IsString()
  readonly HYDRATION_STORAGE_DICTIONARY_OMNIPOOL_URL!: string;

  @IsNotEmpty()
  @IsString()
  readonly HYDRATION_STORAGE_DICTIONARY_STABLEPOOL_URL!: string;

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
      default:
        return [];
    }

    const eventsToListen = [
      events.balances.transfer.name,
      events.tokens.transfer.name,
      events.assetRegistry.registered.name,
      events.assetRegistry.updated.name,
    ];

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
      default:
        return [];
    }

    const callsToListen = [calls.parachainSystem.setValidationData.name];

    if (this.PROCESS_LBP_POOLS) {
      callsToListen.push(...[calls.lbp.createPool.name]);
    }
    if (this.PROCESS_XYK_POOLS) {
      callsToListen.push(...[calls.xyk.createPool.name]);
    }

    return callsToListen;
  }
}
