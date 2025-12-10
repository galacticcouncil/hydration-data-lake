import { Store } from '@subsquid/typeorm-store';

import {
  ChainActivityTraceManager,
} from '../../../chainActivityTracingManagers';
import {
  EvmEventName,
  MmBorrow,
} from '../../../model';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { SqdProcessorContext } from '../../../processor';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import { getOrCreateMoneyMarketAsset } from '../../assets/asset';
import { processNewMoneyMarketEvent } from '../moneyMarketEvent';

export async function handleMmBorrowEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.Borrow>(
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

  const mmBorrowEntity = new MmBorrow({
    id: eventMetadata.id,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    asset: assetEntity,
    accountId: account.id,
    accountOnBehalfOfId: accountOnBehalfOf.id,
    amount: parsedEvmEventData.amount,
    interestRateMode: parsedEvmEventData.interestRateMode,
    borrowRate: parsedEvmEventData.borrowRate,
    referralCode: parsedEvmEventData.referralCode,

    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraBlockHeight: eventMetadata.blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });

  ctx.batchState.state.mmBorrows.set(mmBorrowEntity.id, mmBorrowEntity);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [account, accountOnBehalfOf],
    traceIds: mmBorrowEntity.traceIds,
    ctx,
  });

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedAssetRegistryIds: [assetEntity.assetRegistryId],
    allInvolvedAssetDetails: [assetEntity.name, assetEntity.symbol],
    allInvolvedParticipants: [account.id, accountOnBehalfOf.id],
    borrow: mmBorrowEntity,
  });
}
