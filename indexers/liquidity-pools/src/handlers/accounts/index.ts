import { FindOptionsRelations, In, Like } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { Account, AccountType } from '../../model';
import { SqdBlock, SqdProcessorContext } from '../../processor';
import { EvmUtils } from '../../utils/evm';

export function getNewAccount({
  id,
  accountType = AccountType.User,
  boundEvmAddress,
  ctx,
}: {
  ctx: SqdProcessorContext<Store>;
  id: string;
  accountType?: AccountType;
  boundEvmAddress?: string;
}) {
  let boundEvmAddressToSave = boundEvmAddress ?? null;

  if (!boundEvmAddressToSave) {
    boundEvmAddressToSave = EvmUtils.isSr25519AddressDerivedFromH160Address(id)
      ? EvmUtils.getH160FromDerivedSr25519(id)
      : EvmUtils.getH160FromOriginalSr25519(id);
  }

  const acc = new Account();
  acc.id = id;
  acc.accountType = accountType;
  acc.boundEvmAddress = boundEvmAddressToSave;

  return acc;
}

export async function getOrCreateAccount({
  ctx,
  id,
  accountType = AccountType.User,
  ensureAccountType = false,
  boundEvmAddress,
  ensureBoundEvmAddress = false,
  relations = {},
}: {
  ctx: SqdProcessorContext<Store>;
  id: string;
  accountType?: AccountType;
  ensureAccountType?: boolean;
  boundEvmAddress?: string;
  ensureBoundEvmAddress?: boolean;
  relations?: FindOptionsRelations<Account>;
}): Promise<Account> {
  const batchState = ctx.batchState.state;

  let acc = batchState.accounts.get(id);

  if (
    acc &&
    (ensureAccountType || (boundEvmAddress && ensureBoundEvmAddress))
  ) {
    if (ensureAccountType) acc.accountType = accountType;

    if (boundEvmAddress && ensureBoundEvmAddress)
      acc.boundEvmAddress = boundEvmAddress;

    await ctx.storeUtils.runWithRetry(() => ctx.store.save(acc!));
    ctx.batchState.state.accounts.set(acc.id, acc);
  }

  if (acc) return acc;

  acc = await ctx.storeUtils.findOneWithLogs(
    Account,
    { where: { id }, relations },
    { className: 'Account', originCallFn: 'getOrCreateAccount' }
  );

  if (
    acc &&
    (ensureAccountType || (boundEvmAddress && ensureBoundEvmAddress))
  ) {
    if (ensureAccountType) acc.accountType = accountType;

    if (boundEvmAddress && ensureBoundEvmAddress)
      acc.boundEvmAddress = boundEvmAddress;

    await ctx.storeUtils.runWithRetry(() => ctx.store.save(acc!));
  }

  if (!acc) {
    acc = getNewAccount({
      id,
      boundEvmAddress,
      accountType,
      ctx,
    });

    await ctx.storeUtils.runWithRetry(() => ctx.store.save(acc!));
  }
  ctx.batchState.state.accounts.set(acc.id, acc);

  return acc;
}

export async function getAccountByBoundEvmAddress({
  ctx,
  evmAddress,
  relations = {},
}: {
  ctx: SqdProcessorContext<Store>;
  evmAddress: string;
  relations?: FindOptionsRelations<Account>;
}) {
  const batchState = ctx.batchState.state;

  const accountsCached = Array.from(batchState.accounts.values()).filter(
    (acc) => acc.boundEvmAddress === evmAddress
  );

  let accountCached =
    accountsCached && accountsCached.length === 1
      ? accountsCached[0]
      : undefined;

  if (accountCached) return accountCached;

  if (accountsCached && accountsCached.length > 1) {
    accountCached = accountsCached.find(
      (acc) => !EvmUtils.isSr25519AddressDerivedFromH160Address(acc.id)
    );
    if (accountCached) return accountCached;
  }

  const accountsPersisted = await ctx.storeUtils.findWithLogs(
    Account,
    {
      where: { boundEvmAddress: evmAddress },
      relations,
    },
    { className: 'Account', originCallFn: 'getAccountByBoundEvmAddress' }
  );

  let accountPersisted =
    accountsPersisted && accountsPersisted.length === 1
      ? accountsPersisted[0]
      : undefined;

  if (accountPersisted) {
    ctx.batchState.state.accounts.set(accountPersisted.id, accountPersisted);
    return accountPersisted;
  }

  if (accountsPersisted && accountsPersisted.length > 1) {
    accountPersisted = accountsPersisted.find(
      (acc) => !EvmUtils.isSr25519AddressDerivedFromH160Address(acc.id)
    );
    if (accountPersisted) {
      ctx.batchState.state.accounts.set(accountPersisted.id, accountPersisted);
      return accountPersisted;
    }
  }

  if (accountsCached && accountsCached.length > 0) {
    ctx.batchState.state.accounts.set(accountsCached[0].id, accountsCached[0]);
    return accountsCached[0];
  }

  if (accountsPersisted && accountsPersisted.length > 0) {
    ctx.batchState.state.accounts.set(
      accountsPersisted[0].id,
      accountsPersisted[0]
    );
    return accountsPersisted[0];
  }

  return null;
}

export async function getOrCreateAccountByBoundEvmAddress({
  ctx,
  evmAddress,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  evmAddress: string;
  blockHeader: SqdBlock;
}) {
  const existingAccount = await getAccountByBoundEvmAddress({
    ctx,
    evmAddress,
  });

  if (existingAccount) return existingAccount;

  return getOrCreateAccount({
    ctx,
    id: EvmUtils.addressToHex(EvmUtils.getDerivedSs58FromH160(evmAddress)),
    boundEvmAddress: evmAddress,
    ensureBoundEvmAddress: true,
  });
}

export async function prefetchOrInitAllBatchAccounts(
  ctx: SqdProcessorContext<Store>
) {
  const existingAccounts = await ctx.storeUtils.findWithLogs(
    Account,
    {
      where: {
        id: In([...ctx.batchState.state.accountIdForPrefetch.values()]),
      },
    },
    {
      className: 'Account',
      originCallFn: 'prefetchOrInitAllBatchAccounts',
    }
  );

  for (const existingAccount of existingAccounts)
    ctx.batchState.state.accounts.set(existingAccount.id, existingAccount);
}

export async function saveAllBatchAccounts(ctx: SqdProcessorContext<Store>) {
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.accounts.values())
  );
}
