import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { ChainName } from '../../utils/types';
import { RelayChainInfo } from '../../parsers/types/events';
import parsers from '../../parsers';

import {
  calls as hydrationCalls,
  events as hydrationEvents,
} from '../../parsers/chains/hydration/typegenTypes';
import {
  calls as hydrationPaseoCalls,
  events as hydrationPaseoEvents,
} from '../../parsers/chains/hydration-paseo/typegenTypes';

export async function handleRelayChainBlocks(ctx: SqdProcessorContext<Store>) {
  let events = null;
  let calls = null;

  switch (ctx.appConfig.CHAIN) {
    case ChainName.hydration:
      events = hydrationEvents;
      calls = hydrationCalls;
      break;
    case ChainName.hydration_paseo:
      events = hydrationPaseoEvents;
      calls = hydrationPaseoCalls;
      break;

    // case ChainName.hydration_paseo_next:
    //   events = hydrationPaseoNextEvents;
    //   calls = hydrationPaseoNextCalls;
    //   break;
  }

  for (const block of ctx.blocks) {
    const relayChainInfo: RelayChainInfo = {
      parachainBlockNumber: 0,
      relaychainBlockNumber: 0,
    };
    for (const call of block.calls) {
      switch (call.name) {
        case calls.parachainSystem.setValidationData.name: {
          const validationData =
            parsers.calls.parachainSystem.parseSetValidationDataArgs(call);

          relayChainInfo.relaychainBlockNumber =
            validationData.relayParentNumber;
          relayChainInfo.parachainBlockNumber = block.header.height;
          break;
        }
        default:
      }
    }
    ctx.batchState.state.relayChainInfo.set(
      relayChainInfo.parachainBlockNumber,
      relayChainInfo
    );
  }
}
