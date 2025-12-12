import { Store } from '@subsquid/typeorm-store';

import {
  AssetHistoricalData,
  AssetSpotPriceHistoricalData,
} from '../model';
import { AssetDynamicFee } from '../model/generated/_assetDynamicFee';
import parsers from '../parsers';
import { SqdProcessorContext } from '../processor';
import { CommonPgPool } from './pgConnectionManagers/pgPool';

// Type definitions for raw PostgreSQL query results
interface RawAssetHistoricalDataRow {
  id: string;
  asset_id: string;
  total_issuance: string; // numeric comes as string from pg
  dynamic_fee: any | null;
  usd_price_normalised: string;
  para_block_height: number;
}

interface RawAssetSpotPriceHistoricalDataRow {
  id: string;
  asset_in_id: string;
  asset_out_id: string;
  price: string; // numeric comes as string from pg
  price_normalised: string;
  price_route: string[][]; // jsonb
  para_block_height: number;
}

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
   * Batch fetch latest asset historical data using raw SQL with DISTINCT ON
   * Replaces N sequential queries with 1 batch query
   */
  private async fetchLatestAssetHistDataBatch(
    assetIds: string[],
    maxBlockHeight: number,
    ctx: SqdProcessorContext<Store>
  ): Promise<AssetHistoricalData[]> {
    const startTime = performance.now();

    try {
      // Validate inputs
      if (!assetIds || assetIds.length === 0) {
        console.warn(
          '[WARN] fetchLatestAssetHistDataBatch called with empty assetIds'
        );
        return [];
      }

      if (!maxBlockHeight || maxBlockHeight < 0) {
        throw new Error(`Invalid maxBlockHeight: ${maxBlockHeight}`);
      }

      const pgPool = CommonPgPool.getInstance();

      const sql = `
        SELECT DISTINCT ON (asset_id)
          id,
          asset_id,
          total_issuance,
          dynamic_fee,
          usd_price_normalised,
          para_block_height
        FROM asset_historical_data
        WHERE asset_id = ANY($1::text[])
          AND para_block_height < $2
        ORDER BY asset_id, para_block_height DESC
      `;

      const result = await pgPool.query<RawAssetHistoricalDataRow>(sql, [
        assetIds,
        maxBlockHeight,
      ]);

      // Map raw rows to entities
      const entities = result.rows.map((row, index) => {
        try {
          return new AssetHistoricalData({
            id: row.id,
            assetId: row.asset_id,
            totalIssuance: BigInt(row.total_issuance),
            dynamicFee: row.dynamic_fee
              ? new AssetDynamicFee(undefined, row.dynamic_fee)
              : null,
            usdPriceNormalised: row.usd_price_normalised,
            paraBlockHeight: row.para_block_height,
          });
        } catch (mappingError: any) {
          console.error(
            `[ERROR] Failed to map row ${index} for asset ${row.asset_id}:`,
            mappingError,
            row
          );
          throw new Error(
            `Entity mapping failed for asset ${row.asset_id}: ${mappingError.message}`
          );
        }
      });

      const duration = performance.now() - startTime;
      console.log(
        `[PERF] fetchLatestAssetHistDataBatch: ` +
          `${assetIds.length} assets, ${result.rows.length} results, ${duration.toFixed(2)}ms`
      );

      return entities;
    } catch (error: any) {
      const duration = performance.now() - startTime;
      console.error(
        `[ERROR] fetchLatestAssetHistDataBatch failed after ${duration.toFixed(2)}ms:`,
        {
          assetIdsCount: assetIds?.length,
          maxBlockHeight,
          error: error.message,
          stack: error.stack,
        }
      );

      // Re-throw with context
      throw new Error(
        `Batch fetch failed for ${assetIds?.length} assets at block ${maxBlockHeight}: ${error.message}`
      );
    }
  }

  /**
   * Batch fetch latest asset spot price historical data using raw SQL with DISTINCT ON
   * Replaces N sequential queries with 1 batch query
   */
  private async fetchLatestAssetSpotPriceHistDataBatch(
    assetInIds: string[],
    maxBlockHeight: number,
    ctx: SqdProcessorContext<Store>
  ): Promise<AssetSpotPriceHistoricalData[]> {
    const startTime = performance.now();

    try {
      // Validate inputs
      if (!assetInIds || assetInIds.length === 0) {
        console.warn(
          '[WARN] fetchLatestAssetSpotPriceHistDataBatch called with empty assetInIds'
        );
        return [];
      }

      if (!maxBlockHeight || maxBlockHeight < 0) {
        throw new Error(`Invalid maxBlockHeight: ${maxBlockHeight}`);
      }

      const pgPool = CommonPgPool.getInstance();

      const sql = `
        SELECT DISTINCT ON (asset_in_id)
          id,
          asset_in_id,
          asset_out_id,
          price,
          price_normalised,
          price_route,
          para_block_height
        FROM asset_spot_price_historical_data
        WHERE asset_in_id = ANY($1::text[])
          AND para_block_height < $2
        ORDER BY asset_in_id, para_block_height DESC
      `;

      const result = await pgPool.query<RawAssetSpotPriceHistoricalDataRow>(
        sql,
        [assetInIds, maxBlockHeight]
      );

      // Map raw rows to entities
      const entities = result.rows.map((row, index) => {
        try {
          return new AssetSpotPriceHistoricalData({
            id: row.id,
            assetInId: row.asset_in_id,
            assetOutId: row.asset_out_id,
            price: BigInt(row.price),
            priceNormalised: row.price_normalised,
            priceRoute: row.price_route,
            paraBlockHeight: row.para_block_height,
          });
        } catch (mappingError: any) {
          console.error(
            `[ERROR] Failed to map row ${index} for asset ${row.asset_in_id}:`,
            mappingError,
            row
          );
          throw new Error(
            `Entity mapping failed for asset ${row.asset_in_id}: ${mappingError.message}`
          );
        }
      });

      const duration = performance.now() - startTime;
      console.log(
        `[PERF] fetchLatestAssetSpotPriceHistDataBatch: ` +
          `${assetInIds.length} assets, ${result.rows.length} results, ${duration.toFixed(2)}ms`
      );

      return entities;
    } catch (error: any) {
      const duration = performance.now() - startTime;
      console.error(
        `[ERROR] fetchLatestAssetSpotPriceHistDataBatch failed after ${duration.toFixed(2)}ms:`,
        {
          assetInIdsCount: assetInIds?.length,
          maxBlockHeight,
          error: error.message,
          stack: error.stack,
        }
      );

      // Re-throw with context
      throw new Error(
        `Batch fetch failed for ${assetInIds?.length} assets at block ${maxBlockHeight}: ${error.message}`
      );
    }
  }

  /**
   * ======================  Asset Historical Data =============================
   */
  async prefetchLastAssetHistDataItem(ctx: SqdProcessorContext<Store>) {
    if (this.assetHistoricalDataItemsCache.size !== 0) return;
    const currentBlockHeader = ctx.blocks[ctx.blocks.length - 1].header;

    const hasAnyRecord = await ctx.storeUtils.findOneWithLogs(
      AssetHistoricalData,
      { where: {} },
      { className: 'AssetHistoricalData' }
    );

    if (!hasAnyRecord) {
      console.log('AssetHistoricalData table is empty, skipping prefetch');
      return;
    }

    const storageDataAllAssets = (
      await parsers.storage.assetRegistry.getAssetAll(currentBlockHeader)
    ).filter((res) => !!res.data);

    // Collect asset IDs from storage and cache
    const assetIds: string[] = [];
    for (const assetData of storageDataAllAssets) {
      const asset = ctx.batchState.state.assetsAll.get(
        assetData.assetId.toString()
      );
      if (asset) {
        assetIds.push(asset.id);
      }
    }

    if (assetIds.length === 0) {
      console.log('No assets to prefetch for AssetHistoricalData');
      return;
    }

    // OPTIMIZED: Single batch query instead of N sequential queries
    const latestEntities = await this.fetchLatestAssetHistDataBatch(
      assetIds,
      currentBlockHeader.height,
      ctx
    );

    this.setLastAssetHistoricalDataItem(latestEntities);
  }

  setLastAssetHistoricalDataItem(items: AssetHistoricalData[]) {
    if (!items) return;

    const assetHistoryIndexByAsset = new Map<string, AssetHistoricalData[]>();

    for (const i of items) {
      if (!assetHistoryIndexByAsset.has(i.assetId)) {
        assetHistoryIndexByAsset.set(i.assetId, []);
      }
      assetHistoryIndexByAsset.get(i.assetId)!.push(i);
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
      { where: {} },
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

    // Collect asset IDs (as assetInId for spot prices)
    const assetInIds = storageDataAllAssets.map((assetData) =>
      assetData.assetId.toString()
    );

    if (assetInIds.length === 0) {
      console.log('No assets to prefetch for AssetSpotPriceHistoricalData');
      return;
    }

    // OPTIMIZED: Single batch query instead of N sequential queries
    const latestEntities = await this.fetchLatestAssetSpotPriceHistDataBatch(
      assetInIds,
      currentBlockHeader.height,
      ctx
    );

    this.setLastAssetSpotPriceHistoricalDataItem(latestEntities);
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
      if (!assetSpotPriceHistoryIndexByAssetIn.has(i.assetInId)) {
        assetSpotPriceHistoryIndexByAssetIn.set(i.assetInId, []);
      }
      assetSpotPriceHistoryIndexByAssetIn.get(i.assetInId)!.push(i);
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
