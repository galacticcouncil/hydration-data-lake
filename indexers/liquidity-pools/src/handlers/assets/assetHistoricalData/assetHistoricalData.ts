import pMap from 'p-map';
import { LessThan, Like } from 'typeorm';

import { BlockHeader } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import {
  AssetDynamicFee,
  AssetHistoricalData,
  AssetType,
} from '../../../model';
import parsers from '../../../parsers';
import { SqdProcessorContext } from '../../../processor';
import { LatestProcessedDataCacheManager } from '../../../utils/latestProcessedDataCacheManager';
import { AaveMoneyMarketsRegistry } from '../../../utils/evmTools/aave/aaveMoneyMarketsRegistry/aaveMoneyMarketsRegistry';

export async function processAssetsHistoricalDataAtBlock({
  assetRegistryIds,
  block,
  ctx,
}: {
  assetRegistryIds: Array<string>;
  block: BlockHeader;
  ctx: SqdProcessorContext<Store>;
}) {
  const indexedAssets: Map<string, string> = new Map(); // Map<assetRegistryId, id>
  const mmAssets = [];
  const otherAssets = [];

  // Why: querying tokens.totalIssuance for destroyed XYK share tokens is wasted
  // RPC work — totalIssuance is 0 forever once the pool is destroyed.
  const activeShareTokenIds = new Set<string>();
  for (const pool of ctx.batchState.state.xykAllBatchPools.values()) {
    if (!pool?.shareTokenId || pool.isDestroyed) continue;
    activeShareTokenIds.add(pool.shareTokenId);
  }

  for (const asset of ctx.batchState.state.assetsAll.values()) {
    if (asset.assetRegistryId !== undefined && asset.assetRegistryId !== null)
      indexedAssets.set(`${asset.assetRegistryId}`, asset.id);

    if (asset.assetType === AssetType.Erc20) {
      if (asset.evmAddress) mmAssets.push(asset);
      continue;
    }

    if (
      asset.assetType === AssetType.XYK &&
      !activeShareTokenIds.has(asset.id)
    ) {
      continue;
    }

    if (asset.assetRegistryId !== undefined && asset.assetRegistryId !== null)
      otherAssets.push(asset);
  }

  const [
    otherAssetsTotalIssuance,
    nativeTokenTotalIssuance,
    mmAssetsTotalSupply,
    dynamicFeesAllAssets,
  ] = await Promise.all([
    parsers.storage.tokens.getManyTokensTotalIssuance({
      block,
      tokenIds: otherAssets.map((asset) => asset.assetRegistryId!),
    }),
    parsers.storage.balances.getTotalIssuance({ block }),
    AaveMoneyMarketsRegistry.getInstance().getManyTokensTotalSupplyWithLogs({
      addresses: mmAssets.map((a) => a.evmAddress!),
      blockNumber: block.height,
    }),
    parsers.storage.dynamicFees.getAssetFeesAll({ block }),
  ]);

  const totalIssuancePerAssetMapByAssetId = new Map(
    otherAssetsTotalIssuance
      .filter((res) => res.amount !== null)
      .map((res) => [indexedAssets.get(res.tokenId)!, res.amount])
  );
  totalIssuancePerAssetMapByAssetId.set('0', nativeTokenTotalIssuance);

  for (const tSupply of mmAssetsTotalSupply) {
    if (tSupply)
      totalIssuancePerAssetMapByAssetId.set(
        tSupply.address,
        BigInt(tSupply.value)
      );
  }

  /**
   * We need this fallback because some assets are not present in
   * tokens.totalIssuance storage.
   */
  for (const asset of ctx.batchState.state.assetsAll.values()) {
    if (!totalIssuancePerAssetMapByAssetId.has(asset.id))
      totalIssuancePerAssetMapByAssetId.set(asset.id, 0n);
  }
  const dynamicFeePerAssetMap = new Map(
    dynamicFeesAllAssets.map((res) => [`${res.assetId}`, res])
  );

  await pMap(
    Array.from(ctx.batchState.state.assetsAll.values()),
    async (asset) => {
      if (!totalIssuancePerAssetMapByAssetId.has(asset.id)) {
        return null;
      }

      const blockData = ctx.batchState.getParaBlockFromCacheByHeight(
        block.height
      );
      if (!blockData) {
        throw new Error(`Block not found in cache for height ${block.height}`);
      }

      const newAssetHistoricalData = new AssetHistoricalData({
        id: `${asset.id}-${block.height}`,
        assetId: asset.id,

        totalIssuance: totalIssuancePerAssetMapByAssetId.get(asset.id) ?? 0n,

        dynamicFee: dynamicFeePerAssetMap.has(asset.assetRegistryId ?? '')
          ? new AssetDynamicFee({
              assetFee: dynamicFeePerAssetMap.get(asset.assetRegistryId ?? '')!
                .assetFee,
              protocolFee: dynamicFeePerAssetMap.get(
                asset.assetRegistryId ?? ''
              )!.protocolFee,
              timestamp: dynamicFeePerAssetMap.get(asset.assetRegistryId ?? '')!
                .timestamp,
            })
          : null,
        usdPriceNormalised: '0',
        assetPairVolumes: [],
        paraBlockHeight: block.height,
      });

      ctx.batchState.state.assetsHistoricalDataBatch.set(
        newAssetHistoricalData.id,
        newAssetHistoricalData
      );
    },
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );
}

