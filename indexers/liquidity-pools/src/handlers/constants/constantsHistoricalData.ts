import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import {
  ConstantsHistoricalData,
  DynamicFeesAssetFeeParameters,
} from '../../model';
import { splitIntoBatches } from '../../utils/helpers';

export async function handleConstantsHistoricalData(
  ctx: SqdProcessorContext<Store>
) {
  const predefinedEntities = [];

  for (const blocksSubBatch of splitIntoBatches(ctx.blocks, 100)) {
    predefinedEntities.push(
      await Promise.all(
        blocksSubBatch.map(async ({ header: blockHeader }) => {
          const lbpConstants = parsers.storage.lbp.getConstants({
            block: blockHeader,
          });
          const omnipoolConstants = parsers.storage.omnipool.getConstants({
            block: blockHeader,
          });
          const xykConstants = parsers.storage.xyk.getConstants({
            block: blockHeader,
          });
          const stableswapConstants = parsers.storage.stableswap.getConstants({
            block: blockHeader,
          });
          const dynamicFeesConstants = parsers.storage.dynamicFees.getConstants(
            {
              block: blockHeader,
            }
          );

          const poolHistoricalDataEntity = new ConstantsHistoricalData({
            id: `${blockHeader.height}`,

            lbpRepayFee: lbpConstants?.repayFee,
            lbpMaxInRatio: lbpConstants?.maxInRatio,
            lbpMaxOutRatio: lbpConstants?.maxOutRatio,
            lbpMinPoolLiquidity: lbpConstants?.minPoolLiquidity,
            lbpMinTradingLimit: lbpConstants?.minTradingLimit,

            omnipoolBurnProtocolFee: omnipoolConstants.burnProtocolFee,
            omnipoolHdxAssetId: omnipoolConstants.hdxAssetId,
            omnipoolHubAssetId: omnipoolConstants.hubAssetId,
            omnipoolMaxInRatio: omnipoolConstants.maxInRatio,
            omnipoolMaxOutRatio: omnipoolConstants.maxOutRatio,
            omnipoolMinimumPoolLiquidity: omnipoolConstants.minPoolLiquidity,
            omnipoolMinimumTradingLimit: omnipoolConstants.minTradingLimit,
            omnipoolMinWithdrawalFee: omnipoolConstants.minWithdrawalFee,

            stableswapMinTradingLimit: stableswapConstants.minTradingLimit,
            stableswapMinPoolLiquidity: stableswapConstants.minPoolLiquidity,
            stableswapAmplificationRange:
              stableswapConstants.amplificationRange,

            xykGetExchangeFee: xykConstants.exchangeFee,
            xykMaxInRatio: xykConstants.maxInRatio,
            xykMaxOutRatio: xykConstants.maxOutRatio,
            xykMinPoolLiquidity: xykConstants.minPoolLiquidity,
            xykMinTradingLimit: xykConstants.minTradingLimit,
            xykNativeAssetId: xykConstants.nativeAssetId,
            xykOracleSource: xykConstants.oracleSource,

            dynamicFeesAssetFeeParameters:
              dynamicFeesConstants?.assetFeeParameters
                ? new DynamicFeesAssetFeeParameters({
                    minFee: dynamicFeesConstants.assetFeeParameters.minFee,
                    maxFee: dynamicFeesConstants.assetFeeParameters.maxFee,
                    decay:
                      dynamicFeesConstants.assetFeeParameters.decay.toString(),
                    amplification:
                      dynamicFeesConstants.assetFeeParameters.amplification.toString(),
                  })
                : null,
            dynamicFeesProtocolFeeParameters:
              dynamicFeesConstants?.protocolFeeParameters
                ? new DynamicFeesAssetFeeParameters({
                    minFee: dynamicFeesConstants.protocolFeeParameters.minFee,
                    maxFee: dynamicFeesConstants.protocolFeeParameters.maxFee,
                    decay:
                      dynamicFeesConstants.protocolFeeParameters.decay.toString(),
                    amplification:
                      dynamicFeesConstants.protocolFeeParameters.amplification.toString(),
                  })
                : null,

            relayBlockHeight:
              ctx.batchState.state.relayChainInfo.get(blockHeader.height)
                ?.relaychainBlockNumber ?? 0,
            paraBlockHeight: blockHeader.height,
            block: ctx.batchState.state.batchBlocks.get(blockHeader.id),
          });

          return poolHistoricalDataEntity;
        })
      )
    );
  }

  ctx.batchState.state.constantsHistoricalData = new Map(
    predefinedEntities
      .flat()
      .filter((item) => !!item)
      .map((item) => [item.id, item])
  );

  await ctx.store.upsert([
    ...ctx.batchState.state.constantsHistoricalData.values(),
  ]);
}
