import { BlockHeader } from '@subsquid/substrate-processor';
import { storage } from '../typegenTypes/';
import { ParachainSystemLastRelayChainBlockNumber } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

async function getLastRelayChainBlockNumber(
  block: BlockHeader
): Promise<ParachainSystemLastRelayChainBlockNumber | null> {
  return measureStorageFetch({
    storageName: 'parachainSystem.lastRelayChainBlockNumber.get',
    originFn: 'getLastRelayChainBlockNumber',
    blockHeight: block.height,
    fn: async () => {
      if (storage.parachainSystem.lastRelayChainBlockNumber.v115.is(block)) {
        return (
          (await storage.parachainSystem.lastRelayChainBlockNumber.v115.get(
            block
          )) ?? null
        );
      }

      throw new UnknownVersionError(
        'storage.parachainSystem.lastRelayChainBlockNumber'
      );
    },
  });
}

export default { getLastRelayChainBlockNumber };
