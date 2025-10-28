import { storage } from '../typegenTypes/';
import { OtcGetOrderInput, OtcOrderData } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';

async function getOtcOrder({
  orderId,
  block,
}: OtcGetOrderInput): Promise<OtcOrderData | null> {
  if (storage.otc.orders.v347.is(block)) {
    return tryExecOrReturnFallback(async () => {
      const resp = await storage.otc.orders.v347.get(block, orderId);
      if (!resp) return null;
      return resp;
    }, null);
  }

  throw new UnknownVersionError('storage.otc.orders');
}

export default { getOtcOrder };
