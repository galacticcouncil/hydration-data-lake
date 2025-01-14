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
  EventGroup,
  DcaSchedule,
} from '../model';
import { getCallOriginParts } from '../utils/helpers';
import { getAccount } from '../handlers/accounts';
import { EventPhase, TraceIdEventGroup, TraceIdContext } from '../utils/types';
import { FindOptionsRelations, In } from 'typeorm';
import { EventName } from '../parsers/types/events';

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
          associatedAccountsFlat: [],
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
          const subcallRawData: { call: Call; parent?: Call } = {
            call: subcall,
          };

          try {
            const subcallParent = subcall.getParentCall();
            subcallRawData.parent =
              subcallParent && subcallParent.id !== subcall.id
                ? subcallParent
                : undefined;
          } catch (e) {}

          const callEntityOriginData = getCallOriginParts(subcall.origin);
          const callEntity = callEntitiesMap.has(subcall.id)
            ? callEntitiesMap.get(subcall.id)!.call
            : new CallEntity({
                id: subcall.id,
                name: subcall.name,
                success: subcall.success,
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

          if (
            subcallRawData.parent &&
            callEntitiesMap.has(subcallRawData.parent.id)
          ) {
            callParentEntity = callEntitiesMap.get(
              subcallRawData.parent.id
            )!.call;
          } else if (
            subcallRawData.parent &&
            !callEntitiesMap.has(subcallRawData.parent.id)
          ) {
            const callParentEntityOriginData = getCallOriginParts(
              subcallRawData.parent.origin
            );

            callParentEntity = new CallEntity({
              id: subcallRawData.parent.id,
              name: subcallRawData.parent.name,
              success: subcallRawData.parent.success,
              entityTypes: this.getEntityTypesByCallName(
                subcallRawData.parent.name
              ),
              subcalls: [],
              originKind: callParentEntityOriginData.kind,
              originValueKind: callParentEntityOriginData.valueKind,
              originValue: callParentEntityOriginData.value,
              extrinsic: extrinsicEntity,
              paraChainBlockHeight: subcallRawData.parent.block.height,
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
        ) {
          activityTraceEntity.originator = await getAccount(
            ctx,
            rootCall.call.originValue
          );
          activityTraceEntity.associatedAccountsFlat = [
            ...new Set([
              ...(activityTraceEntity.associatedAccountsFlat || []),
              rootCall.call.originValue,
            ]).values(),
          ];
        }

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
            group: this.eventGroup(event.name, event.phase),
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

    const associatedAccountsFlat = new Set(
      chainActivityTrace.associatedAccountsFlat
    );

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
      associatedAccountsFlat.add(account.id);
    }

    chainActivityTrace.associatedAccountsFlat = [
      ...associatedAccountsFlat.values(),
    ];

    state.chainActivityTraces.set(chainActivityTrace.id, chainActivityTrace);
  }

  static async addParticipantsToActivityTracesBulk({
    traceIds,
    participants,
    ctx,
  }: {
    traceIds: string[] | undefined | null;
    participants: Account[];
    ctx: ProcessorContext<Store>;
  }) {
    if (!traceIds || traceIds.length === 0) return;

    for (const traceId of traceIds) {
      await ChainActivityTraceManager.addParticipantsToActivityTrace({
        traceId,
        participants,
        ctx,
      });
    }
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
          return `${rootSrc}:${TraceIdEventGroup.initialization}`;
      }
    };
    const getGroupForFinalizationPhase = () => {
      switch (eventName) {
        // TODO Add conditional select of appropriate group
        default:
          return `${rootSrc}:${TraceIdEventGroup.finalization}`;
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

  static eventGroup(eventName: string, phase: EventPhase): EventGroup {
    const getGroupForApplyExtrinsicPhase = () => {
      switch (eventName) {
        // TODO Add conditional select of appropriate group
        default:
          return EventGroup.EXTRINSIC;
      }
    };
    const getGroupForInitializationPhase = () => {
      switch (eventName) {
        case 'DCA.Scheduled':
        case 'DCA.ExecutionStarted':
        case 'DCA.ExecutionPlanned':
        case 'DCA.TradeExecuted':
        case 'DCA.TradeFailed':
        case 'DCA.Terminated':
        case 'DCA.Completed':
        case 'DCA.RandomnessGenerationFailed':
          return EventGroup.DCA;
        default:
          return EventGroup.INITIALIZATION;
      }
    };
    const getGroupForFinalizationPhase = () => {
      switch (eventName) {
        case 'Omnipool.SellExecuted':
        case 'Omnipool.BuyExecuted':
          return EventGroup.BUY_BACK;
        default:
          return EventGroup.FINALIZATION;
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
      case 'OTC.place_order':
      case 'OTC.cancel_order':
        return [TraceEntityType.OTC_ORDER_ACTION];
      case 'OTC.fill_order':
      case 'OTC.partial_fill_order':
        return [TraceEntityType.OTC_ORDER_ACTION, TraceEntityType.SWAP];
      case 'DCA.schedule':
      case 'DCA.terminate':
        return [TraceEntityType.DCA_SCHEDULE];
    }

    return null;
  }

  static getEntityTypesByEventName(eventName: string) {
    switch (eventName) {
      case EventName.XYK_SellExecuted:
      case EventName.XYK_BuyExecuted:
      case EventName.LBP_SellExecuted:
      case EventName.LBP_BuyExecuted:
      case EventName.Stableswap_SellExecuted:
      case EventName.Stableswap_BuyExecuted:
      case EventName.Omnipool_SellExecuted:
      case EventName.Omnipool_BuyExecuted:
        return [TraceEntityType.SWAP];
      case EventName.Tokens_Transfer:
      case EventName.Balances_Transfer:
        return [TraceEntityType.TRANSFER];
      case EventName.Stableswap_LiquidityAdded:
      case EventName.Stableswap_LiquidityRemoved:
        return [TraceEntityType.STABLEPOOL_LIQUIDITY_ACTION];
      case EventName.OTC_Placed:
      case EventName.OTC_Cancelled:
      case EventName.OTC_Filled:
      case EventName.OTC_PartiallyFilled:
        return [TraceEntityType.OTC_ORDER_ACTION];
      case EventName.DCA_Scheduled:
      case EventName.DCA_Completed:
      case EventName.DCA_Terminated:
        return [TraceEntityType.DCA_SCHEDULE];
      case EventName.DCA_ExecutionPlanned:
      case EventName.DCA_ExecutionStarted:
      case EventName.DCA_TradeExecuted:
      case EventName.DCA_TradeFailed:
        return [TraceEntityType.DCA_SCHEDULE_EXECUTION_ACTION];
      case EventName.DCA_RandomnessGenerationFailed:
        return [TraceEntityType.DCA_RANDOMNESS_GENERATION_FAILED_ERROR];
      case EventName.AmmSupport_Swapped:
        return [TraceEntityType.SWAP];
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
    const { batchCalls, batchExtrinsics, batchEvents } = ctx.batchState.state;
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

  static isEventTraceId(maybeId: string) {
    if (!maybeId) return false;
    return /trace-id:\/\/context:event/.test(maybeId);
  }

  static isCallTraceId(maybeId: string) {
    if (!maybeId) return false;
    return /trace-id:\/\/context:call/.test(maybeId);
  }

  static async saveActivityTraceEntities(ctx: ProcessorContext<Store>) {
    const state = ctx.batchState.state;

    await ctx.store.upsert([...state.batchBlocks.values()].reverse());
    await ctx.store.upsert([...state.batchExtrinsics.values()].reverse());
    await ctx.store.upsert([...state.batchCalls.values()].reverse());
    await ctx.store.upsert([...state.batchEvents.values()].reverse());
    await ctx.store.upsert([...state.chainActivityTraces.values()].reverse());
    await ctx.store.upsert(
      [...state.accountChainActivityTraces.values()].reverse()
    );
    await ctx.store.upsert(
      [...state.chainActivityTraceRelations.values()].reverse()
    );
  }

  static async getChainActivityTrace({
    id,
    ctx,
    fetchFromDb = false,
    relations = {},
  }: {
    id: string;
    fetchFromDb?: boolean;
    relations?: FindOptionsRelations<ChainActivityTrace>;
    ctx: ProcessorContext<Store>;
  }) {
    const batchState = ctx.batchState.state;

    let entity = batchState.chainActivityTraces.get(id);
    if (entity || (!entity && !fetchFromDb)) return entity ?? null;

    entity = await ctx.store.findOne(ChainActivityTrace, {
      where: { id },
      relations,
    });

    if (!entity) return null;
    ctx.batchState.state.chainActivityTraces.set(id, entity);
    return entity;
  }

  static async getChainActivityTraceByTraceIdsBatch({
    ids,
    ctx,
    fetchFromDb = true,
    relations,
  }: {
    ids: string[];
    fetchFromDb?: boolean;
    relations?: FindOptionsRelations<ChainActivityTrace>;
    ctx: ProcessorContext<Store>;
  }) {
    const callTraceId = ids.find((id) => this.isCallTraceId(id));
    const eventTraceId = ids.find((id) => this.isEventTraceId(id));

    if (!callTraceId && !eventTraceId) return null;

    const activityTraceId = this.getTraceIdRoot(callTraceId! || eventTraceId!);

    if (!activityTraceId) return null;

    return this.getChainActivityTrace({
      id: activityTraceId,
      ctx,
      fetchFromDb,
      relations: relations ?? {
        childTraces: true,
        parentTraces: true,
      },
    });
  }

  static async addOperationIdToActivityTrace({
    traceId,
    operationId,
    ctx,
  }: {
    traceId: string;
    operationId: string;
    ctx: ProcessorContext<Store>;
  }) {
    const chainActivityTraceId = this.getTraceIdRoot(traceId);

    if (!chainActivityTraceId) return null;

    const entity = await this.getChainActivityTrace({
      id: chainActivityTraceId,
      ctx,
      fetchFromDb: true,
    });

    if (!entity) return null;

    entity.operationIds = [
      ...new Set([...(entity.operationIds || []), operationId]).values(),
    ];

    return entity;
  }
}
