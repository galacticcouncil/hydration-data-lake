import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { EvmLogDecoder } from '../../../utils/evmLogDecoder';
import { EvmEventName, MmBorrow } from '../../../model';
import { getAsset } from '../../assets/assetRegistry';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
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

  const assetEntity = await getAsset({
    ctx,
    evmAddress: parsedEvmEventData.reserveAddress,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
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
    account,
    accountOnBehalfOf,
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
    participants: [mmBorrowEntity.account, mmBorrowEntity.accountOnBehalfOf],
    traceIds: mmBorrowEntity.traceIds,
    ctx,
  });

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedParticipants: [account.id, accountOnBehalfOf.id],
    borrow: mmBorrowEntity,
  });
}
