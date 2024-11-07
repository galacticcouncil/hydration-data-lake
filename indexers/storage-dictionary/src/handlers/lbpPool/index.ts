import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import { AccountBalances, LbpPool, LbpPoolAssetsData } from '../../model';
import { getAssetBalancesMany } from '../balances';

export async function handleLbpPoolsStorage(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
): Promise<void> {
  const lbpPools: Map<string, LbpPool> = new Map();
  const lbpPoolAssetsData: Map<string, LbpPoolAssetsData> = new Map();

  const allPools = await parsers.storage.lbp.getAllPoolData(currentBlockHeader);
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
        allPools
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

  for (const poolData of allPools) {
    const newPoolEntity = new LbpPool({
      id: `${poolData.poolAddress}-${currentBlockHeader.height}`,
      poolAddress: poolData.poolAddress,
      paraChainBlockHeight: currentBlockHeader.height,
      assetAId: poolData.assetAId,
      assetBId: poolData.assetBId,
      owner: poolData.owner,
      start: poolData.start,
      end: poolData.end,
      initialWeight: poolData.initialWeight,
      finalWeight: poolData.finalWeight,
      weightCurve: poolData.weightCurve.__kind,
      fee: poolData.fee,
      feeCollector: poolData.feeCollector,
      repayTarget: poolData.repayTarget,
    });

    const assetAData = new LbpPoolAssetsData({
      id: `${poolData.poolAddress}-${poolData.assetAId}-${currentBlockHeader.height}`,
      paraChainBlockHeight: currentBlockHeader.height,
      assetId: poolData.assetAId,
      pool: newPoolEntity,
      balances:
        allPoolAssetBalancesMap.get(
          `${poolData.poolAddress}-${poolData.assetAId}`
        )?.balances ?? fallbackAccountBalances,
    });
    const assetBData = new LbpPoolAssetsData({
      id: `${poolData.poolAddress}-${poolData.assetBId}-${currentBlockHeader.height}`,
      paraChainBlockHeight: currentBlockHeader.height,
      assetId: poolData.assetBId,
      pool: newPoolEntity,
      balances:
        allPoolAssetBalancesMap.get(
          `${poolData.poolAddress}-${poolData.assetBId}`
        )?.balances ?? fallbackAccountBalances,
    });
    lbpPools.set(newPoolEntity.id, newPoolEntity);
    lbpPoolAssetsData.set(assetAData.id, assetAData);
    lbpPoolAssetsData.set(assetBData.id, assetBData);
  }
  await ctx.store.save([...lbpPools.values()]);
  await ctx.store.save([...lbpPoolAssetsData.values()]);
}
