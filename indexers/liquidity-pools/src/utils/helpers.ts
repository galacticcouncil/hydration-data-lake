import { ParsedEventsCallsData } from '../parsers/batchBlocksParser/types';
import lodashCamelCase from 'lodash.camelcase';
import { AppConfig } from '../appConfig';
import { CallOriginPartsDecorated, CallOriginRaw, NodeEnv } from './types';
import { join } from 'path';
import { hexToString, hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util';
import v8 from 'v8';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { pool } from '@galacticcouncil/sdk-next';
type Hop = pool.Hop;
import { HYDRADX_SS58_PREFIX } from './consts';
import { BigNumber, toFixedTrimmed } from './bignumber';
import crypto from 'node:crypto';
import { performance, monitorEventLoopDelay } from 'perf_hooks';
import { deepEqual } from 'fast-equals';
import { Asset } from '../model';
const hdl = monitorEventLoopDelay();
hdl.enable();

const appConfig = AppConfig.getInstance();

export function isNotNullOrUndefined<T extends Object>(
  input: null | undefined | T
): input is T {
  return input != null;
}

//TODO add additional sorting by eventIndexInBlock
export function getOrderedListByBlockNumber<T extends ParsedEventsCallsData>(
  eventsList: Array<T>
): Array<T> {
  return eventsList.sort((a, b) => {
    if (
      a.eventData.metadata.blockHeader.height <
      b.eventData.metadata.blockHeader.height
    ) {
      return -1;
    } else if (
      a.eventData.metadata.blockHeader.height >
      b.eventData.metadata.blockHeader.height
    ) {
      return 1;
    } else {
      // If blockHeader.height is the same, sort by indexInBlock
      return a.eventData.metadata.indexInBlock <
        b.eventData.metadata.indexInBlock
        ? -1
        : a.eventData.metadata.indexInBlock > b.eventData.metadata.indexInBlock
          ? 1
          : 0;
    }
  });
}

export function convertObjectPropsSnakeCaseToCamelCase<
  R extends Record<string, any>,
>(src: Record<string, any>): R {
  if (!src || typeof src !== 'object') return src;

  const decoratedResult: Record<string, any> = {};

  for (const propName in src) {
    decoratedResult[lodashCamelCase(propName)] = src[propName];
  }
  // TODO fix types
  // @ts-ignore
  return decoratedResult;
}

export function getEnvPath(subPath: string): string {
  return appConfig.NODE_ENV === NodeEnv.DEV
    ? join(process.cwd(), 'src/', subPath)
    : join(process.cwd(), 'lib/', subPath);
}

export function hexToStrWithNullCharCheck(str?: string) {
  if (!str) return str;
  const decorated = hexToString(str);
  return decorated.includes('\0') ? str : decorated;
}

export function getCallOriginParts(
  originData: CallOriginRaw
): CallOriginPartsDecorated {
  const result: CallOriginPartsDecorated = {
    kind: 'system',
  };
  if (!originData) return result;

  switch (originData.__kind) {
    case 'system': {
      result.kind = 'system';
      if (originData.value && originData.value.__kind === 'Signed') {
        result.valueKind = 'Signed';
        result.value = originData.value.value;
      }
    }
  }

  return result;
}

export function getTotalAvailableHeapSizeMb() {
  const heapStatistics = v8.getHeapStatistics();
  return heapStatistics.total_available_size / 1024 / 1024;
}

export function printV8MemoryHeap() {
  const heapStatistics = v8.getHeapStatistics();

  console.log('EventLoop delay (ms):', Number(hdl.mean) / 1e6);
  console.log(
    `Total available heap size: ${
      heapStatistics.total_available_size / 1024 / 1024
    } MB`
  );
  console.log(
    `Heap size limit: ${heapStatistics.heap_size_limit / 1024 / 1024} MB`
  );
}

export function isUnifiedEventsSupportSpecVersion(
  version: number,
  supportGenesisVersion: number
): boolean {
  if (!supportGenesisVersion || supportGenesisVersion < 0) return true;
  return version >= supportGenesisVersion;
}

export function jsonToString(src: any, fallbackResult = null) {
  if (!src) return fallbackResult;
  try {
    return JSON.stringify(src);
  } catch (e) {
    return fallbackResult;
  }
}

export function isU32(n: unknown) {
  return (
    typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 4294967295
  );
}

export function* splitIntoBatches<T>(
  list: T[],
  maxBatchSize: number
): Generator<T[]> {
  if (list.length <= maxBatchSize) {
    yield list;
  } else {
    let offset = 0;
    while (list.length - offset > maxBatchSize) {
      yield list.slice(offset, offset + maxBatchSize);
      offset += maxBatchSize;
    }
    yield list.slice(offset);
  }
}

export function bigintToNumberSafe(bigint: bigint | string) {
  const num = Number(bigint);
  if (!Number.isSafeInteger(num)) {
    throw new Error(
      'BigInt value is outside the safe integer range for Number'
    );
  }
  return num;
}

export function getAavePoolAddress(
  reserve: string | number,
  atoken: string | number,
  prefix?: number // HYDRADX_SS58_PREFIX
): string {
  // const id = `aave:` + reserve + '/' + atoken;
  const id = reserve + '/' + atoken;

  if (prefix) return encodeAddress(stringToU8a(id.padEnd(32, '\0')), prefix);

  return u8aToHex(decodeAddress(stringToU8a(id.padEnd(32, '\0'))));
}

export function publicKeyToSs58(
  key: string,
  prefix: number = HYDRADX_SS58_PREFIX
): string {
  return encodeAddress(hexToU8a(key), prefix);
}

export function fromExponentialToDecimalNotation(
  input: BigNumber | string,
  decimals: number
): BigNumber {
  return BigNumber(input).dividedBy(BigNumber(10).pow(decimals));
}
export function fromDecimalToExponentialNotation(
  input: BigNumber | string,
  decimals: number
): BigNumber {
  try {
    if (!input && input !== '0') {
      throw new Error(
        "Invalid input: 'input' cannot be null, undefined, or empty"
      );
    }

    const numericInput = BigNumber(input);

    if (!numericInput.isFinite() || numericInput.isNaN()) {
      throw new Error(
        `Invalid input: 'input' is not a finite number. Received: ${input}`
      );
    }

    if (!Number.isInteger(decimals) || decimals < 0) {
      throw new Error(
        `Invalid decimals: 'decimals' must be a non-negative integer. Received: ${decimals}`
      );
    }

    const result = numericInput.multipliedBy(BigNumber(10).pow(decimals));

    if (!result.isFinite() || result.isNaN()) {
      throw new Error(
        `Computation resulted in an invalid BigNumber: ${result}`
      );
    }

    return result;
  } catch (error) {
    console.error(
      // @ts-ignore
      `Error in fromDecimalToExponentialNotation: ${error?.message}`
    );
    throw error;
  }
}

export function stringToMd5Hash(str: string) {
  if (!str) throw new Error('String is empty');
  return crypto.createHash('md5').update(str).digest('hex');
}

export function isDeepEqual(a: any, b: any) {
  // return blockHash(a) === blockHash(b);
  return deepEqual(a, b);
}

export function getPriceRouteDecorated(route: Hop[]): string[][] {
  return route.map((hop) => [
    hop.poolAddress,
    hop.pool,
    String(hop.assetIn),
    String(hop.assetOut),
  ]);
}

export function calcPriceNormalized({
  amount,
  assetDecimals,
  spotPrice,
}: {
  amount: bigint;
  spotPrice: string;
  assetDecimals: number;
}): string {
  return toFixedTrimmed(
    fromExponentialToDecimalNotation(
      amount.toString(),
      assetDecimals
    ).multipliedBy(spotPrice)
  );
}

export async function tryExecOrReturnFallback<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  return fn().catch((e) => {
    console.error(e);
    return fallback;
  });
}

