import { storage } from '../typegenTypes/';
import { OtcGetOrderInput, OtcOrderData } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getOtcOrder({
  orderId,
  block,
}: OtcGetOrderInput): Promise<OtcOrderData | null> {
  if (storage.otc.orders.v138.is(block)) {
    const resp = await storage.otc.orders.v138.get(block, orderId);

    if (!resp) return null;

    return resp;
  }

  throw new UnknownVersionError('storage.otc.orders');
}

export default { getOtcOrder };
