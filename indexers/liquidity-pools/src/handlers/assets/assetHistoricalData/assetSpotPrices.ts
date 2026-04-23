import pMap from 'p-map';
import { LessThan } from 'typeorm';

import { BigNumber, toFixedTrimmed } from '../../../utils/bignumber';
import { BlockHeader } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import { AppConfig } from '../../../appConfig';
import {
  Asset,
  AssetHistoricalData,
  AssetSpotPriceHistoricalData,
  AssetType,
  AssetResourceType,
  Xykpool,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import {
  fromDecimalToExponentialNotation,
  fromExponentialToDecimalNotation,
  getPriceRouteDecorated,
  getXykpoolShareTokenDecimals,
} from '../../../utils/helpers';
import { LatestProcessedDataCacheManager } from '../../../utils/latestProcessedDataCacheManager';
import { getOrCreatePriceRoute } from '../priceRoute/priceRoute';
import { getOrCreateAsset } from '../asset';
import { OfflineTradeRouterManager } from './utils';
import { Amount, Hop, PoolBase, PoolType } from './utils/offlineSdk/sdk/src';
import { ensureXykpoolHisDataFromLatestPersistedData } from '../../pools/pools/xykPool/historicalData';

const appConfig = AppConfig.getInstance();

export async function handleAssetSpotPricesHistoricalDataAtBlock({
  blockHeader,
  assetsHistoricalDataBatchIndexedByBlock,
  ctx,
}: {
  blockHeader: BlockHeader;
  assetsHistoricalDataBatchIndexedByBlock: Map<
    number,
    Array<AssetHistoricalData>
  >;
  ctx: SqdProcessorContext<Store>;
}) {
  const blockContextAssetsHistoricalData =
    assetsHistoricalDataBatchIndexedByBlock.get(blockHeader.height) ??
    Array.from(ctx.batchState.state.assetsHistoricalDataBatch.values()).filter(
      (histData) => histData.paraBlockHeight === blockHeader.height
    );

  const xykPoolAssets = getXykOnlyAssets(ctx);

  const xykOnlyAssetsHistData = [];
  const otherAssetsHistData = [];
  const xykShareAssetsHistData = [];

  for (const histDataItem of blockContextAssetsHistoricalData) {
    const histDataItemAsset = await getOrCreateAsset({
      id: histDataItem.assetId,
      ctx,
      ensure: true,
      blockHeader,
    });
    if (!histDataItemAsset) continue;

    if (histDataItemAsset.assetType === AssetType.XYK) {
      xykShareAssetsHistData.push(histDataItem);
      continue;
    }
    if (xykPoolAssets.has(histDataItem.assetId)) {
      xykOnlyAssetsHistData.push(histDataItem);
    } else {
      otherAssetsHistData.push(histDataItem);
    }
  }

  for (const histDataItem of otherAssetsHistData) {
    const histDataItemAsset = await getOrCreateAsset({
      id: histDataItem.assetId,
      ctx,
      ensure: true,
      blockHeader,
    });
    if (!histDataItemAsset) {
      continue;
    }

    await processAssetSpotPrices({
      assetId: histDataItemAsset.id,
      assetHistData: histDataItem,
      blockHeader,
      ctx,
    });
  }

  // Process XYK pools indexed map once (shared across all XYK assets)
  const xykPoolsIndexedByInterimAssetPair =
    xykOnlyAssetsHistData.length > 0
      ? getXykPoolsIndexedByInterimAssetPair({ ctx, xykPoolAssets })
      : null;

  if (!!xykPoolsIndexedByInterimAssetPair) {
    for (const histDataItem of xykOnlyAssetsHistData) {
      await processXykInvolvedAssetSpotPrices({
        assetId: histDataItem.assetId,
        assetHistData: histDataItem,
        xykPoolsIndexedByInterimAssetPair,
        blockHeader,
        ctx,
      });
    }
  }

  const xykPoolsIndexedByShareAsset = getXykPoolsIndexedByShareAsset({ ctx });

  for (const histDataItem of xykShareAssetsHistData) {
    const histDataItemAsset = await getOrCreateAsset({
      id: histDataItem.assetId,
      ctx,
      ensure: true,
      blockHeader,
    });
    if (!histDataItemAsset) continue;

    await processXykShareAssetSpotPrices({
      asset: histDataItemAsset,
      assetHistData: histDataItem,
      originXykpool: xykPoolsIndexedByShareAsset.get(histDataItemAsset.id),
      blockHeader,
      ctx,
    });
  }
}

async function processAssetSpotPrices({
  assetId,
  assetHistData,
  blockHeader,
  ctx,
}: {
  assetId: string;
  assetHistData: AssetHistoricalData;
  ctx: SqdProcessorContext<Store>;
  blockHeader: BlockHeader;
}) {
  const router = OfflineTradeRouterManager.getInstance().getRouterForBlock(
    blockHeader.height
  );

  if (!router) {
    console.log(`No router found for block ${blockHeader.height}.`);
    return;
  }
  if (!assetId) {
    console.log(
      `processAssetSpotPrices :: No assetId found for assetHistData ${assetHistData.id}.`
    );
    return;
  }

  const asset = await getOrCreateAsset({
    id: assetId,
    ctx,
    blockHeader,
    ensure: true,
  });
  if (!asset) {
    console.log(
      `Asset spot price calculation skipped for assetRegistryId ${assetId} at block ${blockHeader.height} due to missing asset.`
    );
    return;
  }

  const calcAssetSpotPrices = async () => {
    for (const assetOutId of ctx.appConfig.ASSET_SPOT_PRICE_ASSET_OUT_IDS) {
      /**
       * Skips price calculation when source and target assets are identical.
       */
      if (assetOutId === asset.assetRegistryId) continue;

      const assetOut = await getOrCreateAsset({
        assetRegistryId: assetOutId,
        ctx,
        blockHeader,
        ensure: true,
      });
      if (
        !assetOut ||
        asset.assetRegistryId === undefined ||
        asset.assetRegistryId === null
      )
        continue;

      try {
        // const [price, route] = await Promise.all([
        //   router.getBestSpotPrice(asset.assetRegistryId, assetOutId),
        //   router.getMostLiquidRoute(asset.assetRegistryId, assetOutId),
        // ]);

        let priceWithRoute =
          await OfflineTradeRouterManager.getInstance().getBestSpotPriceWitRoute(
            {
              assetInId: asset.assetRegistryId,
              assetOutId,
              router,
            }
          );

        if (!priceWithRoute) {
          if (
            asset.resourceType === AssetResourceType.aToken &&
            !!asset.underlyingAssetId &&
            asset.underlyingAssetId === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID
          ) {
            const baseAssetEntity = await getOrCreateAsset({
              id: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
              ctx,
              ensure: false,
            });
            if (!baseAssetEntity) continue;

            priceWithRoute = {
              price: {
                amount: BigNumber(1000000),
                decimals: baseAssetEntity.decimals || 6,
              },
              route: [],
              routeKey: 'ASSET_PRICE_BASE_ASSET_ID',
            };
            if (!priceWithRoute) continue;
          } else if (
            asset.resourceType === AssetResourceType.aToken &&
            !!asset.underlyingAssetId
          ) {
            const underliningAssetEntity = await getOrCreateAsset({
              id: asset.underlyingAssetId,
              ctx,
              ensure: false,
            });

            if (
              !underliningAssetEntity ||
              !underliningAssetEntity.assetRegistryId
            ) {
              continue;
            }

            priceWithRoute =
              await OfflineTradeRouterManager.getInstance().getBestSpotPriceWitRoute(
                {
                  assetInId: underliningAssetEntity.assetRegistryId,
                  assetOutId,
                  router,
                }
              );

            if (!priceWithRoute) {
              continue;
            }
          } else {
            continue;
          }
        }

        const { price, route } = priceWithRoute;

        const histDataItemId = `${asset.id}-${assetOutId}-${blockHeader.height}`;

        const blockData = ctx.batchState.getParaBlockFromCacheByHeight(
          blockHeader.height
        );
        if (!blockData) {
          throw new Error(
            `Block not found in cache for height ${blockHeader.height}`
          );
        }

        const decoratedRoute = getPriceRouteDecorated(route);
        const priceRoute = getOrCreatePriceRoute(decoratedRoute, ctx);

        ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(
          histDataItemId,
          new AssetSpotPriceHistoricalData({
            id: histDataItemId,
            assetInId: asset.id,
            assetOutId: assetOut.id,

            price: BigInt(price.amount.toFixed(0, BigNumber.ROUND_HALF_UP)),

            priceNormalised: toFixedTrimmed(
              fromExponentialToDecimalNotation(
                toFixedTrimmed(price.amount),
                price.decimals
              )
            ),
            priceRoute,
            paraBlockHeight: blockHeader.height,
          })
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

  await calcAssetSpotPrices();
}

export async function getAssetSpotPriceHistDataWithUniqueData(
  src: Map<string, AssetSpotPriceHistoricalData>,
  ctx: SqdProcessorContext<Store>
) {
  const result: AssetSpotPriceHistoricalData[] = [];

  const assetSportPriceHistoryIndexByAsset = new Map<
    string,
    AssetSpotPriceHistoricalData[]
  >();

  for (const i of (
    src || ctx.batchState.state.assetsSpotPriceHistoricalDataBatch
  ).values()) {
    if (!assetSportPriceHistoryIndexByAsset.has(i.assetInId)) {
      assetSportPriceHistoryIndexByAsset.set(i.assetInId, []);
    }
    assetSportPriceHistoryIndexByAsset.get(i.assetInId)!.push(i);
  }

  for (const [assetId, list] of assetSportPriceHistoryIndexByAsset.entries()) {
    const listToSort = list;
    const latestCachedItem =
      LatestProcessedDataCacheManager.getInstance().getLastAssetSpotPriceHistoricalDataItem(
        assetId
      );
    if (latestCachedItem) listToSort.push(latestCachedItem);

    const orderedList = listToSort.sort(
      (a, b) => b.paraBlockHeight - a.paraBlockHeight
    );
    assetSportPriceHistoryIndexByAsset.set(assetId, orderedList);
  }

  await pMap(
    Array.from(src.values()),
    async (item) => {
      if (
        await isAssetSpotPriceHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedIndexedRecords: assetSportPriceHistoryIndexByAsset,
          ctx,
        })
      ) {
        result.push(item);
      }
    },
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );

  return result;
}

export async function isAssetSpotPriceHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedIndexedRecords,
  ctx,
}: {
  currentRecord: AssetSpotPriceHistoricalData;
  cachedIndexedRecords: Map<string, AssetSpotPriceHistoricalData[]>;
  ctx: SqdProcessorContext<Store>;
}) {
  let previousItem = (
    cachedIndexedRecords.get(currentRecord.assetInId) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.storeUtils.findOneWithLogs(
      AssetSpotPriceHistoricalData,
      {
        where: {
          assetInId: currentRecord.assetInId,
          assetOutId: currentRecord.assetOutId,
          paraBlockHeight: LessThan(currentRecord.paraBlockHeight),
        },
        relations: {},
        order: {
          paraBlockHeight: 'DESC',
        },
      },
      {
        className: 'AssetSpotPriceHistoricalData',
        originCallFn:
          'isAssetSpotPriceHistoricalDataUniqueRegardingPreviousRecord',
      }
    );
    /**
     * We need this action here to be sure that cache contains latest entity from DB.
     */
    if (previousItem)
      LatestProcessedDataCacheManager.getInstance().setLastAssetSpotPriceHistoricalDataItem(
        [previousItem]
      );
  }

  if (!previousItem) {
    return true;
  }

  let isEqual = true;

  if (previousItem.price !== currentRecord.price) {
    isEqual = false;
  }
  return !isEqual;
}

function getXykOnlyAssets(ctx: SqdProcessorContext<Store>) {
  const xykInvolvedAssetsList = Array.from(
    ctx.batchState.state.xykAllBatchPools.values()
  )
    .filter((pool) => !pool.isDestroyed)
    .map((pool): [Asset | undefined, Asset | undefined] => {
      const assetA = ctx.batchState.state.assetsAll.get(pool.assetAId);
      const assetB = ctx.batchState.state.assetsAll.get(pool.assetBId);
      return [assetA, assetB];
    })
    .flat()
    .filter((asset): asset is Asset => !!asset);

  const omnipoolInvolvedAssets = new Map<string, Asset>(
    Array.from(ctx.batchState.state.omnipoolAssets.values())
      .map(
        (poolAsset) =>
          [
            poolAsset.assetId,
            ctx.batchState.state.assetsAll.get(poolAsset.assetId),
          ] as [string, Asset | undefined]
      )
      .filter(([, asset]) => asset !== undefined) as [string, Asset][]
  );

  const stableswapInvolvedAssets = new Map<string, Asset>(
    Array.from(ctx.batchState.state.stableswapAssets.values())
      .map(
        (poolAsset) =>
          [
            poolAsset.assetId,
            ctx.batchState.state.assetsAll.get(poolAsset.assetId),
          ] as [string, Asset | undefined]
      )
      .filter(([, asset]) => asset !== undefined) as [string, Asset][]
  );

  return new Map<string, Asset>(
    xykInvolvedAssetsList
      .filter(
        (asset) =>
          !omnipoolInvolvedAssets.has(asset.id) &&
          !stableswapInvolvedAssets.has(asset.id) &&
          !ctx.appConfig.ARTIFICIAL_OMNIPOOL_ASSET_IDS_SET.has(asset.id)
      )
      .map((asset) => [asset.id, asset])
  );
}

/**
 * Returns a map of XYK pools indexed by XYK pool asset where map's key is
 * XYK asset and value is a pool where this particular XYK asset is one asset
 * (assetA or assetB) and XYKPOOL_ASSET_PRICE_INTERIM_ASSET_ID is another asset.
 * */
function getXykPoolsIndexedByInterimAssetPair({
  ctx,
  xykPoolAssets,
}: {
  ctx: SqdProcessorContext<Store>;
  xykPoolAssets: Map<string, Asset>;
}) {
  const interimAssetId = ctx.appConfig.XYKPOOL_ASSET_PRICE_INTERIM_ASSET_ID;
  const interimFallbackAssetId =
    ctx.appConfig.XYKPOOL_ASSET_PRICE_FALLBACK_INTERIM_ASSET_ID;

  const pools = new Map<string, Xykpool>();

  for (const pool of Array.from(
    ctx.batchState.state.xykAllBatchPools.values()
  )) {
    if (
      (pool.assetAId === interimAssetId && xykPoolAssets.has(pool.assetBId)) ||
      (pool.assetBId === interimAssetId && xykPoolAssets.has(pool.assetAId))
    ) {
      if (pool.assetAId === interimAssetId) pools.set(pool.assetBId, pool);
      pools.set(pool.assetAId, pool);
    } else if (
      (pool.assetAId === interimFallbackAssetId &&
        xykPoolAssets.has(pool.assetBId)) ||
      (pool.assetBId === interimFallbackAssetId &&
        xykPoolAssets.has(pool.assetAId))
    ) {
      if (pool.assetAId === interimFallbackAssetId)
        pools.set(pool.assetBId, pool);
      pools.set(pool.assetAId, pool);
    }
  }

  return pools;
}

function getXykPoolsIndexedByShareAsset({
  ctx,
}: {
  ctx: SqdProcessorContext<Store>;
}) {
  const pools = new Map<string, Xykpool>();

  for (const pool of Array.from(
    ctx.batchState.state.xykAllBatchPools.values()
  )) {
    if (!pool?.shareTokenId) continue;

    pools.set(pool.shareTokenId, pool);
  }

  return pools;
}

async function processXykInvolvedAssetSpotPrices({
  assetId,
  // interimAsset,
  assetHistData,
  xykPoolsIndexedByInterimAssetPair,
  blockHeader,
  ctx,
}: {
  assetId: string;
  // interimAsset: Asset;
  assetHistData: AssetHistoricalData;
  xykPoolsIndexedByInterimAssetPair: Map<string, Xykpool>;
  ctx: SqdProcessorContext<Store>;
  blockHeader: BlockHeader;
}) {
  const asset = await getOrCreateAsset({
    id: assetId,
    ctx,
    blockHeader,
    ensure: true,
  });
  if (!asset) return;

  const assetXykPool = xykPoolsIndexedByInterimAssetPair.get(assetId);

  if (!assetXykPool || !assetXykPool.accountId) return;

  const interimAssetId =
    assetXykPool.assetAId === asset.id
      ? assetXykPool.assetBId
      : assetXykPool.assetAId;

  let xykPoolHistData = ctx.batchState.state.xykPoolAllHistoricalData.get(
    `${assetXykPool.accountId}-${blockHeader.height}`
  );

  if (!xykPoolHistData) {
    xykPoolHistData = await ensureXykpoolHisDataFromLatestPersistedData({
      ctx,
      poolId: assetXykPool.accountId,
      blockNumber: blockHeader.height,
    });
    if (!xykPoolHistData) {
      console.log(
        `processXykInvolvedAssetSpotPrices :: xykPoolHistData is not found - ${assetXykPool.accountId}-${blockHeader.height}`
      );
      return;
    }
  }

  // Fetch assets from cache
  const assetA = ctx.batchState.state.assetsAll.get(xykPoolHistData.assetAId);
  const assetB = ctx.batchState.state.assetsAll.get(xykPoolHistData.assetBId);

  if (!assetA?.decimals || !assetB?.decimals) return;

  const assetABalanceNormalised = fromExponentialToDecimalNotation(
    xykPoolHistData.assetABalance.toString(),
    assetA.decimals
  );
  const assetBBalanceNormalised = fromExponentialToDecimalNotation(
    xykPoolHistData.assetBBalance.toString(),
    assetB.decimals
  );

  const priceInInterimAssetNormalised =
    assetXykPool.assetAId === assetId
      ? assetBBalanceNormalised.div(assetABalanceNormalised)
      : assetABalanceNormalised.div(assetBBalanceNormalised);

  const calcAssetSpotPrices = async () => {
    for (const assetOutId of ctx.appConfig.ASSET_SPOT_PRICE_ASSET_OUT_IDS) {
      const assetOut = await getOrCreateAsset({
        assetRegistryId: assetOutId,
        ctx,
        blockHeader,
        ensure: true,
      });
      if (
        !assetOut ||
        !asset.decimals ||
        asset.assetRegistryId === undefined ||
        asset.assetRegistryId === null
      )
        continue;

      const interimAssetSpotPrice =
        ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
          `${interimAssetId}-${assetOutId}-${blockHeader.height}`
        );

      if (!interimAssetSpotPrice) continue;

      const xykAssetSpotPrice = priceInInterimAssetNormalised.multipliedBy(
        interimAssetSpotPrice.priceNormalised
      );

      if (
        !xykAssetSpotPrice ||
        !xykAssetSpotPrice.isFinite() ||
        xykAssetSpotPrice.isNaN()
      ) {
        console.log(
          `Invalid price for asset ${asset.id} at block ${blockHeader.height}: ${xykAssetSpotPrice.toString()}. Skipping...`
        );
        continue;
      }

      const histDataItemId = `${asset.id}-${assetOutId}-${blockHeader.height}`;

      const blockData = ctx.batchState.getParaBlockFromCacheByHeight(
        blockHeader.height
      );
      if (!blockData) {
        throw new Error(
          `Block not found in cache for height ${blockHeader.height}`
        );
      }

      const decoratedRoute = getPriceRouteDecorated([
        {
          pool: PoolType.XYK,
          poolAddress: assetXykPool.accountId,
          assetIn: asset.assetRegistryId,
          assetOut: assetOut.assetRegistryId!,
        },
      ]);
      const priceRoute = getOrCreatePriceRoute(decoratedRoute, ctx);

      ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(
        histDataItemId,
        new AssetSpotPriceHistoricalData({
          id: histDataItemId,
          assetInId: asset.id,
          assetOutId: assetOut.id,
          price: BigInt(
            fromDecimalToExponentialNotation(
              xykAssetSpotPrice,
              18
              // assetOut.decimals!
            ).toFixed(0, BigNumber.ROUND_HALF_UP)
          ),

          priceNormalised: toFixedTrimmed(xykAssetSpotPrice),
          priceRoute,

          paraBlockHeight: blockHeader.height,
        })
      );
    }
  };

  await calcAssetSpotPrices();
}

