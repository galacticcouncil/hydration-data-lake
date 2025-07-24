import { BlockWithData, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { parseEvmEventsInBlock } from './evmEventParser';

export async function handleEvmEventsInBlock(
  block: BlockWithData,
  ctx: ProcessorContext<Store>
) {
  await parseEvmEventsInBlock(block, ctx);
}
