import { Store } from '@subsquid/typeorm-store';

import { Transfer } from '../../model';
import {
  SqdBlock,
  SqdProcessorContext,
} from '../../processor';
import { TransferEvent } from '../../utils/types';
import { getOrCreateAccount } from '../accounts';
import { getOrCreateAsset } from '../assets/asset';

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
    assetRegistryAssetId,
    amount,
    fee,
    blockNumber,
    from,
    to,
    traceIds,
    timestamp,
  } = data;

  const assetEntity = await getOrCreateAsset({
    ctx,
    ...(assetId !== undefined ? { id: `${assetId}` } : {}),
    ...(assetRegistryAssetId !== undefined
      ? { assetRegistryId: `${assetRegistryAssetId}` }
      : {}),
    ensure: true,
    blockHeader,
  });

  if (!assetEntity) throw Error(`Asset ${assetId} cannot be found`);

  return new Transfer({
    from: await getOrCreateAccount({ ctx, id: from }),
    to: await getOrCreateAccount({ ctx, id: to }),
    txFee: fee,
    assetId: assetEntity.id,
    assetType: assetEntity.assetType,
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
