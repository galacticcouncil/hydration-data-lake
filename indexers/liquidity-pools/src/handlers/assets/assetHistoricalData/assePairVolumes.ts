import { BlockHeader } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';

import {
  AssetAssetsPairVolume,
  AssetHistoricalData,
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
import { getAssetsPairPrice } from './assetSpotPrices';
import { BigNumber, toFixedTrimmed } from '../../../utils/bignumber';

export async function handleAssetPairVolumesHistoricalDataAtBlock({
  blockHeader,
  assetsHistoricalDataBatchIndexedByBlockAndAssetId,
  ctx,
}: {
  blockHeader: BlockHeader;
  assetsHistoricalDataBatchIndexedByBlockAndAssetId: Map<
    number,
    Map<string, AssetHistoricalData>
  >;
  ctx: SqdProcessorContext<Store>;
}) {
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
    const blockContextRoutedTrades = Array.from(
      ctx.batchState.state.routeTrades.values()
    ).filter((trade) => trade.paraBlockHeight === blockHeader.height);

    for (const trade of blockContextRoutedTrades) {
      swapGroupsToProcess.push(trade.swaps);
    }
  } else {
    const blockContextSwaps = Array.from(
      ctx.batchState.state.swaps.values()
    ).filter((trade) => trade.paraBlockHeight === blockHeader.height);

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

    const assetInSpotPrice = getAssetsPairPrice({
      ctx,
      assetInId: assetInInfo.id,
      blockHeight: blockHeader.height,
    });

    const assetOutSpotPrice = getAssetsPairPrice({
      ctx,
      assetInId: assetOutInfo.id,
      blockHeight: blockHeader.height,
    });

    if (!assetInSpotPrice || !assetOutSpotPrice) continue assetsPairLoop;

    const existingPairVolEntity =
      ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.get(
        `${assetInInfo.id}-${assetOutInfo.id}-${blockHeader.height}`
      ) ||
      ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.get(
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
      assetRegistryBId: assetBRegistryId?.toString(),

      assetAVolume,
      assetBVolume,
      totalVolumeNormalised: toFixedTrimmed(
        currentTotalVolumeNormalised.plus(
          existingPairVolEntity?.totalVolumeNormalised ?? '0'
        )
      ),

      paraBlockHeight: blockHeader.height,
    });

    ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.set(
      assetsPairVolumeEntity.id,
      assetsPairVolumeEntity
    );

    const assetsHistoricalDataEntities: Array<AssetHistoricalData> = [
      assetsHistoricalDataBatchIndexedByBlockAndAssetId
        ?.get(blockHeader.height)
        ?.get(assetInInfo.id),
      assetsHistoricalDataBatchIndexedByBlockAndAssetId
        ?.get(blockHeader.height)
        ?.get(assetOutInfo.id),
    ].filter((item) => !!item);

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
