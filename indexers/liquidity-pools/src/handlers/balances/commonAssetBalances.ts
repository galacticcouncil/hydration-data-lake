import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Account,
  OmnipoolLiquidityPosition,
  OmnipoolLiquidityPositionStatus,
} from '../../model';
import { In, LessThan, LessThanOrEqual } from 'typeorm';
import parsers from '../../parsers';
import { AccountData } from '../../parsers/types/storage';
import { getOrCreateAccount } from '../accounts';
import { getOrCreateAsset } from '../assets/asset';
import { BigNumber } from '@galacticcouncil/sdk';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';
import {
  getOrCreateAccountAssetBalanceHistoricalData,
  getOrCreateAccountTotalBalanceHistoricalData,
} from './accountAssetBalance';
import { Between } from 'typeorm/find-options/operator/Between';

type BlockHeight = number;
type AccountId = string;
type AssetRegistryId = string;
type AssetId = string;
type AccountBalancesPerBlock = Map<
  BlockHeight,
  {
    blockHeader: SqdBlock;
    data: Map<AccountId, Map<AssetRegistryId, AccountData>>;
  }
>;

type AccountPositionBalancesPerBlockPerAsset = Map<
  BlockHeight,
  {
    blockHeader: SqdBlock;
    data: Map<AccountId, Map<AssetId, BigNumber>>;
  }
>;

