import { ProcessingTopic } from '../types';
import { BatchStorageStateSectionNode } from '../storageDictionaryManager';
import {
  Aavepool as AavepoolGlq,
  AssetHistoricalDatum as AssetHistoricalDatumGql,
  EmaOracle as EmaOracleGql,
  Lbppool as LbpPoolGlq,
  LbppoolAssetsDatum,
  Omnipool as OmnipoolGql,
  OmnipoolAssetDatum,
  Stableswap as StableswapGql,
  StableswapAssetDatum,
  Xykpool as XykpoolGlq,
  XykpoolAssetsDatum,
} from '../apiTypes/types';

export type PoolAssetHistDataNode<T> = T extends ProcessingTopic.XYK
  ? XykpoolAssetsDatum
  : T extends ProcessingTopic.OMNIPOOL
    ? OmnipoolAssetDatum
    : T extends ProcessingTopic.STABLESWAP
      ? StableswapAssetDatum
      : T extends ProcessingTopic.LBP
        ? LbppoolAssetsDatum
        : never;

export class BatchStorageStateSectionCollection<T extends ProcessingTopic> {
  private readonly stateRaw: BatchStorageStateSectionNode<T>[];

  private stateIndexedByEntityId: Map<string, BatchStorageStateSectionNode<T>> =
    new Map();

  private stateIndexedByBlockNumber: Map<
    number,
    Map<string, BatchStorageStateSectionNode<T>>
  > = new Map();

  private assetsIndexedByParentId: Map<
    string,
    Map<number, PoolAssetHistDataNode<T>>
  > = new Map();

  constructor({
    data = [],
    section,
  }: {
    data?: BatchStorageStateSectionNode<T>[];
    section: T;
  }) {
    this.stateRaw = data;

    for (const dataItem of data) {
      this.stateIndexedByEntityId.set(dataItem.id, dataItem);

      if (!this.stateIndexedByBlockNumber.has(dataItem.paraBlockHeight)) {
        this.stateIndexedByBlockNumber.set(dataItem.paraBlockHeight, new Map());
      }

      if (
        section !== ProcessingTopic.AAVE ||
        (section === ProcessingTopic.AAVE &&
          (dataItem as AavepoolGlq).reserveAssetId !== undefined &&
          (dataItem as AavepoolGlq).reserveAssetId !== null &&
          (dataItem as AavepoolGlq).aTokenId !== undefined &&
          (dataItem as AavepoolGlq).aTokenId !== null)
      ) {
        this.stateIndexedByBlockNumber
          .get(dataItem.paraBlockHeight)!
          .set(dataItem.id, dataItem);
      }

      switch (section) {
        case ProcessingTopic.LBP: {
          if (!(dataItem as LbpPoolGlq).lbppoolAssetsDataByPoolId.nodes) break;

          for (const assetItem of (dataItem as LbpPoolGlq)
            .lbppoolAssetsDataByPoolId.nodes) {
            if (!assetItem) continue;
            if (!this.assetsIndexedByParentId.has(dataItem.id))
              this.assetsIndexedByParentId.set(dataItem.id, new Map());
            this.assetsIndexedByParentId
              .get(dataItem.id)!
              .set(assetItem.assetId, assetItem as PoolAssetHistDataNode<T>);
          }
          break;
        }

        case ProcessingTopic.XYK: {
          if (!(dataItem as XykpoolGlq).xykpoolAssetsDataByPoolId.nodes) break;

          for (const assetItem of (dataItem as XykpoolGlq)
            .xykpoolAssetsDataByPoolId.nodes) {
            if (!assetItem) continue;
            if (!this.assetsIndexedByParentId.has(dataItem.id))
              this.assetsIndexedByParentId.set(dataItem.id, new Map());
            this.assetsIndexedByParentId
              .get(dataItem.id)!
              .set(assetItem.assetId, assetItem as PoolAssetHistDataNode<T>);
          }
          break;
        }

        case ProcessingTopic.STABLESWAP: {
          if (!(dataItem as StableswapGql).stableswapAssetDataByPoolId.nodes)
            break;

          for (const assetItem of (dataItem as StableswapGql)
            .stableswapAssetDataByPoolId.nodes) {
            if (!assetItem) continue;
            if (!this.assetsIndexedByParentId.has(dataItem.id))
              this.assetsIndexedByParentId.set(dataItem.id, new Map());
            this.assetsIndexedByParentId
              .get(dataItem.id)!
              .set(assetItem.assetId, assetItem as PoolAssetHistDataNode<T>);
          }
          break;
        }

        case ProcessingTopic.OMNIPOOL: {
          if (!(dataItem as OmnipoolGql).omnipoolAssetDataByPoolId.nodes) break;

          for (const assetItem of (dataItem as OmnipoolGql)
            .omnipoolAssetDataByPoolId.nodes) {
            if (!assetItem) continue;
            if (!this.assetsIndexedByParentId.has(dataItem.id))
              this.assetsIndexedByParentId.set(dataItem.id, new Map());
            this.assetsIndexedByParentId
              .get(dataItem.id)!
              .set(assetItem.assetId, assetItem as PoolAssetHistDataNode<T>);
          }
          break;
        }
      }
    }
  }

  get state() {
    return this.stateRaw;
  }

  getEntityById(id: string): BatchStorageStateSectionNode<T> | undefined {
    return this.stateIndexedByEntityId.get(id);
  }

  getEntitiesByBlockNumber(
    blockNumber: number
  ): Map<string, BatchStorageStateSectionNode<T>> | undefined {
    return this.stateIndexedByBlockNumber.get(blockNumber);
  }

  getAssetsByParentId(
    parentId: string
  ): Map<number, PoolAssetHistDataNode<T>> | undefined {
    return this.assetsIndexedByParentId.get(parentId);
  }
}
