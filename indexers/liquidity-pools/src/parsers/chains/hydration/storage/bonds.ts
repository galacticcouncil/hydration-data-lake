import { storage } from '../typegenTypes/';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  BondDetails,
  GetBondByIdInput,
  GetBondsAllInput,
} from '../../../types/storage';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

async function getBond({
  bondId,
  block,
}: GetBondByIdInput): Promise<BondDetails | null> {
  return measureStorageFetch({
    storageName: 'bonds.bonds',
    originFn: 'getBond',
    blockHeight: block.height,
    args: { bondId },
    fn: async () => {
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
    },
  });
}

async function getBondsAll({
  block,
}: GetBondsAllInput): Promise<BondDetails[]> {
  return measureStorageFetch({
    storageName: 'bonds.bonds',
    originFn: 'getBondsAll',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 176) return [];

      if (storage.bonds.bonds.v176.is(block) || block.specVersion >= 176) {
        return tryExecOrReturnFallback(async () => {
          const pairsPaged = [];

          try {
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
          } catch (e) {
            throw e;
          }
          return pairsPaged;
        }, []);
      }

      throw new UnknownVersionError('storage.bonds.bonds');
    },
  });
}

export default {
  getBond,
  getBondsAll,
};
