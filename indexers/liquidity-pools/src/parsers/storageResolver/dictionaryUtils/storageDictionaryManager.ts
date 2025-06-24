import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Aavepool as AavepoolGlq,
  AccountBalances as AccountBalancesGql,
  AssetHistoricalDatum as AssetHistoricalDatumGql,
  BlockCompressedDataOrderBy,
  BlockCompressedDatumFilter,
  EmaOracle as EmaOracleGql,
  GetBlockCompressedData,
  GetBlockCompressedDataQuery,
  GetBlockCompressedDataQueryVariables,
  InputMaybe,
  Lbppool as LbpPoolGlq,
  MinifiedDataStructureTypeName,
  Omnipool as OmnipoolGql,
  Stableswap as StableswapGql,
  Xykpool as XykpoolGlq,
} from './apiTypes/types';
import { QueriesHelper } from './queriesHelper';
import {
  PaginationConfig,
  PalletDictionaryCollectedData,
  ProcessingTopic,
} from './types';
import {
  AccountData,
  AssetDynamicFeeData,
  AssetExistentialDeposit,
  EmaOracleEntryData,
  GetAssetsDynamicFeesAllInput,
  GetConstantsInput,
  GetDataAtBlockInput,
  GetEmaOraclesInput,
  GetPoolAssetInfoInput,
  LbpGetPoolDataInput,
  LbpPoolData,
  OmnipoolAssetData,
  OmnipoolAssetTradability,
  OmnipoolData,
  OmnipoolGetAssetDataInput,
  OmnipoolGetHubAssetTradabilityInput,
  StablepoolAllPoolsInfoWithPoolId,
  StablepoolAssetState,
  StablepoolGetPoolDataInput,
  StablepoolGetPoolPegsInput,
  StablepoolInfo,
  StablepoolManyPoolsPegsInfoWithPoolId,
  StablepoolPoolPegsInfo,
  StableswapPegSource,
  TokensGetTokensTotalIssuanceInput,
  TokensGetTokenTotalIssuanceInput,
  TokenTotalIssuance,
  XykGetAssetsInput,
  XykGetPoolShareTokenPairsManyInput,
  XykGetShareTokenInput,
  XykPoolAssetIds,
  XykPoolData,
  XykPoolShareTokenPair,
} from '../../types/storage';
import { EmaOraclePeriod } from '../../../model';
import {
  AaveTradeExecutorPoolDataWithPoolId,
  AaveTradeExecutorPoolsInput,
} from '../../runtimeApiResolver/types';
import sizeof from 'object-sizeof';
import {
  BlockCompressedDataKey,
  encodeBlockCompressedData,
} from './helpers/blockCompressedDataHandler';
import { getStorageDictionaryItemsListByBlockNumber } from './helpers/common';
import { MinifiedDataStructureManager } from './helpers/minifiedDataStructureManager';
import { BatchStorageStateSectionCollection } from './helpers/batchStorageStateSectionCollection';

export type BatchStorageStateSectionNode<T> = T extends ProcessingTopic.XYK
  ? XykpoolGlq
  : T extends ProcessingTopic.OMNIPOOL
    ? OmnipoolGql
    : T extends ProcessingTopic.STABLESWAP
      ? StableswapGql
      : T extends ProcessingTopic.LBP
        ? LbpPoolGlq
        : T extends ProcessingTopic.AAVE
          ? AavepoolGlq
          : T extends ProcessingTopic.EMA_ORACLE
            ? EmaOracleGql
            : T extends ProcessingTopic.ASSET_HIST_DATA
              ? AssetHistoricalDatumGql
              : never;

export class StorageDictionaryManager extends QueriesHelper {
  protected batchCtx: SqdProcessorContext<Store>;

  batchStorageState: Map<
    ProcessingTopic,
    | BatchStorageStateSectionCollection<ProcessingTopic.LBP>
    | BatchStorageStateSectionCollection<ProcessingTopic.XYK>
    | BatchStorageStateSectionCollection<ProcessingTopic.OMNIPOOL>
    | BatchStorageStateSectionCollection<ProcessingTopic.STABLESWAP>
    | BatchStorageStateSectionCollection<ProcessingTopic.AAVE>
    | BatchStorageStateSectionCollection<ProcessingTopic.EMA_ORACLE>
    | BatchStorageStateSectionCollection<ProcessingTopic.ASSET_HIST_DATA>
    // @ts-ignore
  > = new Map([
    [
      ProcessingTopic.LBP,
      new BatchStorageStateSectionCollection<ProcessingTopic.LBP>({
        section: ProcessingTopic.LBP,
      }),
    ],
    [
      ProcessingTopic.XYK,
      new BatchStorageStateSectionCollection<ProcessingTopic.XYK>({
        section: ProcessingTopic.XYK,
      }),
    ],
    [
      ProcessingTopic.OMNIPOOL,
      new BatchStorageStateSectionCollection<ProcessingTopic.OMNIPOOL>({
        section: ProcessingTopic.OMNIPOOL,
      }),
    ],
    [
      ProcessingTopic.STABLESWAP,
      new BatchStorageStateSectionCollection<ProcessingTopic.STABLESWAP>({
        section: ProcessingTopic.STABLESWAP,
      }),
    ],
    [
      ProcessingTopic.AAVE,
      new BatchStorageStateSectionCollection<ProcessingTopic.AAVE>({
        section: ProcessingTopic.AAVE,
      }),
    ],
    [
      ProcessingTopic.EMA_ORACLE,
      new BatchStorageStateSectionCollection<ProcessingTopic.EMA_ORACLE>({
        section: ProcessingTopic.EMA_ORACLE,
      }),
    ],
    [
      ProcessingTopic.ASSET_HIST_DATA,
      new BatchStorageStateSectionCollection<ProcessingTopic.ASSET_HIST_DATA>({
        section: ProcessingTopic.ASSET_HIST_DATA,
      }),
    ],
  ]);
  // batchStorageState: Map<
  //     ProcessingTopic,
  //     Map<
  //       string,
  //       | LbpPoolGlq
  //       | XykpoolGlq
  //       | OmnipoolGql
  //       | StableswapGql
  //       | AavepoolGlq
  //       | EmaOracleGql
  //       | AssetHistoricalDatumGql
  //     >
  //   > = new Map([
  //     [ProcessingTopic.LBP, new Map()],
  //     [ProcessingTopic.XYK, new Map()],
  //     [ProcessingTopic.OMNIPOOL, new Map()],
  //     [ProcessingTopic.STABLESWAP, new Map()],
  //     [ProcessingTopic.AAVE, new Map()],
  //     [ProcessingTopic.EMA_ORACLE, new Map()],
  //     [ProcessingTopic.ASSET_HIST_DATA, new Map()],
  //   ]);

  constructor({ batchCtx }: { batchCtx: SqdProcessorContext<Store> }) {
    super({ appConfig: batchCtx.appConfig });
    this.batchCtx = batchCtx;
  }

  setBatchContext(batchCtx: SqdProcessorContext<Store>) {
    this.batchCtx = batchCtx;
  }

