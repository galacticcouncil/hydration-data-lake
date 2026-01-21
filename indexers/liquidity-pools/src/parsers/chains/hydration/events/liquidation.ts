import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import { UnknownVersionError } from '../../../../utils/errors';
import { LiquidationLiquidatedEventParams } from '../../../types/events';

function parseLiquidationLiquidatedParams(
  event: SqdEvent
): LiquidationLiquidatedEventParams {
  if (events.liquidation.liquidated.v276.is(event)) {
    const parsedParams = events.liquidation.liquidated.v276.decode(event);

    return {
      userEvmAddress: parsedParams.evmAddress,
      collateralAssetRegistryId: parsedParams.collateralAsset.toString(),
      debtAssetRegistryId: parsedParams.debtAsset.toString(),
      profit: parsedParams.profit,
    };
  }
  if (events.liquidation.liquidated.v313.is(event)) {
    const parsedParams = events.liquidation.liquidated.v313.decode(event);

    return {
      userEvmAddress: parsedParams.user,
      collateralAssetRegistryId: parsedParams.collateralAsset.toString(),
      debtAssetRegistryId: parsedParams.debtAsset.toString(),
      profit: parsedParams.profit,
    };
  }
  if (events.liquidation.liquidated.v378.is(event)) {
    const parsedParams = events.liquidation.liquidated.v378.decode(event);

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
