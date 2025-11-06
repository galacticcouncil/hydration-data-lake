import pMap from 'p-map';

import { Store } from '@subsquid/typeorm-store';

import {
  AavepoolHistoricalData,
  AssetHistoricalData,
  ConstantsHistoricalData,
  EmaOracleEntryHistoricalData,
  LbppoolHistoricalData,
  OmnipoolHistoricalData,
  StableswapHistoricalData,
  SwapFillerType,
  XykpoolHistoricalData,
} from '../../../../../model';
import { StorageResolver } from '../../../../../parsers/storageResolver';
import { SqdProcessorContext } from '../../../../../processor';
import {
  MmOracleManager,
} from '../../../../../utils/evmTools/mmOracleEvmManager';
// } from '@galacticcouncil/sdk';
import {
  bigintToNumberSafe,
  publicKeyToSs58,
} from '../../../../../utils/helpers';
import {
  IPersistentConstants,
  IPersistentEmaOracleEntry,
  IPersistentLbpPoolBase,
  IPersistentMmOracleEntry,
  IPersistentOmniPoolBase,
  IPersistentOmniPoolToken,
  IPersistentPoolBase,
  IPersistentPoolToken,
  IPersistentStableSwapBase,
  PersistentAsset,
  PoolType,
} from '../offlineSdk/sdk/src';
import {
  fetchAssetsHistoricalData,
  fetchAssetsHistoricalDataForBlocksRangeResolver,
  fetchConstantsHistoricalData,
  fetchConstantsHistoricalDataForBlocksRangeResolver,
  fetchLbpPoolsHistoricalData,
  fetchLbpPoolsHistoricalDataForBlocksRangeResolver,
  fetchOmnipoolHistoricalData,
  fetchOmnipoolHistoricalDataForBlocksRangeResolver,
  fetchStableswapHistoricalData,
  fetchStableswapHistoricalDataForBlocksRangeResolver,
  fetchXykPoolsHistoricalData,
  fetchXykPoolsHistoricalDataForBlocksRangeResolver,
} from './fetchHistoricalDataHelpers';
import {
  fetchAavePoolsHistoricalData,
  fetchAavePoolsHistoricalDataForBlocksRangeResolver,
} from './fetchHistoricalDataHelpers/fetchAavePoolsHistoricalData';
import {
  fetchEmaOracleEntriesHistoricalData,
  fetchEmaOracleEntriesHistoricalDataForBlocksRangeResolver,
} from './fetchHistoricalDataHelpers/fetchEmaOraclesHistoricalData';

export class OfflineTradeRouterManagerHelper {
  protected SUPPORTED_ASSET_TYPES_SET = new Set([
    'StableSwap',
    'Bond',
    'Token',
    'External',
    'Erc20',
  ]);

  protected constantsHistData: Map<number, ConstantsHistoricalData> = new Map();
  protected emaOraclesHistData: Map<
    number,
    Map<string, EmaOracleEntryHistoricalData>
  > = new Map();
  protected mmOraclesHistData: Map<
    number,
    Map<string, IPersistentMmOracleEntry>
  > = new Map();
  protected assetsHistData: Map<number, Map<string, AssetHistoricalData>> =
    new Map();
  protected lbppoolsHistData: Map<number, Map<string, LbppoolHistoricalData>> =
    new Map();
  protected xykpoolsHistData: Map<number, Map<string, XykpoolHistoricalData>> =
    new Map();
  protected aavepoolsHistData: Map<
    number,
    Map<string, AavepoolHistoricalData>
  > = new Map();
  protected stableswapHistData: Map<
    number,
    Map<string, StableswapHistoricalData>
  > = new Map();
  protected omnipoolHistData: Map<number, OmnipoolHistoricalData> = new Map();

  private getPoolTypeFromFillerType(fillerType: SwapFillerType) {
    switch (fillerType) {
      case SwapFillerType.LBP:
        return PoolType.LBP;
      case SwapFillerType.XYK:
        return PoolType.XYK;
      case SwapFillerType.Stableswap:
        return PoolType.Stable;
      case SwapFillerType.Omnipool:
        return PoolType.Omni;
      case SwapFillerType.AAVE:
        return PoolType.Aave;
      default:
        throw new Error('Unknown pool type');
    }
  }

  private ensureHistDataStorage(blockNumbers: number[]) {
    for (const blockNumber of blockNumbers) {
      this.assetsHistData.set(blockNumber, new Map());
      this.lbppoolsHistData.set(blockNumber, new Map());
      this.xykpoolsHistData.set(blockNumber, new Map());
      this.stableswapHistData.set(blockNumber, new Map());
      this.mmOraclesHistData.set(blockNumber, new Map());
    }
  }

