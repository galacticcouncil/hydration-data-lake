import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  Asset,
  AssetHistoricalData,
  AssetSpotPriceHistoricalData,
  AssetType,
  ResourceType,
  Xykpool,
} from '../../../model';
import { OfflineTradeRouterManager } from './utils';
import { getOrCreateAsset } from '../asset';
import { BigNumber } from '@galacticcouncil/sdk';
import {
  fromDecimalToExponentialNotation,
  fromExponentialToDecimalNotation,
  getPriceRouteDecorated,
  getXykpoolShareTokenDecimals,
} from '../../../utils/helpers';
import { LessThan } from 'typeorm';
import pMap from 'p-map';
import { PoolType } from './utils/offlineSdk/sdk/src';
import { AppConfig } from '../../../appConfig';
import { LatestProcessedDataCacheManager } from '../../../utils/latestProcessedDataCacheManager';

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
  const xykShareAssetsHistData = [];

  for (const histDataItem of blockContextAssetsHistoricalData) {
    if (histDataItem.asset.assetType === AssetType.XYK) {
      xykShareAssetsHistData.push(histDataItem);
      continue;
    }

    if (xykPoolAssets.has(histDataItem.asset.id)) {
      xykOnlyAssetsHistData.push(histDataItem);
    } else {
      otherAssetsHistData.push(histDataItem);
    }
  }

  for (const histDataItem of otherAssetsHistData) {
    await processAssetSpotPrices({
      asset: histDataItem.asset,
      assetHistData: histDataItem,
      blockHeader,
      ctx,
    });
  }

  for (const histDataItem of xykOnlyAssetsHistData) {
    await processXykInvolvedAssetSpotPrices({
      asset: histDataItem.asset,
      assetHistData: histDataItem,
      xykPoolsIndexedByInterimAssetPair: getXykPoolsIndexedByInterimAssetPair({
        ctx,
        xykPoolAssets,
      }),
      blockHeader,
      ctx,
    });
  }

  const xykPoolsIndexedByShareAsset = getXykPoolsIndexedByShareAsset({ ctx });

  for (const histDataItem of xykShareAssetsHistData) {
    await processXykShareAssetSpotPrices({
      asset: histDataItem.asset,
      assetHistData: histDataItem,
      originXykpool: xykPoolsIndexedByShareAsset.get(histDataItem.asset.id),
      blockHeader,
      ctx,
    });
  }
}

