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
  Xykpool,
  XykpoolHistoricalData,
} from '../../../../../model';
import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { In, Not } from 'typeorm';
import {
  fetchAssetsHistoricalData,
  fetchLbpPoolsHistoricalData,
  fetchXykPoolsHistoricalData,
  fetchStableswapHistoricalData,
  fetchOmnipoolHistoricalData,
} from './fetchHistoricalDataHelpers';

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

    console.log('assetsHistData - ', this.assetsHistData.size);
    console.log('lbppoolsHistData - ', this.lbppoolsHistData.size);
    console.log('xykpoolsHistData - ', this.xykpoolsHistData.size);
    console.log('stableswapHistData - ', this.stableswapHistData.size);
    console.log('omnipoolHistData - ', this.omnipoolHistData.size);

    // console.log('\n\n\n\n\n\n\n');
    // console.dir(this.omnipoolHistData, { depth: null });
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
}
