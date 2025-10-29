import { Store } from '@subsquid/typeorm-store';
import { HsmCollateralData } from '../../../../../parsers/types/storage';
import { SqdBlock, SqdProcessorContext } from '../../../../../processor';
import { getOrCreateHsmCollateral } from './hsmCollateral';
import { HsmCollateralConfigHistoricalData } from '../../../../../model';
import { HsmCollateralUpdatedEventParams } from '../../../../../parsers/types/events';
import { getPreviousCollateralHistDataEntity } from './utils';

export async function handleHsmCollateralConfigHistoricalDataEntity({
  fullStorageData,
  updatedData,
  ctx,
  blockHeader,
}: {
  updatedData?: HsmCollateralUpdatedEventParams;
  fullStorageData?: HsmCollateralData;
  blockHeader: SqdBlock;
  ctx: SqdProcessorContext<Store>;
}) {
  const assetRegistryId = updatedData
    ? updatedData.assetId
    : fullStorageData?.collateralAssetId;

  if (assetRegistryId === undefined || assetRegistryId === null) {
    console.log(
      `handleHsmCollateralConfigHistoricalDataEntity :: assetId has not been provided`
    );
    return;
  }

  const collateral = await getOrCreateHsmCollateral({
    assetRegistryId: `${assetRegistryId}`,
    ctx,
    blockHeader,
    collateralData: fullStorageData ?? undefined,
  });

  if (!collateral) return;

  const block = ctx.batchState.getParaBlockFromCacheByHeight(
    blockHeader.height
  );

  if (!block) return;

  const collateralHistProps: Pick<
    HsmCollateralConfigHistoricalData,
    | 'purchaseFee'
    | 'maxBuyPriceCoefficient'
    | 'buybackRate'
    | 'buyBackFee'
    | 'maxInHolding'
  > = {
    purchaseFee: BigInt(0),
    maxBuyPriceCoefficient: BigInt(0),
    buybackRate: BigInt(0),
    buyBackFee: BigInt(0),
    maxInHolding: BigInt(0),
  };

  if (fullStorageData) {
    collateralHistProps.purchaseFee = BigInt(fullStorageData.purchaseFee);
    collateralHistProps.maxBuyPriceCoefficient =
      fullStorageData.maxBuyPriceCoefficient;
    collateralHistProps.buybackRate = BigInt(fullStorageData.buybackRate);
    collateralHistProps.buyBackFee = BigInt(fullStorageData.buyBackFee);
    collateralHistProps.maxInHolding = fullStorageData.maxInHolding
      ? BigInt(fullStorageData.maxInHolding)
      : BigInt(0);
  } else {
    const previousHistDataEntity = await getPreviousCollateralHistDataEntity({
      collateralId: collateral.id,
      blockHeight: blockHeader.height,
      ctx,
    });

    if (previousHistDataEntity) {
      collateralHistProps.purchaseFee = BigInt(
        updatedData?.purchaseFee ?? previousHistDataEntity.purchaseFee ?? 0n
      );
      collateralHistProps.maxBuyPriceCoefficient =
        previousHistDataEntity.maxBuyPriceCoefficient;

      collateralHistProps.buybackRate = BigInt(
        updatedData?.buybackRate ?? previousHistDataEntity.buybackRate ?? 0n
      );

      collateralHistProps.buyBackFee = BigInt(
        updatedData?.buyBackFee ?? previousHistDataEntity.buyBackFee ?? 0n
      );

      collateralHistProps.maxInHolding = previousHistDataEntity.maxInHolding;
    }
  }

  const histDataEntity = new HsmCollateralConfigHistoricalData({
    id: `${collateral.id}-${blockHeader.height}`,
    collateral,

    ...collateralHistProps,

    paraTimestamp: new Date(block.timestamp),
    relayBlockHeight: block.relayBlockHeight,
    paraBlockHeight: blockHeader.height,
    blockId: block.id,
  });

  ctx.batchState.state.hsmCollateralsConfigHistData.set(
    histDataEntity.id,
    histDataEntity
  );
}
