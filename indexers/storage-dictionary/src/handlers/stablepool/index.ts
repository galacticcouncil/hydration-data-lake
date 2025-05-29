import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import {
  AccountBalances,
  Stableswap,
  StableswapAssetData,
  StableswapPegsSource,
  Tradability,
  Xykpool,
} from '../../model';
import { getAssetBalancesMany } from '../balances';
import { StableMath } from '@galacticcouncil/sdk';
import { blake2AsHex } from '@polkadot/util-crypto';
import { Between } from 'typeorm/find-options/operator/Between';

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
  const relayChainInfo = ctx.batchState.state.relayChainInfo;

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
    const getPoolPegsDetails = (): Pick<
      Stableswap,
      'pegs' | 'maxPegUpdate' | 'pegSources'
    > => {
      if (!allPoolsPegsDataMap.has(poolId))
        return {
          pegs: assetIds.map((a) => [BigInt(1), BigInt(1)]),
          maxPegUpdate: null,
          pegSources: null,
        };

      const poolPegsData = allPoolsPegsDataMap.get(poolId)!;
      return {
        pegs: poolPegsData.current,
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
      relayBlockHeight:
        relayChainInfo.get(currentBlockHeader.height)?.relaychainBlockNumber ||
        0,
      ...getPoolPegsDetails(),
      poolAddress,
      poolId,
      initialAmplification,
      finalAmplification,
      initialBlock,
      finalBlock,
      fee,
    });

    for (const assetId of assetIds) {
      stablepoolAssetsData.set(
        `${poolId}-${assetId}-${currentBlockHeader.height}`,
        new StableswapAssetData({
          id: `${poolId}-${assetId}-${currentBlockHeader.height}`,
          paraBlockHeight: currentBlockHeader.height,
          relayBlockHeight:
            relayChainInfo.get(currentBlockHeader.height)
              ?.relaychainBlockNumber || 0,
          assetId: assetId,
          tradable: new Tradability(
            assetsStorageDataByPoolMap.get(`${poolAddress}-${assetId}`)
              ?.storageData?.tradable ?? { bits: 15 }
          ),
          pool: newPoolEntity,
          balances:
            allPoolAssetBalancesMap.get(`${poolAddress}-${assetId}`)
              ?.balances ?? fallbackAccountBalances,
        })
      );
    }

    stablepools.set(newPoolEntity.id, newPoolEntity);
  }

  await ctx.store.save([...stablepools.values()]);
  await ctx.store.save([...stablepoolAssetsData.values()]);
}

export async function prefetchAllStablepoolRecordsForBlocksRangeToEnsureMissedBlocks(
  ctx: ProcessorContext<Store>
) {
  if (
    !ctx.appConfig.PROCESS_ONLY_MISSED_BLOCKS ||
    !ctx.appConfig.PROCESS_STABLEPOOLS
  )
    return;

  const orderedNumbers = ctx.blocks
    .map((b) => b.header.height)
    .sort((a, b) => a - b);

  const records = await ctx.store.find(Stableswap, {
    where: {
      paraBlockHeight: Between(
        orderedNumbers[0],
        orderedNumbers[orderedNumbers.length - 1]
      ),
    },
  });

  ctx.batchState.state.stablepools = new Map(records.map((r) => [r.id, r]));
  ctx.batchState.state.stablepoolsProcessedBlocks = new Set(
    records.map((r) => r.paraBlockHeight)
  );
  console.log(
    `Blocks range: ${orderedNumbers[0]}/${orderedNumbers[orderedNumbers.length - 1]}. 
    Number of missed blocks: ${orderedNumbers.filter((b) => !ctx.batchState.state.stablepoolsProcessedBlocks.has(b)).length}/${orderedNumbers.length}`
  );
}
