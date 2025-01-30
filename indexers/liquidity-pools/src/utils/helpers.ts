import { ParsedEventsCallsData } from '../parsers/batchBlocksParser/types';
import lodashCamelCase from 'lodash.camelcase';
import { AppConfig } from '../appConfig';
import { CallOriginPartsDecorated, CallOriginRaw, NodeEnv } from './types';
import { join } from 'path';
import { hexToString } from '@polkadot/util';
import v8 from 'v8';

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
