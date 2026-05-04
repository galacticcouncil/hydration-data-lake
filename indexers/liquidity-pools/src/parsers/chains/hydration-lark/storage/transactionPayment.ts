import { storage } from '../typegenTypes/';
import { UnknownVersionError } from '../../../../utils/errors';
import {
  GetDataAtBlockInput,
  TransactionPaymentNextFeeMultiplier,
} from '../../../types/storage';

async function getNextFeeMultiplier({
  block,
}: GetDataAtBlockInput): Promise<TransactionPaymentNextFeeMultiplier | null> {
  if (block.specVersion < 405) return null;
  if (storage.transactionPayment.nextFeeMultiplier.v405.is(block)) {
    const resp =
      await storage.transactionPayment.nextFeeMultiplier.v405.get(block);

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
