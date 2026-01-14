import { ProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmLogEventParsedData } from '../../../../parsers/types/events';

export interface MoneyMarketEvent {
  id: string;
  eventData: EvmLogEventParsedData;
  allInvolvedAssetIds: string[];
  allInvolvedParticipants: string[];
  paraBlockHeight: number;
}

export function getNewMoneyMarketEventEntity({
  eventData,
  allInvolvedAssetIds,
  allInvolvedParticipants,
}: {
  eventData: EvmLogEventParsedData;
  allInvolvedAssetIds: string[];
  allInvolvedParticipants: string[];
}) {
  const { params: eventParams, metadata: eventMetadata } = eventData;

  if (!eventParams) return null;

  return {
    id: eventMetadata.id,
    eventData,
    allInvolvedAssetIds,
    allInvolvedParticipants,
    paraBlockHeight: eventMetadata.blockHeader.height,
  } as MoneyMarketEvent;
}

export async function processNewMoneyMarketEvent({
  ctx,
  eventData,
  allInvolvedAssetIds,
  allInvolvedParticipants,
}: {
  ctx: ProcessorContext<Store>;
  eventData: EvmLogEventParsedData;
  allInvolvedAssetIds: string[];
  allInvolvedParticipants: string[];
}) {
  const newMmEventEntity = getNewMoneyMarketEventEntity({
    eventData,
    allInvolvedAssetIds: [...new Set(allInvolvedAssetIds).values()],
    allInvolvedParticipants: [...new Set(allInvolvedParticipants).values()],
  });

  if (!newMmEventEntity) return;

  ctx.batchState.state.moneyMarketEvents.set(
    newMmEventEntity.id,
    newMmEventEntity
  );

  if (
    !ctx.batchState.state.moneyMarketEventsIndexedByBlock.has(
      eventData.metadata.blockHeader.height
    )
  )
    ctx.batchState.state.moneyMarketEventsIndexedByBlock.set(
      eventData.metadata.blockHeader.height,
      new Map()
    );

  ctx.batchState.state.moneyMarketEventsIndexedByBlock
    .get(eventData.metadata.blockHeader.height)!
    .set(newMmEventEntity.id, newMmEventEntity);
}
