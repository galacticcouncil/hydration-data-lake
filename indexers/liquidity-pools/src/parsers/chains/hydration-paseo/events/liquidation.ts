import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import { UnknownVersionError } from '../../../../utils/errors';
import { LiquidationLiquidatedEventParams } from '../../../types/events';

function parseLiquidationLiquidatedParams(
  event: SqdEvent
): LiquidationLiquidatedEventParams {
  if (events.liquidation.liquidated.v287.is(event)) {
    const parsedParams = events.liquidation.liquidated.v287.decode(event);

    return {
      userEvmAddress: parsedParams.evmAddress,
      collateralAssetRegistryId: parsedParams.collateralAsset.toString(),
      debtAssetRegistryId: parsedParams.debtAsset.toString(),
      profit: parsedParams.profit,
    };
  }
  if (events.liquidation.liquidated.v314.is(event)) {
    const parsedParams = events.liquidation.liquidated.v314.decode(event);

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
