import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { handleBalancesTransfer } from './balancesTransfer';
import { handleTokensTransfer } from './tokensTransfer';
import { isPoolTransfer } from './utils';

export async function handleTransfers(
  ctx: ProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const allPoolsIds = [
    ...ctx.batchState.state.lbpAllBatchPools.keys(),
    ...ctx.batchState.state.xykAllBatchPools.keys(),
  ];

  const balancesTransferEvents = [
    ...parsedEvents.getSectionByEventName(EventName.Balances_Transfer).values(),
  ].filter((e) =>
    isPoolTransfer(allPoolsIds, e.eventData.params.from, e.eventData.params.to)
  );
  const tokensTransferEvents = [
    ...parsedEvents.getSectionByEventName(EventName.Tokens_Transfer).values(),
  ].filter((e) =>
    isPoolTransfer(allPoolsIds, e.eventData.params.from, e.eventData.params.to)
  );

  for (const eventData of getOrderedListByBlockNumber(balancesTransferEvents)) {
    await handleBalancesTransfer(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(tokensTransferEvents)) {
    await handleTokensTransfer(ctx, eventData);
  }

  await ctx.store.save([...ctx.batchState.state.transfers.values()]);
}
