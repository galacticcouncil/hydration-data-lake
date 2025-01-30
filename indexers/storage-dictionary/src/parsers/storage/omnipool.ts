import { BlockHeader } from '@subsquid/substrate-processor';
import { OmnipoolAssetState, OmnipoolAssetWithDetails } from '../types/storage';
import { UnknownVersionError } from '../../utils/errors';
import { storage } from '../../typegenTypes/';

async function getOmnipoolAssetData(
  assetId: number,
  block: BlockHeader
): Promise<OmnipoolAssetState | null> {
  if (block.specVersion < 115) return null;

  if (storage.omnipool.assets.v115.is(block)) {
    const resp = await storage.omnipool.assets.v115.get(block, assetId);
    return resp ?? null;
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

  if (storage.omnipool.assets.v115.is(block)) {
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
    return pairsPaged;
  }
  throw new UnknownVersionError('storage.omnipool.assets');
}

export default { getOmnipoolAssetData, getOmnipoolAssetsAll };
