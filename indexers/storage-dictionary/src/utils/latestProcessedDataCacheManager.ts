import {
  Aavepool,
  AccountAssetBalanceHistoricalData,
  AssetHistoricalData,
  EmaOracle,
  MmAggregatorOracle,
  Xykpool,
  XykpoolAssetsData,
} from '../model';
import { ProcessorContext } from '../processor';
import parsers from '../parsers';
import { LessThan } from 'typeorm';
import { Store } from '@subsquid/typeorm-store';
import { AssetDetailsWithId } from '../parsers/types/storage';

export class LatestProcessedDataCacheManager {
  private static instance: LatestProcessedDataCacheManager;

  private assetHistoricalDataItemsCache: Map<string, AssetHistoricalData> =
    new Map();

  private emaOracleCache: EmaOracle | null = null;

  private mmAggregatorOracleCache: Map<string, MmAggregatorOracle> = new Map();

  private aavepoolsCache: Map<string, Aavepool> = new Map();

  private xykpoolsCache: Map<string, Map<string, XykpoolAssetsData>> =
    new Map();

  private accAssetBalanceCache: Map<
    string,
    Map<string, AccountAssetBalanceHistoricalData>
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
  async prefetchLastAssetHistDataItem(ctx: ProcessorContext<Store>) {
    if (this.assetHistoricalDataItemsCache.size !== 0) return;
    const currentBlockHeader = ctx.blocks[ctx.blocks.length - 1].header;

    const storageDataAllAssets = (
      await parsers.storage.assetRegistry.getAssetsAll(currentBlockHeader)
    ).filter((res) => !!res.data);

    const latestEntities = await Promise.all(
      storageDataAllAssets.map((assetData): AssetHistoricalData | undefined => {
        // @ts-ignore
        return ctx.store.findOne(AssetHistoricalData, {
          where: {
            asset: { id: assetData.assetId.toString() },
            paraBlockHeight: LessThan(currentBlockHeader.height),
          },
          order: {
            paraBlockHeight: 'DESC',
          },
          relations: {
            asset: true,
          },
        });
      })
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
   * =============================  EMA Oracle =================================
   */

  setLastEmaOracle(items: EmaOracle[]) {
    if (!items) return;

    const sortedRecords = items.sort(
      (a, b) => b.paraBlockHeight - a.paraBlockHeight
    );

    this.emaOracleCache = sortedRecords[0];
  }
  getLastEmaOracle(): EmaOracle | null {
    return this.emaOracleCache;
  }

  /**
   * =====================   MM Aggregator Oracle ==============================
   */

  setLastMmAggregatorOracle(items: MmAggregatorOracle[]) {
    if (!items) return;

    const oraclesHistoryIndex = new Map<string, MmAggregatorOracle[]>();

    for (const i of items) {
      if (!oraclesHistoryIndex.has(i.address)) {
        oraclesHistoryIndex.set(i.address, []);
      }
      oraclesHistoryIndex.get(i.address)!.push(i);
    }

    for (const [address, list] of oraclesHistoryIndex.entries()) {
      const orderedList = list.sort(
        (a, b) => b.paraBlockHeight - a.paraBlockHeight
      );

      this.mmAggregatorOracleCache.set(address, orderedList[0]);
    }
  }
  getLastMmAggregatorOracle(address: string): MmAggregatorOracle | null {
    return this.mmAggregatorOracleCache.get(address) || null;
  }

  /**
   * ==========================   Aave pool ====================================
   */
  setLastAavepool(items: Aavepool[]) {
    if (!items) return;

    const poolsHistoryIndex = new Map<string, Aavepool[]>();

    for (const i of items) {
      if (!poolsHistoryIndex.has(i.poolId)) {
        poolsHistoryIndex.set(i.poolId, []);
      }
      poolsHistoryIndex.get(i.poolId)!.push(i);
    }

    for (const [poolId, list] of poolsHistoryIndex.entries()) {
      const orderedList = list.sort(
        (a, b) => b.paraBlockHeight - a.paraBlockHeight
      );

      this.aavepoolsCache.set(poolId, orderedList[0]);
    }
  }
  getLastAavepool(poolId: string): Aavepool | undefined {
    return this.aavepoolsCache.get(poolId);
  }

  /**
   * ========================   Xykpool Asset ==================================
   */
  async prefetchLastXykpoolAssetHistDataItem(ctx: ProcessorContext<Store>) {
    if (this.xykpoolsCache.size !== 0) return;
    const currentBlockHeader = ctx.blocks[ctx.blocks.length - 1].header;
    const allPoolsWithAssets =
      await parsers.storage.xyk.getAllPoolsWithAssets(currentBlockHeader);

    const latestEntities = await Promise.all(
      allPoolsWithAssets
        .map((pool): [string, number][] => [
          [pool.poolAddress, pool.assetAId],
          [pool.poolAddress, pool.assetBId],
        ])
        .flat()
        .map(([poolId, assetId]): XykpoolAssetsData | undefined => {
          // @ts-ignore
          return ctx.store.findOne(XykpoolAssetsData, {
            where: {
              assetId: +assetId,
              pool: { poolAddress: poolId },
              paraBlockHeight: LessThan(currentBlockHeader.height),
            },
            order: {
              paraBlockHeight: 'DESC',
            },
            relations: {
              pool: true,
            },
          });
        })
    );

    this.setLastXykpoolAssetHistDataItem(latestEntities.filter((i) => !!i));
  }

  setLastXykpoolAssetHistDataItem(items: XykpoolAssetsData[]) {
    if (!items) return;

    const poolAssetsHistoryIndex = new Map<
      string,
      Map<number, XykpoolAssetsData[]>
    >();

    for (const i of items) {
      if (!poolAssetsHistoryIndex.has(i.pool.poolAddress)) {
        poolAssetsHistoryIndex.set(i.pool.poolAddress, new Map());
      }
      if (!poolAssetsHistoryIndex.get(i.pool.poolAddress)!.has(i.assetId)) {
        poolAssetsHistoryIndex.get(i.pool.poolAddress)!.set(i.assetId, []);
      }
      poolAssetsHistoryIndex.get(i.pool.poolAddress)!.get(i.assetId)!.push(i);
    }

    for (const [poolId, assetsMap] of poolAssetsHistoryIndex.entries()) {
      for (const [assetId, entriesList] of assetsMap.entries()) {
        const orderedList = entriesList.sort(
          (a, b) => b.paraBlockHeight - a.paraBlockHeight
        );

        if (!this.xykpoolsCache.has(poolId)) {
          this.xykpoolsCache.set(poolId, new Map());
        }
        this.xykpoolsCache.get(poolId)!.set(`${assetId}`, orderedList[0]);
      }
    }
  }
  getLastXykpoolAssetHistoricalDataItem(
    poolId: string,
    assetId: string
  ): XykpoolAssetsData | undefined {
    return this.xykpoolsCache.get(poolId)?.get(assetId);
  }

  /**
   * ========================   Account  ==================================
   */

  setLastAccAssetBalanceHistDataItem(
    items: AccountAssetBalanceHistoricalData[]
  ) {
    if (!items) return;

    const accAssetsBalanceHistoryIndex = new Map<
      string,
      Map<string, AccountAssetBalanceHistoricalData[]>
    >();

    for (const i of items) {
      if (!accAssetsBalanceHistoryIndex.has(i.accountId)) {
        accAssetsBalanceHistoryIndex.set(i.accountId, new Map());
      }
      if (!accAssetsBalanceHistoryIndex.get(i.accountId)!.has(i.assetId)) {
        accAssetsBalanceHistoryIndex.get(i.accountId)!.set(i.assetId, []);
      }
      accAssetsBalanceHistoryIndex.get(i.accountId)!.get(i.assetId)!.push(i);
    }

    for (const [
      accountId,
      assetsMap,
    ] of accAssetsBalanceHistoryIndex.entries()) {
      for (const [assetId, entriesList] of assetsMap.entries()) {
        const orderedList = entriesList.sort(
          (a, b) => b.paraBlockHeight - a.paraBlockHeight
        );

        if (!this.accAssetBalanceCache.has(accountId)) {
          this.accAssetBalanceCache.set(accountId, new Map());
        }
        this.accAssetBalanceCache
          .get(accountId)!
          .set(`${assetId}`, orderedList[0]);
      }
    }
  }
  getLastAccAssetBalanceHistoricalDataItem(
    accountId: string,
    assetId: string
  ): AccountAssetBalanceHistoricalData | undefined {
    return this.accAssetBalanceCache.get(accountId)?.get(assetId);
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

    console.log('emaOraclesCache >>>', this.emaOracleCache?.id);

    console.log('aavepoolsCache >>>');
    console.dir(
      Array.from(this.aavepoolsCache.entries()).map(
        ([key, item]) => `${key} => ${item.id}`
      ),
      { depth: null }
    );

    for (const p of Array.from(this.xykpoolsCache.entries())) {
      console.log(`xykpoolsCache ${p[0]} >>>`);
      console.dir(
        Array.from(p[1].entries()).map(([key, item]) => `${key} => ${item.id}`)
      );
    }
  }
}
