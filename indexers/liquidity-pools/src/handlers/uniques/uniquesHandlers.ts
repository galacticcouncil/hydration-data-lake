import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { UniquesTransferredData } from '../../parsers/batchBlocksParser/types';
import { handleXykLMDepositTransferred } from '../liquidity/xykpool/liquidityMining/depositsHandlers';
import { handleOmnipoolLiquidityPositionTransferred } from '../liquidity/omnipool/liquidityPositions/liquidityPositionHandlers';
import { handleOmnipoolLMDepositTransferred } from '../liquidity/omnipool/liquidityMining/depositHandlers';

export async function handleUniquesItemTransferred(
  ctx: SqdProcessorContext<Store>,
  eventCallData: UniquesTransferredData
) {
  switch (eventCallData.eventData.params.collection) {
    case ctx.appConfig.uniques.XYK_LIQUIDITY_MINING_NFT_COLLECTION:
      await handleXykLMDepositTransferred(ctx, eventCallData);
      break;
    case ctx.appConfig.uniques.OMNIPOOL_LP_NFT_COLLECTION:
      await handleOmnipoolLiquidityPositionTransferred(ctx, eventCallData);
      break;
    case ctx.appConfig.uniques.OMNIPOOL_LIQUIDITY_MINING_NFT_COLLECTION:
      await handleOmnipoolLMDepositTransferred(ctx, eventCallData);
      break;
    default:
  }
}