export function isValueMaxUint256(value: string) {
  const maxUint256 = BigInt('2') ** BigInt(256) - BigInt(1);
  return value >= maxUint256.toString();
}

export async function retryAsync<T>({
  fn,
  delay = 500,
  retries = appConfig.concurrency.EVM_CONTRACT_CALL_RETRIES,
  retryIf = () => true,
  passThrough = false,
  fallbackResponse,
  throwErrorOnRetriesLimit = false,
  tag,
}: {
  fn: () => Promise<T>;
  retries?: number;
  delay?: number;
  passThrough?: boolean;
  throwErrorOnRetriesLimit?: boolean;
  fallbackResponse: T;
  retryIf?: (error: any) => boolean;
  tag?: string;
}): Promise<T> {
  if (passThrough) return fn();

  const retiesLoopId = crypto.randomUUID();

  try {
    let attempt = 0;
    while (attempt <= retries) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        // if (attempt > retries || !retryIf(error)) throw error;
        if (attempt > retries) throw error;

        console.log(
          `${retiesLoopId} ${tag ? ` :: ${tag} ` : ''}:: Retrying... attempt ${attempt} failed `
        );
        // console.log(`Retrying... attempt ${attempt} failed with error:`, error);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } catch (e) {
    // @ts-ignore
    // console.log(e?.message);
    console.log(
      `${retiesLoopId} ${tag ? ` :: ${tag} ` : ''}:: Retries loop finished with unresolved error.`
    );
  }

  if (throwErrorOnRetriesLimit) {
    throw new Error(`${retiesLoopId} Exceeded retry attempts`);
  } else {
    return fallbackResponse;
  }
}

