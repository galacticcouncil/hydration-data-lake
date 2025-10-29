import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../../parsers/batchBlocksParser';
import parsers from '../../../../parsers';
import { blake2AsHex } from '@polkadot/util-crypto';
import { StableMath } from '@galacticcouncil/sdk';
import {
  StableswapAssetHistoricalData,
  StableswapHistoricalData,
  StableswapPegsSource,
} from '../../../../model';
import { getOrCreateStableswap } from './stablepool';
import { getOrCreateAsset } from '../../../assets/asset';
import { BlockHeader } from '@subsquid/substrate-processor';
import { splitIntoBatches } from '../../../../utils/helpers';
import {
  StablepoolAllPoolsInfoWithPoolId,
  StablepoolInfo,
  StablepoolManyPoolsPegsInfoWithPoolId,
  StablepoolPoolPegsInfo,
} from '../../../../parsers/types/storage';
import pMap from 'p-map';

async function getStableswapDataPromise({
  ctx,
  poolId,
  poolData,
  poolPegs,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  poolId: number;
  poolData: StablepoolInfo;
  poolPegs?: StablepoolPoolPegsInfo;
  blockHeader: BlockHeader;
}): Promise<{
  poolData: StableswapHistoricalData;
  assetsData: StableswapAssetHistoricalData[];
} | null> {
  //TODO add using pool data from current batch cache
  const poolStorageData =
    poolData ??
    (await parsers.storage.stableswap.getPoolData({
      poolId,
      block: blockHeader,
    }));

  if (!poolStorageData) return null;

  const poolPegsData =
    poolPegs ??
    (await parsers.storage.stableswap.getPoolPegs({
      poolId,
      block: blockHeader,
    }));

  const assetsData = await pMap(
    poolStorageData.assets,
    async (assetId) => ({
      assetId,
      data: await parsers.storage.stableswap.getPoolAssetInfo({
        poolId,
        assetId,
        block: blockHeader,
        poolAddress: blake2AsHex(StableMath.getPoolAddress(poolId)),
      }),
      storageData: await parsers.storage.stableswap.getPoolAssetStorageData({
        poolId,
        assetId,
        block: blockHeader,
        poolAddress: blake2AsHex(StableMath.getPoolAddress(poolId)),
      }),
    }),
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );

  const getPoolPegsDetails = (): Pick<
    StableswapHistoricalData,
    'pegs' | 'maxPegUpdate' | 'pegSources'
  > => {
    if (!poolPegsData)
      return {
        pegs: poolStorageData.assets.map((a) => [BigInt(1), BigInt(1)]),
        maxPegUpdate: null,
        pegSources: null,
      };

    if (poolPegsData && !poolPegsData.source && !poolPegsData.maxPegUpdate)
      return {
        pegs:
          poolPegsData.current ??
          poolStorageData.assets.map((a) => [BigInt(1), BigInt(1)]),
        maxPegUpdate: null,
        pegSources: null,
      };

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
            oraclePeriod: oraclePeriod ?? null,
            oracleAsset: oracleAsset !== null ? oracleAsset.toString() : null,
            valuePoints: valuePoints
              ? valuePoints.map((vp) => vp.toString())
              : null,
          })
      ),
    };
  };

  const poolEntity = await getOrCreateStableswap({
    ctx,
    poolId,
    ensure: true,
    blockHeader,
  });

  if (!poolEntity) return null;

  const stableswapAssetsMap = new Map(
    poolEntity.assets.map((sAsset) => [sAsset.asset.id, sAsset])
  );

  const poolHistoricalDataEntity = new StableswapHistoricalData({
    id: `${poolId}-${blockHeader.height}`,
    pool: poolEntity,

    initialAmplification: poolStorageData.initialAmplification,
    finalAmplification: poolStorageData.finalAmplification,
    initialAmplificationChangeAtBlockHeight: poolStorageData.initialBlock,
    finalAmplificationChangeAtBlockHeight: poolStorageData.finalBlock,
    fee: poolStorageData.fee,
    tvlTotalInRefAssetNorm: '0',
    ...getPoolPegsDetails(),

    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      blockHeader.height
    ).height,
    paraBlockHeight: blockHeader.height,
    blockId: blockHeader.id,
  });

  const poolAssetHistoricalDataEntities = [];

  for (const { assetId: arAssetId, data, storageData } of assetsData.filter(
    (data) => !!data && !!data.data
  )) {
    const asset = await getOrCreateAsset({
      ctx,
      assetRegistryId: arAssetId,
      ensure: true,
      blockHeader,
    });

    if (!asset) continue;

    poolAssetHistoricalDataEntities.push(
      new StableswapAssetHistoricalData({
        id: `${poolId}-${asset.id}-${blockHeader.height}`,
        asset,
        stableswapAsset: stableswapAssetsMap.get(asset.id),
        poolHistoricalData: poolHistoricalDataEntity,
        freeBalance: data!.free,
        tradable: storageData?.tradable.bits ?? 15,
        tvlInRefAssetNorm: '0',

        relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          blockHeader.height
        ).height,
        paraBlockHeight: blockHeader.height,
        blockId: blockHeader.id,
      })
    );
  }

  return {
    poolData: poolHistoricalDataEntity,
    assetsData: poolAssetHistoricalDataEntities,
  };
}

