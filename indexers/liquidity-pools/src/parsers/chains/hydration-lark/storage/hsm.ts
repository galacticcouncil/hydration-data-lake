import {
  GetConstantsInput,
  GetDataAtBlockInput,
  GetHsmCollateralInput,
  HsmCollateralData,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { constants, storage } from '../typegenTypes/';

async function getCollateral({
  collateralId,
  block,
}: GetHsmCollateralInput): Promise<HsmCollateralData | null> {
  if (storage.hsm.collaterals.v405.is(block)) {
    const resp = await storage.hsm.collaterals.v405.get(block, +collateralId);

    return resp
      ? {
          collateralAssetId: +collateralId,
          ...resp,
        }
      : null;
  }

  throw new UnknownVersionError('storage.hsm.collaterals');
}

async function getAllCollaterals({
  block,
}: GetDataAtBlockInput): Promise<HsmCollateralData[] | null> {
  if (storage.hsm.collaterals.v405.is(block)) {
    const resp = await storage.hsm.collaterals.v405.getPairs(block);
    const result: HsmCollateralData[] = [];

    for (const [collateralAssetId, collateralData] of resp) {
      if (!collateralData) continue;

      result.push({
        collateralAssetId,
        ...collateralData,
      });
    }

    return result.length ? result : null;
  }

  throw new UnknownVersionError('storage.hsm.collaterals');
}

export default { getAllCollaterals, getCollateral };