export async function getAssetHistDataWithUniqueData(
  src: Map<string, AssetHistoricalData>,
  ctx: SqdProcessorContext<Store>
) {
  const result: Map<string, AssetHistoricalData> = new Map();

  const assetHistoryIndexByAsset = new Map<string, AssetHistoricalData[]>();

  for (const i of (
    src || ctx.batchState.state.assetsHistoricalDataBatch
  ).values()) {
    if (!assetHistoryIndexByAsset.has(i.assetId)) {
      assetHistoryIndexByAsset.set(i.assetId, []);
    }
    assetHistoryIndexByAsset.get(i.assetId)!.push(i);
  }

  for (const [assetId, list] of assetHistoryIndexByAsset.entries()) {
    const listToSort = list;
    const latestCachedItem =
      LatestProcessedDataCacheManager.getInstance().getLastAssetHistoricalDataItem(
        assetId
      );
    if (latestCachedItem) listToSort.push(latestCachedItem);

    const orderedList = listToSort.sort(
      (a, b) => b.paraBlockHeight - a.paraBlockHeight
    );
    assetHistoryIndexByAsset.set(assetId, orderedList);
  }

  await pMap(
    Array.from(src.values()),
    async (item) => {
      if (
        await isAssetHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedIndexedRecords: assetHistoryIndexByAsset,
          ctx,
        })
      ) {
        result.set(item.id, item);
      }
    },
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );

  // for (const item of src.values()) {
  //   if (
  //     await isAssetHistoricalDataUniqueRegardingPreviousRecord({
  //       currentRecord: item,
  //       cachedRecords: src,
  //       ctx,
  //     })
  //   )
  //     result.set(item.id, item);
  // }

  return result;
}

export async function isAssetHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedIndexedRecords,
  ctx,
}: {
  currentRecord: AssetHistoricalData;
  cachedIndexedRecords: Map<string, AssetHistoricalData[]>;
  ctx: SqdProcessorContext<Store>;
}) {
  let previousItem = (
    cachedIndexedRecords.get(currentRecord.assetId) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    // Since AssetHistoricalData.id is "<assetId>-<paraBlockHeight>",
    // use Like to match the asset ID prefix
    previousItem = await ctx.storeUtils.findOneWithLogs(
      AssetHistoricalData,
      {
        where: {
          id: Like(`${currentRecord.assetId}-%`),
          paraBlockHeight: LessThan(currentRecord.paraBlockHeight),
        },
        order: {
          paraBlockHeight: 'DESC',
        },
      },
      {
        className: 'AssetHistoricalData',
        originCallFn: 'isAssetHistoricalDataUniqueRegardingPreviousRecord',
      }
    );
    /**
     * We need this action here to be sure that cache contains latest entity from DB.
     */
    if (previousItem)
      LatestProcessedDataCacheManager.getInstance().setLastAssetHistoricalDataItem(
        [previousItem]
      );
  }

  if (!previousItem) {
    return true;
  }

  let isEqual = true;

  if (
    previousItem.totalIssuance !== currentRecord.totalIssuance ||
    previousItem.usdPriceNormalised !== currentRecord.usdPriceNormalised ||
    !!previousItem.dynamicFee !== !!currentRecord.dynamicFee ||
    (!!previousItem.dynamicFee &&
      !!currentRecord.dynamicFee &&
      (previousItem.dynamicFee.assetFee !== currentRecord.dynamicFee.assetFee ||
        previousItem.dynamicFee.protocolFee !==
          currentRecord.dynamicFee.protocolFee))
  ) {
    isEqual = false;
  }

  return !isEqual;
}
