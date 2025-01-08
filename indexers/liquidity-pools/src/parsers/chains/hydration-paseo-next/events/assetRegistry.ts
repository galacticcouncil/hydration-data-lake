import { events } from '../typegenTypes';
import { Event } from '../../../../processor';
import {
  AssetRegistryRegisteredEventParams,
  AssetRegistryUpdatedEventParams,
} from '../../../types/events';
import { hexToStrWithNullCharCheck } from '../../../../utils/helpers';
import { AssetType } from '../../../../model';
import { UnknownVersionError } from '../../../../utils/errors';

function parseRegisteredParams(
  event: Event
): AssetRegistryRegisteredEventParams {
  if (events.assetRegistry.registered.v276.is(event)) {
    const {
      assetId,
      assetType,
      assetName,
      existentialDeposit,
      isSufficient,
      symbol,
      xcmRateLimit,
      decimals,
    } = events.assetRegistry.registered.v276.decode(event);
    return {
      assetId,
      assetType: assetType.__kind as AssetType,
      assetName: hexToStrWithNullCharCheck(assetName),
      existentialDeposit,
      isSufficient,
      symbol: hexToStrWithNullCharCheck(symbol),
      xcmRateLimit,
      decimals,
    };
  }

  throw new UnknownVersionError(event.name);
}

function parseUpdatedParams(event: Event): AssetRegistryUpdatedEventParams {
  if (events.assetRegistry.updated.v276.is(event)) {
    const {
      assetId,
      assetType,
      assetName,
      existentialDeposit,
      isSufficient,
      symbol,
      xcmRateLimit,
      decimals,
    } = events.assetRegistry.updated.v276.decode(event);
    return {
      assetId,
      assetType: assetType.__kind as AssetType,
      assetName: hexToStrWithNullCharCheck(assetName),
      existentialDeposit,
      isSufficient,
      symbol: hexToStrWithNullCharCheck(symbol),
      xcmRateLimit,
      decimals,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default { parseRegisteredParams, parseUpdatedParams };
