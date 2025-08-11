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
  return null;
}

async function getAllCollaterals({
  block,
}: GetDataAtBlockInput): Promise<HsmCollateralData[] | null> {
  return null;
}

export default { getAllCollaterals, getCollateral };
