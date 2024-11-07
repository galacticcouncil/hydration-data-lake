import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import { AccountBalances, XykPool, XykPoolAssetsData } from '../../model';
import { getAssetBalancesMany } from '../balances';

export async function handleXykPoolsStorage(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
): Promise<void> {
  const xykPools: Map<string, XykPool> = new Map();
  const xykPoolAssetsData: Map<string, XykPoolAssetsData> = new Map();

  const allPoolsWithAssets =
    await parsers.storage.xyk.getAllPoolsWithAssets(currentBlockHeader);

  const fallbackAccountBalances = new AccountBalances({
    free: BigInt(0),
    reserved: BigInt(0),
    miscFrozen: BigInt(0),
    feeFrozen: BigInt(0),
    frozen: BigInt(0),
    flags: BigInt(0),
  });

  const allPoolAssetBalancesMap = new Map(
    (
      await getAssetBalancesMany(
        currentBlockHeader,
        allPoolsWithAssets
          .map((pool) => [
            {
              address: pool.poolAddress,
              assetId: pool.assetAId,
            },
            {
              address: pool.poolAddress,
              assetId: pool.assetBId,
            },
          ])
          .flat()
      )
    ).map((item) => [`${item.poolAddress}-${item.assetId}`, item])
  );

  for (const poolData of allPoolsWithAssets) {
    const newPoolEntity = new XykPool({
      id: `${poolData.poolAddress}-${currentBlockHeader.height}`,
      poolAddress: poolData.poolAddress,
      paraChainBlockHeight: currentBlockHeader.height,
      assetAId: poolData.assetAId,
      assetBId: poolData.assetBId,
    });

    const assetAData = new XykPoolAssetsData({
      id: `${poolData.poolAddress}-${poolData.assetAId}-${currentBlockHeader.height}`,
      paraChainBlockHeight: currentBlockHeader.height,
      assetId: poolData.assetAId,
      pool: newPoolEntity,
      balances:
        allPoolAssetBalancesMap.get(
          `${poolData.poolAddress}-${poolData.assetAId}`
        )?.balances ?? fallbackAccountBalances,
    });
    const assetBData = new XykPoolAssetsData({
      id: `${poolData.poolAddress}-${poolData.assetBId}-${currentBlockHeader.height}`,
      paraChainBlockHeight: currentBlockHeader.height,
      assetId: poolData.assetBId,
      pool: newPoolEntity,
      balances:
        allPoolAssetBalancesMap.get(
          `${poolData.poolAddress}-${poolData.assetBId}`
        )?.balances ?? fallbackAccountBalances,
    });
    xykPools.set(newPoolEntity.id, newPoolEntity);
    xykPoolAssetsData.set(assetAData.id, assetAData);
    xykPoolAssetsData.set(assetBData.id, assetBData);
  }

  await ctx.store.save([...xykPools.values()]);
  await ctx.store.save([...xykPoolAssetsData.values()]);
}
