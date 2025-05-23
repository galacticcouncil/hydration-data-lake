import { BlockHeader } from '@subsquid/substrate-processor';
import {
  XykGetPoolShareTokenPairsManyInput,
  XykPoolShareTokenPair,
  XykPoolWithAssets,
} from '../types/storage';
import { storage } from '../../typegenTypes/';
import { UnknownVersionError } from '../../utils/errors';

async function getAllPoolsWithAssets(
  block: BlockHeader
): Promise<XykPoolWithAssets[]> {
  let pairsPaged: XykPoolWithAssets[] = [];

  if (block.specVersion < 183) return [];

  if (storage.xyk.poolAssets.v183.is(block)) {
    for await (let page of storage.xyk.poolAssets.v183.getPairsPaged(
      100,
      block
    ))
      pairsPaged.push(
        ...page
          .filter((p) => !!p)
          .map((pair) => ({
            poolAddress: pair[0],
            assetAId: pair[1]![0], // TODO fix types
            assetBId: pair[1]![1], // TODO fix types
          }))
      );
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.omnipool.assets');
}

async function getPoolShareTokenAll({
  block,
}: XykGetPoolShareTokenPairsManyInput): Promise<XykPoolShareTokenPair[]> {
  if (block.specVersion < 183) return [];

  if (storage.xyk.shareToken.v183.is(block)) {
    const pairsPaged = [];

    for await (const page of storage.xyk.shareToken.v183.getPairsPaged(
      500,
      block
    )) {
      pairsPaged.push(
        ...page
          .filter((p) => !!p && !!p[1])
          .map(
            ([poolId, shareTokenId]): XykPoolShareTokenPair => ({
              poolId,
              shareTokenId: shareTokenId!,
            })
          )
      );
    }
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.xyk.shareToken');
}

export default { getAllPoolsWithAssets, getPoolShareTokenAll };
