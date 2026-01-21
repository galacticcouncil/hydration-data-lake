import pMap from 'p-map';

import { Store } from '@subsquid/typeorm-store';

import { EmaOracleEntryHistoricalData } from '../../../model';
import parsers from '../../../parsers';
import { SqdProcessorContext } from '../../../processor';
import { splitIntoBatches } from '../../../utils/helpers';
import { getOrCreateAsset } from '../../assets/asset';

export async function handleEmaOracleHistoricalData(
  ctx: SqdProcessorContext<Store>
) {
  const predefinedEntities = [];

  // console.time(`>>> handleEmaOracleHistoricalData :: predefinedEntities`);
  predefinedEntities.push(
    await pMap(
      ctx.blocks,
      async ({ header: blockHeader }) => {
        const entries = await parsers.storage.emaOracle.getOracles({
          block: blockHeader,
        });

        const newEntities = [];

        for (const entry of entries) {
          const {
            assetIds,
            source,
            period,
            price: { numerator: numeratorPrice, denominator: denominatorPrice },
            volume: {
              aIn: assetAInVolume,
              aOut: assetAOutVolume,
              bIn: assetBInVolume,
              bOut: assetBOutVolume,
            },
            liquidity: { a: assetALiquidity, b: assetBLiquidity },
            updatedAt: updatedAtParaBlockHeight,
          } = entry;

          const assetA = await getOrCreateAsset({
            assetRegistryId: assetIds[0],
            ensure: true,
            blockHeader,
            ctx,
          });
          if (!assetA || !assetA?.assetRegistryId) {
            console.log(`Asset ${assetIds[0]} not found. Skipping.`);
            continue;
          }

          const assetB = await getOrCreateAsset({
            assetRegistryId: assetIds[1],
            ensure: true,
            blockHeader,
            ctx,
          });
          if (!assetB || !assetB?.assetRegistryId) {
            console.log(`Asset ${assetIds[1]} not found. Skipping.`);
            continue;
          }

          const block = ctx.batchState.getParaBlockFromCacheByHeight(
            blockHeader.height
          );
          if (!block) {
            throw new Error(
              `Block not found in cache for height ${blockHeader.height}`
            );
          }

          newEntities.push(
            new EmaOracleEntryHistoricalData({
              id: `${blockHeader.height}-${assetA.id}-${assetB.id}-${source}-${period}`,

              assetAId: assetA.id,
              assetBId: assetB.id,
              assetAAssetRegistryId: assetA.assetRegistryId,
              assetBAssetRegistryId: assetB.assetRegistryId,
              source,
              period,
              numeratorPrice,
              denominatorPrice,
              assetAInVolume,
              assetAOutVolume,
              assetBInVolume,
              assetBOutVolume,
              assetALiquidity,
              assetBLiquidity,
              updatedAtParaBlockHeight,

              paraBlockHeight: blockHeader.height,
            })
          );
        }

        return newEntities;
      },
      {
        concurrency:
          ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
      }
    )
  );
  //
  // console.timeEnd(`>>> handleEmaOracleHistoricalData :: predefinedEntities`);
  //
  // console.time(
  //   `>>> handleEmaOracleHistoricalData :: set emaOracleEntriesHistoricalData`
  // );
  ctx.batchState.state.emaOracleEntriesHistoricalData = new Map(
    predefinedEntities
      .flat(2)
      .filter((item) => !!item)
      .map((item) => [item.id, item])
  );
  // console.timeEnd(
  //   `>>> handleEmaOracleHistoricalData :: set emaOracleEntriesHistoricalData`
  // );
  //
  // console.time(`>>> handleEmaOracleHistoricalData :: save`);
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.emaOracleEntriesHistoricalData.values())
  );
  // console.timeEnd(`>>> handleEmaOracleHistoricalData :: save`);
}
