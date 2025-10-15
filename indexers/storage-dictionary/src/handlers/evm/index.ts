import { BlockWithData, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { parseEvmEventsInBlock } from './evmEventParser';
import { EvmAccountsUtils } from '../../utils/evm/evmAccountsUtils';
import { AccountMoneyMarketPositionDataManager } from '../accounts/moneyMarketPosition';
import parsers from '../../parsers';

export async function handleEvmEventsInBlock(
  block: BlockWithData,
  ctx: ProcessorContext<Store>
) {
  await parseEvmEventsInBlock(block, ctx);

  /**
   * This margeCachedData method cannot be used if function "handleEvmEventsInBlock"
   * executed in parallel processing because it can/will cause using
   * inconsistent data
   */
  EvmAccountsUtils.getInstance().margeCachedData();
}

export async function handleEvmEventsInBlocksBatch(
  ctx: ProcessorContext<Store>
) {
  console.time(`handleEvmEventsInBlock loop`);
  for (const block of ctx.blocks) {
    await handleEvmEventsInBlock(block, ctx);
  }
  console.timeEnd(`handleEvmEventsInBlock loop`);

  console.time(`processAccountMmPositionDataUpdateQueue`);
  await AccountMoneyMarketPositionDataManager.getInstance().processAccountMmPositionDataUpdateQueue(
    ctx
  );
  console.timeEnd(`processAccountMmPositionDataUpdateQueue`);
}

export async function prefetchAllAccountsExtensions(
  ctx: ProcessorContext<Store>
) {
  const allExtensions =
    await parsers.storage.evmAccounts.getAllAccountsExtensions({
      block: ctx.blocks[ctx.blocks.length - 1].header,
    });

  if (!allExtensions) return;

  for (const { h160Address, extension } of allExtensions) {
    ctx.batchState.state.evmAccountExtensions.set(h160Address, extension);
  }
}
