import { storage } from '../typegenTypes/';
import { UnknownVersionError } from '../../../../utils/errors';
import { EmaOracleEntryData, GetEmaOraclesInput } from '../../../types/storage';
import { hexToString, hexToU8a, u8aToString } from '@polkadot/util';
import { EmaOraclePeriod } from '../../../../model';
import { tryExecOrReturnFallback } from '../../../../utils/helpers';

async function getOracles({
  block,
}: GetEmaOraclesInput): Promise<EmaOracleEntryData[]> {
  if (block.specVersion < 138) return [];

  if (
    storage.emaOracle.oracles.v138.is(block) ||
    (block.specVersion >= 138 && block.specVersion < 170)
  ) {
    return tryExecOrReturnFallback(async () => {
      const pairsPaged = [];

      for await (const page of storage.emaOracle.oracles.v138.getPairsPaged(
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
                  updatedAt: entry.timestamp,
                };
              }
            )
            .filter((resp) => !!resp)
        );
      return pairsPaged;
    }, []);
  }

  if (storage.emaOracle.oracles.v170.is(block) || block.specVersion >= 170) {
    return tryExecOrReturnFallback(async () => {
      const pairsPaged = [];

      for await (const page of storage.emaOracle.oracles.v170.getPairsPaged(
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
      return pairsPaged;
    }, []);
  }

  throw new UnknownVersionError('storage.emaOracle.oracles');
}

export default {
  getOracles,
};
