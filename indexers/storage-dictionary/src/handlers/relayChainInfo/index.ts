import { Fields, ProcessorContext } from '../../processor';
import { RelayChainInfo } from '../../parsers/types/common';
import { Store } from '@subsquid/typeorm-store';
import { Block } from '@subsquid/substrate-processor';
import { events } from '../../typegenTypes';

export function handleRelayChainInfo(
  blocks: Block<Fields>[],
  ctx: ProcessorContext<Store>
) {
  const relayChainInfo = ctx.batchState.state.relayChainInfo;

  for (let block of blocks) {
    for (let event of block.events) {
      switch (event.name) {
        case events.relayChainInfo.currentBlockNumbers.name: {
          if (events.relayChainInfo.currentBlockNumbers.v104.is(event)) {
            const parsedParams =
              events.relayChainInfo.currentBlockNumbers.v104.decode(event);
            relayChainInfo.set(parsedParams[0], {
              parachainBlockNumber: parsedParams[0],
              relaychainBlockNumber: parsedParams[1],
            });
            break;
          }
          if (events.relayChainInfo.currentBlockNumbers.v115.is(event)) {
            const parsedParams =
              events.relayChainInfo.currentBlockNumbers.v115.decode(event);
            relayChainInfo.set(parsedParams.parachainBlockNumber, {
              parachainBlockNumber: parsedParams.parachainBlockNumber,
              relaychainBlockNumber: parsedParams.relaychainBlockNumber,
            });
            break;
          }
        }
        default:
      }
    }
  }

  ctx.batchState.state = {
    relayChainInfo,
  };
}
