import { storage } from '../typegenTypes/';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  GetDataAtBlockInput,
  TransactionPaymentNextFeeMultiplier,
} from '../../../types/storage';

async function getNextFeeMultiplier({
  block,
}: GetDataAtBlockInput): Promise<TransactionPaymentNextFeeMultiplier | null> {
  if (block.specVersion < 347) return null;
  if (storage.transactionPayment.nextFeeMultiplier.v347.is(block)) {
    const resp =
      await storage.transactionPayment.nextFeeMultiplier.v347.get(block);

    return !resp
      ? null
      : {
          nextFeeMultiplier: resp,
        };
  }

  throw new UnknownVersionError('storage.transactionPayment.nextFeeMultiplier');
}

export default {
  getNextFeeMultiplier,
};
