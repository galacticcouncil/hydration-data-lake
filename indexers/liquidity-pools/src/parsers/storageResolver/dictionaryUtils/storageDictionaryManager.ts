import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AccountBalances as AccountBalancesGql,
  GetOmnipoolBlocksStorageState,
  GetOmnipoolBlocksStorageStateQuery,
  GetOmnipoolBlocksStorageStateQueryVariables,
  GetStablepoolBlocksStorageState,
  GetStablepoolBlocksStorageStateQuery,
  GetStablepoolBlocksStorageStateQueryVariables,
  GetXykPoolBlocksStorageState,
  GetXykPoolBlocksStorageStateQuery,
  GetXykPoolBlocksStorageStateQueryVariables,
  InputMaybe,
  OmnipoolAssetDataOrderBy,
  OmnipoolAssetDatum,
  OmnipoolAssetDatumFilter,
  Stablepool as StablepoolGql,
  StablepoolFilter,
  StablepoolsOrderBy,
  XykPool as XykPoolGlq,
  XykPoolFilter,
  XykPoolsOrderBy,
  LbpPool as LbpPoolGlq,
  LbpPoolFilter,
  LbpPoolsOrderBy,
  GetLbpPoolBlocksStorageStateQuery,
  GetLbpPoolBlocksStorageStateQueryVariables,
  GetLbpPoolBlocksStorageState,
} from './apiTypes/types';
import { QueriesHelper } from './queriesHelper';
import {
  PaginationConfig,
  PalletDictionaryCollectedData,
  ProcessingPallets,
} from './types';
import {
  AccountData,
  GetPoolAssetInfoInput,
  LbpGetPoolDataInput,
  LbpPoolData,
  LbpWeightCurveType,
  OmnipoolAssetData,
  OmnipoolAssetTradability,
  OmnipoolGetAssetDataInput,
  StablepoolGetPoolDataInput,
  StablepoolInfo,
  XykGetAssetsInput,
  XykPoolWithAssets,
} from '../../types/storage';

// type PalletBatchStorageState<T = any> = T extends ProcessingPallets.XYK
//   ? Map<string, XykPoolGlq>
//   : T extends ProcessingPallets.OMNIPOOL
//     ? Map<string, OmnipoolAssetDatum>
//     : T extends ProcessingPallets.STABLESWAP
//       ? Map<string, StablepoolGql>
//       : never;

export type BatchStorageStateSectionNode<T> = T extends ProcessingPallets.XYK
  ? XykPoolGlq
  : T extends ProcessingPallets.OMNIPOOL
    ? OmnipoolAssetDatum
    : T extends ProcessingPallets.STABLESWAP
      ? StablepoolGql
      : T extends ProcessingPallets.LBP
        ? LbpPoolGlq
        : never;

export class StorageDictionaryManager extends QueriesHelper {
  protected batchCtx: ProcessorContext<Store>;

  batchStorageState: Map<
    ProcessingPallets,
    Map<string, LbpPoolGlq | XykPoolGlq | OmnipoolAssetDatum | StablepoolGql>
  > = new Map([
    [ProcessingPallets.LBP, new Map()],
    [ProcessingPallets.XYK, new Map()],
    [ProcessingPallets.OMNIPOOL, new Map()],
    [ProcessingPallets.STABLESWAP, new Map()],
  ]);

  constructor({ batchCtx }: { batchCtx: ProcessorContext<Store> }) {
    super({ batchCtx });
    this.batchCtx = batchCtx;
  }

  setBatchContext(batchCtx: ProcessorContext<Store>) {
    this.batchCtx = batchCtx;
  }

  getBatchStorageStatePart<T extends ProcessingPallets>(
    section: T
  ): Map<string, BatchStorageStateSectionNode<T>> {
    return (
      (this.batchStorageState.get(section) as Map<
        string,
        BatchStorageStateSectionNode<T>
      >) || new Map<string, BatchStorageStateSectionNode<T>>()
    );
  }

