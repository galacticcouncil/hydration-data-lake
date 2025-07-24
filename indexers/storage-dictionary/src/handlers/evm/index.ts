import { BlockWithData, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { parseEvmEventsInBlock } from './evmEventParser';
import { EvmAccountsUtils } from '../../utils/evm/evmAccountsUtils';

export async function handleEvmEventsInBlock(
  block: BlockWithData,
  ctx: ProcessorContext<Store>
) {
  await parseEvmEventsInBlock(block, ctx);

  EvmAccountsUtils.getInstance().margeCachedData();
}
