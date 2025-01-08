import { storage } from '../typegenTypes/';
import { XykGetAssetsInput, XykPoolWithAssets } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getPoolAssets({
  block,
  poolAddress,
}: XykGetAssetsInput): Promise<XykPoolWithAssets | null> {
  if (block.specVersion < 276) return null;

  if (storage.xyk.poolAssets.v276.is(block)) {
    const resp = await storage.xyk.poolAssets.v276.get(block, poolAddress);

    if (!resp) return null;

    const [assetAId, assetBId] = resp;

    return {
      assetAId,
      assetBId,
      poolAddress,
    };
  }

  throw new UnknownVersionError('storage.xyk.poolAssets');
}

export default { getPoolAssets };