  getBatchStorageStatePart<T extends ProcessingTopic>(
    section: T
  ): BatchStorageStateSectionCollection<T> {
    return this.batchStorageState.get(
      section
    ) as BatchStorageStateSectionCollection<T>;
  }
  //
  // getBatchStorageStatePart<T extends ProcessingTopic>(
  //   section: T
  // ): Map<string, BatchStorageStateSectionNode<T>> {
  //   return (
  //     (this.batchStorageState.get(section) as Map<
  //       string,
  //       BatchStorageStateSectionNode<T>
  //     >) || new Map<string, BatchStorageStateSectionNode<T>>()
  //   );
  // }

  wipeBatchStorageState() {
    // @ts-ignore
    this.batchStorageState = new Map([
      [
        ProcessingTopic.LBP,
        new BatchStorageStateSectionCollection<ProcessingTopic.LBP>({
          section: ProcessingTopic.LBP,
        }),
      ],
      [
        ProcessingTopic.XYK,
        new BatchStorageStateSectionCollection<ProcessingTopic.XYK>({
          section: ProcessingTopic.XYK,
        }),
      ],
      [
        ProcessingTopic.OMNIPOOL,
        new BatchStorageStateSectionCollection<ProcessingTopic.OMNIPOOL>({
          section: ProcessingTopic.OMNIPOOL,
        }),
      ],
      [
        ProcessingTopic.STABLESWAP,
        new BatchStorageStateSectionCollection<ProcessingTopic.STABLESWAP>({
          section: ProcessingTopic.STABLESWAP,
        }),
      ],
      [
        ProcessingTopic.AAVE,
        new BatchStorageStateSectionCollection<ProcessingTopic.AAVE>({
          section: ProcessingTopic.AAVE,
        }),
      ],
      [
        ProcessingTopic.EMA_ORACLE,
        new BatchStorageStateSectionCollection<ProcessingTopic.EMA_ORACLE>({
          section: ProcessingTopic.EMA_ORACLE,
        }),
      ],
      [
        ProcessingTopic.ASSET_HIST_DATA,
        new BatchStorageStateSectionCollection<ProcessingTopic.ASSET_HIST_DATA>(
          {
            section: ProcessingTopic.ASSET_HIST_DATA,
          }
        ),
      ],
    ]);
  }

