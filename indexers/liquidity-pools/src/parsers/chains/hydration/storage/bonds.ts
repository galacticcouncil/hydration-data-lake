import { storage } from '../typegenTypes/';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  BondDetails,
  GetBondByIdInput,
  GetBondsAllInput,
} from '../../../types/storage';
import {
  hexToStrWithNullCharCheck,
  tryExecOrReturnFallback,
} from '../../../../utils/helpers';
import { AssetType } from '../../../../model';

async function getBond({
  bondId,
  block,
}: GetBondByIdInput): Promise<BondDetails | null> {
  if (block.specVersion < 176) return null;
  if (storage.bonds.bonds.v176.is(block)) {
    const resp = await storage.bonds.bonds.v176.get(block, bondId);
    if (!resp) return null;
    return {
      bondId,
      underlyingAsset: resp[0],
      maturity: resp[1],
    };
  }

  throw new UnknownVersionError('storage.bonds.bonds');
}

async function getBondsAll({
  block,
}: GetBondsAllInput): Promise<BondDetails[]> {
  if (block.specVersion < 176) return [];

  if (storage.bonds.bonds.v176.is(block) || block.specVersion >= 176) {
    return tryExecOrReturnFallback(async () => {
      const pairsPaged = [];

      for await (const page of storage.bonds.bonds.v176.getPairsPaged(
        500,
        block
      ))
        pairsPaged.push(
          ...page
            .filter((p) => !!p && !!p[1])
            .map(([bondId, bondDetails]) => ({
              bondId,
              underlyingAsset: bondDetails![0],
              maturity: bondDetails![1],
            }))
        );
      return pairsPaged;
    }, []);
  }

  throw new UnknownVersionError('storage.bonds.bonds');
}

export default {
  getBond,
  getBondsAll,
};
