import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import { DataStructureTypeName, Xykpool, XykpoolAssetsData } from '../../model';
import { getAssetBalancesMany } from '../balances';
import { Between } from 'typeorm/find-options/operator/Between';
import { AccountData } from '../../parsers/types/storage';
import { MinifiedDataStructuresManager } from '../../utils/minifiedDataStructuresManager';

export async function handleXykPoolsStorage(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
): Promise<void> {
  if (
    ctx.batchState.state.xykPoolsProcessedBlocks.has(currentBlockHeader.height)
  )
    return;

  const xykPools: Map<string, Xykpool> = new Map();
  const xykPoolAssetsData: Map<string, XykpoolAssetsData> = new Map();

  const allPoolsWithAssets =
    await parsers.storage.xyk.getAllPoolsWithAssets(currentBlockHeader);

  const allPoolShareAssets = new Map(
    (
      (await parsers.storage.xyk.getPoolShareTokenAll({
        block: currentBlockHeader,
      })) || []
    ).map((item) => [item.poolId, item])
  );

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
        keyPairs: allPoolsWithAssets
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

  for (const poolData of allPoolsWithAssets) {
    const newPoolEntity = new Xykpool({
      id: `${poolData.poolAddress}-${currentBlockHeader.height}`,
      poolAddress: poolData.poolAddress,
      paraBlockHeight: currentBlockHeader.height,
      assetAId: poolData.assetAId,
      assetBId: poolData.assetBId,
      shareTokenId:
        allPoolShareAssets.get(poolData.poolAddress)?.shareTokenId.toString() ??
        null,
    });

    ctx.batchState.state.xykPools.set(newPoolEntity.id, newPoolEntity);

    const assetAData = new XykpoolAssetsData({
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
    const assetBData = new XykpoolAssetsData({
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

    ctx.batchState.state.xykPoolAssetsData.set(assetAData.id, assetAData);
    ctx.batchState.state.xykPoolAssetsData.set(assetBData.id, assetBData);

    xykPools.set(newPoolEntity.id, newPoolEntity);
    xykPoolAssetsData.set(assetAData.id, assetAData);
    xykPoolAssetsData.set(assetBData.id, assetBData);
  }

  if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE) {
    await ctx.store.save(Array.from(xykPools.values()));
    await ctx.store.save(Array.from(xykPoolAssetsData.values()));
  }
}

export async function prefetchAllXykPoolRecordsForBlocksRangeToEnsureMissedBlocks(
  ctx: ProcessorContext<Store>
) {
  if (
    !ctx.appConfig.PROCESS_ONLY_MISSED_BLOCKS ||
    !ctx.appConfig.PROCESS_XYK_POOLS
  )
    return;

  const orderedNumbers = ctx.blocks
    .map((b) => b.header.height)
    .sort((a, b) => a - b);

  const pools = await ctx.store.find(Xykpool, {
    where: {
      paraBlockHeight: Between(
        orderedNumbers[0],
        orderedNumbers[orderedNumbers.length - 1]
      ),
    },
  });

  const assets = await ctx.store.find(XykpoolAssetsData, {
    where: {
      paraBlockHeight: Between(
        orderedNumbers[0],
        orderedNumbers[orderedNumbers.length - 1]
      ),
    },
    relations: { pool: true },
  });

  ctx.batchState.state.xykPools = new Map(pools.map((r) => [r.id, r]));
  ctx.batchState.state.xykPoolAssetsData = new Map(
    assets.map((r) => [r.id, r])
  );
  ctx.batchState.state.xykPoolsProcessedBlocks = new Set(
    pools.map((r) => r.paraBlockHeight)
  );
  console.log(
    `Blocks range: ${orderedNumbers[0]}/${orderedNumbers[orderedNumbers.length - 1]}. 
    Number of missed blocks: ${orderedNumbers.filter((b) => !ctx.batchState.state.xykPoolsProcessedBlocks.has(b)).length}/${orderedNumbers.length}`
  );
}
