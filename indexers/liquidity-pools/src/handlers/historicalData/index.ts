import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AccountAssetBalanceHistoricalData,
  AccountTotalBalanceHistoricalData,
  AssetsPairVolumeHistoricalData,
  AssetSpotPriceHistoricalData,
  BatchHsmpoolAssetHistVolsList,
  BatchLbppoolHistVolsList,
  BatchOmnipoolAssetHistVolsList,
  BatchStableswapHistVolsList,
  BatchXykpoolHistVolsList,
} from '../../model';
import { getAssetHistDataWithUniqueData } from '../assets/assetHistoricalData/assetHistoricalData';
import { getAssetSpotPriceHistDataWithUniqueData } from '../assets/assetHistoricalData/assetSpotPrices';
import {
  RedisTimeSeriesManager,
  RedisTimeSeriesName,
} from '../../utils/redisTimeSeriesManager';
import { ProcessorStatusManager } from '../../processorStatusManager';
import {
  getProcessingMode,
  ProcessingMode,
} from '../../processorHelpers/getProcessingMode';
import { MultiFlowProcessingPhase } from '../../utils/types';
import { LatestProcessedDataCacheManager } from '../../utils/latestProcessedDataCacheManager';
import { getAccountAssetBalancesLatest } from '../balances/accountAssetBalanceLatest';
import { getOmnipoolAssetsHistDataLatest } from '../pools/pools/omnipool/historicalDataLatest';
import { getStableswapAssetsHistDataLatest } from '../pools/pools/stableswap/historicalDataLatest';

