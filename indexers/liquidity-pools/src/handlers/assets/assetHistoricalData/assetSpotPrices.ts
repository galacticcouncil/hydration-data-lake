import pMap from 'p-map';
import { LessThan } from 'typeorm';

import { BigNumber } from '@galacticcouncil/sdk';
import { BlockHeader } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import { AppConfig } from '../../../appConfig';
import {
  Asset,
  AssetHistoricalData,
  AssetSpotPriceHistoricalData,
  ResourceType,
  Xykpool,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import {
  fromDecimalToExponentialNotation,
  fromExponentialToDecimalNotation,
  getPriceRouteDecorated,
} from '../../../utils/helpers';
import {
  LatestProcessedDataCacheManager,
} from '../../../utils/latestProcessedDataCacheManager';
import { getOrCreateAsset } from '../asset';
import { OfflineTradeRouterManager } from './utils';
import { PoolType } from './utils/offlineSdk/sdk/src';

const appConfig = AppConfig.getInstance();

export async function handleAssetSpotPricesHistoricalDataAtBlock({
  blockHeader,
  ctx,
}: {
  blockHeader: BlockHeader;
  ctx: SqdProcessorContext<Store>;
}) {
  const blockContextAssetsHistoricalData = [
    ...ctx.batchState.state.assetsHistoricalDataBatch.values(),
  ].filter((histData) => histData.paraBlockHeight === blockHeader.height);

  const xykPoolAssets = getXykOnlyAssets(ctx);

  const xykOnlyAssetsHistData = [];
  const otherAssetsHistData = [];

  for (const histDataItem of blockContextAssetsHistoricalData) {
    if (xykPoolAssets.has(histDataItem.assetId)) {
      xykOnlyAssetsHistData.push(histDataItem);
    } else {
      otherAssetsHistData.push(histDataItem);
    }
  }

  // Process XYK pools indexed map once (shared across all XYK assets)
  const xykPoolsIndexedByInterimAssetPair = xykOnlyAssetsHistData.length > 0
    ? getXykPoolsIndexedByInterimAssetPair({ ctx, xykPoolAssets })
    : null;

  // Parallel processing of all spot prices
  await Promise.all([
    ...otherAssetsHistData.map((histDataItem) =>
      processAssetSpotPrices({
        assetId: histDataItem.assetId,
        assetHistData: histDataItem,
        blockHeader,
        ctx,
      })
    ),
    ...xykOnlyAssetsHistData.map((histDataItem) =>
      processXykInvolvedAssetSpotPrices({
        assetId: histDataItem.assetId,
        assetHistData: histDataItem,
        xykPoolsIndexedByInterimAssetPair: xykPoolsIndexedByInterimAssetPair!,
        blockHeader,
        ctx,
      })
    ),
  ]);
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

  if (!router) return;
  if (!assetId) return;

  const asset = await getOrCreateAsset({
    id: assetId,
    ctx,
    blockHeader,
    ensure: true,
  });
  if (!asset) {
    console.log(`Asset spot price calculation skipped for assetRegistryId ${assetId} at block ${blockHeader.height} due to missing asset.`)  
    return
  };

  const calcAssetUsdPriceNormalised = async () => {
    let assetIdToProcess = asset.assetRegistryId;

    if (asset.resourceType === ResourceType.Debt) {
      const underlyingAsset = asset.underlyingAssetId ? await getOrCreateAsset({assetRegistryId: asset.underlyingAssetId , blockHeader, ensure: true, ctx}) : null;
      assetIdToProcess = underlyingAsset?.assetRegistryId;
    }

    if (!assetIdToProcess) {
      console.log(`Asset spot price calculation skipped for asset ${asset.id} at block ${blockHeader.height} due to missing assetRegistryId.`);
      return
    };

    try {
      /**
       * USD price must be calculation based on DIA Oracle data
       */
      const usdPriceDetails = await router.getBestSpotPrice(
        assetIdToProcess,
        ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID
      );

      // console.log({usdPriceDetails})
      if (usdPriceDetails) {
        assetHistData.usdPriceNormalised = fromExponentialToDecimalNotation(
          usdPriceDetails.amount.toFixed(0, BigNumber.ROUND_HALF_UP),
          usdPriceDetails.decimals
        ).toFixed();

        ctx.batchState.state.assetsHistoricalDataBatch.set(
          assetHistData.id,
          assetHistData
        );
      }
    } catch (e) {}
  };

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

        const priceWithRoute = await router.getBestSpotPriceWitRoute(
          asset.assetRegistryId,
          assetOutId
        );

        // if (!price) continue;
        if (!priceWithRoute) continue;

        const { price, route } = priceWithRoute;

        const histDataItemId = `${asset.id}-${assetOutId}-${blockHeader.height}`;

        const blockData = ctx.batchState.getParaBlockFromCacheByHeight(blockHeader.height);
        if (!blockData) {
          throw new Error(`Block not found in cache for height ${blockHeader.height}`);
        }

        ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(
          histDataItemId,
          new AssetSpotPriceHistoricalData({
            id: histDataItemId,
            assetInId: asset.id,
            assetOutId: assetOut.id,
            assetInAssetRegistryId: asset.assetRegistryId,
            assetOutAssetRegistryId: assetOut.assetRegistryId,
            assetInHistData: assetHistData,

            assetOutDecimals: price.decimals,
            price: BigInt(price.amount.toFixed(0, BigNumber.ROUND_HALF_UP)),

            priceNormalised: fromExponentialToDecimalNotation(
              price.amount.toFixed(0, BigNumber.ROUND_HALF_UP),
              price.decimals
            ).toFixed(),
            priceRoute: getPriceRouteDecorated(route),

            paraBlockHeight: blockHeader.height,
            relayBlockHeight: assetHistData.relayBlockHeight,
            blockId: blockData.id,
          })
        );
      } catch (e) {}
    }
  };

  await Promise.all([calcAssetUsdPriceNormalised(), calcAssetSpotPrices()]);
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
  // let previousItem = Array.from(
  //   (
  //     cachedRecords || ctx.batchState.state.assetsSpotPriceHistoricalDataBatch
  //   ).values()
  // )
  //   .filter(
  //     (i) =>
  //       i.assetIn.id === currentRecord.assetIn.id &&
  //       i.assetOut.id === currentRecord.assetOut.id
  //   )
  //   .sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
  //   .find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

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
        relations: {
          assetInHistData: true,
        },
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
    .map((pool): [Asset | undefined, Asset | undefined] => {
      const assetA = ctx.batchState.state.assetsAll.get(pool.assetAId);
      const assetB = ctx.batchState.state.assetsAll.get(pool.assetBId);
      return [assetA, assetB];
    })
    .flat()
    .filter((asset): asset is Asset => !!asset);

  const omnipoolInvolvedAssets = new Map<string, Asset>(
    Array.from(ctx.batchState.state.omnipoolAssets.values()).map(
      (pool): [string, Asset] => [pool.asset.id, pool.asset]
    )
  );
  const stableswapInvolvedAssets = new Map<string, Asset>(
    Array.from(ctx.batchState.state.stableswapAssets.values()).map(
      (pool): [string, Asset] => [pool.asset.id, pool.asset]
    )
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
      (pool.assetAId === interimAssetId &&
        xykPoolAssets.has(pool.assetBId)) ||
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
    assetRegistryId: assetId,
    ctx,
    blockHeader,
    ensure: true,
  });
  if (!asset) return;

  const assetXykPool = xykPoolsIndexedByInterimAssetPair.get(assetId);

  if (!assetXykPool || !assetXykPool.account) return;

  const interimAssetId =
    assetXykPool.assetAId === asset.id
      ? assetXykPool.assetBId
      : assetXykPool.assetAId;

  const xykPoolHistData = ctx.batchState.state.xykPoolAllHistoricalData.get(
    `${assetXykPool.account.id}-${blockHeader.height}`
  );
  if (!xykPoolHistData) return;

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

  const calcAssetUsdPriceNormalised = async () => {
    if (asset.assetRegistryId === undefined || asset.assetRegistryId === null)
      return;
    /**
     * USD price must be calculation based on DIA Oracle data
     */

    const interimAssetSpotPrice =
      ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
        `${interimAssetId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${blockHeader.height}`
      );
    if (!interimAssetSpotPrice) return;

    const xykAssetSpotPrice = priceInInterimAssetNormalised.multipliedBy(
      interimAssetSpotPrice.priceNormalised
    );

    if (xykAssetSpotPrice) {
      assetHistData.usdPriceNormalised = xykAssetSpotPrice.toFixed();
    }
  };

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

      const blockData = ctx.batchState.getParaBlockFromCacheByHeight(blockHeader.height);
      if (!blockData) {
        throw new Error(`Block not found in cache for height ${blockHeader.height}`);
      }

      ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(
        histDataItemId,
        new AssetSpotPriceHistoricalData({
          id: histDataItemId,
          assetInId: asset.id,
          assetOutId: assetOut.id,
          assetInAssetRegistryId: asset.assetRegistryId,
          assetOutAssetRegistryId: assetOut.assetRegistryId,
          assetInHistData: assetHistData,

          assetOutDecimals: assetOut.decimals!,
          price: BigInt(
            fromDecimalToExponentialNotation(
              xykAssetSpotPrice,
              assetOut.decimals!
            ).toFixed(0, BigNumber.ROUND_HALF_UP)
          ),

          priceNormalised: xykAssetSpotPrice.toFixed(
            6,
            BigNumber.ROUND_HALF_UP
          ),
          priceRoute: getPriceRouteDecorated([
            {
              pool: PoolType.XYK,
              poolAddress: assetXykPool.account.id,
              assetIn: asset.assetRegistryId,
              assetOut: assetOut.assetRegistryId!,
            },
          ]),

          paraBlockHeight: blockHeader.height,
          relayBlockHeight: assetHistData.relayBlockHeight,
          blockId: blockData.id,
        })
      );
    }
  };

  await Promise.all([calcAssetUsdPriceNormalised(), calcAssetSpotPrices()]);
}

export function getAssetsPairPrice({
  assetInId,
  assetOutId = appConfig.ASSET_PRICE_BASE_ASSET_ID,
  blockHeight,
  usePersistentData = false,
  ctx,
}: {
  assetInId: string;
  assetOutId?: string;
  blockHeight: number;
  usePersistentData?: boolean;
  ctx: SqdProcessorContext<Store>;
}) {
  if (assetOutId === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID) {
    const price = ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
      `${assetInId}-${assetOutId}-${blockHeight}`
    )?.priceNormalised;
    return price ?? null;
  }

  const assetInRefPrice =
    assetInId !== ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID
      ? ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
          `${assetInId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${blockHeight}`
        )?.priceNormalised
      : '1';

  const assetOutRefPrice =
    assetOutId !== ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID
      ? ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
          `${assetOutId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${blockHeight}`
        )?.priceNormalised
      : '1';

  if (!assetInRefPrice || !assetOutRefPrice) return null;

  return BigNumber(assetInRefPrice).div(assetOutRefPrice).toFixed();
}
