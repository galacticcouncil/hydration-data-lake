import { Fields, ProcessorContext } from '../../processor';
import { RelayChainInfo } from '../../parsers/types/common';
import { Store } from '@subsquid/typeorm-store';
import { Block } from '@subsquid/substrate-processor';
import { events } from '../../typegenTypes';
import { Block as BlockEntity } from '../../model';

export async function handleBlockEntities(
  blocks: Block<Fields>[],
  ctx: ProcessorContext<Store>
) {
  const stateBlocks = ctx.batchState.state.blocks;
  const blocksToSave: BlockEntity[] = [];

  for (let block of blocks) {
    for (let event of block.events) {
      switch (event.name) {
        case events.relayChainInfo.currentBlockNumbers.name: {
          if (events.relayChainInfo.currentBlockNumbers.v104.is(event)) {
            const parsedParams =
              events.relayChainInfo.currentBlockNumbers.v104.decode(event);
            const newBlock = new BlockEntity({
              id: block.header.id,
              height: block.header.height,
              hash: block.header.hash,
              timestamp: (block.header.timestamp ?? Date.now()).toString(),
              relayBlockHeight: parsedParams[1],
            });
            stateBlocks.set(block.header.height, newBlock);
            blocksToSave.push(newBlock);
            break;
          }
          if (events.relayChainInfo.currentBlockNumbers.v115.is(event)) {
            const parsedParams =
              events.relayChainInfo.currentBlockNumbers.v115.decode(event);
            const newBlock = new BlockEntity({
              id: block.header.id,
              height: block.header.height,
              hash: block.header.hash,
              timestamp: (block.header.timestamp ?? Date.now()).toString(),
              relayBlockHeight: parsedParams.relaychainBlockNumber,
            });
            stateBlocks.set(block.header.height, newBlock);
            blocksToSave.push(newBlock);

            break;
          }
        }
        default:
      }
    }
  }

  await ctx.store.upsert(blocksToSave);

  ctx.batchState.state.blocks = stateBlocks;
}
