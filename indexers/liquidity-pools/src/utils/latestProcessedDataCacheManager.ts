import { Store } from '@subsquid/typeorm-store';

import { getOrCreateXykPool } from '../handlers/pools/pools/xykPool/xykPool';
import {
  AccountAssetBalanceHistoricalData,
  Asset,
  AssetHistoricalData,
  AssetSpotPriceHistoricalData,
  AssetSpotPriceRoute,
  Block,
  Xykpool,
  XykpoolHistoricalData,
} from '../model';
import { AssetDynamicFee } from '../model/generated/_assetDynamicFee';
import parsers from '../parsers';
import { SqdProcessorContext } from '../processor';
import { CommonPgPool } from './pgConnectionManagers/pgPool';
import { getLatestXykpoolHistoricalData } from './pgConnectionManagers/queries/getLatestXykpoolHistoricalData.sql';
import {
  getLatestAssetSpotPriceHistoricalData,
  getLatestAssetSpotPriceHistoricalDataByAssetRegistryId,
} from './pgConnectionManagers/queries/getLatestAssetSpotPriceHistoricalData.sql';
import { getLatestAssetHistoricalData } from './pgConnectionManagers/queries/getLatestAssetHistoricalData.sql';
import { BlockHeader } from '@subsquid/substrate-processor';

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

  // Key: `${accountId}-${assetId}`
  private accountAssetBalanceCache: Map<
    string,
    AccountAssetBalanceHistoricalData
  > = new Map();

  // Highest block height committed to accountAssetBalanceCache. Used to detect
  // SQD reorg/rollback re-runs (when a new batch starts at or before this height).
  private accountAssetBalanceCacheMaxObservedHeight: number = -1;

  static getInstance(): LatestProcessedDataCacheManager {
    if (!LatestProcessedDataCacheManager.instance) {
      LatestProcessedDataCacheManager.instance =
        new LatestProcessedDataCacheManager();
    }
    return LatestProcessedDataCacheManager.instance;
  }

  /**
   * Starts a keep-alive interval to prevent DB connection timeout
   * Pings the database every 30 seconds with a lightweight query
   */
  private startKeepAlive(ctx: SqdProcessorContext<Store>): NodeJS.Timeout {
    const pgPool = CommonPgPool.getInstance();

    const intervalId = setInterval(async () => {
      try {
        await pgPool.query('SELECT 1 FROM block LIMIT 1');
      } catch (error) {
        console.warn('[WARN] Keep-alive ping failed:', error);
      }
      try {
        await ctx.store.findOne(Asset, { where: {} });
      } catch (error) {
        console.warn('[WARN] Keep-alive ping failed:', error);
      }
    }, 30000);

    return intervalId;
  }

  /**
   * Stops the keep-alive interval
   */
  private stopKeepAlive(intervalId: NodeJS.Timeout): void {
    clearInterval(intervalId);
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
    const keepAliveInterval = this.startKeepAlive(ctx);

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
    } finally {
      this.stopKeepAlive(keepAliveInterval);
    }
  }

  /**
   * Batch fetch latest asset spot price historical data using raw SQL with DISTINCT ON
   * Replaces N sequential queries with 1 batch query
   */
  async fetchLatestAssetSpotPriceHistDataBatch({
    assetInIds,
    maxBlockHeight,
    ctx,
    dbPool,
    findPricesByAssetRegistryId = false,
  }: {
    assetInIds: string[];
    maxBlockHeight: number;
    ctx: SqdProcessorContext<Store>;
    dbPool?: CommonPgPool;
    findPricesByAssetRegistryId?: boolean;
  }): Promise<AssetSpotPriceHistoricalData[]> {
    const startTime = performance.now();
    const keepAliveInterval = this.startKeepAlive(ctx);

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

      const pgPool = dbPool ?? CommonPgPool.getInstance();

      const result = await pgPool.query<RawAssetSpotPriceHistoricalDataRow>(
        findPricesByAssetRegistryId
          ? getLatestAssetSpotPriceHistoricalDataByAssetRegistryId
          : getLatestAssetSpotPriceHistoricalData,
        [assetInIds, ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID, maxBlockHeight]
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
      // console.log(
      //   `[PERF] fetchLatestAssetSpotPriceHistDataBatch: ` +
      //     `${assetInIds.length} assets, ${result.rows.length} results, ${duration.toFixed(2)}ms`
      // );

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
    } finally {
      this.stopKeepAlive(keepAliveInterval);
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
    const keepAliveInterval = this.startKeepAlive(ctx);

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
    } finally {
      this.stopKeepAlive(keepAliveInterval);
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
      {
        className: 'AssetHistoricalData',
        originCallFn: 'prefetchLastAssetHistDataItem',
      }
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
  async prefetchLastAssetSpotPriceHistDataItem({
    ctx,
    blockHeader,
    dbPool,
    enforcePrefetch = false,
  }: {
    ctx: SqdProcessorContext<Store>;
    blockHeader?: BlockHeader;
    dbPool?: CommonPgPool;
    enforcePrefetch?: boolean;
  }) {
    if (this.assetSpotPriceHistoricalDataItemsCache.size !== 0) return;

    const currentBlockHeader =
      blockHeader ?? ctx.blocks[ctx.blocks.length - 1].header;

    const hasAnyRecord = await ctx.storeUtils.findOneWithLogs(
      AssetSpotPriceHistoricalData,
      { where: {} },
      {
        className: 'AssetSpotPriceHistoricalData',
        originCallFn: 'prefetchLastAssetSpotPriceHistDataItem',
      }
    );

    if (!enforcePrefetch && !hasAnyRecord) {
      console.log(
        'AssetSpotPriceHistoricalData table is empty, skipping prefetch'
      );
      return;
    }

    let assetInIds: string[] = [];
    let findPricesByAssetRegistryId = false;

    if (ctx.batchState.state.assetsAll.size > 0) {
      assetInIds = Array.from(ctx.batchState.state.assetsAll.values()).map(
        (a) => a.id
      );
    } else {
      /**
       * In this case there is tricky situation because
       * parsers.storage.assetRegistry.getAssetAll returns assetRegistryIds
       * but not assetIds. This can be a reason that prices for assets
       * where assetId != assetRegistryId will not be prefetched. That's
       * why we need to fetch prices with different query (with additional JOIN)
       */
      const storageDataAllAssets = (
        await parsers.storage.assetRegistry.getAssetAll(currentBlockHeader)
      ).filter((res) => !!res.data);

      // Collect asset IDs (as assetInId for spot prices)
      assetInIds = storageDataAllAssets.map((assetData) =>
        assetData.assetId.toString()
      );
      findPricesByAssetRegistryId = true;
    }

    if (assetInIds.length === 0) {
      console.log('No assets to prefetch for AssetSpotPriceHistoricalData');
      return;
    }

    // OPTIMIZED: Single batch query instead of N sequential queries
    const latestEntities = await this.fetchLatestAssetSpotPriceHistDataBatch({
      assetInIds,
      maxBlockHeight: currentBlockHeader.height,
      ctx,
      dbPool,
      findPricesByAssetRegistryId,
    });

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

  getAllCachedLastAssetSpotPriceHistoricalDataItems(): Map<
    string,
    AssetSpotPriceHistoricalData
  > {
    return this.assetSpotPriceHistoricalDataItemsCache;
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
      {
        className: 'XykpoolHistoricalData',
        originCallFn: 'prefetchLastXykpoolHistDataItem',
      }
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
   * ======================  Account Asset Balance Historical Data =============================
   */

  async prefetchLastAccountAssetBalances({
    ctx,
    accountAssetPairs,
    maxBlockHeight,
  }: {
    ctx: SqdProcessorContext<Store>;
    accountAssetPairs: { accountId: string; assetId: string }[];
    maxBlockHeight: number;
  }) {
    if (accountAssetPairs.length === 0) return;

    const pgPool = CommonPgPool.getInstance();

    const accountIds = accountAssetPairs.map((p) => p.accountId);
    const assetIds = accountAssetPairs.map((p) => p.assetId);

    // Use LATERAL join to get the latest balance for each (account, asset) pair
    // before the batch start block
    const result = await pgPool.query<{
      id: string;
      account_id: string;
      asset_id: string;
      transferable: string;
      total_locked: string;
      transferable_in_ref_asset_norm: string;
      total_locked_in_ref_asset_norm: string;
      para_block_height: number;
    }>(
      `
      SELECT
        lateral_data.id,
        lateral_data.account_id,
        lateral_data.asset_id,
        lateral_data.transferable,
        lateral_data.total_locked,
        lateral_data.transferable_in_ref_asset_norm,
        lateral_data.total_locked_in_ref_asset_norm,
        lateral_data.para_block_height
      FROM (
        SELECT DISTINCT ON (account_id, asset_id)
          account_id, asset_id
        FROM unnest($1::text[], $2::text[]) AS pairs(account_id, asset_id)
      ) AS unique_pairs
      CROSS JOIN LATERAL (
        SELECT
          id, account_id, asset_id, transferable, total_locked,
          transferable_in_ref_asset_norm, total_locked_in_ref_asset_norm,
          para_block_height
        FROM account_asset_balance_historical_data
        WHERE account_id = unique_pairs.account_id
          AND asset_id = unique_pairs.asset_id
          AND para_block_height < $3
        ORDER BY para_block_height DESC
        LIMIT 1
      ) AS lateral_data;
      `,
      [accountIds, assetIds, maxBlockHeight]
    );

    for (const row of result.rows) {
      const entity = new AccountAssetBalanceHistoricalData({
        id: row.id,
        accountId: row.account_id,
        assetId: row.asset_id,
        transferable: BigInt(row.transferable),
        totalLocked: BigInt(row.total_locked),
        transferableInRefAssetNorm: row.transferable_in_ref_asset_norm,
        totalLockedInRefAssetNorm: row.total_locked_in_ref_asset_norm,
        paraBlockHeight: row.para_block_height,
      });

      const cacheKey = `${row.account_id}-${row.asset_id}`;
      const existing = this.accountAssetBalanceCache.get(cacheKey);

      // Keep the most recent entry
      if (!existing || existing.paraBlockHeight < entity.paraBlockHeight) {
        this.accountAssetBalanceCache.set(cacheKey, entity);
      }
    }
  }

  getLastAccountAssetBalance(
    accountId: string,
    assetId: string
  ): AccountAssetBalanceHistoricalData | undefined {
    return this.accountAssetBalanceCache.get(`${accountId}-${assetId}`);
  }

  /**
   * Prefetch ALL latest balances for a list of accounts from
   * account_asset_balance_historical_data table.
   * Used to discover all assets an account holds (not just event-involved ones).
   * Skips accounts that already have entries in cache (fully loaded from previous batch).
   */
  async prefetchAllAccountAssetBalances({
    ctx,
    accountIds,
    maxBlockHeight,
  }: {
    ctx: SqdProcessorContext<Store>;
    accountIds: string[];
    maxBlockHeight: number;
  }) {
    if (accountIds.length === 0) return;

    // Filter out accounts already in cache
    const accountsToFetch = accountIds.filter(
      (id) => !this.hasAccountBalances(id)
    );

    if (accountsToFetch.length === 0) return;

    const pgPool = CommonPgPool.getInstance();

    const result = await pgPool.query<{
      id: string;
      account_id: string;
      asset_id: string;
      transferable: string;
      total_locked: string;
      transferable_in_ref_asset_norm: string;
      total_locked_in_ref_asset_norm: string;
      para_block_height: number;
    }>(
      `
      SELECT
        lateral_data.id,
        lateral_data.account_id,
        lateral_data.asset_id,
        lateral_data.transferable,
        lateral_data.total_locked,
        lateral_data.transferable_in_ref_asset_norm,
        lateral_data.total_locked_in_ref_asset_norm,
        lateral_data.para_block_height
      FROM (
        SELECT DISTINCT account_id, asset_id
        FROM account_asset_balance_historical_data
        WHERE account_id = ANY($1::text[])
          AND para_block_height < $2
      ) AS known_pairs
      CROSS JOIN LATERAL (
        SELECT
          id, account_id, asset_id, transferable, total_locked,
          transferable_in_ref_asset_norm, total_locked_in_ref_asset_norm,
          para_block_height
        FROM account_asset_balance_historical_data
        WHERE account_id = known_pairs.account_id
          AND asset_id = known_pairs.asset_id
          AND para_block_height < $2
        ORDER BY para_block_height DESC
        LIMIT 1
      ) AS lateral_data;
      `,
      [accountsToFetch, maxBlockHeight]
    );

    for (const row of result.rows) {
      const entity = new AccountAssetBalanceHistoricalData({
        id: row.id,
        accountId: row.account_id,
        assetId: row.asset_id,
        transferable: BigInt(row.transferable),
        totalLocked: BigInt(row.total_locked),
        transferableInRefAssetNorm: row.transferable_in_ref_asset_norm,
        totalLockedInRefAssetNorm: row.total_locked_in_ref_asset_norm,
        paraBlockHeight: row.para_block_height,
      });

      const cacheKey = `${row.account_id}-${row.asset_id}`;
      const existing = this.accountAssetBalanceCache.get(cacheKey);

      // Only add if not already cached with a newer entry
      if (!existing || existing.paraBlockHeight < entity.paraBlockHeight) {
        this.accountAssetBalanceCache.set(cacheKey, entity);
      }
    }
  }

  /**
   * Check if an account has any cached balance entries.
   */
  hasAccountBalances(accountId: string): boolean {
    const prefix = `${accountId}-`;
    for (const key of this.accountAssetBalanceCache.keys()) {
      if (key.startsWith(prefix)) return true;
    }
    return false;
  }

  getAllAccountAssetBalances(
    accountId: string
  ): Map<string, AccountAssetBalanceHistoricalData> {
    const result = new Map<string, AccountAssetBalanceHistoricalData>();
    const prefix = `${accountId}-`;
    for (const [key, value] of this.accountAssetBalanceCache.entries()) {
      if (key.startsWith(prefix)) {
        result.set(value.assetId, value);
      }
    }
    return result;
  }

  setLastAccountAssetBalance(items: AccountAssetBalanceHistoricalData[]) {
    if (!items) return;

    for (const item of items) {
      const cacheKey = `${item.accountId}-${item.assetId}`;
      const existing = this.accountAssetBalanceCache.get(cacheKey);

      if (!existing || existing.paraBlockHeight <= item.paraBlockHeight) {
        this.accountAssetBalanceCache.set(cacheKey, item);
      }

      if (
        item.paraBlockHeight > this.accountAssetBalanceCacheMaxObservedHeight
      ) {
        this.accountAssetBalanceCacheMaxObservedHeight = item.paraBlockHeight;
      }
    }
  }

  /**
   * Drop the entire account-asset balance cache when SQD re-runs a previously
   * processed block range (reorg / rollback). Without this, delta-based balance
   * calculation in processBalanceEventsSequentially would read post-transfer
   * cached state as if it were pre-transfer state and double the delta.
   *
   * Returns true if cache was wiped.
   */
  invalidateAccountAssetBalanceCacheOnReorg(
    incomingBatchFirstBlockHeight: number
  ): boolean {
    if (this.accountAssetBalanceCacheMaxObservedHeight < 0) return false;
    if (
      incomingBatchFirstBlockHeight >
      this.accountAssetBalanceCacheMaxObservedHeight
    ) {
      return false;
    }

    console.warn(
      `[reorg] Invalidating accountAssetBalanceCache. ` +
        `incomingBatchFirstBlockHeight=${incomingBatchFirstBlockHeight}, ` +
        `cacheMaxObservedHeight=${this.accountAssetBalanceCacheMaxObservedHeight}, ` +
        `cachedEntries=${this.accountAssetBalanceCache.size}`
    );

    this.accountAssetBalanceCache.clear();
    this.accountAssetBalanceCacheMaxObservedHeight = -1;
    return true;
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
