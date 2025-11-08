import { BlockHeader } from '@subsquid/substrate-processor';

import { AssetType } from '../../../../model';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  hexToStrWithNullCharCheck,
  splitIntoBatches,
  tryExecOrReturnFallback,
} from '../../../../utils/helpers';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';
import {
  AssetRegistryAssetLocation,
  AssetRegistryLocationWithAssetId,
} from '../../../types/events';
import {
  AssetDetails,
  AssetDetailsWithId,
  AssetExistentialDeposit,
  Erc20AssetContractDetails,
  GetAssetLocationDataInput,
  GetAssetLocationsDataManyInput,
  GetDataAtBlockInput,
} from '../../../types/storage';
import { storage } from '../typegenTypes/';
import { getErc20AssetContractFromLocation } from '../utils';

async function getAsset(
  assetId: string | number,
  block: BlockHeader
): Promise<AssetDetails | null> {
  return measureStorageFetch({
    storageName: 'assetRegistry.assets',
    originFn: 'getAsset',
    blockHeight: block.height,
    args: { assetId },
    fn: async () => {
      if (block.specVersion < 108) return null;

      if (storage.assetRegistry.assets.v108.is(block)) {
        const resp = await storage.assetRegistry.assets.v108.get(
          block,
          +assetId
        );
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
        const resp = await storage.assetRegistry.assets.v160.get(
          block,
          +assetId
        );
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
        const resp = await storage.assetRegistry.assets.v176.get(
          block,
          +assetId
        );
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
        const resp = await storage.assetRegistry.assets.v222.get(
          block,
          +assetId
        );
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
        const resp = await storage.assetRegistry.assets.v264.get(
          block,
          +assetId
        );

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
    },
  });
}

async function getAssetMany(
  assetIds: Array<string | number>,
  block: BlockHeader
): Promise<Array<AssetDetailsWithId>> {
  return measureStorageFetch({
    storageName: 'assetRegistry.assets',
    originFn: 'getAssetMany',
    blockHeight: block.height,
    args: { assetIds },
    fn: async () => {
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
    },
  });
}

async function getAssetsExistentialDepositAll({
  block,
}: GetDataAtBlockInput): Promise<Array<AssetExistentialDeposit>> {
  return measureStorageFetch({
    storageName: 'assetRegistry.assets',
    originFn: 'getAssetsExistentialDepositAll',
    blockHeight: block.height,
    fn: async () => {
      const allAssetsData = await getAssetAll(block);

      return allAssetsData
        .filter((a) => !!a.data)
        .map((asset) => ({
          assetId: `${asset.assetId}`,
          existentialDeposit: asset.data!.existentialDeposit,
        }));
    },
  });
}

async function getAssetAll(
  block: BlockHeader
): Promise<Array<AssetDetailsWithId>> {
  return measureStorageFetch({
    storageName: 'assetRegistry.assets',
    originFn: 'getAssetAll',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 108) return [];

      if (storage.assetRegistry.assets.v108.is(block)) {
        const pairsPaged = [];

        for await (const page of storage.assetRegistry.assets.v108.getPairsPaged(
          500,
          block
        ))
          pairsPaged.push(
            ...page
              .filter((p) => !!p && !!p[1])
              .map(([assetId, assetData]) => ({
                assetId: +assetId,
                data: {
                  name: hexToStrWithNullCharCheck(assetData!.name),
                  assetType: assetData!.assetType.__kind as AssetType,
                  existentialDeposit: assetData!.existentialDeposit,
                  isSufficient: true,
                },
              }))
          );
        return pairsPaged;
      }

      if (storage.assetRegistry.assets.v160.is(block)) {
        const pairsPaged = [];

        for await (const page of storage.assetRegistry.assets.v160.getPairsPaged(
          500,
          block
        ))
          pairsPaged.push(
            ...page
              .filter((p) => !!p && !!p[1])
              .map(([assetId, assetData]) => ({
                assetId: +assetId,
                data: {
                  name: hexToStrWithNullCharCheck(assetData!.name),
                  assetType: assetData!.assetType.__kind as AssetType,
                  existentialDeposit: assetData!.existentialDeposit,
                  xcmRateLimit: assetData!.xcmRateLimit,
                  isSufficient: true,
                },
              }))
          );
        return pairsPaged;
      }

      if (storage.assetRegistry.assets.v176.is(block)) {
        const pairsPaged = [];

        for await (const page of storage.assetRegistry.assets.v176.getPairsPaged(
          500,
          block
        ))
          pairsPaged.push(
            ...page
              .filter((p) => !!p && !!p[1])
              .map(([assetId, assetData]) => ({
                assetId: +assetId,
                data: {
                  name: hexToStrWithNullCharCheck(assetData!.name),
                  assetType: assetData!.assetType.__kind as AssetType,
                  existentialDeposit: assetData!.existentialDeposit,
                  xcmRateLimit: assetData!.xcmRateLimit,
                  isSufficient: true,
                },
              }))
          );
        return pairsPaged;
      }

      if (storage.assetRegistry.assets.v222.is(block)) {
        const pairsPaged = [];

        for await (const page of storage.assetRegistry.assets.v222.getPairsPaged(
          500,
          block
        ))
          pairsPaged.push(
            ...page
              .filter((p) => !!p && !!p[1])
              .map(([assetId, assetData]) => ({
                assetId: +assetId,
                data: {
                  name: hexToStrWithNullCharCheck(assetData!.name),
                  assetType: assetData!.assetType.__kind as AssetType,
                  existentialDeposit: assetData!.existentialDeposit,
                  xcmRateLimit: assetData!.xcmRateLimit,
                  symbol: hexToStrWithNullCharCheck(assetData!.symbol),
                  decimals: assetData!.decimals,
                  isSufficient: true,
                },
              }))
          );
        return pairsPaged;
      }

      if (storage.assetRegistry.assets.v264.is(block)) {
        const pairsPaged = [];

        for await (const page of storage.assetRegistry.assets.v264.getPairsPaged(
          500,
          block
        ))
          pairsPaged.push(
            ...page
              .filter((p) => !!p && !!p[1])
              .map(([assetId, assetData]) => ({
                assetId: +assetId,
                data: {
                  name: hexToStrWithNullCharCheck(assetData!.name),
                  assetType: assetData!.assetType.__kind as AssetType,
                  existentialDeposit: assetData!.existentialDeposit,
                  xcmRateLimit: assetData!.xcmRateLimit,
                  symbol: hexToStrWithNullCharCheck(assetData!.symbol),
                  decimals: assetData!.decimals,
                  isSufficient: true,
                },
              }))
          );
        return pairsPaged;
      }

      throw new UnknownVersionError(
        'storage.assetRegistry.assets [getPairsPaged]'
      );
    },
  });
}

