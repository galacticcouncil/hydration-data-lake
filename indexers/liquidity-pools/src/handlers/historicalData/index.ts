import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  BatchLbppoolHistVolsList,
  BatchOmnipoolAssetHistVolsList,
  BatchStableswapHistVolsList,
  BatchXykpoolHistVolsList,
} from '../../model';
import { getAssetHistDataWithUniqueData } from '../assets/assetHistoricalData/assetHistoricalData';
import { getAssetSpotPriceHistDataWithUniqueData } from '../assets/assetHistoricalData/assetSpotPrices';

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

    await ctx.store.save([...ctx.batchState.state.lbpPoolVolumes.values()]);
    await ctx.store.save([...ctx.batchState.state.xykPoolVolumes.values()]);
    await ctx.store.save([
      ...ctx.batchState.state.omnipoolAssetVolumes.values(),
    ]);

    await ctx.store.save([
      ...ctx.batchState.state.stablepoolVolumeCollections.values(),
    ]);
    await ctx.store.save([
      ...ctx.batchState.state.stablepoolAssetVolumes.values(),
    ]);
  }

  static async saveAssetRelatedDataBulk(ctx: SqdProcessorContext<Store>) {
    if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE) {
      await ctx.store.save(
        Array.from(ctx.batchState.state.assetsHistoricalDataBatch.values())
      );
      await ctx.store.save(
        Array.from(
          ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values()
        )
      );
      await ctx.store.save(
        Array.from(
          ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.values()
        )
      );
      await ctx.store.save(
        Array.from(ctx.batchState.state.assetAssetsPairVolumesBatch.values())
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

    // const [assetHistDataToSaveMap, assetSpotPriceHistDataToSaveList] =
    //   await Promise.all([
    //     getAssetHistDataWithUniqueData(
    //       ctx.batchState.state.assetsHistoricalDataBatch,
    //       ctx
    //     ),
    //     getAssetSpotPriceHistDataWithUniqueData(
    //       ctx.batchState.state.assetsSpotPriceHistoricalDataBatch,
    //       ctx
    //     ),
    //   ]);

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
    await ctx.store.save(
      Array.from(
        ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.values()
      )
    );
    await ctx.store.save(
      Array.from(ctx.batchState.state.assetAssetsPairVolumesBatch.values())
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
