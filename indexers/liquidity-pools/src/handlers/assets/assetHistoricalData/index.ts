import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AssetDynamicFee, AssetHistoricalData } from '../../../model';
import parsers from '../../../parsers';
import { BlockHeader } from '@subsquid/substrate-processor';
import { splitIntoBatches } from '../../../utils/helpers';
import { OfflineTradeRouterManager } from './utils';
import { getOrCreateAsset } from '../asset';
import { handleSpotPricesIntoAssetsHistoricalData } from './spotPrice';

async function processAssetsHistoricalDataAtBlock({
  assetRegistryIds,
  block,
  ctx,
}: {
  assetRegistryIds: Array<string>;
  block: BlockHeader;
  ctx: SqdProcessorContext<Store>;
}) {
  const totalIssuancePerAssetMap = new Map(
    (
      await parsers.storage.tokens.getManyTokensTotalIssuance({
        block,
        tokenIds: assetRegistryIds,
      })
    )
      .filter((res) => res.amount !== null)
      .map((res) => [res.tokenId, res.amount])
  );

  totalIssuancePerAssetMap.set(
    '0',
    await parsers.storage.balances.getTotalIssuance(block)
  );

  /**
   * We need this fallback because some assets are not present in
   * tokens.totalIssuance storage.
   */
  for (const assetRegistryId of assetRegistryIds) {
    if (!totalIssuancePerAssetMap.has(assetRegistryId))
      totalIssuancePerAssetMap.set(`${assetRegistryId}`, 0n);
  }

  const existentialDepositPerAssetMap = new Map(
    (await parsers.storage.assetRegistry.getAssetMany(assetRegistryIds, block))
      .filter((res) => !!res.data)
      .map((res) => [`${res.assetId}`, res.data])
  );

  const dynamicFeePerAssetMap = new Map(
    (await parsers.storage.dynamicFees.getAssetFeesAll({ block })).map(
      (res) => [`${res.assetId}`, res]
    )
  );

  for (const assetRegistryId of assetRegistryIds) {
    if (
      !totalIssuancePerAssetMap.has(assetRegistryId) ||
      !existentialDepositPerAssetMap.has(assetRegistryId)
    ) {
      console.log(
        'processAssetsHistoricalDataAtBlock :: assetRegistryId - ',
        assetRegistryId,
        totalIssuancePerAssetMap.has(assetRegistryId),
        existentialDepositPerAssetMap.has(assetRegistryId)
      );
      continue;
    }

    const asset = await getOrCreateAsset({
      assetRegistryId: assetRegistryId,
      ensure: false,
      ctx,
    });

    if (!asset) {
      console.log(
        'processAssetsHistoricalDataAtBlock :: asset not found',
        assetRegistryId
      );
      continue;
    }

    const newAssetHistoricalData = new AssetHistoricalData({
      id: `${asset.id}-${block.height}`,
      asset,

      totalIssuance: totalIssuancePerAssetMap.get(assetRegistryId)!,
      existentialDeposit:
        existentialDepositPerAssetMap.get(assetRegistryId)!.existentialDeposit,
      dynamicFee: dynamicFeePerAssetMap.has(assetRegistryId)
        ? new AssetDynamicFee({
            assetFee: dynamicFeePerAssetMap.get(assetRegistryId)!.assetFee,
            protocolFee:
              dynamicFeePerAssetMap.get(assetRegistryId)!.protocolFee,
            timestamp: dynamicFeePerAssetMap.get(assetRegistryId)!.timestamp,
          })
        : null,
      spotPrices: [], // Spot prices will be calculated and injected in further processing steps.
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
  const assetRegistryIds: Array<string> = [
    ...ctx.batchState.state.assetsAllBatch.values(),
  ]
    .filter((a) => !!a.assetRegistryId)
    .map((a) => `${a.assetRegistryId}`);

  /**
   * @description Processes data in a specific sequence to ensure data dependencies are met
   *
   * @important Generic asset historical data must be processed before asset historical spot prices.
   * This ordering is critical because the generic asset historical data serves as a required
   * data source for the OfflinePoolService.
   */
  for (const blocksSubBatch of splitIntoBatches(ctx.blocks, 15)) {
    await Promise.all(
      blocksSubBatch.map((block) =>
        processAssetsHistoricalDataAtBlock({
          assetRegistryIds,
          block: block.header,
          ctx,
        })
      )
    );
  }

  for (const blocksSubBatch of splitIntoBatches(ctx.blocks, 100)) {
    await OfflineTradeRouterManager.getInstance().initForBlocksBatch({
      blockNumbers: blocksSubBatch.map((b) => b.header.height),
      ctx,
    });
    for (const block of blocksSubBatch) {
      await handleSpotPricesIntoAssetsHistoricalData({
        blockHeader: block.header,
        ctx,
      });
    }
  }
}
