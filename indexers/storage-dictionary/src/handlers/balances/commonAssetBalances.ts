import { Block, BlockWithData, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import {
  AccountData,
  GetTokenBalancesManyInput,
  TokenAccountBalancesWithAccountId,
} from '../../parsers/types/storage';
import { getOrCreateAccountAssetBalanceHistoricalData } from './accountAssetBalance';
import { RuntimeApiResolver } from '../../parsers/runtimeApiResolver';
import {
  RuntimeApiMethodName,
  RuntimeApiName,
} from '../../parsers/runtimeApiResolver/types';

type AccountId = string;
type AssetRegistryId = string;

export async function handleCommonAssetAccountBalances({
  block,
  accountIdsToProcess = new Set(),
  ctx,
}: {
  block: BlockWithData;
  accountIdsToProcess?: Set<string>;
  ctx: ProcessorContext<Store>;
}) {
  const palletNamesSet = ctx.appConfig.ACCOUNT_BALANCE_AGGREGATION_TRIGGERS;
  const accountBalancesMap: Map<
    AccountId,
    Map<AssetRegistryId, AccountData>
  > = new Map();

  const allInvolvedAccountsInBlockSet: Set<string> = accountIdsToProcess;

  for (const event of block.events) {
    const eventPalletName = event.name.split('.')[0];

    if (!palletNamesSet.has(eventPalletName)) continue;

    if (event.args.from) {
      allInvolvedAccountsInBlockSet.add(event.args.from);
    }
    if (event.args.to) {
      allInvolvedAccountsInBlockSet.add(event.args.to);
    }
    if (event.args.who) {
      allInvolvedAccountsInBlockSet.add(event.args.who);
    }
    if (event.args.swapper) {
      allInvolvedAccountsInBlockSet.add(event.args.swapper);
    }
    if (event.args.filler) {
      allInvolvedAccountsInBlockSet.add(event.args.filler);
    }
  }

  const allInvolvedAccountsInBlockList = Array.from(
    allInvolvedAccountsInBlockSet.keys()
  );

  const [nativeTokenBalances, otherTokenBalances] = await Promise.all([
    parsers.storage.balances.getNativeTokenBalanceMany({
      block: block.header,
      accountIds: allInvolvedAccountsInBlockList,
    }),
    (async () => {
      let balances = await new RuntimeApiResolver().resolveRuntimeApiCall<
        GetTokenBalancesManyInput,
        TokenAccountBalancesWithAccountId[] | null
      >({
        apiName: RuntimeApiName.CurrenciesApi,
        apiMethod: RuntimeApiMethodName.synthAccountsMany,
        args: {
          block: block.header,
          accountIds: allInvolvedAccountsInBlockList,
        },
      });

      if (!balances) {
        balances = await parsers.storage.tokens.getTokenBalancesMany({
          block: block.header,
          accountIds: allInvolvedAccountsInBlockList,
        });
      }

      return balances;
    })(),
  ]);

  for (const nativeTokenBalance of nativeTokenBalances) {
    if (!accountBalancesMap.has(nativeTokenBalance.accountId))
      accountBalancesMap.set(nativeTokenBalance.accountId, new Map());

    accountBalancesMap
      .get(nativeTokenBalance.accountId)!
      .set('0', nativeTokenBalance.data);
  }

  for (const otherTokenBalance of otherTokenBalances) {
    if (!accountBalancesMap.has(otherTokenBalance.accountId))
      accountBalancesMap.set(otherTokenBalance.accountId, new Map());

    for (const balance of otherTokenBalance.assetBalances) {
      accountBalancesMap
        .get(otherTokenBalance.accountId)!
        .set(balance.assetId, balance.data);
    }
  }

  for (const [accountId, accountData] of accountBalancesMap.entries()) {
    for (const [assetId, balances] of accountData.entries()) {
      const assetBalanceHistData =
        await getOrCreateAccountAssetBalanceHistoricalData({
          ctx,
          assetId,
          accountId,
          blockHeader: block.header,
          fetchFromDb: false,
        });

      assetBalanceHistData.transferable = balances.free.toString();
      assetBalanceHistData.totalLocked = balances.reserved.toString();

      ctx.batchState.state.accAssetBalanceHistData.set(
        assetBalanceHistData.id,
        assetBalanceHistData
      );
    }
  }
}
