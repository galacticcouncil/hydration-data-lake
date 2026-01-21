import { Store } from '@subsquid/typeorm-store';

import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import { EvmEventName, MmMintedToTreasury, MmWithdraw } from '../../../model';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { SqdProcessorContext } from '../../../processor';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import { getOrCreateMoneyMarketAsset } from '../../assets/asset';
import { processNewMoneyMarketEvent } from '../moneyMarketEvent';

export async function handleMmMintedToTreasuryEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;
  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.MintedToTreasury>(
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

  const mmTreasuryAccount = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: ctx.appConfig.evm.MM_TREASURY_ADDRESS,
    blockHeader: eventMetadata.blockHeader,
  });

  const mmMintedToTreasuryEntity = new MmMintedToTreasury({
    id: eventMetadata.id,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    assetId: assetEntity.id,
    amount: parsedEvmEventData.amountMinted,
    paraBlockHeight: eventMetadata.blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });

  ctx.batchState.state.mmMintedToTreasuryEvents.set(
    mmMintedToTreasuryEntity.id,
    mmMintedToTreasuryEntity
  );

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [mmTreasuryAccount],
    traceIds: mmMintedToTreasuryEntity.traceIds,
    ctx,
  });

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedAssetRegistryIds: [assetEntity.assetRegistryId],
    allInvolvedAssetDetails: [assetEntity.name, assetEntity.symbol],
    allInvolvedParticipants: [mmTreasuryAccount.id],
    mintedToTreasury: mmMintedToTreasuryEntity,
  });
}
