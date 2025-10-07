import { getHydratedLogger } from '.';
import { retryAsync } from '../helpers';

export async function measureStorageFetch<T>({
  fn,
  storageName,
  originFn,
  blockHeight,
  args,
}: {
  fn: () => Promise<T> | T;
  storageName: string;
  originFn: string;
  blockHeight: number;
  args?: Record<string, any>;
}) {
  return (await getHydratedLogger()).measure({
    fn,
    name: storageName,
    actionType: 'storage_fetch',
    meta: {
      paraBlockHeight: blockHeight,
      originFnName: originFn,
      fetchArgs: args,
    },
    options: {
      ignoreConsoleLogs: true,
    },
  });
}

export async function measureRpcCall<T>({
  fn,
  call,
  originFn,
  blockHeight,
  args,
}: {
  fn: () => Promise<T> | T;
  call: string;
  originFn: string;
  blockHeight: number;
  args?: Record<string, any>;
}) {
  return (await getHydratedLogger()).measure({
    fn,
    name: call,
    actionType: 'rpc_call',
    meta: {
      paraBlockHeight: blockHeight,
      originFnName: originFn,
      fetchArgs: args,
    },
    options: {
      ignoreConsoleLogs: true,
    },
  });
}

export async function measureEvmContractCall<T>({
  fn,
  call,
  originFn,
  blockHeight,
  args,
}: {
  fn: () => Promise<T> | T;
  call: string;
  originFn: string;
  blockHeight: number;
  args?: Record<string, any>;
}) {
  return (await getHydratedLogger()).measure({
    fn,
    name: call,
    actionType: 'evm_read',
    meta: {
      paraBlockHeight: blockHeight,
      originFnName: originFn,
      fetchArgs: args,
    },
    options: {
      ignoreConsoleLogs: true,
    },
  });
}
