import { Store } from '@subsquid/typeorm-store';

import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import { EvmEventName, MmMintedToTreasuryEvent } from '../../../model';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { SqdProcessorContext } from '../../../processor';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import {
  getOrCreateAsset,
  getOrCreateMoneyMarketAsset,
} from '../../assets/asset';
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

  const underliningAsset = await getOrCreateMoneyMarketAsset({
    ctx,
    evmAddress: parsedEvmEventData.reserveAddress,
    ensure: true,
  });

  if (!underliningAsset) {
    console.log(
      `Underlining Asset with contract address ${parsedEvmEventData.reserveAddress} cannot be found.`
    );
    return;
  }

  const mmTreasuryAccount = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: ctx.appConfig.evm.MM_TREASURY_ADDRESS,
    blockHeader: eventMetadata.blockHeader,
  });

  const mmMintedToTreasuryEntity = new MmMintedToTreasuryEvent({
    id: eventMetadata.id,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    assetId: underliningAsset.aTokenId ?? underliningAsset.id, // TODO should be fixed
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

  let receivedAToken = null;

  if (underliningAsset.aTokenId) {
    receivedAToken = await getOrCreateAsset({
      id: underliningAsset.aTokenId,
      ctx,
      ensure: false,
    });
  }

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [underliningAsset.id],
    allInvolvedAssetRegistryIds: [
      underliningAsset.assetRegistryId,
      ...(receivedAToken ? [receivedAToken.assetRegistryId] : []),
    ],
    allInvolvedAssetDetails: [
      underliningAsset.name,
      underliningAsset.symbol,
      ...(receivedAToken ? [receivedAToken.name, receivedAToken.symbol] : []),
    ],
    allInvolvedParticipants: [mmTreasuryAccount.id],
    mintedToTreasury: mmMintedToTreasuryEntity,
  });
}
