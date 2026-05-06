import { LessThan } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import {
  AaveFacilitatorHistoricalData,
  Asset,
  HsmpoolAssetHistoricalData,
  Swap,
} from '../../../../model';
import { SqdBlock, SqdProcessorContext } from '../../../../processor';
import { batchGetOrCreateAssets } from '../../../assets/asset';
import { getOldAaveFacilitatorHistDataEntity } from '../../../facilitator/historicalData';
import { getOrCreateHsmCollateral } from './collaterals/hsmCollateral';

export async function handleHsmAssetHistoricalData({
  ctx,
  swap,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  swap: Swap;
  blockHeader: SqdBlock;
}) {
  // Step 1: Collect all unique asset IDs from inputs, outputs, and fees
  const uniqueAssetIds = new Set<string>();

  // Collect from inputs
  for (const input of swap.inputs) {
    if (input.assetId) uniqueAssetIds.add(input.assetId);
  }

  // Collect from outputs
  for (const output of swap.outputs) {
    if (output.assetId) uniqueAssetIds.add(output.assetId);
  }

  // Collect from fees
  for (const fee of swap.fees) {
    if (fee.assetId) uniqueAssetIds.add(fee.assetId);
  }

  if (uniqueAssetIds.size === 0) return;

  // Step 2: Batch fetch all assets in SINGLE database query (5-10x faster!)
  const assetCache = await batchGetOrCreateAssets({
    ctx,
    ids: Array.from(uniqueAssetIds),
    ensure: true,
    blockHeader,
  });

  // Step 3: Build entries array using fetched assets
  const entries: Array<
    [string, { id: string; evmAddress?: string | null | undefined }]
  > = [];

  // Add inputs
  for (const input of swap.inputs) {
    const asset = assetCache.get(input.assetId);
    if (asset) {
      entries.push([asset.id, { id: asset.id, evmAddress: asset.evmAddress }]);
    }
  }

  // Add outputs
  for (const output of swap.outputs) {
    const asset = assetCache.get(output.assetId);
    if (asset) {
      entries.push([asset.id, { id: asset.id, evmAddress: asset.evmAddress }]);
    }
  }

  // Add fees
  for (const fee of swap.fees) {
    const asset = assetCache.get(fee.assetId);
    if (asset) {
      entries.push([asset.id, { id: asset.id, evmAddress: asset.evmAddress }]);
    }
  }

  const involvedAssetIds = Array.from(new Map(entries).values());

  if (involvedAssetIds.length === 0) return;

  // Step 4: Batch fetch collaterals for all non-Hollar assets in parallel
  const collateralCache = new Map<string, any>();
  await Promise.all(
    involvedAssetIds
      .filter(
        (asset) =>
          asset.evmAddress !== ctx.appConfig.evm.HOLLAR_CONTRACT_ADDRESS
      )
      .map(async (asset) => {
        const collateral = await getOrCreateHsmCollateral({
          assetRegistryId: asset.id,
          ctx,
          blockHeader,
        });
        if (collateral) {
          collateralCache.set(asset.id, collateral);
        }
      })
  );

  // Step 5: Process all assets in parallel
  await Promise.all(
    involvedAssetIds.map(async (processingAsset) => {
      const currentHistData = ctx.batchState.state.hsmpoolAssetHistData.get(
        `${processingAsset.id}-${swap.paraBlockHeight}`
      );

      const oldHistData =
        currentHistData ||
        (ctx.batchState.getPreviousHistDataEntity({
          entitiesMap: ctx.batchState.state.hsmpoolAssetHistData,
          entityId: `${processingAsset.id}`,
          currentBlockHeight: swap.paraBlockHeight,
          blockHeightValPosition: 1,
        }) as HsmpoolAssetHistoricalData | undefined) ||
        (await getOldHsmAssetHistDataEntity({
          ctx,
          assetId: processingAsset.id,
        }));

      const newHistData = await initHsmAssetHistoricalData({
        swap,
        currentHistData,
        oldHistData,
        processingAsset,
        ctx,
        blockHeader,
        assetCache,
        collateralCache,
      });

      if (newHistData) {
        ctx.batchState.state.hsmpoolAssetHistData.set(
          newHistData.id,
          newHistData
        );
      }
    })
  );
}

