import { Block, ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../../parsers';
import {
  EmaOracle,
  EmaOracleEntry,
  EmaOracleEntryLiquidity,
  EmaOracleEntryPrice,
  EmaOracleEntryVolume,
} from '../../../model';
import { getOrCreateAsset } from '../../asset/assetRegistry';

export async function handleEmaOracleHistoricalData(
  ctx: ProcessorContext<Store>,
  blockHeader: Block
) {
  const entriesStorageData = await parsers.storage.emaOracle.getOracles({
    block: blockHeader,
  });

  const oracleHistDataEntity = new EmaOracle({
    id: `${blockHeader.height}`,
    entries: [],
    relayBlockHeight:
      ctx.batchState.state.relayChainInfo.get(blockHeader.height)
        ?.relaychainBlockNumber ?? 0,
    paraBlockHeight: blockHeader.height,
  });

  for (const entry of entriesStorageData) {
    const {
      assetIds,
      source,
      period,
      price: { n, d },
      volume: { aIn, aOut, bIn, bOut },
      liquidity: { a, b },
      updatedAt,
    } = entry;

    const assetA = await getOrCreateAsset({
      id: assetIds[0],
      ensure: true,
      blockHeader,
      ctx,
    });
    if (!assetA) {
      console.log(`Asset ${assetIds[0]} not found. Skipping.`);
      continue;
    }

    const assetB = await getOrCreateAsset({
      id: assetIds[1],
      ensure: true,
      blockHeader,
      ctx,
    });
    if (!assetB) {
      console.log(`Asset ${assetIds[1]} not found. Skipping.`);
      continue;
    }

    oracleHistDataEntity.entries.push(
      new EmaOracleEntry({
        source,
        assetIds,
        period,

        price: new EmaOracleEntryPrice({
          n: n.toString(),
          d: d.toString(),
        }),
        volume: new EmaOracleEntryVolume({
          aIn: aIn.toString(),
          aOut: aOut.toString(),
          bIn: bIn.toString(),
          bOut: bOut.toString(),
        }),
        liquidity: new EmaOracleEntryLiquidity({
          a: a.toString(),
          b: b.toString(),
        }),

        updatedAt,
      })
    );
  }

  await ctx.store.upsert(oracleHistDataEntity);
}
