import { PakoManager } from '../../../../utils/pakoManager';

import {
  Aavepool as AavepoolGlq,
  AccountBalances as AccountBalancesGql,
  AssetHistoricalDatum as AssetHistoricalDatumGql,
  BlockCompressedDataOrderBy,
  BlockCompressedDatumFilter,
  EmaOracle as EmaOracleGql,
  GetBlockCompressedData,
  GetBlockCompressedDataQueryVariables,
  InputMaybe,
  Lbppool as LbpPoolGlq,
  LbppoolAssetsDatum as LbppoolAssetsDatumGlq,
  Omnipool as OmnipoolGql,
  OmnipoolAssetDatum as OmnipoolAssetDatumGql,
  Stableswap as StableswapGql,
  StableswapAssetDatum as StableswapAssetDatumGql,
  Xykpool as XykpoolGlq,
  XykpoolAssetsDatum as XykpoolAssetsDatumGlq,
  GetBlockCompressedDataQuery,
  BlockCompressedDatum,
  Scalars,
  Maybe,
  Lbppool,
  XykpoolAssetsDataConnection,
  StableswapAssetDataConnection,
} from '../apiTypes/types';

export enum BlockCompressedDataKey {
  lbppool = 'lbppool',
  lbppoolAssetsData = 'lbppoolAssetsData',
  xykpool = 'xykpool',
  xykpoolAssetsData = 'xykpoolAssetsData',
  stableswap = 'stableswap',
  stableswapAssetData = 'stableswapAssetData',
  omnipool = 'omnipool',
  omnipoolAssetData = 'omnipoolAssetData',
  aavepool = 'aavepool',
  emaOracle = 'emaOracle',
  assetHistoricalData = 'assetHistoricalData',
}

export type BlockCompressedDataPayloadDecompressed = {
  [BlockCompressedDataKey.lbppool]: any[];
  [BlockCompressedDataKey.lbppoolAssetsData]: any[];
  [BlockCompressedDataKey.xykpool]: any[];
  [BlockCompressedDataKey.xykpoolAssetsData]: any[];
  [BlockCompressedDataKey.stableswap]: any[];
  [BlockCompressedDataKey.stableswapAssetData]: any[];
  [BlockCompressedDataKey.omnipool]: any[];
  [BlockCompressedDataKey.omnipoolAssetData]: any[];
  [BlockCompressedDataKey.aavepool]: any[];
  [BlockCompressedDataKey.emaOracle]: any[];
  [BlockCompressedDataKey.assetHistoricalData]: any[];
};

