import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import { EvmEventName, MmWithdraw } from '../../../model';
import {
  getOrCreateAsset,
  getOrCreateMoneyMarketAsset,
} from '../../assets/asset';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import { processNewMoneyMarketEvent } from '../moneyMarketEvent';

export async function handleMmWithdrawEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;
  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.Withdraw>(
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

  const accountFrom = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.userAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  const accountTo = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.toAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  const mmWithdrawEntity = new MmWithdraw({
    id: eventMetadata.id,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    asset: assetEntity,
    accountFrom,
    accountTo,
    amount: parsedEvmEventData.amount,
    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraBlockHeight: eventMetadata.blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });

  ctx.batchState.state.mmWithdrawals.set(mmWithdrawEntity.id, mmWithdrawEntity);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [mmWithdrawEntity.accountFrom, mmWithdrawEntity.accountTo],
    traceIds: mmWithdrawEntity.traceIds,
    ctx,
  });

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedParticipants: [accountFrom.id, accountTo.id],
    withdraw: mmWithdrawEntity,
  });
}
