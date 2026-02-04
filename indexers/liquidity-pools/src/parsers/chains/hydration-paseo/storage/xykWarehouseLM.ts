import { storage } from '../typegenTypes/';
import { UnknownVersionError } from '../../../../utils/errors';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';
import {
  XykpoolLMDepositDataWithId,
  XykpoolLMGetDepositsInput,
} from '../../../types/storage/xykpoolLiquidityMining';
import { GetDataAtBlockInput } from '../../../types/storage';

async function getXykpoolLMDeposits({
  block,
  depositIds,
}: XykpoolLMGetDepositsInput): Promise<XykpoolLMDepositDataWithId[] | null> {
  return measureStorageFetch({
    storageName: 'omnipoolWarehouseLm.globalFarm',
    originFn: 'getXykpoolLMDeposits',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 347) return null;

      if (
        storage.xykWarehouseLm.deposit.v347.is(block) ||
        block.specVersion >= 287
      ) {
        try {
          const resp = await storage.xykWarehouseLm.deposit.v347.getMany(
            block,
            depositIds.map((id) => BigInt(id))
          );

          const decoratedResp: XykpoolLMDepositDataWithId[] = [];

          depositIds.forEach((depositId, index) => {
            const respItem = resp[index];
            decoratedResp.push({
              depositId,
              data: !respItem
                ? null
                : {
                    shares: respItem.shares,
                    ammPoolId: respItem.ammPoolId,
                    yieldFarmEntries: respItem.yieldFarmEntries,
                  },
            });
          });

          return decoratedResp;
        } catch (e) {
          return null;
        }
      }
      throw new UnknownVersionError('storage.xykWarehouseLm.deposit');
    },
  });
}

async function getAllDepositsData({
  block,
}: GetDataAtBlockInput): Promise<XykpoolLMDepositDataWithId[] | null> {
  return measureStorageFetch({
    storageName: 'xykWarehouseLm.deposit',
    originFn: 'getAllDepositsData',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 347) return null;

      if (storage.xykWarehouseLm.deposit.v347.is(block)) {
        try {
          const pairsPaged: XykpoolLMDepositDataWithId[] = [];

          for await (const page of storage.xykWarehouseLm.deposit.v347.getPairsPaged(
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
                        ammPoolId: depositData.ammPoolId,
                        yieldFarmEntries: depositData.yieldFarmEntries,
                      },
                }))
            );
          return pairsPaged;
        } catch (e) {
          return null;
        }
      }
      throw new UnknownVersionError('storage.xykWarehouseLm.deposit');
    },
  });
}

export default {
  getXykpoolLMDeposits,
  getAllDepositsData,
};
