import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { TransferEvent } from '../../utils/types';
import { Transfer } from '../../model';
import { getAccount } from '../accounts';
import { getAsset } from '../assets/assetRegistry';

export async function initTransfer({
  ctx,
  data,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  data: TransferEvent;
  blockHeader?: SqdBlock;
}) {
  const {
    id,
    assetId,
    amount,
    fee,
    blockNumber,
    from,
    to,
    traceIds,
    timestamp,
  } = data;

  const assetEntity = await getAsset({
    ctx,
    id: assetId,
    ensure: true,
    blockHeader,
  });

  if (!assetEntity) throw Error(`Asset ${assetId} cannot be found`);

  return new Transfer({
    from: await getAccount({ ctx, id: from }),
    to: await getAccount({ ctx, id: to }),
    txFee: fee,
    asset: assetEntity,
    paraBlockHeight: blockNumber,
    paraTimestamp: timestamp ?? new Date(),
    relayBlockHeight:
      ctx.batchState.getRelayChainBlockDataFromCache(blockNumber).height,
    event: ctx.batchState.state.batchEvents.get(id),
    id,
    traceIds,
    amount,
  });
}

export function isPoolTransfer(
  pools: string[],
  from: string,
  to: string
): boolean {
  for (let p of pools) {
    if (p == from || p == to) return true;
  }
  return false;
}
