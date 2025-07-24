import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import {
  DataStructureTypeName,
  Stableswap,
  StableswapAssetData,
  StableswapPegsSource,
  Tradability,
  Xykpool,
} from '../../model';
import { getAssetBalancesMany } from '../balances/storageParsers';
import { StableMath } from '@galacticcouncil/sdk';
import { blake2AsHex } from '@polkadot/util-crypto';
import { Between } from 'typeorm/find-options/operator/Between';
import { AccountData } from '../../parsers/types/storage';
import { MinifiedDataStructuresManager } from '../../utils/minifiedDataStructuresManager';
import { getXykpoolHistDataWithUniqueData } from '../xykPool/utils';
import { getStableswapHistDataWithUniqueData } from './utils';
import { handleMmAggregatorOracleHistoricalData } from '../oracles/mmAggregatorOracle/historicalData';

export async function handleStablepoolStorage(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
): Promise<void> {
  if (
    ctx.batchState.state.stablepoolsProcessedBlocks.has(
      currentBlockHeader.height
    )
  )
    return;

  const stablepools: Map<string, Stableswap> = new Map();
  const stablepoolAssetsData: Map<string, StableswapAssetData> = new Map();

  const allPools = (
    await parsers.storage.stableswap.getPoolsAll(currentBlockHeader)
  ).map((poolData) => ({
    ...poolData,
    poolAddress: blake2AsHex(StableMath.getPoolAddress(poolData.poolId)),
  }));

  const allPoolsPegsDataMap = new Map(
    (
      await parsers.storage.stableswap.getAllPoolsPegs({
        block: currentBlockHeader,
      })
    ).map((pegData) => [pegData.poolId, pegData])
  );

  const assetsStorageDataByPoolMap = new Map(
    (
      await Promise.all(
        [...allPools.values()]
          .map((pool) =>
            pool.assetIds.map(async (assetId) => ({
              poolId: pool.poolId,
              poolAddress: blake2AsHex(StableMath.getPoolAddress(pool.poolId)),
              assetId,
              storageData:
                await parsers.storage.stableswap.getPoolAssetStorageData({
                  poolId: pool.poolId,
                  assetId,
                  block: currentBlockHeader,
                  poolAddress: blake2AsHex(
                    StableMath.getPoolAddress(pool.poolId)
                  ),
                }),
            }))
          )
          .flat()
      )
    ).map((res) => [`${res.poolAddress}-${res.assetId}`, res])
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
        keyPairs: allPools
          .map((pool) =>
            pool.assetIds.map((id) => ({
              address: pool.poolAddress,
              assetId: id,
            }))
          )
          .flat(),
      })
    ).map((item) => [`${item.poolAddress}-${item.assetId}`, item])
  );

  for (const {
    poolId,
    poolAddress,
    initialBlock,
    finalBlock,
    initialAmplification,
    finalAmplification,
    fee,
    assetIds,
  } of allPools) {
    const getPoolPegsDetails = async (): Promise<
      Pick<Stableswap, 'pegs' | 'maxPegUpdate' | 'pegSources'>
    > => {
      if (!allPoolsPegsDataMap.has(poolId))
        return {
          pegs: assetIds.map((a) => ['1', '1']),
          maxPegUpdate: null,
          pegSources: null,
        };

      const poolPegsData = allPoolsPegsDataMap.get(poolId)!;

      let pegs = poolPegsData.current.map(([a, b]) => [
        a.toString(),
        b.toString(),
      ]);

      return {
        pegs,
        maxPegUpdate: poolPegsData.maxPegUpdate,
        pegSources: poolPegsData.source.map(
          ({
            sourceKind,
            oracleName = null,
            oraclePeriod = null,
            oracleAsset = null,
            valuePoints = null,
          }) =>
            new StableswapPegsSource({
              sourceKind,
              oracleName,
              oraclePeriod,
              oracleAsset: oracleAsset !== null ? oracleAsset.toString() : null,
              valuePoints: valuePoints
                ? valuePoints.map((vp) => vp.toString())
                : null,
            })
        ),
      };
    };

    const newPoolEntity = new Stableswap({
      id: `${poolId}-${currentBlockHeader.height}`,
      paraBlockHeight: currentBlockHeader.height,
      ...(await getPoolPegsDetails()),
      poolAddress,
      poolId,
      initialAmplification,
      finalAmplification,
      initialBlock,
      finalBlock,
      fee,
    });

    ctx.batchState.state.stablepools.set(newPoolEntity.id, newPoolEntity);

    for (const assetId of assetIds) {
      const newAssetEntity = new StableswapAssetData({
        id: `${poolId}-${assetId}-${currentBlockHeader.height}`,
        paraBlockHeight: currentBlockHeader.height,
        assetId: assetId,
        tradable: new Tradability(
          assetsStorageDataByPoolMap.get(`${poolAddress}-${assetId}`)
            ?.storageData?.tradable ?? { bits: 15 }
        ),
        pool: newPoolEntity,

        balances: MinifiedDataStructuresManager.getMinifiedDataStructure(
          (allPoolAssetBalancesMap.get(`${poolAddress}-${assetId}`)
            ?.balances as AccountData) ?? fallbackAccountBalances,
          DataStructureTypeName.AccountBalances
        ),
      });
      stablepoolAssetsData.set(newAssetEntity.id, newAssetEntity);

      ctx.batchState.state.stablepoolAssetsData.set(
        newAssetEntity.id,
        newAssetEntity
      );
    }

    stablepools.set(newPoolEntity.id, newPoolEntity);
  }

  if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE) {
    await ctx.store.save([...stablepools.values()]);
    await ctx.store.save([...stablepoolAssetsData.values()]);
  }
}

export async function prefetchAllStablepoolRecordsForBlocksRangeToEnsureMissedBlocks(
  ctx: ProcessorContext<Store>,
  orderedBlockNumbers: number[]
) {
  if (
    !ctx.appConfig.PROCESS_ONLY_MISSED_BLOCKS ||
    !ctx.appConfig.PROCESS_STABLEPOOLS
  )
    return;

  const pools = await ctx.store.find(Stableswap, {
    where: {
      paraBlockHeight: Between(
        orderedBlockNumbers[0],
        orderedBlockNumbers[orderedBlockNumbers.length - 1]
      ),
    },
  });

  const assets = await ctx.store.find(StableswapAssetData, {
    where: {
      paraBlockHeight: Between(
        orderedBlockNumbers[0],
        orderedBlockNumbers[orderedBlockNumbers.length - 1]
      ),
    },
    relations: { pool: true },
  });

  ctx.batchState.state.stablepools = new Map(pools.map((r) => [r.id, r]));
  ctx.batchState.state.stablepoolAssetsData = new Map(
    assets.map((r) => [r.id, r])
  );
  ctx.batchState.state.stablepoolsProcessedBlocks = new Set(
    pools.map((r) => r.paraBlockHeight)
  );
  console.log(
    `Blocks range: ${orderedBlockNumbers[0]}/${orderedBlockNumbers[orderedBlockNumbers.length - 1]}. 
    Number of missed blocks: ${orderedBlockNumbers.filter((b) => !ctx.batchState.state.stablepoolsProcessedBlocks.has(b)).length}/${orderedBlockNumbers.length}`
  );
}
