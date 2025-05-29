import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import {
  AccountBalances,
  Lbppool,
  LbppoolAssetsData,
  Omnipool,
} from '../../model';
import { getAssetBalancesMany } from '../balances';
import { Between } from 'typeorm/find-options/operator/Between';

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
  const relayChainInfo = ctx.batchState.state.relayChainInfo;

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
      relayBlockHeight:
        relayChainInfo.get(currentBlockHeader.height)?.relaychainBlockNumber ||
        0,
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

    const assetAData = new LbppoolAssetsData({
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
    const assetBData = new LbppoolAssetsData({
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
    lbpPools.set(newPoolEntity.id, newPoolEntity);
    lbpPoolAssetsData.set(assetAData.id, assetAData);
    lbpPoolAssetsData.set(assetBData.id, assetBData);
  }
  await ctx.store.save([...lbpPools.values()]);
  await ctx.store.save([...lbpPoolAssetsData.values()]);
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

  const records = await ctx.store.find(Lbppool, {
    where: {
      paraBlockHeight: Between(
        orderedNumbers[0],
        orderedNumbers[orderedNumbers.length - 1]
      ),
    },
  });

  ctx.batchState.state.lbpPools = new Map(records.map((r) => [r.id, r]));
  ctx.batchState.state.lbpPoolsProcessedBlocks = new Set(
    records.map((r) => r.paraBlockHeight)
  );
  console.log(
    `Blocks range: ${orderedNumbers[0]}/${orderedNumbers[orderedNumbers.length - 1]}. 
    Number of missed blocks: ${orderedNumbers.filter((b) => !ctx.batchState.state.lbpPoolsProcessedBlocks.has(b)).length}/${orderedNumbers.length}`
  );
}
