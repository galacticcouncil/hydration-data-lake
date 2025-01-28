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

  // TODO should be refactored
  //
  // static getDcaDataFromOperationId(
  //   operationId: string
  // ): OperationStackElementDca | null {
  //   const parsedSegments = operationId.split('/');
  //   let index = 0;
  //   for (const segment of parsedSegments) {
  //     const segmentParts = segment.split(':');
  //     if (segmentParts[0] === SwappedExecutionTypeKind.DCA)
  //       return new OperationStackElementDca({
  //         index,
  //         kind: SwappedExecutionTypeKind.DCA,
  //         scheduleId: +segmentParts[1],
  //         incrementalId: +segmentParts[2],
  //       });
  //     index++;
  //   }
  //
  //   return null;
  // }
  //
  // static containsExecutionType(
  //   operationId: string,
  //   executionType: SwappedExecutionTypeKind
  // ): boolean {
  //   if (!operationId) return false;
  //   const regex = new RegExp(`${executionType}:`);
  //   return regex.test(operationId);
  // }
  //
  // static getOperationStackElement(
  //   srcElement: AmmSupportSwappedExecutionType,
  //   index: number
  // ) {
  //   switch (srcElement.kind) {
  //     case SwappedExecutionTypeKind.Batch:
  //       return new OperationStackElementBatch({
  //         index,
  //         kind: srcElement.kind,
  //         incrementalId: srcElement.value as number,
  //       });
  //     case SwappedExecutionTypeKind.Omnipool:
  //       return new OperationStackElementOmnipool({
  //         index,
  //         kind: srcElement.kind,
  //         incrementalId: srcElement.value as number,
  //       });
  //     case SwappedExecutionTypeKind.Router:
  //       return new OperationStackElementRouter({
  //         index,
  //         kind: srcElement.kind,
  //         incrementalId: srcElement.value as number,
  //       });
  //     case SwappedExecutionTypeKind.XcmExchange:
  //       return new OperationStackElementXcmExchange({
  //         index,
  //         kind: srcElement.kind,
  //         incrementalId: srcElement.value as number,
  //       });
  //     case SwappedExecutionTypeKind.DCA: {
  //       const val = srcElement.value as [number, number];
  //       return new OperationStackElementDca({
  //         index,
  //         kind: srcElement.kind,
  //         scheduleId: val[0],
  //         incrementalId: val[1],
  //       });
  //     }
  //     case SwappedExecutionTypeKind.Xcm: {
  //       const val = srcElement.value as [string, number];
  //       return new OperationStackElementXcm({
  //         index,
  //         kind: srcElement.kind,
  //         message: val[0],
  //         incrementalId: val[1],
  //       });
  //     }
  //     default:
  //       throw Error(`Unknown operation stack element kind: ${srcElement.kind}`);
  //   }
  // }

  // static getNewOperationStack({
  //   stack,
  // }: {
  //   stack: AmmSupportSwappedExecutionType[];
  // }) {
  //   if (!stack || stack.length === 0) return null;
  //
  //   const newEntity = new OperationStack({
  //     id: this.operationStackToString(stack),
  //     stackElements: stack.map(
  //       (segment, index) =>
  //         this.getOperationStackElement(segment, index) as OperationStackElement
  //     ),
  //   });
  //
  //   return newEntity;
  // }
  //
  // static async saveOperationStackEntities(ctx: SqdProcessorContext<Store>) {
  //   const state = ctx.batchState.state;
  //
  //   await ctx.store.upsert([...state.operationStacks.values()].reverse());
  // }
}
