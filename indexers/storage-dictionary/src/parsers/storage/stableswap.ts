import { BlockHeader } from '@subsquid/substrate-processor';
import { StablepoolWithDetails, XykPoolWithAssets } from '../types/storage';
import { storage } from '../../typegenTypes/';
import { UnknownVersionError } from '../../utils/errors';

async function getPoolsAll(
  block: BlockHeader
): Promise<StablepoolWithDetails[]> {
  let pairsPaged: StablepoolWithDetails[] = [];

  if (block.specVersion < 183) return [];

  if (storage.stableswap.pools.v183.is(block)) {
    for await (let page of storage.stableswap.pools.v183.getPairsPaged(
      500,
      block
    ))
      pairsPaged.push(
        ...page
          .filter((p) => !!p)
          .map((pair) => ({
            poolId: pair[0],
            assetIds: pair[1]!.assets, // TODO fix types
            initialAmplification: pair[1]!.initialAmplification,
            finalAmplification: pair[1]!.finalAmplification,
            initialBlock: pair[1]!.initialBlock,
            finalBlock: pair[1]!.finalBlock,
            fee: pair[1]!.fee,
          }))
      );
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.stableswap.pools');
}

export default { getPoolsAll };