  protected async prefetchAllHistoricalData({
    blockNumbers,
    ctx,
  }: {
    blockNumbers: number[];
    ctx: SqdProcessorContext<Store>;
  }) {
    const blockNumbersSorted = blockNumbers.sort((a, b) => a - b);
    const promises = [
      ctx.extLogger.measure({
        fn: () =>
          this.fetchConstantsHistoricalDataForBlocksRange({
            ctx,
            blockFromNumber: blockNumbersSorted[0],
            blockToNumber: blockNumbersSorted[blockNumbersSorted.length - 1],
          }),
        name: 'fetchConstantsHistoricalDataForBlocksRange',
        actionType: 'other',
        meta: {
          originFnName: 'prefetchAllHistoricalData',
        },
        options: {
          ignoreConsoleLogs: true,
        },
      }),
      ctx.extLogger.measure({
        fn: () =>
          this.fetchEmaOraclesHistoricalDataForBlocksRange({
            ctx,
            blockFromNumber: blockNumbersSorted[0],
            blockToNumber: blockNumbersSorted[blockNumbersSorted.length - 1],
          }),
        name: 'fetchEmaOraclesHistoricalDataForBlocksRange',
        actionType: 'other',
        meta: {
          originFnName: 'prefetchAllHistoricalData',
        },
        options: {
          ignoreConsoleLogs: true,
        },
      }),
      ctx.extLogger.measure({
        fn: () =>
          this.fetchAssetsHistoricalDataForBlocksRange({
            ctx,
            blockFromNumber: blockNumbersSorted[0],
            blockToNumber: blockNumbersSorted[blockNumbersSorted.length - 1],
          }),
        name: 'fetchAssetsHistoricalDataForBlocksRange',
        actionType: 'other',
        meta: {
          originFnName: 'prefetchAllHistoricalData',
        },
        options: {
          ignoreConsoleLogs: true,
        },
      }),
      ctx.extLogger.measure({
        fn: () =>
          this.fetchLbpPoolsHistoricalDataForBlocksRange({
            ctx,
            blockFromNumber: blockNumbersSorted[0],
            blockToNumber: blockNumbersSorted[blockNumbersSorted.length - 1],
          }),
        name: 'fetchLbpPoolsHistoricalDataForBlocksRange',
        actionType: 'other',
        meta: {
          originFnName: 'prefetchAllHistoricalData',
        },
        options: {
          ignoreConsoleLogs: true,
        },
      }),
      ctx.extLogger.measure({
        fn: () =>
          this.fetchStableswapHistoricalDataForBlocksRange({
            ctx,
            blockFromNumber: blockNumbersSorted[0],
            blockToNumber: blockNumbersSorted[blockNumbersSorted.length - 1],
          }),
        name: 'fetchStableswapHistoricalDataForBlocksRange',
        actionType: 'other',
        meta: {
          originFnName: 'prefetchAllHistoricalData',
        },
        options: {
          ignoreConsoleLogs: true,
        },
      }),
      ctx.extLogger.measure({
        fn: () =>
          this.fetchOmnipoolHistoricalDataForBlocksRange({
            ctx,
            blockFromNumber: blockNumbersSorted[0],
            blockToNumber: blockNumbersSorted[blockNumbersSorted.length - 1],
          }),
        name: 'fetchOmnipoolHistoricalDataForBlocksRange',
        actionType: 'other',
        meta: {
          originFnName: 'prefetchAllHistoricalData',
        },
        options: {
          ignoreConsoleLogs: true,
        },
      }),
      ctx.extLogger.measure({
        fn: () =>
          this.fetchAavePoolsHistoricalDataForBlocksRange({
            ctx,
            blockFromNumber: blockNumbersSorted[0],
            blockToNumber: blockNumbersSorted[blockNumbersSorted.length - 1],
          }),
        name: 'fetchAavePoolsHistoricalDataForBlocksRange',
        actionType: 'other',
        meta: {
          originFnName: 'prefetchAllHistoricalData',
        },
        options: {
          ignoreConsoleLogs: true,
        },
      }),
    ];

    if (ctx.appConfig.USE_XYKPOOLS_DATA_IN_TRADE_ROUTER)
      promises.push(
        ctx.extLogger.measure({
          fn: () =>
            this.fetchXykPoolsHistoricalDataForBlocksRange({
              ctx,
              blockFromNumber: blockNumbersSorted[0],
              blockToNumber: blockNumbersSorted[blockNumbersSorted.length - 1],
            }),
          name: 'fetchXykPoolsHistoricalDataForBlocksRange',
          actionType: 'other',
          meta: {
            originFnName: 'prefetchAllHistoricalData',
          },
          options: {
            ignoreConsoleLogs: true,
          },
        })
      );

    await Promise.all(promises);
  }

