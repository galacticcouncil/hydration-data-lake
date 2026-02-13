import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Aavepool as AavepoolGlq,
  AccountBalances as AccountBalancesGql,
  AssetHistoricalDatum as AssetHistoricalDatumGql,
  AccountAssetBalanceHistoricalDatum as AccountAssetBalanceHistoricalDatumGql,
  AccountMmPositionHistoricalDatum as AccountMmPositionHistoricalDatumGql,
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
  MmAggregatorOracle as MmAggregatorOracleGlq,
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
  BalancesAccountInfoWithAccountId,
  EmaOracleEntryData,
  GetAccountMmPositionDataInput,
  GetAssetsDynamicFeesAllInput,
  GetConstantsInput,
  GetDataAtBlockInput,
  GetEmaOraclesInput,
  GetNativeTokenBalanceManyInput,
  GetPoolAssetInfoInput,
  GetTokenBalancesManyInput,
  LbpGetPoolDataInput,
  LbpPoolData,
  MmAggregatorDictionaryData,
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
  TokenAccountBalancesWithAccountId,
  TokenAccountBalanceWithAssetId,
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
import { AccountMmPositionDataContractData } from '../../../utils/evmTools/types';
import { AppConfig } from '../../../appConfig';

const appConfig = AppConfig.getInstance();

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
              : T extends ProcessingTopic.MM_AGGREGATOR_ORACLE
                ? MmAggregatorOracleGlq
                : T extends ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA
                  ? AccountAssetBalanceHistoricalDatumGql
                  : T extends ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA
                    ? AccountMmPositionHistoricalDatumGql
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
    | BatchStorageStateSectionCollection<ProcessingTopic.MM_AGGREGATOR_ORACLE>
    | BatchStorageStateSectionCollection<ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA>
    | BatchStorageStateSectionCollection<ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA>
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
    [
      ProcessingTopic.MM_AGGREGATOR_ORACLE,
      new BatchStorageStateSectionCollection<ProcessingTopic.MM_AGGREGATOR_ORACLE>(
        {
          section: ProcessingTopic.MM_AGGREGATOR_ORACLE,
        }
      ),
    ],
    [
      ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA,
      new BatchStorageStateSectionCollection<ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA>(
        {
          section: ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA,
        }
      ),
    ],
    [
      ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA,
      new BatchStorageStateSectionCollection<ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA>(
        {
          section: ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA,
        }
      ),
    ],
  ]);

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
      [
        ProcessingTopic.MM_AGGREGATOR_ORACLE,
        new BatchStorageStateSectionCollection<ProcessingTopic.MM_AGGREGATOR_ORACLE>(
          {
            section: ProcessingTopic.MM_AGGREGATOR_ORACLE,
          }
        ),
      ],
      [
        ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA,
        new BatchStorageStateSectionCollection<ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA>(
          {
            section: ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA,
          }
        ),
      ],
      [
        ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA,
        new BatchStorageStateSectionCollection<ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA>(
          {
            section: ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA,
          }
        ),
      ],
    ]);
  }

  async fetchBatchStorageStateAllPallets(args: {
    blockNumberFrom: number;
    blockNumberTo: number;
  }) {
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

    const allGenericStorageFetchPromise = async () => {
      const encodedDataAavepool: AavepoolGlq[][] = [];
      const encodedDataAssetHistoricalDatum: AssetHistoricalDatumGql[][] = [];
      const encodedDataEmaOracleGql: EmaOracleGql[][] = [];
      
      if (
        appConfig.STORAGE_DICTIONARY_TOPICS_TO_FETCH.has(
          ProcessingTopic.GENERIC_HIST_DATA
        )
      ) {
        for await (const page of this.fetchAllPages({
          limit:
            this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
          requestPromise: fetchBlockCompressedDataPaginated,
          topic: ProcessingTopic.GENERIC_HIST_DATA,
        })) {
          if (!page) continue;
          const aavepoolGqlRespEncoded: AavepoolGlq[] =
            encodeBlockCompressedData<AavepoolGlq>({
              data: page,
              dataKey: BlockCompressedDataKey.aavepool,
            });

          const assetHistoricalDatumGqlRespEncoded: AssetHistoricalDatumGql[] =
            encodeBlockCompressedData<AssetHistoricalDatumGql>({
              data: page,
              dataKey: BlockCompressedDataKey.assetHistoricalData,
            });

          const emaOracleGqlRespEncoded: EmaOracleGql[] =
            encodeBlockCompressedData<EmaOracleGql>({
              data: page,
              dataKey: BlockCompressedDataKey.emaOracle,
            });

          encodedDataAavepool.push(aavepoolGqlRespEncoded);
          encodedDataAssetHistoricalDatum.push(
            assetHistoricalDatumGqlRespEncoded as AssetHistoricalDatumGql[]
          );
          encodedDataEmaOracleGql.push(emaOracleGqlRespEncoded);
        }
      }

      return [
        { pallet: ProcessingTopic.AAVE, data: encodedDataAavepool.flat() },
        {
          pallet: ProcessingTopic.ASSET_HIST_DATA,
          data: encodedDataAssetHistoricalDatum.flat(),
        },
        {
          pallet: ProcessingTopic.EMA_ORACLE,
          data: encodedDataEmaOracleGql.flat(),
        },
      ];
    };

    const allLbpPoolStorageFetchPromise = async () => {
      const data: LbpPoolGlq[][] = [];

      if (
        appConfig.STORAGE_DICTIONARY_TOPICS_TO_FETCH.has(ProcessingTopic.LBP)
      ) {
        for await (const page of this.fetchAllPages({
          limit:
            this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
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
      }
      return [{ pallet: ProcessingTopic.LBP, data: data.flat() }];
    };

    const allXykPoolStorageFetchPromise = async () => {
      const data: XykpoolGlq[][] = [];

      if (
        appConfig.STORAGE_DICTIONARY_TOPICS_TO_FETCH.has(ProcessingTopic.XYK)
      ) {
        for await (const page of this.fetchAllPages({
          limit:
            this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
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
      }
      return [{ pallet: ProcessingTopic.XYK, data: data.flat() }];
    };

    const allOmnipoolStorageFetchPromise = async () => {
      const data = [];

      if (
        appConfig.STORAGE_DICTIONARY_TOPICS_TO_FETCH.has(
          ProcessingTopic.OMNIPOOL
        )
      ) {
        for await (const page of this.fetchAllPages({
          limit:
            this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
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
      }
      return [{ pallet: ProcessingTopic.OMNIPOOL, data: data.flat() }];
    };

    const allStablepoolStorageFetchPromise = async () => {
      const data = [];

      if (
        appConfig.STORAGE_DICTIONARY_TOPICS_TO_FETCH.has(
          ProcessingTopic.STABLESWAP
        )
      ) {
        for await (const page of this.fetchAllPages({
          limit:
            this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
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
      }
      return [{ pallet: ProcessingTopic.STABLESWAP, data: data.flat() }];
    };

    const allMmAggregatorOraclesStorageFetchPromise = async () => {
      const data = [];

      if (
        appConfig.STORAGE_DICTIONARY_TOPICS_TO_FETCH.has(
          ProcessingTopic.MM_AGGREGATOR_ORACLE
        )
      ) {
        for await (const page of this.fetchAllPages({
          limit:
            this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
          requestPromise: fetchBlockCompressedDataPaginated,
          topic: ProcessingTopic.MM_AGGREGATOR_ORACLE,
        })) {
          if (!page) continue;
          const encodedPageData: MmAggregatorOracleGlq[] =
            encodeBlockCompressedData<MmAggregatorOracleGlq>({
              data: page,
              dataKey: BlockCompressedDataKey.mmAggregatorOracle,
            });
          data.push(encodedPageData);
        }
      }
      return [
        {
          pallet: ProcessingTopic.MM_AGGREGATOR_ORACLE,
          data: data.flat(),
        },
      ];
    };

    const allAccountHistDataStorageFetchPromise = async () => {
      const accBalancesHistData: AccountAssetBalanceHistoricalDatumGql[][] = [];
      const accMmPositionHistData: AccountMmPositionHistoricalDatumGql[][] = [];

      if (
        appConfig.STORAGE_DICTIONARY_TOPICS_TO_FETCH.has(
          ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA
        )
      ) {
        for await (const page of this.fetchAllPages({
          limit:
            this.batchCtx.appConfig.STORAGE_DICTIONARY_PAGINATION_PAGE_SIZE,
          requestPromise: fetchBlockCompressedDataPaginated,
          topic: ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA,
        })) {
          if (!page) continue;
          const accBalancesEncodedPageData: AccountAssetBalanceHistoricalDatumGql[] =
            encodeBlockCompressedData<AccountAssetBalanceHistoricalDatumGql>({
              data: page,
              dataKey: BlockCompressedDataKey.accAssetBalancesHistoricalData,
            });
          const accMmPosEncodedPageData: AccountMmPositionHistoricalDatumGql[] =
            encodeBlockCompressedData<AccountMmPositionHistoricalDatumGql>({
              data: page,
              dataKey: BlockCompressedDataKey.accMmPositionHistoricalData,
            });

          accBalancesHistData.push(
            accBalancesEncodedPageData as AccountAssetBalanceHistoricalDatumGql[]
          );
          accMmPositionHistData.push(
            accMmPosEncodedPageData as AccountMmPositionHistoricalDatumGql[]
          );
        }
      }
      return [
        {
          pallet: ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA,
          data: accBalancesHistData.flat(),
        },
        {
          pallet: ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA,
          data: accMmPositionHistData.flat(),
        },
      ];
    };

    const execFetchPromiseWithTimeLog = async (
      fn: () => Promise<PalletDictionaryCollectedData[]>,
      fnName: string
    ): Promise<PalletDictionaryCollectedData[]> => {
      console.time(`:: >>> Dictionary API call [${fnName}] executed in`);
      const resp = await fn();
      console.timeEnd(`:: >>> Dictionary API call [${fnName}] executed in`);

      return resp;
    };

    console.time('Dictionary API call executed in');
    const fullResponse = await Promise.all([
      execFetchPromiseWithTimeLog(
        allLbpPoolStorageFetchPromise,
        'allLbpPoolStorageFetchPromise'
      ),
      execFetchPromiseWithTimeLog(
        allXykPoolStorageFetchPromise,
        'allXykPoolStorageFetchPromise'
      ),
      execFetchPromiseWithTimeLog(
        allOmnipoolStorageFetchPromise,
        'allOmnipoolStorageFetchPromise'
      ),
      execFetchPromiseWithTimeLog(
        allStablepoolStorageFetchPromise,
        'allStablepoolStorageFetchPromise'
      ),
      execFetchPromiseWithTimeLog(
        allGenericStorageFetchPromise,
        'allGenericStorageFetchPromise'
      ),
      execFetchPromiseWithTimeLog(
        allMmAggregatorOraclesStorageFetchPromise,
        'allMmAggregatorOraclesStorageFetchPromise'
      ),
      execFetchPromiseWithTimeLog(
        allAccountHistDataStorageFetchPromise,
        'allAccountHistDataStorageFetchPromise'
      ),
    ]);

    console.log(
      `Size of the batchStorageState object: ${sizeof(fullResponse)} bytes`
    );

    console.timeEnd('Dictionary API call executed in');

    this.decorateDictionaryData(
      fullResponse.flat() as Array<PalletDictionaryCollectedData>
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
          );
          break;
        case ProcessingTopic.EMA_ORACLE:
          this.batchStorageState.set(
            ProcessingTopic.EMA_ORACLE,
            new BatchStorageStateSectionCollection<ProcessingTopic.EMA_ORACLE>({
              section: ProcessingTopic.EMA_ORACLE,
              data: palletData.data as EmaOracleGql[],
            }) as any
          );
          break;
        case ProcessingTopic.AAVE:
          this.batchStorageState.set(
            ProcessingTopic.AAVE,
            new BatchStorageStateSectionCollection<ProcessingTopic.AAVE>({
              section: ProcessingTopic.AAVE,
              data: palletData.data as AavepoolGlq[],
            }) as any
          );
          break;
        case ProcessingTopic.LBP:
          this.batchStorageState.set(
            ProcessingTopic.LBP,
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
          );
          break;
        case ProcessingTopic.OMNIPOOL:
          this.batchStorageState.set(
            ProcessingTopic.OMNIPOOL,
            new BatchStorageStateSectionCollection<ProcessingTopic.OMNIPOOL>({
              section: ProcessingTopic.OMNIPOOL,
              data: palletData.data as OmnipoolGql[],
            }) as any
          );
          break;
        case ProcessingTopic.STABLESWAP:
          this.batchStorageState.set(
            ProcessingTopic.STABLESWAP,
            new BatchStorageStateSectionCollection<ProcessingTopic.STABLESWAP>({
              section: ProcessingTopic.STABLESWAP,
              data: palletData.data as StableswapGql[],
            }) as any
          );
          break;
        case ProcessingTopic.MM_AGGREGATOR_ORACLE:
          this.batchStorageState.set(
            ProcessingTopic.MM_AGGREGATOR_ORACLE,
            new BatchStorageStateSectionCollection<ProcessingTopic.MM_AGGREGATOR_ORACLE>(
              {
                section: ProcessingTopic.MM_AGGREGATOR_ORACLE,
                data: palletData.data as MmAggregatorOracleGlq[],
              }
            ) as any
          );
          break;
        case ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA:
          this.batchStorageState.set(
            ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA,
            new BatchStorageStateSectionCollection<ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA>(
              {
                section: ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA,
                data: palletData.data as AccountAssetBalanceHistoricalDatumGql[],
              }
            ) as any
          );
          break;
        case ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA:
          this.batchStorageState.set(
            ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA,
            new BatchStorageStateSectionCollection<ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA>(
              {
                section: ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA,
                data: palletData.data as AccountMmPositionHistoricalDatumGql[],
              }
            ) as any
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

    return (
      Array.from(nodes)
        // .filter(
        //   ([key, data]) =>
        //     data.reserveAssetId !== undefined &&
        //     data.reserveAssetId !== null &&
        //     data.aTokenId !== undefined &&
        //     data.aTokenId !== null
        // )
        .map(([key, data]) => ({
          poolId: key,
          data: {
            reserve: +data.reserveAssetId!,
            aToken: +data.aTokenId!,
            liquidityIn: BigInt(data.liquidityIn),
            liquidityOut: BigInt(data.liquidityOut),
          },
        }))
    );
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

  getMmAggregatorOracle({
    address,
    blockHeight,
  }: {
    address: string;
    blockHeight: number;
  }): MmAggregatorDictionaryData | null {
    const node = this.getBatchStorageStatePart(
      ProcessingTopic.MM_AGGREGATOR_ORACLE
    ).getEntityById(`${address}-${blockHeight}`);

    if (!node) return null;

    return node;
  }

  getNativeTokenBalanceMany({
    accountIds,
    block,
  }: GetNativeTokenBalanceManyInput):
    | BalancesAccountInfoWithAccountId[]
    | null {
    const nodes = this.getBatchStorageStatePart(
      ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA
    ).getEntitiesByBlockNumber(block.height);

    if (!nodes || nodes.size === 0) return null;

    const response = [];
    const accountIdsSet = new Set(accountIds);

    for (const balanceData of Array.from(nodes.values())) {
      if (
        balanceData.assetId !== '0' ||
        (balanceData.assetId === '0' &&
          !accountIdsSet.has(balanceData.accountId))
      )
        continue;

      response.push({
        accountId: balanceData.accountId,
        data: {
          free: BigInt(balanceData.transferable),
          reserved: BigInt(balanceData.totalLocked),
          miscFrozen: 0n,
          feeFrozen: 0n,
          flags: 0n,
        },
      } as BalancesAccountInfoWithAccountId);
    }

    return response.length ? response : null;
  }

  getTokenBalancesMany({
    accountIds,
    block,
  }: GetTokenBalancesManyInput): TokenAccountBalancesWithAccountId[] | null {
    const nodes = this.getBatchStorageStatePart(
      ProcessingTopic.ACCOUNT_ASSET_BALANCE_HIST_DATA
    ).getEntitiesByBlockNumber(block.height);

    if (!nodes || nodes.size === 0) return null;

    const responseMap: Map<string, TokenAccountBalanceWithAssetId[]> =
      new Map();

    const accountIdsSet = new Set(accountIds);

    for (const balanceData of Array.from(nodes.values())) {
      if (
        balanceData.assetId === '0' ||
        !accountIdsSet.has(balanceData.accountId)
      )
        continue;

      if (!responseMap.has(balanceData.accountId))
        responseMap.set(balanceData.accountId, []);

      responseMap.get(balanceData.accountId)?.push({
        assetId: balanceData.assetId,
        data: {
          free: BigInt(balanceData.transferable),
          reserved: BigInt(balanceData.totalLocked),
          miscFrozen: 0n,
          feeFrozen: 0n,
          flags: 0n,
        },
      } as TokenAccountBalanceWithAssetId);
    }

    return responseMap.size === 0
      ? null
      : Array.from(responseMap.entries()).map(([accountId, assetBalances]) => ({
          accountId,
          assetBalances,
        }));
  }

  getAccountMmPositionData({
    accountId,
    block,
  }: GetAccountMmPositionDataInput): AccountMmPositionDataContractData | null {
    const node = this.getBatchStorageStatePart(
      ProcessingTopic.ACCOUNT_MM_POSITION_HIST_DATA
    ).getEntityById(`${accountId}-${block.height}`);

    return !node
      ? null
      : ({
          totalCollateralBase: node.totalCollateralBase,
          totalDebtBase: node.totalDebtBase,
          availableBorrowsBase: node.availableBorrowsBase,
          currentLiquidationThreshold: node.currentLiquidationThreshold,
          ltv: node.ltv,
          healthFactor: node.healthFactor,
          pool: node.poolAddress,
        } as AccountMmPositionDataContractData);
  }
}
