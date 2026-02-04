import { events } from '../typegenTypes';
import { SqdEvent } from '../../../../processor';
import {
  AssetRegistryLocationSetEventParams,
  AssetRegistryRegisteredEventParams,
  AssetRegistryUpdatedEventParams,
} from '../../../types/events';
import { hexToStrWithNullCharCheck } from '../../../../utils/helpers';
import { AssetType } from '../../../../model';
import { UnknownVersionError } from '../../../../utils/errors';

function parseRegisteredParams(
  event: SqdEvent
): AssetRegistryRegisteredEventParams {
  if (events.assetRegistry.registered.v347.is(event)) {
    const {
      assetId,
      assetType,
      assetName,
      existentialDeposit,
      isSufficient,
      symbol,
      xcmRateLimit,
      decimals,
    } = events.assetRegistry.registered.v347.decode(event);
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

function parseUpdatedParams(event: SqdEvent): AssetRegistryUpdatedEventParams {
  if (events.assetRegistry.updated.v347.is(event)) {
    const {
      assetId,
      assetType,
      assetName,
      existentialDeposit,
      isSufficient,
      symbol,
      xcmRateLimit,
      decimals,
    } = events.assetRegistry.updated.v347.decode(event);
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

function parseLocationSetParams(
  event: SqdEvent
): AssetRegistryLocationSetEventParams {
  if (events.assetRegistry.locationSet.v347.is(event)) {
    const { assetId, location } =
      events.assetRegistry.locationSet.v347.decode(event);
    return {
      assetId,
      location,
    };
  }
  if (events.assetRegistry.locationSet.v390.is(event)) {
    const { assetId, location } =
      events.assetRegistry.locationSet.v390.decode(event);
    return {
      assetId,
      // @ts-ignore
      location,
    };
  }

  throw new UnknownVersionError(event.name);
}

export default {
  parseRegisteredParams,
  parseUpdatedParams,
  parseLocationSetParams,
};
