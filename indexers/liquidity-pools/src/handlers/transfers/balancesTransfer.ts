import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BalancesTransferData } from '../../parsers/batchBlocksParser/types';
import { initTransfer } from './utils';

export async function handleBalancesTransfer(
  ctx: ProcessorContext<Store>,
  eventCallData: BalancesTransferData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const transferEntity = await initTransfer(ctx, {
    id: eventMetadata.id,
    assetId: 0,
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
}
