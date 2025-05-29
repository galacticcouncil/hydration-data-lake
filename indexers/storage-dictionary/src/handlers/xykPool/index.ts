import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import { AccountBalances, Xykpool, XykpoolAssetsData } from '../../model';
import { getAssetBalancesMany } from '../balances';
import { Between } from 'typeorm/find-options/operator/Between';

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
  const relayChainInfo = ctx.batchState.state.relayChainInfo;

  const allPoolsWithAssets =
    await parsers.storage.xyk.getAllPoolsWithAssets(currentBlockHeader);

  const allPoolShareAssets = new Map(
    (
      (await parsers.storage.xyk.getPoolShareTokenAll({
        block: currentBlockHeader,
      })) || []
    ).map((item) => [item.poolId, item])
  );

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
      relayBlockHeight:
        relayChainInfo.get(currentBlockHeader.height)?.relaychainBlockNumber ||
        0,
      assetAId: poolData.assetAId,
      assetBId: poolData.assetBId,
      shareTokenId:
        allPoolShareAssets.get(poolData.poolAddress)?.shareTokenId.toString() ??
        null,
    });

    const assetAData = new XykpoolAssetsData({
      id: `${poolData.poolAddress}-${poolData.assetAId}-${currentBlockHeader.height}`,
      paraBlockHeight: currentBlockHeader.height,
      relayBlockHeight:
        relayChainInfo.get(currentBlockHeader.height)?.relaychainBlockNumber ||
        0,
      assetId: poolData.assetAId,
      pool: newPoolEntity,
      balances:
        allPoolAssetBalancesMap.get(
          `${poolData.poolAddress}-${poolData.assetAId}`
        )?.balances ?? fallbackAccountBalances,
    });
    const assetBData = new XykpoolAssetsData({
      id: `${poolData.poolAddress}-${poolData.assetBId}-${currentBlockHeader.height}`,
      paraBlockHeight: currentBlockHeader.height,
      relayBlockHeight:
        relayChainInfo.get(currentBlockHeader.height)?.relaychainBlockNumber ||
        0,
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

  const records = await ctx.store.find(Xykpool, {
    where: {
      paraBlockHeight: Between(
        orderedNumbers[0],
        orderedNumbers[orderedNumbers.length - 1]
      ),
    },
  });

  ctx.batchState.state.xykPools = new Map(records.map((r) => [r.id, r]));
  ctx.batchState.state.xykPoolsProcessedBlocks = new Set(
    records.map((r) => r.paraBlockHeight)
  );
  console.log(
    `Blocks range: ${orderedNumbers[0]}/${orderedNumbers[orderedNumbers.length - 1]}. 
    Number of missed blocks: ${orderedNumbers.filter((b) => !ctx.batchState.state.xykPoolsProcessedBlocks.has(b)).length}/${orderedNumbers.length}`
  );
}
