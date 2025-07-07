import { Block, ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../../parsers';
import {
  AssetHistoricalData,
  EmaOracle,
  EmaOracleEntry,
  EmaOracleEntryLiquidity,
  EmaOracleEntryPrice,
  EmaOracleEntryVolume,
} from '../../../model';
import { getOrCreateAsset } from '../../asset/assetRegistry';
import { Between } from 'typeorm/find-options/operator/Between';

export async function handleEmaOracleHistoricalData(
  ctx: ProcessorContext<Store>,
  blockHeader: Block
) {
  if (ctx.batchState.state.emaOraclesProcessedBlocks.has(blockHeader.height))
    return;

  const entriesStorageData = await parsers.storage.emaOracle.getOracles({
    block: blockHeader,
  });

  const oracleHistDataEntity = new EmaOracle({
    id: `${blockHeader.height}`,
    entries: [],
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
  ctx.batchState.state.emaOracles.set(
    oracleHistDataEntity.id,
    oracleHistDataEntity
  );

  if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE)
    await ctx.store.upsert(oracleHistDataEntity);
}

export async function prefetchAllEmaOracleRecordsForBlocksRangeToEnsureMissedBlocks(
  ctx: ProcessorContext<Store>,
  orderedBlockNumbers: number[]
) {
  if (
    !ctx.appConfig.PROCESS_ONLY_MISSED_BLOCKS ||
    !ctx.appConfig.PROCESS_GENERIC_HIST_DATA
  )
    return;

  const records = await ctx.store.find(EmaOracle, {
    where: {
      paraBlockHeight: Between(
        orderedBlockNumbers[0],
        orderedBlockNumbers[orderedBlockNumbers.length - 1]
      ),
    },
  });

  ctx.batchState.state.emaOracles = new Map(records.map((r) => [r.id, r]));
  ctx.batchState.state.emaOraclesProcessedBlocks = new Set(
    records.map((r) => r.paraBlockHeight)
  );
  console.log(
    `EmaOracle :: Blocks range: ${orderedBlockNumbers[0]}/${orderedBlockNumbers[orderedBlockNumbers.length - 1]}. 
    Number of missed blocks: ${orderedBlockNumbers.filter((b) => !ctx.batchState.state.emaOraclesProcessedBlocks.has(b)).length}/${orderedBlockNumbers.length}`
  );
}
