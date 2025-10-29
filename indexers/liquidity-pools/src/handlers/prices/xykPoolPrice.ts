import { XykpoolPriceHistoricalData } from '../../model';
import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { isNotNullOrUndefined } from '../../utils/helpers';
import { getAssetFreeBalance } from '../assets/balances';

export async function handleXykPoolPrices(ctx: SqdProcessorContext<Store>) {
  const poolPricesRaw = [];
  const xykAllBatchPools = ctx.batchState.state.xykAllBatchPools;

  for (let block of ctx.blocks) {
    const currentBlockRelayChainInfo = ctx.batchState.state.relayChainInfo.get(
      block.header.height
    );

    if (!currentBlockRelayChainInfo) continue;

    poolPricesRaw.push(
      [...xykAllBatchPools.values()].map(
        async (p) =>
          new Promise<XykpoolPriceHistoricalData | null>((resolve) => {
            if (p.createdAtParaBlockHeight > block.header.height) {
              resolve(null);
              return;
            }

            Promise.all([
              getAssetFreeBalance(block.header, +p.assetA.id, p.id), // TODO must be optimized
              getAssetFreeBalance(block.header, +p.assetB.id, p.id), // TODO must be optimized
            ]).then(([assetABalance, assetBBalance]) => {
              resolve(
                new XykpoolPriceHistoricalData({
                  id: p.id + '-' + block.header.height,
                  assetA: p.assetA,
                  assetB: p.assetB,
                  assetABalance: assetABalance,
                  assetBBalance: assetBBalance,
                  pool: p,
                  paraBlockHeight: block.header.height,
                  relayBlockHeight:
                    currentBlockRelayChainInfo.relaychainBlockNumber || 0,
                  blockId: block.header.id,
                })
              );
            });
          })
      )
    );
  }
  const poolPrices: XykpoolPriceHistoricalData[] = (
    await Promise.all(poolPricesRaw.flat())
  ).filter(isNotNullOrUndefined);

  const xykPoolHistoricalPrices = ctx.batchState.state.xykPoolHistoricalPrices;
  const xykPoolIdsToSave = ctx.batchState.state.xykPoolIdsToSave;

  for (const priceItem of poolPrices) {
    xykPoolHistoricalPrices.set(priceItem.id, priceItem);
    const pool = xykAllBatchPools.get(priceItem.pool.id);
    if (!pool) continue;
    pool.assetABalance = priceItem.assetABalance;
    pool.assetBBalance = priceItem.assetBBalance;
    xykAllBatchPools.set(priceItem.pool.id, pool);
    xykPoolIdsToSave.add(priceItem.pool.id);
  }
}
