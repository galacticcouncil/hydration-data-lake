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

export async function handleSpotPricesIntoAssetsHistoricalData({
  blockHeader,
  ctx,
}: {
  blockHeader: BlockHeader;
  ctx: SqdProcessorContext<Store>;
}) {
  const blockContextAssetsHistoricalData = [
    ...ctx.batchState.state.assetsHistoricalDataBatch.values(),
  ].filter((histData) => histData.paraBlockHeight === blockHeader.height);

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
      const price = await router.getBestSpotPrice(
        asset.assetRegistryId,
        assetOutId
      );
      const route = await router.getMostLiquidRoute(
        asset.assetRegistryId,
        assetOutId
      );

      if (!price) continue;

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
          price: price.amount.toFixed(),
          routerLog: JSON.stringify(route),
          paraBlockHeight: blockHeader.height,
          relayBlockHeight: assetHistData.relayBlockHeight,
        })
      );
    } catch (e) {}
  }
}
