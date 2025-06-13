import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  Asset,
  AssetHistoricalData,
  AssetSpotPriceHistoricalData,
} from '../../../model';
import { OfflineTradeRouterManager } from './utils';
import { getOrCreateAsset } from '../asset';
import { Hop, BigNumber } from '@galacticcouncil/sdk';
import {
  fromExponentialToDecimalNotation,
  isDeepEqual,
} from '../../../utils/helpers';
import { LessThan } from 'typeorm';
import blockHash from 'object-hash';
import pMap from 'p-map';
import { isAssetHistoricalDataUniqueRegardingPreviousRecord } from './assetHistoricalData';

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

  // await Promise.all(
  //   blockContextAssetsHistoricalData.map((histDataItem) =>
  //     processAssetSpotPrices({
  //       asset: histDataItem.asset,
  //       assetHistData: histDataItem,
  //       blockHeader,
  //       ctx,
  //     })
  //   )
  // );

  for (const histDataItem of blockContextAssetsHistoricalData) {
    await processAssetSpotPrices({
      asset: histDataItem.asset,
      assetHistData: histDataItem,
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
    if (asset.assetRegistryId !== undefined && asset.assetRegistryId !== null) {
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
    }
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

        const getPriceRouteDecorated = (route: Hop[]): string[][] => {
          return route.map((hop) => [
            hop.poolAddress,
            hop.pool,
            hop.assetIn,
            hop.assetOut,
          ]);
        };

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
    .sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
    .find(
      (i) =>
        i.paraBlockHeight < currentRecord.paraBlockHeight &&
        i.assetIn.id === currentRecord.assetIn.id &&
        i.assetOut.id === currentRecord.assetOut.id
    );

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

  // const overwriteProps = {
  //   paraBlockHeight: null,
  //   relayBlockHeight: null,
  //   assetInHistData: null,
  //   assetIn: null,
  //   assetOut: null,
  //   id: null,
  //   block: null,
  // };
  //
  // const prevItemDecorated = {
  //   ...previousItem,
  //   ...overwriteProps,
  // };
  //
  // const currentItemDecorated = {
  //   ...currentRecord,
  //   ...overwriteProps,
  // };
  //
  // return !isDeepEqual(prevItemDecorated, currentItemDecorated);

  let isEqual = true;

  if (previousItem.price !== currentRecord.price) {
    isEqual = false;
  }
  return !isEqual;
}
