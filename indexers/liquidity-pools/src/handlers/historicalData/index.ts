import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  BatchLbppoolHistVolsList,
  BatchOmnipoolAssetHistVolsList,
  BatchStableswapHistVolsList,
  BatchXykpoolHistVolsList,
} from '../../model';

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
