import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { HsmCollateralUpdatedData } from '../../../../../parsers/batchBlocksParser/types';
import { handleHsmCollateralConfigHistoricalDataEntity } from './historicalData';

export async function handleCollateralUpdatedEvent({
  ctx,
  eventCallData,
}: {
  ctx: SqdProcessorContext<Store>;
  eventCallData: HsmCollateralUpdatedData;
}) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const { assetId, purchaseFee, buyBackFee, buybackRate } = eventParams;

  await handleHsmCollateralConfigHistoricalDataEntity({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    updatedData: {
      assetId,
      purchaseFee,
      buyBackFee,
      buybackRate,
    },
  });
}
