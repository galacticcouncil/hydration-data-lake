import { storage } from '../typegenTypes/';
import {
  GetDataAtBlockInput,
  OmnipoolLMGetDepositsInput,
  OmnipoolLMGetGlobalFarmsInput,
  OmnipoolLMGlobalFarmData,
  OmnipoolLMGlobalFarmDataWithId,
  OmnipoolYieldFarmDepositDataWithId,
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
      if (block.specVersion < 347) return null;

      if (
        storage.omnipoolWarehouseLm.globalFarm.v347.is(block) ||
        block.specVersion >= 138
      ) {
        try {
          const resp =
            await storage.omnipoolWarehouseLm.globalFarm.v347.getMany(
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

async function getAllDepositsData({
  block,
}: GetDataAtBlockInput): Promise<OmnipoolYieldFarmDepositDataWithId[] | null> {
  return measureStorageFetch({
    storageName: 'omnipoolWarehouseLm.deposit',
    originFn: 'getAllDepositsData',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 347) return null;

      if (storage.omnipoolWarehouseLm.deposit.v347.is(block)) {
        try {
          const pairsPaged: OmnipoolYieldFarmDepositDataWithId[] = [];

          for await (const page of storage.omnipoolWarehouseLm.deposit.v347.getPairsPaged(
            500,
            block
          ))
            pairsPaged.push(
              ...page
                .filter((p) => !!p && !!p[1])
                .map(([depositId, depositData]) => ({
                  depositId: depositId.toString(),
                  data: !depositData
                    ? null
                    : {
                        shares: depositData.shares,
                        ammPoolId: depositData.ammPoolId.toString(),
                        yieldFarmEntries: depositData.yieldFarmEntries,
                      },
                }))
            );
          return pairsPaged;
        } catch (e) {
          return null;
        }
      }
      throw new UnknownVersionError('storage.omnipoolWarehouseLm.deposit');
    },
  });
}

async function getLMDepositsData({
  block,
  depositIds,
}: OmnipoolLMGetDepositsInput): Promise<
  OmnipoolYieldFarmDepositDataWithId[] | null
> {
  return measureStorageFetch({
    storageName: 'omnipoolWarehouseLm.deposit',
    originFn: 'getLMDepositsData',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 347) return null;

      if (
        storage.omnipoolWarehouseLm.deposit.v347.is(block) ||
        block.specVersion >= 347
      ) {
        try {
          const resp = await storage.omnipoolWarehouseLm.deposit.v347.getMany(
            block,
            depositIds.map((id) => BigInt(id))
          );

          const decoratedResp: OmnipoolYieldFarmDepositDataWithId[] = [];

          depositIds.forEach((depositId, index) => {
            const respItem = resp[index];
            decoratedResp.push({
              depositId,
              data: !respItem
                ? null
                : {
                    shares: respItem.shares,
                    ammPoolId: respItem.ammPoolId.toString(),
                    yieldFarmEntries: respItem.yieldFarmEntries,
                  },
            });
          });

          return decoratedResp;
        } catch (e) {
          return null;
        }
      }
      throw new UnknownVersionError('storage.omnipoolWarehouseLm.deposit');
    },
  });
}

export default {
  getOmnipoolLMGlobalFarms,
  getAllDepositsData,
  getLMDepositsData,
};
