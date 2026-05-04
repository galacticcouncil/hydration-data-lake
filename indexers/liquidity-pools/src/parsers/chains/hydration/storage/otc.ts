import { storage } from '../typegenTypes/';
import { OtcGetOrderInput, OtcOrderData } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

async function getOtcOrder({
  orderId,
  block,
}: OtcGetOrderInput): Promise<OtcOrderData | null> {
  return measureStorageFetch({
    storageName: 'otc.orders.get',
    originFn: 'getOtcOrder',
    blockHeight: block.height,
    args: { orderId },
    fn: async () => {
      if (block.specVersion < 138) return null;
      if (storage.otc.orders.v138.is(block) || block.specVersion >= 138) {
        return tryExecOrReturnFallback(async () => {
          const resp = await storage.otc.orders.v138.get(block, orderId);
          if (!resp) return null;
          return resp;
        }, null);
      }

      throw new UnknownVersionError('storage.otc.orders');
    },
  });
}

export default { getOtcOrder };
