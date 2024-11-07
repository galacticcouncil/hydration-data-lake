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
  if (events.assetRegistry.registered.v108.is(event)) {
    const [assetId, assetName, assetType] =
      events.assetRegistry.registered.v108.decode(event);
    return {
      assetId,
      assetName: hexToStrWithNullCharCheck(assetName),
      assetType: assetType.__kind as AssetType,
      existentialDeposit: BigInt(0),
      isSufficient: true,
    };
  }

  if (events.assetRegistry.registered.v115.is(event)) {
    const { assetId, assetType, assetName } =
      events.assetRegistry.registered.v115.decode(event);
    return {
      assetId,
      assetName: hexToStrWithNullCharCheck(assetName),
      assetType: assetType.__kind as AssetType,
      existentialDeposit: BigInt(0),
      isSufficient: true,
    };
  }
  if (events.assetRegistry.registered.v176.is(event)) {
    const { assetId, assetType, assetName } =
      events.assetRegistry.registered.v176.decode(event);

    return {
      assetId,
      assetName: hexToStrWithNullCharCheck(assetName),
      assetType: assetType.__kind as AssetType,
      existentialDeposit: BigInt(0),
      isSufficient: true,
    };
  }
  if (events.assetRegistry.registered.v222.is(event)) {
    const {
      assetId,
      assetType,
      assetName,
      existentialDeposit,
      isSufficient,
      symbol,
      xcmRateLimit,
      decimals,
    } = events.assetRegistry.registered.v222.decode(event);
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
  if (events.assetRegistry.registered.v264.is(event)) {
    const {
      assetId,
      assetType,
      assetName,
      existentialDeposit,
      isSufficient,
      symbol,
      xcmRateLimit,
      decimals,
    } = events.assetRegistry.registered.v264.decode(event);
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
  if (events.assetRegistry.updated.v108.is(event)) {
    const [assetId, assetName, assetType] =
      events.assetRegistry.updated.v108.decode(event);
    return {
      assetId,
      assetName: hexToStrWithNullCharCheck(assetName),
      assetType: assetType.__kind as AssetType,
      existentialDeposit: BigInt(0),
      isSufficient: true,
    };
  }

  if (events.assetRegistry.updated.v115.is(event)) {
    const { assetId, assetType, assetName } =
      events.assetRegistry.updated.v115.decode(event);
    return {
      assetId,
      assetName: hexToStrWithNullCharCheck(assetName),
      assetType: assetType.__kind as AssetType,
      existentialDeposit: BigInt(0),
      isSufficient: true,
    };
  }

  if (events.assetRegistry.updated.v160.is(event)) {
    const { assetId, assetType, assetName, existentialDeposit, xcmRateLimit } =
      events.assetRegistry.updated.v160.decode(event);
    return {
      assetId,
      assetName: hexToStrWithNullCharCheck(assetName),
      assetType: assetType.__kind as AssetType,
      xcmRateLimit,
      existentialDeposit,
      isSufficient: true,
    };
  }
  if (events.assetRegistry.updated.v176.is(event)) {
    const { assetId, assetType, assetName, existentialDeposit, xcmRateLimit } =
      events.assetRegistry.updated.v176.decode(event);
    return {
      assetId,
      assetName: hexToStrWithNullCharCheck(assetName),
      assetType: assetType.__kind as AssetType,
      xcmRateLimit,
      existentialDeposit,
      isSufficient: true,
    };
  }
  if (events.assetRegistry.updated.v222.is(event)) {
    const {
      assetId,
      assetType,
      assetName,
      existentialDeposit,
      isSufficient,
      symbol,
      xcmRateLimit,
      decimals,
    } = events.assetRegistry.updated.v222.decode(event);
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
  if (events.assetRegistry.updated.v264.is(event)) {
    const {
      assetId,
      assetType,
      assetName,
      existentialDeposit,
      isSufficient,
      symbol,
      xcmRateLimit,
      decimals,
    } = events.assetRegistry.updated.v264.decode(event);
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