  wipeBatchStorageState() {
    this.batchStorageState = new Map([
      [ProcessingPallets.XYK, new Map()],
      [ProcessingPallets.OMNIPOOL, new Map()],
      [ProcessingPallets.STABLESWAP, new Map()],
    ]);
  }

  async fetchBatchStorageStateAllPallets(args: {
    blockNumberFrom: number;
    blockNumberTo: number;
  }) {
    const fetchAllLbpPoolsPaginated = async ({
      pageSize,
      offset,
    }: PaginationConfig) => {
      let filter: InputMaybe<LbpPoolFilter> = { or: [] };
      const lbpPoolAssetIdsForStoragePrefetch =
        this.batchCtx.batchState.state.lbpPoolAssetIdsForStoragePrefetch;

      if (lbpPoolAssetIdsForStoragePrefetch.size === 0)
        return {
          data: [],
          totalCount: 0,
        };

      if (lbpPoolAssetIdsForStoragePrefetch.size > 2) {
        const filterParams = this.getGenericFilterParams<string>(
          lbpPoolAssetIdsForStoragePrefetch
        );
        filter = {
          or: [...filterParams.ids.values()]
            .map((idsPair) => {
              const [assetA, assetB] = idsPair.split('-');
              return [
                {
                  assetAId: { equalTo: +assetA },
                  assetBId: { equalTo: +assetB },
                  paraChainBlockHeight: {
                    greaterThanOrEqualTo: filterParams.fromBlockNumber,
                  },
                  and: [
                    {
                      assetAId: { equalTo: +assetA },
                      assetBId: { equalTo: +assetB },
                      paraChainBlockHeight: {
                        lessThanOrEqualTo: filterParams.toBlockNumber,
                      },
                    },
                  ],
                },
                {
                  assetAId: { equalTo: +assetB },
                  assetBId: { equalTo: +assetA },
                  paraChainBlockHeight: {
                    greaterThanOrEqualTo: filterParams.fromBlockNumber,
                  },
                  and: [
                    {
                      assetAId: { equalTo: +assetA },
                      assetBId: { equalTo: +assetB },
                      paraChainBlockHeight: {
                        lessThanOrEqualTo: filterParams.toBlockNumber,
                      },
                    },
                  ],
                },
              ] as LbpPoolFilter[];
            })
            .flat(),
        };
      } else {
        lbpPoolAssetIdsForStoragePrefetch.forEach((poolIds, blockNumber) => {
          poolIds.ids.forEach((idsPair) => {
            const [assetA, assetB] = idsPair.split('-');
            filter!.or!.push(
              ...[
                {
                  paraChainBlockHeight: { equalTo: blockNumber },
                  assetAId: { equalTo: +assetA },
                  assetBId: { equalTo: +assetB },
                },
                {
                  paraChainBlockHeight: { equalTo: blockNumber },
                  assetAId: { equalTo: +assetB },
                  assetBId: { equalTo: +assetA },
                },
              ]
            );
          });
        });
      }

      const resp = await this.dictionaryGqlRequest<
        GetLbpPoolBlocksStorageStateQuery,
        GetLbpPoolBlocksStorageStateQueryVariables
      >({
        query: GetLbpPoolBlocksStorageState,
        variables: {
          filter,
          orderBy: LbpPoolsOrderBy.ParaChainBlockHeightAsc,
          first: pageSize,
          offset,
        },
        dictName: ProcessingPallets.LBP,
      });

      // console.log('filter');
      // console.dir(filter, { depth: null });
      // console.log('resp');
      // console.dir(resp.data, { depth: null });
      // console.log('\n\n\n\n');

      return {
        data: resp.data && resp.data.lbpPools ? resp.data.lbpPools.nodes : [],
        totalCount:
          resp.data && resp.data.lbpPools ? resp.data.lbpPools.totalCount : 0,
      };
    };

    const fetchAllXykPoolsPaginated = async ({
      pageSize,
      offset,
    }: PaginationConfig) => {
      let filter: InputMaybe<XykPoolFilter> = { or: [] };
      const xykPoolIdsForStoragePrefetch =
        this.batchCtx.batchState.state.xykPoolIdsForStoragePrefetch;

      if (xykPoolIdsForStoragePrefetch.size === 0)
        return {
          data: [],
          totalCount: 0,
        };

      if (xykPoolIdsForStoragePrefetch.size > 30) {
        const filterParams = this.getGenericFilterParams<string>(
          xykPoolIdsForStoragePrefetch
        );
        filter = {
          poolAddress: {
            in: filterParams.ids,
          },
          paraChainBlockHeight: {
            greaterThanOrEqualTo: filterParams.fromBlockNumber,
          },
          and: [
            {
              poolAddress: {
                in: [...new Set(filterParams.ids).values()],
              },
              paraChainBlockHeight: {
                lessThanOrEqualTo: filterParams.toBlockNumber,
              },
            },
          ],
        };
      } else {
        xykPoolIdsForStoragePrefetch.forEach((poolIds, blockNumber) => {
          filter!.or!.push({
            paraChainBlockHeight: { equalTo: blockNumber },
            poolAddress: { in: [...poolIds.ids.values()] },
          });
        });
      }

      const resp = await this.dictionaryGqlRequest<
        GetXykPoolBlocksStorageStateQuery,
        GetXykPoolBlocksStorageStateQueryVariables
      >({
        query: GetXykPoolBlocksStorageState,
        variables: {
          filter,
          orderBy: XykPoolsOrderBy.ParaChainBlockHeightAsc,
          first: pageSize,
          offset,
        },
        dictName: ProcessingPallets.XYK,
      });
      return {
        data: resp.data && resp.data.xykPools ? resp.data.xykPools.nodes : [],
        totalCount:
          resp.data && resp.data.xykPools ? resp.data.xykPools.totalCount : 0,
      };
    };

    const fetchAllOmnipoolAssetsPaginated = async ({
      pageSize,
      offset,
    }: PaginationConfig) => {
      let filter: InputMaybe<OmnipoolAssetDatumFilter> = { or: [] };
      const omnipoolAssetIdsForStoragePrefetch =
        this.batchCtx.batchState.state.omnipoolAssetIdsForStoragePrefetch;

      if (omnipoolAssetIdsForStoragePrefetch.size === 0)
        return {
          data: [],
          totalCount: 0,
        };

      /**
       * We need adjust filter based on number of blocks which must be filtered.
       * Dictionary API will go through Time out error with big amount of
       * filtering conditions. So we must fetch redundant data with more generic
       * filter.
       */
      if (omnipoolAssetIdsForStoragePrefetch.size > 30) {
        const filterParams = this.getGenericFilterParams<number>(
          omnipoolAssetIdsForStoragePrefetch
        );

        filter = {
          assetId: {
            in: filterParams.ids,
          },
          paraChainBlockHeight: {
            greaterThanOrEqualTo: filterParams.fromBlockNumber,
          },
          and: [
            {
              assetId: {
                in: [...new Set(filterParams.ids).values()],
              },
              paraChainBlockHeight: {
                lessThanOrEqualTo: filterParams.toBlockNumber,
              },
            },
          ],
        };
      } else {
        omnipoolAssetIdsForStoragePrefetch.forEach((poolIds, blockNumber) => {
          filter!.or!.push({
            paraChainBlockHeight: { equalTo: blockNumber },
            assetId: { in: [...poolIds.ids.values()] },
          });
        });
      }
      const resp = await this.dictionaryGqlRequest<
        GetOmnipoolBlocksStorageStateQuery,
        GetOmnipoolBlocksStorageStateQueryVariables
      >({
        query: GetOmnipoolBlocksStorageState,
        variables: {
          filter,
          orderBy: OmnipoolAssetDataOrderBy.ParaChainBlockHeightAsc,
          first: pageSize,
          offset,
        },
        dictName: ProcessingPallets.OMNIPOOL,
      });
      return {
        data:
          resp.data && resp.data.omnipoolAssetData
            ? resp.data.omnipoolAssetData.nodes
            : [],
        totalCount:
          resp.data && resp.data.omnipoolAssetData
            ? resp.data.omnipoolAssetData.totalCount
            : 0,
      };
    };

    const fetchAllStablepoolAssetsPaginated = async ({
      pageSize,
      offset,
    }: PaginationConfig) => {
      let filter: InputMaybe<StablepoolFilter> = { or: [] };
      const stablepoolIdsForStoragePrefetch =
        this.batchCtx.batchState.state.stablepoolIdsForStoragePrefetch;

      if (stablepoolIdsForStoragePrefetch.size === 0)
        return {
          data: [],
          totalCount: 0,
        };

      if (stablepoolIdsForStoragePrefetch.size > 30) {
        const filterParams = this.getGenericFilterParams<number>(
          stablepoolIdsForStoragePrefetch
        );
        filter = {
          poolId: {
            in: [...new Set(filterParams.ids).values()],
          },
          paraChainBlockHeight: {
            greaterThanOrEqualTo: filterParams.fromBlockNumber,
          },
          and: [
            {
              poolId: {
                in: [...new Set(filterParams.ids).values()],
              },
              paraChainBlockHeight: {
                lessThanOrEqualTo: filterParams.toBlockNumber,
              },
            },
          ],
        };
      } else {
        stablepoolIdsForStoragePrefetch.forEach((poolIds, blockNumber) => {
          filter!.or!.push({
            paraChainBlockHeight: { equalTo: blockNumber },
            poolId: { in: [...poolIds.ids.values()] },
          });
        });
      }

      const resp = await this.dictionaryGqlRequest<
        GetStablepoolBlocksStorageStateQuery,
        GetStablepoolBlocksStorageStateQueryVariables
      >({
        query: GetStablepoolBlocksStorageState,
        variables: {
          filter,
          orderBy: StablepoolsOrderBy.ParaChainBlockHeightAsc,
          first: pageSize,
          offset,
        },
        dictName: ProcessingPallets.STABLESWAP,
      });

      return {
        data:
          resp.data && resp.data.stablepools ? resp.data.stablepools.nodes : [],
        totalCount:
          resp.data && resp.data.stablepools
            ? resp.data.stablepools.totalCount
            : 0,
      };
    };

    const allLbpPoolStorageFetchPromise = async () => {
      if (
        !this.batchCtx.appConfig.PROCESS_LBP_POOLS ||
        this.batchCtx.batchState.state.lbpPoolAssetIdsForStoragePrefetch
          .size === 0
      )
        return [];

      const data: LbpPoolGlq[] = [];
      for await (const page of this.fetchAllPages({
        limit: 1000,
        requestPromise: fetchAllLbpPoolsPaginated,
      })) {
        if (!page) continue;
        data.push(...(page as LbpPoolGlq[]));
      }
      return { pallet: ProcessingPallets.LBP, data: data.flat() };
    };

    const allXykPoolStorageFetchPromise = async () => {
      if (
        !this.batchCtx.appConfig.PROCESS_XYK_POOLS ||
        this.batchCtx.batchState.state.xykPoolIdsForStoragePrefetch.size === 0
      )
        return [];

      const data: XykPoolGlq[] = [];
      for await (const page of this.fetchAllPages({
        limit: 1000,
        requestPromise: fetchAllXykPoolsPaginated,
      })) {
        if (!page) continue;
        data.push(...(page as XykPoolGlq[]));
      }
      return { pallet: ProcessingPallets.XYK, data: data.flat() };
    };

    const allOmnipoolStorageFetchPromise = async () => {
      if (
        !this.batchCtx.appConfig.PROCESS_OMNIPOOLS ||
        this.batchCtx.batchState.state.omnipoolAssetIdsForStoragePrefetch
          .size === 0
      )
        return [];

      const data = [];
      for await (const page of this.fetchAllPages({
        limit: 1000,
        requestPromise: fetchAllOmnipoolAssetsPaginated,
      })) {
        data.push(page);
      }
      return { pallet: ProcessingPallets.OMNIPOOL, data: data.flat() };
    };
    const allStablepoolStorageFetchPromise = async () => {
      if (
        !this.batchCtx.appConfig.PROCESS_STABLEPOOLS ||
        this.batchCtx.batchState.state.stablepoolIdsForStoragePrefetch.size ===
          0
      )
        return [];

      const data = [];
      for await (const page of this.fetchAllPages({
        limit: 1000,
        requestPromise: fetchAllStablepoolAssetsPaginated,
      })) {
        data.push(page);
      }
      return { pallet: ProcessingPallets.STABLESWAP, data: data.flat() };
    };

    console.time('Dictionary API call executed in');
    const fullResponse = await Promise.all([
      allLbpPoolStorageFetchPromise(),
      allXykPoolStorageFetchPromise(),
      allOmnipoolStorageFetchPromise(),
      allStablepoolStorageFetchPromise(),
    ]);

    console.timeEnd('Dictionary API call executed in');
    // @ts-ignore
    this.decorateDictionaryData(fullResponse);
  }

