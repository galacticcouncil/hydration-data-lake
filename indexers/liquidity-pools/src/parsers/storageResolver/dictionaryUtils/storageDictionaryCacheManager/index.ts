import { CacheStorageHelper } from './cacheStorageHelper';
import {
  PaginationConfig,
  PalletDictionaryCollectedData,
  ProcessingTopic,
} from '../types';
import { Between } from 'typeorm/find-options/operator/Between';
import { QueriesHelper } from '../queriesHelper';
import { AppConfig } from '../../../../appConfig';
import {
  Aavepool as AavepoolGlq,
  AssetHistoricalDatum as AssetHistoricalDatumGql,
  BlockCompressedDataOrderBy,
  BlockCompressedDatum,
  BlockCompressedDatumFilter,
  EmaOracle as EmaOracleGql,
  GetBlockCompressedData,
  GetBlockCompressedDataQuery,
  GetBlockCompressedDataQueryVariables,
  InputMaybe,
  Lbppool as LbpPoolGlq,
  Omnipool as OmnipoolGql,
  Stableswap as StableswapGql,
  Xykpool as XykpoolGlq,
} from '../apiTypes/types';
import {
  BlockCompressedDataKey,
  encodeBlockCompressedData,
} from '../helpers/blockCompressedDataHandler';
import { BlockCompressedData } from './cacheStorageEntities/blockCompressedData';

const appConfig = AppConfig.getInstance();

export class StorageDictionaryCacheManager extends CacheStorageHelper {
  private static instance: StorageDictionaryCacheManager;
  private procCtxFromBlockNumber: number = 0;
  private procCtxToBlockNumber: number = 0;
  private maxRecordsNumber = 5000;
  private topCacheBlockNumber = 0;

  protected gqlQueryHelper: QueriesHelper;

  static getInstance(): StorageDictionaryCacheManager {
    if (!StorageDictionaryCacheManager.instance) {
      StorageDictionaryCacheManager.instance =
        new StorageDictionaryCacheManager();
    }
    return StorageDictionaryCacheManager.instance;
  }

  constructor() {
    super();
    this.gqlQueryHelper = new QueriesHelper({ appConfig });
  }

  setCurrentProcessingBlocksRange({
    fromBlock,
    toBlock,
  }: {
    fromBlock: number;
    toBlock: number;
  }) {
    this.procCtxFromBlockNumber = fromBlock;
    this.procCtxToBlockNumber = toBlock;

    if (!this.connection) {
      this.initConnection();
      // start fetching data loop from block number toBlock + 1 - we should ignore first batch
      this.topCacheBlockNumber = toBlock + 1;
      return;
    }

    // if connection is ready it means that cache is filled and we ned remove old items - remove all elements in range fromBlock - toBlock
  }

  async getCacheForBlocksRange({
    storageTopic,
    fromBlockNumber,
    toBlockNumber,
  }: {
    storageTopic: ProcessingTopic;
    fromBlockNumber: number;
    toBlockNumber: number;
  }) {
    const fromBlockEntity = await this.blockCompressedDataRepository.findOne({
      where: { paraBlockNumber: fromBlockNumber },
    });

    const toBlockEntity = await this.blockCompressedDataRepository.findOne({
      where: { paraBlockNumber: toBlockNumber },
    });

    if (!fromBlockEntity || !toBlockEntity) return null;

    return this.blockCompressedDataRepository.find({
      where: { paraBlockNumber: Between(fromBlockNumber, toBlockNumber) },
    });
  }

