import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { TokensTransferData } from '../../parsers/batchBlocksParser/types';
import { initTransfer } from './utils';
import { ChainActivityTraceManager } from '../../chainActivityTraceManager';

export async function handleTokensTransfer(
  ctx: ProcessorContext<Store>,
  eventCallData: TokensTransferData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const transferEntity = await initTransfer(ctx, {
    id: eventMetadata.id,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    assetId: eventParams.currencyId,
    blockNumber: eventMetadata.blockHeader.height,
    timestamp: new Date(eventMetadata.blockHeader.timestamp || 0),
    extrinsicHash: eventMetadata.extrinsic?.hash,
    from: eventParams.from,
    to: eventParams.to,
    amount: eventParams.amount,
    fee: eventMetadata.extrinsic?.fee || BigInt(0),
  });

  const transfers = ctx.batchState.state.transfers;
  transfers.set(transferEntity.id, transferEntity);
  ctx.batchState.state = {
    transfers,
  };

  if (transferEntity.traceIds && transferEntity.traceIds.length > 0)
    for (const traceId of transferEntity.traceIds) {
      await ChainActivityTraceManager.addParticipantsToActivityTrace({
        traceId,
        participants: [transferEntity.to, transferEntity.from],
        ctx,
      });
    }
}
