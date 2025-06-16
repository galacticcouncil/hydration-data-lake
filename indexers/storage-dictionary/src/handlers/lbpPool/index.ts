import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import { DataStructureTypeName, Lbppool, LbppoolAssetsData } from '../../model';
import { getAssetBalancesMany } from '../balances';
import { Between } from 'typeorm/find-options/operator/Between';
import { AccountData } from '../../parsers/types/storage';
import { MinifiedDataStructuresManager } from '../../utils/minifiedDataStructuresManager';

export async function handleLbpPoolsStorage(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
): Promise<void> {
  if (
    ctx.batchState.state.lbpPoolsProcessedBlocks.has(currentBlockHeader.height)
  )
    return;

  const lbpPools: Map<string, Lbppool> = new Map();
  const lbpPoolAssetsData: Map<string, LbppoolAssetsData> = new Map();

  const allPools = await parsers.storage.lbp.getAllPoolData(currentBlockHeader);
  const fallbackAccountBalances: AccountData = {
    free: BigInt(0),
    reserved: BigInt(0),
    miscFrozen: BigInt(0),
    feeFrozen: BigInt(0),
    frozen: BigInt(0),
    flags: BigInt(0),
  };

  const allPoolAssetBalancesMap = new Map(
    (
      await getAssetBalancesMany({
        ctx,
        block: currentBlockHeader,
        keyPairs: allPools
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
          .flat(),
      })
    ).map((item) => [`${item.poolAddress}-${item.assetId}`, item])
  );

  for (const poolData of allPools) {
    const newPoolEntity = new Lbppool({
      id: `${poolData.poolAddress}-${currentBlockHeader.height}`,
      poolAddress: poolData.poolAddress,
      paraBlockHeight: currentBlockHeader.height,
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
      repayTarget: poolData.repayTarget.toString(),
    });

    ctx.batchState.state.lbpPools.set(newPoolEntity.id, newPoolEntity);

    const assetAData = new LbppoolAssetsData({
      id: `${poolData.poolAddress}-${poolData.assetAId}-${currentBlockHeader.height}`,
      paraBlockHeight: currentBlockHeader.height,
      assetId: poolData.assetAId,
      pool: newPoolEntity,
      balances: MinifiedDataStructuresManager.getMinifiedDataStructure(
        (allPoolAssetBalancesMap.get(
          `${poolData.poolAddress}-${poolData.assetAId}`
        )?.balances as AccountData) ?? fallbackAccountBalances,
        DataStructureTypeName.AccountBalances
      ),
    });
    const assetBData = new LbppoolAssetsData({
      id: `${poolData.poolAddress}-${poolData.assetBId}-${currentBlockHeader.height}`,
      paraBlockHeight: currentBlockHeader.height,
      assetId: poolData.assetBId,
      pool: newPoolEntity,
      balances: MinifiedDataStructuresManager.getMinifiedDataStructure(
        (allPoolAssetBalancesMap.get(
          `${poolData.poolAddress}-${poolData.assetBId}`
        )?.balances as AccountData) ?? fallbackAccountBalances,
        DataStructureTypeName.AccountBalances
      ),
    });

    ctx.batchState.state.lbpPoolAssetsData.set(assetAData.id, assetAData);
    ctx.batchState.state.lbpPoolAssetsData.set(assetBData.id, assetBData);

    lbpPools.set(newPoolEntity.id, newPoolEntity);
    lbpPoolAssetsData.set(assetAData.id, assetAData);
    lbpPoolAssetsData.set(assetBData.id, assetBData);
  }
  if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE) {
    await ctx.store.save([...lbpPools.values()]);
    await ctx.store.save([...lbpPoolAssetsData.values()]);
  }
}

export async function prefetchAllLbppoolRecordsForBlocksRangeToEnsureMissedBlocks(
  ctx: ProcessorContext<Store>
) {
  if (
    !ctx.appConfig.PROCESS_ONLY_MISSED_BLOCKS ||
    !ctx.appConfig.PROCESS_LBP_POOLS
  )
    return;

  const orderedNumbers = ctx.blocks
    .map((b) => b.header.height)
    .sort((a, b) => a - b);

  const pools = await ctx.store.find(Lbppool, {
    where: {
      paraBlockHeight: Between(
        orderedNumbers[0],
        orderedNumbers[orderedNumbers.length - 1]
      ),
    },
  });
  const assets = await ctx.store.find(LbppoolAssetsData, {
    where: {
      paraBlockHeight: Between(
        orderedNumbers[0],
        orderedNumbers[orderedNumbers.length - 1]
      ),
    },
    relations: { pool: true },
  });

  ctx.batchState.state.lbpPools = new Map(pools.map((r) => [r.id, r]));
  ctx.batchState.state.lbpPoolAssetsData = new Map(
    assets.map((r) => [r.id, r])
  );
  ctx.batchState.state.lbpPoolsProcessedBlocks = new Set(
    pools.map((r) => r.paraBlockHeight)
  );
  console.log(
    `Blocks range: ${orderedNumbers[0]}/${orderedNumbers[orderedNumbers.length - 1]}. 
    Number of missed blocks: ${orderedNumbers.filter((b) => !ctx.batchState.state.lbpPoolsProcessedBlocks.has(b)).length}/${orderedNumbers.length}`
  );
}
