import { constants, storage } from '../typegenTypes/';
import {
  AssetDetailsWithId,
  OmnipoolLMGetGlobalFarmsInput,
  OmnipoolLMGlobalFarmData,
  OmnipoolLMGlobalFarmDataWithId,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

async function getOmnipoolLMGlobalFarms({
  block,
  farmIds,
}: OmnipoolLMGetGlobalFarmsInput): Promise<
  OmnipoolLMGlobalFarmDataWithId[] | null
> {
  return measureStorageFetch({
    storageName: 'omnipoolWarehouseLm.globalFarm',
    originFn: 'getOmnipoolLMGlobalFarms',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 287) return null;

      if (
        storage.omnipoolWarehouseLm.globalFarm.v287.is(block) ||
        block.specVersion >= 138
      ) {
        try {
          const resp =
            await storage.omnipoolWarehouseLm.globalFarm.v287.getMany(
              block,
              farmIds.map((id) => +id).filter((id) => !Number.isNaN(id))
            );

          const respMap = new Map(
            resp.filter((r) => !!r).map((r) => [r.id, r])
          );

          const decoratedResp: OmnipoolLMGlobalFarmDataWithId[] = [];

          farmIds.forEach((farmId) => {
            if (!respMap.has(+farmId)) {
              decoratedResp.push({ farmId: +farmId, data: null });
            } else {
              decoratedResp.push({
                farmId: +farmId,
                data: respMap.get(
                  +farmId
                )! as unknown as OmnipoolLMGlobalFarmData,
              });
            }
          });

          return decoratedResp;
        } catch (e) {
          return null;
        }
      }
      throw new UnknownVersionError('storage.omnipoolWarehouseLm.globalFarm');
    },
  });
}

export default {
  getOmnipoolLMGlobalFarms,
};