export function getAssetsPairPrice({
  assetInId,
  assetOutId = appConfig.ASSET_PRICE_BASE_ASSET_ID,
  blockHeight,
  recursionExec = false,
  ctx,
}: {
  assetInId: string;
  assetOutId?: string;
  blockHeight: number;
  recursionExec?: boolean;
  ctx: SqdProcessorContext<Store>;
}) {
  if (
    assetInId === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID &&
    assetOutId === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID
  )
    return '1';

  const assetInEntity = ctx.batchState.state.assetsAll.get(assetInId);
  const assetOutEntity = ctx.batchState.state.assetsAll.get(assetOutId);
  let assetInIdEnsured = assetInId;
  let assetOutIdEnsured = assetOutId;

  if (
    assetInEntity &&
    assetInEntity.resourceType === AssetResourceType.Debt &&
    assetInEntity.underlyingAssetId
  ) {
    const underlyingAsset = ctx.batchState.state.assetsAll.get(
      assetInEntity.underlyingAssetId
    );
    assetInIdEnsured = underlyingAsset?.id ?? assetInId;
  }

  if (
    assetOutEntity &&
    assetOutEntity.resourceType === AssetResourceType.Debt &&
    assetOutEntity.underlyingAssetId
  ) {
    const underlyingAsset = ctx.batchState.state.assetsAll.get(
      assetOutEntity.underlyingAssetId
    );
    assetOutIdEnsured = underlyingAsset?.id ?? assetOutId;
  }

  if (assetOutIdEnsured === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID) {
    let price = ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
      `${assetInIdEnsured}-${assetOutIdEnsured}-${blockHeight}`
    )?.priceNormalised;

    if (price) return price;

    if (
      (recursionExec && !price) ||
      !assetInEntity ||
      (assetInEntity &&
        assetInEntity.resourceType !== AssetResourceType.aToken &&
        assetInEntity.resourceType !== AssetResourceType.Debt) ||
      (assetInEntity &&
        (assetInEntity.resourceType === AssetResourceType.aToken ||
          assetInEntity.resourceType === AssetResourceType.Debt) &&
        !assetInEntity.underlyingAssetId)
    ) {
      const lastPrice = getPreviousProtPriceFromCache({
        ctx,
        assetInId: assetInIdEnsured,
        assetOutId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
        currentBlockHeight: blockHeight,
      })?.priceNormalised;

      return lastPrice ?? null;
    }

    const underlyingAsset = ctx.batchState.state.assetsAll.get(
      assetInEntity.underlyingAssetId || assetInEntity.id
    );
    assetInIdEnsured = underlyingAsset?.id ?? assetInId;

    return getAssetsPairPrice({
      assetInId: assetInIdEnsured,
      assetOutId: assetOutIdEnsured,
      recursionExec: true,
      blockHeight,
      ctx,
    });
  }

  let assetInRefPrice =
    assetInIdEnsured !== ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID
      ? ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
          `${assetInIdEnsured}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${blockHeight}`
        )?.priceNormalised
      : '1';

  if (assetInRefPrice === undefined) {
    assetInRefPrice = getPreviousProtPriceFromCache({
      ctx,
      assetInId: assetInIdEnsured,
      assetOutId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
      currentBlockHeight: blockHeight,
    })?.priceNormalised;
  }

  let assetOutRefPrice =
    assetOutIdEnsured !== ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID
      ? ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
          `${assetOutIdEnsured}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${blockHeight}`
        )?.priceNormalised
      : '1';

  if (assetOutRefPrice === undefined) {
    assetOutRefPrice = getPreviousProtPriceFromCache({
      ctx,
      assetInId: assetOutIdEnsured,
      assetOutId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
      currentBlockHeight: blockHeight,
    })?.priceNormalised;
  }

  if (recursionExec && (!assetInRefPrice || !assetOutRefPrice)) {
    return null;
  }

  if (assetInRefPrice && assetOutRefPrice) {
    const price = BigNumber(assetInRefPrice).div(assetOutRefPrice);
    if (!price.isFinite() || price.isNaN()) {
      console.log(
        `Invalid pair price for ${assetInIdEnsured}/${assetOutIdEnsured} at block ${blockHeight}: ${price.toString()}. Skipping...`
      );
      return null;
    }
    return toFixedTrimmed(price);
  }

  if (
    !assetInRefPrice &&
    assetInEntity &&
    (assetInEntity.resourceType === AssetResourceType.aToken ||
      assetInEntity.resourceType === AssetResourceType.Debt) &&
    assetInEntity.underlyingAssetId
  ) {
    const underlyingAsset = ctx.batchState.state.assetsAll.get(
      assetInEntity.underlyingAssetId
    );
    assetInIdEnsured = underlyingAsset?.id ?? assetInId;
  }

  if (
    !assetOutRefPrice &&
    assetOutEntity &&
    (assetOutEntity.resourceType === AssetResourceType.aToken ||
      assetOutEntity.resourceType === AssetResourceType.Debt) &&
    assetOutEntity.underlyingAssetId
  ) {
    const underlyingAsset = ctx.batchState.state.assetsAll.get(
      assetOutEntity.underlyingAssetId
    );
    assetOutIdEnsured = underlyingAsset?.id ?? assetInId;
  }

  return getAssetsPairPrice({
    assetInId: assetInIdEnsured,
    assetOutId: assetOutIdEnsured,
    recursionExec: true,
    blockHeight,
    ctx,
  });
}

