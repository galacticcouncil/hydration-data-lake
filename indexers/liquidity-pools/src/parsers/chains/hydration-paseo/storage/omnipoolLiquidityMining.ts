import { constants, storage } from '../typegenTypes/';
import { GetDataAtBlockInput } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  OmnipoolLiquidityMiningGetOmniPositionIdInput,
  OmnipoolLiquidityMiningOmniPositionId,
  OmnipoolLiquidyMiningNftCollectionId,
} from '../../../types/storage/omnipoolLiquidityMining';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';

function getNftCollectionIdConstant({
  block,
}: GetDataAtBlockInput): OmnipoolLiquidyMiningNftCollectionId | null {
  if (block.specVersion < 287) return null;
  if (constants.omnipoolLiquidityMining.nftCollectionId.v287.is(block)) {
    const resp =
      constants.omnipoolLiquidityMining.nftCollectionId.v287.get(block);
    return {
      collectionId: resp.toString(),
    };
  }
  throw new UnknownVersionError(
    'constants.omnipoolLiquidityMining.nftCollectionId'
  );
}

async function getOmniPositionId({
  depositId,
  block,
}: OmnipoolLiquidityMiningGetOmniPositionIdInput): Promise<OmnipoolLiquidityMiningOmniPositionId | null> {
  return measureStorageFetch({
    storageName: 'otc.orders',
    originFn: 'getOtcOrder',
    blockHeight: block.height,
    args: { depositId },
    fn: async () => {
      if (block.specVersion < 287) return null;
      if (
        storage.omnipoolLiquidityMining.omniPositionId.v287.is(block) ||
        block.specVersion >= 287
      ) {
        return tryExecOrReturnFallback(async () => {
          const resp =
            await storage.omnipoolLiquidityMining.omniPositionId.v287.get(
              block,
              BigInt(depositId)
            );
          if (!resp) return null;
          return { positionId: resp.toString() };
        }, null);
      }

      throw new UnknownVersionError(
        'storage.omnipoolLiquidityMining.omniPositionId'
      );
    },
  });
}

export default {
  getNftCollectionIdConstant,
  getOmniPositionId,
};
