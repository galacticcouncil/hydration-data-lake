import { BlockHeader } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import {
  AssetAssetsPairVolume,
  AssetsPairVolumeHistoricalData,
  Swap,
  SwapAssetBalance,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import {
  fromExponentialToDecimalNotation,
  isUnifiedEventsSupportSpecVersion,
  stringToMd5Hash,
} from '../../../utils/helpers';
import { getOrCreateAsset } from '../asset';

// class RouterAssetPairs {
//   public pairsSet: Set<string> = new Set();
//
//   get pairsListEmpty() {
//     return this.pairsSet.size === 0;
//   }
//
//   async init(blockHeader: BlockHeader) {
//     const router = OfflineTradeRouterManager.getInstance().getRouterForBlock(
//       blockHeader.height
//     );
//
//     if (!router) {
//       console.log('handleAssetPairVolumesHistoricalDataAtBlock :: router not found');
//       return this;
//     }
//     const possiblePairs = [];
//     const allRouterAssets = await router.getAllAssets();
//
//     for (const assetA of allRouterAssets) {
//       try {
//         const pair = await router.getAssetPairs(assetA.id);
//         possiblePairs.push(pair.map((pa) => [assetA.id, pa.id]));
//       } catch (e) {}
//     }
//
//     for (const pair of possiblePairs.flat()) {
//       if (
//         this.pairsSet.has(`${pair[0]}-${pair[1]}`) ||
//         this.pairsSet.has(`${pair[1]}-${pair[0]}`)
//       )
//         continue;
//       this.pairsSet.add(`${pair[0]}-${pair[1]}`);
//     }
//     return this;
//   }
//
//   isPairTradable(assetA: string, assetB: string) {
//     return (
//       this.pairsSet.has(`${assetA}-${assetB}`) ||
//       this.pairsSet.has(`${assetB}-${assetA}`)
//     );
//   }
// }

export async function handleAssetPairVolumesHistoricalDataAtBlock({
  blockHeader,
  ctx,
}: {
  blockHeader: BlockHeader;
  ctx: SqdProcessorContext<Store>;
}) {
  // const routerAssetPairs = await new RouterAssetPairs().init(blockHeader);
  //
  // if (routerAssetPairs.pairsListEmpty) {
  //   console.log(`routerAssetPairs is empty on block ${blockHeader.height}`);
  //   return;
  // }

  const currentBlockEntity = ctx.batchState.getParaBlockFromCacheByHeight(
    blockHeader.height
  );

  const assetBalancePairs = [];
  const swapGroupsToProcess: Swap[][] = [];

  /**
   * In case blocks before OperationId has been released and indexer got an
   * opportunity to aggregate RoutedTrades based on it, we need to collect asset
   * pairs volumes from single swaps.
   */
  if (
    isUnifiedEventsSupportSpecVersion(
      blockHeader.specVersion,
      ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
    )
  ) {
    const blockContextRoutedTrades = [
      ...ctx.batchState.state.routeTrades.values(),
    ].filter((trade) => trade.paraBlockHeight === blockHeader.height);

    for (const trade of blockContextRoutedTrades) {
      swapGroupsToProcess.push(trade.swaps);
    }
  } else {
    const blockContextSwaps = [...ctx.batchState.state.swaps.values()].filter(
      (trade) => trade.paraBlockHeight === blockHeader.height
    );
    for (const swap of blockContextSwaps) {
      swapGroupsToProcess.push([swap]);
    }
  }
  for (const swapsGroup of swapGroupsToProcess) {
    assetBalancePairs.push(getRelatedAssetPairsFromSwapsChain(swapsGroup));
  }

  assetsPairLoop: for (const {
    in: assetInData,
    out: assetOutData,
  } of assetBalancePairs.flat()) {
    const [assetIn, assetOut] = await Promise.all([
      getOrCreateAsset({ ctx, id: assetInData.assetId }),
      getOrCreateAsset({ ctx, id: assetOutData.assetId }),
    ]);

    if (!assetIn) {
      console.log(
        `handleAssetPairVolumesHistoricalDataAtBlock :: AssetIn with id ${assetInData.assetId} cannot be found.`
      );
      continue assetsPairLoop;
    }
    if (!assetOut) {
      console.log(
        `handleAssetPairVolumesHistoricalDataAtBlock :: AssetOut with id ${assetOutData.assetId} cannot be found.`
      );
      continue assetsPairLoop;
    }

    const assetInInfo = {
      id: assetIn.id,
      assetRegistryId: assetIn.assetRegistryId,
      decimals: assetIn.decimals,
    };
    const assetOutInfo = {
      id: assetOut.id,
      assetRegistryId: assetOut.assetRegistryId,
      decimals: assetOut.decimals,
    };

    if (
      assetInInfo.assetRegistryId === undefined ||
      assetInInfo.assetRegistryId === null ||
      !assetInInfo.decimals ||
      assetOutInfo.assetRegistryId === undefined ||
      assetOutInfo.assetRegistryId === null ||
      !assetOutInfo.decimals
    )
      continue assetsPairLoop;

    // if (
    //   !routerAssetPairs.isPairTradable(
    //     assetInData.asset.assetRegistryId,
    //     assetOutData.asset.assetRegistryId
    //   )
    // ) {
    //   console.log(
    //     `Pair is not tradable: ${assetInData.asset.assetRegistryId}-${assetOutData.asset.assetRegistryId} on block ${blockHeader.height} `
    //   );
    //   continue assetsPairLoop;
    // }

    const assetInSpotPrice = getAssetSpotPriceFromHistoricalData({
      assetId: assetInInfo.id,
      blockHeader,
      ctx,
    });

    const assetOutSpotPrice = getAssetSpotPriceFromHistoricalData({
      assetId: assetOutInfo.id,
      blockHeader,
      ctx,
    });

    if (!assetInSpotPrice || !assetOutSpotPrice) continue assetsPairLoop;

    const existingPairVolEntity = [
      ...ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.values(),
    ].find(
      (item) =>
        item.id ===
          `${assetInInfo.id}-${assetOutInfo.id}-${blockHeader.height}` ||
        item.id ===
          `${assetOutInfo.id}-${assetInInfo.id}-${blockHeader.height}`
    );

    const assetsPairVolumeEntityId =
      existingPairVolEntity?.id ??
      `${assetInInfo.id}-${assetOutInfo.id}-${blockHeader.height}`;

    const currentTotalVolumeNormalised = fromExponentialToDecimalNotation(
      assetInData.amount.toString(),
      assetInInfo.decimals
    )
      .multipliedBy(assetInSpotPrice)
      .plus(
        fromExponentialToDecimalNotation(
          assetOutData.amount.toString(),
          assetOutInfo.decimals
        ).multipliedBy(assetOutSpotPrice)
      );

    let assetAId = assetInInfo.id;
    let assetARegistryId = assetInInfo.assetRegistryId;
    let assetBId = assetOutInfo.id;
    let assetBRegistryId = assetOutInfo.assetRegistryId;
    let assetAVolume = assetInData.amount;
    let assetBVolume = assetOutData.amount;

    if (existingPairVolEntity) {
      assetAId =
        existingPairVolEntity.assetAId === assetInInfo.id
          ? assetInInfo.id
          : assetOutInfo.id;
      assetARegistryId =
        existingPairVolEntity.assetAId === assetInInfo.id
          ? assetInInfo.assetRegistryId
          : assetOutInfo.assetRegistryId;

      assetBId =
        existingPairVolEntity.assetBId === assetOutInfo.id
          ? assetOutInfo.id
          : assetInInfo.id;
      assetBRegistryId =
        existingPairVolEntity.assetBId === assetOutInfo.id
          ? assetOutInfo.assetRegistryId
          : assetInInfo.assetRegistryId;

      assetAVolume =
        (existingPairVolEntity.assetAId === assetInInfo.id
          ? assetInData.amount
          : assetOutData.amount) + existingPairVolEntity.assetAVolume;
      assetBVolume =
        (existingPairVolEntity.assetBId === assetOutInfo.id
          ? assetOutData.amount
          : assetInData.amount) + existingPairVolEntity.assetBVolume;
    }

    if (!currentBlockEntity) {
      throw new Error(
        `Block not found in cache for height ${blockHeader.height}`
      );
    }

    const assetsPairVolumeEntity = new AssetsPairVolumeHistoricalData({
      id: assetsPairVolumeEntityId,

      assetAId: assetAId,
      assetRegistryAId: assetARegistryId?.toString(),

      assetBId: assetBId,
      assetRegistryBId: assetARegistryId?.toString(),

      assetAVolume,
      assetBVolume,
      totalVolumeNormalised: currentTotalVolumeNormalised
        .plus(existingPairVolEntity?.totalVolumeNormalised ?? '0')
        .toFixed(),

      paraBlockHeight: blockHeader.height,
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
        (item.assetId === assetInInfo.id ||
          item.assetId === assetOutInfo.id)
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

  // const assetPriceHisData =
  //   [...ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values()]
  //     .sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
  //     .find(
  //       (item) =>
  //         item.paraBlockHeight <= blockHeader.height &&
  //         item.assetIn.id === assetId &&
  //         item.assetOut.id === ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID
  //     )?.priceNormalised ?? null;

  // return assetPriceHisData;
}

function getRelatedAssetPairsFromSwapsChain(swaps: Swap[]) {
  const orderedSwaps = swaps.sort(
    (a, b) => a.event.indexInBlock - b.event.indexInBlock
  );

  const pairs: { in: SwapAssetBalance; out: SwapAssetBalance }[] = [];

  for (let cursorIndex = 0; cursorIndex < orderedSwaps.length; cursorIndex++) {
    const cursorSwap = orderedSwaps[cursorIndex];

    mainFlowLoop: for (let i = 0; i < orderedSwaps.length; i++) {
      if (i < cursorIndex) continue mainFlowLoop;

      if (cursorIndex === i) {
        pairs.push({ in: cursorSwap.inputs[0], out: cursorSwap.outputs[0] });
        continue mainFlowLoop;
      }

      // TODO solve situation when trade has more than one input and output asset
      pairs.push({ in: cursorSwap.inputs[0], out: orderedSwaps[i].outputs[0] });
    }
  }

  return pairs;
}
