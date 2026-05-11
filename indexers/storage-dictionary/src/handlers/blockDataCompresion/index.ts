import { Block, ProcessorContext } from '../../processor';
import {
  Aavepool,
  AccountAssetBalanceHistoricalData,
  AccountMmPositionHistoricalData,
  AssetHistoricalData,
  BlockCompressedData,
  EmaOracle,
  Lbppool,
  LbppoolAssetsData,
  MmAggregatorOracle,
  Omnipool,
  OmnipoolAssetData,
  Stableswap,
  StableswapAssetData,
  Xykpool,
  XykpoolAssetsData,
} from '../../model';
import { Store } from '@subsquid/typeorm-store';
import { PakoManager } from '../../utils/pakoManager';

export type CompressedBlockData = {
  lbppool: Lbppool[];
  lbppoolAssetsData: LbppoolAssetsData[];
  xykpool: Xykpool[];
  xykpoolAssetsData: XykpoolAssetsData[];
  stableswap: Stableswap[];
  stableswapAssetData: StableswapAssetData[];
  omnipool: Omnipool[];
  omnipoolAssetData: OmnipoolAssetData[];
  aavepool: Aavepool[];
  emaOracle: EmaOracle[];
  mmAggregatorOracle: MmAggregatorOracle[];
  assetHistoricalData: AssetHistoricalData[];
  accAssetBalancesHistoricalData: AccountAssetBalanceHistoricalData[];
  accMmPositionHistoricalData: AccountMmPositionHistoricalData[];
};

export async function compressBlockStorage(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
): Promise<void> {
  let lbppools = Array.from(ctx.batchState.state.lbpPools.values()).filter(
    (e) => e.paraBlockHeight === currentBlockHeader.height
  );

  let lbppoolAssets = Array.from(
    ctx.batchState.state.lbpPoolAssetsData.values()
  ).filter((e) => e.paraBlockHeight === currentBlockHeader.height);

  let xykPools = Array.from(ctx.batchState.state.xykPools.values()).filter(
    (e) => e.paraBlockHeight === currentBlockHeader.height
  );

  let xykAssets = Array.from(
    ctx.batchState.state.xykPoolAssetsData.values()
  ).filter((e) => e.paraBlockHeight === currentBlockHeader.height);

  let stableswaps = Array.from(
    ctx.batchState.state.stablepools.values()
  ).filter((e) => e.paraBlockHeight === currentBlockHeader.height);

  let stableswapAssets = Array.from(
    ctx.batchState.state.stablepoolAssetsData.values()
  ).filter((e) => e.paraBlockHeight === currentBlockHeader.height);

  let mmAggregatorOracles = Array.from(
    ctx.batchState.state.mmAggregatorOracles.values()
  ).filter((e) => e.paraBlockHeight === currentBlockHeader.height);

  let omnipools = Array.from(ctx.batchState.state.omnipools.values()).filter(
    (e) => e.paraBlockHeight === currentBlockHeader.height
  );
  let omnipoolAssets = Array.from(
    ctx.batchState.state.omnipoolAssetsData.values()
  ).filter((e) => e.paraBlockHeight === currentBlockHeader.height);

  let aavepools = Array.from(ctx.batchState.state.aavepools.values()).filter(
    (e) => e.paraBlockHeight === currentBlockHeader.height
  );

  let emaOraces = Array.from(ctx.batchState.state.emaOracles.values()).filter(
    (e) => e.paraBlockHeight === currentBlockHeader.height
  );

  let assetHistoricalData = Array.from(
    ctx.batchState.state.assetHistoricalDataItems.values()
  ).filter((e) => e.paraBlockHeight === currentBlockHeader.height);

  let accAssetBalancesHistoricalData = Array.from(
    ctx.batchState.state.accAssetBalanceHistData.values()
  ).filter((e) => e.paraBlockHeight === currentBlockHeader.height);

  let accMmPositionDataHistoricalData = Array.from(
    ctx.batchState.state.accMmPositionHistData.values()
  ).filter((e) => e.paraBlockHeight === currentBlockHeader.height);

  for (const asset of xykAssets) {
    // @ts-ignore
    asset.pool = { id: asset.pool.id };
  }

  for (const asset of stableswapAssets) {
    // @ts-ignore
    asset.pool = { id: asset.pool.id };
  }

  for (const pool of stableswaps) {
    // @ts-ignore
    pool.pegs = pool.pegs.map((peg) => [peg[0].toString(), peg[1].toString()]);
  }

  for (const asset of omnipoolAssets) {
    // @ts-ignore
    asset.pool = { id: asset.pool.id };
  }

  for (const pool of aavepools) {
    // @ts-ignore
    pool.liquidityIn = pool.liquidityIn.toString();
    // @ts-ignore
    pool.liquidityOut = pool.liquidityOut.toString();
    // @ts-ignore
    pool.reserveAsset = { id: pool.reserveAsset.id };
    // @ts-ignore
    pool.aToken = { id: pool.aToken.id };
  }

  for (const asset of assetHistoricalData) {
    // @ts-ignore
    asset.existentialDeposit = asset.existentialDeposit.toString();
    // @ts-ignore
    asset.totalIssuance = asset.totalIssuance.toString();
    // @ts-ignore
    asset.asset = { id: asset.asset.id };
  }

  for (const pool of lbppools) {
    // @ts-ignore
    pool.repayTarget = pool.repayTarget.toString();
  }
  for (const asset of lbppoolAssets) {
    // @ts-ignore
    asset.pool = { id: asset.pool.id };
  }

  const blockData: CompressedBlockData = {
    lbppool: lbppools,
    lbppoolAssetsData: lbppoolAssets,
    xykpool: xykPools,
    xykpoolAssetsData: xykAssets,
    stableswap: stableswaps,
    stableswapAssetData: stableswapAssets,
    omnipool: omnipools,
    omnipoolAssetData: omnipoolAssets,
    aavepool: aavepools,
    emaOracle: emaOraces,
    mmAggregatorOracle: mmAggregatorOracles,
    assetHistoricalData: assetHistoricalData,
    accAssetBalancesHistoricalData: accAssetBalancesHistoricalData,
    accMmPositionHistoricalData: accMmPositionDataHistoricalData,
  };

  await ctx.store.save(
    new BlockCompressedData({
      id: currentBlockHeader.height.toString(),
      algo: 'gzip',
      compStrFormat: 'base64',
      data: PakoManager.compress({ payload: blockData }),
      paraBlockHeight: currentBlockHeader.height,
    })
  );
}