export function bigintToStringAllKeys(maybeObj: any): any {
  if (maybeObj === null || maybeObj === undefined) {
    return maybeObj;
  }

  if (typeof maybeObj === 'bigint') {
    return maybeObj.toString();
  }

  if (Array.isArray(maybeObj)) {
    return maybeObj.map((item: any) => bigintToStringAllKeys(item));
  }

  if (typeof maybeObj === 'object') {
    const result: any = {};
    for (const key in maybeObj) {
      if (maybeObj.hasOwnProperty(key)) {
        result[key] = bigintToStringAllKeys(maybeObj[key]);
      }
    }
    return result;
  }

  return maybeObj;
}

export function anyToStringAllKeys(maybeObj: any): any {
  if (maybeObj === null || maybeObj === undefined) {
    return maybeObj;
  }

  if (typeof maybeObj === 'bigint' || typeof maybeObj === 'number') {
    return maybeObj.toString();
  }

  if (Array.isArray(maybeObj)) {
    return maybeObj.map((item: any) => anyToStringAllKeys(item));
  }

  if (typeof maybeObj === 'object') {
    const result: any = {};
    for (const key in maybeObj) {
      if (maybeObj.hasOwnProperty(key)) {
        result[key] = anyToStringAllKeys(maybeObj[key]);
      }
    }
    return result;
  }

  return maybeObj;
}

export function getOmnipoolLiquidityPositionPriceDecorated(
  priceParts: bigint[]
) {
  try {
    return BigInt(
      fromDecimalToExponentialNotation(
        BigNumber(priceParts[0]).div(priceParts[1]),
        18
      ).toFixed(0)
    );
  } catch (e) {
    console.log(e);
  }
  return 0n;
}

export function getXykpoolShareTokenDecimals({
  poolAssets,
}: {
  poolAssets: Asset[];
}) {
  const [assetA, assetB] = poolAssets;
  if (!assetA.decimals || !assetB.decimals)
    throw new Error('Pool assets must have decimals');

  return Number(assetA.id) > Number(assetB.id)
    ? assetB.decimals!
    : assetA.decimals!;
}

export function batchArray<T>(array: T[], batchSize: number): T[][] {
  if (batchSize <= 0) {
    throw new Error('Batch size must be greater than 0');
  }

  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

export function mergeUniqueArrayItems<T>(
  current: T[] | undefined,
  incoming: Iterable<T>
): T[] {
  const set = new Set(current ?? []);
  for (const item of incoming) {
    if (!!item) set.add(item);
  }
  return Array.from(set.values());
}
