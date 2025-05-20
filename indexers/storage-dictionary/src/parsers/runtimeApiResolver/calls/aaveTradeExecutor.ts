import {
  AaveTradeExecutorPoolDataWithPoolId,
  AaveTradeExecutorPoolsInput,
} from '../types';
import { UnknownVersionError } from '../../../utils/errors';
import { ScaleCodecManager } from '../scaleCodecManager';
import { getAavePoolAddress } from '../../../utils/helpers';

export async function getPools({
  block,
}: AaveTradeExecutorPoolsInput): Promise<
  AaveTradeExecutorPoolDataWithPoolId[]
> {
  const decoders = ScaleCodecManager.getInstance().decoders;

  if (block.specVersion >= 295) {
    return decoders.v264.AaveTradeExecutor.pools
      .dec(
        await block._runtime.rpc.call(`state_call`, [
          'AaveTradeExecutor_pools',
          '0x',
          block.hash,
        ])
      )
      .map(
        (data): AaveTradeExecutorPoolDataWithPoolId => ({
          poolId: getAavePoolAddress(data.reserve, data.aToken),
          data,
        })
      );
  }

  throw new UnknownVersionError('runtimeApi.AaveTradeExecutor.pools');
}

export default { getPools };
