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
    { className: 'Account', originCallFn: 'initAllAccountsOnColdStart' }
  );

  if (hasAnyRecord) return;

  const blockToProcess = ctx.blocks[0];

  const allAccountsAtBlock =
    await parsers.storage.system.getAllSystemAccountKeys({
      block: blockToProcess.header,
    });

  if (!allAccountsAtBlock) return null;

  const allEvmAccounts =
    await parsers.storage.evmAccounts.getAllAccountsExtensions({
      block: blockToProcess.header,
    });

  const accountEvmAddressMapping = new Map(
    (allEvmAccounts || []).map((ext) => [
      `${ext.h160Address}${ext.extension.slice(2)}`,
      ext.h160Address,
    ])
  );

  /**
   * IMPORTANT!
   * Do not use parallel processing here to avoid creation of phantom accounts
   * with the same bounded EVM address.
   */
  for (const accountAddress of allAccountsAtBlock) {
    const account = getNewAccount({
      id: accountAddress,
      boundEvmAddress: accountEvmAddressMapping.get(accountAddress),
      ctx,
    });
    ctx.batchState.state.accounts.set(account.id, account);

    ctx.batchState.state.accountProcessingStatuses.set(
      account.id,
      getNewAccountProcessingStatus({ id: account.id })
    );
  }

  await saveAllBatchAccounts(ctx);

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.accountProcessingStatuses.values())
  );
}
