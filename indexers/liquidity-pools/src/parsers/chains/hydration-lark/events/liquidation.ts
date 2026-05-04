import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import { UnknownVersionError } from '../../../../utils/errors';
import { LiquidationLiquidatedEventParams } from '../../../types/events';

function parseLiquidationLiquidatedParams(
  event: SqdEvent
): LiquidationLiquidatedEventParams {
  if (events.liquidation.liquidated.v405.is(event)) {
    const parsedParams = events.liquidation.liquidated.v405.decode(event);

    return {
      userEvmAddress: parsedParams.user,
      collateralAssetRegistryId: parsedParams.collateralAsset.toString(),
      debtAssetRegistryId: parsedParams.debtAsset.toString(),
      profit: parsedParams.profit,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseLiquidationLiquidatedParams,
};
