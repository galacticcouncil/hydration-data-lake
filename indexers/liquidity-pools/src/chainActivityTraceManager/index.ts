import { Call, ProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Extrinsic as ExtrinsicEntity,
  Call as CallEntity,
  Event as EventEntity,
  Block as BlockEntity,
  ChainActivityTrace,
  Account,
  AccountChainActivityTrace,
  TraceEntityType,
} from '../model';
import { getCallOriginParts } from '../utils/helpers';
import { getAccount } from '../handlers/accounts';
import { EventPhase, TraceIdEventGroup, TraceIdContext } from '../utils/types';

export class ChainActivityTraceManager {
  static _traceIdPrefix = 'trace-id:';
  constructor(private ctx: ProcessorContext<Store>) {}

  static async processExtrinsics(ctx: ProcessorContext<Store>) {
    const state = ctx.batchState.state;

    const blocksToSave: BlockEntity[] = [];
    const extrinsicsToSave: ExtrinsicEntity[] = [];
    const callsToSave: CallEntity[] = [];
    const tracesToSave: ChainActivityTrace[] = [];

    const getOrCreateChainActivityTrace = (id: string, block: BlockEntity) => {
      let activityTraceEntity = state.chainActivityTraces.get(id);

      if (!activityTraceEntity) {
        activityTraceEntity = new ChainActivityTrace({
          id: id,
          operationIds: [],
          traceIds: [],
          participants: [],
          createdAtParaChainBlockHeight: block.paraChainBlockHeight,
          createdAtBlock: block,
        });
        state.chainActivityTraces.set(
          activityTraceEntity.id,
          activityTraceEntity
        );
        tracesToSave.push(activityTraceEntity);
      }

      return activityTraceEntity;
    };

    for (const block of ctx.blocks) {
      let blockEntity = state.batchBlocks.get(block.header.id);

      if (!blockEntity) {
        blockEntity = new BlockEntity({
          id: block.header.id,
          relayChainBlockHeight: block.header.height,
          paraChainBlockHeight: block.header.height,
          paraChainBlockHash: block.header.hash,
          paraChainBlockTimestamp: block.header.timestamp
            ? new Date(block.header.timestamp)
            : new Date(),
        });
        state.batchBlocks.set(blockEntity.id, blockEntity);
        blocksToSave.push(blockEntity);
      }

      for (const extrinsic of block.extrinsics) {
        let extrinsicEntity = state.batchExtrinsics.get(extrinsic.id);

        if (!extrinsicEntity) {
          extrinsicEntity = new ExtrinsicEntity({
            id: extrinsic.id,
            hash: extrinsic.hash,
            paraChainBlockHeight: blockEntity.paraChainBlockHeight,
            block: blockEntity,
          });
          state.batchExtrinsics.set(extrinsicEntity.id, extrinsicEntity);
          extrinsicsToSave.push(extrinsicEntity);
        }

        let activityTraceEntity = getOrCreateChainActivityTrace(
          extrinsic.id,
          blockEntity
        );

        const callEntitiesMap = new Map<
          string,
          { call: CallEntity; parent?: CallEntity }
        >();

        for (const subcall of extrinsic.subcalls) {
          const item: { call: Call; parent?: Call } = { call: subcall };

          try {
            item.parent = subcall.getParentCall();
          } catch (e) {}

          const callEntityOriginData = getCallOriginParts(subcall.origin);
          const callEntity = callEntitiesMap.has(subcall.id)
            ? callEntitiesMap.get(subcall.id)!.call
            : new CallEntity({
                id: subcall.id,
                name: subcall.name,
                entityTypes: this.getEntityTypesByCallName(subcall.name),
                subcalls: [],
                originKind: callEntityOriginData.kind,
                originValueKind: callEntityOriginData.valueKind,
                originValue: callEntityOriginData.value,
                extrinsic: extrinsicEntity,
                paraChainBlockHeight: subcall.block.height,
                block: blockEntity,
              });

          let callParentEntity: CallEntity | undefined = undefined;

          if (item.parent && callEntitiesMap.has(item.parent.id)) {
            callParentEntity = callEntitiesMap.get(item.parent.id)!.call;
          } else if (item.parent && !callEntitiesMap.has(item.parent.id)) {
            const callParentEntityOriginData = getCallOriginParts(
              item.parent.origin
            );

            callParentEntity = new CallEntity({
              id: item.parent.id,
              name: item.parent.name,
              entityTypes: this.getEntityTypesByCallName(item.parent.name),
              subcalls: [],
              originKind: callParentEntityOriginData.kind,
              originValueKind: callParentEntityOriginData.valueKind,
              originValue: callParentEntityOriginData.value,
              extrinsic: extrinsicEntity,
              paraChainBlockHeight: item.parent.block.height,
              block: blockEntity,
            });
          }

          callEntity.parent = callParentEntity ?? null;
          if (!!callParentEntity) callParentEntity.subcalls.push(callEntity);

          callEntitiesMap.set(callEntity.id, {
            call: callEntity,
            parent: callParentEntity,
          });
        }

        const rootCall = [...callEntitiesMap.values()].find(
          (call) => !call.parent
        );

        if (!rootCall) continue;

        if (
          rootCall.call.originValueKind === 'Signed' &&
          rootCall.call.originValue
        )
          activityTraceEntity.originator = await getAccount(
            ctx,
            rootCall.call.originValue
          );

        const callsSequenceToSave = new Map<
          number,
          { index: number; list: CallEntity[] }
        >();

        const generateCallTraceId = (
          call: CallEntity,
          parentIdPrefix: string,
          levelIndex: number
        ) => {
          call.traceId = this.getTraceId(parentIdPrefix, call.id);

          if (!callsSequenceToSave.has(levelIndex)) {
            callsSequenceToSave.set(levelIndex, {
              index: levelIndex,
              list: [call],
            });
          } else {
            callsSequenceToSave.get(levelIndex)!.list.push(call);
          }

          if (call.subcalls.length === 0) return;

          for (const subcall of call.subcalls) {
            generateCallTraceId(subcall, call.traceId, levelIndex + 1);
          }
        };

        generateCallTraceId(
          rootCall.call,
          this.traceIdPrefixWithContext(TraceIdContext.call),
          1
        );

        const orderedCallsToSave = [...callsSequenceToSave.values()].sort(
          (a, b) => b.index - a.index
        );

        const extrinsicCallsToSave = orderedCallsToSave
          .map((group) => group.list)
          .flat();

        extrinsicCallsToSave.forEach((call) =>
          activityTraceEntity.traceIds.push(call.traceId)
        );

        callsToSave.push(...extrinsicCallsToSave);

        for (const callToSave of callsToSave) {
          state.batchCalls.set(callToSave.id, callToSave);
        }
      }

      for (const event of block.events) {
        let eventEntity = state.batchEvents.get(event.id);

        if (!eventEntity) {
          let eventCall = null;
          try {
            const eventCallId = event.getCall().id;
            eventCall = state.batchCalls.get(eventCallId);
          } catch (e) {}

          eventEntity = new EventEntity({
            id: event.id,
            traceId: this.getTraceId(
              this.traceIdPrefixWithContext(TraceIdContext.event),
              [
                this.eventTraceIdRoot(blockEntity.id, event.name, event.phase),
                event.index.toString(),
              ]
            ),
            indexInBlock: event.index,
            name: event.name,
            phase: event.phase,
            entityTypes: this.getEntityTypesByEventName(event.name),
            call: eventCall,
            paraChainBlockHeight: block.header.height,
            block: blockEntity,
          });
          state.batchEvents.set(eventEntity.id, eventEntity);

          if (!eventCall) {
            const activityTraceEntity = getOrCreateChainActivityTrace(
              this.eventTraceIdRoot(blockEntity.id, event.name, event.phase),
              blockEntity
            );

            activityTraceEntity.traceIds = [
              ...new Set([
                ...activityTraceEntity.traceIds,
                eventEntity.traceId,
              ]).values(),
            ];
          }
        }
      }
    }

    ctx.batchState.state = {
      batchExtrinsics: state.batchExtrinsics,
      batchBlocks: state.batchBlocks,
      batchCalls: state.batchCalls,
      batchEvents: state.batchEvents,
      chainActivityTraces: state.chainActivityTraces,
    };
  }

