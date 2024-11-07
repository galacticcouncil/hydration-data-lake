import { storage } from '../typegenTypes/';
import {
  OmnipoolAssetData,
  OmnipoolGetAssetDataInput,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getOmnipoolAssetData({
  assetId,
  block,
}: OmnipoolGetAssetDataInput): Promise<OmnipoolAssetData | null> {
  if (storage.omnipool.assets.v257.is(block)) {
    const resp = await storage.omnipool.assets.v257.get(block, assetId);
    return resp ?? null;
  }

  throw new UnknownVersionError('storage.omnipool.assets');
}

export default { getOmnipoolAssetData };
