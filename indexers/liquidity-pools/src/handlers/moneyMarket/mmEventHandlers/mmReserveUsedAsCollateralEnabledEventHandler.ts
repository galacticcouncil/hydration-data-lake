import { Store } from '@subsquid/typeorm-store';

import {
  ChainActivityTraceManager,
} from '../../../chainActivityTracingManagers';
import {
  EvmEventName,
  MmReserveUsedAsCollateralEnabledEvent,
} from '../../../model';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { SqdProcessorContext } from '../../../processor';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import { getOrCreateMoneyMarketAsset } from '../../assets/asset';
import { processNewMoneyMarketEvent } from '../moneyMarketEvent';

export async function handleMmReserveUsedAsCollateralEnabledEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.ReserveUsedAsCollateralEnabled>(
      eventCallData.eventData.params
    );

  if (!parsedEvmEventData) return;

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const assetEntity = await getOrCreateMoneyMarketAsset({
    ctx,
    evmAddress: parsedEvmEventData.reserveAddress,
    ensure: true,
  });

  if (!assetEntity) {
    console.log(
      `Asset with contract address ${parsedEvmEventData.reserveAddress} cannot be found.`
    );
    return;
  }

  const account = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.userAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  const mmNewEntity = new MmReserveUsedAsCollateralEnabledEvent({
    id: eventMetadata.id,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    assetId: assetEntity.id,
    accountId: account.id,

    paraBlockHeight: eventMetadata.blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });

  ctx.batchState.state.mmReserveUsedAsCollateralEnabledEvents.set(
    mmNewEntity.id,
    mmNewEntity
  );

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [account],
    traceIds: mmNewEntity.traceIds,
    ctx,
  });

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedAssetRegistryIds: [assetEntity.assetRegistryId],
    allInvolvedAssetDetails: [assetEntity.name, assetEntity.symbol],
    allInvolvedParticipants: [account.id],
    reserveUsedAsCollateralEnabled: mmNewEntity,
  });
}
