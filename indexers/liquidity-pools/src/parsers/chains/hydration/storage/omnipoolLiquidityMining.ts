import { constants, storage } from '../typegenTypes/';
import {
  GetDataAtBlockInput,
  OmnipoolYieldFarmDepositDataWithId,
  OtcGetOrderInput,
  OtcOrderData,
} from '../../../types/storage';
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
  if (block.specVersion < 138) return null;
  if (constants.omnipoolLiquidityMining.nftCollectionId.v138.is(block)) {
    const resp =
      constants.omnipoolLiquidityMining.nftCollectionId.v138.get(block);
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
    storageName: 'omnipoolLiquidityMining.omniPositionId.get',
    originFn: 'getOmniPositionId',
    blockHeight: block.height,
    args: { depositId },
    fn: async () => {
      if (block.specVersion < 138) return null;
      if (
        storage.omnipoolLiquidityMining.omniPositionId.v138.is(block) ||
        block.specVersion >= 138
      ) {
        return tryExecOrReturnFallback(async () => {
          const resp =
            await storage.omnipoolLiquidityMining.omniPositionId.v138.get(
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