  decorateDictionaryData(rawData: Array<PalletDictionaryCollectedData>) {
    for (const palletData of rawData) {
      switch (palletData.pallet) {
        case ProcessingPallets.LBP:
          this.batchStorageState.set(
            ProcessingPallets.LBP,
            new Map(
              (palletData.data as LbpPoolGlq[]).map((item) => [item.id, item])
            )
          );
          break;
        case ProcessingPallets.XYK:
          this.batchStorageState.set(
            ProcessingPallets.XYK,
            new Map(
              (palletData.data as XykPoolGlq[]).map((item) => [item.id, item])
            )
          );
          break;
        case ProcessingPallets.OMNIPOOL:
          this.batchStorageState.set(
            ProcessingPallets.OMNIPOOL,
            new Map(
              (palletData.data as OmnipoolAssetDatum[]).map((item) => [
                item.id,
                item,
              ])
            )
          );
          break;
        case ProcessingPallets.STABLESWAP:
          this.batchStorageState.set(
            ProcessingPallets.STABLESWAP,
            new Map(
              (palletData.data as StablepoolGql[]).map((item) => [
                item.id,
                item,
              ])
            )
          );
          break;
        default:
      }
    }
  }

  getStableswapPoolData({
    assetId,
    block,
  }: StablepoolGetPoolDataInput): StablepoolInfo | null {
    const node = this.getBatchStorageStatePart(
      ProcessingPallets.STABLESWAP
    ).get(`${assetId}-${block.height}`);

    if (!node) return null;

    if (
      !node.stablepoolAssetDataByPoolId.nodes ||
      node.stablepoolAssetDataByPoolId.nodes.length === 0
    )
      return null;

    return {
      assets: node.stablepoolAssetDataByPoolId.nodes.map(
        (asset) => asset!.assetId
      ),
      initialAmplification: node.initialAmplification,
      finalAmplification: node.finalAmplification,
      initialBlock: node.initialBlock,
      finalBlock: node.finalBlock,
      fee: node.fee,
    };
  }