async function getErc20AssetContractAddress(
  assetId: string | number,
  block: BlockHeader
): Promise<Erc20AssetContractDetails | null> {
  return measureStorageFetch({
    storageName: 'assetRegistry.assets',
    originFn: 'getErc20AssetContractAddress',
    blockHeight: block.height,
    args: { assetId },
    fn: async () => {
      if (block.specVersion < 108) return null;

      if (storage.assetRegistry.assetLocations.v108.is(block)) {
        const resp = await storage.assetRegistry.assetLocations.v108.get(
          block,
          +assetId
        );
        return getErc20AssetContractFromLocation(resp);
      }

      if (storage.assetRegistry.assetLocations.v160.is(block)) {
        const resp = await storage.assetRegistry.assetLocations.v160.get(
          block,
          +assetId
        );
        return getErc20AssetContractFromLocation(resp);
      }

      if (storage.assetRegistry.assetLocations.v244.is(block)) {
        const resp = await storage.assetRegistry.assetLocations.v244.get(
          block,
          +assetId
        );
        return getErc20AssetContractFromLocation(resp);
      }

      throw new UnknownVersionError('storage.assetRegistry.assetLocations');
    },
  });
}

async function getAssetLocation({
  assetId,
  block,
}: GetAssetLocationDataInput): Promise<AssetRegistryAssetLocation | null> {
  return measureStorageFetch({
    storageName: 'assetRegistry.assets',
    originFn: 'getAssetLocation',
    blockHeight: block.height,
    args: { assetId },
    fn: async () => {
      if (block.specVersion < 108) return null;

      if (storage.assetRegistry.assetLocations.v108.is(block)) {
        const resp = await storage.assetRegistry.assetLocations.v108.get(
          block,
          +assetId
        );
        return resp ?? null;
      }

      if (storage.assetRegistry.assetLocations.v160.is(block)) {
        const resp = await storage.assetRegistry.assetLocations.v160.get(
          block,
          +assetId
        );
        return resp ?? null;
      }

      if (storage.assetRegistry.assetLocations.v244.is(block)) {
        const resp = await storage.assetRegistry.assetLocations.v244.get(
          block,
          +assetId
        );
        return resp ?? null;
      }

      throw new UnknownVersionError('storage.assetRegistry.assetLocations');
    },
  });
}

