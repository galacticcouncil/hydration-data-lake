import { BlockHeader } from '@subsquid/substrate-processor';
import {
  CurrenciesApiAccountInput,
  CurrenciesApiAccountsInput,
  RuntimeApiMethodName,
  RuntimeApiName,
} from './types';
import runtimeApiCalls from './calls';
import { AccountData, AccountDataMultiple } from '../types/storage';

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
    try {
      switch (apiName) {
        case RuntimeApiName.CurrenciesApi:
          if (apiMethod === RuntimeApiMethodName.accounts) {
            return (await this.handleCurrenciesApiGetAccountsCall(
              args as unknown as CurrenciesApiAccountsInput
            )) as R;
          }
          if (apiMethod === RuntimeApiMethodName.account) {
            return (await this.handleCurrenciesApiGetAccountCall(
              args as unknown as CurrenciesApiAccountInput
            )) as R;
          }

          break;

        default:
          return null;
      }
    } catch (e) {
      // @ts-ignore
      if (e.message) console.log(e.message);
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
}
