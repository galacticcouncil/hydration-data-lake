import { SqdBlock, SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AaveFacilitatorHistoricalData,
  Asset,
  HsmpoolAssetHistoricalData,
  Swap,
} from '../../../../model';
import { LessThan } from 'typeorm';
import { getOrCreateHsmCollateral } from './collaterals/hsmCollateral';
import { calcPriceNormalized } from '../../../../utils/helpers';
import { BigNumber } from '@galacticcouncil/sdk';
import { getOldAaveFacilitatorHistDataEntity } from '../../../facilitator/historicalData';

export async function handleHsmAssetHistoricalData({
  ctx,
  swap,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  swap: Swap;
  blockHeader: SqdBlock;
}) {
  const involvedAssets = new Map<string, Asset>([
    ...swap.inputs.map((i): [string, Asset] => [i.asset.id, i.asset]),
    ...swap.outputs.map((i): [string, Asset] => [i.asset.id, i.asset]),
    ...swap.fees.map((i): [string, Asset] => [i.asset.id, i.asset]),
  ]);

  for (const processingAsset of involvedAssets.values()) {
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
    });

    if (newHistData)
      ctx.batchState.state.hsmpoolAssetHistData.set(
        newHistData.id,
        newHistData
      );
  }
}

export async function initHsmAssetHistoricalData({
  swap,
  currentHistData,
  oldHistData,
  processingAsset,
  ctx,
  blockHeader,
}: {
  swap: Swap;
  processingAsset: Asset;
  currentHistData?: HsmpoolAssetHistoricalData | undefined;
  oldHistData?: HsmpoolAssetHistoricalData | undefined;
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
}) {
  const block = ctx.batchState.getParaBlockFromCacheByHeight(
    swap.paraBlockHeight
  );

  if (!block) {
    console.log(`Block with height ${swap.paraBlockHeight} not found`);
    return null;
  }

  const newHistDataEntity = new HsmpoolAssetHistoricalData({
    id: processingAsset.id + '-' + swap.paraBlockHeight,
    asset: processingAsset,
    collateral:
      processingAsset.evmAddress !== ctx.appConfig.evm.HOLLAR_CONTRACT_ADDRESS
        ? await getOrCreateHsmCollateral({
            assetRegistryId: processingAsset.assetRegistryId ?? '',
            ctx,
            blockHeader,
          })
        : null,

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
    relayBlockHeight: swap.relayBlockHeight,
    paraBlockHeight: swap.paraBlockHeight,
    block,
  });

  const assetVolIn =
    swap.inputs.find((input) => input.asset.id === processingAsset.id)
      ?.amount || BigInt(0);

  const assetVolOut =
    swap.outputs.find((output) => output.asset.id === processingAsset.id)
      ?.amount || BigInt(0);

  const assetFeeVol = swap.fees.reduce((acc, feeData) => {
    if (feeData.asset.id !== processingAsset.id || !feeData.recipient)
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
  return await ctx.storeUtils.findOneWithLogs(HsmpoolAssetHistoricalData, {
    where: {
      asset: { id: assetId },
      ...(currentBlockHeight
        ? { paraBlockHeight: LessThan(currentBlockHeight) }
        : {}),
    },
    relations: {
      asset: true,
      collateral: true,
    },
    order: {
      paraBlockHeight: 'DESC',
    },
  }, { className: 'HsmpoolAssetHistoricalData' });
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

  for (const currentAssetHistData of hsmpoolAssetHistDataByBatchList) {
    const asset = currentAssetHistData.asset;

    const previousAssetHistData =
      (ctx.batchState.getPreviousHistDataEntity({
        entitiesMap: ctx.batchState.state.hsmpoolAssetHistData,
        entityId: asset.id,
        currentBlockHeight: currentAssetHistData.paraBlockHeight,
        blockHeightValPosition: 1,
      }) as HsmpoolAssetHistoricalData | undefined) ||
      (await getOldHsmAssetHistDataEntity({
        ctx,
        assetId: asset.id,
        currentBlockHeight: currentAssetHistData.paraBlockHeight,
      }));

    if (asset.evmAddress === ctx.appConfig.evm.HOLLAR_CONTRACT_ADDRESS) {
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
          `${ctx.appConfig.HSMPOOL_ADDRESS}-${asset.id}-${currentAssetHistData.paraBlockHeight}`
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
