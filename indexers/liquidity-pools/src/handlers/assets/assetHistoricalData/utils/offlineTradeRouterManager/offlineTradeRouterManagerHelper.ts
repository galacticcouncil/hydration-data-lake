import {
  AavepoolHistoricalData,
  AssetHistoricalData,
  ConstantsHistoricalData,
  Lbppool,
  LbppoolHistoricalData,
  OmnipoolAsset,
  OmnipoolHistoricalData,
  Stableswap,
  StableswapAsset,
  StableswapAssetHistoricalData,
  StableswapHistoricalData,
  SwapFillerType,
  Xykpool,
  XykpoolHistoricalData,
} from '../../../../../model';
import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  fetchAssetsHistoricalData,
  fetchLbpPoolsHistoricalData,
  fetchXykPoolsHistoricalData,
  fetchStableswapHistoricalData,
  fetchOmnipoolHistoricalData,
  fetchConstantsHistoricalData,
} from './fetchHistoricalDataHelpers';

import {
  IPersistentPoolBase,
  IPersistentPoolToken,
  IPersistentLbpPoolBase,
  PersistentAsset,
  IPersistentStableSwapBase,
  IPersistentOmniPoolBase,
  IPersistentOmniPoolToken,
  PoolType,
} from '../../../../../../../../../../hydration-sdk/packages/sdk';
import { bigintToNumberSafe } from '../../../../../utils/helpers';
import { fetchAavePoolsHistoricalData } from './fetchHistoricalDataHelpers/fetchAavePoolsHistoricalData';

export class OfflineTradeRouterManagerHelper {
  protected SUPPORTED_ASSET_TYPES_SET = new Set([
    'StableSwap',
    'Bond',
    'Token',
    'External',
    'Erc20',
  ]);