  async fetchBatchStorageStateAllPallets(args: {
    blockNumberFrom: number;
    blockNumberTo: number;
  }) {
    // const fetchAllAssetHistDataPaginated = async ({
    //   pageSize,
    //   offset,
    // }: PaginationConfig) => {
    //   const filter: InputMaybe<AssetHistoricalDatumFilter> = {
    //     paraBlockHeight: {
    //       greaterThanOrEqualTo: args.blockNumberFrom,
    //     },
    //     and: [
    //       {
    //         paraBlockHeight: {
    //           lessThanOrEqualTo: args.blockNumberTo,
    //         },
    //       },
    //     ],
    //   };
    //
    //   const resp = await this.dictionaryGqlRequest<
    //     GetAssetHistDataBlocksStorageStateQuery,
    //     GetAssetHistDataBlocksStorageStateQueryVariables
    //   >({
    //     query: GetAssetHistDataBlocksStorageState,
    //     variables: {
    //       filter,
    //       orderBy: AssetHistoricalDataOrderBy.ParaBlockHeightAsc,
    //       first: pageSize,
    //       offset,
    //     },
    //     dictName: ProcessingTopic.ASSET_HIST_DATA,
    //   });
    //
    //   // if (resp.error) console.log(resp.error); //TODO make this log configurable
    //
    //   return {
    //     data:
    //       resp.data && resp.data.assetHistoricalData
    //         ? resp.data.assetHistoricalData.nodes
    //         : [],
    //     totalCount:
    //       resp.data && resp.data.assetHistoricalData
    //         ? resp.data.assetHistoricalData.totalCount
    //         : 0,
    //   };
    // };
    //
    // const fetchAllEmaOraclesPaginated = async ({
    //   pageSize,
    //   offset,
    // }: PaginationConfig) => {
    //   const filter: InputMaybe<EmaOracleFilter> = {
    //     paraBlockHeight: {
    //       greaterThanOrEqualTo: args.blockNumberFrom,
    //     },
    //     and: [
    //       {
    //         paraBlockHeight: {
    //           lessThanOrEqualTo: args.blockNumberTo,
    //         },
    //       },
    //     ],
    //   };
    //
    //   const resp = await this.dictionaryGqlRequest<
    //     GetEmaOracleBlocksStorageStateQuery,
    //     GetEmaOracleBlocksStorageStateQueryVariables
    //   >({
    //     query: GetEmaOracleBlocksStorageState,
    //     variables: {
    //       filter,
    //       orderBy: EmaOraclesOrderBy.ParaBlockHeightAsc,
    //       first: pageSize,
    //       offset,
    //     },
    //     dictName: ProcessingTopic.EMA_ORACLE,
    //   });
    //
    //   // if (resp.error) console.log(resp.error); //TODO make this log configurable
    //
    //   return {
    //     data:
    //       resp.data && resp.data.emaOracles ? resp.data.emaOracles.nodes : [],
    //     totalCount:
    //       resp.data && resp.data.emaOracles
    //         ? resp.data.emaOracles.totalCount
    //         : 0,
    //   };
    // };
    //
    // const fetchAllAavepoolsPaginated = async ({
    //   pageSize,
    //   offset,
    // }: PaginationConfig) => {
    //   const filter: InputMaybe<AavepoolFilter> = {
    //     paraBlockHeight: {
    //       greaterThanOrEqualTo: args.blockNumberFrom,
    //     },
    //     and: [
    //       {
    //         paraBlockHeight: {
    //           lessThanOrEqualTo: args.blockNumberTo,
    //         },
    //       },
    //     ],
    //   };
    //
    //   const resp = await this.dictionaryGqlRequest<
    //     GetAavePoolBlocksStorageStateQuery,
    //     GetAavePoolBlocksStorageStateQueryVariables
    //   >({
    //     query: GetAavePoolBlocksStorageState,
    //     variables: {
    //       filter,
    //       orderBy: AavepoolsOrderBy.ParaBlockHeightAsc,
    //       first: pageSize,
    //       offset,
    //     },
    //     dictName: ProcessingTopic.AAVE,
    //   });
    //
    //   // if (resp.error) console.log(resp.error); //TODO make this log configurable
    //
    //   return {
    //     data: resp.data && resp.data.aavepools ? resp.data.aavepools.nodes : [],
    //     totalCount:
    //       resp.data && resp.data.aavepools ? resp.data.aavepools.totalCount : 0,
    //   };
    // };
    //
    // const fetchAllLbpPoolsPaginated = async ({
    //   pageSize,
    //   offset,
    // }: PaginationConfig) => {
    //   const filter: InputMaybe<LbppoolFilter> = {
    //     paraBlockHeight: {
    //       greaterThanOrEqualTo: args.blockNumberFrom,
    //     },
    //     and: [
    //       {
    //         paraBlockHeight: {
    //           lessThanOrEqualTo: args.blockNumberTo,
    //         },
    //       },
    //     ],
    //   };
    //
    //   const resp = await this.dictionaryGqlRequest<
    //     GetLbppoolBlocksStorageStateQuery,
    //     GetLbppoolBlocksStorageStateQueryVariables
    //   >({
    //     query: GetLbppoolBlocksStorageState,
    //     variables: {
    //       filter,
    //       orderBy: LbppoolsOrderBy.ParaBlockHeightAsc,
    //       first: pageSize,
    //       offset,
    //     },
    //     dictName: ProcessingTopic.LBP,
    //   });
    //
    //   // if (resp.error) console.log(resp.error); //TODO make this log configurable
    //
    //   return {
    //     data: resp.data && resp.data.lbppools ? resp.data.lbppools.nodes : [],
    //     totalCount:
    //       resp.data && resp.data.lbppools ? resp.data.lbppools.totalCount : 0,
    //   };
    // };
    //
    // const fetchAllXykPoolsPaginated = async ({
    //   pageSize,
    //   offset,
    // }: PaginationConfig) => {
    //   const filter: InputMaybe<XykpoolFilter> = {
    //     paraBlockHeight: {
    //       greaterThanOrEqualTo: args.blockNumberFrom,
    //     },
    //     and: [
    //       {
    //         paraBlockHeight: {
    //           lessThanOrEqualTo: args.blockNumberTo,
    //         },
    //       },
    //     ],
    //   };
    //
    //   const resp = await this.dictionaryGqlRequest<
    //     GetXykpoolBlocksStorageStateQuery,
    //     GetXykpoolBlocksStorageStateQueryVariables
    //   >({
    //     query: GetXykpoolBlocksStorageState,
    //     variables: {
    //       filter,
    //       orderBy: XykpoolsOrderBy.ParaBlockHeightAsc,
    //       first: pageSize,
    //       offset,
    //     },
    //     dictName: ProcessingTopic.XYK,
    //   });
    //
    //   // if (resp.error) console.log(resp.error); //TODO make this log configurable
    //
    //   return {
    //     data: resp.data && resp.data.xykpools ? resp.data.xykpools.nodes : [],
    //     totalCount:
    //       resp.data && resp.data.xykpools ? resp.data.xykpools.totalCount : 0,
    //   };
    // };
    //
    // const fetchAllOmnipoolsPaginated = async ({
    //   pageSize,
    //   offset,
    // }: PaginationConfig) => {
    //   const filter: InputMaybe<OmnipoolFilter> = {
    //     paraBlockHeight: {
    //       greaterThanOrEqualTo: args.blockNumberFrom,
    //     },
    //     and: [
    //       {
    //         paraBlockHeight: {
    //           lessThanOrEqualTo: args.blockNumberTo,
    //         },
    //       },
    //     ],
    //   };
    //   const resp = await this.dictionaryGqlRequest<
    //     GetOmnipoolBlocksStorageStateQuery,
    //     GetOmnipoolBlocksStorageStateQueryVariables
    //   >({
    //     query: GetOmnipoolBlocksStorageState,
    //     variables: {
    //       filter,
    //       orderBy: OmnipoolsOrderBy.ParaBlockHeightAsc,
    //       first: pageSize,
    //       offset,
    //     },
    //     dictName: ProcessingTopic.OMNIPOOL,
    //   });
    //
    //   // if (resp.error) console.log(resp.error); //TODO make this log configurable
    //
    //   return {
    //     data: resp.data && resp.data.omnipools ? resp.data.omnipools.nodes : [],
    //     totalCount:
    //       resp.data && resp.data.omnipools ? resp.data.omnipools.totalCount : 0,
    //   };
    // };
    //
    // const fetchAllStablepoolAssetsPaginated = async ({
    //   pageSize,
    //   offset,
    // }: PaginationConfig) => {
    //   const filter: InputMaybe<StableswapFilter> = {
    //     paraBlockHeight: {
    //       greaterThanOrEqualTo: args.blockNumberFrom,
    //     },
    //     and: [
    //       {
    //         paraBlockHeight: {
    //           lessThanOrEqualTo: args.blockNumberTo,
    //         },
    //       },
    //     ],
    //   };
    //
    //   const resp = await this.dictionaryGqlRequest<
    //     GetStableswapBlocksStorageStateQuery,
    //     GetStableswapBlocksStorageStateQueryVariables
    //   >({
    //     query: GetStableswapBlocksStorageState,
    //     variables: {
    //       filter,
    //       orderBy: StableswapsOrderBy.ParaBlockHeightAsc,
    //       first: pageSize,
    //       offset,
    //     },
    //     dictName: ProcessingTopic.STABLESWAP,
    //   });
    //
    //   // if (resp.error) console.log(resp.error); //TODO make this log configurable
    //
    //   return {
    //     data:
    //       resp.data && resp.data.stableswaps ? resp.data.stableswaps.nodes : [],
    //     totalCount:
    //       resp.data && resp.data.stableswaps
    //         ? resp.data.stableswaps.totalCount
    //         : 0,
    //   };
    // };

    const fetchBlockCompressedDataPaginated = async ({
      pageSize,
      offset,
      topic,
    }: PaginationConfig) => {
      const filter: InputMaybe<BlockCompressedDatumFilter> = {
        paraBlockHeight: {
          greaterThanOrEqualTo: args.blockNumberFrom,
        },
        and: [
          {
            paraBlockHeight: {
              lessThanOrEqualTo: args.blockNumberTo,
            },
          },
        ],
      };

      const resp = await this.dictionaryGqlRequest<
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

    const allEmaOraclesStorageFetchPromise = async () => {
      // if (!this.batchCtx.appConfig.PROCESS_LBP_POOLS) return [];
      const data: EmaOracleGql[][] = [];
      for await (const page of this.fetchAllPages({
        limit: this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
        requestPromise: fetchBlockCompressedDataPaginated,
        topic: ProcessingTopic.EMA_ORACLE,
      })) {
        if (!page) continue;
        const encodedPageData: EmaOracleGql[] =
          encodeBlockCompressedData<EmaOracleGql>({
            data: page,
            dataKey: BlockCompressedDataKey.emaOracle,
          });

        // data.push(...(encodedPageData as EmaOracleGql[]));
        data.push(encodedPageData);
      }

      return { pallet: ProcessingTopic.EMA_ORACLE, data: data.flat() };
    };

    const allAssetHistDataStorageFetchPromise = async () => {
      // if (!this.batchCtx.appConfig.PROCESS_LBP_POOLS) return [];
      const data: AssetHistoricalDatumGql[][] = [];

      for await (const page of this.fetchAllPages({
        limit: this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
        requestPromise: fetchBlockCompressedDataPaginated,
        topic: ProcessingTopic.ASSET_HIST_DATA,
      })) {
        if (!page) continue;
        const encodedPageData: AssetHistoricalDatumGql[] =
          encodeBlockCompressedData<AssetHistoricalDatumGql>({
            data: page,
            dataKey: BlockCompressedDataKey.assetHistoricalData,
          });

        // data.push(...(encodedPageData as AssetHistoricalDatumGql[]));
        data.push(encodedPageData as AssetHistoricalDatumGql[]);
      }

      return { pallet: ProcessingTopic.ASSET_HIST_DATA, data: data.flat() };
    };

    const allAavepoolsStorageFetchPromise = async () => {
      // if (!this.batchCtx.appConfig.PROCESS_LBP_POOLS) return [];
      const data: AavepoolGlq[][] = [];

      for await (const page of this.fetchAllPages({
        limit: this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
        requestPromise: fetchBlockCompressedDataPaginated,
        topic: ProcessingTopic.AAVE,
      })) {
        if (!page) continue;
        const encodedPageData: AavepoolGlq[] =
          encodeBlockCompressedData<AavepoolGlq>({
            data: page,
            dataKey: BlockCompressedDataKey.aavepool,
          });

        data.push(encodedPageData);
        // data.push(...(encodedPageData as AavepoolGlq[]));
      }

      return { pallet: ProcessingTopic.AAVE, data: data.flat() };
    };

    const allLbpPoolStorageFetchPromise = async () => {
      if (!this.batchCtx.appConfig.PROCESS_LBP_POOLS) return [];
      const data: LbpPoolGlq[][] = [];

      for await (const page of this.fetchAllPages({
        limit: this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
        requestPromise: fetchBlockCompressedDataPaginated,
        topic: ProcessingTopic.LBP,
      })) {
        if (!page) continue;
        const encodedPageData: LbpPoolGlq[] =
          encodeBlockCompressedData<LbpPoolGlq>({
            data: page,
            dataKey: BlockCompressedDataKey.lbppool,
          });

        data.push(encodedPageData);
        // data.push(...(encodedPageData as LbpPoolGlq[]));
      }

      return { pallet: ProcessingTopic.LBP, data: data.flat() };
    };

    const allXykPoolStorageFetchPromise = async () => {
      // if (
      //   !this.batchCtx.appConfig.PROCESS_XYK_POOLS
      //   // this.batchCtx.batchState.state.xykPoolIdsForStoragePrefetch.size === 0
      // )
      //   return [];

      const data: XykpoolGlq[][] = [];

      for await (const page of this.fetchAllPages({
        limit: this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
        requestPromise: fetchBlockCompressedDataPaginated,
        topic: ProcessingTopic.XYK,
      })) {
        if (!page) continue;
        const encodedPageData: XykpoolGlq[] =
          encodeBlockCompressedData<XykpoolGlq>({
            data: page,
            dataKey: BlockCompressedDataKey.xykpool,
          });

        data.push(encodedPageData);
        // data.push(...(encodedPageData as XykpoolGlq[]));
      }

      return { pallet: ProcessingTopic.XYK, data: data.flat() };
    };

    const allOmnipoolStorageFetchPromise = async () => {
      // if (
      //   !this.batchCtx.appConfig.PROCESS_OMNIPOOLS
      //   // this.batchCtx.batchState.state.omnipoolAssetIdsForStoragePrefetch
      //   //   .size === 0
      // )
      //   return [];

      const data = [];

      for await (const page of this.fetchAllPages({
        limit: this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
        requestPromise: fetchBlockCompressedDataPaginated,
        topic: ProcessingTopic.OMNIPOOL,
      })) {
        if (!page) continue;
        const encodedPageData: OmnipoolGql[] =
          encodeBlockCompressedData<OmnipoolGql>({
            data: page,
            dataKey: BlockCompressedDataKey.omnipool,
          });

        data.push(encodedPageData);
      }

      return { pallet: ProcessingTopic.OMNIPOOL, data: data.flat() };
    };

    const allStablepoolStorageFetchPromise = async () => {
      // if (
      //   !this.batchCtx.appConfig.PROCESS_STABLEPOOLS
      //   // this.batchCtx.batchState.state.stableswapIdsForStoragePrefetch.size ===
      //   //   0
      // )
      //   return [];
      const data = [];

      for await (const page of this.fetchAllPages({
        limit: this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
        requestPromise: fetchBlockCompressedDataPaginated,
        topic: ProcessingTopic.STABLESWAP,
      })) {
        if (!page) continue;
        const encodedPageData: StableswapGql[] =
          encodeBlockCompressedData<StableswapGql>({
            data: page,
            dataKey: BlockCompressedDataKey.stableswap,
          });

        data.push(encodedPageData);
        // data.push(...(encodedPageData as StableswapGql[]));
      }

      return { pallet: ProcessingTopic.STABLESWAP, data: data.flat() };
    };

    console.time('Dictionary API call executed in');
    const fullResponse = await Promise.all([
      allLbpPoolStorageFetchPromise(),
      allXykPoolStorageFetchPromise(),
      allOmnipoolStorageFetchPromise(),
      allStablepoolStorageFetchPromise(),
      allAavepoolsStorageFetchPromise(),
      allEmaOraclesStorageFetchPromise(),
      allAssetHistDataStorageFetchPromise(),
    ]);

    console.log(
      `Size of the batchStorageState object: ${sizeof(fullResponse)} bytes`
    );

    console.timeEnd('Dictionary API call executed in');

    this.decorateDictionaryData(
      fullResponse as Array<PalletDictionaryCollectedData>
    );
  }

  decorateDictionaryData(rawData: Array<PalletDictionaryCollectedData>) {
    for (const palletData of rawData) {
      switch (palletData.pallet) {
        case ProcessingTopic.ASSET_HIST_DATA:
          this.batchStorageState.set(
            ProcessingTopic.ASSET_HIST_DATA,
            new BatchStorageStateSectionCollection<ProcessingTopic.ASSET_HIST_DATA>(
              {
                section: ProcessingTopic.ASSET_HIST_DATA,
                data: palletData.data as AssetHistoricalDatumGql[],
              }
            ) as any
            // new Map(
            //   (palletData.data as AssetHistoricalDatumGql[]).map((item) => [
            //     item.id,
            //     item,
            //   ])er
            // )
          );
          break;
        case ProcessingTopic.EMA_ORACLE:
          this.batchStorageState.set(
            ProcessingTopic.EMA_ORACLE,
            new BatchStorageStateSectionCollection<ProcessingTopic.EMA_ORACLE>({
              section: ProcessingTopic.EMA_ORACLE,
              data: palletData.data as EmaOracleGql[],
            }) as any
            // new Map(
            //   (palletData.data as EmaOracleGql[]).map((item) => [item.id, item])
            // )
          );
          break;
        case ProcessingTopic.AAVE:
          this.batchStorageState.set(
            ProcessingTopic.AAVE,
            new BatchStorageStateSectionCollection<ProcessingTopic.AAVE>({
              section: ProcessingTopic.AAVE,
              data: palletData.data as AavepoolGlq[],
            }) as any

            // new Map(
            //   (palletData.data as AavepoolGlq[]).map((item) => [item.id, item])
            // )
          );
          break;
        case ProcessingTopic.LBP:
          this.batchStorageState.set(
            ProcessingTopic.LBP,
            // new Map(
            //   (palletData.data as LbpPoolGlq[]).map((item) => [item.id, item])
            // )
            new BatchStorageStateSectionCollection<ProcessingTopic.LBP>({
              section: ProcessingTopic.LBP,
              data: palletData.data as LbpPoolGlq[],
            }) as any
          );
          break;
        case ProcessingTopic.XYK:
          this.batchStorageState.set(
            ProcessingTopic.XYK,
            new BatchStorageStateSectionCollection<ProcessingTopic.XYK>({
              section: ProcessingTopic.XYK,
              data: palletData.data as XykpoolGlq[],
            }) as any
            // new Map(
            //   (palletData.data as XykpoolGlq[]).map((item) => [item.id, item])
            // )
          );
          break;
        case ProcessingTopic.OMNIPOOL:
          this.batchStorageState.set(
            ProcessingTopic.OMNIPOOL,
            new BatchStorageStateSectionCollection<ProcessingTopic.OMNIPOOL>({
              section: ProcessingTopic.OMNIPOOL,
              data: palletData.data as OmnipoolGql[],
            }) as any
            // new Map(
            //   (palletData.data as OmnipoolGql[]).map((item) => [item.id, item])
            // )
          );
          break;
        case ProcessingTopic.STABLESWAP:
          this.batchStorageState.set(
            ProcessingTopic.STABLESWAP,
            new BatchStorageStateSectionCollection<ProcessingTopic.STABLESWAP>({
              section: ProcessingTopic.STABLESWAP,
              data: palletData.data as StableswapGql[],
            }) as any
            // new Map(
            //   (palletData.data as StableswapGql[]).map((item) => [
            //     item.id,
            //     item,
            //   ])
            // )
          );
          break;
        default:
      }
    }
  }

  getStableswapPoolData({
    poolId,
    block,
  }: StablepoolGetPoolDataInput): StablepoolInfo | null {
    const node = this.getBatchStorageStatePart(
      ProcessingTopic.STABLESWAP
    ).getEntityById(`${poolId}-${block.height}`);

    if (!node) return null;

    if (
      !node.stableswapAssetDataByPoolId.nodes ||
      node.stableswapAssetDataByPoolId.nodes.length === 0
    )
      return null;

    return {
      assets: node.stableswapAssetDataByPoolId.nodes.map(
        (asset) => asset!.assetId
      ),
      initialAmplification: node.initialAmplification,
      finalAmplification: node.finalAmplification,
      initialBlock: node.initialBlock,
      finalBlock: node.finalBlock,
      fee: node.fee,
    };
  }
  getStableswapAllPoolsData({
    block,
  }: GetDataAtBlockInput): StablepoolAllPoolsInfoWithPoolId[] | null {
    // const nodes = [
    //   ...this.getBatchStorageStatePart(ProcessingTopic.STABLESWAP).entries(),
    // ].filter(
    //   ([key, data]) =>
    //     key.split('-')[1] === block.height.toString() &&
    //     data.stableswapAssetDataByPoolId.nodes &&
    //     data.stableswapAssetDataByPoolId.nodes.length > 0
    // );

    // const nodes =
    //   getStorageDictionaryItemsListByBlockNumber<ProcessingTopic.STABLESWAP>({
    //     blockNumber: block.height,
    //     fullData: this.getBatchStorageStatePart(ProcessingTopic.STABLESWAP),
    //     additionalFilter: ([key, data]) =>
    //       !!data.stableswapAssetDataByPoolId.nodes &&
    //       data.stableswapAssetDataByPoolId.nodes.length > 0,
    //   });

    const nodes = this.getBatchStorageStatePart(
      ProcessingTopic.STABLESWAP
    ).getEntitiesByBlockNumber(block.height);

    if (!nodes || nodes.size === 0) return null;

    return Array.from(nodes.values()).map((node) => ({
      poolId: node.poolId,
      data: {
        assets: node.stableswapAssetDataByPoolId.nodes.map(
          (asset) => asset!.assetId
        ),
        initialAmplification: node.initialAmplification,
        finalAmplification: node.finalAmplification,
        initialBlock: node.initialBlock,
        finalBlock: node.finalBlock,
        fee: node.fee,
      },
    }));
  }

  getStableswapPegsData({
    poolId,
    block,
  }: StablepoolGetPoolPegsInput): StablepoolPoolPegsInfo | null {
    const node = this.getBatchStorageStatePart(
      ProcessingTopic.STABLESWAP
    ).getEntityById(`${poolId}-${block.height}`);

    if (!node || node.maxPegUpdate === undefined) return null;

    return {
      source: node.pegSources
        ? node.pegSources.map(
            (src: any): StableswapPegSource => ({
              sourceKind: src.sourceKind,
              oracleName: src.oracleName,
              oraclePeriod: src.oraclePeriod,
              oracleAsset: src.oracleAsset,
              valuePoints: src.valuePoints
                ? src.valuePoints.map((p: any) => BigInt(p))
                : undefined,
            })
          )
        : undefined,
      maxPegUpdate: node.maxPegUpdate ?? undefined,
      current: node.pegs.map(([pegA, pegB]: string[]) => [
        BigInt(pegA),
        BigInt(pegB),
      ]),
    };
  }

  getStableswapAllPoolsPegsData({
    block,
  }: GetDataAtBlockInput): StablepoolManyPoolsPegsInfoWithPoolId[] | null {
    // const nodes = [
    //   ...this.getBatchStorageStatePart(ProcessingTopic.STABLESWAP).entries(),
    // ].filter(
    //   ([key, data]) =>
    //     key.split('-')[1] === block.height.toString() &&
    //     data.maxPegUpdate !== undefined
    // );

    // const nodes =
    //   getStorageDictionaryItemsListByBlockNumber<ProcessingTopic.STABLESWAP>({
    //     blockNumber: block.height,
    //     fullData: this.getBatchStorageStatePart(ProcessingTopic.STABLESWAP),
    //     additionalFilter: ([key, data]) => data.maxPegUpdate !== undefined,
    //   });

    const nodes = this.getBatchStorageStatePart(
      ProcessingTopic.STABLESWAP
    ).getEntitiesByBlockNumber(block.height);

    if (!nodes || nodes.size === 0) return null;

    return Array.from(nodes.values())
      .filter((node) => node && node.maxPegUpdate !== undefined)
      .map((data) => ({
        poolId: data.poolId,
        data: {
          source: data.pegSources
            ? data.pegSources.map(
                (src: any): StableswapPegSource => ({
                  sourceKind: src.sourceKind,
                  oracleName: src.oracleName,
                  oraclePeriod: src.oraclePeriod,
                  oracleAsset: src.oracleAsset,
                  valuePoints: src.valuePoints
                    ? src.valuePoints.map((p: any) => BigInt(p))
                    : undefined,
                })
              )
            : undefined,
          maxPegUpdate: data.maxPegUpdate ?? undefined,
          current: data.pegs.map(([pegA, pegB]: string[]) => [
            BigInt(pegA),
            BigInt(pegB),
          ]),
        },
      }));
  }

  getStableswapPoolAssetInfo({
    poolId,
    assetId,
    block,
  }: GetPoolAssetInfoInput): AccountData | null {
    // const node = this.getBatchStorageStatePart(
    //   ProcessingTopic.STABLESWAP
    // ).getEntityById(`${poolId}-${block.height}`);
    //
    // if (!node) return null;
    //
    // if (
    //   !node.stableswapAssetDataByPoolId.nodes ||
    //   node.stableswapAssetDataByPoolId.nodes.length === 0
    // )
    //   return null;
    //
    // const assetInfo = node.stableswapAssetDataByPoolId.nodes.find(
    //   (asset) => asset?.assetId.toString() === assetId.toString()
    // );
    const assetInfo = this.getBatchStorageStatePart(ProcessingTopic.STABLESWAP)
      .getAssetsByParentId(`${poolId}-${block.height}`)
      ?.get(assetId);

    if (!assetInfo || !assetInfo.balances) return null;
    // const balances = assetInfo.balances as AccountBalancesGql;
    const balances =
      MinifiedDataStructureManager.encodeStruct<MinifiedDataStructureTypeName.AccountBalances>(
        assetInfo.balances
      );
    return {
      free: BigInt(balances.free ?? 0),
      reserved: BigInt(balances.reserved ?? 0),
      frozen: BigInt(balances.frozen ?? 0),
      miscFrozen: BigInt(balances.miscFrozen ?? 0),
      feeFrozen: BigInt(balances.feeFrozen ?? 0),
      flags: BigInt(balances.flags ?? 0),
    };
  }

  getStableswapPoolAssetState({
    poolId,
    assetId,
    block,
  }: GetPoolAssetInfoInput): StablepoolAssetState | null {
    // const node = this.getBatchStorageStatePart(ProcessingTopic.STABLESWAP).get(
    //   `${poolId}-${block.height}`
    // );
    //
    // if (!node) return null;
    //
    // if (
    //   !node.stableswapAssetDataByPoolId.nodes ||
    //   node.stableswapAssetDataByPoolId.nodes.length === 0
    // )
    //   return null;
    //
    // const assetState = node.stableswapAssetDataByPoolId.nodes.find(
    //   (asset) => asset?.assetId === assetId
    // );
    // if (!assetState) return null;

    const assetState = this.getBatchStorageStatePart(ProcessingTopic.STABLESWAP)
      .getAssetsByParentId(`${poolId}-${block.height}`)
      ?.get(assetId);

    if (!assetState || !assetState.balances) return null;

    return {
      tradable: { bits: assetState.tradable.bits ?? 0 },
    };
  }

  // TODO remove as redundant
  getOmnipoolData({
    poolAddress,
    block,
  }: LbpGetPoolDataInput): OmnipoolData | null {
    const node = null;

    if (!node) return null;

    const { hubAssetTradability } = node;

    return {
      poolAddress,
    } as OmnipoolData;
  }

  getOmnipoolHubAssetTradability({
    block,
  }: OmnipoolGetHubAssetTradabilityInput): OmnipoolAssetTradability | null {
    const node = this.getBatchStorageStatePart(
      ProcessingTopic.OMNIPOOL
    ).getEntityById(
      `${this.batchCtx.appConfig.OMNIPOOL_ADDRESS}-${block.height}`
    );

    if (!node) return null;

    const { hubAssetTradability } = node;

    return {
      bits: hubAssetTradability.bits,
    };
  }

  getOmnipoolAllAssetIds({
    block,
  }: OmnipoolGetHubAssetTradabilityInput): number[] | null {
    // const node = this.getBatchStorageStatePart(ProcessingTopic.OMNIPOOL).get(
    //   `${this.batchCtx.appConfig.OMNIPOOL_ADDRESS}-${block.height}`
    // );
    //
    // if (!node) return null;

    // const assetIds = node.omnipoolAssetDataByPoolId.nodes
    //   .map((omnipoolAsset) =>
    //     omnipoolAsset?.assetId !== undefined && omnipoolAsset?.assetId !== null
    //       ? +omnipoolAsset.assetId
    //       : null
    //   )
    //   .filter((id) => id !== undefined && id !== null);

    const assetNodes = this.getBatchStorageStatePart(
      ProcessingTopic.OMNIPOOL
    ).getAssetsByParentId(
      `${this.batchCtx.appConfig.OMNIPOOL_ADDRESS}-${block.height}`
    );

    if (!assetNodes || assetNodes.size === 0) return null;

    const assetIds = Array.from(assetNodes.values()).map(
      (asset) => asset.assetId
    );

    return assetIds;
  }

  getOmnipoolAssetInfo({
    poolAddress,
    assetId,
    block,
  }: GetPoolAssetInfoInput): AccountData | null {
    // const node = this.getBatchStorageStatePart(ProcessingTopic.OMNIPOOL).get(
    //   `${poolAddress}-${block.height}`
    // );
    //
    // if (!node) return null;
    // const asset = node.omnipoolAssetDataByPoolId.nodes.find(
    //   (asset) => asset && asset.assetId.toString() === assetId.toString()
    // );
    const asset = this.getBatchStorageStatePart(ProcessingTopic.OMNIPOOL)
      .getAssetsByParentId(
        `${this.batchCtx.appConfig.OMNIPOOL_ADDRESS}-${block.height}`
      )
      ?.get(assetId);

    if (!asset) return null;

    // const { balances } = asset;
    const balances =
      MinifiedDataStructureManager.encodeStruct<MinifiedDataStructureTypeName.AccountBalances>(
        asset.balances
      );

    return {
      free: BigInt(balances.free ?? 0),
      reserved: BigInt(balances.reserved ?? 0),
      frozen: BigInt(balances.frozen ?? 0),
      miscFrozen: BigInt(balances.miscFrozen ?? 0),
      feeFrozen: BigInt(balances.feeFrozen ?? 0),
      flags: BigInt(balances.flags ?? 0),
    };
  }

  getOmnipoolAssetState({
    assetId,
    block,
  }: OmnipoolGetAssetDataInput): OmnipoolAssetData | null {
    // const node = this.getBatchStorageStatePart(ProcessingTopic.OMNIPOOL).get(
    //   `${this.batchCtx.appConfig.OMNIPOOL_ADDRESS}-${block.height}`
    // );
    //
    // if (!node) return null;
    // const asset = node.omnipoolAssetDataByPoolId.nodes.find(
    //   (asset) => asset && asset.assetId.toString() === assetId.toString()
    // );
    // if (!asset) return null;

    const asset = this.getBatchStorageStatePart(ProcessingTopic.OMNIPOOL)
      .getAssetsByParentId(
        `${this.batchCtx.appConfig.OMNIPOOL_ADDRESS}-${block.height}`
      )
      ?.get(assetId);

    if (!asset) return null;

    // const { assetState } = asset;
    const assetState =
      MinifiedDataStructureManager.encodeStruct<MinifiedDataStructureTypeName.OmnipoolAssetState>(
        asset.assetState
      );

    return {
      hubReserve: BigInt(assetState.hubReserve ?? 0),
      shares: BigInt(assetState.shares ?? 0),
      protocolShares: BigInt(assetState.protocolShares ?? 0),
      cap: BigInt(assetState.cap ?? 0),
      tradable: { bits: assetState.tradable?.bits ?? 0 },
    };
  }

  getXykpoolData({
    poolAddress,
    block,
  }: LbpGetPoolDataInput): XykPoolData | null {
    const node = this.getBatchStorageStatePart(
      ProcessingTopic.XYK
    ).getEntityById(`${poolAddress}-${block.height}`);

    if (!node) return null;

    const { assetAId, assetBId } = node;

    return {
      poolAddress,
      assetAId,
      assetBId,
    };
  }

  getXykpoolShareTokenId({
    poolAddress,
    block,
  }: XykGetShareTokenInput): number | null {
    const node = this.getBatchStorageStatePart(
      ProcessingTopic.XYK
    ).getEntityById(`${poolAddress}-${block.height}`);

    if (!node) return null;

    const { shareTokenId } = node;

    if (shareTokenId === undefined || shareTokenId === null) return null;

    return +shareTokenId;
  }

  getXykpoolShareTokenPairsAll({
    block,
  }: XykGetPoolShareTokenPairsManyInput): XykPoolShareTokenPair[] | null {
    // const nodes = [
    //   ...this.getBatchStorageStatePart(ProcessingTopic.XYK).entries(),
    // ].filter(([key, data]) => key.split('-')[1] === block.height.toString());

    // const nodes =
    //   getStorageDictionaryItemsListByBlockNumber<ProcessingTopic.XYK>({
    //     blockNumber: block.height,
    //     fullData: this.getBatchStorageStatePart(ProcessingTopic.XYK),
    //   });
    const nodes = this.getBatchStorageStatePart(
      ProcessingTopic.XYK
    ).getEntitiesByBlockNumber(block.height);

    if (!nodes || nodes.size === 0) return null;

    return Array.from(nodes.values()).map((data) => ({
      poolId: data.poolAddress,
      shareTokenId: +data.shareTokenId!, //TODO fix type casting
    }));
  }

  getXykPoolAssets({
    poolAddress,
    block,
  }: XykGetAssetsInput): XykPoolAssetIds | null {
    const node = this.getBatchStorageStatePart(
      ProcessingTopic.XYK
    ).getEntityById(`${poolAddress}-${block.height}`);

    if (!node) return null;

    const { assetAId, assetBId } = node;

    return {
      poolAddress,
      assetAId,
      assetBId,
    };
  }

  getXykPoolAssetInfo({
    poolAddress,
    assetId,
    block,
  }: GetPoolAssetInfoInput): AccountData | null {
    // const node = this.getBatchStorageStatePart(ProcessingTopic.XYK).get(
    //   `${poolAddress}-${block.height}`
    // );
    //
    // if (!node) return null;
    // const asset = node.xykpoolAssetsDataByPoolId.nodes.find(
    //   (asset) => asset && asset.assetId.toString() === assetId.toString()
    // );
    // if (!asset) return null;

    const asset = this.getBatchStorageStatePart(ProcessingTopic.XYK)
      .getAssetsByParentId(`${poolAddress}-${block.height}`)
      ?.get(assetId);

    if (!asset) return null;

    // const { balances } = asset;

    const balances =
      MinifiedDataStructureManager.encodeStruct<MinifiedDataStructureTypeName.AccountBalances>(
        asset.balances
      );

    return {
      free: BigInt(balances.free ?? 0),
      reserved: BigInt(balances.reserved ?? 0),
      frozen: BigInt(balances.frozen ?? 0),
      miscFrozen: BigInt(balances.miscFrozen ?? 0),
      feeFrozen: BigInt(balances.feeFrozen ?? 0),
      flags: BigInt(balances.flags ?? 0),
    };
  }

  getLbpPoolData({
    poolAddress,
    block,
  }: LbpGetPoolDataInput): LbpPoolData | null {
    const node = this.getBatchStorageStatePart(
      ProcessingTopic.LBP
    ).getEntityById(`${poolAddress}-${block.height}`);

    if (!node) return null;

    const {
      owner,
      start,
      end,
      assetAId,
      assetBId,
      initialWeight,
      finalWeight,
      weightCurve,
      fee,
      feeCollector,
      repayTarget,
    } = node;

    return {
      poolAddress,
      owner,
      start: start ?? undefined,
      end: end ?? undefined,
      assetAId,
      assetBId,
      initialWeight,
      finalWeight,
      weightCurve: { __kind: weightCurve },
      fee: [fee[0]!, fee[1]!],
      feeCollector: feeCollector!,
      repayTarget: BigInt(repayTarget ?? 0),
    };
  }

  getLbpPoolAssetInfo({
    poolAddress,
    assetId,
    block,
  }: GetPoolAssetInfoInput): AccountData | null {
    // const node = this.getBatchStorageStatePart(ProcessingTopic.LBP).get(
    //   `${poolAddress}-${block.height}`
    // );
    //
    // if (!node) return null;
    // const asset = node.lbppoolAssetsDataByPoolId.nodes.find(
    //   (asset) => asset && asset.assetId.toString() === assetId.toString()
    // );
    // if (!asset) return null;

    const asset = this.getBatchStorageStatePart(ProcessingTopic.LBP)
      .getAssetsByParentId(`${poolAddress}-${block.height}`)
      ?.get(assetId);

    if (!asset) return null;

    // const { balances } = asset;
    const balances =
      MinifiedDataStructureManager.encodeStruct<MinifiedDataStructureTypeName.AccountBalances>(
        asset.balances
      );

    return {
      free: BigInt(balances.free ?? 0),
      reserved: BigInt(balances.reserved ?? 0),
      frozen: BigInt(balances.frozen ?? 0),
      miscFrozen: BigInt(balances.miscFrozen ?? 0),
      feeFrozen: BigInt(balances.feeFrozen ?? 0),
      flags: BigInt(balances.flags ?? 0),
    };
  }

  getAavepoolsAll({
    block,
  }: AaveTradeExecutorPoolsInput):
    | AaveTradeExecutorPoolDataWithPoolId[]
    | null {
    // const nodes = [
    //   ...this.getBatchStorageStatePart(ProcessingTopic.AAVE).entries(),
    // ].filter(([key, data]) => key.split('-')[1] === block.height.toString());

    // const nodes =
    //   getStorageDictionaryItemsListByBlockNumber<ProcessingTopic.AAVE>({
    //     blockNumber: block.height,
    //     fullData: this.getBatchStorageStatePart(ProcessingTopic.AAVE),
    //   });
    //
    // if (nodes.length === 0) return null;

    const nodes = this.getBatchStorageStatePart(
      ProcessingTopic.AAVE
    ).getEntitiesByBlockNumber(block.height);

    if (!nodes || nodes.size === 0) return null;

    return Array.from(nodes)
      .filter(
        ([key, data]) =>
          data.reserveAssetId !== undefined &&
          data.reserveAssetId !== null &&
          data.aTokenId !== undefined &&
          data.aTokenId !== null
      )
      .map(([key, data]) => ({
        poolId: key,
        data: {
          reserve: +data.reserveAssetId!,
          aToken: +data.aTokenId!,
          liquidityIn: BigInt(data.liquidityIn),
          liquidityOut: BigInt(data.liquidityOut),
        },
      }));
  }

  getAssetDynamicFeesAll({
    block,
  }: GetAssetsDynamicFeesAllInput): AssetDynamicFeeData[] | null {
    // const nodes = [
    //   ...this.getBatchStorageStatePart(
    //     ProcessingTopic.ASSET_HIST_DATA
    //   ).entries(),
    // ].filter(([key, data]) => key.split('-')[1] === block.height.toString());
    //
    // const nodes =
    //   getStorageDictionaryItemsListByBlockNumber<ProcessingTopic.ASSET_HIST_DATA>(
    //     {
    //       blockNumber: block.height,
    //       fullData: this.getBatchStorageStatePart(
    //         ProcessingTopic.ASSET_HIST_DATA
    //       ),
    //       additionalFilter: ([key, data]) =>
    //         data.assetId !== undefined && data.assetId !== null,
    //     }
    //   );
    //
    // if (nodes.length === 0) return null;

    const nodes = this.getBatchStorageStatePart(
      ProcessingTopic.ASSET_HIST_DATA
    ).getEntitiesByBlockNumber(block.height);

    if (!nodes || nodes.size === 0) return null;

    return Array.from(nodes)
      .filter(
        ([key, data]) => data.assetId !== undefined && data.assetId !== null
      )
      .map(([key, data]) => {
        if (!data.dynamicFee) return null;

        const dynamicFeeEncoded =
          MinifiedDataStructureManager.encodeStruct<MinifiedDataStructureTypeName.AssetDynamicFee>(
            data.dynamicFee
          );

        return {
          assetId: +data.assetId!,
          assetFee: dynamicFeeEncoded.assetFee,
          protocolFee: dynamicFeeEncoded.protocolFee,
          timestamp: dynamicFeeEncoded.timestamp,
        };
      })
      .filter((item) => item !== null) as AssetDynamicFeeData[];
  }

  getTokenTotalIssuance({
    tokenId,
    block,
  }: TokensGetTokenTotalIssuanceInput): bigint | null {
    const node = this.getBatchStorageStatePart(
      ProcessingTopic.ASSET_HIST_DATA
    ).getEntityById(`${tokenId}-${block.height}`);

    if (
      !node ||
      node.totalIssuance === undefined ||
      node.totalIssuance === null
    )
      return null;

    return BigInt(node.totalIssuance);
  }

  getNativeTokenTotalIssuance({ block }: GetConstantsInput): bigint | null {
    const node = this.getBatchStorageStatePart(
      ProcessingTopic.ASSET_HIST_DATA
    ).getEntityById(`0-${block.height}`);

    if (
      !node ||
      node.totalIssuance === undefined ||
      node.totalIssuance === null
    )
      return null;

    return BigInt(node.totalIssuance);
  }

  getManyTokensTotalIssuance({
    tokenIds,
    block,
  }: TokensGetTokensTotalIssuanceInput): TokenTotalIssuance[] | null {
    const idsSet = new Set(tokenIds.map((id) => `${id}`));

    // const nodes = [
    //   ...this.getBatchStorageStatePart(
    //     ProcessingTopic.ASSET_HIST_DATA
    //   ).entries(),
    // ].filter(
    //   ([key, data]) =>
    //     key.split('-')[1] === block.height.toString() &&
    //     idsSet.has(key.split('-')[0])
    // );

    // const nodes =
    //   getStorageDictionaryItemsListByBlockNumber<ProcessingTopic.ASSET_HIST_DATA>(
    //     {
    //       blockNumber: block.height,
    //       fullData: this.getBatchStorageStatePart(
    //         ProcessingTopic.ASSET_HIST_DATA
    //       ),
    //       additionalFilter: ([key, data]) => idsSet.has(key.split('-')[0]),
    //     }
    //   );
    //
    // if (nodes.length === 0) return null;

    const nodes = this.getBatchStorageStatePart(
      ProcessingTopic.ASSET_HIST_DATA
    ).getEntitiesByBlockNumber(block.height);

    if (!nodes || nodes.size === 0) return null;

    return Array.from(nodes.values())
      .filter(
        (node) => node.assetId !== undefined && idsSet.has(`${node.assetId}`)
      )
      .map((data) => ({
        tokenId: `${data.assetId}`,
        amount: BigInt(data.totalIssuance),
      }));
  }

  getAssetsExistentialDepositAll({
    block,
  }: GetDataAtBlockInput): AssetExistentialDeposit[] | null {
    // const nodes = [
    //   ...this.getBatchStorageStatePart(
    //     ProcessingTopic.ASSET_HIST_DATA
    //   ).entries(),
    // ].filter(([key, data]) => key.split('-')[1] === block.height.toString());

    // const nodes =
    //   getStorageDictionaryItemsListByBlockNumber<ProcessingTopic.ASSET_HIST_DATA>(
    //     {
    //       blockNumber: block.height,
    //       fullData: this.getBatchStorageStatePart(
    //         ProcessingTopic.ASSET_HIST_DATA
    //       ),
    //     }
    //   );
    //
    // if (nodes.length === 0) return null;

    const nodes = this.getBatchStorageStatePart(
      ProcessingTopic.ASSET_HIST_DATA
    ).getEntitiesByBlockNumber(block.height);

    if (!nodes || nodes.size === 0) return null;

    return Array.from(nodes.values()).map((data) => ({
      assetId: `${data.assetId!}`,
      existentialDeposit: BigInt(data.existentialDeposit),
    }));
  }

  getEmaOracleEntriesAll({
    block,
  }: GetEmaOraclesInput): EmaOracleEntryData[] | null {
    // const nodes = [
    //   ...this.getBatchStorageStatePart(ProcessingTopic.EMA_ORACLE).entries(),
    // ].filter(([key, data]) => key === block.height.toString());
    //
    // if (nodes.length === 0) return null;

    const nodes = this.getBatchStorageStatePart(
      ProcessingTopic.EMA_ORACLE
    ).getEntitiesByBlockNumber(block.height);

    if (!nodes || nodes.size === 0) return null;

    const entries: EmaOracleEntryData[] = [];

    for (const [key, oracleData] of nodes) {
      for (const entry of oracleData.entries) {
        entries.push({
          source: entry.source,
          assetIds: entry.assetIds.map((id: any) => +id),
          period: entry.period as EmaOraclePeriod,
          price: {
            numerator: BigInt(entry.price.n),
            denominator: BigInt(entry.price.d),
          },
          volume: {
            aIn: BigInt(entry.volume.aIn),
            aOut: BigInt(entry.volume.aOut),
            bIn: BigInt(entry.volume.bIn),
            bOut: BigInt(entry.volume.bOut),
          },
          liquidity: {
            a: BigInt(entry.liquidity.a),
            b: BigInt(entry.liquidity.b),
          },
          updatedAt: +entry.updatedAt,
        } as EmaOracleEntryData);
      }
    }

    return entries;
  }
}
