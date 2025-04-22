import {
  AssetHistoricalData,
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

export class OfflineTradeRouterManagerHelper {
  protected SUPPORTED_ASSET_TYPES_SET = new Set([
    'StableSwap',
    'Bond',
    'Token',
    'External',
    'Erc20',
  ]);

  protected assetsHistData: Map<number, Map<string, AssetHistoricalData>> =
    new Map();
  protected lbppoolsHistData: Map<number, Map<string, LbppoolHistoricalData>> =
    new Map();
  protected xykpoolsHistData: Map<number, Map<string, XykpoolHistoricalData>> =
    new Map();
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
      case SwapFillerType.Aave:
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
      await this.fetchAssetsHistoricalDataForBlock({ ctx, blockNumber });
      await this.fetchLbpPoolsHistoricalDataForBlock({ ctx, blockNumber });
      await this.fetchXykPoolsHistoricalDataForBlock({ ctx, blockNumber });
      await this.fetchStableswapHistoricalDataForBlock({ ctx, blockNumber });
      await this.fetchOmnipoolHistoricalDataForBlock({ ctx, blockNumber });
    }
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
        maxInRatio: bigintToNumberSafe(poolHistData.maxInRatio!), //TODO fix type
        maxOutRatio: bigintToNumberSafe(poolHistData.maxOutRatio!), //TODO fix type
        minTradingLimit: bigintToNumberSafe(poolHistData.minTradingLimit!), //TODO fix type
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
        maxInRatio: bigintToNumberSafe(poolHistData.maxInRatio!), //TODO fix type
        maxOutRatio: bigintToNumberSafe(poolHistData.maxOutRatio!), //TODO fix type
        minTradingLimit: bigintToNumberSafe(poolHistData.minTradingLimit!), //TODO fix type
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

        maxInRatio: bigintToNumberSafe(poolHistData.maxInRatio!), //TODO fix type
        maxOutRatio: bigintToNumberSafe(poolHistData.maxOutRatio!), //TODO fix type
        minTradingLimit: bigintToNumberSafe(poolHistData.minTradingLimit!), //TODO fix type
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

      maxInRatio: bigintToNumberSafe(poolHistData.maxInRatio!), //TODO fix type
      maxOutRatio: bigintToNumberSafe(poolHistData.maxOutRatio!), //TODO fix type
      minTradingLimit: bigintToNumberSafe(poolHistData.minTradingLimit!), //TODO fix type
      hubAssetId: poolHistData.hubAsset.assetRegistryId!,
    };

    return [poolData];
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