export class HistoricalDataManager {
  static async saveHistoricalDataBulk(ctx: SqdProcessorContext<Store>) {
    if (
      getProcessingMode(ctx) !==
        ProcessingMode.ALL_IN_ONE_MULTI_FLOW_PROCESSOR ||
      (getProcessingMode(ctx) ===
        ProcessingMode.ALL_IN_ONE_MULTI_FLOW_PROCESSOR &&
        ctx.appConfig.processingMode.MULTI_FLOW_PROCESSING_PHASE ===
          MultiFlowProcessingPhase.INITIAL)
    ) {
      console.time('saveHistoricalDataBulk > saveSwapFeeRelatedDataBulk');
      await this.saveSwapFeeRelatedDataBulk(ctx);
      console.timeEnd('saveHistoricalDataBulk > saveSwapFeeRelatedDataBulk');
    }

    if (
      getProcessingMode(ctx) !==
        ProcessingMode.ALL_IN_ONE_MULTI_FLOW_PROCESSOR ||
      (getProcessingMode(ctx) ===
        ProcessingMode.ALL_IN_ONE_MULTI_FLOW_PROCESSOR &&
        (ctx.appConfig.processingMode.MULTI_FLOW_PROCESSING_PHASE ===
          MultiFlowProcessingPhase.HIST_DATA_AGGREGATION ||
          ctx.appConfig.processingMode.MULTI_FLOW_PROCESSING_PHASE ===
            MultiFlowProcessingPhase.SPOT_PRICES_CALCULATION))
    ) {
      console.time('saveHistoricalDataBulk > saveAssetRelatedDataBulk');
      await this.saveAssetRelatedDataBulk(ctx);
      console.timeEnd('saveHistoricalDataBulk > saveAssetRelatedDataBulk');

      console.time('saveHistoricalDataBulk > saveGeneralHistoricalDataBulk');
      await this.saveGeneralHistoricalDataBulk(ctx);
      console.timeEnd('saveHistoricalDataBulk > saveGeneralHistoricalDataBulk');
    }

    console.time('saveHistoricalDataBulk > savePoolVolumesRelatedDataBulk');
    await this.savePoolVolumesRelatedDataBulk(ctx);
    console.timeEnd('saveHistoricalDataBulk > savePoolVolumesRelatedDataBulk');

    await ctx.store.save(
      Array.from(ctx.batchState.state.moneyMarketReserves.values())
    );

    // if (
    //   getProcessingMode(ctx) !==
    //     ProcessingMode.ALL_IN_ONE_MULTI_FLOW_PROCESSOR ||
    //   (getProcessingMode(ctx) ===
    //     ProcessingMode.ALL_IN_ONE_MULTI_FLOW_PROCESSOR &&
    //     (ctx.appConfig.processingMode.MULTI_FLOW_PROCESSING_PHASE ===
    //       MultiFlowProcessingPhase.HIST_DATA_AGGREGATION ||
    //       ctx.appConfig.processingMode.MULTI_FLOW_PROCESSING_PHASE ===
    //         MultiFlowProcessingPhase.SPOT_PRICES_CALCULATION))
    // ) {
    //   await this.saveGeneralHistoricalDataBulk(ctx);
    // }

    const latestBatchBlockHeight =
      ctx.blocks[ctx.blocks.length - 1].header.height;

    await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
      xykpoolHistDataLatestBlock: latestBatchBlockHeight,
      omnipoolHistDataLatestBlock: latestBatchBlockHeight,
      stableswapHistDataLatestBlock: latestBatchBlockHeight,
      aavepoolHistDataLatestBlock: latestBatchBlockHeight,
    });
  }

  static async saveSwapFeeRelatedDataBulk(ctx: SqdProcessorContext<Store>) {
    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.historicalAssetSwapFees.values())
    );
    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.historicalAccountSwapFees.values())
    );
    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.historicalAccountAssetSwapFees.values())
    );
  }

  static async savePoolVolumesRelatedDataBulk(ctx: SqdProcessorContext<Store>) {
    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.lbpPoolVolumes.values())
    );
    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.xykPoolVolumes.values())
    );
    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.omnipoolAssetVolumes.values())
    );
    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.stablepoolVolumeCollections.values())
    );
    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.stablepoolAssetVolumes.values())
    );
  }

  static async saveGeneralHistoricalDataBulk(ctx: SqdProcessorContext<Store>) {
    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.omnipoolAllHistoricalData.values())
    );

    /**
     *  === OmnipoolAssetHistoricalData ===
     */
    const omnipoolAssetAllHistoricalDataList = Array.from(
      ctx.batchState.state.omnipoolAssetAllHistoricalData.values()
    );
    await ctx.storeUtils.upsertWithBatches(omnipoolAssetAllHistoricalDataList);

    const omnipoolAssetsHistDataLatest = getOmnipoolAssetsHistDataLatest({
      histDataList: omnipoolAssetAllHistoricalDataList,
    });
    await ctx.storeUtils.upsertWithBatches(omnipoolAssetsHistDataLatest);
    /**
     * ======
     */

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.stablepoolAllHistoricalData.values())
    );

    /**
     *  === StableswapAssetHistoricalData ===
     */
    const stableswapAssetAllHistoricalDataList = Array.from(
      ctx.batchState.state.stablepoolAssetsAllHistoricalData.values()
    );

    await ctx.storeUtils.upsertWithBatches(
      stableswapAssetAllHistoricalDataList
    );

    const stableswapAssetsHistDataLatest = getStableswapAssetsHistDataLatest({
      histDataList: stableswapAssetAllHistoricalDataList,
    });

    await ctx.storeUtils.upsertWithBatches(stableswapAssetsHistDataLatest);

    /**
     * ======
     */

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.xykPoolAllHistoricalData.values())
    );

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.lbpPoolAllHistoricalData.values())
    );

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.aavePoolsHistoricalData.values())
    );

    await ctx.storeUtils.upsertWithBatches(
      Array.from(
        ctx.batchState.state.moneyMarketReserveIndexesHistData.values()
      )
    );

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.moneyMarketReserveConfigHistData.values())
    );

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.aaveFacilitatorsHistData.values())
    );

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.hsmCollateralsConfigHistData.values())
    );

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.hsmpoolHistData.values())
    );

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.hsmpoolAssetHistData.values())
    );

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.transactionPaymentHistData.values())
    );
  }

  static async saveAssetRelatedDataBulk(ctx: SqdProcessorContext<Store>) {
    console.time(
      'saveHistoricalDataBulk > saveAssetRelatedDataBulk > commitAssetPrices'
    );
    await Promise.all([
      this.commitAssetsPairVolumeToRedisTimeSeries(
        Array.from(
          ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.values()
        ),
        ctx
      ),
      this.commitAssetPricesToRedisTimeSeries(
        Array.from(
          ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values()
        ),
        ctx
      ),
    ]);
    console.timeEnd(
      'saveHistoricalDataBulk > saveAssetRelatedDataBulk > commitAssetPrices'
    );

    if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE) {
      console.time('saveHistoricalDataBulk > saveAssetRelatedDataBulk > save');
      const assetsSpotPricesListToSave = Array.from(
        ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values()
      );
      const assetsPairVolumesListToSave = Array.from(
        ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.values()
      );

      await ctx.storeUtils.upsertWithBatches(
        Array.from(ctx.batchState.state.assetsHistoricalDataBatch.values())
      );
      await ctx.storeUtils.upsertWithBatches(assetsSpotPricesListToSave);
      await ctx.storeUtils.upsertWithBatches(assetsPairVolumesListToSave);
      await ctx.storeUtils.upsertWithBatches(
        Array.from(ctx.batchState.state.assetAssetsPairVolumesBatch.values())
      );

      console.timeEnd(
        'saveHistoricalDataBulk > saveAssetRelatedDataBulk > save'
      );

      return;
    }

    console.time(
      'saveHistoricalDataBulk > saveAssetRelatedDataBulk > prefetchLastAssetHistDataItem'
    );
    await LatestProcessedDataCacheManager.getInstance().prefetchLastAssetHistDataItem(
      ctx
    );
    console.timeEnd(
      'saveHistoricalDataBulk > saveAssetRelatedDataBulk > prefetchLastAssetHistDataItem'
    );

    console.time(
      'saveHistoricalDataBulk > saveAssetRelatedDataBulk > prefetchLastAssetSpotPriceHistDataItem'
    );
    await LatestProcessedDataCacheManager.getInstance().prefetchLastAssetSpotPriceHistDataItem(
      ctx
    );
    console.timeEnd(
      'saveHistoricalDataBulk > saveAssetRelatedDataBulk > prefetchLastAssetSpotPriceHistDataItem'
    );

    console.time(
      'saveHistoricalDataBulk > saveAssetRelatedDataBulk > getAssetHistDataWithUniqueData'
    );
    const assetHistDataToSaveMap = await getAssetHistDataWithUniqueData(
      ctx.batchState.state.assetsHistoricalDataBatch,
      ctx
    );
    console.timeEnd(
      'saveHistoricalDataBulk > saveAssetRelatedDataBulk > getAssetHistDataWithUniqueData'
    );

    console.time(
      'saveHistoricalDataBulk > saveAssetRelatedDataBulk > getAssetSpotPriceHistDataWithUniqueData'
    );
    const assetSpotPriceHistDataToSaveList =
      await getAssetSpotPriceHistDataWithUniqueData(
        ctx.batchState.state.assetsSpotPriceHistoricalDataBatch,
        ctx
      );
    console.timeEnd(
      'saveHistoricalDataBulk > saveAssetRelatedDataBulk > getAssetSpotPriceHistDataWithUniqueData'
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

    const assetHistDataToSaveList = Array.from(assetHistDataToSaveMap.values());

    await ctx.storeUtils.upsertWithBatches(assetHistDataToSaveList);

    LatestProcessedDataCacheManager.getInstance().setLastAssetHistoricalDataItem(
      assetHistDataToSaveList
    );

    await ctx.storeUtils.upsertWithBatches(assetSpotPriceHistDataToSaveList);
    LatestProcessedDataCacheManager.getInstance().setLastAssetSpotPriceHistoricalDataItem(
      assetSpotPriceHistDataToSaveList
    );

    await ctx.storeUtils.upsertWithBatches(assetsPairVolumesHistDataToSaveList);
    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.assetAssetsPairVolumesBatch.values())
    );
  }

  static async saveAccountBalancesRelatedDataBulk(
    ctx: SqdProcessorContext<Store>
  ) {
    const accountAssetBalanceHistoricalDataList = Array.from(
      ctx.batchState.state.accountAssetBalanceHistoricalData.values()
    );
    const accountAssetBalancesLatest = getAccountAssetBalancesLatest({
      balances: accountAssetBalanceHistoricalDataList,
    });
    const accountTotalBalanceHistoricalDataList = Array.from(
      ctx.batchState.state.accountTotalBalanceHistoricalData.values()
    );

    await ctx.storeUtils.upsertWithBatches(
      accountAssetBalanceHistoricalDataList
    );

    await ctx.storeUtils.upsertWithBatches(accountAssetBalancesLatest);

    await ctx.storeUtils.upsertWithBatches(
      accountTotalBalanceHistoricalDataList
    );

    await this.commitAccountTotalBalancesToRedisTimeSeries(
      accountTotalBalanceHistoricalDataList,
      ctx
    );
  }

  static async saveAccountMoneyMarketDataBulk(ctx: SqdProcessorContext<Store>) {
    const accountMmPositionHistoricalDataList = Array.from(
      ctx.batchState.state.accountMmPositionHistoricalData.values()
    );
    await ctx.storeUtils.upsertWithBatches(accountMmPositionHistoricalDataList);
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
          name: RedisTimeSeriesName.price,
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
          name: RedisTimeSeriesName.volume,
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

  static async commitAccountTotalBalancesToRedisTimeSeries(
    src: AccountTotalBalanceHistoricalData[],
    ctx: SqdProcessorContext<Store>
  ) {
    if (
      !src ||
      !src.length ||
      !ctx.appConfig.COMMIT_HIST_DATA_TO_REDIS_TIME_SERIES
    )
      return;

    const redisTimeSeriesManager = RedisTimeSeriesManager.getInstance();
    await redisTimeSeriesManager.addMultipleAccountTotalBalances(
      src.map((item) => ({
        keyPrefix: ctx.appConfig.INDEXER_ID,
        name: RedisTimeSeriesName.acc_bal_tot_tns,
        accountId: item.account.id,
        timestamp: item.block.timestamp.getTime(),
        value: +item.totalTransferableNorm,
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

    const hsmpoolAssetHistoricalVolumeEntries = [
      ...new Set(
        [...ctx.batchState.state.hsmpoolAssetHistData.values()].map(
          (item) => item.asset.id
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

    if (hsmpoolAssetHistoricalVolumeEntries.length)
      await ctx.store.save(
        new BatchHsmpoolAssetHistVolsList({
          id: `${ctx.blocks[0].header.height}`,
          assetIds: hsmpoolAssetHistoricalVolumeEntries,
          batchStartParaBlockHeight: ctx.blocks[0].header.height,
          batchEndParaBlockHeight:
            ctx.blocks[ctx.blocks.length - 1].header.height,
        })
      );
  }
}
