import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import { processPoolsNormalizedVolumes } from '../../../handlers/pools/normalizedVolumesInBaseAsset';
import {
  AccountAssetBalanceHistoricalData,
  Asset,
  AssetsPairVolumeHistoricalData,
  AssetSpotPriceHistoricalData,
  AssetVolumeHistoricalData,
  Block,
  HsmpoolAssetHistoricalData,
  LbppoolVolumeHistoricalData,
  OmnipoolAssetVolumeHistoricalData,
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
  Swap,
  SwapAssetBalanceType,
  XykpoolVolumeHistoricalData,
} from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import { ProcessorStatusManager } from '../../../processorStatusManager';
import {
  prefetchGenericPersistentData,
  prefetchGenericPersistentDataWithLogs,
} from '../../prefetchHelpers';
import {
  getOldAssetVolume,
  handleAssetVolumeUpdates,
  processAssetNormalizedVolumes,
} from '../../../handlers/assets/volume';
import { BigNumber } from '../../../utils/bignumber';
import {
  getOldLbpVolume,
  getOldOmnipoolAssetVolume,
  getOldStablepoolAssetVolume,
  getOldStablepoolVolume,
  getOldXykVolume,
  getPoolAssetPreviousVolumeFromCache,
  getPoolPreviousVolumeFromCache,
} from '../../../handlers/pools/volumes';
import { getOldHsmAssetHistDataEntity } from '../../../handlers/pools/pools/hsmpool/hsmpoolAssetHistData';
import {
  handleAccountTotalBalance,
  handleLiquidityBalancesInTotalBalances,
  handleUnchangedAccountAssetBalances,
} from '../../../handlers/balances/accountTotalBalance';
import { HistoricalDataManager } from '../../../handlers/historicalData';
import { LatestProcessedDataCacheManager } from '../../../utils/latestProcessedDataCacheManager';
import {
  correlateAssetSpotPrices,
  fetchAndCorrelateAssetSpotPrices,
} from '../../utils';
import { accountLiquidityAndTotalBalancesProcessing } from './accountLiquidityAndTotalBalancesProcessing';
import { accountBalancesFullProcessing } from './accountBalancesFullProcessing';
import { accountTotalBalancesProcessing } from './accountTotalBalancesProcessing';
import { handleRelayChainBlocks } from '../../../handlers/relayChain';
import { ChainActivityTraceManager } from '../../../chainActivityTracingManagers';
import { getParsedEventsData } from '../../../parsers/batchBlocksParser';
import { StorageResolver } from '../../../parsers/storageResolver';
import { prefetchOrInitAllBatchAccounts } from '../../../handlers/accounts';
import { AaveMoneyMarketManager } from '../../../utils/evmTools/aave/aaveMoneyMarketManager';
import { omnipoolPositionsDepositsProcessing } from './omnipoolPositionsDepositsProcessing';
import { xykDepositsProcessing } from './xykDepositsProcessing';
import { handleUniquesEvents } from '../../../handlers/uniques';
import { getOrCreateAsset } from '../../../handlers/assets/asset';
import { getAssetsPairPrice } from '../../../handlers/assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../../utils/helpers';
import {
  AaveMoneyMarketsRegistry
} from '../../../utils/evmTools/aave/aaveMoneyMarketsRegistry/aaveMoneyMarketsRegistry';

