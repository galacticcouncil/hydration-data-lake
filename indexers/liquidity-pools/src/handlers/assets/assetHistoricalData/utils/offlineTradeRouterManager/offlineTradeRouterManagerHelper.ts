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
  XykpoolHistoricalData,
} from '../../../../../model';
import { StorageResolver } from '../../../../../parsers/storageResolver';
import { SqdProcessorContext } from '../../../../../processor';
import { MmOracleManager } from '../../../../../utils/evmTools/mmOracleEvmManager';
// } from '@galacticcouncil/sdk';
import {
  bigintToNumberSafe,
  publicKeyToSs58,
} from '../../../../../utils/helpers';

type IPersistentMmOracleEntry = {
  address: string;
  price: string;
  decimals: number;
  updatedAt: number;
};
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

    this.ensureHistDataStorage(blockNumbersSorted);

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
            ctx,
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

}