  static async addParticipantsToActivityTrace({
    traceId,
    participants,
    ctx,
  }: {
    traceId: string;
    participants: Account[];
    ctx: ProcessorContext<Store>;
  }) {
    if (participants.length === 0) return;
    const state = ctx.batchState.state;
    const participantsSet = new Set(participants.map((p) => p.id));
    const traceIdRoot = this.getTraceIdRoot(traceId);

    if (!traceIdRoot) return;

    const chainActivityTrace = state.chainActivityTraces.get(traceIdRoot);

    if (!chainActivityTrace) return;

    const participantsToIgnore = new Set(
      [...state.accountChainActivityTraces.values()]
        .filter(
          (accActivity) =>
            (participantsSet.has(accActivity.account.id) ||
              participantsSet.has(
                accActivity.chainActivityTrace.originator?.id || ''
              )) &&
            accActivity.chainActivityTrace.id === traceIdRoot
        )
        .map((accActivity) => accActivity.account.id)
    );

    for (const account of participants.filter(
      (p) => !participantsToIgnore.has(p.id)
    )) {
      const newAccountActivity = new AccountChainActivityTrace({
        id: `${account.id}-${chainActivityTrace.id}`,
        account,
        chainActivityTrace,
      });
      state.accountChainActivityTraces.set(
        newAccountActivity.id,
        newAccountActivity
      );
    }
  }

