import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { HsmCollateralAddedData } from '../../../../../parsers/batchBlocksParser/types';
import { getOrCreateHsmCollateral } from './hsmCollateral';
import { handleHsmCollateralConfigHistoricalDataEntity } from './historicalData';

export async function handleCollateralAddedEvent({
  ctx,
  eventCallData,
}: {
  ctx: SqdProcessorContext<Store>;
  eventCallData: HsmCollateralAddedData;
}) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const {
    assetId,
    poolId,
    purchaseFee,
    maxBuyPriceCoefficient,
    buyBackFee,
    buybackRate,
  } = eventParams;

  const collateralData = {
    collateralAssetId: assetId,
    poolId,
    purchaseFee,
    maxBuyPriceCoefficient,
    buybackRate,
    buyBackFee,
  };

  await getOrCreateHsmCollateral({
    assetRegistryId: `${assetId}`,
    collateralData,
    ctx,
    blockHeader: eventMetadata.blockHeader,
  });

  await handleHsmCollateralConfigHistoricalDataEntity({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    fullStorageData: collateralData,
  });
}
