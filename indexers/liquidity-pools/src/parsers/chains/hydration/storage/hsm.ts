import {
  GetConstantsInput,
  GetDataAtBlockInput,
  GetHsmCollateralInput,
  HsmCollateralData,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { storage } from '../typegenTypes/';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';

async function getCollateral({
  collateralId,
  block,
}: GetHsmCollateralInput): Promise<HsmCollateralData | null> {
  if (block.specVersion < 323) return null;

  if (storage.hsm.collaterals.v323.is(block)) {
    return tryExecOrReturnFallback(async () => {
      const resp = await storage.hsm.collaterals.v323.get(block, +collateralId);

      return resp
        ? {
            collateralAssetId: +collateralId,
            ...resp,
          }
        : null;
    }, null);
  }

  throw new UnknownVersionError('storage.hsm.collaterals');
}

async function getAllCollaterals({
  block,
}: GetDataAtBlockInput): Promise<HsmCollateralData[] | null> {
  if (block.specVersion < 323) return null;

  if (storage.hsm.collaterals.v323.is(block)) {
    return tryExecOrReturnFallback(async () => {
      const resp = await storage.hsm.collaterals.v323.getPairs(block);
      const result: HsmCollateralData[] = [];

      for (const [collateralAssetId, collateralData] of resp) {
        if (!collateralData) continue;

        result.push({
          collateralAssetId,
          ...collateralData,
        });
      }

      return result.length ? result : null;
    }, null);
  }

  throw new UnknownVersionError('storage.hsm.collaterals');
}

export default { getAllCollaterals, getCollateral };
