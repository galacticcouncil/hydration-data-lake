import { Account } from '../../model';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';

export async function getAccount(
  ctx: ProcessorContext<Store>,
  id: string
): Promise<Account> {
  const batchState = ctx.batchState.state;

  let acc = batchState.accounts.get(id);
  if (!acc) {
    acc = new Account();
    acc.id = id;
    batchState.accounts.set(id, acc);
    ctx.batchState.state = { accounts: batchState.accounts };
    await ctx.store.save(acc);
  }
  return acc;
}
