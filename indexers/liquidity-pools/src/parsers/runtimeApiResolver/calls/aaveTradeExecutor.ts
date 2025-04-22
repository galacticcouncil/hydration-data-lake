import {
  AaveTradeExecutorPoolDataWithPoolId,
  AaveTradeExecutorPoolsInput,
} from '../types';
import { UnknownVersionError } from '../../../utils/errors';
import { ScaleCodecManager } from '../scaleCodecManager';
import { u8aToHex } from '@polkadot/util';
import { u32 } from 'scale-ts';
import { BlockHeader } from '@subsquid/substrate-processor';
import { getAavePoolAddress } from '../../../utils/helpers';

export async function getPools({
  block,
}: AaveTradeExecutorPoolsInput): Promise<
  AaveTradeExecutorPoolDataWithPoolId[]
> {
  const decoders = ScaleCodecManager.getInstance().decoders;

  if (block.specVersion >= 264) {
    return decoders.v264.AaveTradeExecutor.pools
      .dec(
        await block._runtime.rpc.call(`state_call`, [
          'AaveTradeExecutor_pools',
          '0x',
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
