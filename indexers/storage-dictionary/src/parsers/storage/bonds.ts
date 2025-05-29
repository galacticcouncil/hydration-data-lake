import { storage } from '../../typegenTypes/';
import {
  BondDetails,
  GetBondByIdInput,
  GetBondsAllInput,
} from '../types/storage';
import { UnknownVersionError } from '../../utils/errors';

async function getBond({
  bondId,
  block,
}: GetBondByIdInput): Promise<BondDetails | null> {
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

  if (storage.bonds.bonds.v176.is(block)) {
    const pairsPaged = [];

    for await (const page of storage.bonds.bonds.v176.getPairsPaged(500, block)) {
      pairsPaged.push(
        ...page
          .filter((p) => !!p && !!p[1])
          .map(([bondId, bondDetails]) => ({
            bondId,
            underlyingAsset: bondDetails![0],
            maturity: bondDetails![1],
          }))
      );
    }
    return pairsPaged;
  }

  throw new UnknownVersionError('storage.bonds.bonds');
}

export default {
  getBond,
  getBondsAll,
};
