import { Store } from '@subsquid/typeorm-store';

import {
  ChainActivityTraceManager,
} from '../../../chainActivityTracingManagers';
import {
  EvmEventName,
  MmSupply,
} from '../../../model';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { SqdProcessorContext } from '../../../processor';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import { getOrCreateMoneyMarketAsset } from '../../assets/asset';
import { processNewMoneyMarketEvent } from '../moneyMarketEvent';

export async function handleMmSupplyEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.Supply>(
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

  const accountOnBehalfOf = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.onBehalfOfUserAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!account || !accountOnBehalfOf) {
    if (!account)
      console.log(
        `AccountFrom cannot be found for EVM Address ${parsedEvmEventData.userAddress}`
      );
    if (!accountOnBehalfOf)
      console.log(
        `AccountFrom cannot be found for EVM Address ${parsedEvmEventData.onBehalfOfUserAddress}`
      );
    return;
  }

  const mmSupplyEntity = new MmSupply({
    id: eventMetadata.id,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    assetId: assetEntity.id,
    accountId: account.id,
    accountOnBehalfOfId: accountOnBehalfOf.id,
    amount: parsedEvmEventData.amount,
    referralCode: parsedEvmEventData.referralCode,
    paraBlockHeight: eventMetadata.blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });

  ctx.batchState.state.mmSupplies.set(mmSupplyEntity.id, mmSupplyEntity);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [account, accountOnBehalfOf],
    traceIds: mmSupplyEntity.traceIds,
    ctx,
  });

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedAssetRegistryIds: [assetEntity.assetRegistryId],
    allInvolvedAssetDetails: [assetEntity.name, assetEntity.symbol],
    allInvolvedParticipants: [account.id, accountOnBehalfOf.id],
    supply: mmSupplyEntity,
  });
}
