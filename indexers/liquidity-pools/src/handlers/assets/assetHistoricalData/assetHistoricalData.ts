import { BlockHeader } from '@subsquid/substrate-processor';
import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../../parsers';
import { getOrCreateAsset } from '../asset';
import { AssetDynamicFee, AssetHistoricalData } from '../../../model';
import { LessThan } from 'typeorm';
import pMap from 'p-map';

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

  await Promise.all(
    assetRegistryIds.map(async (assetRegistryId) => {
      if (
        !totalIssuancePerAssetMap.has(assetRegistryId) ||
        !existentialDepositPerAssetMap.has(assetRegistryId)
      ) {
        return null;
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
        return null;
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
    })
  );
}

export async function getAssetHistDataWithUniqueData(
  src: Map<string, AssetHistoricalData>,
  ctx: SqdProcessorContext<Store>
) {
  const result: Map<string, AssetHistoricalData> = new Map();
  const concurrencyLimit = 1000;

  const assetHistoryIndex = new Map<string, AssetHistoricalData[]>();

  for (const i of (
    src || ctx.batchState.state.assetsHistoricalDataBatch
  ).values()) {
    if (!assetHistoryIndex.has(i.asset.id)) {
      assetHistoryIndex.set(i.asset.id, []);
    }
    assetHistoryIndex.get(i.asset.id)!.push(i);
  }

  for (const [assetId, list] of assetHistoryIndex.entries()) {
    assetHistoryIndex.set(
      assetId,
      list.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
    );
  }

  await pMap(
    Array.from(src.values()),
    async (item) => {
      if (
        await isAssetHistoricalDataUniqueRegardingPreviousRecord({
          currentRecord: item,
          cachedIndexedRecords: assetHistoryIndex,
          ctx,
        })
      ) {
        result.set(item.id, item);
      }
    },
    { concurrency: concurrencyLimit }
  );

  // for (const item of src.values()) {
  //   if (
  //     await isAssetHistoricalDataUniqueRegardingPreviousRecord({
  //       currentRecord: item,
  //       cachedRecords: src,
  //       ctx,
  //     })
  //   )
  //     result.set(item.id, item);
  // }

  return result;
}

export async function isAssetHistoricalDataUniqueRegardingPreviousRecord({
  currentRecord,
  cachedIndexedRecords,
  ctx,
}: {
  currentRecord: AssetHistoricalData;
  cachedIndexedRecords: Map<string, AssetHistoricalData[]>;
  ctx: SqdProcessorContext<Store>;
}) {
  let previousItem = (cachedIndexedRecords.get(currentRecord.asset.id) || [])
    // .sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
    .find((i) => i.paraBlockHeight < currentRecord.paraBlockHeight);

  if (!previousItem) {
    previousItem = await ctx.store.findOne(AssetHistoricalData, {
      where: {
        asset: {
          id: currentRecord.asset.id,
        },
        paraBlockHeight: LessThan(currentRecord.paraBlockHeight),
      },
      order: {
        paraBlockHeight: 'DESC',
      },
    });
  }

  if (!previousItem) {
    return true;
  }

  // const overwriteProps = {
  //   paraBlockHeight: null,
  //   relayBlockHeight: null,
  //   spotPrices: null,
  //   assetPairVolumes: null,
  //   asset: null,
  //   id: null,
  //   block: null,
  // };
  //
  // const prevItemDecorated = {
  //   ...previousItem,
  //   ...overwriteProps,
  // };
  //
  // const currentItemDecorated = {
  //   ...currentRecord,
  //   ...overwriteProps,
  // };

  // return blockHash(prevItemDecorated) !== blockHash(currentItemDecorated);
  // return !isDeepEqual(prevItemDecorated, currentItemDecorated);

  let isEqual = true;

  if (
    previousItem.totalIssuance !== currentRecord.totalIssuance ||
    previousItem.existentialDeposit !== currentRecord.existentialDeposit ||
    previousItem.usdPriceNormalised !== currentRecord.usdPriceNormalised ||
    !!previousItem.dynamicFee !== !!currentRecord.dynamicFee ||
    (!!previousItem.dynamicFee &&
      !!currentRecord.dynamicFee &&
      (previousItem.dynamicFee.assetFee !== currentRecord.dynamicFee.assetFee ||
        previousItem.dynamicFee.protocolFee !==
          currentRecord.dynamicFee.protocolFee))
  ) {
    isEqual = false;
  }

  return !isEqual;
}