export async function handleCommonAssetAccountBalances({
  accountIdsToProcess = new Map(),
  ctx,
}: {
  accountIdsToProcess?: Map<number, Set<string>>;
  ctx: SqdProcessorContext<Store>;
}) {
  const allInvolvedAccountsInBatchSet: Set<string> = new Set(
    Array.from(accountIdsToProcess.values())
      .map((blockSlot) => Array.from(blockSlot.values()))
      .flat()
  );

  const palletNamesSet = new Set([
    'Currencies',
    'Tokens',
    'Balances',
    'Duster',
    'Omnipool',
    'Broadcast',
  ]);
  const accountBalancesPerBlock: AccountBalancesPerBlock = new Map();

  blocksLoop: for (const block of ctx.blocks) {
    const allInvolvedAccountsInBlockSet: Set<string> =
      accountIdsToProcess.get(block.header.height) ?? new Set();

    if (!accountBalancesPerBlock.has(block.header.height))
      accountBalancesPerBlock.set(block.header.height, {
        blockHeader: block.header,
        data: new Map(),
      });

    eventsLoop: for (const event of block.events) {
      const eventPalletName = event.name.split('.')[0];

      if (!palletNamesSet.has(eventPalletName)) continue eventsLoop;

      if (event.args.from) {
        allInvolvedAccountsInBlockSet.add(event.args.from);
        allInvolvedAccountsInBatchSet.add(event.args.from);
      }
      if (event.args.to) {
        allInvolvedAccountsInBlockSet.add(event.args.to);
        allInvolvedAccountsInBatchSet.add(event.args.to);
      }
      if (event.args.who) {
        allInvolvedAccountsInBlockSet.add(event.args.who);
        allInvolvedAccountsInBatchSet.add(event.args.who);
      }
      if (event.args.swapper) {
        allInvolvedAccountsInBlockSet.add(event.args.swapper);
        allInvolvedAccountsInBatchSet.add(event.args.swapper);
      }
      if (event.args.filler) {
        allInvolvedAccountsInBlockSet.add(event.args.filler);
        allInvolvedAccountsInBatchSet.add(event.args.filler);
      }
    }

    if (allInvolvedAccountsInBlockSet.size === 0) continue blocksLoop;

    const allInvolvedAccountsInBlockList = Array.from(
      allInvolvedAccountsInBlockSet.keys()
    );

    const [nativeTokenBalances, otherTokenBalances] = await Promise.all([
      parsers.storage.system.getNativeTokenBalanceMany({
        block: block.header,
        accountIds: allInvolvedAccountsInBlockList,
      }),
      parsers.storage.tokens.getTokenBalancesMany({
        block: block.header,
        accountIds: allInvolvedAccountsInBlockList,
      }),
    ]);

    for (const nativeTokenBalance of nativeTokenBalances) {
      if (
        !accountBalancesPerBlock
          .get(block.header.height)!
          .data.has(nativeTokenBalance.accountId)
      )
        accountBalancesPerBlock
          .get(block.header.height)!
          .data.set(nativeTokenBalance.accountId, new Map());

      accountBalancesPerBlock
        .get(block.header.height)!
        .data.get(nativeTokenBalance.accountId)!
        .set('0', nativeTokenBalance.data);
    }

    for (const otherTokenBalance of otherTokenBalances) {
      if (
        !accountBalancesPerBlock
          .get(block.header.height)!
          .data.has(otherTokenBalance.accountId)
      )
        accountBalancesPerBlock
          .get(block.header.height)!
          .data.set(otherTokenBalance.accountId, new Map());

      for (const balance of otherTokenBalance.assetBalances) {
        accountBalancesPerBlock
          .get(block.header.height)!
          .data.get(otherTokenBalance.accountId)!
          .set(balance.assetId, balance.data);
      }
    }
  }

  const persistedAccounts = await ctx.storeUtils.findWithLogs(
    Account,
    {
      where: {
        id: In(
          Array.from(allInvolvedAccountsInBatchSet.keys()).filter(
            (acc) => !ctx.batchState.state.accounts.has(acc)
          )
        ),
      },
    },
    { className: 'Account', originCallFn: 'handleCommonAssetAccountBalances' }
  );

  for (const acc of persistedAccounts) {
    ctx.batchState.state.accounts.set(acc.id, acc);
  }

  const refAsset = await getOrCreateAsset({
    assetRegistryId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
    ctx,
    ensure: true,
    blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
  });

  if (!refAsset) throw Error('Ref asset not found');

  for (const blockData of accountBalancesPerBlock.values()) {
    for (const [accountId, accountAssetData] of blockData.data.entries()) {
      const account = await getOrCreateAccount({ ctx, id: accountId });

      const accountTotalBalance =
        await getOrCreateAccountTotalBalanceHistoricalData({
          account,
          refAssetId: refAsset.id,
          blockHeader: blockData.blockHeader,
          ctx,
        });

      for (const [assetRegistryId, balances] of accountAssetData.entries()) {
        const asset = await getOrCreateAsset({
          assetRegistryId,
          ctx,
          ensure: true,
          blockHeader: blockData.blockHeader,
        });
        if (!asset) continue;

        const assetSpotPrice = getAssetsPairPrice({
          ctx,
          assetInId: asset.id,
          blockHeight: blockData.blockHeader.height,
        });

        const assetBalanceHistData =
          await getOrCreateAccountAssetBalanceHistoricalData({
            ctx,
            asset,
            account,
            blockHeader: blockData.blockHeader,
            fetchFromDb: false,
          });

        /**
         * Account Asset balance calculation
         */
        assetBalanceHistData.transferable = balances.free;
        assetBalanceHistData.totalLocked = balances.reserved;
        assetBalanceHistData.transferableInRefAssetNorm =
          assetSpotPrice && asset.decimals
            ? calcPriceNormalized({
                amount: balances.free,
                assetDecimals: asset.decimals,
                spotPrice: assetSpotPrice,
              })
            : '0';
        assetBalanceHistData.totalLockedInRefAssetNorm =
          assetSpotPrice && asset.decimals
            ? calcPriceNormalized({
                amount: balances.reserved,
                assetDecimals: asset.decimals,
                spotPrice: assetSpotPrice,
              })
            : '0';

        /**
         * Account total balance calculation
         */
        accountTotalBalance.totalTransferableNorm = BigNumber(
          accountTotalBalance.totalTransferableNorm
        )
          .plus(assetBalanceHistData.transferableInRefAssetNorm || '0')
          .toFixed();

        accountTotalBalance.totalLockedNorm = BigNumber(
          accountTotalBalance.totalLockedNorm
        )
          .plus(assetBalanceHistData.totalLockedInRefAssetNorm || '0')
          .toFixed();

        ctx.batchState.state.accountAssetBalanceHistoricalData.set(
          assetBalanceHistData.id,
          assetBalanceHistData
        );
      }

      ctx.batchState.state.accountTotalBalanceHistoricalData.set(
        accountTotalBalance.id,
        accountTotalBalance
      );
    }
  }

  const omnipoolLiquidityPositionsMap =
    await getOmnipoolLiquidityPositionsForAccounts({
      ctx,
      involvedAccountsPerBlock: accountBalancesPerBlock,
      involvedAccountsInBatch: allInvolvedAccountsInBatchSet,
    });

  /**
   * Add Omnipool liquidity positions to the total transferable balance.
   */
  for (const blockData of omnipoolLiquidityPositionsMap.values()) {
    for (const [accountId, accountAssetData] of blockData.data.entries()) {
      const account = await getOrCreateAccount({ ctx, id: accountId });

      const accountTotalBalance =
        await getOrCreateAccountTotalBalanceHistoricalData({
          account,
          refAssetId: refAsset.id,
          blockHeader: blockData.blockHeader,
          ctx,
        });

      for (const [assetId, balanceBn] of accountAssetData.entries()) {
        const asset = await getOrCreateAsset({
          id: assetId,
          ctx,
          ensure: true,
          blockHeader: blockData.blockHeader,
        });
        if (!asset) continue;

        const assetSpotPrice = getAssetsPairPrice({
          ctx,
          assetInId: asset.id,
          blockHeight: blockData.blockHeader.height,
        });

        /**
         * Account total balance calculation
         */
        accountTotalBalance.totalTransferableNorm = BigNumber(
          accountTotalBalance.totalTransferableNorm
        )
          .plus(
            assetSpotPrice && asset.decimals
              ? calcPriceNormalized({
                  amount: BigInt(
                    omnipoolLiquidityPositionsMap
                      .get(blockData.blockHeader.height)
                      ?.data.get(account.id)
                      ?.get(asset.id)
                      ?.toFixed() ?? '0'
                  ),
                  assetDecimals: asset.decimals,
                  spotPrice: assetSpotPrice,
                })
              : '0'
          )
          .toFixed();
      }

      ctx.batchState.state.accountTotalBalanceHistoricalData.set(
        accountTotalBalance.id,
        accountTotalBalance
      );
    }
  }
}

