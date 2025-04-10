import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AssetHistoricalData,
} from '../../../model';
import parsers from '../../../parsers';
import { BlockHeader } from '@subsquid/substrate-processor';
import { splitIntoBatches } from '../../../utils/helpers';

async function processAssetsHistoricalDataAtBlock({
  assetIds,
  block,
  ctx,
}: {
  assetIds: Array<string>;
  block: BlockHeader;
  ctx: SqdProcessorContext<Store>;
}) {
  const totalIssuancePerAssetMap = new Map(
    (
      await parsers.storage.tokens.getManyTokensTotalIssuance({
        block,
        tokenIds: assetIds,
      })
    )
      .filter((res) => res.amount !== null)
      .map((res) => [res.tokenId, res.amount])
  );

  totalIssuancePerAssetMap.set(
    '0',
    await parsers.storage.balances.getTotalIssuance(block)
  );

  const existentialDepositPerAssetMap = new Map(
    (await parsers.storage.assetRegistry.getAssetMany(assetIds, block))
      .filter((res) => !!res.data)
      .map((res) => [`${res.assetId}`, res.data])
  );

  for (const assetId of assetIds) {
    if (
      !totalIssuancePerAssetMap.has(assetId) ||
      !existentialDepositPerAssetMap.has(assetId)
    )
      continue;

    const newAssetHistoricalData = new AssetHistoricalData({
      id: `${assetId}-${block.height}`,
      asset: ctx.batchState.state.assetsAllBatch.get(assetId),

      totalIssuance: totalIssuancePerAssetMap.get(assetId)!,
      existentialDeposit:
        existentialDepositPerAssetMap.get(assetId)!.existentialDeposit,
      spotPrices: [],
      paraBlockHeight: block.height,
      relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
        block.height
      ).height,
      block: ctx.batchState.state.batchBlocks.get(block.id),
    });

    ctx.batchState.state.assetsHistoricalDataBatch.set(
      newAssetHistoricalData.id,
      newAssetHistoricalData
    );
  }
}

export async function handleAssetHistoricalData(
  ctx: SqdProcessorContext<Store>
) {
  const assetIds: Array<string> = [
    ...ctx.batchState.state.assetsAllBatch.values(),
  ]
    .filter((a) => !!a.assetRegistryId)
    .map((a) => `${a.assetRegistryId}`);

  for (const blocksSubBatch of splitIntoBatches(ctx.blocks, 15)) {
    await Promise.all(
      blocksSubBatch.map((block) =>
        processAssetsHistoricalDataAtBlock({
          assetIds,
          block: block.header,
          ctx,
        })
      )
    );
  }
}
