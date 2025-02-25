import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { EvmLogDecoder } from '../../../utils/evmLogDecoder';
import { EvmEventName, MmBorrow, MmRepay } from '../../../model';
import { getAsset } from '../../assets/assetRegistry';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import { processNewMoneyMarketEvent } from '../moneyMarketEvent';

export async function handleMmRepayEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.Repay>(
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

  const repayerAccount = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.repayerAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!account || !repayerAccount) {
    if (!account)
      console.log(
        `AccountFrom cannot be found for EVM Address ${parsedEvmEventData.userAddress}`
      );
    if (!repayerAccount)
      console.log(
        `AccountFrom cannot be found for EVM Address ${parsedEvmEventData.repayerAddress}`
      );
    return;
  }

  const mmRepayEntity = new MmRepay({
    id: eventMetadata.id,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    asset: assetEntity,
    account,
    repayerAccount,
    amount: parsedEvmEventData.amount,
    useATokens: parsedEvmEventData.useATokens,

    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraBlockHeight: eventMetadata.blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });

  ctx.batchState.state.mmRepays.set(mmRepayEntity.id, mmRepayEntity);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [mmRepayEntity.account, mmRepayEntity.repayerAccount],
    traceIds: mmRepayEntity.traceIds,
    ctx,
  });

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedParticipants: [account.id, repayerAccount.id],
    repay: mmRepayEntity,
  });
}
