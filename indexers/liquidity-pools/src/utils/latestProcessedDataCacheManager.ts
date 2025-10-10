import { AssetHistoricalData, AssetSpotPriceHistoricalData } from '../model';
import { SqdProcessorContext } from '../processor';
import parsers from '../parsers';
import { LessThan } from 'typeorm';
import { Store } from '@subsquid/typeorm-store';
import pMap from 'p-map';

export class LatestProcessedDataCacheManager {
  private static instance: LatestProcessedDataCacheManager;

  private assetHistoricalDataItemsCache: Map<string, AssetHistoricalData> =
    new Map();

  private assetSpotPriceHistoricalDataItemsCache: Map<
    string,
    AssetSpotPriceHistoricalData
  > = new Map();

  static getInstance(): LatestProcessedDataCacheManager {
    if (!LatestProcessedDataCacheManager.instance) {
      LatestProcessedDataCacheManager.instance =
        new LatestProcessedDataCacheManager();
    }
    return LatestProcessedDataCacheManager.instance;
  }

  /**
   * ======================  Asset Historical Data =============================
   */
  async prefetchLastAssetHistDataItem(ctx: SqdProcessorContext<Store>) {
    if (this.assetHistoricalDataItemsCache.size !== 0) return;
    const currentBlockHeader = ctx.blocks[ctx.blocks.length - 1].header;

    const hasAnyRecord = await ctx.storeUtils.findOneWithLogs(
      AssetHistoricalData,
      {},
      { className: 'AssetHistoricalData' }
    );

    if (!hasAnyRecord) {
      console.log('AssetHistoricalData table is empty, skipping prefetch');
      return;
    }

    const storageDataAllAssets = (
      await parsers.storage.assetRegistry.getAssetAll(currentBlockHeader)
    ).filter((res) => !!res.data);

    const latestEntities = await pMap(
      storageDataAllAssets,
      (assetData): AssetHistoricalData | undefined => {
        // @ts-ignore
        return ctx.storeUtils.findOneWithLogs(
          AssetHistoricalData,
          {
            where: {
              asset: { assetRegistryId: assetData.assetId.toString() },
              paraBlockHeight: LessThan(currentBlockHeader.height),
            },
            order: {
              paraBlockHeight: 'DESC',
            },
            relations: {
              asset: true,
            },
          },
          { className: 'AssetHistoricalData' }
        );
      },
      {
        concurrency: 8,
      }
    );

    this.setLastAssetHistoricalDataItem(latestEntities.filter((i) => !!i));
  }

  setLastAssetHistoricalDataItem(items: AssetHistoricalData[]) {
    if (!items) return;

    const assetHistoryIndexByAsset = new Map<string, AssetHistoricalData[]>();

    for (const i of items) {
      if (!assetHistoryIndexByAsset.has(i.asset.id)) {
        assetHistoryIndexByAsset.set(i.asset.id, []);
      }
      assetHistoryIndexByAsset.get(i.asset.id)!.push(i);
    }

    for (const [assetId, list] of assetHistoryIndexByAsset.entries()) {
      const orderedList = list.sort(
        (a, b) => b.paraBlockHeight - a.paraBlockHeight
      );
      this.assetHistoricalDataItemsCache.set(assetId, orderedList[0]);
    }
  }

  getLastAssetHistoricalDataItem(
    assetId: string
  ): AssetHistoricalData | undefined {
    return this.assetHistoricalDataItemsCache.get(assetId);
  }

  /**
   * ======================  Asset Spot Price Historical Data =============================
   */
  async prefetchLastAssetSpotPriceHistDataItem(
    ctx: SqdProcessorContext<Store>
  ) {
    if (this.assetSpotPriceHistoricalDataItemsCache.size !== 0) return;
    const currentBlockHeader = ctx.blocks[ctx.blocks.length - 1].header;

    const hasAnyRecord = await ctx.storeUtils.findOneWithLogs(
      AssetSpotPriceHistoricalData,
      {},
      { className: 'AssetSpotPriceHistoricalData' }
    );

    if (!hasAnyRecord) {
      console.log(
        'AssetSpotPriceHistoricalData table is empty, skipping prefetch'
      );
      return;
    }

    const storageDataAllAssets = (
      await parsers.storage.assetRegistry.getAssetAll(currentBlockHeader)
    ).filter((res) => !!res.data);

    const latestEntities = await pMap(
      storageDataAllAssets,
      (assetData): AssetSpotPriceHistoricalData | undefined => {
        // @ts-ignore
        return ctx.storeUtils.findOneWithLogs(
          AssetSpotPriceHistoricalData,
          {
            where: {
              assetIn: { assetRegistryId: assetData.assetId.toString() },
              paraBlockHeight: LessThan(currentBlockHeader.height),
            },
            order: {
              paraBlockHeight: 'DESC',
            },
            relations: {
              assetIn: true,
              assetOut: true,
              assetInHistData: true,
            },
          },
          { className: 'AssetSpotPriceHistoricalData' }
        );
      },
      {
        concurrency: 8,
      }
    );

    this.setLastAssetSpotPriceHistoricalDataItem(
      latestEntities.filter((i) => !!i)
    );
  }

  // TODO add support multiple assetOut options

  setLastAssetSpotPriceHistoricalDataItem(
    items: AssetSpotPriceHistoricalData[]
  ) {
    if (!items) return;

    const assetSpotPriceHistoryIndexByAssetIn = new Map<
      string,
      AssetSpotPriceHistoricalData[]
    >();

    for (const i of items) {
      if (!assetSpotPriceHistoryIndexByAssetIn.has(i.assetIn.id)) {
        assetSpotPriceHistoryIndexByAssetIn.set(i.assetIn.id, []);
      }
      assetSpotPriceHistoryIndexByAssetIn.get(i.assetIn.id)!.push(i);
    }

    for (const [
      assetInId,
      list,
    ] of assetSpotPriceHistoryIndexByAssetIn.entries()) {
      const orderedList = list.sort(
        (a, b) => b.paraBlockHeight - a.paraBlockHeight
      );
      this.assetSpotPriceHistoricalDataItemsCache.set(
        assetInId,
        orderedList[0]
      );
    }
  }

  getLastAssetSpotPriceHistoricalDataItem(
    assetInId: string
  ): AssetSpotPriceHistoricalData | undefined {
    return this.assetSpotPriceHistoricalDataItemsCache.get(assetInId);
  }

  /**
   * ===========================   SUPPORT =====================================
   */
  log() {
    console.log('assetHistoricalDataItemsCache >>>');
    console.dir(
      Array.from(this.assetHistoricalDataItemsCache.entries()).map(
        ([key, item]) => `${key} => ${item.id}`
      ),
      { depth: null }
    );
  }
}
