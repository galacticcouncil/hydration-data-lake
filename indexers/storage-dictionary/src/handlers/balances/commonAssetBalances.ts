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
  const palletNamesSet = new Set([
    'Currencies',
    'Tokens',
    'Balances',
    'Duster',
    'Omnipool',
    'Broadcast',
  ]);
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

  const nativeTokenBalances =
    await parsers.storage.balances.getNativeTokenBalanceMany({
      block: block.header,
      accountIds: allInvolvedAccountsInBlockList,
    });

  let otherTokenBalances = await new RuntimeApiResolver().resolveRuntimeApiCall<
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

  if (!otherTokenBalances) {
    otherTokenBalances = await parsers.storage.tokens.getTokenBalancesMany({
      block: block.header,
      accountIds: allInvolvedAccountsInBlockList,
    });
  }

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

//
// export async function handleCommonAssetAccountBalances(
//   block: BlockWithData,
//   ctx: ProcessorContext<Store>
// ) {
//   const allInvolvedAccountsInBatchSet: Set<string> = new Set();
//   const palletNamesSet = new Set(['Currencies', 'Tokens', 'Balances']);
//   const accountBalancesPerBlock: Map<
//     number,
//     {
//       blockHeader: Block;
//       data: Map<AccountId, Map<AssetRegistryId, AccountData>>;
//     }
//   > = new Map();
//
//   for (const block of ctx.blocks) {
//     const allInvolvedAccountsInBlockSet: Set<string> = new Set();
//     if (!accountBalancesPerBlock.has(block.header.height))
//       accountBalancesPerBlock.set(block.header.height, {
//         blockHeader: block.header,
//         data: new Map(),
//       });
//
//     for (const event of block.events) {
//       const eventPalletName = event.name.split('.')[0];
//
//       if (!palletNamesSet.has(eventPalletName)) continue;
//
//       if (event.args.from) {
//         allInvolvedAccountsInBlockSet.add(event.args.from);
//         allInvolvedAccountsInBatchSet.add(event.args.from);
//       }
//       if (event.args.to) {
//         allInvolvedAccountsInBlockSet.add(event.args.to);
//         allInvolvedAccountsInBatchSet.add(event.args.to);
//       }
//       if (event.args.who) {
//         allInvolvedAccountsInBlockSet.add(event.args.who);
//         allInvolvedAccountsInBatchSet.add(event.args.who);
//       }
//     }
//
//     const allInvolvedAccountsInBlockList = Array.from(
//       allInvolvedAccountsInBlockSet.keys()
//     );
//
//     const nativeTokenBalances =
//       await parsers.storage.balances.getNativeTokenBalanceMany({
//         block: block.header,
//         accountIds: allInvolvedAccountsInBlockList,
//       });
//
//     let otherTokenBalances =
//       await new RuntimeApiResolver().resolveRuntimeApiCall<
//         GetTokenBalancesManyInput,
//         TokenAccountBalancesWithAccountId[] | null
//       >({
//         apiName: RuntimeApiName.CurrenciesApi,
//         apiMethod: RuntimeApiMethodName.synthAccountsMany,
//         args: {
//           block: block.header,
//           accountIds: allInvolvedAccountsInBlockList,
//         },
//       });
//
//     if (!otherTokenBalances) {
//       otherTokenBalances = await parsers.storage.tokens.getTokenBalancesMany({
//         block: block.header,
//         accountIds: allInvolvedAccountsInBlockList,
//       });
//     }
//
//     for (const nativeTokenBalance of nativeTokenBalances) {
//       if (
//         !accountBalancesPerBlock
//           .get(block.header.height)!
//           .data.has(nativeTokenBalance.accountId)
//       )
//         accountBalancesPerBlock
//           .get(block.header.height)!
//           .data.set(nativeTokenBalance.accountId, new Map());
//
//       accountBalancesPerBlock
//         .get(block.header.height)!
//         .data.get(nativeTokenBalance.accountId)!
//         .set('0', nativeTokenBalance.data);
//     }
//
//     for (const otherTokenBalance of otherTokenBalances) {
//       if (
//         !accountBalancesPerBlock
//           .get(block.header.height)!
//           .data.has(otherTokenBalance.accountId)
//       )
//         accountBalancesPerBlock
//           .get(block.header.height)!
//           .data.set(otherTokenBalance.accountId, new Map());
//
//       for (const balance of otherTokenBalance.assetBalances) {
//         accountBalancesPerBlock
//           .get(block.header.height)!
//           .data.get(otherTokenBalance.accountId)!
//           .set(balance.assetId, balance.data);
//       }
//     }
//   }
//
//   for (const blockData of accountBalancesPerBlock.values()) {
//     for (const [accountId, accountData] of blockData.data.entries()) {
//       for (const [assetId, balances] of accountData.entries()) {
//         const assetBalanceHistData =
//           await getOrCreateAccountAssetBalanceHistoricalData({
//             ctx,
//             assetId,
//             accountId,
//             blockHeader: blockData.blockHeader,
//             fetchFromDb: false,
//           });
//
//         assetBalanceHistData.transferable = balances.free.toString();
//         assetBalanceHistData.totalLocked = balances.reserved.toString();
//
//         ctx.batchState.state.accAssetBalanceHistData.set(
//           assetBalanceHistData.id,
//           assetBalanceHistData
//         );
//       }
//     }
//   }
//
//   if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE) {
//     await ctx.store.save(
//       Array.from(ctx.batchState.state.accAssetBalanceHistData.values())
//     );
//   }
// }