  async fetchData() {
    const fetchBlockCompressedDataPaginated = async ({
      pageSize,
      offset,
      topic,
    }: PaginationConfig) => {
      const filter: InputMaybe<BlockCompressedDatumFilter> = {
        paraBlockHeight: {
          greaterThanOrEqualTo: this.topCacheBlockNumber,
        },
        and: [
          {
            paraBlockHeight: {
              lessThanOrEqualTo:
                this.topCacheBlockNumber + this.maxRecordsNumber,
            },
          },
        ],
      };

      const resp = await this.gqlQueryHelper.dictionaryGqlRequest<
        GetBlockCompressedDataQuery,
        GetBlockCompressedDataQueryVariables
      >({
        query: GetBlockCompressedData,
        variables: {
          filter,
          orderBy: BlockCompressedDataOrderBy.ParaBlockHeightAsc,
          first: pageSize,
          offset,
        },
        dictName: topic,
      });

      return {
        data:
          resp.data && resp.data.blockCompressedData
            ? resp.data.blockCompressedData.nodes
            : [],
        totalCount:
          resp.data && resp.data.blockCompressedData
            ? resp.data.blockCompressedData.totalCount
            : 0,
      };
    };

    const allGenericHistStorageFetchPromise = async () => {
      // if (!this.batchCtx.appConfig.PROCESS_LBP_POOLS) return [];
      const data: BlockCompressedDatum[] = [];
      for await (const page of this.gqlQueryHelper.fetchAllPages({
        limit: appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
        requestPromise: fetchBlockCompressedDataPaginated,
        topic: ProcessingTopic.ASSET_HIST_DATA,
      })) {
        if (!page) continue;
        data.push(...(page as BlockCompressedDatum[]));
      }

      return { pallet: ProcessingTopic.ASSET_HIST_DATA, data: data.flat() };
    };

    const allLbpPoolStorageFetchPromise = async () => {
      const data: BlockCompressedDatum[] = [];
      for await (const page of this.gqlQueryHelper.fetchAllPages({
        limit: appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
        requestPromise: fetchBlockCompressedDataPaginated,
        topic: ProcessingTopic.LBP,
      })) {
        if (!page) continue;
        data.push(...(page as BlockCompressedDatum[]));
      }

      return { pallet: ProcessingTopic.LBP, data: data.flat() };
    };

    const allXykPoolStorageFetchPromise = async () => {
      const data: BlockCompressedDatum[] = [];
      for await (const page of this.gqlQueryHelper.fetchAllPages({
        limit: appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
        requestPromise: fetchBlockCompressedDataPaginated,
        topic: ProcessingTopic.XYK,
      })) {
        if (!page) continue;
        data.push(...(page as BlockCompressedDatum[]));
      }

      return { pallet: ProcessingTopic.XYK, data: data.flat() };
    };

    const allOmnipoolStorageFetchPromise = async () => {
      const data: BlockCompressedDatum[] = [];
      for await (const page of this.gqlQueryHelper.fetchAllPages({
        limit: appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
        requestPromise: fetchBlockCompressedDataPaginated,
        topic: ProcessingTopic.OMNIPOOL,
      })) {
        if (!page) continue;
        data.push(...(page as BlockCompressedDatum[]));
      }

      return { pallet: ProcessingTopic.OMNIPOOL, data: data.flat() };
    };

    const allStablepoolStorageFetchPromise = async () => {
      const data: BlockCompressedDatum[] = [];
      for await (const page of this.gqlQueryHelper.fetchAllPages({
        limit: appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
        requestPromise: fetchBlockCompressedDataPaginated,
        topic: ProcessingTopic.STABLESWAP,
      })) {
        if (!page) continue;
        data.push(...(page as BlockCompressedDatum[]));
      }

      return { pallet: ProcessingTopic.STABLESWAP, data: data.flat() };
    };

    const fullResponse = await Promise.all([
      allLbpPoolStorageFetchPromise(),
      allXykPoolStorageFetchPromise(),
      allOmnipoolStorageFetchPromise(),
      allStablepoolStorageFetchPromise(),
      allGenericHistStorageFetchPromise(),
    ]);

    // this.persistResponseDataToCacheStorage(fullResponse);
  }

  // persistResponseDataToCacheStorage(
  //   rawData: Array<{ pallet: ProcessingTopic; data: BlockCompressedDatum[] }>
  // ) {
  //   const recordsToCache: BlockCompressedData[][] = [];
  //
  //   for (const palletData of rawData) {
  //     switch (palletData.pallet) {
  //       case ProcessingTopic.AAVE:
  //       case ProcessingTopic.EMA_ORACLE:
  //       case ProcessingTopic.ASSET_HIST_DATA:
  //         recordsToCache.push(
  //           palletData.data.map(
  //             (r) =>
  //               new BlockCompressedData({
  //                 id: `${r.paraBlockHeight}-${ProcessingTopic.GENERIC_HIST_DATA}`,
  //                 dictionaryTopic: ProcessingTopic.GENERIC_HIST_DATA,
  //                 data: r.data,
  //                 paraBlockNumber: r.paraBlockHeight,
  //               })
  //           )
  //         );
  //         break;
  //       case ProcessingTopic.LBP:
  //         recordsToCache.push(
  //           palletData.data.map(
  //             (r) =>
  //               new BlockCompressedData({
  //                 id: `${r.paraBlockHeight}-${ProcessingTopic.LBP}`,
  //                 dictionaryTopic: ProcessingTopic.LBP,
  //                 data: r.data,
  //                 paraBlockNumber: r.paraBlockHeight,
  //               })
  //           )
  //         );
  //         break;
  //       case ProcessingTopic.XYK:
  //         recordsToCache.push(
  //           palletData.data.map(
  //             (r) =>
  //               new BlockCompressedData({
  //                 id: `${r.paraBlockHeight}-${ProcessingTopic.LBP}`,
  //                 dictionaryTopic: ProcessingTopic.LBP,
  //                 data: r.data,
  //                 paraBlockNumber: r.paraBlockHeight,
  //               })
  //           )
  //         );
  //         break;
  //       case ProcessingTopic.OMNIPOOL:
  //         this.batchStorageState.set(
  //           ProcessingTopic.OMNIPOOL,
  //           new Map(
  //             (palletData.data as OmnipoolGql[]).map((item) => [item.id, item])
  //           )
  //         );
  //         break;
  //       case ProcessingTopic.STABLESWAP:
  //         this.batchStorageState.set(
  //           ProcessingTopic.STABLESWAP,
  //           new Map(
  //             (palletData.data as StableswapGql[]).map((item) => [
  //               item.id,
  //               item,
  //             ])
  //           )
  //         );
  //         break;
  //       default:
  //     }
  //   }
  // }
}