async function getOmnipoolLiquidityPositionsForAccounts({
  involvedAccountsInBatch,
  involvedAccountsPerBlock,
  ctx,
}: {
  involvedAccountsInBatch: Set<string>;
  involvedAccountsPerBlock: AccountBalancesPerBlock;
  ctx: SqdProcessorContext<Store>;
}) {
  const allCachedPositions = Array.from(
    ctx.batchState.state.omnipoolLiquidityPositions.values()
  ).filter(
    (pos) =>
      pos.status === OmnipoolLiquidityPositionStatus.PositionCreated &&
      pos.paraBlockHeight <= ctx.blocks[ctx.blocks.length - 1].header.height &&
      involvedAccountsInBatch.has(pos?.account?.id)
  );

  const allPersistentPositions = await ctx.storeUtils.findWithLogs(
    OmnipoolLiquidityPosition,
    {
      where: {
        status: OmnipoolLiquidityPositionStatus.PositionCreated,
        account: { id: In(Array.from(involvedAccountsInBatch.values())) },
        paraBlockHeight: LessThanOrEqual(
          ctx.blocks[ctx.blocks.length - 1].header.height
        ),
      },
      relations: {
        account: true,
      },
    }
  );

  const allPositionsDeduped = new Map([
    ...allCachedPositions.map((pos): [string, OmnipoolLiquidityPosition] => [
      pos.id,
      pos,
    ]),
    ...allPersistentPositions.map(
      (pos): [string, OmnipoolLiquidityPosition] => [pos.id, pos]
    ),
  ]);

  const allPositionsIndexedByAccountId = new Map<
    string,
    OmnipoolLiquidityPosition[]
  >();

  for (const position of allPositionsDeduped.values()) {
    if (!allPositionsIndexedByAccountId.has(position.account.id)) {
      allPositionsIndexedByAccountId.set(position.account.id, [position]);
      continue;
    }
    allPositionsIndexedByAccountId.get(position.account.id)?.push(position);
  }

  const accountPositionBalancesPerBlockPerAsset: AccountPositionBalancesPerBlockPerAsset =
    new Map();

  for (const [blockHeight, { data }] of involvedAccountsPerBlock.entries()) {
    if (!accountPositionBalancesPerBlockPerAsset.has(blockHeight))
      accountPositionBalancesPerBlockPerAsset.set(blockHeight, {
        blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
        data: new Map(),
      });

    for (const accountId of data.keys()) {
      const accountPositionsAtBlock =
        allPositionsIndexedByAccountId
          .get(accountId)
          ?.filter((pos) => pos.paraBlockHeight <= blockHeight) || [];

      for (const position of accountPositionsAtBlock) {
        if (
          !accountPositionBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.has(accountId)
        )
          accountPositionBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.set(accountId, new Map());

        if (
          !accountPositionBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.get(accountId)!
            .has(position.assetId)
        )
          accountPositionBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.get(accountId)!
            .set(position.assetId, BigNumber(0));

        const currentBalance = accountPositionBalancesPerBlockPerAsset
          .get(blockHeight)!
          .data.get(accountId)!
          .get(position.assetId)!;

        accountPositionBalancesPerBlockPerAsset
          .get(blockHeight)!
          .data.get(accountId)!
          .set(position.assetId, currentBalance.plus(position.amount));
      }
    }
  }

  return accountPositionBalancesPerBlockPerAsset;
}
