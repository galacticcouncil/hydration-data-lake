import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  Asset,
  AssetHistoricalData,
  AssetSpotPriceHistoricalData,
  Xykpool,
} from '../../../model';
import { OfflineTradeRouterManager } from './utils';
import { getOrCreateAsset } from '../asset';
import { Hop, BigNumber } from '@galacticcouncil/sdk';
import {
  fromDecimalToExponentialNotation,
  fromExponentialToDecimalNotation,
  getPriceRouteDecorated,
} from '../../../utils/helpers';
import { LessThan } from 'typeorm';
import pMap from 'p-map';
import { PoolType } from './utils/offlineSdk/sdk/src';

export async function handleAssetSpotPricesHistoricalData({
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
    if (asset.assetRegistryId === undefined || asset.assetRegistryId === null)
      return;

    try {
      /**
       * USD price must be calculation based on DIA Oracle data
       */
      const usdPriceDetails = await router.getBestSpotPrice(
        asset.assetRegistryId,
        ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID
      );

      if (usdPriceDetails) {
        assetHistData.usdPriceNormalised = fromExponentialToDecimalNotation(
          usdPriceDetails.amount.toFixed(0, BigNumber.ROUND_HALF_UP),
          usdPriceDetails.decimals
        ).toFixed();
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
              price.amount.toFixed(0, BigNumber.ROUND_HALF_UP),
              price.decimals
            ).toFixed(),
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
  const concurrencyLimit = 1000;

  await pMap(
    Array.from(src.values()),
    async (item) => {
      if (
        await isAssetSpotPriceHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedRecords: src,
          ctx,
        })
      ) {
        result.push(item);
      }
    },
    { concurrency: concurrencyLimit }
  );

  // for (const item of src.values()) {
  //   if (
  //     await isAssetSpotPriceHistoricalDataUniqueRegardingPreviousRecord({
  //       currentRecord: item,
  //       cachedRecords: src,
  //       ctx,
  //     })
  //   )
  //     result.push(item);
  // }

  return result;
}

export async function isAssetSpotPriceHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedRecords,
  ctx,
}: {
  currentRecord: AssetSpotPriceHistoricalData;
  cachedRecords?: Map<string, AssetSpotPriceHistoricalData>;
  ctx: SqdProcessorContext<Store>;
}) {
  let previousItem = Array.from(
    (
      cachedRecords || ctx.batchState.state.assetsSpotPriceHistoricalDataBatch
    ).values()
  )
    .filter(
      (i) =>
        i.assetIn.id === currentRecord.assetIn.id &&
        i.assetOut.id === currentRecord.assetOut.id
    )
    .sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
    .find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(AssetSpotPriceHistoricalData, {
      where: {
        assetIn: {
          id: currentRecord.assetIn.id,
        },
        assetOut: {
          id: currentRecord.assetOut.id,
        },
        paraBlockHeight: LessThan(currentRecord.paraBlockHeight),
      },
      order: {
        paraBlockHeight: 'DESC',
      },
    });
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
    .map((pool): [Asset, Asset] => [pool.assetA, pool.assetB])
    .flat();

  const omnipoolInvolvedAssets = new Map<string, Asset>(
    Array.from(ctx.batchState.state.omnipoolAssets.values()).map(
      (pool): [string, Asset] => [pool.asset.id, pool.asset]
    )
  );
  const stableswapInvolvedAssets = new Map<string, Asset>(
    Array.from(ctx.batchState.state.stableswapAssetsAllBatch.values()).map(
      (pool): [string, Asset] => [pool.asset.id, pool.asset]
    )
  );

  return new Map<string, Asset>(
    xykInvolvedAssetsList
      .filter(
        (asset) =>
          !omnipoolInvolvedAssets.has(asset.id) &&
          !stableswapInvolvedAssets.has(asset.id)
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

  // const addedPoolAddresses = new Set<string>();
  //
  // const poolsWithInterimAsset = new Map(
  //   Array.from(ctx.batchState.state.xykAllBatchPools.values())
  //     .filter(
  //       (pool) =>
  //         (pool.assetA.id === interimAssetId &&
  //           xykPoolAssets.has(pool.assetB.id)) ||
  //         (pool.assetB.id === interimAssetId &&
  //           xykPoolAssets.has(pool.assetA.id))
  //     )
  //     .map((p) => {
  //       addedPoolAddresses.add(p.id);
  //       if (p.assetA.id === interimAssetId) return [p.assetB.id, p];
  //       return [p.assetA.id, p];
  //     })
  // );
  //
  // /**
  //  * We need find pools for fallback interim asset because some assets can have
  //  * no existing XYK pools with main interim asset.
  //  */
  // const poolsWithInterimFallbackAsset = new Map(
  //   Array.from(ctx.batchState.state.xykAllBatchPools.values())
  //     .filter(
  //       (pool) =>
  //         !addedPoolAddresses.has(pool.id) &&
  //         ((pool.assetA.id === interimFallbackAssetId &&
  //           xykPoolAssets.has(pool.assetB.id)) ||
  //           (pool.assetB.id === interimFallbackAssetId &&
  //             xykPoolAssets.has(pool.assetA.id)))
  //     )
  //     .map((p) => {
  //       if (p.assetA.id === interimFallbackAssetId) return [p.assetB.id, p];
  //       return [p.assetA.id, p];
  //     })
  // );

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
          block: assetHistData.block,
        })
      );
    }
  };

  await Promise.all([calcAssetUsdPriceNormalised(), calcAssetSpotPrices()]);
}