async function getAssetLocationsMany({
  assetIds,
  block,
}: GetAssetLocationsDataManyInput): Promise<
  AssetRegistryLocationWithAssetId[] | null
> {
  return measureStorageFetch({
    storageName: 'assetRegistry.assetLocations',
    originFn: 'getAssetLocationsMany',
    blockHeight: block.height,
    args: { assetIds },
    fn: async () => {
      if (block.specVersion < 108) return null;

      const idsDecorated = assetIds.map((id) => +id);

      const responseMap: Map<number, AssetRegistryLocationWithAssetId> =
        new Map(
          assetIds.map((id) => [
            +id,
            {
              assetId: +id,
              location: null,
            },
          ])
        );

      for (const subBatch of splitIntoBatches(
        Array.from(responseMap.keys()),
        200
      )) {
        if (storage.assetRegistry.assetLocations.v108.is(block)) {
          await tryExecOrReturnFallback(async () => {
            const resp =
              await storage.assetRegistry.assetLocations.v108.getMany(
                block,
                idsDecorated
              );

            subBatch.forEach((assetId, index) => {
              if (resp[index]) {
                responseMap.set(assetId, {
                  assetId: assetId,
                  location: resp[index],
                });
              }
            });
          }, null);
          continue;
        }

        if (storage.assetRegistry.assetLocations.v160.is(block)) {
          await tryExecOrReturnFallback(async () => {
            const resp =
              await storage.assetRegistry.assetLocations.v160.getMany(
                block,
                idsDecorated
              );

            subBatch.forEach((assetId, index) => {
              if (resp[index]) {
                responseMap.set(assetId, {
                  assetId: assetId,
                  location: resp[index],
                });
              }
            });
          }, null);
          continue;
        }

        if (storage.assetRegistry.assetLocations.v244.is(block)) {
          await tryExecOrReturnFallback(async () => {
            const resp =
              await storage.assetRegistry.assetLocations.v244.getMany(
                block,
                idsDecorated
              );

            subBatch.forEach((assetId, index) => {
              if (resp[index]) {
                responseMap.set(assetId, {
                  assetId: assetId,
                  location: resp[index],
                });
              }
            });
          }, null);
          continue;
        }

        throw new UnknownVersionError('storage.assetRegistry.assetLocations');
      }

      return Array.from(responseMap.values());
    },
  });
}

export default {
  getAsset,
  getAssetMany,
  getErc20AssetContractAddress,
  getAssetAll,
  getAssetsExistentialDepositAll,
  getAssetLocation,
  getAssetLocationsMany,
};