export async function initHsmAssetHistoricalData({
  swap,
  currentHistData,
  oldHistData,
  processingAsset,
  ctx,
  blockHeader,
  assetCache,
  collateralCache,
}: {
  swap: Swap;
  processingAsset: { id: string; evmAddress?: string | null | undefined };
  currentHistData?: HsmpoolAssetHistoricalData | undefined;
  oldHistData?: HsmpoolAssetHistoricalData | undefined;
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
  assetCache?: Map<string, Asset>;
  collateralCache?: Map<string, any>;
}) {
  const block = ctx.batchState.getParaBlockFromCacheByHeight(
    swap.paraBlockHeight
  );

  if (!block) {
    console.log(`Block with height ${swap.paraBlockHeight} not found`);
    return null;
  }

  // Use cached collateral if available, otherwise fetch
  const collateral =
    processingAsset.evmAddress !== ctx.appConfig.evm.HOLLAR_CONTRACT_ADDRESS
      ? (collateralCache?.get(processingAsset.id) ??
        (await getOrCreateHsmCollateral({
          assetRegistryId: processingAsset.id,
          ctx,
          blockHeader,
        })))
      : null;

  const newHistDataEntity = new HsmpoolAssetHistoricalData({
    id: processingAsset.id + '-' + swap.paraBlockHeight,
    assetId: processingAsset.id,
    collateral,

    freeBalance:
      currentHistData?.freeBalance || oldHistData?.freeBalance || BigInt(0),
    tvlInRefAssetNorm:
      currentHistData?.tvlInRefAssetNorm ||
      oldHistData?.tvlInRefAssetNorm ||
      '0',

    assetVolIn: currentHistData?.assetVolIn || BigInt(0),
    assetVolOut: currentHistData?.assetVolOut || BigInt(0),
    assetFeeVol: currentHistData?.assetFeeVol || BigInt(0),

    assetTotalVolIn:
      currentHistData?.assetTotalVolIn ||
      oldHistData?.assetTotalVolIn ||
      BigInt(0),
    assetTotalVolOut:
      currentHistData?.assetTotalVolOut ||
      oldHistData?.assetTotalVolOut ||
      BigInt(0),
    assetTotalFeesVol:
      currentHistData?.assetTotalFeesVol ||
      oldHistData?.assetTotalFeesVol ||
      BigInt(0),

    assetVolInNorm: currentHistData?.assetVolInNorm || '0',
    assetVolOutNorm: currentHistData?.assetVolOutNorm || '0',
    assetFeeVolNorm: currentHistData?.assetFeeVolNorm || '0',

    assetTotalVolInNorm:
      currentHistData?.assetTotalVolInNorm ||
      oldHistData?.assetTotalVolInNorm ||
      '0',
    assetTotalVolOutNorm:
      currentHistData?.assetTotalVolOutNorm ||
      oldHistData?.assetTotalVolOutNorm ||
      '0',
    assetTotalFeesVolNorm:
      currentHistData?.assetTotalFeesVolNorm ||
      oldHistData?.assetTotalFeesVolNorm ||
      '0',

    paraTimestamp: block?.timestamp,
    paraBlockHeight: swap.paraBlockHeight,
  });

  // Use assetId instead of assetInfo (which doesn't exist)
  const assetVolIn =
    swap.inputs.find((input) => input.assetId === processingAsset.id)?.amount ||
    BigInt(0);

  const assetVolOut =
    swap.outputs.find((output) => output.assetId === processingAsset.id)
      ?.amount || BigInt(0);

  const assetFeeVol = swap.fees.reduce((acc, feeData) => {
    if (feeData.assetId !== processingAsset.id || !feeData.recipientId)
      return acc;
    return acc + feeData.amount;
  }, 0n);

  // SqdBlock volumes
  newHistDataEntity.assetVolIn += assetVolIn;
  newHistDataEntity.assetVolOut += assetVolOut;
  newHistDataEntity.assetFeeVol += assetFeeVol;

  // Total volumes
  newHistDataEntity.assetTotalVolIn += assetVolIn;
  newHistDataEntity.assetTotalVolOut += assetVolOut;
  newHistDataEntity.assetTotalFeesVol += assetFeeVol;

  return newHistDataEntity;
}

