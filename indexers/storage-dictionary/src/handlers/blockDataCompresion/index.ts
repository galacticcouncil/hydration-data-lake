import { Block, ProcessorContext } from '../../processor';
import {
  Aavepool,
  AssetHistoricalData,
  BlockCompressedData,
  EmaOracle,
  Lbppool,
  LbppoolAssetsData,
  Omnipool,
  OmnipoolAssetData,
  Stableswap,
  StableswapAssetData,
  Xykpool,
  XykpoolAssetsData,
} from '../../model';
import { Store } from '@subsquid/typeorm-store';
import { PakoManager } from '../../utils/pakoManager';

export async function compressBlockStorage(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
): Promise<void> {
  if (!ctx.appConfig.PROCESS_ONLY_MISSED_BLOCKS) return;

  // let lbppools = await ctx.store.find(Lbppool, {
  //   where: {
  //     paraBlockHeight: currentBlockHeader.height,
  //   },
  // });
  // let lbppoolAssets = await ctx.store.find(LbppoolAssetsData, {
  //   where: {
  //     paraBlockHeight: currentBlockHeader.height,
  //   },
  //   relations: { pool: true },
  // });
  //
  // let xykPools = await ctx.store.find(Xykpool, {
  //   where: {
  //     paraBlockHeight: currentBlockHeader.height,
  //   },
  // });
  // let xykAssets = await ctx.store.find(XykpoolAssetsData, {
  //   where: {
  //     paraBlockHeight: currentBlockHeader.height,
  //   },
  //   relations: { pool: true },
  // });
  //
  // let stableswaps = await ctx.store.find(Stableswap, {
  //   where: {
  //     paraBlockHeight: currentBlockHeader.height,
  //   },
  // });
  // let stableswapAssets = await ctx.store.find(StableswapAssetData, {
  //   where: {
  //     paraBlockHeight: currentBlockHeader.height,
  //   },
  //   relations: { pool: true },
  // });
  //
  // let omnipools = await ctx.store.find(Omnipool, {
  //   where: {
  //     paraBlockHeight: currentBlockHeader.height,
  //   },
  // });
  // let omnipoolAssets = await ctx.store.find(OmnipoolAssetData, {
  //   where: {
  //     paraBlockHeight: currentBlockHeader.height,
  //   },
  //   relations: { pool: true },
  // });
  //
  // let aavepools = await ctx.store.find(Aavepool, {
  //   where: {
  //     paraBlockHeight: currentBlockHeader.height,
  //   },
  //   relations: {
  //     reserveAsset: true,
  //     aToken: true,
  //   },
  // });
  //
  // let emaOraces = await ctx.store.find(EmaOracle, {
  //   where: {
  //     paraBlockHeight: currentBlockHeader.height,
  //   },
  // });
  //
  // let assetHistoricalData = await ctx.store.find(AssetHistoricalData, {
  //   where: {
  //     paraBlockHeight: currentBlockHeader.height,
  //   },
  //   relations: { asset: true },
  // });

  let lbppools = [...ctx.batchState.state.lbpPools.values()].filter(
    (e) => e.paraBlockHeight === currentBlockHeader.height
  );

  let lbppoolAssets = [
    ...ctx.batchState.state.lbpPoolAssetsData.values(),
  ].filter((e) => e.paraBlockHeight === currentBlockHeader.height);

  let xykPools = [...ctx.batchState.state.xykPools.values()].filter(
    (e) => e.paraBlockHeight === currentBlockHeader.height
  );

  let xykAssets = [...ctx.batchState.state.xykPoolAssetsData.values()].filter(
    (e) => e.paraBlockHeight === currentBlockHeader.height
  );

  let stableswaps = [...ctx.batchState.state.stablepools.values()].filter(
    (e) => e.paraBlockHeight === currentBlockHeader.height
  );

  let stableswapAssets = [
    ...ctx.batchState.state.stablepoolAssetsData.values(),
  ].filter((e) => e.paraBlockHeight === currentBlockHeader.height);

  let omnipools = [...ctx.batchState.state.omnipools.values()].filter(
    (e) => e.paraBlockHeight === currentBlockHeader.height
  );

  let omnipoolAssets = [
    ...ctx.batchState.state.omnipoolAssetsData.values(),
  ].filter((e) => e.paraBlockHeight === currentBlockHeader.height);

  let aavepools = [...ctx.batchState.state.aavepools.values()].filter(
    (e) => e.paraBlockHeight === currentBlockHeader.height
  );

  let emaOraces = [...ctx.batchState.state.emaOracles.values()].filter(
    (e) => e.paraBlockHeight === currentBlockHeader.height
  );

  let assetHistoricalData = [
    ...ctx.batchState.state.assetHistoricalDataItems.values(),
  ].filter((e) => e.paraBlockHeight === currentBlockHeader.height);

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

  const blockData = {
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
    assetHistoricalData: assetHistoricalData,
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
