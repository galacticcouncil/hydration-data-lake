import { BlockHeader } from '@subsquid/substrate-processor';
import {
  AaveTradeExecutorPoolDataWithPoolId,
  AaveTradeExecutorPoolsInput,
  CurrenciesApiAccountInput,
  CurrenciesApiAccountsBatchInput,
  CurrenciesApiAccountsDataForAccount,
  CurrenciesApiAccountsInput,
  RuntimeApiMethodName,
  RuntimeApiName,
} from './types';
import runtimeApiCalls from './calls';
import {
  AccountData,
  AccountDataMultiple,
  GetTokenBalancesManyInput,
  TokenAccountBalancesWithAccountId,
} from '../types/storage';
import { PQueueManager } from '../../utils/pQueueManager';
import pMap from 'p-map';
import { AppConfig } from '../../appConfig';
import { measureRpcCall } from '../../utils/hydratedLogger/utils';

const appConfig = AppConfig.getInstance();

// TODO refactor to return response with status
//  Promise<{ success: boolean; data: R | null }>
export class RuntimeApiResolver {
  async resolveRuntimeApiCall<Args extends { block: BlockHeader }, R>({
    apiName,
    apiMethod,
    args,
  }: {
    apiName: RuntimeApiName;
    apiMethod: RuntimeApiMethodName;
    args: Args;
  }): Promise<R | null> {
    // const pQueueInst = PQueueManager.getInstance();

    try {
      const { block, ...restArgs } = args;
      return await measureRpcCall({
        call: `${apiName}.${apiMethod}`,
        originFn: 'resolveRuntimeApiCall',
        blockHeight: args.block.height,
        args: restArgs,
        fn: async () => {
          switch (apiName) {
            case RuntimeApiName.CurrenciesApi:
              if (apiMethod === RuntimeApiMethodName.accounts) {
                return (await this.handleCurrenciesApiGetAccountsCall(
                  args as unknown as CurrenciesApiAccountsInput
                )) as R;
              }
              if (apiMethod === RuntimeApiMethodName.accountsBatch) {
                return (await this.handleCurrenciesApiGetAccountsBatchCall(
                  args as unknown as CurrenciesApiAccountsBatchInput
                )) as R;
              }
              if (apiMethod === RuntimeApiMethodName.account) {
                return (await this.handleCurrenciesApiGetAccountCall(
                  args as unknown as CurrenciesApiAccountInput
                )) as R;
              }
              if (apiMethod === RuntimeApiMethodName.synthAccountsMany) {
                return (await this.handleCurrenciesApiGetAccountBalancesMany(
                  args as unknown as GetTokenBalancesManyInput
                )) as R;
              }

              break;
            case RuntimeApiName.AaveTradeExecutor:
              if (apiMethod === RuntimeApiMethodName.pools) {
                return (await this.handleAaveTradeExecutorPoolsCall(
                  args as AaveTradeExecutorPoolsInput
                )) as R;
              }
              break;

            default:
              return null;
          }
          return null;
        },
      });
    } catch (e) {
      // @ts-ignore
      // if (e.message) console.log(e.message);
      // console.log('-->>> resolveRuntimeApiCall ERROR', apiName, apiMethod);
      // console.log(e);
      return null;
    }

    return null;
  }

  async handleCurrenciesApiGetAccountsCall(
    args: CurrenciesApiAccountsInput
  ): Promise<AccountDataMultiple | null> {
    const runtimeApiResp = await runtimeApiCalls.currenciesApi.getAccounts(
      args as unknown as CurrenciesApiAccountsInput
    );
    if (!runtimeApiResp) return null;

    return runtimeApiResp.map(({ assetId, data }) => ({
      assetId,
      data: {
        free: BigInt(data.free ?? 0),
        reserved: BigInt(data.reserved ?? 0),
        frozen: BigInt(data.frozen ?? 0),
        miscFrozen: BigInt(0),
        feeFrozen: BigInt(0),
        flags: BigInt(0),
      },
    }));
  }

  async handleCurrenciesApiGetAccountsBatchCall(
    args: CurrenciesApiAccountsBatchInput
  ): Promise<CurrenciesApiAccountsDataForAccount[] | null> {
    console.log('----handleCurrenciesApiGetAccountsBatchCall');
    const runtimeApiResp = await runtimeApiCalls.currenciesApi.getAccountsBatch(
      args as unknown as CurrenciesApiAccountsBatchInput
    );

    console.dir(runtimeApiResp, { depth: null });

    console.log(`\n\n\n`);
    if (!runtimeApiResp) return null;

    return null;

    // return runtimeApiResp.map(({ assetId, data }) => ({
    //   assetId,
    //   data: {
    //     free: BigInt(data.free ?? 0),
    //     reserved: BigInt(data.reserved ?? 0),
    //     frozen: BigInt(data.frozen ?? 0),
    //     miscFrozen: BigInt(0),
    //     feeFrozen: BigInt(0),
    //     flags: BigInt(0),
    //   },
    // }));
  }

  async handleCurrenciesApiGetAccountCall(
    args: CurrenciesApiAccountInput
  ): Promise<AccountData | null> {
    const runtimeApiResp = await runtimeApiCalls.currenciesApi.getAccount(
      args as unknown as CurrenciesApiAccountInput
    );
    if (!runtimeApiResp) return null;

    return {
      free: BigInt(runtimeApiResp.free ?? 0),
      reserved: BigInt(runtimeApiResp.reserved ?? 0),
      frozen: BigInt(runtimeApiResp.frozen ?? 0),
      miscFrozen: BigInt(0),
      feeFrozen: BigInt(0),
      flags: BigInt(0),
    };
  }

