import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EventName } from '../../parsers/types/events';
import { getOrderedListByBlockNumber } from '../../utils/helpers';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { handleBalancesTransfer } from './balancesTransfer';
import { handleTokensTransfer } from './tokensTransfer';
import { isPoolTransfer } from './utils';
import { handleCurrenciesTransfer } from './currenciesTransfer';

export async function handleTransfers(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const balancesTransferEvents = [
    ...parsedEvents.getSectionByEventName(EventName.Balances_Transfer).values(),
  ];
  const tokensTransferEvents = [
    ...parsedEvents.getSectionByEventName(EventName.Tokens_Transfer).values(),
  ];
  const currenciesTransferredEvents = [
    ...parsedEvents
      .getSectionByEventName(EventName.Currencies_Transferred)
      .values(),
  ];

  for (const eventData of getOrderedListByBlockNumber(balancesTransferEvents)) {
    await handleBalancesTransfer(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(tokensTransferEvents)) {
    await handleTokensTransfer(ctx, eventData);
  }

  for (const eventData of getOrderedListByBlockNumber(
    currenciesTransferredEvents
  )) {
    await handleCurrenciesTransfer(ctx, eventData);
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.transfers.values()),
    ctx
  );
}
