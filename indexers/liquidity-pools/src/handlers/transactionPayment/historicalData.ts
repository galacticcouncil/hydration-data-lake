import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import { splitIntoBatches } from '../../utils/helpers';
import { BlockHeader } from '@subsquid/substrate-processor';
import pMap from 'p-map';
import { LessThan } from 'typeorm';
import { TransactionPaymentHistoricalData } from '../../model';
import { TransactionPaymentNextFeeMultiplier } from '../../parsers/types/storage';

export async function handleTransactionPaymentHistoricalData(
  ctx: SqdProcessorContext<Store>
) {
  for (const blocksSubBatch of splitIntoBatches(
    ctx.blocks,
    ctx.appConfig.HISTORICAL_DATA_PROCESSING_SUB_BATCH_SIZE
  )) {
    const dataPerBlockMap: Map<
      number,
      {
        blockHeader: BlockHeader;
        data: TransactionPaymentNextFeeMultiplier;
      }
    > = new Map();

    await pMap(
      blocksSubBatch,
      async ({ header: blockHeader }) => {
        const data =
          await parsers.storage.transactionPayment.getNextFeeMultiplier({
            block: blockHeader,
          });

        if (data)
          dataPerBlockMap.set(blockHeader.height, { blockHeader, data });
      },
      {
        concurrency:
          ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
      }
    );

    const dataIndexedByUniqueValue: Map<
      string,
      {
        blockHeader: BlockHeader;
        data: TransactionPaymentNextFeeMultiplier;
      }
    > = new Map();

    for (const item of Array.from(dataPerBlockMap.values()).sort(
      (a, b) => a.blockHeader.height - b.blockHeader.height
    )) {
      dataIndexedByUniqueValue.set(
        item.data.nextFeeMultiplier.toString(),
        item
      );
    }

    const uniqueDataOrderedByBlock = Array.from(
      dataIndexedByUniqueValue.values()
    ).sort((a, b) => b.blockHeader.height - a.blockHeader.height);

    const batchPreviousEntity =
      ctx.batchState.state.transactionPaymentHistData.get(
        Array.from(ctx.batchState.state.transactionPaymentHistData.keys())
          .filter((k) => {
            return parseInt(k) < uniqueDataOrderedByBlock[0].blockHeader.height;
          })
          .sort((a, b) => {
            return parseInt(b) - parseInt(a);
          })[0]
      ) ??
      (await getPreviousPersistedTransactionPaymentHistDataEntity({
        ctx,
        currentBlockHeight: uniqueDataOrderedByBlock[0].blockHeader.height,
      }));

    if (
      batchPreviousEntity &&
      batchPreviousEntity.nextFeeMultiplier ===
        uniqueDataOrderedByBlock[0].data.nextFeeMultiplier
    )
      uniqueDataOrderedByBlock.shift();

    await pMap(
      uniqueDataOrderedByBlock,
      async ({ blockHeader, data }) => {
        const historicalDataEntity = new TransactionPaymentHistoricalData({
          id: `${blockHeader.height}`,

          nextFeeMultiplier: data.nextFeeMultiplier,

          relayBlockHeight:
            ctx.batchState.state.relayChainInfo.get(blockHeader.height)
              ?.relaychainBlockNumber ?? 0,
          paraBlockHeight: blockHeader.height,
          blockId: blockHeader.id,
        });

        ctx.batchState.state.transactionPaymentHistData.set(
          historicalDataEntity.id,
          historicalDataEntity
        );
      },
      {
        concurrency:
          ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
      }
    );
  }
}

async function getPreviousPersistedTransactionPaymentHistDataEntity({
  ctx,
  currentBlockHeight,
}: {
  ctx: SqdProcessorContext<Store>;
  currentBlockHeight: number;
}) {
  return await ctx.storeUtils.findOneWithLogs(TransactionPaymentHistoricalData, {
    where: { paraBlockHeight: LessThan(currentBlockHeight) },
    order: {
      paraBlockHeight: 'DESC',
    },
  }, { className: 'TransactionPaymentHistoricalData' });
}
