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
import { fromExponentialToDecimalNotation } from '../../../utils/helpers';

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

  await Promise.all(
    blockContextAssetsHistoricalData.map((histDataItem) =>
      processAssetSpotPrices({
        asset: histDataItem.asset,
        assetHistData: histDataItem,
        blockHeader,
        ctx,
      })
    )
  );

  // for (const histDataItem of blockContextAssetsHistoricalData) {
  //   await processAssetSpotPrices({
  //     asset: histDataItem.asset,
  //     assetHistData: histDataItem,
  //     blockHeader,
  //     ctx,
  //   });
  // }
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
        const [price, route] = await Promise.all([
          router.getBestSpotPrice(asset.assetRegistryId, assetOutId),
          router.getMostLiquidRoute(asset.assetRegistryId, assetOutId),
        ]);

        if (!price) continue;

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