export async function handleStableswapHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  if (!ctx.appConfig.PROCESS_STABLEPOOLS) return;

  const predefinedEntities = [];

  for (const blocksSubBatch of splitIntoBatches(
    ctx.blocks,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    const allPoolsPerBlock: Array<{
      blockHeader: BlockHeader;
      poolsDataMap: Map<number, StablepoolAllPoolsInfoWithPoolId>;
      poolsPegsMap: Map<number, StablepoolManyPoolsPegsInfoWithPoolId>;
    }> = await pMap(
      blocksSubBatch,
      async ({ header: blockHeader }) => {
        const [blockAllPoolsData, blockAllPoolsPegs] = await Promise.all([
          parsers.storage.stableswap.getAllPoolsData({
            block: blockHeader,
          }),
          parsers.storage.stableswap.getAllPoolsPegs({
            block: blockHeader,
          }),
        ]);

        return {
          blockHeader,
          poolsDataMap: new Map(
            (blockAllPoolsData || []).map((data) => [data.poolId, data])
          ),
          poolsPegsMap: new Map(
            (blockAllPoolsPegs || []).map((data) => [data.poolId, data])
          ),
        };
      },
      {
        concurrency:
          ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
      }
    );

    predefinedEntities.push(
      await pMap(
        allPoolsPerBlock
          .map(({ blockHeader, poolsDataMap, poolsPegsMap }) =>
            [...poolsDataMap.values()].map((poolDataWithId) => ({
              blockHeader: blockHeader,
              poolId: poolDataWithId.poolId,
              poolData: poolDataWithId.data,
              poolPegs: poolsPegsMap.get(poolDataWithId.poolId)?.data,
            }))
          )
          .flat(),
        async (item) => getStableswapDataPromise({ ...item, ctx }),
        {
          concurrency:
            ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
        }
      )
    );
  }

  for (const entitiesToSave of predefinedEntities
    .flat()
    .filter((item) => !!item)) {
    ctx.batchState.state.stablepoolAllHistoricalData.set(
      entitiesToSave.poolData.id,
      entitiesToSave.poolData
    );

    for (const assetData of entitiesToSave.assetsData.filter(
      (item) => !!item
    )) {
      ctx.batchState.state.stablepoolAssetsAllHistoricalData.set(
        assetData.id,
        assetData
      );
    }
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.stablepoolAllHistoricalData.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.stablepoolAssetsAllHistoricalData.values())
  );
}
