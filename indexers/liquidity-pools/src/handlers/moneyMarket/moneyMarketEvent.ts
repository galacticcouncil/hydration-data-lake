import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmLogData } from '../../parsers/batchBlocksParser/types/evm';
import { MoneyMarketEvent } from '../../model';

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
    id: `${eventMetadata.id}-${eventParams.eventName}`,
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
