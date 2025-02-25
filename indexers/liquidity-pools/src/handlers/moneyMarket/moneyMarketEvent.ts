import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmLogData } from '../../parsers/batchBlocksParser/types/evm';
import {
  MmBorrow,
  MmLiquidationCall,
  MmRepay,
  MmReserveUsedAsCollateralDisabledEvent,
  MmReserveUsedAsCollateralEnabledEvent,
  MmSupply,
  MmUserEModeSet,
  MmWithdraw,
  MoneyMarketEvent,
  Transfer,
} from '../../model';

export function getNewMoneyMarketEventEntity({
  ctx,
  eventCallData,
  allInvolvedAssetIds,
  allInvolvedParticipants,
}: {
  ctx: SqdProcessorContext<Store>;
  eventCallData: EvmLogData;
  allInvolvedAssetIds: string[];
  allInvolvedParticipants: string[];
}) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  if (!eventParams) return null;

  return new MoneyMarketEvent({
    id: eventMetadata.id,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    eventName: eventParams.eventName,
    allInvolvedAssetIds,
    allInvolvedParticipants,
    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraBlockHeight: eventMetadata.blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });
}

export async function processNewMoneyMarketEvent({
  ctx,
  eventCallData,
  allInvolvedAssetIds,
  allInvolvedParticipants,
  transfer,
  supply,
  withdraw,
  borrow,
  repay,
  userEModeSet,
  liquidationCall,
  reserveUsedAsCollateralEnabled,
  reserveUsedAsCollateralDisabled,
}: {
  ctx: SqdProcessorContext<Store>;
  eventCallData: EvmLogData;
  allInvolvedAssetIds: string[];
  allInvolvedParticipants: string[];
  transfer?: Transfer;
  supply?: MmSupply;
  withdraw?: MmWithdraw;
  borrow?: MmBorrow;
  repay?: MmRepay;
  userEModeSet?: MmUserEModeSet;
  liquidationCall?: MmLiquidationCall;
  reserveUsedAsCollateralEnabled?: MmReserveUsedAsCollateralEnabledEvent;
  reserveUsedAsCollateralDisabled?: MmReserveUsedAsCollateralDisabledEvent;
}) {
  const newMmEventEntity = getNewMoneyMarketEventEntity({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [...new Set(allInvolvedAssetIds).values()],
    allInvolvedParticipants: [...new Set(allInvolvedParticipants).values()],
  });

  if (!newMmEventEntity) return;

  newMmEventEntity.transfer = transfer ?? null;
  newMmEventEntity.supply = supply ?? null;
  newMmEventEntity.withdraw = withdraw ?? null;
  newMmEventEntity.borrow = borrow ?? null;
  newMmEventEntity.repay = repay ?? null;
  newMmEventEntity.userEModeSet = userEModeSet ?? null;
  newMmEventEntity.liquidationCall = liquidationCall ?? null;
  newMmEventEntity.reserveUsedAsCollateralEnabled =
    reserveUsedAsCollateralEnabled ?? null;
  newMmEventEntity.reserveUsedAsCollateralDisabled =
    reserveUsedAsCollateralDisabled ?? null;

  ctx.batchState.state.moneyMarketEvents.set(
    newMmEventEntity.id,
    newMmEventEntity
  );
}