  async handleCurrenciesApiGetAccountBalancesMany({
    accountIds,
    block,
  }: GetTokenBalancesManyInput): Promise<
    TokenAccountBalancesWithAccountId[] | null
  > {
    // const apiResponse = await pMap(
    //   accountIds,
    //   async (accountId) => {
    //     const resp = await this.handleCurrenciesApiGetAccountsCall({
    //       block,
    //       address: accountId,
    //     });
    //     return {
    //       accountId,
    //       assetBalances:
    //         resp?.map((assetBalance) => ({
    //           assetId: `${assetBalance.assetId}`,
    //           data: assetBalance.data,
    //         })) ?? [],
    //     } as TokenAccountBalancesWithAccountId;
    //   },
    //   { concurrency: appConfig.concurrency.RUNTIME_API_CALLS_CONCURRENCY }
    // );
    //
    // return apiResponse;

    const apiResponse = (
      await runtimeApiCalls.currenciesApi.getAccountsBatch({
        block,
        accountIds,
      } as unknown as CurrenciesApiAccountsBatchInput)
    ).map(({ accountId, assetBalances }) => ({
      accountId,
      assetBalances: assetBalances.map(({ assetId, data }) => ({
        assetId: `${assetId}`,
        data,
      })),
    }));

    return apiResponse as unknown as TokenAccountBalancesWithAccountId[];
  }

  async handleAaveTradeExecutorPoolsCall(
    args: AaveTradeExecutorPoolsInput
  ): Promise<AaveTradeExecutorPoolDataWithPoolId[] | null> {
    const runtimeApiResp =
      await runtimeApiCalls.aaveTradeExecutor.getPools(args);
    if (!runtimeApiResp) return null;

    return runtimeApiResp;
  }
}
//
// // TODO refactor to return response with status
// //  Promise<{ success: boolean; data: R | null }>
// export class RuntimeApiResolver {
//   async resolveRuntimeApiCall<Args extends { block: BlockHeader }, R>({
//     apiName,
//     apiMethod,
//     args,
//   }: {
//     apiName: RuntimeApiName;
//     apiMethod: RuntimeApiMethodName;
//     args: Args;
//   }): Promise<R | null> {
//     const pQueueInst = PQueueManager.getInstance();
//     try {
//       switch (apiName) {
//         case RuntimeApiName.CurrenciesApi:
//           if (apiMethod === RuntimeApiMethodName.accounts) {
//             return (await pQueueInst.runtimeApiCallsQueue.add(() =>
//               this.handleCurrenciesApiGetAccountsCall(
//                 args as unknown as CurrenciesApiAccountsInput
//               )
//             )) as R;
//           }
//           if (apiMethod === RuntimeApiMethodName.account) {
//             return (await pQueueInst.runtimeApiCallsQueue.add(() =>
//               this.handleCurrenciesApiGetAccountCall(
//                 args as unknown as CurrenciesApiAccountInput
//               )
//             )) as R;
//           }
//
//           break;
//         case RuntimeApiName.AaveTradeExecutor:
//           console.log('-->>> resolveRuntimeApiCall', apiName, apiMethod);
//
//           if (apiMethod === RuntimeApiMethodName.pools) {
//             return (await pQueueInst.runtimeApiCallsQueue.add(() =>
//               this.handleAaveTradeExecutorPoolsCall(
//                 args as AaveTradeExecutorPoolsInput
//               )
//             )) as R;
//           }
//           break;
//
//         default:
//           return null;
//       }
//     } catch (e) {
//       // @ts-ignore
//       // if (e.message) console.log(e.message);
//       console.log('-->>> resolveRuntimeApiCall ERROR', apiName, apiMethod);
//       console.log(e);
//       return null;
//     }
//
//     return null;
//   }
//
//   async handleCurrenciesApiGetAccountsCall(
//     args: CurrenciesApiAccountsInput
//   ): Promise<AccountDataMultiple | null> {
//     const runtimeApiResp = await runtimeApiCalls.currenciesApi.getAccounts(
//       args as unknown as CurrenciesApiAccountsInput
//     );
//     if (!runtimeApiResp) return null;
//
//     return runtimeApiResp.map(({ assetId, data }) => ({
//       assetId,
//       data: {
//         free: BigInt(data.free ?? 0),
//         reserved: BigInt(data.reserved ?? 0),
//         frozen: BigInt(data.frozen ?? 0),
//         miscFrozen: BigInt(0),
//         feeFrozen: BigInt(0),
//         flags: BigInt(0),
//       },
//     }));
//   }
//
//   async handleCurrenciesApiGetAccountCall(
//     args: CurrenciesApiAccountInput
//   ): Promise<AccountData | null> {
//     const runtimeApiResp = await runtimeApiCalls.currenciesApi.getAccount(
//       args as unknown as CurrenciesApiAccountInput
//     );
//     if (!runtimeApiResp) return null;
//
//     return {
//       free: BigInt(runtimeApiResp.free ?? 0),
//       reserved: BigInt(runtimeApiResp.reserved ?? 0),
//       frozen: BigInt(runtimeApiResp.frozen ?? 0),
//       miscFrozen: BigInt(0),
//       feeFrozen: BigInt(0),
//       flags: BigInt(0),
//     };
//   }
//
//   async handleAaveTradeExecutorPoolsCall(
//     args: AaveTradeExecutorPoolsInput
//   ): Promise<AaveTradeExecutorPoolDataWithPoolId[] | null> {
//     const runtimeApiResp =
//       await runtimeApiCalls.aaveTradeExecutor.getPools(args);
//     if (!runtimeApiResp) return null;
//
//     return runtimeApiResp;
//   }
// }
