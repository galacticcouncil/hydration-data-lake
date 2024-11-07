import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { TokensTransferData } from '../../parsers/batchBlocksParser/types';
import { initTransfer } from './utils';

export async function handleTokensTransfer(
  ctx: ProcessorContext<Store>,
  eventCallData: TokensTransferData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const transferEntity = await initTransfer(ctx, {
    id: eventMetadata.id,
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
}
