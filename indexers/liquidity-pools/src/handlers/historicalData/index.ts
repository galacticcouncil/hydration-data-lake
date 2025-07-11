import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetsPairVolumeHistoricalData,
  AssetSpotPriceHistoricalData,
  BatchLbppoolHistVolsList,
  BatchOmnipoolAssetHistVolsList,
  BatchStableswapHistVolsList,
  BatchXykpoolHistVolsList,
} from '../../model';
import { getAssetHistDataWithUniqueData } from '../assets/assetHistoricalData/assetHistoricalData';
import { getAssetSpotPriceHistDataWithUniqueData } from '../assets/assetHistoricalData/assetSpotPrices';
import { RedisTimeSeriesManager } from '../../utils/redisTimeSeriesManager';
import { ProcessorStatusManager } from '../../processorStatusManager';

export class HistoricalDataManager {
  static async saveHistoricalDataBulk(ctx: SqdProcessorContext<Store>) {
    await ctx.store.save([
      ...ctx.batchState.state.historicalAssetSwapFees.values(),
    ]);
    await ctx.store.save([
      ...ctx.batchState.state.historicalAccountSwapFees.values(),
    ]);
    await ctx.store.save([
      ...ctx.batchState.state.historicalAccountAssetSwapFees.values(),
    ]);

    await this.saveAssetRelatedDataBulk(ctx);

    await ctx.store.save(
      Array.from(ctx.batchState.state.lbpPoolVolumes.values())
    );
    await ctx.store.save(
      Array.from(ctx.batchState.state.xykPoolVolumes.values())
    );
    await ctx.store.save(
      Array.from(ctx.batchState.state.omnipoolAssetVolumes.values())
    );

    await ctx.store.save(
      Array.from(ctx.batchState.state.stablepoolVolumeCollections.values())
    );
    await ctx.store.save(
      Array.from(ctx.batchState.state.stablepoolAssetVolumes.values())
    );

    await ctx.store.save(
      Array.from(ctx.batchState.state.omnipoolAllHistoricalData.values())
    );
    await ctx.store.save(
      Array.from(ctx.batchState.state.omnipoolAssetAllHistoricalData.values())
    );
    await ctx.store.save(
      Array.from(ctx.batchState.state.stablepoolAllHistoricalData.values())
    );
    await ctx.store.save(
      Array.from(
        ctx.batchState.state.stablepoolAssetsAllHistoricalData.values()
      )
    );
    await ctx.store.save(
      Array.from(ctx.batchState.state.xykPoolAllHistoricalData.values())
    );
    await ctx.store.save(
      Array.from(ctx.batchState.state.lbpPoolAllHistoricalData.values())
    );
    await ctx.store.save(
      Array.from(ctx.batchState.state.aavePoolsHistoricalData.values())
    );

    const latestBatchBlockHeight =
      ctx.blocks[ctx.blocks.length - 1].header.height;

    await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
      xykpoolHistDataLatestBlock: latestBatchBlockHeight,
      omnipoolHistDataLatestBlock: latestBatchBlockHeight,
      stableswapHistDataLatestBlock: latestBatchBlockHeight,
    });
  }

  static async saveAssetRelatedDataBulk(ctx: SqdProcessorContext<Store>) {
    if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE) {
      const assetsSpotPricesListToSave = Array.from(
        ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values()
      );
      const assetsPairVolumesListToSave = Array.from(
        ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.values()
      );

      await ctx.store.save(
        Array.from(ctx.batchState.state.assetsHistoricalDataBatch.values())
      );
      await ctx.store.save(assetsSpotPricesListToSave);
      await ctx.store.save(assetsPairVolumesListToSave);
      await ctx.store.save(
        Array.from(ctx.batchState.state.assetAssetsPairVolumesBatch.values())
      );

      await this.commitAssetPricesToRedisTimeSeries(
        assetsSpotPricesListToSave,
        ctx
      );
      await this.commitAssetsPairVolumeToRedisTimeSeries(
        assetsPairVolumesListToSave,
        ctx
      );
      return;
    }

    const assetHistDataToSaveMap = await getAssetHistDataWithUniqueData(
      ctx.batchState.state.assetsHistoricalDataBatch,
      ctx
    );

    const assetSpotPriceHistDataToSaveList =
      await getAssetSpotPriceHistDataWithUniqueData(
        ctx.batchState.state.assetsSpotPriceHistoricalDataBatch,
        ctx
      );

    const assetsPairVolumesHistDataToSaveList = Array.from(
      ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.values()
    );

    for (const priceHistData of assetSpotPriceHistDataToSaveList) {
      assetHistDataToSaveMap.set(
        priceHistData.assetInHistData.id,
        priceHistData.assetInHistData
      );
    }
    for (const junctionRecord of ctx.batchState.state.assetAssetsPairVolumesBatch.values()) {
      assetHistDataToSaveMap.set(
        junctionRecord.assetHistoricalData.id,
        junctionRecord.assetHistoricalData
      );
    }

    await ctx.store.save(Array.from(assetHistDataToSaveMap.values()));
    await ctx.store.save(assetSpotPriceHistDataToSaveList);
    await ctx.store.save(assetsPairVolumesHistDataToSaveList);
    await ctx.store.save(
      Array.from(ctx.batchState.state.assetAssetsPairVolumesBatch.values())
    );

    await this.commitAssetPricesToRedisTimeSeries(
      assetSpotPriceHistDataToSaveList,
      ctx
    );
    await this.commitAssetsPairVolumeToRedisTimeSeries(
      assetsPairVolumesHistDataToSaveList,
      ctx
    );
  }

  static async commitAssetPricesToRedisTimeSeries(
    src: AssetSpotPriceHistoricalData[],
    ctx: SqdProcessorContext<Store>
  ) {
    if (
      !src ||
      !src.length ||
      !ctx.appConfig.COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES
    )
      return;

    const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();
    await redisTimeSeriesManager.addMultiplePrices(
      src
        .filter(
          (item) =>
            !!item.assetIn.assetRegistryId && !!item.assetOut.assetRegistryId
        )
        .map((item) => ({
          keyPrefix: ctx.appConfig.INDEXER_ID,
          name: 'price',
          assetAId: item.assetIn.assetRegistryId!,
          assetBId: item.assetOut.assetRegistryId!,
          timestamp: item.block.timestamp.getTime(),
          value: +item.priceNormalised,
        }))
    );
  }

  static async commitAssetsPairVolumeToRedisTimeSeries(
    src: AssetsPairVolumeHistoricalData[],
    ctx: SqdProcessorContext<Store>
  ) {
    if (
      !src ||
      !src.length ||
      !ctx.appConfig.COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES
    )
      return;

    const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();
    await redisTimeSeriesManager.addMultiplePrices(
      src
        .filter(
          (item) =>
            !!item.assetA.assetRegistryId && !!item.assetB.assetRegistryId
        )
        .map((item) => ({
          keyPrefix: ctx.appConfig.INDEXER_ID,
          name: 'volume',
          assetAId:
            +item.assetA.assetRegistryId! < +item.assetB.assetRegistryId!
              ? item.assetA.assetRegistryId!
              : item.assetB.assetRegistryId!,
          assetBId:
            +item.assetA.assetRegistryId! < +item.assetB.assetRegistryId!
              ? item.assetB.assetRegistryId!
              : item.assetA.assetRegistryId!,

          timestamp: item.block.timestamp.getTime(),
          value: +item.totalVolumeNormalised,
        }))
    );
  }

  static async handleHistoricalVolumesBatchEntriesLists(
    ctx: SqdProcessorContext<Store>
  ) {
    const lbppoolHistoricalVolumeEntries = [
      ...new Set(
        [...ctx.batchState.state.lbpPoolVolumes.values()].map(
          (item) => item.pool.id
        )
      ).values(),
    ];

    const xykPoolHistoricalVolumeEntries = [
      ...new Set(
        [...ctx.batchState.state.xykPoolVolumes.values()].map(
          (item) => item.pool.id
        )
      ).values(),
    ];

    const omnipoolAssetHistoricalVolumeEntries = new Map(
      [...ctx.batchState.state.omnipoolAssetVolumes.values()].map((item) => [
        item.omnipoolAsset.id,
        item.omnipoolAsset.asset.id,
      ])
    );

    const stableswapHistoricalVolumeEntries = [
      ...new Set(
        [...ctx.batchState.state.stablepoolVolumeCollections.values()].map(
          (item) => item.pool.id
        )
      ).values(),
    ];

    if (lbppoolHistoricalVolumeEntries.length)
      await ctx.store.save(
        new BatchLbppoolHistVolsList({
          id: `${ctx.blocks[0].header.height}`,
          poolIds: lbppoolHistoricalVolumeEntries,
          batchStartParaBlockHeight: ctx.blocks[0].header.height,
          batchEndParaBlockHeight:
            ctx.blocks[ctx.blocks.length - 1].header.height,
        })
      );

    if (xykPoolHistoricalVolumeEntries.length)
      await ctx.store.save(
        new BatchXykpoolHistVolsList({
          id: `${ctx.blocks[0].header.height}`,
          poolIds: xykPoolHistoricalVolumeEntries,
          batchStartParaBlockHeight: ctx.blocks[0].header.height,
          batchEndParaBlockHeight:
            ctx.blocks[ctx.blocks.length - 1].header.height,
        })
      );

    if (omnipoolAssetHistoricalVolumeEntries.size)
      await ctx.store.save(
        new BatchOmnipoolAssetHistVolsList({
          id: `${ctx.blocks[0].header.height}`,
          omnipoolAssetIds: [...omnipoolAssetHistoricalVolumeEntries.keys()],
          assetIds: [...omnipoolAssetHistoricalVolumeEntries.values()],
          batchStartParaBlockHeight: ctx.blocks[0].header.height,
          batchEndParaBlockHeight:
            ctx.blocks[ctx.blocks.length - 1].header.height,
        })
      );

    if (stableswapHistoricalVolumeEntries.length)
      await ctx.store.save(
        new BatchStableswapHistVolsList({
          id: `${ctx.blocks[0].header.height}`,
          poolIds: stableswapHistoricalVolumeEntries,
          batchStartParaBlockHeight: ctx.blocks[0].header.height,
          batchEndParaBlockHeight:
            ctx.blocks[ctx.blocks.length - 1].header.height,
        })
      );
  }
}