export async function getOldHsmAssetHistDataEntity({
  ctx,
  currentBlockHeight,
  assetId,
}: {
  ctx: SqdProcessorContext<Store>;
  assetId: string;
  currentBlockHeight?: number;
}) {
  return await ctx.storeUtils.findOneWithLogs(
    HsmpoolAssetHistoricalData,
    {
      where: {
        assetId: assetId,
        ...(currentBlockHeight
          ? { paraBlockHeight: LessThan(currentBlockHeight) }
          : {}),
      },
      relations: {
        collateral: true,
      },
      order: {
        paraBlockHeight: 'DESC',
      },
    },
    {
      className: 'HsmpoolAssetHistoricalData',
      originCallFn: 'getOldHsmAssetHistDataEntity',
    }
  );
}

export async function processHsmpoolAssetBalanceHistoricalData({
  blockNumbersToProcess,
  ctx,
}: {
  blockNumbersToProcess?: number[];
  ctx: SqdProcessorContext<Store>;
}) {
  let hsmpoolAssetHistDataByBatchList = Array.from(
    ctx.batchState.state.hsmpoolAssetHistData.values()
  ).sort((a, b) => (a.paraBlockHeight > b.paraBlockHeight ? 1 : -1));

  if (blockNumbersToProcess) {
    const blockNumbersToProcessSet = new Set(blockNumbersToProcess);
    hsmpoolAssetHistDataByBatchList = hsmpoolAssetHistDataByBatchList.filter(
      (i) => blockNumbersToProcessSet.has(i.paraBlockHeight)
    );
  }

  // Pre-fetch all unique assets in SINGLE database query (5-10x faster!)
  const uniqueAssetIds = new Set<string>();
  for (const histData of hsmpoolAssetHistDataByBatchList) {
    if (histData.assetId) uniqueAssetIds.add(histData.assetId);
  }

  const assetCache = await batchGetOrCreateAssets({
    ctx,
    ids: Array.from(uniqueAssetIds),
  });

  for (const currentAssetHistData of hsmpoolAssetHistDataByBatchList) {
    const assetId = currentAssetHistData.assetId;
    // Use cached asset instead of fetching
    const asset = assetCache.get(assetId);
    if (!asset) {
      console.log(
        `processHsmpoolAssetNormalizedVolumes :: Asset with id ${assetId} cannot be found.`
      );
      continue;
    }
    const assetEvmAddress = asset.evmAddress;

    const previousAssetHistData =
      (ctx.batchState.getPreviousHistDataEntity({
        entitiesMap: ctx.batchState.state.hsmpoolAssetHistData,
        entityId: assetId,
        currentBlockHeight: currentAssetHistData.paraBlockHeight,
        blockHeightValPosition: 1,
      }) as HsmpoolAssetHistoricalData | undefined) ||
      (await getOldHsmAssetHistDataEntity({
        ctx,
        assetId: assetId,
        currentBlockHeight: currentAssetHistData.paraBlockHeight,
      }));

    if (assetEvmAddress === ctx.appConfig.evm.HOLLAR_CONTRACT_ADDRESS) {
      const latestFacilitatorHistData =
        ctx.batchState.state.aaveFacilitatorsHistData.get(
          `${ctx.appConfig.evm.HSMPOOL_FICILITATOR_ADDRESS}-${currentAssetHistData.paraBlockHeight}`
        ) ||
        (ctx.batchState.getPreviousHistDataEntity({
          entitiesMap: ctx.batchState.state.aaveFacilitatorsHistData,
          entityId: ctx.appConfig.evm.HSMPOOL_FICILITATOR_ADDRESS,
          currentBlockHeight: currentAssetHistData.paraBlockHeight,
          blockHeightValPosition: 1,
        }) as AaveFacilitatorHistoricalData | undefined) ||
        (await getOldAaveFacilitatorHistDataEntity({
          ctx,
          address: ctx.appConfig.evm.HSMPOOL_FICILITATOR_ADDRESS,
          currentBlockHeight: currentAssetHistData.paraBlockHeight,
        }));

      currentAssetHistData.facilitatorHistData =
        latestFacilitatorHistData ?? null;
    } else {
      const latestAssetBalance =
        ctx.batchState.state.accountAssetBalanceHistoricalData.get(
          `${ctx.appConfig.HSMPOOL_ADDRESS}-${assetId}-${currentAssetHistData.paraBlockHeight}`
        );

      currentAssetHistData.freeBalance = latestAssetBalance?.transferable ?? 0n;
      currentAssetHistData.tvlInRefAssetNorm =
        latestAssetBalance?.transferableInRefAssetNorm ?? '0';
    }

    ctx.batchState.state.hsmpoolAssetHistData.set(
      currentAssetHistData.id,
      currentAssetHistData
    );
  }
}
