import { ParsedEventsCallsData } from '../parsers/batchBlocksParser/types';
import lodashCamelCase from 'lodash.camelcase';
import { AppConfig } from '../appConfig';
import { NodeEnv } from './types';
import { join } from 'path';
import { hexToString } from '@polkadot/util';

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
