import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../../parsers';
import { splitIntoBatches } from '../../../utils/helpers';
import { EmaOracleEntryHistoricalData } from '../../../model';
import { getOrCreateAsset } from '../../assets/asset';
import pMap from 'p-map';

export async function handleEmaOracleHistoricalData(
  ctx: SqdProcessorContext<Store>
) {
  const predefinedEntities = [];

  for (const blocksSubBatch of splitIntoBatches(
    ctx.blocks,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    predefinedEntities.push(
      await pMap(
        blocksSubBatch,
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
              price: {
                numerator: numeratorPrice,
                denominator: denominatorPrice,
              },
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

            newEntities.push(
              new EmaOracleEntryHistoricalData({
                id: `${blockHeader.height}-${assetA.id}-${assetB.id}-${source}-${period}`,

                assetA,
                assetB,
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

                relayBlockHeight:
                  ctx.batchState.state.relayChainInfo.get(blockHeader.height)
                    ?.relaychainBlockNumber ?? 0,
                paraBlockHeight: blockHeader.height,
                block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
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
  }

  ctx.batchState.state.emaOracleEntriesHistoricalData = new Map(
    predefinedEntities
      .flat(2)
      .filter((item) => !!item)
      .map((item) => [item.id, item])
  );

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.emaOracleEntriesHistoricalData.values())
  );
}