  protected constantsHistData: Map<number, ConstantsHistoricalData> = new Map();
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
    }
  }

  async prefetchAllHistoricalData({
    blockNumbers,
    ctx,
  }: {
    blockNumbers: number[];
    ctx: SqdProcessorContext<Store>;
  }) {
    this.ensureHistDataStorage(blockNumbers);

    for (const blockNumber of blockNumbers) {
      await this.fetchConstantsHistoricalDataForBlock({ ctx, blockNumber });
      await this.fetchAssetsHistoricalDataForBlock({ ctx, blockNumber });
      await this.fetchAssetsHistoricalDataForBlock({ ctx, blockNumber });
      await this.fetchLbpPoolsHistoricalDataForBlock({ ctx, blockNumber });
      await this.fetchXykPoolsHistoricalDataForBlock({ ctx, blockNumber });
      await this.fetchStableswapHistoricalDataForBlock({ ctx, blockNumber });
      await this.fetchOmnipoolHistoricalDataForBlock({ ctx, blockNumber });
      await this.fetchAavePoolsHistoricalDataForBlock({ ctx, blockNumber });
    }
  }

  async fetchConstantsHistoricalDataForBlock({
    blockNumber,
    ctx,
  }: {
    blockNumber: number;
    ctx: SqdProcessorContext<Store>;
  }) {
    const histData = await fetchConstantsHistoricalData({ ctx, blockNumber });

    if (!histData) throw new Error('Missing constants historical data');

    this.constantsHistData.set(blockNumber, histData);
  }
  async fetchAssetsHistoricalDataForBlock({
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

  async fetchLbpPoolsHistoricalDataForBlock({
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

  async fetchXykPoolsHistoricalDataForBlock({
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

  async fetchAavePoolsHistoricalDataForBlock({
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

  async fetchStableswapHistoricalDataForBlock({
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

  async fetchOmnipoolHistoricalDataForBlock({
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

  getDecoratedAssetsHistDataAsPersistentDataInput({
    blockNumber,
  }: {
    blockNumber: number;
  }): PersistentAsset[] {
    const assetsMap: Map<string, PersistentAsset> = new Map();

    for (const [assetRegistryId, assetHistData] of [
      ...(this.assetsHistData.get(blockNumber) || new Map()).entries(),
    ] as [string, AssetHistoricalData][]) {
      assetsMap.set(assetRegistryId, {
        id: assetHistData.asset.assetRegistryId,
        decimals: assetHistData.asset.decimals,
        name: assetHistData.asset.name,
        symbol: assetHistData.asset.symbol,
        existentialDeposit: assetHistData.existentialDeposit.toString(),
        isSufficient: assetHistData.asset.isSufficient,
        type: assetHistData.asset.assetType,
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

    for (const [poolId, poolHistData] of [
      ...(this.xykpoolsHistData.get(blockNumber) || new Map()).entries(),
    ] as [string, XykpoolHistoricalData][]) {
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
        address: poolHistData.pool.account.id,
        id: poolHistData.pool.id,
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

    for (const [poolId, poolHistData] of [
      ...(this.lbppoolsHistData.get(blockNumber) || new Map()).entries(),
    ] as [string, LbppoolHistoricalData][]) {
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
        id: poolHistData.pool.id,
        address: poolHistData.pool.account.id,
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

    for (const [poolId, poolHistData] of [
      ...(this.stableswapHistData.get(blockNumber) || new Map()).entries(),
    ] as [string, StableswapHistoricalData][]) {
      if (
        !poolHistData.assetsHistoricalData ||
        poolHistData.assetsHistoricalData.length === 0
      ) {
        console.error(`>> missing assets data for pool ${poolId}`);
        continue;
      }

      const blockConstants = this.constantsHistData.get(blockNumber)!;

      poolsMap.set(poolId, {
        id: poolHistData.pool.id,
        address: poolHistData.pool.account.id,
        type: PoolType.Stable,

        tokens: poolHistData.assetsHistoricalData.map((assetHistData) => ({
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
        })) as IPersistentPoolToken[],

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
        totalIssuance: this.assetsHistData
          .get(blockNumber)!
          .get(poolHistData.pool.shareToken.id)!
          .totalIssuance.toString(),
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
      address: poolHistData.pool.account.id,
      type: PoolType.Omni,

      tokens: poolHistData.assetsHistoricalData.map((assetHistData) => ({
        id: assetHistData.asset.assetRegistryId,
        decimals: assetHistData.asset.decimals,
        symbol: assetHistData.asset.symbol,
        type: assetHistData.asset.assetType,
        existentialDeposit: this.assetsHistData
          .get(blockNumber)!
          .get(assetHistData.asset.id)!
          .existentialDeposit.toString(),
        isSufficient: this.assetsHistData
          .get(blockNumber)!
          .get(assetHistData.asset.id)!.asset.isSufficient, // TODO fix data
        balance: assetHistData.freeBalance.toString(),
        tradable: assetHistData.tradable,
        hubReserves: assetHistData.assetHubReserve.toString(),
        shares: assetHistData.assetShares.toString(),
        cap: assetHistData.assetCap.toString(),
        protocolShares: assetHistData.assetProtocolShares.toString(),
      })) as IPersistentOmniPoolToken[],

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

    for (const [poolId, poolHistData] of [
      ...(this.aavepoolsHistData.get(blockNumber) || new Map()).entries(),
    ] as [string, AavepoolHistoricalData][]) {
      const reserveAssetHistData = this.assetsHistData
        .get(blockNumber)
        ?.get(poolHistData.pool.reserveAsset.id);
      const aTokenHistData = this.assetsHistData
        .get(blockNumber)
        ?.get(poolHistData.pool.aToken.id);

      if (!reserveAssetHistData || !aTokenHistData) {
        console.error(`>> missing asset data for pool ${poolId}`);
        continue;
      }

      poolsMap.set(poolId, {
        address: poolHistData.pool.id,
        id: poolHistData.pool.id,
        type: PoolType.Aave,
        tokens: [
          {
            id: poolHistData.pool.reserveAsset.assetRegistryId,
            decimals: poolHistData.pool.reserveAsset.decimals,
            symbol: poolHistData.pool.reserveAsset.symbol,
            balance: poolHistData.liquidityIn.toString(),
            existentialDeposit:
              reserveAssetHistData.existentialDeposit.toString(),
            isSufficient: true, // TODO fix data
            type: poolHistData.pool.reserveAsset.assetType,
          },
          {
            id: poolHistData.pool.aToken.assetRegistryId,
            decimals: poolHistData.pool.aToken.decimals,
            symbol: poolHistData.pool.aToken.symbol,
            balance: poolHistData.liquidityOut.toString(),
            existentialDeposit: aTokenHistData.existentialDeposit.toString(),
            isSufficient: true, // TODO fix data
            type: poolHistData.pool.aToken.assetType,
          },
        ] as IPersistentPoolToken[],
        maxInRatio: 0,
        maxOutRatio: 0,
        minTradingLimit: 0,
      } as IPersistentPoolBase);
    }

    return [...poolsMap.values()];
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
