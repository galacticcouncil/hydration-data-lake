import { storage } from '../typegenTypes/';
import { UnknownVersionError } from '../../../../utils/errors';
import { EmaOracleEntryData, GetEmaOraclesInput } from '../../../types/storage';
import { hexToString, hexToU8a, u8aToString } from '@polkadot/util';
import { EmaOraclePeriod } from '../../../../model';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';

async function getOracles({
  block,
}: GetEmaOraclesInput): Promise<EmaOracleEntryData[]> {
  if (storage.emaOracle.oracles.v347.is(block) || block.specVersion >= 347) {
    return tryExecOrReturnFallback(async () => {
      const pairsPaged = [];

      try {
        for await (const page of storage.emaOracle.oracles.v347.getPairsPaged(
          500,
          block
        ))
          pairsPaged.push(
            ...page
              .filter((p) => !!p && !!p[1])
              .map(
                ([
                  [source, assetIds, period],
                  entryData,
                ]): EmaOracleEntryData | null => {
                  if (!entryData) return null;
                  const entry = entryData[0];
                  return {
                    source: hexToString(source),
                    assetIds: assetIds,
                    period: period.__kind as EmaOraclePeriod,
                    price: {
                      numerator: entry.price.n,
                      denominator: entry.price.d,
                    },
                    volume: {
                      aIn: entry.volume.aIn,
                      aOut: entry.volume.aOut,
                      bIn: entry.volume.bIn,
                      bOut: entry.volume.bOut,
                    },
                    liquidity: {
                      a: entry.liquidity.a,
                      b: entry.liquidity.b,
                    },
                    updatedAt: entry.updatedAt,
                  };
                }
              )
              .filter((resp) => !!resp)
          );
      } catch (e) {
        throw e;
      }

      return pairsPaged;
    }, []);
  }

  throw new UnknownVersionError('storage.emaOracle.oracles');
}

export default {
  getOracles,
};
