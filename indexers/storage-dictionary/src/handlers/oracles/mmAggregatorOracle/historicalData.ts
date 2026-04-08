import { Block, ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { MmAggregatorOracle } from '../../../model';
import { Between } from 'typeorm/find-options/operator/Between';
import { MmOracleManager } from '../../../utils/evm/mmOracleEvmManager';

export async function handleMmAggregatorOracleHistoricalData({
  address,
  blockHeader,
  ctx,
}: {
  address: string;
  ctx: ProcessorContext<Store>;
  blockHeader: Block;
}) {
  if (
    ctx.batchState.state.mmAggregatorOraclesProcessedBlocks.has(
      blockHeader.height
    )
  )
    return;

  const oracleContractState =
    await MmOracleManager.getInstance().getAggregatorMmOracleData({
      address,
      blockHeight: blockHeader.height,
      ctx,
    });

  if (!oracleContractState) return null;

  const oracleHistDataEntity = new MmAggregatorOracle({
    id: `${address}-${blockHeader.height}`,
    address,
    price: oracleContractState.price,
    decimals: oracleContractState.decimals,
    updatedAt: oracleContractState.updatedAt,
    paraBlockHeight: blockHeader.height,
  });

  ctx.batchState.state.mmAggregatorOracles.set(
    oracleHistDataEntity.id,
    oracleHistDataEntity
  );

  if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE)
    await ctx.store.upsert(oracleHistDataEntity);

  return oracleHistDataEntity;
}

export async function prefetchAllMmAggregatorOracleRecordsForBlocksRangeToEnsureMissedBlocks(
  ctx: ProcessorContext<Store>,
  orderedBlockNumbers: number[]
) {
  if (
    !ctx.appConfig.PROCESS_ONLY_MISSED_BLOCKS ||
    !ctx.appConfig.PROCESS_STABLEPOOLS
  )
    return;

  const records = await ctx.store.find(MmAggregatorOracle, {
    where: {
      paraBlockHeight: Between(
        orderedBlockNumbers[0],
        orderedBlockNumbers[orderedBlockNumbers.length - 1]
      ),
    },
  });

  ctx.batchState.state.mmAggregatorOracles = new Map(
    records.map((r) => [r.id, r])
  );
  ctx.batchState.state.mmAggregatorOraclesProcessedBlocks = new Set(
    records.map((r) => r.paraBlockHeight)
  );
  console.log(
    `MmAggregatorOracle :: Blocks range: ${orderedBlockNumbers[0]}/${orderedBlockNumbers[orderedBlockNumbers.length - 1]}. 
    Number of missed blocks: ${orderedBlockNumbers.filter((b) => !ctx.batchState.state.mmAggregatorOraclesProcessedBlocks.has(b)).length}/${orderedBlockNumbers.length}`
  );
}
