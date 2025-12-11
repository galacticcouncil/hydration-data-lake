import { Store } from '@subsquid/typeorm-store';

import {
  ChainActivityTraceManager,
} from '../../../chainActivityTracingManagers';
import {
  EvmEventName,
  MmUserEModeSet,
} from '../../../model';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { SqdProcessorContext } from '../../../processor';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import { processNewMoneyMarketEvent } from '../moneyMarketEvent';

export async function handleMmUserEModeSetEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.UserEModeSet>(
      eventCallData.eventData.params
    );

  if (!parsedEvmEventData) return;

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const account = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.userAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  const mmUserEModeSetEventEntity = new MmUserEModeSet({
    id: eventMetadata.id,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    accountId: account.id,
    categoryId: parsedEvmEventData.categoryId,
    paraBlockHeight: eventMetadata.blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });

  ctx.batchState.state.mmUserEModeSetEvents.set(
    mmUserEModeSetEventEntity.id,
    mmUserEModeSetEventEntity
  );

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [account],
    traceIds: mmUserEModeSetEventEntity.traceIds,
    ctx,
  });

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [],
    allInvolvedAssetRegistryIds: [],
    allInvolvedAssetDetails: [],
    allInvolvedParticipants: [account.id],
    userEModeSet: mmUserEModeSetEventEntity,
  });
}