async function processAssetSpotPrices({
  asset,
  assetHistData,
  blockHeader,
  ctx,
}: {
  asset: Asset;
  assetHistData: AssetHistoricalData;
  ctx: SqdProcessorContext<Store>;
  blockHeader: BlockHeader;
}) {
  const router = OfflineTradeRouterManager.getInstance().getRouterForBlock(
    blockHeader.height
  );

  if (!router) return;

  const calcAssetUsdPriceNormalised = async () => {
    let assetIdToProcess = asset.assetRegistryId;

    if (asset.resourceType === ResourceType.Debt) {
      const underliningAsset = asset.underlyingAsset;
      assetIdToProcess = underliningAsset?.assetRegistryId;
    }

    if (assetIdToProcess === undefined || assetIdToProcess === null) return;

    try {
      /**
       * USD price must be calculation based on DIA Oracle data
       */
      const usdPriceDetails = await router.getBestSpotPrice(
        assetIdToProcess,
        ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID
      );

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

        ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(
          histDataItemId,
          new AssetSpotPriceHistoricalData({
            id: histDataItemId,
            assetIn: asset,
            assetOut,
            assetInAssetRegistryId: asset.assetRegistryId,
            assetOutAssetRegistryId: assetOut.assetRegistryId,
            assetInHistData: assetHistData,

            assetOutDecimals: price.decimals,
            price: BigInt(price.amount.toFixed(0, BigNumber.ROUND_HALF_UP)),

            priceNormalised: fromExponentialToDecimalNotation(
              price.amount.toFixed(18, BigNumber.ROUND_HALF_UP),
              price.decimals
            ).toFixed(18, BigNumber.ROUND_HALF_UP),
            priceRoute: getPriceRouteDecorated(route),

            paraBlockHeight: blockHeader.height,
            relayBlockHeight: assetHistData.relayBlockHeight,
            block: assetHistData.block,
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
    if (!assetSportPriceHistoryIndexByAsset.has(i.assetIn.id)) {
      assetSportPriceHistoryIndexByAsset.set(i.assetIn.id, []);
    }
    assetSportPriceHistoryIndexByAsset.get(i.assetIn.id)!.push(i);
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
    cachedIndexedRecords.get(currentRecord.assetIn.id) || []
  ).find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.storeUtils.findOneWithLogs(
      AssetSpotPriceHistoricalData,
      {
        where: {
          assetIn: {
            id: currentRecord.assetIn.id,
          },
          assetOut: {
            id: currentRecord.assetOut.id,
          },
          paraBlockHeight: LessThan(currentRecord.paraBlockHeight),
        },
        relations: {
          assetIn: true,
          assetOut: true,
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
    .filter((pool) => !pool.isDestroyed)
    .map((pool): [Asset, Asset] => [pool.assetA, pool.assetB])
    .flat();

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
      (pool.assetA.id === interimAssetId &&
        xykPoolAssets.has(pool.assetB.id)) ||
      (pool.assetB.id === interimAssetId && xykPoolAssets.has(pool.assetA.id))
    ) {
      if (pool.assetA.id === interimAssetId) pools.set(pool.assetB.id, pool);
      pools.set(pool.assetA.id, pool);
    } else if (
      (pool.assetA.id === interimFallbackAssetId &&
        xykPoolAssets.has(pool.assetB.id)) ||
      (pool.assetB.id === interimFallbackAssetId &&
        xykPoolAssets.has(pool.assetA.id))
    ) {
      if (pool.assetA.id === interimFallbackAssetId)
        pools.set(pool.assetB.id, pool);
      pools.set(pool.assetA.id, pool);
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
    if (!pool?.shareToken?.id) continue;

    pools.set(pool.shareToken.id, pool);
  }

  return pools;
}

async function processXykInvolvedAssetSpotPrices({
  asset,
  // interimAsset,
  assetHistData,
  xykPoolsIndexedByInterimAssetPair,
  blockHeader,
  ctx,
}: {
  asset: Asset;
  // interimAsset: Asset;
  assetHistData: AssetHistoricalData;
  xykPoolsIndexedByInterimAssetPair: Map<string, Xykpool>;
  ctx: SqdProcessorContext<Store>;
  blockHeader: BlockHeader;
}) {
  const assetXykPool = xykPoolsIndexedByInterimAssetPair.get(asset.id);

  if (!assetXykPool || !assetXykPool.account) return;

  const interimAsset =
    assetXykPool.assetA.id === asset.id
      ? assetXykPool.assetB
      : assetXykPool.assetA;

  const xykPoolHistData = ctx.batchState.state.xykPoolAllHistoricalData.get(
    `${assetXykPool.account.id}-${blockHeader.height}`
  );
  if (
    !xykPoolHistData ||
    !xykPoolHistData.assetA.decimals ||
    !xykPoolHistData.assetB.decimals
  )
    return;

  const assetABalanceNormalised = fromExponentialToDecimalNotation(
    xykPoolHistData.assetABalance.toString(),
    xykPoolHistData.assetA.decimals
  );
  const assetBBalanceNormalised = fromExponentialToDecimalNotation(
    xykPoolHistData.assetBBalance.toString(),
    xykPoolHistData.assetB.decimals
  );

  const priceInInterimAssetNormalised =
    assetXykPool.assetA.id === asset.id
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
        `${interimAsset.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${blockHeader.height}`
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
          `${interimAsset.id}-${assetOutId}-${blockHeader.height}`
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

      ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(
        histDataItemId,
        new AssetSpotPriceHistoricalData({
          id: histDataItemId,
          assetIn: asset,
          assetOut,
          assetInAssetRegistryId: asset.assetRegistryId,
          assetOutAssetRegistryId: assetOut.assetRegistryId,
          assetInHistData: assetHistData,

          assetOutDecimals: assetOut.decimals!,
          price: BigInt(
            fromDecimalToExponentialNotation(
              xykAssetSpotPrice,
              // assetOut.decimals!
              18
            ).toFixed(0, BigNumber.ROUND_HALF_UP)
          ),

          priceNormalised: xykAssetSpotPrice.toFixed(
            18,
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
          block: assetHistData.block,
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
  if (
    assetInId === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID &&
    assetOutId === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID
  )
    return '1';

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

  const xykPoolHistData = ctx.batchState.state.xykPoolAllHistoricalData.get(
    `${originXykpool.account.id}-${blockHeader.height}`
  );
  if (
    !xykPoolHistData ||
    !xykPoolHistData.assetA.decimals ||
    !xykPoolHistData.assetB.decimals
  ) {
    // console.log(
    //   `processXykShareAssetSpotPrices :: historical data of origin pool for share asset ${asset.id} not found`
    // );
    return;
  }

  const calcAssetUsdPriceNormalised = async () => {
    const assetPriceBaseAsst = await getOrCreateAsset({
      assetRegistryId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
      ctx,
      blockHeader,
      ensure: true,
    });
    if (!assetPriceBaseAsst) return;
    const poolAssetASpotPrice =
      ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
        `${originXykpool.assetA.id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${blockHeader.height}`
      )?.priceNormalised;

    if (!poolAssetASpotPrice) return;

    const originPoolTvlInRefAssetNormalised = fromExponentialToDecimalNotation(
      xykPoolHistData.assetABalance.toString(),
      originXykpool.assetA.decimals!
    )
      .multipliedBy(poolAssetASpotPrice)
      .multipliedBy(2);

    let shareAssetDecimals = 0;

    try {
      shareAssetDecimals = getXykpoolShareTokenDecimals({
        poolAssets: [originXykpool.assetA, originXykpool.assetB],
      });
    } catch (e) {
      console.log(e);
    }

    if (!shareAssetDecimals) return;

    const shareAssetPriceNormalised = originPoolTvlInRefAssetNormalised.div(
      fromExponentialToDecimalNotation(
        assetHistData.totalIssuance.toString(),
        shareAssetDecimals
      )
    );

    assetHistData.usdPriceNormalised = shareAssetPriceNormalised.toFixed();

    ctx.batchState.state.assetsHistoricalDataBatch.set(
      assetHistData.id,
      assetHistData
    );
  };

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
          `${originXykpool.assetA.id}-${assetOutId}-${blockHeader.height}`
        )?.priceNormalised;

      if (!poolAssetASpotPrice) continue;

      const originPoolTvlInRefAssetNormalised =
        fromExponentialToDecimalNotation(
          xykPoolHistData.assetABalance.toString(),
          originXykpool.assetA.decimals!
        )
          .multipliedBy(poolAssetASpotPrice)
          .multipliedBy(2);

      let shareAssetDecimals = 0;
      try {
        shareAssetDecimals = getXykpoolShareTokenDecimals({
          poolAssets: [originXykpool.assetA, originXykpool.assetB],
        });
      } catch (e) {
        console.log(e);
      }

      if (!shareAssetDecimals) return;

      const shareAssetPriceNormalised = originPoolTvlInRefAssetNormalised.div(
        fromExponentialToDecimalNotation(
          assetHistData.totalIssuance.toString(),
          shareAssetDecimals
        )
      );
      const histDataItemId = `${asset.id}-${assetOutId}-${blockHeader.height}`;

      ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(
        histDataItemId,
        new AssetSpotPriceHistoricalData({
          id: histDataItemId,
          assetIn: asset,
          assetOut,
          assetInAssetRegistryId: asset.assetRegistryId,
          assetOutAssetRegistryId: assetOut.assetRegistryId,
          assetInHistData: assetHistData,

          assetOutDecimals: assetOut.decimals,
          price: BigInt(
            fromDecimalToExponentialNotation(
              shareAssetPriceNormalised,
              // assetOut.decimals
              18
            ).toFixed(0, BigNumber.ROUND_HALF_UP)
          ),

          priceNormalised: shareAssetPriceNormalised.toFixed(
            18,
            BigNumber.ROUND_HALF_UP
          ),
          priceRoute: [],

          paraBlockHeight: blockHeader.height,
          relayBlockHeight: assetHistData.relayBlockHeight,
          block: assetHistData.block,
        })
      );
    }
  };

  await Promise.all([calcAssetUsdPriceNormalised(), calcAssetSpotPrices()]);
}