export function encodeBlockCompressedData<R>({
  data,
  dataKey,
}: {
  data: Array<BlockCompressedDatum | null>;
  dataKey: BlockCompressedDataKey;
}): R[] {
  const resultList: R[][] = [];

  for (const blockData of data) {
    if (!blockData || !blockData.data) continue;
    const decompressedData: BlockCompressedDataPayloadDecompressed =
      PakoManager.decompress(blockData.data);

    switch (dataKey) {
      case BlockCompressedDataKey.emaOracle: {
        resultList.push(
          (decompressedData[dataKey] || []).map(
            (emaOracle) =>
              ({
                id: emaOracle.id,
                entries: emaOracle.entries,
                paraBlockHeight: emaOracle.paraBlockHeight,
                relayBlockHeight: emaOracle.relayBlockHeight,
              }) as EmaOracleGql as R
          )
        );
        break;
      }
      case BlockCompressedDataKey.lbppool: {
        resultList.push(
          (decompressedData[dataKey] || []).map(
            (lbppool: any) =>
              ({
                assetAId: lbppool.assetAId,
                assetBId: lbppool.assetBId,
                end: lbppool.end,
                fee: lbppool.fee,
                feeCollector: lbppool.feeCollector,
                finalWeight: lbppool.finalWeight,
                id: lbppool.id,
                initialWeight: lbppool.initialWeight,
                lbppoolAssetsDataByPoolId: {
                  nodes: decompressedData[
                    BlockCompressedDataKey.lbppoolAssetsData
                  ]
                    .filter((a) => a.pool.id === lbppool.id)
                    .map(
                      (asset) =>
                        ({
                          id: asset.id,
                          assetId: asset.assetId,
                          balances: asset.balances,
                          poolId: lbppool.id,
                          relayBlockHeight: asset.relayBlockHeight,
                          paraBlockHeight: asset.paraBlockHeight,
                        }) as LbppoolAssetsDatumGlq
                    ),
                },
                owner: lbppool.owner,
                poolAddress: lbppool.poolAddress,
                repayTarget: lbppool.repayTarget,
                start: lbppool.start,
                weightCurve: lbppool.weightCurve,
                paraBlockHeight: lbppool.paraBlockHeight,
                relayBlockHeight: lbppool.relayBlockHeight,
              }) as LbpPoolGlq as R
          )
        );
        break;
      }
      case BlockCompressedDataKey.xykpool: {
        resultList.push(
          (decompressedData[dataKey] || []).map(
            (xykpool: any) =>
              ({
                assetAId: xykpool.assetAId,
                assetBId: xykpool.assetBId,
                id: xykpool.id,
                poolAddress: xykpool.poolAddress,
                shareTokenId: xykpool.shareTokenId,
                paraBlockHeight: xykpool.paraBlockHeight,
                relayBlockHeight: xykpool.relayBlockHeight,
                xykpoolAssetsDataByPoolId: {
                  nodes: decompressedData[
                    BlockCompressedDataKey.xykpoolAssetsData
                  ]
                    .filter((a) => a.pool.id === xykpool.id)
                    .map(
                      (asset) =>
                        ({
                          id: asset.id,
                          assetId: asset.assetId,
                          balances: asset.balances,
                          poolId: xykpool.id,
                          relayBlockHeight: asset.relayBlockHeight,
                          paraBlockHeight: asset.paraBlockHeight,
                        }) as XykpoolAssetsDatumGlq
                    ),
                },
              }) as XykpoolGlq as R
          )
        );
        break;
      }
      case BlockCompressedDataKey.stableswap: {
        resultList.push(
          (decompressedData[dataKey] || []).map(
            (pool: any) =>
              ({
                fee: pool.fee,
                finalAmplification: pool.finalAmplification,
                finalBlock: pool.finalBlock,
                id: pool.id,
                initialAmplification: pool.initialAmplification,
                initialBlock: pool.initialBlock,
                maxPegUpdate: pool.maxPegUpdate,
                pegSources: pool.pegSources,
                pegs: pool.pegs,
                poolAddress: pool.poolAddress,
                poolId: pool.poolId,
                paraBlockHeight: pool.paraBlockHeight,
                relayBlockHeight: pool.relayBlockHeight,
                stableswapAssetDataByPoolId: {
                  nodes: decompressedData[
                    BlockCompressedDataKey.stableswapAssetData
                  ]
                    .filter((a) => a.pool.id === pool.id)
                    .map(
                      (asset) =>
                        ({
                          id: asset.id,
                          assetId: asset.assetId,
                          balances: asset.balances,
                          poolId: asset.pool.id,
                          tradable: asset.tradable,
                          relayBlockHeight: asset.relayBlockHeight,
                          paraBlockHeight: asset.paraBlockHeight,
                        }) as StableswapAssetDatumGql
                    ),
                },
              }) as StableswapGql as R
          )
        );
        break;
      }
      case BlockCompressedDataKey.omnipool: {
        resultList.push(
          (decompressedData[dataKey] || []).map(
            (pool: any) =>
              ({
                id: pool.id,
                hubAssetTradability: pool.hubAssetTradability,
                poolAddress: pool.poolAddress,
                paraBlockHeight: pool.paraBlockHeight,
                relayBlockHeight: pool.relayBlockHeight,
                omnipoolAssetDataByPoolId: {
                  nodes: decompressedData[
                    BlockCompressedDataKey.omnipoolAssetData
                  ]
                    .filter((a) => a.pool.id === pool.id)
                    .map(
                      (asset) =>
                        ({
                          id: asset.id,
                          assetId: asset.assetId,
                          balances: asset.balances,
                          poolId: asset.pool.id,
                          assetState: asset.assetState,
                          relayBlockHeight: asset.relayBlockHeight,
                          paraBlockHeight: asset.paraBlockHeight,
                        }) as OmnipoolAssetDatumGql
                    ),
                },
              }) as OmnipoolGql as R
          )
        );
        break;
      }
      case BlockCompressedDataKey.aavepool: {
        resultList.push(
          (decompressedData[dataKey] || []).map(
            (pool: any) =>
              ({
                id: pool.id,
                aTokenId: pool.aToken.id,
                reserveAssetId: pool.reserveAsset.id,
                poolId: pool.poolId,
                liquidityIn: pool.liquidityIn,
                liquidityOut: pool.liquidityOut,
                paraBlockHeight: pool.paraBlockHeight,
                relayBlockHeight: pool.relayBlockHeight,
              }) as AavepoolGlq as R
          )
        );
        break;
      }
      case BlockCompressedDataKey.assetHistoricalData: {
        resultList.push(
          (decompressedData[dataKey] || []).map(
            (assetData: any) =>
              ({
                id: assetData.id,
                assetId: assetData.asset.id,
                dynamicFee: assetData.dynamicFee,
                existentialDeposit: assetData.existentialDeposit,
                totalIssuance: assetData.totalIssuance,
                paraBlockHeight: assetData.paraBlockHeight,
                relayBlockHeight: assetData.relayBlockHeight,
              }) as AssetHistoricalDatumGql as R
          )
        );
        break;
      }
    }
  }

  return resultList.flat();
}
