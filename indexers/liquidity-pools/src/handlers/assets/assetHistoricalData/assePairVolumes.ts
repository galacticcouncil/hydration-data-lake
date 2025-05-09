import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BlockHeader } from '@subsquid/substrate-processor';
import {
  Asset,
  AssetAssetsPairVolume,
  AssetHistoricalData,
  AssetsPairVolumeHistoricalData,
  AssetSpotPriceHistoricalData,
} from '../../../model';
import { OfflineTradeRouterManager } from './utils';
import { getOrCreateAsset } from '../asset';
import { Hop, BigNumber } from '@galacticcouncil/sdk';
import {
  fromExponentialToDecimalNotation,
  stringToMd5Hash,
} from '../../../utils/helpers';

class RouterAssetPairs {
  private pairsSet: Set<string> = new Set();

  get pairsListEmpty() {
    return this.pairsSet.size === 0;
  }

  async init(blockHeader: BlockHeader) {
    const router = OfflineTradeRouterManager.getInstance().getRouterForBlock(
      blockHeader.height
    );

    if (!router) {
      console.log('handleAssetPairVolumesHistoricalData :: router not found');
      return this;
    }
    const possiblePairs = [];
    const allRouterAssets = await router.getAllAssets();

    for (const assetA of allRouterAssets) {
      try {
        const pair = await router.getAssetPairs(assetA.id);
        possiblePairs.push(pair.map((pa) => [assetA.id, pa.id]));
      } catch (e) {}
    }

    for (const pair of possiblePairs.flat()) {
      if (
        this.pairsSet.has(`${pair[0]}-${pair[1]}`) ||
        this.pairsSet.has(`${pair[1]}-${pair[0]}`)
      )
        continue;
      this.pairsSet.add(`${pair[0]}-${pair[1]}`);
    }
    return this;
  }

  isPairTradable(assetA: string, assetB: string) {
    return (
      this.pairsSet.has(`${assetA}-${assetB}`) ||
      this.pairsSet.has(`${assetB}-${assetA}`)
    );
  }
}

export async function handleAssetPairVolumesHistoricalData({
  blockHeader,
  ctx,
}: {
  blockHeader: BlockHeader;
  ctx: SqdProcessorContext<Store>;
}) {
  const blockContextRoutedTrades = [
    ...ctx.batchState.state.routeTrades.values(),
  ].filter((trade) => trade.paraBlockHeight === blockHeader.height);

  const routerAssetPairs = await new RouterAssetPairs().init(blockHeader);

  if (routerAssetPairs.pairsListEmpty) return;

  for (const trade of blockContextRoutedTrades) {
    // TODO solve situation when trade has more than one input and output asset
    const assetInData = trade.inputs[0];
    const assetOutData = trade.outputs[0];

    if (
      assetInData.asset.assetRegistryId === undefined ||
      assetInData.asset.assetRegistryId === null ||
      !assetInData.asset.decimals ||
      assetOutData.asset.assetRegistryId === undefined ||
      assetOutData.asset.assetRegistryId === null ||
      !assetOutData.asset.decimals
    )
      continue;

    if (
      !routerAssetPairs.isPairTradable(
        assetInData.asset.assetRegistryId,
        assetOutData.asset.assetRegistryId
      )
    )
      continue;

    const assetInSpotPrice = getAssetSpotPriceFromHistoricalData({
      assetId: assetInData.asset.id,
      blockHeader,
      ctx,
    });

    const assetOutSpotPrice = getAssetSpotPriceFromHistoricalData({
      assetId: assetOutData.asset.id,
      blockHeader,
      ctx,
    });

    if (!assetInSpotPrice || !assetOutSpotPrice) continue;

    const totalVolumeNormalised = fromExponentialToDecimalNotation(
      assetInData.amount.toString(),
      assetInData.asset.decimals
    )
      .multipliedBy(assetInSpotPrice)
      .plus(
        fromExponentialToDecimalNotation(
          assetOutData.amount.toString(),
          assetOutData.asset.decimals
        ).multipliedBy(assetOutSpotPrice)
      )
      .toFixed();

    const assetsPairVolumeEntity = new AssetsPairVolumeHistoricalData({
      id: `${assetInData.asset.id}-${assetOutData.asset.id}-${blockHeader.height}`,

      assetA: assetInData.asset,
      assetB: assetOutData.asset,

      assetAVolume: assetInData.amount,
      assetBVolume: assetOutData.amount,
      totalVolumeNormalised,

      paraBlockHeight: blockHeader.height,
      relayBlockHeight: trade.relayBlockHeight,
      block: trade.block,
    });

    ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.set(
      assetsPairVolumeEntity.id,
      assetsPairVolumeEntity
    );

    const assetsHistoricalDataEntities = [
      ...ctx.batchState.state.assetsHistoricalDataBatch.values(),
    ].filter(
      (item) =>
        item.paraBlockHeight === blockHeader.height &&
        (item.asset.assetRegistryId === assetInData.asset.assetRegistryId ||
          item.asset.assetRegistryId === assetOutData.asset.assetRegistryId)
    );

    for (const assetHisData of assetsHistoricalDataEntities) {
      const assetAssetsPairVolumeJunction = new AssetAssetsPairVolume({
        id: stringToMd5Hash(
          `${assetHisData.id}-${assetsPairVolumeEntity.id}-${blockHeader.height}`
        ),
        assetHistoricalData: assetHisData,
        assetsPairVolumeHistoricalData: assetsPairVolumeEntity,
        paraBlockHeight: blockHeader.height,
      });

      ctx.batchState.state.assetAssetsPairVolumesBatch.set(
        assetAssetsPairVolumeJunction.id,
        assetAssetsPairVolumeJunction
      );
    }
  }
}

function getAssetSpotPriceFromHistoricalData({
  assetId,
  blockHeader,
  ctx,
}: {
  assetId: string;
  blockHeader: BlockHeader;
  ctx: SqdProcessorContext<Store>;
}) {
  if (assetId === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID) return '1';

  return (
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
      `${assetId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${blockHeader.height}`
    )?.priceNormalised ?? null
  );
}
