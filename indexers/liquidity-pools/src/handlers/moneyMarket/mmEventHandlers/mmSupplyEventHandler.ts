import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BalancesTransferData } from '../../../parsers/batchBlocksParser/types';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import { EvmEventName, MmSupply } from '../../../model';
import { getOrCreateAsset, getOrCreateMoneyMarketAsset } from '../../assets/asset';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import {
  getNewMoneyMarketEventEntity,
  processNewMoneyMarketEvent,
} from '../moneyMarketEvent';

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
    asset: assetEntity,
    account,
    accountOnBehalfOf,
    amount: parsedEvmEventData.amount,
    referralCode: parsedEvmEventData.referralCode,
    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraBlockHeight: eventMetadata.blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });

  ctx.batchState.state.mmSupplies.set(mmSupplyEntity.id, mmSupplyEntity);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [mmSupplyEntity.account, mmSupplyEntity.accountOnBehalfOf],
    traceIds: mmSupplyEntity.traceIds,
    ctx,
  });

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedParticipants: [account.id, accountOnBehalfOf.id],
    supply: mmSupplyEntity,
  });
}
