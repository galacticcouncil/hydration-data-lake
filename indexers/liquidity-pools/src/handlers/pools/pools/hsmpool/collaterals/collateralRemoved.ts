import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  HsmCollateralRemovedData,
  StableswapPoolCreatedData,
} from '../../../../../parsers/batchBlocksParser/types';
import { getOrCreateHsmCollateral } from './hsmCollateral';

export async function handleCollateralRemovedEvent({
  ctx,
  eventCallData,
}: {
  ctx: SqdProcessorContext<Store>;
  eventCallData: HsmCollateralRemovedData;
}) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const collateral = await getOrCreateHsmCollateral({
    assetRegistryId: `${eventParams.assetId}`,
    ctx,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!collateral) {
    console.log(
      `handleCollateralRemovedEvent :: Collateral ${eventParams.assetId} not found`
    );
    return;
  }

  collateral.isRemoved = true;

  await ctx.store.upsert(collateral);
  ctx.batchState.state.hsmCollaterals.set(collateral.id, collateral);
}
