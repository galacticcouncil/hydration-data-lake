import { Store } from '@subsquid/typeorm-store';

import { getOrCreateXykPool } from '../handlers/pools/pools/xykPool/xykPool';
import {
  AssetHistoricalData,
  AssetSpotPriceHistoricalData,
  AssetSpotPriceRoute,
  Xykpool,
  XykpoolHistoricalData,
} from '../model';
import { AssetDynamicFee } from '../model/generated/_assetDynamicFee';
import parsers from '../parsers';
import { SqdProcessorContext } from '../processor';
import { CommonPgPool } from './pgConnectionManagers/pgPool';
import { getLatestXykpoolHistoricalData } from './pgConnectionManagers/queries/getLatestXykpoolHistoricalData.sql';
import { getLatestAssetSpotPriceHistoricalData } from './pgConnectionManagers/queries/getLatestAssetSpotPriceHistoricalData.sql';
import { getLatestAssetHistoricalData } from './pgConnectionManagers/queries/getLatestAssetHistoricalData.sql';

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
  price_route_id: string; // foreign key to price_route table
  para_block_height: number;
}

interface RawXykpoolHistoricalDataRow {
  id: string;
  pool_id: string;
  asset_a_id: string;
  asset_b_id: string;
  asset_a_balance: string;
  asset_b_balance: string;
  tvl_in_ref_asset_norm: string;
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

  private xykpoolHistoricalDataItemsCache: Map<string, XykpoolHistoricalData> =
    new Map();

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

      const result = await pgPool.query<RawAssetHistoricalDataRow>(
        getLatestAssetHistoricalData,
        [assetIds, maxBlockHeight]
      );

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

      const result = await pgPool.query<RawAssetSpotPriceHistoricalDataRow>(
        getLatestAssetSpotPriceHistoricalData,
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
            priceRoute: new AssetSpotPriceRoute({ id: row.price_route_id }),
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
   * Batch fetch latest asset spot price historical data using raw SQL with DISTINCT ON
   * Replaces N sequential queries with 1 batch query
   */
  private async fetchLatestXykpoolHistDataBatch(
    poolIds: string[],
    maxBlockHeight: number,
    ctx: SqdProcessorContext<Store>
  ): Promise<XykpoolHistoricalData[]> {
    const startTime = performance.now();

    try {
      // Validate inputs
      if (!poolIds || poolIds.length === 0) {
        console.warn(
          '[WARN] fetchLatestAssetSpotPriceHistDataBatch called with empty poolIds'
        );
        return [];
      }

      if (!maxBlockHeight || maxBlockHeight < 0) {
        throw new Error(`Invalid maxBlockHeight: ${maxBlockHeight}`);
      }

      const pgPool = CommonPgPool.getInstance();

      const result = await pgPool.query<RawXykpoolHistoricalDataRow>(
        getLatestXykpoolHistoricalData,
        [poolIds, maxBlockHeight]
      );

      const poolsMap = new Map<string, Xykpool>();

      for (const row of result.rows) {
        const poolEntity = await getOrCreateXykPool({
          ctx,
          id: row.pool_id,
          ensure: false,
        });
        if (!poolEntity) continue;
        poolsMap.set(row.pool_id, poolEntity);
      }

      // Map raw rows to entities
      const entities = result.rows
        .filter((row) => poolsMap.has(row.pool_id))
        .map((row, index) => {
          try {
            return new XykpoolHistoricalData({
              id: row.id,
              pool: poolsMap.get(row.pool_id),
              assetAId: row.asset_a_id,
              assetBId: row.asset_b_id,
              assetABalance: BigInt(row.asset_a_balance),
              assetBBalance: BigInt(row.asset_b_balance),
              tvlInRefAssetNorm: row.tvl_in_ref_asset_norm,
              paraBlockHeight: row.para_block_height,
            });
          } catch (mappingError: any) {
            console.error(
              `[ERROR] Failed to map row ${index} for pool ${row.pool_id}:`,
              mappingError,
              row
            );
            throw new Error(
              `Entity mapping failed for pool ${row.pool_id}: ${mappingError.message}`
            );
          }
        });

      const duration = performance.now() - startTime;
      console.log(
        `[PERF] fetchLatestAssetSpotPriceHistDataBatch: ` +
          `${poolIds.length} assets, ${result.rows.length} results, ${duration.toFixed(2)}ms`
      );

      return entities;
    } catch (error: any) {
      const duration = performance.now() - startTime;
      console.error(
        `[ERROR] fetchLatestAssetSpotPriceHistDataBatch failed after ${duration.toFixed(2)}ms:`,
        {
          assetInIdsCount: poolIds?.length,
          maxBlockHeight,
          error: error.message,
          stack: error.stack,
        }
      );

      // Re-throw with context
      throw new Error(
        `Batch fetch failed for ${poolIds?.length} assets at block ${maxBlockHeight}: ${error.message}`
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
   * ======================  XYK Pool Historical Data =============================
   */
  async prefetchLastXykpoolHistDataItem(ctx: SqdProcessorContext<Store>) {
    if (this.xykpoolHistoricalDataItemsCache.size !== 0) return;
    const currentBlockHeader = ctx.blocks[ctx.blocks.length - 1].header;

    const hasAnyRecord = await ctx.storeUtils.findOneWithLogs(
      XykpoolHistoricalData,
      {
        where: {},
        relations: {
          pool: true,
        },
      },
      { className: 'XykpoolHistoricalData' }
    );

    if (!hasAnyRecord) {
      console.log('XykpoolHistoricalData table is empty, skipping prefetch');
      return;
    }

    const storageDataAllPools = (
      await parsers.storage.xyk.getPoolShareTokenPairsMany({
        block: currentBlockHeader,
      })
    ).filter((res) => !!res);

    // Collect asset IDs (as assetInId for spot prices)
    const poolIds = storageDataAllPools.map((pool) => pool.poolId);

    if (poolIds.length === 0) {
      console.log('No pools to prefetch for XykpoolHistoricalData');
      return;
    }

    // OPTIMIZED: Single batch query instead of N sequential queries
    const latestEntities = await this.fetchLatestXykpoolHistDataBatch(
      poolIds,
      currentBlockHeader.height,
      ctx
    );

    this.setLastXykpoolHistoricalDataItem(latestEntities);
  }

  setLastXykpoolHistoricalDataItem(items: XykpoolHistoricalData[]) {
    if (!items) return;

    const xykpoolHistoryIndexByPoolId = new Map<
      string,
      XykpoolHistoricalData[]
    >();

    for (const i of items) {
      if (!xykpoolHistoryIndexByPoolId.has(i.pool.id)) {
        xykpoolHistoryIndexByPoolId.set(i.pool.id, []);
      }
      xykpoolHistoryIndexByPoolId.get(i.pool.id)!.push(i);
    }

    for (const [poolId, list] of xykpoolHistoryIndexByPoolId.entries()) {
      const orderedList = list.sort(
        (a, b) => b.paraBlockHeight - a.paraBlockHeight
      );
      this.xykpoolHistoricalDataItemsCache.set(poolId, orderedList[0]);
    }
  }

  getLastXykpoolHistoricalDataItem(
    poolId: string
  ): XykpoolHistoricalData | undefined {
    return this.xykpoolHistoricalDataItemsCache.get(poolId);
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