  getStableswapPoolAssetInfo({
    poolId,
    assetId,
    block,
  }: GetPoolAssetInfoInput): AccountData | null {
    const node = this.getBatchStorageStatePart(
      ProcessingPallets.STABLESWAP
    ).get(`${poolId}-${block.height}`);

    if (!node) return null;

    if (
      !node.stablepoolAssetDataByPoolId.nodes ||
      node.stablepoolAssetDataByPoolId.nodes.length === 0
    )
      return null;

    const assetInfo = node.stablepoolAssetDataByPoolId.nodes.find(
      (asset) => asset?.assetId === assetId
    );
    if (!assetInfo || !assetInfo.balances) return null;
    const balances = assetInfo.balances as AccountBalancesGql;
    return {
      free: BigInt(balances.free ?? 0),
      reserved: BigInt(balances.reserved ?? 0),
      frozen: BigInt(balances.frozen ?? 0),
      miscFrozen: BigInt(balances.miscFrozen ?? 0),
      feeFrozen: BigInt(balances.feeFrozen ?? 0),
      flags: BigInt(balances.flags ?? 0),
    };
  }

  getOmnipoolAssetInfo({
    assetId,
    block,
  }: GetPoolAssetInfoInput): AccountData | null {
    const node = this.getBatchStorageStatePart(ProcessingPallets.OMNIPOOL).get(
      `${this.batchCtx.appConfig.OMNIPOOL_ADDRESS}-${assetId}-${block.height}`
    );

    if (!node) return null;
    const { balances } = node;

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
    const node = this.getBatchStorageStatePart(ProcessingPallets.OMNIPOOL).get(
      `${this.batchCtx.appConfig.OMNIPOOL_ADDRESS}-${assetId}-${block.height}`
    );

    if (!node) return null;
    const { assetState } = node;

    return {
      hubReserve: BigInt(assetState.hubReserve ?? 0),
      shares: BigInt(assetState.shares ?? 0),
      protocolShares: BigInt(assetState.protocolShares ?? 0),
      cap: BigInt(assetState.cap ?? 0),
      tradable: { bits: assetState.tradable.tradable ?? 0 },
    };
  }

