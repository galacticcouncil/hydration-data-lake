import { BlockHeader } from '@subsquid/substrate-processor';
import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../../parsers';
import { getOrCreateAsset } from '../asset';
import { AssetDynamicFee, AssetHistoricalData } from '../../../model';

export async function processAssetsHistoricalDataAtBlock({
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
    await parsers.storage.balances.getTotalIssuance({ block })
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
    (
      (await parsers.storage.assetRegistry.getAssetsExistentialDepositAll({
        block,
      })) || []
    ).map((res) => [`${res.assetId}`, res])
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

      totalIssuance: totalIssuancePerAssetMap.get(assetRegistryId) ?? 0n,
      existentialDeposit:
        existentialDepositPerAssetMap.get(assetRegistryId)
          ?.existentialDeposit ?? 0n,
      dynamicFee: dynamicFeePerAssetMap.has(assetRegistryId)
        ? new AssetDynamicFee({
            assetFee: dynamicFeePerAssetMap.get(assetRegistryId)!.assetFee,
            protocolFee:
              dynamicFeePerAssetMap.get(assetRegistryId)!.protocolFee,
            timestamp: dynamicFeePerAssetMap.get(assetRegistryId)!.timestamp,
          })
        : null,
      usdPriceNormalised: '0',
      assetPairVolumes: [],
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
