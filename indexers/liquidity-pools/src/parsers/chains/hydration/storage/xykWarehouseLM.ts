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
    storageName: 'storage.xykWarehouseLm.deposit',
    originFn: 'getXykpoolLMDeposits',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 227) return null;

      if (
        storage.xykWarehouseLm.deposit.v227.is(block) ||
        block.specVersion >= 227
      ) {
        try {
          const resp = await storage.xykWarehouseLm.deposit.v227.getMany(
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
      if (block.specVersion < 227) return null;

      if (storage.xykWarehouseLm.deposit.v227.is(block)) {
        try {
          const pairsPaged: XykpoolLMDepositDataWithId[] = [];

          for await (const page of storage.xykWarehouseLm.deposit.v227.getPairsPaged(
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
