import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import { AssetDetails, AssetDetailsWithId } from '../../../types/storage';
import { hexToStrWithNullCharCheck } from '../../../../utils/helpers';
import { AssetType } from '../../../../model';
import { UnknownVersionError } from '../../../../utils/errors';

async function getAsset(
  assetId: string | number,
  block: BlockHeader
): Promise<AssetDetails | null> {
  if (block.specVersion < 108) return null;

  if (storage.assetRegistry.assets.v108.is(block)) {
    const resp = await storage.assetRegistry.assets.v108.get(block, +assetId);
    return !resp
      ? null
      : {
          name: hexToStrWithNullCharCheck(resp.name),
          assetType: resp.assetType.__kind as AssetType,
          existentialDeposit: resp.existentialDeposit,
          isSufficient: true,
        };
  }

  if (storage.assetRegistry.assets.v160.is(block)) {
    const resp = await storage.assetRegistry.assets.v160.get(block, +assetId);
    return !resp
      ? null
      : {
          name: hexToStrWithNullCharCheck(resp.name),
          assetType: resp.assetType.__kind as AssetType,
          existentialDeposit: resp.existentialDeposit,
          xcmRateLimit: resp.xcmRateLimit,
          isSufficient: true,
        };
  }

  if (storage.assetRegistry.assets.v176.is(block)) {
    const resp = await storage.assetRegistry.assets.v176.get(block, +assetId);
    return !resp
      ? null
      : {
          name: hexToStrWithNullCharCheck(resp.name),
          assetType: resp.assetType.__kind as AssetType,
          existentialDeposit: resp.existentialDeposit,
          xcmRateLimit: resp.xcmRateLimit,
          isSufficient: true,
        };
  }

  if (storage.assetRegistry.assets.v222.is(block)) {
    const resp = await storage.assetRegistry.assets.v222.get(block, +assetId);
    return !resp
      ? null
      : {
          name: hexToStrWithNullCharCheck(resp.name),
          assetType: resp.assetType.__kind as AssetType,
          existentialDeposit: resp.existentialDeposit,
          xcmRateLimit: resp.xcmRateLimit,
          symbol: hexToStrWithNullCharCheck(resp.symbol),
          decimals: resp.decimals,
          isSufficient: resp.isSufficient,
        };
  }
  if (storage.assetRegistry.assets.v264.is(block)) {
    const resp = await storage.assetRegistry.assets.v264.get(block, +assetId);

    return !resp
      ? null
      : {
          name: hexToStrWithNullCharCheck(resp.name),
          assetType: resp.assetType.__kind as AssetType,
          existentialDeposit: resp.existentialDeposit,
          xcmRateLimit: resp.xcmRateLimit,
          symbol: hexToStrWithNullCharCheck(resp.symbol),
          decimals: resp.decimals,
          isSufficient: resp.isSufficient,
        };
  }

  throw new UnknownVersionError('storage.assetRegistry.assets');
}

async function getAssetMany(
  assetIds: Array<string | number>,
  block: BlockHeader
): Promise<Array<AssetDetailsWithId>> {
  if (block.specVersion < 108) return [];

  if (storage.assetRegistry.assets.v108.is(block)) {
    const resp = await storage.assetRegistry.assets.v108.getMany(
      block,
      assetIds.map((id) => +id)
    );
    if (!resp) return [];

    const decoratedResp: AssetDetailsWithId[] = [];
    assetIds.forEach((assetId, index) => {
      if (!resp[index]) {
        decoratedResp.push({ assetId: +assetId, data: null });
      } else {
        decoratedResp.push({
          assetId: +assetId,
          data: {
            name: hexToStrWithNullCharCheck(resp[index].name),
            assetType: resp[index].assetType.__kind as AssetType,
            existentialDeposit: resp[index].existentialDeposit,
            isSufficient: true,
          },
        });
      }
    });
    return decoratedResp;
  }

  if (storage.assetRegistry.assets.v160.is(block)) {
    const resp = await storage.assetRegistry.assets.v160.getMany(
      block,
      assetIds.map((id) => +id)
    );
    if (!resp) return [];

    const decoratedResp: AssetDetailsWithId[] = [];
    assetIds.forEach((assetId, index) => {
      if (!resp[index]) {
        decoratedResp.push({ assetId: +assetId, data: null });
      } else {
        decoratedResp.push({
          assetId: +assetId,
          data: {
            name: hexToStrWithNullCharCheck(resp[index].name),
            assetType: resp[index].assetType.__kind as AssetType,
            existentialDeposit: resp[index].existentialDeposit,
            xcmRateLimit: resp[index].xcmRateLimit,
            isSufficient: true,
          },
        });
      }
    });
    return decoratedResp;
  }

  if (storage.assetRegistry.assets.v176.is(block)) {
    const resp = await storage.assetRegistry.assets.v176.getMany(
      block,
      assetIds.map((id) => +id)
    );
    if (!resp) return [];

    const decoratedResp: AssetDetailsWithId[] = [];
    assetIds.forEach((assetId, index) => {
      if (!resp[index]) {
        decoratedResp.push({ assetId: +assetId, data: null });
      } else {
        decoratedResp.push({
          assetId: +assetId,
          data: {
            name: hexToStrWithNullCharCheck(resp[index].name),
            assetType: resp[index].assetType.__kind as AssetType,
            existentialDeposit: resp[index].existentialDeposit,
            xcmRateLimit: resp[index].xcmRateLimit,
            isSufficient: true,
          },
        });
      }
    });
    return decoratedResp;
  }

  if (storage.assetRegistry.assets.v222.is(block)) {
    const resp = await storage.assetRegistry.assets.v222.getMany(
      block,
      assetIds.map((id) => +id)
    );
    if (!resp) return [];

    const decoratedResp: AssetDetailsWithId[] = [];
    assetIds.forEach((assetId, index) => {
      if (!resp[index]) {
        decoratedResp.push({ assetId: +assetId, data: null });
      } else {
        decoratedResp.push({
          assetId: +assetId,
          data: {
            name: hexToStrWithNullCharCheck(resp[index].name),
            assetType: resp[index].assetType.__kind as AssetType,
            existentialDeposit: resp[index].existentialDeposit,
            xcmRateLimit: resp[index].xcmRateLimit,
            symbol: hexToStrWithNullCharCheck(resp[index].symbol),
            decimals: resp[index].decimals,
            isSufficient: resp[index].isSufficient,
          },
        });
      }
    });
    return decoratedResp;
  }

  if (storage.assetRegistry.assets.v264.is(block)) {
    const resp = await storage.assetRegistry.assets.v264.getMany(
      block,
      assetIds.map((id) => +id)
    );
    if (!resp) return [];

    const decoratedResp: AssetDetailsWithId[] = [];
    assetIds.forEach((assetId, index) => {
      if (!resp[index]) {
        decoratedResp.push({ assetId: +assetId, data: null });
      } else {
        decoratedResp.push({
          assetId: +assetId,
          data: {
            name: hexToStrWithNullCharCheck(resp[index].name),
            assetType: resp[index].assetType.__kind as AssetType,
            existentialDeposit: resp[index].existentialDeposit,
            xcmRateLimit: resp[index].xcmRateLimit,
            symbol: hexToStrWithNullCharCheck(resp[index].symbol),
            decimals: resp[index].decimals,
            isSufficient: resp[index].isSufficient,
          },
        });
      }
    });
    return decoratedResp;
  }

  throw new UnknownVersionError('storage.assetRegistry.assets');
}

export default { getAsset, getAssetMany };
