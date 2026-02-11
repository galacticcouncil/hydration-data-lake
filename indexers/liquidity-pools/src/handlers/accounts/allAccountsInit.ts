import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Account } from '../../model';
import parsers from '../../parsers';
import { getNewAccount, saveAllBatchAccounts } from './index';
import pMap from 'p-map';
import { getNewAccountProcessingStatus } from './accountProcessingStatus';

export async function initAllAccountsOnColdStart({
  ctx,
}: {
  ctx: SqdProcessorContext<Store>;
}) {
  const hasAnyRecord = await ctx.storeUtils.findOneWithLogs(
    Account,
    {
      where: {},
    },
    { className: 'Account' }
  );

  if (hasAnyRecord) return;

  const blockToProcess = ctx.blocks[0];

  const allAccountsAtBlock =
    await parsers.storage.system.getAllSystemAccountKeys({
      block: blockToProcess.header,
    });

  if (!allAccountsAtBlock) return null;

  await pMap(
    allAccountsAtBlock,
    async (accountAddress) => {
      const account = getNewAccount({
        id: accountAddress,
        ctx,
      });
      ctx.batchState.state.accounts.set(account.id, account);

      ctx.batchState.state.accountProcessingStatuses.set(
        account.id,
        getNewAccountProcessingStatus({ id: account.id })
      );
    },
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );

  await saveAllBatchAccounts(ctx);

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.accountProcessingStatuses.values())
  );
}
