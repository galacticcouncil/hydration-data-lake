import { LbppoolHistoricalPrice } from '../../model';
import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { isNotNullOrUndefined } from '../../utils/helpers';
import { getAssetFreeBalance } from '../assets/balances';

export async function handleLbpPoolPrices(ctx: SqdProcessorContext<Store>) {
  const poolPricesRaw = [];
  const lbpAllBatchPools = ctx.batchState.state.lbpAllBatchPools;

  for (let block of ctx.blocks) {
    const currentBlockRelayChainInfo = ctx.batchState.state.relayChainInfo.get(
      block.header.height
    );

    if (!currentBlockRelayChainInfo) continue;

    poolPricesRaw.push(
      [...lbpAllBatchPools.values()].map(
        async (p) =>
          new Promise<LbppoolHistoricalPrice | null>((resolve) => {
            if (p.createdAtParaChainBlockHeight > block.header.height) {
              resolve(null);
              return;
            }

            Promise.all([
              getAssetFreeBalance(block.header, +p.assetA.id, p.id), // TODO must be optimized
              getAssetFreeBalance(block.header, +p.assetB.id, p.id), // TODO must be optimized
            ]).then(([assetABalance, assetBBalance]) => {
              resolve(
                new LbppoolHistoricalPrice({
                  id: p.id + '-' + block.header.height,
                  assetA: p.assetA,
                  assetB: p.assetB,
                  assetABalance: assetABalance,
                  assetBBalance: assetBBalance,
                  pool: p,
                  paraChainBlockHeight: block.header.height,
                  relayChainBlockHeight:
                    currentBlockRelayChainInfo.relaychainBlockNumber || 0,
                  block: ctx.batchState.state.batchBlocks.get(block.header.id),
                })
              );
            });
          })
      )
    );
  }
  const poolPrices: LbppoolHistoricalPrice[] = (
    await Promise.all(poolPricesRaw.flat())
  ).filter(isNotNullOrUndefined);

  const lbpPoolHistoricalPrices = ctx.batchState.state.lbpPoolHistoricalPrices;
  const lbpPoolIdsToSave = ctx.batchState.state.lbpPoolIdsToSave;

  for (const priceItem of poolPrices) {
    lbpPoolHistoricalPrices.set(priceItem.id, priceItem);

    const pool = lbpAllBatchPools.get(priceItem.pool.id);
    if (!pool) continue;
    pool.assetABalance = priceItem.assetABalance;
    pool.assetBBalance = priceItem.assetBBalance;
    lbpAllBatchPools.set(priceItem.pool.id, pool);
    lbpPoolIdsToSave.add(priceItem.pool.id);
  }
}
