import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import {
  EvmEventName,
  MmReserveUsedAsCollateralDisabledEvent,
} from '../../../model';
import { getOrCreateMoneyMarketAsset } from '../../assets/asset';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import { processNewMoneyMarketEvent } from '../moneyMarketEvent';

export async function handleMmReserveUsedAsCollateralDisabledEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.ReserveUsedAsCollateralDisabled>(
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

  const mmNewEntity = new MmReserveUsedAsCollateralDisabledEvent({
    id: eventMetadata.id,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    asset: assetEntity,
    account,

    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraBlockHeight: eventMetadata.blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });

  ctx.batchState.state.mmReserveUsedAsCollateralDisabledEvents.set(
    mmNewEntity.id,
    mmNewEntity
  );

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [mmNewEntity.account],
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
    reserveUsedAsCollateralDisabled: mmNewEntity,
  });
}
