import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import { ParachainSystemLastRelayChainBlockNumber } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';

async function getLastRelayChainBlockNumber(
  block: BlockHeader
): Promise<ParachainSystemLastRelayChainBlockNumber | null> {
  if (storage.parachainSystem.lastRelayChainBlockNumber.v257.is(block)) {
    return (
      (await storage.parachainSystem.lastRelayChainBlockNumber.v257.get(
        block
      )) ?? null
    );
  }

  throw new UnknownVersionError(
    'storage.parachainSystem.lastRelayChainBlockNumber'
  );
}

export default { getLastRelayChainBlockNumber };
