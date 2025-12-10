import { constants } from '../typegenTypes/';
import { GetDataAtBlockInput } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { XykpoolNftCollectionId } from '../../../types/storage/xykpoolLiquidityMining';

function getNftCollectionIdConstant({
  block,
}: GetDataAtBlockInput): XykpoolNftCollectionId | null {
  if (block.specVersion < 227) return null;
  if (constants.xykLiquidityMining.nftCollectionId.v227.is(block)) {
    const resp = constants.xykLiquidityMining.nftCollectionId.v227.get(block);
    return {
      collectionId: resp.toString(),
    };
  }
  throw new UnknownVersionError(
    'constants.xykLiquidityMining.nftCollectionId.v227'
  );
}

export default {
  getNftCollectionIdConstant,
};
