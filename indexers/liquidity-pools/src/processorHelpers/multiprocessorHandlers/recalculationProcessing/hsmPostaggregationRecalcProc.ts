import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import {
  ChainActivityTraceManager,
} from '../../../chainActivityTracingManagers';
import { saveAllBatchAccounts } from '../../../handlers/accounts';
import { handleBuySellOperations } from '../../../handlers/buySellOperations';
import { handleEvm } from '../../../handlers/evmLog';
import { ensureAaveFacilitators } from '../../../handlers/facilitator';
import { HistoricalDataManager } from '../../../handlers/historicalData';
import {
  processHsmpoolAssetNormalizedVolumes,
} from '../../../handlers/pools/normalizedVolumesInBaseAsset/hsmpoolAssetVolumesNormalized';
import {
  handleHsmCollateralEvents,
} from '../../../handlers/pools/pools/hsmpool/collaterals';
import {
  ensureHsmCollaterals,
} from '../../../handlers/pools/pools/hsmpool/collaterals/hsmCollateral';
import { ensureHsmpool } from '../../../handlers/pools/pools/hsmpool/hsmPool';
import {
  processHsmpoolAssetBalanceHistoricalData,
} from '../../../handlers/pools/pools/hsmpool/hsmpoolAssetHistData';
import { handleRelayChainBlocks } from '../../../handlers/relayChain';
import { handleBroadcastSwappedEvents } from '../../../handlers/swap';
import {
  AccountAssetBalanceHistoricalData,
  Asset,
  AssetSpotPriceHistoricalData,
} from '../../../model';
import { getParsedEventsData } from '../../../parsers/batchBlocksParser';
import { StorageResolver } from '../../../parsers/storageResolver';
import { SqdProcessorContext } from '../../../processor';
import { ProcessorStatusManager } from '../../../processorStatusManager';
import {
  MoneyMarketContractsManager,
} from '../../../utils/evmTools/moneyMarketContractsManager';
import { prefetchGenericPersistentData } from '../../prefetchHelpers';

export async function aggregateHsmRelatedDataOnPostAggregationMode(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  await handleRelayChainBlocks(ctx);

  console.time('processExtrinsics');
  await ChainActivityTraceManager.processExtrinsics(ctx);
  console.timeEnd('processExtrinsics');

  console.time('saveActivityTraceEntities');
  await ChainActivityTraceManager.saveActivityTraceEntities(ctx);
  console.timeEnd('saveActivityTraceEntities');

  console.time('getParsedEventsData');
  /**
   * getParsedEventsData must be executed ONLY after
   * ChainActivityTraceManager.processExtrinsics method execution, because
   * getParsedEventsData needs already compiled traceIds.
   */
  const parsedData = await getParsedEventsData(ctx);
  console.timeEnd('getParsedEventsData');

  await StorageResolver.getInstance().init({
    ctx: ctx,
    blockNumberFrom: ctx.blocks[0].header.height,
    blockNumberTo: ctx.blocks[ctx.blocks.length - 1].header.height,
  });

  console.time('prefetchGenericPersistentData');
  await prefetchGenericPersistentData(ctx);
  console.timeEnd('prefetchGenericPersistentData');

  console.time('initContractInstances');
  await MoneyMarketContractsManager.getInstance().initContractInstances({
    ctx: ctx,
    blockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
  console.timeEnd('initContractInstances');

  // await ensureNativeToken(ctx);
  //
  // console.time('actualiseAssets');
  // await actualiseAssets(ctx);
  // console.timeEnd('actualiseAssets');

  ctx.batchState.state.assetsAll = new Map(
    (
      await ctx.storeUtils.findWithLogs(Asset, {
        where: {},
        relations: {
          underlyingAsset: true,
          aToken: true,
          variableDebtToken: true,
          bondUnderlyingAsset: true,
        },
      }, { className: 'Asset' })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.assetsSpotPriceHistoricalDataBatch = new Map(
    (
      await ctx.storeUtils.findWithLogs(AssetSpotPriceHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          assetInHistData: true,
          assetIn: true,
          assetOut: true,
        },
      }, { className: 'AssetSpotPriceHistoricalData' })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.accountAssetBalanceHistoricalData = new Map(
    (
      await ctx.storeUtils.findWithLogs(AccountAssetBalanceHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          account: true,
          asset: true,
        },
      }, { className: 'AccountAssetBalanceHistoricalData' })
    ).map((p) => [p.id, p])
  );

  console.time('ensureAaveFacilitators');
  await ensureAaveFacilitators(ctx);
  console.timeEnd('ensureAaveFacilitators');

  console.time('ensureHsmpool && ensureHsmCollaterals');
  await ensureHsmpool(ctx);
  await ensureHsmCollaterals(ctx);
  console.timeEnd('ensureHsmpool && ensureHsmCollaterals');

  console.time('handleHsmCollateralEvents');
  await handleHsmCollateralEvents(ctx, parsedData);
  console.timeEnd('handleHsmCollateralEvents');

  console.time('handleBroadcastSwappedEvents');
  await handleBroadcastSwappedEvents(ctx, parsedData);
  console.timeEnd('handleBroadcastSwappedEvents');

  console.time('handleBuySellOperations');
  await handleBuySellOperations(ctx, parsedData);
  console.timeEnd('handleBuySellOperations');

  console.time('handleEvm');
  await handleEvm(ctx, parsedData);
  console.timeEnd('handleEvm');

  console.time('saveAllBatchAccounts');
  await saveAllBatchAccounts(ctx);
  console.timeEnd('saveAllBatchAccounts');

  await processHsmpoolAssetNormalizedVolumes({ ctx });

  console.time('processHsmpoolAssetBalanceHistoricalData');
  await processHsmpoolAssetBalanceHistoricalData({ ctx });
  console.timeEnd('processHsmpoolAssetBalanceHistoricalData');

  console.time('saveHistoricalDataBulk');
  await HistoricalDataManager.saveHistoricalDataBulk(ctx);
  console.timeEnd('saveHistoricalDataBulk');

  console.time('saveActivityTraceEntities');
  await ChainActivityTraceManager.saveActivityTraceEntities(ctx);
  console.timeEnd('saveActivityTraceEntities');

  console.time('handleHistoricalVolumesBatchEntriesLists');
  await HistoricalDataManager.handleHistoricalVolumesBatchEntriesLists(ctx);
  console.timeEnd('handleHistoricalVolumesBatchEntriesLists');

  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}
