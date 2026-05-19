import { BroadcastSwappedExecutionType } from '../parsers/types/events';
import * as crypto from 'node:crypto';
import { SwappedExecutionTypeKind } from '../utils/types';

export class OperationStackManager {
  static operationStackToString(
    srcStack: BroadcastSwappedExecutionType[]
  ): string {
    const resultSegmentsList = [];

    for (const stackSegment of srcStack) {
      switch (stackSegment.kind) {
        case SwappedExecutionTypeKind.Batch:
        case SwappedExecutionTypeKind.Omnipool:
        case SwappedExecutionTypeKind.Router:
        case SwappedExecutionTypeKind.XcmExchange:
          resultSegmentsList.push(`${stackSegment.kind}:${stackSegment.value}`);
          break;
        case SwappedExecutionTypeKind.DCA: {
          const val = stackSegment.value as [number, number];
          resultSegmentsList.push(`${stackSegment.kind}:${val[0]}:${val[1]}`);
          break;
        }
        case SwappedExecutionTypeKind.Xcm: {
          const val = stackSegment.value as [string, number];
          resultSegmentsList.push(
            `${stackSegment.kind}:${crypto.createHash('md5').update(val[0]).digest('hex')}:${val[1]}`
          );
          break;
        }
      }
    }

    if (resultSegmentsList.length === 0) {
      console.dir(srcStack, { depth: null });
      throw Error(`OperationStack has been converted with error.`);
    }

    return resultSegmentsList.join('/');
  }

  static containsExecutionType(
    operationId: string,
    executionType: SwappedExecutionTypeKind
  ): boolean {
    if (!operationId) return false;
    const regex = new RegExp(`${executionType}:`);
    return regex.test(operationId);
  }

  static getRouterIncrementalIdFromOperationId(
    operationId: string
  ): string | null {
    const parsedSegments = operationId.split('/');
    for (const segment of parsedSegments) {
      const segmentParts = segment.split(':');
      if (segmentParts[0] === SwappedExecutionTypeKind.Router)
        return segmentParts[1];
    }

    return null;
  }
  static getOminpoolIncrementalIdFromOperationId(
    operationId: string
  ): string | null {
    const parsedSegments = operationId.split('/');
    for (const segment of parsedSegments) {
      const segmentParts = segment.split(':');
      if (segmentParts[0] === SwappedExecutionTypeKind.Omnipool)
        return segmentParts[1];
    }

    return null;
  }
}