  static async saveActivityTraceEntities(ctx: ProcessorContext<Store>) {
    const state = ctx.batchState.state;

    await ctx.store.upsert([...state.batchBlocks.values()]);
    await ctx.store.upsert([...state.batchExtrinsics.values()]);
    await ctx.store.upsert([...state.batchCalls.values()]);
    await ctx.store.upsert([...state.batchEvents.values()]);
    await ctx.store.upsert([...state.chainActivityTraces.values()]);
    await ctx.store.upsert([...state.accountChainActivityTraces.values()]);
  }

  static traceIdPrefixWithContext(traceIdOrigin: TraceIdContext) {
    return `${this._traceIdPrefix}//context:${traceIdOrigin}`;
  }

  static eventTraceIdRoot(
    rootSrc: string,
    eventName: string,
    phase: EventPhase
  ) {
    const getGroupForApplyExtrinsicPhase = () => {
      switch (eventName) {
        // TODO Add conditional select of appropriate group
        default:
          return `${rootSrc}:${TraceIdEventGroup.extrinsic}`;
      }
    };
    const getGroupForInitializationPhase = () => {
      switch (eventName) {
        // TODO Add conditional select of appropriate group
        default:
          return `${rootSrc}:${TraceIdEventGroup.init}`;
      }
    };
    const getGroupForFinalizationPhase = () => {
      switch (eventName) {
        // TODO Add conditional select of appropriate group
        default:
          return `${rootSrc}:${TraceIdEventGroup.buyback}`;
      }
    };

    switch (phase) {
      case 'Initialization':
        return getGroupForInitializationPhase();
      case 'ApplyExtrinsic':
        return getGroupForApplyExtrinsicPhase();
      case 'Finalization':
        return getGroupForFinalizationPhase();
      default:
        throw new Error(`Unknown phase: ${eventName}`);
    }
  }

  static getEntityTypesByCallName(callName: string) {
    switch (callName) {
      case 'Router.sell':
      case 'Router.buy':
      case 'Xyk.sell':
      case 'Xyk.buy':
      case 'Lbp.sell':
      case 'Lbp.buy':
      case 'Stableswap.sell':
      case 'Stableswap.buy':
      case 'Omnipool.sell':
      case 'Omnipool.buy':
        return [TraceEntityType.SWAP];
    }

    return null;
  }

  static getEntityTypesByEventName(eventName: string) {
    switch (eventName) {
      case 'XYK.SellExecuted':
      case 'XYK.BuyExecuted':
      case 'Lbp.SellExecuted':
      case 'Lbp.BuyExecuted':
      case 'Stableswap.SellExecuted':
      case 'Stableswap.BuyExecuted':
      case 'Omnipool.SellExecuted':
      case 'Omnipool.BuyExecuted':
        return [TraceEntityType.SWAP];
      case 'Tokens.Transfer':
      case 'Balances.Transfer':
        return [TraceEntityType.TRANSFER];
      case 'Stableswap.LiquidityAdded':
        return [TraceEntityType.STABLEPOOL_LIQUIDITY_ACTION];
    }

    return null;
  }

  static getTraceId(prefix: string, currentPart: string | string[]) {
    return `${prefix}/${Array.isArray(currentPart) ? currentPart.join('/') : currentPart}`;
  }

  static getTraceIdRoot(src: string) {
    const match = src.match(
      /trace-id:\/\/context:(?:call|event)\/([a-zA-Z0-9-:]+)/
    );
    return match ? match[1] : null;
  }

  static async getTraceIdByCallId(
    callId: string,
    ctx: ProcessorContext<Store>
  ) {
    const { batchCalls } = ctx.batchState.state;
    const traceId = batchCalls.get(callId)?.traceId;

    if (traceId) return traceId;

    const savedCall = await ctx.store.findOne(CallEntity, {
      where: {
        id: callId,
      },
    });
    if (!savedCall)
      throw Error(
        `Call with ID ${callId} has not been found neither in batch state or DB.`
      );

    return savedCall.traceId;
  }

  static async getTraceIdByEventId(
    eventId: string,
    ctx: ProcessorContext<Store>
  ) {
    const { batchEvents } = ctx.batchState.state;
    const traceId = batchEvents.get(eventId)!.traceId;

    return traceId;
  }
}