function getPreviousProtPriceFromCache({
  ctx,
  assetInId,
  assetOutId,
  currentBlockHeight,
  checkBatchCache = false,
}: {
  assetInId: string;
  assetOutId: string;
  currentBlockHeight: number;
  checkBatchCache?: boolean;
  ctx: SqdProcessorContext<Store>;
}) {
  let batchStatePrevEntity: AssetSpotPriceHistoricalData | null = null;

  if (checkBatchCache)
    for (const entity of Array.from(
      ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values()
    )) {
      if (
        entity.paraBlockHeight >= currentBlockHeight ||
        entity.assetInId !== assetInId ||
        entity.assetOutId !== assetOutId
      )
        continue;

      if (!batchStatePrevEntity) {
        batchStatePrevEntity = entity;
        continue;
      }
      if (batchStatePrevEntity.paraBlockHeight < entity.paraBlockHeight)
        batchStatePrevEntity = entity;
    }

  return (
    batchStatePrevEntity ??
    LatestProcessedDataCacheManager.getInstance().getLastAssetSpotPriceHistoricalDataItem(
      assetInId
    )
  );
}

async function processXykShareAssetSpotPrices({
  asset,
  assetHistData,
  originXykpool,
  blockHeader,
  ctx,
}: {
  asset: Asset;
  assetHistData: AssetHistoricalData;
  originXykpool?: Xykpool;
  ctx: SqdProcessorContext<Store>;
  blockHeader: BlockHeader;
}) {
  if (!originXykpool) {
    // console.log(
    //   `processXykShareAssetSpotPrices :: origin pool for share asset ${asset.id} is not provided`
    // );
    return;
  }

  let xykPoolHistData = ctx.batchState.state.xykPoolAllHistoricalData.get(
    `${originXykpool.accountId}-${blockHeader.height}`
  );

  if (!xykPoolHistData) {
    xykPoolHistData = await ensureXykpoolHisDataFromLatestPersistedData({
      ctx,
      poolId: originXykpool.accountId,
      blockNumber: blockHeader.height,
    });
    if (!xykPoolHistData) {
      console.log(
        `processXykShareAssetSpotPrices :: xykPoolHistData is not found - ${originXykpool.accountId}-${blockHeader.height}`
      );
      return;
    }
  }

  const assetA = await getOrCreateAsset({
    id: xykPoolHistData.assetAId,
    ensure: true,
    ctx,
    blockHeader,
  });
  if (!assetA)
    throw new Error(`Asset ${xykPoolHistData.assetAId} not found in DB!`);

  const assetB = await getOrCreateAsset({
    id: xykPoolHistData.assetBId,
    ensure: true,
    ctx,
    blockHeader,
  });
  if (!assetB)
    throw new Error(`Asset ${xykPoolHistData.assetBId} not found in DB!`);

  if (!assetA.decimals || !assetB.decimals) {
    // console.log(
    //   `processXykShareAssetSpotPrices :: historical data of origin pool for share asset ${asset.id} not found`
    // );
    return;
  }

  const calcAssetSpotPrices = async () => {
    for (const assetOutId of ctx.appConfig.ASSET_SPOT_PRICE_ASSET_OUT_IDS) {
      const assetOut = await getOrCreateAsset({
        assetRegistryId: assetOutId,
        ctx,
        blockHeader,
        ensure: true,
      });
      if (!assetOut || !assetOut.decimals) continue;

      const poolAssetASpotPrice =
        ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
          `${originXykpool.assetAId}-${assetOutId}-${blockHeader.height}`
        )?.priceNormalised;

      if (!poolAssetASpotPrice || !BigNumber(poolAssetASpotPrice).isFinite())
        continue;

      const originPoolTvlInRefAssetNormalised =
        fromExponentialToDecimalNotation(
          xykPoolHistData.assetABalance.toString(),
          assetA.decimals!
        )
          .multipliedBy(poolAssetASpotPrice)
          .multipliedBy(2);

      let shareAssetDecimals = 0;
      try {
        shareAssetDecimals = getXykpoolShareTokenDecimals({
          poolAssets: [assetA, assetB],
        });
      } catch (e) {
        console.log(e);
      }

      if (!shareAssetDecimals) {
        console.log(
          `processXykShareAssetSpotPrices :: share asset decimals not found for pool ${originXykpool.accountId}`
        );
        return;
      }
      if (!assetHistData.totalIssuance) {
        console.log(
          `processXykShareAssetSpotPrices :: totalIssuance not found for asset ${assetHistData.assetId}`
        );
        return;
      }
      const shareAssetPriceNormalised = originPoolTvlInRefAssetNormalised.div(
        fromExponentialToDecimalNotation(
          assetHistData.totalIssuance.toString(),
          shareAssetDecimals
        )
      );

      if (
        !shareAssetPriceNormalised ||
        !shareAssetPriceNormalised.isFinite() ||
        shareAssetPriceNormalised.isNaN()
      ) {
        console.log(
          `Invalid share price for asset ${asset.id} at block ${blockHeader.height}: ${shareAssetPriceNormalised?.toString()}. Skipping...`
        );
        continue;
      }

      const histDataItemId = `${asset.id}-${assetOutId}-${blockHeader.height}`;

      // Empty route for XYK share assets
      const priceRoute = getOrCreatePriceRoute([], ctx);

      ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(
        histDataItemId,
        new AssetSpotPriceHistoricalData({
          id: histDataItemId,
          assetInId: asset.id,
          assetOutId: assetOut.id,
          price: BigInt(
            fromDecimalToExponentialNotation(
              shareAssetPriceNormalised,
              18
            ).toFixed(0, BigNumber.ROUND_HALF_UP)
          ),

          priceNormalised: toFixedTrimmed(shareAssetPriceNormalised),
          priceRoute,

          paraBlockHeight: blockHeader.height,
        })
      );
    }
  };

  await calcAssetSpotPrices();
}

export function getClosestSpotPrice({
  ctx,
  assetInId,
  currenParaBlockHeight,
}: {
  ctx: SqdProcessorContext<Store>;
  assetInId: string;
  currenParaBlockHeight: number;
}) {
  const assetSpotPricesList = Array.from(
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values()
  ).sort((a, b) => (a.paraBlockHeight > b.paraBlockHeight ? -1 : 1));

  return assetSpotPricesList.find(
    (p) =>
      p.assetInId === assetInId && p.paraBlockHeight < currenParaBlockHeight
  );
}