/**
 *  Current reaggregation logic normalize and reaggregate data after merging from
 *  multiple shards to single indexer.
 *
 *  To control applying reaggregation, REAGGREGATION_PROCESSING_FLOW_TRIGGERS env
 *  variable can be used. Add appropriate trigger name to the comma separated
 *  list. Check trigger names in a section below.
 *
 *  Data sections for reaggregation:
 *  - AssetVolumeHistoricalData - reaggregate total volumes - [trigger: ASSET_VOLUME_HISTORICAL_DATA_TOTALS]
 *  - LbppoolVolumeHistoricalData - reaggregate total volumes - [trigger: LBPPOOL_VOLUME_HISTORICAL_DATA_TOTALS]
 *  - XykpoolVolumeHistoricalData - reaggregate total volumes - [trigger: XYKPOOL_VOLUME_HISTORICAL_DATA_TOTALS]
 *  - OmnipoolAssetVolumeHistoricalData - reaggregate total volumes - [trigger: OMNIPOOL_ASSET_VOLUME_HISTORICAL_DATA_TOTALS]
 *  - StableswapVolumeHistoricalData, StableswapAssetVolumeHistoricalData - reaggregate total volumes -[trigger: STABLESWAP_VOLUME_HISTORICAL_DATA_TOTALS]
 *  - HsmpoolAssetHistoricalData - reaggregate total volume volumes - [trigger: HSMPOOL_ASSET_HISTORICAL_DATA_TOTAL_VOLS]
 *
 *  - Reaggregate Omnipool Positions and Deposits entities and events - [trigger: OMNIPOOL_POSITIONS_DEPOSITS_FULL_HISTORY]
 *  - Reaggregate XYK Deposits entities and events - [trigger: XYKPOOL_DEPOSITS_FULL_HISTORY]
 *  - Reaggregate all Account Asset, Liquidity, Total balances - [trigger: ACCOUNT_BALANCES_ALL_FULL_HISTORY]
 *  - Reaggregate all Account Liquidity, Total balances (without asset balances reaggregation) - [trigger: ACCOUNT_LIQUIDITY_AND_TOTAL_BALANCES]
 *  - Reaggregate only Total balances - [trigger: ACCOUNT_TOTAL_BALANCES]
 *
 *  - Commit AssetPairVolumes, AssetPrices to Redis TimeSeries - [trigger: REDIS_COMMIT_ASSET_PRICES_VOLUMES]
 *  - Commit AccountTotalBalances to Redis TimeSeries - [trigger: REDIS_COMMIT_ACCOUNT_BALANCES]
 *
 * Following tables must be truncated before reaggregation:
 *  - [ OMNIPOOL_POSITIONS_DEPOSITS_FULL_HISTORY ]:
 *      - omnipool_liquidity_position,
 *      - omnipool_liquidity_position_event,
 *      - omnipool_yield_farm_deposit,
 *      - omnipool_yield_farm_deposit_event
 *
 *  - [ XYKPOOL_DEPOSITS_FULL_HISTORY ]:
 *      - xyk_yield_farm_deposit,
 *      - xyk_yield_farm_deposit_event
 *
 *  - [ ACCOUNT_LIQUIDITY_AND_TOTAL_BALANCES ]:
 *      - account_total_balance_historical_data,
 *      - account_total_balance_historical_data_log,
 *      - account_total_balance_latest
 *      - account_liquidity_balance_historical_data,
 *      - account_liquidity_balance_latest
 *      - account_asset_balance_latest
 *
 *  - [ ACCOUNT_TOTAL_BALANCES ]:
 *      - account_total_balance_historical_data,
 *      - account_total_balance_historical_data_log,
 *
 *  - [ ACCOUNT_BALANCES_ALL_FULL_HISTORY ]:
 *      - account_total_balance_historical_data,
 *      - account_total_balance_historical_data_log,
 *      - account_liquidity_balance_latest,
 *      - account_liquidity_balance_historical_data,
 *      - account_asset_balance_latest,
 *      - account_asset_balance_historical_data,
 *      - account_processing_status
 *
 *  Default recommended data sections list:
 *  ASSET_VOLUME_HISTORICAL_DATA_TOTALS,LBPPOOL_VOLUME_HISTORICAL_DATA_TOTALS,XYKPOOL_VOLUME_HISTORICAL_DATA_TOTALS,OMNIPOOL_ASSET_VOLUME_HISTORICAL_DATA_TOTALS,STABLESWAP_VOLUME_HISTORICAL_DATA_TOTALS,HSMPOOL_ASSET_HISTORICAL_DATA_TOTAL_VOLS,REDIS_COMMIT_ASSET_PRICES_VOLUMES,REDIS_COMMIT_ACCOUNT_BALANCES
 *
 */

