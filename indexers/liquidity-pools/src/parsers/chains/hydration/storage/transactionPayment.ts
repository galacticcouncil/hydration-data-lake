import { storage } from '../typegenTypes/';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  GetDataAtBlockInput,
  TransactionPaymentNextFeeMultiplier,
} from '../../../types/storage';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

async function getNextFeeMultiplier({
  block,
}: GetDataAtBlockInput): Promise<TransactionPaymentNextFeeMultiplier | null> {
  return measureStorageFetch({
    storageName: 'transactionPayment.nextFeeMultiplier.get',
    originFn: 'getNextFeeMultiplier',
    blockHeight: block.height,
    fn: async () => {
      if (block.specVersion < 100) return null;
      if (storage.transactionPayment.nextFeeMultiplier.v100.is(block)) {
        const resp =
          await storage.transactionPayment.nextFeeMultiplier.v100.get(block);

        return !resp
          ? null
          : {
              nextFeeMultiplier: resp,
            };
      }

      throw new UnknownVersionError(
        'storage.transactionPayment.nextFeeMultiplier'
      );
    },
  });
}

export default {
  getNextFeeMultiplier,
};
