import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../../typegenTypes/';
import {
  AssetDetails,
  AssetDetailsWithId,
  OmnipoolAssetState,
  OmnipoolAssetWithDetails,
} from '../types/storage';
import { hexToStrWithNullCharCheck } from '../../utils/helpers';
import { AssetType } from '../../model';
import { UnknownVersionError } from '../../utils/errors';

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

async function getAssetsAll(block: BlockHeader): Promise<AssetDetailsWithId[]> {
  let pairsPaged: AssetDetailsWithId[] = [];

  if (block.specVersion < 108) return [];

  if (storage.assetRegistry.assets.v108.is(block)) {
    for await (let page of storage.assetRegistry.assets.v108.getPairsPaged(
      500,
      block
    ))
      pairsPaged.push(
        ...page
          .filter((p) => !!p && !!p[1])
          .map((pair) => ({
            assetId: pair[0],
            data: {
              name: hexToStrWithNullCharCheck(pair[1]!.name),
              assetType: pair[1]!.assetType.__kind as AssetType,
              existentialDeposit: pair[1]!.existentialDeposit,
              isSufficient: true,
            },
          }))
      );
    return pairsPaged;
  }
  if (storage.assetRegistry.assets.v160.is(block)) {
    for await (let page of storage.assetRegistry.assets.v160.getPairsPaged(
      500,
      block
    ))
      pairsPaged.push(
        ...page
          .filter((p) => !!p && !!p[1])
          .map((pair) => ({
            assetId: pair[0],
            data: {
              name: hexToStrWithNullCharCheck(pair[1]!.name),
              assetType: pair[1]!.assetType.__kind as AssetType,
              existentialDeposit: pair[1]!.existentialDeposit,
              xcmRateLimit: pair[1]!.xcmRateLimit,
              isSufficient: true,
            },
          }))
      );
    return pairsPaged;
  }
  if (storage.assetRegistry.assets.v176.is(block)) {
    for await (let page of storage.assetRegistry.assets.v176.getPairsPaged(
      500,
      block
    ))
      pairsPaged.push(
        ...page
          .filter((p) => !!p && !!p[1])
          .map((pair) => ({
            assetId: pair[0],
            data: {
              name: hexToStrWithNullCharCheck(pair[1]!.name),
              assetType: pair[1]!.assetType.__kind as AssetType,
              existentialDeposit: pair[1]!.existentialDeposit,
              xcmRateLimit: pair[1]!.xcmRateLimit,
              isSufficient: true,
            },
          }))
      );
    return pairsPaged;
  }
  if (storage.assetRegistry.assets.v222.is(block)) {
    for await (let page of storage.assetRegistry.assets.v222.getPairsPaged(
      500,
      block
    ))
      pairsPaged.push(
        ...page
          .filter((p) => !!p && !!p[1])
          .map((pair) => ({
            assetId: pair[0],
            data: {
              name: hexToStrWithNullCharCheck(pair[1]!.name),
              assetType: pair[1]!.assetType.__kind as AssetType,
              existentialDeposit: pair[1]!.existentialDeposit,
              xcmRateLimit: pair[1]!.xcmRateLimit,
              symbol: hexToStrWithNullCharCheck(pair[1]!.symbol),
              decimals: pair[1]!.decimals,
              isSufficient: pair[1]!.isSufficient,
            },
          }))
      );
    return pairsPaged;
  }
  if (storage.assetRegistry.assets.v264.is(block)) {
    for await (let page of storage.assetRegistry.assets.v264.getPairsPaged(
      500,
      block
    ))
      pairsPaged.push(
        ...page
          .filter((p) => !!p && !!p[1])
          .map((pair) => ({
            assetId: pair[0],
            data: {
              name: hexToStrWithNullCharCheck(pair[1]!.name),
              assetType: pair[1]!.assetType.__kind as AssetType,
              existentialDeposit: pair[1]!.existentialDeposit,
              xcmRateLimit: pair[1]!.xcmRateLimit,
              symbol: hexToStrWithNullCharCheck(pair[1]!.symbol),
              decimals: pair[1]!.decimals,
              isSufficient: pair[1]!.isSufficient,
            },
          }))
      );
    return pairsPaged;
  }
  throw new UnknownVersionError('storage.assetRegistry.assets');
}

export default { getAsset, getAssetMany, getAssetsAll };