  // TODO should be reviewed and removed
  // protected async prefetchAllHistoricalDataForBlock({
  //   blockNumber,
  //   ctx,
  // }: {
  //   blockNumber: number;
  //   ctx: SqdProcessorContext<Store>;
  // }) {
  //   this.ensureHistDataStorage([blockNumber]);
  //
  //   await Promise.all([
  //     this.fetchConstantsHistoricalDataForBlock({ ctx, blockNumber }),
  //     this.fetchEmaOraclesHistoricalDataForBlock({ ctx, blockNumber }),
  //     this.fetchAssetsHistoricalDataForBlock({ ctx, blockNumber }),
  //     this.fetchLbpPoolsHistoricalDataForBlock({ ctx, blockNumber }),
  //     this.fetchXykPoolsHistoricalDataForBlock({ ctx, blockNumber }),
  //     this.fetchStableswapHistoricalDataForBlock({ ctx, blockNumber }),
  //     this.fetchOmnipoolHistoricalDataForBlock({ ctx, blockNumber }),
  //     this.fetchAavePoolsHistoricalDataForBlock({ ctx, blockNumber }),
  //   ]);
  // }

  protected async fetchConstantsHistoricalDataForBlock({
    blockNumber,
    ctx,
  }: {
    blockNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    const histData = await fetchConstantsHistoricalData({ ctx, blockNumber });

    if (!histData)
      throw new Error(
        `Missing constants historical data at block ${blockNumber}`
      );

    this.constantsHistData.set(blockNumber, histData);
  }
  protected async fetchAssetsHistoricalDataForBlock({
    blockNumber,
    ctx,
  }: {
    blockNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    this.assetsHistData.set(
      blockNumber,
      await fetchAssetsHistoricalData({ ctx, blockNumber })
    );
  }

  protected async fetchEmaOraclesHistoricalDataForBlock({
    blockNumber,
    ctx,
  }: {
    blockNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    this.emaOraclesHistData.set(
      blockNumber,
      await fetchEmaOracleEntriesHistoricalData({ ctx, blockNumber })
    );
  }

  protected async fetchLbpPoolsHistoricalDataForBlock({
    blockNumber,
    ctx,
  }: {
    blockNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    this.lbppoolsHistData.set(
      blockNumber,
      await fetchLbpPoolsHistoricalData({ blockNumber, ctx })
    );
  }

  protected async fetchXykPoolsHistoricalDataForBlock({
    blockNumber,
    ctx,
  }: {
    blockNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    this.xykpoolsHistData.set(
      blockNumber,
      await fetchXykPoolsHistoricalData({ blockNumber, ctx })
    );
  }

  protected async fetchAavePoolsHistoricalDataForBlock({
    blockNumber,
    ctx,
  }: {
    blockNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    this.aavepoolsHistData.set(
      blockNumber,
      await fetchAavePoolsHistoricalData({ blockNumber, ctx })
    );
  }

  protected async fetchStableswapHistoricalDataForBlock({
    blockNumber,
    ctx,
  }: {
    blockNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    this.stableswapHistData.set(
      blockNumber,
      await fetchStableswapHistoricalData({ blockNumber, ctx })
    );
  }

  protected async fetchOmnipoolHistoricalDataForBlock({
    blockNumber,
    ctx,
  }: {
    blockNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    const historicalData = await fetchOmnipoolHistoricalData({
      blockNumber,
      ctx,
    });
    if (!historicalData) return;
    this.omnipoolHistData.set(blockNumber, historicalData);
  }

  protected async fetchConstantsHistoricalDataForBlocksRange({
    blockFromNumber,
    blockToNumber,
    ctx,
  }: {
    blockFromNumber: number;
    blockToNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    const histData = await fetchConstantsHistoricalDataForBlocksRangeResolver({
      blockFromNumber,
      blockToNumber,
      ctx,
    });

    if (!histData)
      throw new Error(
        `Missing constants historical data at blocks range ${blockFromNumber}/${blockToNumber}`
      );

    this.constantsHistData = histData;
  }
  protected async fetchAssetsHistoricalDataForBlocksRange({
    blockFromNumber,
    blockToNumber,
    ctx,
  }: {
    blockFromNumber: number;
    blockToNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    this.assetsHistData = await fetchAssetsHistoricalDataForBlocksRangeResolver(
      {
        blockFromNumber,
        blockToNumber,
        ctx,
      }
    );
  }

  protected async fetchEmaOraclesHistoricalDataForBlocksRange({
    blockFromNumber,
    blockToNumber,
    ctx,
  }: {
    blockFromNumber: number;
    blockToNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    this.emaOraclesHistData =
      await fetchEmaOracleEntriesHistoricalDataForBlocksRangeResolver({
        blockFromNumber,
        blockToNumber,
        ctx,
      });
  }

  protected async fetchLbpPoolsHistoricalDataForBlocksRange({
    blockFromNumber,
    blockToNumber,
    ctx,
  }: {
    blockFromNumber: number;
    blockToNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    this.lbppoolsHistData =
      await fetchLbpPoolsHistoricalDataForBlocksRangeResolver({
        blockFromNumber,
        blockToNumber,
        ctx,
      });
  }

  protected async fetchXykPoolsHistoricalDataForBlocksRange({
    blockFromNumber,
    blockToNumber,
    ctx,
  }: {
    blockFromNumber: number;
    blockToNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    this.xykpoolsHistData =
      await fetchXykPoolsHistoricalDataForBlocksRangeResolver({
        blockFromNumber,
        blockToNumber,
        ctx,
      });
  }

  protected async fetchAavePoolsHistoricalDataForBlocksRange({
    blockFromNumber,
    blockToNumber,
    ctx,
  }: {
    blockFromNumber: number;
    blockToNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    this.aavepoolsHistData =
      await fetchAavePoolsHistoricalDataForBlocksRangeResolver({
        blockFromNumber,
        blockToNumber,
        ctx,
      });
  }

  protected async fetchStableswapHistoricalDataForBlocksRange({
    blockFromNumber,
    blockToNumber,
    ctx,
  }: {
    blockFromNumber: number;
    blockToNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    this.stableswapHistData =
      await fetchStableswapHistoricalDataForBlocksRangeResolver({
        blockFromNumber,
        blockToNumber,
        ctx,
      });

    const mmOracleContractCalls: { blockHeight: number; address: string }[] =
      [];

    for (const blockData of this.stableswapHistData.values()) {
      for (const poolData of blockData.values()) {
        const mmOracleSource = (poolData.pegSources || []).find(
          (s) => s.sourceKind === 'MMOracle'
        );
        if (!mmOracleSource || !mmOracleSource.oracleName) continue;
        mmOracleContractCalls.push({
          blockHeight: poolData.paraBlockHeight,
          address: mmOracleSource.oracleName,
        });
      }
    }

    await pMap(
      mmOracleContractCalls,
      async ({ address, blockHeight }) => {
        const oracleData =
          StorageResolver.getInstance().storageDictionaryManager?.getMmAggregatorOracle(
            { address, blockHeight }
          ) ||
          (await MmOracleManager.getInstance().getAggregatorMmOracleData({
            address,
            blockHeight,
          }));

        if (oracleData)
          this.mmOraclesHistData.get(blockHeight)?.set(address, oracleData);
      },
      {
        concurrency:
          ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
      }
    );
  }

  protected async fetchOmnipoolHistoricalDataForBlocksRange({
    blockFromNumber,
    blockToNumber,
    ctx,
  }: {
    blockFromNumber: number;
    blockToNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    const historicalData =
      await fetchOmnipoolHistoricalDataForBlocksRangeResolver({
        blockFromNumber,
        blockToNumber,
        ctx,
      });
    if (!historicalData) return;
    this.omnipoolHistData = historicalData;
  }

  getDecoratedConstantsHistDataAsPersistentDataInput({
    blockNumber,
  }: {
    blockNumber: number;
  }): IPersistentConstants {
    const histData = this.constantsHistData.get(blockNumber);

    if (!histData)
      throw new Error(
        `Missing constants historical data at block ${blockNumber}`
      );

    return {
      lbpRepayFee: histData.lbpRepayFee,
      lbpMaxInRatio: histData.lbpMaxInRatio?.toString(),
      lbpMaxOutRatio: histData.lbpMaxOutRatio?.toString(),
      lbpMinPoolLiquidity: histData.lbpMinPoolLiquidity?.toString(),
      lbpMinTradingLimit: histData.lbpMinTradingLimit?.toString(),

      omnipoolBurnProtocolFee: histData.omnipoolBurnProtocolFee,
      omnipoolHdxAssetId: histData.omnipoolHdxAssetId,
      omnipoolHubAssetId: histData.omnipoolHubAssetId,
      omnipoolMaxInRatio: histData.omnipoolMaxInRatio?.toString(),
      omnipoolMaxOutRatio: histData.omnipoolMaxOutRatio?.toString(),
      omnipoolMinimumPoolLiquidity:
        histData.omnipoolMinimumPoolLiquidity?.toString(),
      omnipoolMinimumTradingLimit:
        histData.omnipoolMinimumTradingLimit?.toString(),
      omnipoolMinWithdrawalFee: histData.omnipoolMinWithdrawalFee,

      stableswapMinTradingLimit: histData.stableswapMinTradingLimit?.toString(),
      stableswapMinPoolLiquidity:
        histData.stableswapMinPoolLiquidity?.toString(),
      stableswapAmplificationRange: histData.stableswapAmplificationRange,

      xykGetExchangeFee: histData.xykGetExchangeFee,
      xykMaxInRatio: histData.xykMaxInRatio?.toString(),
      xykMaxOutRatio: histData.xykMaxOutRatio?.toString(),
      xykMinPoolLiquidity: histData.xykMinPoolLiquidity?.toString(),
      xykMinTradingLimit: histData.xykMinTradingLimit?.toString(),
      xykNativeAssetId: histData.xykNativeAssetId,
      xykOracleSource: histData.xykOracleSource,

      dynamicFeesAssetFeeParameters: {
        minFee: histData.dynamicFeesAssetFeeParameters?.minFee,
        maxFee: histData.dynamicFeesAssetFeeParameters?.maxFee,
        decay: histData.dynamicFeesAssetFeeParameters?.decay,
        amplification: histData.dynamicFeesAssetFeeParameters?.amplification,
      },
      dynamicFeesProtocolFeeParameters: {
        minFee: histData.dynamicFeesProtocolFeeParameters?.minFee,
        maxFee: histData.dynamicFeesProtocolFeeParameters?.maxFee,
        decay: histData.dynamicFeesProtocolFeeParameters?.decay,
        amplification: histData.dynamicFeesProtocolFeeParameters?.amplification,
      },
    } as IPersistentConstants;
  }

  getDecoratedAssetsHistDataAsPersistentDataInput({
    blockNumber,
  }: {
    blockNumber: number;
  }): PersistentAsset[] {
    const assetsMap: Map<string, PersistentAsset> = new Map();

    // for (const [assetRegistryId, assetHistData] of [
    //   ...(this.assetsHistData.get(blockNumber) || new Map()).entries(),
    // ] as [string, AssetHistoricalData][]) {
    for (const [assetRegistryId, assetHistData] of (this.assetsHistData.get(
      blockNumber
    ) || new Map()) as Map<string, AssetHistoricalData>) {
      assetsMap.set(assetRegistryId, {
        id: assetHistData.asset.assetRegistryId,
        decimals: assetHistData.asset.decimals,
        name: assetHistData.asset.name,
        symbol: assetHistData.asset.symbol,
        existentialDeposit: assetHistData.existentialDeposit.toString(),
        isSufficient: assetHistData.asset.isSufficient,
        type: assetHistData.asset.assetType,
        dynamicFee: assetHistData.dynamicFee,
      } as PersistentAsset);
    }

    return [...assetsMap.values()];
  }

  getDecoratedXykpoolHistDataAsPersistentDataInput({
    blockNumber,
  }: {
    blockNumber: number;
  }): IPersistentPoolBase[] {
    const poolsMap: Map<string, IPersistentPoolBase> = new Map();

    // for (const [poolId, poolHistData] of [
    //   ...(this.xykpoolsHistData.get(blockNumber) || new Map()).entries(),
    // ] as [string, XykpoolHistoricalData][]) {

    for (const [poolId, poolHistData] of (this.xykpoolsHistData.get(
      blockNumber
    ) || new Map()) as Map<string, XykpoolHistoricalData>) {
      const assetAHistData = this.assetsHistData
        .get(blockNumber)
        ?.get(poolHistData.assetA.id);
      const assetBHistData = this.assetsHistData
        .get(blockNumber)
        ?.get(poolHistData.assetB.id);

      if (!assetAHistData || !assetBHistData) {
        console.error(`>> missing asset data for pool ${poolId}`);
        continue;
      }

      const blockConstants = this.constantsHistData.get(blockNumber)!;

      poolsMap.set(poolId, {
        address: publicKeyToSs58(poolHistData.pool.account.id),
        id: publicKeyToSs58(poolHistData.pool.id),
        type: PoolType.XYK,
        tokens: [
          {
            id: poolHistData.assetA.assetRegistryId,
            decimals: poolHistData.assetA.decimals,
            symbol: poolHistData.assetA.symbol,
            balance: poolHistData.assetABalance.toString(),
            existentialDeposit: assetAHistData.existentialDeposit.toString(),
            isSufficient: true, // TODO fix data
            type: poolHistData.assetA.assetType,
          },
          {
            id: poolHistData.assetB.assetRegistryId,
            decimals: poolHistData.assetB.decimals,
            symbol: poolHistData.assetB.symbol,
            balance: poolHistData.assetBBalance.toString(),
            existentialDeposit: assetBHistData.existentialDeposit.toString(),
            isSufficient: true, // TODO fix data
            type: poolHistData.assetB.assetType,
          },
        ] as IPersistentPoolToken[],
        maxInRatio: bigintToNumberSafe(blockConstants.xykMaxInRatio!), //TODO fix type
        maxOutRatio: bigintToNumberSafe(blockConstants.xykMaxOutRatio!), //TODO fix type
        minTradingLimit: bigintToNumberSafe(blockConstants.xykMinTradingLimit!), //TODO fix type
      } as IPersistentPoolBase);
    }

    return [...poolsMap.values()];
  }

  getDecoratedLbppoolHistDataAsPersistentDataInput({
    blockNumber,
  }: {
    blockNumber: number;
  }): IPersistentLbpPoolBase[] {
    const poolsMap: Map<string, IPersistentLbpPoolBase> = new Map();

    for (const [poolId, poolHistData] of (this.lbppoolsHistData.get(
      blockNumber
    ) || new Map()) as Map<string, LbppoolHistoricalData>) {
      const assetAHistData = this.assetsHistData
        .get(blockNumber)
        ?.get(poolHistData.assetA.id);
      const assetBHistData = this.assetsHistData
        .get(blockNumber)
        ?.get(poolHistData.assetB.id);

      if (!assetAHistData || !assetBHistData) {
        console.error(`>> missing asset data for pool ${poolId}`);
        continue;
      }

      const blockConstants = this.constantsHistData.get(blockNumber)!;

      if (!poolHistData.startBlockNumber || !poolHistData.endBlockNumber) {
        console.log(`>> missing start/end block for pool ${poolId}`);
        continue;
      }

      poolsMap.set(poolId, {
        id: publicKeyToSs58(poolHistData.pool.id),
        address: publicKeyToSs58(poolHistData.pool.account.id),
        type: PoolType.LBP,
        tokens: [
          {
            id: poolHistData.assetA.assetRegistryId,
            decimals: poolHistData.assetA.decimals,
            symbol: poolHistData.assetA.symbol,
            balance: poolHistData.assetABalance.toString(),
            existentialDeposit: assetAHistData.existentialDeposit.toString(),
            isSufficient: true, // TODO fix data
            type: poolHistData.assetA.assetType,
          },
          {
            id: poolHistData.assetB.assetRegistryId,
            decimals: poolHistData.assetB.decimals,
            symbol: poolHistData.assetB.symbol,
            balance: poolHistData.assetBBalance.toString(),
            existentialDeposit: assetBHistData.existentialDeposit.toString(),
            isSufficient: true, // TODO fix data
            type: poolHistData.assetB.assetType,
          },
        ] as IPersistentPoolToken[],
        maxInRatio: bigintToNumberSafe(blockConstants.lbpMaxInRatio!), //TODO fix type
        maxOutRatio: bigintToNumberSafe(blockConstants.lbpMaxOutRatio!), //TODO fix type
        minTradingLimit: bigintToNumberSafe(blockConstants.lbpMinTradingLimit!), //TODO fix type
        fee: poolHistData.fee,
        repayTarget: poolHistData.repayTarget.toString(),
        feeCollector: poolHistData.feeCollector?.id,
        repayFeeApply: false, // TODO fix implementation in this.isRepayFeeApplied
        start: poolHistData.startBlockNumber,
        end: poolHistData.endBlockNumber,
        initialWeight: poolHistData.initialWeight,
        finalWeight: poolHistData.finalWeight,
        relayBlockNumber: poolHistData.relayBlockHeight,
      } as IPersistentLbpPoolBase);
    }

    return [...poolsMap.values()];
  }

  getDecoratedStableswapHistDataAsPersistentDataInput({
    blockNumber,
  }: {
    blockNumber: number;
  }): IPersistentStableSwapBase[] {
    const poolsMap: Map<string, IPersistentStableSwapBase> = new Map();
    // for (const [poolId, poolHistData] of [
    //   ...(this.stableswapHistData.get(blockNumber) || new Map()).entries(),
    // ] as [string, StableswapHistoricalData][]) {
    for (const [poolId, poolHistData] of (this.stableswapHistData.get(
      blockNumber
    ) || new Map()) as Map<string, StableswapHistoricalData>) {
      if (
        !poolHistData.assetsHistoricalData ||
        poolHistData.assetsHistoricalData.length === 0
      ) {
        console.error(`>> missing assets data for pool ${poolId}`);
        continue;
      }

      const blockConstants = this.constantsHistData.get(blockNumber)!;

      const poolShareTokenHistData = this.assetsHistData
        .get(blockNumber)!
        .get(poolHistData.pool.shareToken.id);

      if (!poolShareTokenHistData) {
        console.error(`>> missing share assets data for pool ${poolId}`);
        continue;
      }

      poolsMap.set(poolId, {
        id: poolHistData.pool.id,
        address: publicKeyToSs58(poolHistData.pool.account.id),
        type: PoolType.Stable,

        tokens: [
          ...(poolHistData.assetsHistoricalData.map((assetHistData) => {
            return {
              id: assetHistData.asset.assetRegistryId,
              decimals: assetHistData.asset.decimals,
              symbol: assetHistData.asset.symbol,
              balance: assetHistData.freeBalance.toString(),
              existentialDeposit: this.assetsHistData
                .get(blockNumber)!
                .get(assetHistData.asset.id)!
                .existentialDeposit.toString(),
              isSufficient: this.assetsHistData
                .get(blockNumber)!
                .get(assetHistData.asset.id)!.asset.isSufficient, // TODO fix data
              type: assetHistData.asset.assetType,
              tradable: assetHistData.tradable,
            };
          }) as IPersistentPoolToken[]),
        ],

        maxInRatio: 0,
        maxOutRatio: 0,
        minTradingLimit: bigintToNumberSafe(
          blockConstants.stableswapMinTradingLimit!
        ), //TODO fix type
        fee: poolHistData.fee,
        initialAmplification: poolHistData.initialAmplification,
        finalAmplification: poolHistData.finalAmplification,
        blockNumber: blockNumber,
        initialBlock: poolHistData.initialAmplificationChangeAtBlockHeight,
        finalBlock: poolHistData.finalAmplificationChangeAtBlockHeight,
        totalIssuance: poolShareTokenHistData.totalIssuance.toString(),
        pegs: poolHistData.pegs.map((p) => p.map((i) => i.toString())),
        maxPegUpdate: poolHistData.maxPegUpdate?.toString(),
        pegSources: poolHistData.pegSources
          ? poolHistData.pegSources.map((pSrc) => ({
              sourceKind: pSrc.sourceKind,
              oracleName: pSrc.oracleName,
              oraclePeriod: pSrc.oraclePeriod,
              oracleAsset: pSrc.oracleAsset,
              valuePoints: pSrc.valuePoints,
            }))
          : undefined,
      } as IPersistentStableSwapBase);
    }

    return [...poolsMap.values()];
  }

  getDecoratedOmnipoolHistDataAsPersistentDataInput({
    blockNumber,
  }: {
    blockNumber: number;
  }): IPersistentOmniPoolBase[] {
    const poolHistData = this.omnipoolHistData.get(blockNumber);
    if (!poolHistData) return [];

    const blockConstants = this.constantsHistData.get(blockNumber)!;

    const poolData: IPersistentOmniPoolBase = {
      address: publicKeyToSs58(poolHistData.pool.account.id),
      type: PoolType.Omni,

      tokens: poolHistData.assetsHistoricalData
        .map((assetHistData) => {
          const assetHistoricalData = this.assetsHistData
            .get(blockNumber)!
            .get(assetHistData.asset.id);

          if (!assetHistoricalData) return null;

          return {
            id: assetHistData.asset.assetRegistryId,
            decimals: assetHistData.asset.decimals,
            symbol: assetHistData.asset.symbol,
            type: assetHistData.asset.assetType,
            existentialDeposit:
              assetHistoricalData.existentialDeposit.toString(),
            isSufficient: assetHistoricalData.asset.isSufficient, // TODO fix data
            balance: assetHistData.freeBalance.toString(),
            tradable: assetHistData.tradable,
            hubReserves: assetHistData.assetHubReserve.toString(),
            shares: assetHistData.assetShares.toString(),
            cap: assetHistData.assetCap.toString(),
            protocolShares: assetHistData.assetProtocolShares.toString(),
          };
        })
        .filter((token) => !!token) as IPersistentOmniPoolToken[],

      maxInRatio: bigintToNumberSafe(blockConstants.omnipoolMaxInRatio!), //TODO fix type
      maxOutRatio: bigintToNumberSafe(blockConstants.omnipoolMaxOutRatio!), //TODO fix type
      minTradingLimit: bigintToNumberSafe(
        blockConstants.omnipoolMinimumTradingLimit!
      ), //TODO fix type
      hubAssetId: `${blockConstants.omnipoolHubAssetId}`,
    };

    return [poolData];
  }

  getDecoratedAavepoolHistDataAsPersistentDataInput({
    blockNumber,
  }: {
    blockNumber: number;
  }): IPersistentPoolBase[] {
    const poolsMap: Map<string, IPersistentPoolBase> = new Map();

    // for (const [poolId, poolHistData] of [
    //   ...(this.aavepoolsHistData.get(blockNumber) || new Map()).entries(),
    // ] as [string, AavepoolHistoricalData][]) {

    for (const [poolId, poolHistData] of (this.aavepoolsHistData.get(
      blockNumber
    ) || new Map()) as Map<string, AavepoolHistoricalData>) {
      const reserveAssetHistData = this.assetsHistData
        .get(blockNumber)
        ?.get(poolHistData.pool.reserveAssetId);
      const aTokenHistData = this.assetsHistData
        .get(blockNumber)
        ?.get(poolHistData.pool.aTokenId);

      console.log({aTokenId: poolHistData.pool.aTokenId,aTokenHistData})
      // console.log({reserveId: poolHistData.pool.reserveAssetId,reserveAssetHistData})

      if (!reserveAssetHistData || !aTokenHistData) {
        console.error(`>> missing asset data for pool ${poolId}`);
        continue;
      }

      poolsMap.set(poolId, {
        address: publicKeyToSs58(poolHistData.pool.id),
        id: publicKeyToSs58(poolHistData.pool.id),
        type: PoolType.Aave,
        tokens: [
          {
            id: reserveAssetHistData.assetRegistryId,
            decimals: reserveAssetHistData.asset.decimals,
            symbol: reserveAssetHistData.asset.symbol,
            balance: poolHistData.liquidityIn.toString(),
            existentialDeposit:
              reserveAssetHistData.existentialDeposit.toString(),
            isSufficient: true, // TODO fix data
            type: reserveAssetHistData.asset.assetType,
          },
          {
            id: aTokenHistData.assetRegistryId,
            decimals: aTokenHistData.asset.decimals,
            symbol: aTokenHistData.asset.symbol,
            balance: poolHistData.liquidityOut.toString(),
            existentialDeposit: aTokenHistData.existentialDeposit.toString(),
            isSufficient: true, // TODO fix data
            type: aTokenHistData.asset.assetType,
          },
        ] as IPersistentPoolToken[],
        maxInRatio: 0,
        maxOutRatio: 0,
        minTradingLimit: 0,
      } as IPersistentPoolBase);
    }

    return [...poolsMap.values()];
  }

  getDecoratedEmaOraclesHistDataAsPersistentDataInput({
    blockNumber,
  }: {
    blockNumber: number;
  }): IPersistentEmaOracleEntry[] {
    const entries: Map<string, IPersistentEmaOracleEntry> = new Map();

    // for (const entry of [
    //   ...(this.emaOraclesHistData.get(blockNumber) || new Map()).values(),
    // ] as EmaOracleEntryHistoricalData[]) {
    for (const [key, entry] of (this.emaOraclesHistData.get(blockNumber) ||
      new Map()) as Map<string, EmaOracleEntryHistoricalData>) {
      entries.set(entry.id, {
        assets: [entry.assetAAssetRegistryId, entry.assetBAssetRegistryId],
        period: entry.period,
        source: entry.source,
        entry: {
          price: {
            n: entry.numeratorPrice.toString(),
            d: entry.denominatorPrice.toString(),
          },
          volume: {
            aIn: entry.assetAInVolume.toString(),
            aOut: entry.assetAOutVolume.toString(),
            bIn: entry.assetBInVolume.toString(),
            bOut: entry.assetBOutVolume.toString(),
          },
          liquidity: {
            a: entry.assetALiquidity.toString(),
            b: entry.assetBLiquidity.toString(),
          },
          updatedAt: entry.updatedAtParaBlockHeight,
        },
      } as IPersistentEmaOracleEntry);
    }

    return [...entries.values()];
  }

  // private async isRepayFeeApplied(
  //   assetKey: string,
  //   repayTarget: string,
  //   feeCollector: string
  // ): Promise<boolean> {
  //   const repayFeeTarget = bnum(repayTarget);
  //   if (repayFeeTarget.isZero()) {
  //     return false;
  //   }
  //
  //   try {
  //     const repayFeeCurrent = await this.getBalance(assetKey, feeCollector);
  //     return repayFeeCurrent.isLessThan(repayFeeTarget);
  //   } catch (err) {
  //     // Collector account is empty (No trade has been executed yet)
  //     return true;
  //   }
  // }
}