export async function handleHarvesterPostMergeReaggregation(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  const dataSectionsToProcess =
    ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_FLOW_TRIGGERS;

  if (dataSectionsToProcess.has('NONE'))
    throw new Error('No data sections to process');

  let parsedData = null;

  await Promise.all([
    (async () => {
      await handleRelayChainBlocks(ctx);

      console.time('processExtrinsics');
      await ChainActivityTraceManager.processExtrinsics(ctx);
      console.timeEnd('processExtrinsics');

      console.time('getParsedEventsData');
      /**
       * getParsedEventsData must be executed ONLY after
       * ChainActivityTraceManager.processExtrinsics method execution, because
       * getParsedEventsData needs already compiled traceIds.
       */
      parsedData = await getParsedEventsData(ctx);
      console.timeEnd('getParsedEventsData');

      await AaveMoneyMarketsRegistry.getInstance().initContractInstances({
        ctx: ctx,
        blockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
        invalidateReservesCache:
          AaveMoneyMarketsRegistry.getInstance().isMmReservesCacheInvalidationRequired(
            parsedData
          ),
      });

      await StorageResolver.getInstance().init({
        ctx: ctx,
        blockNumberFrom: ctx.blocks[0].header.height,
        blockNumberTo: ctx.blocks[ctx.blocks.length - 1].header.height,
      });

      await prefetchOrInitAllBatchAccounts(ctx);
    })(),
    prefetchGenericPersistentDataWithLogs(ctx, false),
  ]);

  if (!parsedData) throw new Error('parsedData is null');

  console.time('prefetchSpecificData');

  ctx.batchState.state.batchBlocks = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        Block,
        {
          where: {
            height: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          order: {
            height: 'ASC',
          },
        },
        { className: 'Block' }
      )
    ).map((p) => [p.id, p])
  );

  await fetchAndCorrelateAssetSpotPrices(ctx);

  ctx.batchState.state.assetsPairVolumeHistoricalDataBatch = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        AssetsPairVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'AssetSpotPriceHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.lbpPoolVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        LbppoolVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            pool: true,
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'LbppoolVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.xykPoolVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        XykpoolVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            pool: true,
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'XykpoolVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.omnipoolAssetVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        OmnipoolAssetVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            omnipoolAsset: true,
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'OmnipoolAssetVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolVolumeCollections = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        StableswapVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            pool: true,
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'StableswapVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolAssetVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        StableswapAssetVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            volumesCollection: { pool: true },
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'StableswapAssetVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.assetVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        AssetVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'AssetVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.hsmpoolAssetHistData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        HsmpoolAssetHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'HsmpoolAssetHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  console.timeEnd('prefetchSpecificData');

  /**
   * ===========================================================================
   * ==================== Assets volumes reaggregation =========================
   * ===========================================================================
   */

  console.time('Assets volumes reaggregation');

  if (dataSectionsToProcess.has('ASSET_VOLUME_HISTORICAL_DATA_TOTALS')) {
    if (
      ctx.blocks[ctx.blocks.length - 1].header.specVersion <
      ctx.appConfig.UNIFIED_EVENTS_GENESIS_SPEC_VERSION
    ) {
      ctx.batchState.state.swaps = new Map(
        (
          await ctx.storeUtils.findWithLogs(
            Swap,
            {
              where: {
                paraBlockHeight: Between(
                  ctx.blocks[0].header.height,
                  ctx.blocks[ctx.blocks.length - 1].header.height
                ),
              },
              relations: {
                inputs: true,
                outputs: true,
              },
              order: {
                paraBlockHeight: 'ASC',
              },
            },
            { className: 'AssetSpotPriceHistoricalData' }
          )
        ).map((p) => [p.id, p])
      );

      for (const swap of ctx.batchState.state.swaps.values()) {
        const inputs = swap.inputs.filter(
          (i) => i.assetBalanceType === SwapAssetBalanceType.Input
        );
        const outputs = swap.outputs.filter(
          (i) => i.assetBalanceType === SwapAssetBalanceType.Output
        );
        try {
          await handleAssetVolumeUpdates(ctx, {
            paraBlockHeight: swap.paraBlockHeight,
            assetInId: inputs[0].assetId,
            assetOutId: outputs[0].assetId,
            assetInAmount: inputs[0].amount,
            assetOutAmount: outputs[0].amount,
          });
        } catch (e) {
          console.log(e);
        }
      }
      console.time(`processAssetNormalizedVolumes`);
      await processAssetNormalizedVolumes({ ctx });
      console.timeEnd(`processAssetNormalizedVolumes`);
    } else {
      for (const processingAssetVolume of ctx.batchState.state.assetVolumes.values()) {
        const previousAssetVolume =
          ctx.batchState.getPreviousHistDataEntity({
            entitiesMap: ctx.batchState.state.assetVolumes,
            entityId: processingAssetVolume.assetId,
            currentBlockHeight: processingAssetVolume.paraBlockHeight,
            blockHeightValPosition: 1,
          }) ||
          (await getOldAssetVolume({
            ctx,
            assetId: processingAssetVolume.assetId,
            currentBlockHeight: processingAssetVolume.paraBlockHeight,
          }));

        processingAssetVolume.totalVolumeIn =
          (previousAssetVolume?.totalVolumeIn ?? 0n) +
          processingAssetVolume.volumeIn;

        processingAssetVolume.totalVolumeOut =
          (previousAssetVolume?.totalVolumeOut ?? 0n) +
          processingAssetVolume.volumeOut;

        processingAssetVolume.totalVolumeInNorm = BigNumber(
          previousAssetVolume?.totalVolumeInNorm ?? '0'
        )
          .plus(processingAssetVolume.volumeInNorm ?? '0')
          .toFixed();

        processingAssetVolume.totalVolumeOutNorm = BigNumber(
          previousAssetVolume?.totalVolumeOutNorm ?? '0'
        )
          .plus(processingAssetVolume.volumeOutNorm ?? '0')
          .toFixed();

        ctx.batchState.state.assetVolumes.set(
          processingAssetVolume.id,
          processingAssetVolume
        );
      }
    }

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.assetVolumes.values())
    );

    console.timeEnd('Assets volumes reaggregation');
  }
  /**
   * ===========================================================================
   * ==================== Pools volumes reaggregation =========================
   * ===========================================================================
   */

  /**
   * --------------------------- LBP Pool volume ------------------------------
   */

  if (dataSectionsToProcess.has('LBPPOOL_VOLUME_HISTORICAL_DATA_TOTALS')) {
    console.time('LBP Pool volume');

    for (const processingLbppoolVolume of ctx.batchState.state.lbpPoolVolumes.values()) {
      const previousVolume =
        ctx.batchState.getPreviousHistDataEntity({
          entitiesMap: ctx.batchState.state.lbpPoolVolumes,
          entityId: processingLbppoolVolume.pool.id,
          currentBlockHeight: processingLbppoolVolume.paraBlockHeight,
          blockHeightValPosition: 1,
        }) ||
        (await getOldLbpVolume({
          ctx,
          poolId: processingLbppoolVolume.pool.id,
          currentBlockHeight: processingLbppoolVolume.paraBlockHeight,
        }));

      processingLbppoolVolume.assetATotalVolIn =
        (previousVolume?.assetATotalVolIn ?? 0n) +
        processingLbppoolVolume.assetAVolIn;

      processingLbppoolVolume.assetBTotalVolIn =
        (previousVolume?.assetBTotalVolIn ?? 0n) +
        processingLbppoolVolume.assetBVolIn;

      processingLbppoolVolume.assetATotalVolOut =
        (previousVolume?.assetATotalVolOut ?? 0n) +
        processingLbppoolVolume.assetAVolOut;

      processingLbppoolVolume.assetBTotalVolOut =
        (previousVolume?.assetBTotalVolOut ?? 0n) +
        processingLbppoolVolume.assetBVolOut;

      processingLbppoolVolume.assetAFeesTotalVol =
        (previousVolume?.assetAFeesTotalVol ?? 0n) +
        processingLbppoolVolume.assetAFeeVol;

      processingLbppoolVolume.assetBFeesTotalVol =
        (previousVolume?.assetBFeesTotalVol ?? 0n) +
        processingLbppoolVolume.assetBFeeVol;

      // -------

      processingLbppoolVolume.assetATotalVolInNorm = BigNumber(
        previousVolume?.assetATotalVolInNorm ?? '0'
      )
        .plus(processingLbppoolVolume.assetAVolInNorm ?? '0')
        .toFixed();

      processingLbppoolVolume.assetBTotalVolInNorm = BigNumber(
        previousVolume?.assetBTotalVolInNorm ?? '0'
      )
        .plus(processingLbppoolVolume.assetBVolInNorm ?? '0')
        .toFixed();

      // -------

      processingLbppoolVolume.assetATotalVolOutNorm = BigNumber(
        previousVolume?.assetATotalVolOutNorm ?? '0'
      )
        .plus(processingLbppoolVolume.assetAVolOutNorm ?? '0')
        .toFixed();

      processingLbppoolVolume.assetBTotalVolOutNorm = BigNumber(
        previousVolume?.assetBTotalVolOutNorm ?? '0'
      )
        .plus(processingLbppoolVolume.assetBVolOutNorm ?? '0')
        .toFixed();

      // -------

      processingLbppoolVolume.assetAFeesTotalVolNorm = BigNumber(
        previousVolume?.assetAFeesTotalVolNorm ?? '0'
      )
        .plus(processingLbppoolVolume.assetAFeeVolNorm ?? '0')
        .toFixed();

      processingLbppoolVolume.assetBFeesTotalVolNorm = BigNumber(
        previousVolume?.assetBFeesTotalVolNorm ?? '0'
      )
        .plus(processingLbppoolVolume.assetBFeeVolNorm ?? '0')
        .toFixed();

      // -------

      ctx.batchState.state.lbpPoolVolumes.set(
        processingLbppoolVolume.id,
        processingLbppoolVolume
      );
    }

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.lbpPoolVolumes.values())
    );

    console.timeEnd('LBP Pool volume');
  }
  /**
   * --------------------------- XYK Pool volume ------------------------------
   */
  if (dataSectionsToProcess.has('XYKPOOL_VOLUME_HISTORICAL_DATA_TOTALS')) {
    console.time('XYK Pool volume');
    for (const processingXykpoolVolume of ctx.batchState.state.xykPoolVolumes.values()) {
      const previousVolume =
        ctx.batchState.getPreviousHistDataEntity({
          entitiesMap: ctx.batchState.state.xykPoolVolumes,
          entityId: processingXykpoolVolume.pool.id,
          currentBlockHeight: processingXykpoolVolume.paraBlockHeight,
          blockHeightValPosition: 1,
        }) ||
        (await getOldXykVolume({
          ctx,
          poolId: processingXykpoolVolume.pool.id,
          currentBlockHeight: processingXykpoolVolume.paraBlockHeight,
        }));

      processingXykpoolVolume.assetATotalVolIn =
        (previousVolume?.assetATotalVolIn ?? 0n) +
        processingXykpoolVolume.assetAVolIn;

      processingXykpoolVolume.assetBTotalVolIn =
        (previousVolume?.assetBTotalVolIn ?? 0n) +
        processingXykpoolVolume.assetBVolIn;

      processingXykpoolVolume.assetATotalVolOut =
        (previousVolume?.assetATotalVolOut ?? 0n) +
        processingXykpoolVolume.assetAVolOut;

      processingXykpoolVolume.assetBTotalVolOut =
        (previousVolume?.assetBTotalVolOut ?? 0n) +
        processingXykpoolVolume.assetBVolOut;

      processingXykpoolVolume.assetAFeesTotalVol =
        (previousVolume?.assetAFeesTotalVol ?? 0n) +
        processingXykpoolVolume.assetAFeeVol;

      processingXykpoolVolume.assetBFeesTotalVol =
        (previousVolume?.assetBFeesTotalVol ?? 0n) +
        processingXykpoolVolume.assetBFeeVol;

      // -------

      processingXykpoolVolume.assetATotalVolInNorm = BigNumber(
        previousVolume?.assetATotalVolInNorm ?? '0'
      )
        .plus(processingXykpoolVolume.assetAVolInNorm ?? '0')
        .toFixed();

      processingXykpoolVolume.assetBTotalVolInNorm = BigNumber(
        previousVolume?.assetBTotalVolInNorm ?? '0'
      )
        .plus(processingXykpoolVolume.assetBVolInNorm ?? '0')
        .toFixed();

      // -------

      processingXykpoolVolume.assetATotalVolOutNorm = BigNumber(
        previousVolume?.assetATotalVolOutNorm ?? '0'
      )
        .plus(processingXykpoolVolume.assetAVolOutNorm ?? '0')
        .toFixed();

      processingXykpoolVolume.assetBTotalVolOutNorm = BigNumber(
        previousVolume?.assetBTotalVolOutNorm ?? '0'
      )
        .plus(processingXykpoolVolume.assetBVolOutNorm ?? '0')
        .toFixed();

      // -------

      processingXykpoolVolume.assetAFeesTotalVolNorm = BigNumber(
        previousVolume?.assetAFeesTotalVolNorm ?? '0'
      )
        .plus(processingXykpoolVolume.assetAFeeVolNorm ?? '0')
        .toFixed();

      processingXykpoolVolume.assetBFeesTotalVolNorm = BigNumber(
        previousVolume?.assetBFeesTotalVolNorm ?? '0'
      )
        .plus(processingXykpoolVolume.assetBFeeVolNorm ?? '0')
        .toFixed();

      // -------

      ctx.batchState.state.xykPoolVolumes.set(
        processingXykpoolVolume.id,
        processingXykpoolVolume
      );
    }

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.xykPoolVolumes.values())
    );

    console.timeEnd('XYK Pool volume');
  }
  /**
   * --------------------------- Omnipool Asset volume ------------------------------
   */
  if (
    dataSectionsToProcess.has('OMNIPOOL_ASSET_VOLUME_HISTORICAL_DATA_TOTALS')
  ) {
    console.time('Omnipool Asset volume');

    for (const processingAssetVolume of ctx.batchState.state.omnipoolAssetVolumes.values()) {
      const previousAssetHistVolume =
        (getPoolAssetPreviousVolumeFromCache(
          ctx.batchState.state.omnipoolAssetVolumes,
          processingAssetVolume.omnipoolAsset.id,
          processingAssetVolume.paraBlockHeight
        ) as OmnipoolAssetVolumeHistoricalData | undefined) ||
        (await getOldOmnipoolAssetVolume({
          ctx,
          omnipoolAssetId: processingAssetVolume.omnipoolAsset.id,
          currentBlockHeight: processingAssetVolume.paraBlockHeight,
        }));

      processingAssetVolume.assetTotalVolIn =
        (previousAssetHistVolume?.assetTotalVolIn ?? 0n) +
        processingAssetVolume.assetVolIn;

      processingAssetVolume.assetTotalVolOut =
        (previousAssetHistVolume?.assetTotalVolOut ?? 0n) +
        processingAssetVolume.assetVolOut;

      processingAssetVolume.assetTotalFeesVol =
        (previousAssetHistVolume?.assetTotalFeesVol ?? 0n) +
        processingAssetVolume.assetFeeVol;

      // -------

      processingAssetVolume.assetTotalVolInNorm = BigNumber(
        previousAssetHistVolume?.assetTotalVolInNorm ?? '0'
      )
        .plus(processingAssetVolume.assetVolInNorm ?? '0')
        .toFixed();

      processingAssetVolume.assetTotalVolOutNorm = BigNumber(
        previousAssetHistVolume?.assetTotalVolOutNorm ?? '0'
      )
        .plus(processingAssetVolume.assetVolOutNorm ?? '0')
        .toFixed();

      processingAssetVolume.assetTotalFeesVolNorm = BigNumber(
        previousAssetHistVolume?.assetTotalFeesVolNorm ?? '0'
      )
        .plus(processingAssetVolume.assetFeeVolNorm ?? '0')
        .toFixed();

      ctx.batchState.state.omnipoolAssetVolumes.set(
        processingAssetVolume.id,
        processingAssetVolume
      );
    }
    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.omnipoolAssetVolumes.values())
    );
    console.timeEnd('Omnipool Asset volume');
  }
  /**
   * --------------------------- Stableswap Asset volume ------------------------------
   */
  if (dataSectionsToProcess.has('STABLESWAP_VOLUME_HISTORICAL_DATA_TOTALS')) {
    console.time('Stableswap Asset volume');

    const assetVolumesIndexedByBlockAndPool: Map<
      string,
      StableswapAssetVolumeHistoricalData[]
    > = new Map();

    for (const processingAssetVolume of ctx.batchState.state.stablepoolAssetVolumes.values()) {
      const previousAssetHistVolume =
        (getPoolAssetPreviousVolumeFromCache(
          ctx.batchState.state.stablepoolAssetVolumes,
          `${processingAssetVolume.volumesCollection.pool.id}-${processingAssetVolume.assetId}`,
          processingAssetVolume.paraBlockHeight
        ) as StableswapAssetVolumeHistoricalData | undefined) ||
        (await getOldStablepoolAssetVolume({
          ctx,
          assetId: processingAssetVolume.assetId,
          poolId: processingAssetVolume.volumesCollection.pool.id,
          currentBlockHeight: processingAssetVolume.paraBlockHeight,
        }));

      processingAssetVolume.assetTotalVolIn =
        (previousAssetHistVolume?.assetTotalVolIn ?? 0n) +
        processingAssetVolume.assetVolIn;

      processingAssetVolume.assetTotalVolOut =
        (previousAssetHistVolume?.assetTotalVolOut ?? 0n) +
        processingAssetVolume.assetVolOut;

      processingAssetVolume.assetTotalFeesVol =
        (previousAssetHistVolume?.assetTotalFeesVol ?? 0n) +
        processingAssetVolume.assetFeeVol;

      // ---------

      processingAssetVolume.assetTotalVolInNorm = BigNumber(
        previousAssetHistVolume?.assetTotalVolInNorm ?? '0'
      )
        .plus(processingAssetVolume.assetVolInNorm ?? '0')
        .toFixed();

      processingAssetVolume.assetTotalVolOutNorm = BigNumber(
        previousAssetHistVolume?.assetTotalVolOutNorm ?? '0'
      )
        .plus(processingAssetVolume.assetVolOutNorm ?? '0')
        .toFixed();

      // --------

      if (processingAssetVolume.paraBlockHeight >= 6837787) {
        processingAssetVolume.assetTotalFeesVolNorm = BigNumber(
          previousAssetHistVolume?.assetTotalFeesVolNorm ?? '0'
        )
          .plus(processingAssetVolume.assetFeeVolNorm ?? '0')
          .toFixed();
      } else {
        const asset = await getOrCreateAsset({
          ctx,
          id: processingAssetVolume.assetId,
          ensure: false,
        });
        if (!asset) {
          console.log(
            `Asset ${processingAssetVolume.assetId} not found in the database. Skipping normalization.`
          );
        }

        const assetSpotPrice = getAssetsPairPrice({
          assetInId: processingAssetVolume.assetId,
          blockHeight: processingAssetVolume.paraBlockHeight,
          ctx,
        });

        if (assetSpotPrice && asset && asset.decimals) {
          const assetFeeVolNorm = calcPriceNormalized({
            amount: processingAssetVolume.assetFeeVol,
            spotPrice: assetSpotPrice,
            assetDecimals: asset.decimals,
          });

          processingAssetVolume.assetTotalFeesVolNorm = BigNumber(
            previousAssetHistVolume?.assetTotalFeesVolNorm ?? '0'
          )
            .plus(assetFeeVolNorm)
            .toFixed();
        }
      }

      if (
        !assetVolumesIndexedByBlockAndPool.has(
          processingAssetVolume.volumesCollection.id
        )
      ) {
        assetVolumesIndexedByBlockAndPool.set(
          processingAssetVolume.volumesCollection.id,
          []
        );
      }
      assetVolumesIndexedByBlockAndPool
        .get(processingAssetVolume.volumesCollection.id)
        ?.push(processingAssetVolume);

      ctx.batchState.state.stablepoolAssetVolumes.set(
        processingAssetVolume.id,
        processingAssetVolume
      );
    }

    for (const processingPoolVolume of ctx.batchState.state.stablepoolVolumeCollections.values()) {
      const previousStableswapVolume =
        (getPoolPreviousVolumeFromCache(
          ctx.batchState.state.stablepoolVolumeCollections,
          `${processingPoolVolume.pool.id}`,
          processingPoolVolume.paraBlockHeight
        ) as StableswapVolumeHistoricalData | undefined) ||
        (await getOldStablepoolVolume({
          ctx,
          poolId: processingPoolVolume.pool.id,
          currentBlockHeight: processingPoolVolume.paraBlockHeight,
        }));

      let currentPoolVolInNorm = BigNumber(0);
      let currentPoolVolOutNorm = BigNumber(0);
      let currentPoolFeesVolNorm = BigNumber(0);

      for (const assetVolumes of assetVolumesIndexedByBlockAndPool
        .get(processingPoolVolume.id)
        ?.values() || []) {
        currentPoolVolInNorm = currentPoolVolInNorm.plus(
          assetVolumes.assetVolInNorm
        );
        currentPoolVolOutNorm = currentPoolVolOutNorm.plus(
          assetVolumes.assetVolOutNorm
        );
        currentPoolFeesVolNorm = currentPoolFeesVolNorm.plus(
          assetVolumes.assetFeeVolNorm
        );
      }

      processingPoolVolume.poolVolInNorm = currentPoolVolInNorm.toFixed();
      processingPoolVolume.poolVolOutNorm = currentPoolVolOutNorm.toFixed();
      processingPoolVolume.poolFeesVolNorm = currentPoolFeesVolNorm.toFixed();

      processingPoolVolume.poolTotalVolInNorm = BigNumber(
        previousStableswapVolume?.poolTotalVolInNorm ?? '0'
      )
        .plus(processingPoolVolume.poolVolInNorm ?? '0')
        .toFixed();

      processingPoolVolume.poolTotalVolOutNorm = BigNumber(
        previousStableswapVolume?.poolTotalVolOutNorm ?? '0'
      )
        .plus(processingPoolVolume.poolVolOutNorm ?? '0')
        .toFixed();

      processingPoolVolume.poolTotalFeesVolNorm = BigNumber(
        previousStableswapVolume?.poolTotalFeesVolNorm ?? '0'
      )
        .plus(processingPoolVolume.poolFeesVolNorm ?? '0')
        .toFixed();
    }
    console.timeEnd('Stableswap Asset volume');

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.stablepoolVolumeCollections.values())
    );

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.stablepoolAssetVolumes.values())
    );
  }

  /**
   * ===========================================================================
   * ================= HSM Asset volumes reaggregation =========================
   * ===========================================================================
   */
  if (dataSectionsToProcess.has('HSMPOOL_ASSET_HISTORICAL_DATA_TOTAL_VOLS')) {
    console.time('HSM Asset volumes reaggregation');

    for (const processingAssetVolume of ctx.batchState.state.hsmpoolAssetHistData.values()) {
      const previousAssetHistVolume =
        (ctx.batchState.getPreviousHistDataEntity({
          entitiesMap: ctx.batchState.state.hsmpoolAssetHistData,
          entityId: `${processingAssetVolume.assetId}`,
          currentBlockHeight: processingAssetVolume.paraBlockHeight,
          blockHeightValPosition: 1,
        }) as HsmpoolAssetHistoricalData | undefined) ||
        (await getOldHsmAssetHistDataEntity({
          ctx,
          assetId: processingAssetVolume.assetId,
          currentBlockHeight: processingAssetVolume.paraBlockHeight,
        }));

      processingAssetVolume.assetTotalVolIn =
        (previousAssetHistVolume?.assetTotalVolIn ?? 0n) +
        processingAssetVolume.assetVolIn;

      processingAssetVolume.assetTotalVolOut =
        (previousAssetHistVolume?.assetTotalVolOut ?? 0n) +
        processingAssetVolume.assetVolOut;

      processingAssetVolume.assetTotalFeesVol =
        (previousAssetHistVolume?.assetTotalFeesVol ?? 0n) +
        processingAssetVolume.assetFeeVol;

      // -------

      processingAssetVolume.assetTotalVolInNorm = BigNumber(
        previousAssetHistVolume?.assetTotalVolInNorm ?? '0'
      )
        .plus(processingAssetVolume.assetVolInNorm ?? '0')
        .toFixed();

      processingAssetVolume.assetTotalVolOutNorm = BigNumber(
        previousAssetHistVolume?.assetTotalVolOutNorm ?? '0'
      )
        .plus(processingAssetVolume.assetVolOutNorm ?? '0')
        .toFixed();

      processingAssetVolume.assetTotalFeesVolNorm = BigNumber(
        previousAssetHistVolume?.assetTotalFeesVolNorm ?? '0'
      )
        .plus(processingAssetVolume.assetFeeVolNorm ?? '0')
        .toFixed();

      ctx.batchState.state.hsmpoolAssetHistData.set(
        processingAssetVolume.id,
        processingAssetVolume
      );
    }

    await ctx.storeUtils.upsertWithBatches(
      Array.from(ctx.batchState.state.hsmpoolAssetHistData.values())
    );
    console.timeEnd('HSM Asset volumes reaggregation');
  }

  /**
   * ===========================================================================
   * =========== Omnipool Positions and Deposits reaggregation =================
   * ===========================================================================
   */
  if (dataSectionsToProcess.has('OMNIPOOL_POSITIONS_DEPOSITS_FULL_HISTORY')) {
    await omnipoolPositionsDepositsProcessing(ctx, parsedData);
  }

  /**
   * ===========================================================================
   * ================== XykPool Deposits reaggregation =========================
   * ===========================================================================
   */

  if (dataSectionsToProcess.has('XYKPOOL_DEPOSITS_FULL_HISTORY')) {
    await xykDepositsProcessing(ctx, parsedData);
  }

  if (
    dataSectionsToProcess.has('OMNIPOOL_POSITIONS_DEPOSITS_FULL_HISTORY') ||
    dataSectionsToProcess.has('XYKPOOL_DEPOSITS_FULL_HISTORY')
  ) {
    console.time('handleUniquesEvents');
    await handleUniquesEvents(ctx, parsedData);
    console.timeEnd('handleUniquesEvents');
  }

  /**
   * ===========================================================================
   * ============== Account total balances reaggregation =======================
   * ===========================================================================
   */

  if (dataSectionsToProcess.has('ACCOUNT_BALANCES_ALL_FULL_HISTORY')) {
    await accountBalancesFullProcessing(ctx);
  } else if (
    dataSectionsToProcess.has('ACCOUNT_LIQUIDITY_AND_TOTAL_BALANCES')
  ) {
    await accountLiquidityAndTotalBalancesProcessing(ctx);
  } else if (dataSectionsToProcess.has('ACCOUNT_TOTAL_BALANCES')) {
    await accountTotalBalancesProcessing(ctx);
  }

  /**
   * Aggregate Account Total Balances
   */
  // await handleAccountTotalBalance({ ctx });
  //
  // const allProcessedAccountsPerBlock: Map<number, Set<string>> = new Map();
  //
  // for (const assetBalance of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
  //   if (!allProcessedAccountsPerBlock.has(assetBalance.paraBlockHeight)) {
  //     allProcessedAccountsPerBlock.set(assetBalance.paraBlockHeight, new Set());
  //   }
  //   allProcessedAccountsPerBlock
  //     .get(assetBalance.paraBlockHeight)!
  //     .add(assetBalance.accountId);
  // }
  //
  // /**
  //  * Include Liquidity Balances in Total Balances.
  //  */
  // await handleLiquidityBalancesInTotalBalances({
  //   ctx,
  //   allProcessedAccountsPerBlock,
  // });
  //
  // /**
  //  * Includes Asset Balances unchanged in the current block but existing in the
  //  * previous block.
  //  * IMPORTANT: Can mutate AccountTotalBalanceHistoricalData
  //  */
  // await handleUnchangedAccountAssetBalances({ ctx });
  //
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.accountAssetBalanceHistoricalData.values())
  // );
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.accountTotalBalanceHistoricalData.values())
  // );

  /**
   * ===========================================================================
   * ===========================================================================
   */

  console.time('Commit to redis');

  if (dataSectionsToProcess.has('REDIS_COMMIT_ASSET_PRICES_VOLUMES')) {
    await Promise.all([
      HistoricalDataManager.commitAssetsPairVolumeToRedisTimeSeries(
        Array.from(
          ctx.batchState.state.assetsPairVolumeHistoricalDataBatch.values()
        ),
        ctx
      ),
      HistoricalDataManager.commitAssetPricesToRedisTimeSeries(
        Array.from(
          ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values()
        ),
        ctx
      ),
    ]);
  }

  if (dataSectionsToProcess.has('REDIS_COMMIT_ACCOUNT_BALANCES')) {
    await HistoricalDataManager.commitAccountTotalBalancesToRedisTimeSeries(
      Array.from(
        ctx.batchState.state.accountTotalBalanceHistoricalData.values()
      ),
      ctx
    );
  }

  console.timeEnd('Commit to redis');

  /**
   * ===========================================================================
   * ===========================================================================
   */

  LatestProcessedDataCacheManager.getInstance().setLastAssetSpotPriceHistoricalDataItem(
    Array.from(ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values())
  );

  /**
   * ===========================================================================
   * ===========================================================================
   */
  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}
