import { BlockHeader } from '@subsquid/substrate-processor';
import {
  OmnipoolAssetState,
  OmnipoolAssetTradability,
  OmnipoolAssetWithDetails,
  OmnipoolGetAllAssetIdsInput,
  OmnipoolGetHubAssetTradabilityInput,
} from '../types/storage';
import { UnknownVersionError } from '../../utils/errors';
import { storage } from '../../typegenTypes/';

async function getOmnipoolAssetData(
  assetId: number,
  block: BlockHeader
): Promise<OmnipoolAssetState | null> {
  if (block.specVersion < 115) return null;

  if (storage.omnipool.assets.v115.is(block) || block.specVersion >= 115) {
    try {
      const resp = await storage.omnipool.assets.v115.get(block, assetId);
      return resp ?? null;
    } catch (e) {
      return null;
    }
  }

  throw new UnknownVersionError('storage.omnipool.assets');
}

async function getOmnipoolAssetsAll(
  block: BlockHeader
): Promise<OmnipoolAssetWithDetails[]> {
  let pairsPaged: OmnipoolAssetWithDetails[] = [];

  const assetStateFallback: OmnipoolAssetState = {
    hubReserve: BigInt(0),
    shares: BigInt(0),
    protocolShares: BigInt(0),
    cap: BigInt(0),
    tradable: { bits: 0 },
  };

  if (block.specVersion < 115) return [];

  if (storage.omnipool.assets.v115.is(block) || block.specVersion >= 115) {
    try {
      for await (let page of storage.omnipool.assets.v115.getPairsPaged(
        500,
        block
      ))
        pairsPaged.push(
          ...page
            .filter((p) => !!p)
            .map((pair) => ({
              assetId: pair[0],
              assetState: pair[1] ?? assetStateFallback,
            }))
        );
    } catch (e) {}
    return pairsPaged;
  }
  throw new UnknownVersionError('storage.omnipool.assets');
}

async function getOmnipoolAllAssetIds({
  block,
}: OmnipoolGetAllAssetIdsInput): Promise<number[]> {
  if (block.specVersion < 115) return [];

  if (storage.omnipool.assets.v115.is(block) || block.specVersion >= 115) {
    try {
      const resp = await storage.omnipool.assets.v115.getKeys(block);
      return resp;
    } catch (e) {
      return [];
    }
  }
  throw new UnknownVersionError('storage.omnipool.assets');
}

async function getOmnipoolHubAssetTradability({
  block,
}: OmnipoolGetHubAssetTradabilityInput): Promise<OmnipoolAssetTradability | null> {
  if (block.specVersion < 115) return null;

  if (storage.omnipool.assets.v115.is(block) || block.specVersion >= 115) {
    try {
      const resp = await storage.omnipool.hubAssetTradability.v115.get(block);
      return resp ?? null;
    } catch (e) {
      return null;
    }
  }
  throw new UnknownVersionError('storage.omnipool.hubAssetTradability');
}

export default {
  getOmnipoolAssetData,
  getOmnipoolAssetsAll,
  getOmnipoolAllAssetIds,
  getOmnipoolHubAssetTradability,
};
