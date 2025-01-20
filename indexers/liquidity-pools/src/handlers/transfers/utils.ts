import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { TransferEvent } from '../../utils/types';
import { Transfer } from '../../model';
import { getAccount } from '../accounts';

export async function initTransfer(
  ctx: ProcessorContext<Store>,
  data: TransferEvent
) {
  let {
    id,
    assetId,
    extrinsicHash,
    amount,
    fee,
    blockNumber,
    from,
    to,
    traceIds,
  } = data;

  return new Transfer({
    paraChainBlockHeight: blockNumber,
    from: await getAccount({ ctx, id: from }),
    to: await getAccount({ ctx, id: to }),
    txFee: fee,
    id,
    traceIds,
    assetId,
    extrinsicHash,
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