  getXykPoolAssets({
    poolAddress,
    block,
  }: XykGetAssetsInput): XykPoolWithAssets | null {
    const node = this.getBatchStorageStatePart(ProcessingPallets.XYK).get(
      `${poolAddress}-${block.height}`
    );

    if (!node) return null;

    return {
      assetAId: node.assetAId,
      assetBId: node.assetBId,
      poolAddress,
    };
  }
  getXykPoolAssetInfo({
    poolAddress,
    assetId,
    block,
  }: GetPoolAssetInfoInput): AccountData | null {
    const node = this.getBatchStorageStatePart(ProcessingPallets.XYK).get(
      `${poolAddress}-${block.height}`
    );

    if (!node) return null;
    const asset = node.xykPoolAssetsDataByPoolId.nodes.find(
      (asset) => asset && asset.assetId === assetId
    );
    if (!asset) return null;

    const { balances } = asset;

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
    const node = this.getBatchStorageStatePart(ProcessingPallets.LBP).get(
      `${poolAddress}-${block.height}`
    );

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
      repayTarget,
    };
  }

  getLbpPoolAssetInfo({
    poolAddress,
    assetId,
    block,
  }: GetPoolAssetInfoInput): AccountData | null {
    const node = this.getBatchStorageStatePart(ProcessingPallets.LBP).get(
      `${poolAddress}-${block.height}`
    );

    if (!node) return null;
    const asset = node.lbpPoolAssetsDataByPoolId.nodes.find(
      (asset) => asset && asset.assetId === assetId
    );
    if (!asset) return null;

    const { balances } = asset;

    return {
      free: BigInt(balances.free ?? 0),
      reserved: BigInt(balances.reserved ?? 0),
      frozen: BigInt(balances.frozen ?? 0),
      miscFrozen: BigInt(balances.miscFrozen ?? 0),
      feeFrozen: BigInt(balances.feeFrozen ?? 0),
      flags: BigInt(balances.flags ?? 0),
    };
  }
}
