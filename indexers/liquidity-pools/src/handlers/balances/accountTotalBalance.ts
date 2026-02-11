import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcPriceNormalized } from '../../utils/helpers';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { getOrCreateAsset } from '../assets/asset';
import { getOrCreateAccountTotalBalanceHistoricalData } from './accountAssetBalance';
import { AccountData } from '../../parsers/types/storage';
import { SqdBlock } from '../../processor';
import {
  AccountAssetBalanceHistoricalData,
  Asset,
  AssetResourceType,
} from '../../model';
import { BigNumber } from '@galacticcouncil/sdk';
import { getOmnipoolLiquidityPositionsForAccounts } from '../liquidity/omnipool/liquidityPositions/liquidityPositionUtils';
import { getXykLiquidityMiningDepositsForAccounts } from '../liquidity/xykpool/liquidityMining/depositsUtils';
import { getOmnipoolLiquidityMiningDepositsForAccounts } from '../liquidity/omnipool/liquidityMining/depositUtils';
import { CommonPgPool } from '../../utils/pgConnectionManagers/pgPool';
import { getPreviousAssetAccountBalancesSql } from '../../utils/pgConnectionManagers/queries/getPreviousAssetAccountBalances.sql';
import {
  createAccountAssetBalancesForOutdatedBalances,
  ensureAccountAssetBalancesForOutdatedBalancesWithOnChainData,
  getUnchangedAccountAssetBalanceFromCachedEntity,
  getUnchangedAccountAssetBalanceFromPersistentEntity,
  indexAccountAssetBalancesAccumulators,
} from './utils';

type BlockHeight = number;
type AccountId = string;
type AssetRegistryId = string;
type AssetId = string;

export type RawAccountAssetBalanceHistoricalData = {
  id: string;
  account_id: string;
  asset_id: string;
  transferable: string;
  total_locked: string;
  transferable_in_ref_asset_norm: string;
  total_locked_in_ref_asset_norm: string;
  para_block_height: number;
};

export type UnchangedAccountAssetBalanceHistoricalData = {
  id: string;
  accountId: string;
  assetId: string;
  transferableInRefAssetNorm: string;
  totalLockedInRefAssetNorm: string;
  paraBlockHeight: number;
  processingParaBlockHeight: number;
};

export type AccountBalancesPerBlock = Map<
  BlockHeight,
  {
    blockHeader: SqdBlock;
    data: Map<AccountId, Map<AssetRegistryId, AccountData>>;
  }
>;

export type AccountPositionBalancesPerBlockPerAsset = Map<
  BlockHeight,
  {
    blockHeader: SqdBlock;
    data: Map<AccountId, Map<AssetId, BigNumber>>;
  }
>;

export type UnchangedAccountAssetBalancesPerBlockMap = Map<
  BlockHeight,
  Map<AccountId, Map<AssetId, UnchangedAccountAssetBalanceHistoricalData>>
>;

export type AssetBalancesIndexedByBlockAndAccountMap = Map<
  BlockHeight,
  Map<AccountId, AccountAssetBalanceHistoricalData[]>
>;

export type AssetBalancesIndexedByAccountAndAssetMap = Map<
  AccountId,
  Map<AssetId, AccountAssetBalanceHistoricalData[]>
>;

export async function handleAccountTotalBalance({
  preProcessedTotalBalances,
  ctx,
}: {
  preProcessedTotalBalances?: Set<string> | null;
  ctx: SqdProcessorContext<Store>;
}) {
  const refAsset = await getOrCreateAsset({
    assetRegistryId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
    ctx,
    ensure: true,
    blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
  });

  if (!refAsset) throw Error('Ref asset not found');

  for (const assetBalance of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
    if (
      preProcessedTotalBalances &&
      preProcessedTotalBalances.has(
        `${assetBalance.accountId}-${assetBalance.paraBlockHeight}`
      )
    )
      continue;

    await addAssetBalanceToAccountTotalBalance({
      refAsset,
      ctx,
      assetBalanceHistData: assetBalance,
    });
  }
}

export async function addAssetBalanceToAccountTotalBalance({
  assetBalanceHistData,
  refAsset,
  ctx,
}: {
  assetBalanceHistData: AccountAssetBalanceHistoricalData;
  refAsset?: Asset | null;
  ctx: SqdProcessorContext<Store>;
}) {
  const refAssetEntity =
    refAsset ??
    (await getOrCreateAsset({
      assetRegistryId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
      ctx,
      ensure: true,
      blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
    }));

  if (!refAssetEntity)
    throw Error(
      `Ref asset ${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID} not found`
    );

  const asset = await getOrCreateAsset({
    id: assetBalanceHistData.assetId,
    ctx,
    ensure: true,
    blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
  });

  if (!asset) throw Error(`Asset ${assetBalanceHistData.assetId} not found`);

  const accountTotalBalance =
    await getOrCreateAccountTotalBalanceHistoricalData({
      accountId: assetBalanceHistData.accountId,
      refAssetId: refAssetEntity.id,
      blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(
        assetBalanceHistData.paraBlockHeight
      ),
      ctx,
    });

  // TODO must be moved to proper place
  if (assetBalanceHistData.assetId === refAssetEntity.id) {
    assetBalanceHistData.transferableInRefAssetNorm = calcPriceNormalized({
      amount: BigInt(assetBalanceHistData.transferable.toString() ?? '0'),
      assetDecimals: asset.decimals!,
      spotPrice: '1',
    });
  }

  /**
   * When we process Debd token, we need to subtract the debt from the total
   * transferable balance.
   */
  if (asset.resourceType === AssetResourceType.Debt) {
    const totalBalanceWithoutDebt = BigNumber(
      accountTotalBalance.totalTransferableNorm
    ).minus(assetBalanceHistData.transferableInRefAssetNorm || '0');

    /**
     * At this point we can get negative total balance, if debt token data
     * occurred in the beginning of the list (accountAssetBalanceHistoricalData).
     * But account cannot have debt balance higher that collateral or
     * borrowed amount. So in final result totalBalance always will be positive.
     */
    // accountTotalBalance.totalTransferableNorm = (
    //   totalBalanceWithoutDebt.isLessThan(0)
    //     ? BigNumber(0)
    //     : totalBalanceWithoutDebt
    // ).toFixed();
    accountTotalBalance.totalTransferableNorm =
      totalBalanceWithoutDebt.toFixed();

    accountTotalBalance.totalDebtNorm = BigNumber(
      accountTotalBalance.totalDebtNorm ?? '0'
    )
      .plus(assetBalanceHistData.transferableInRefAssetNorm || '0')
      .toFixed();
  } else {
    accountTotalBalance.totalTransferableNorm = BigNumber(
      accountTotalBalance.totalTransferableNorm
    )
      .plus(assetBalanceHistData.transferableInRefAssetNorm || '0')
      .toFixed();
  }

  accountTotalBalance.totalLockedNorm = BigNumber(
    accountTotalBalance.totalLockedNorm
  )
    .plus(assetBalanceHistData.totalLockedInRefAssetNorm || '0')
    .toFixed();

  ctx.batchState.state.accountAssetBalanceHistoricalData.set(
    assetBalanceHistData.id,
    assetBalanceHistData
  );

  ctx.batchState.state.accountTotalBalanceHistoricalData.set(
    accountTotalBalance.id,
    accountTotalBalance
  );
}

export async function handleLiquidityBalancesInTotalBalances({
  preProcessedTotalBalances,
  ctx,
  allProcessedAccountsPerBlock,
}: {
  preProcessedTotalBalances?: Set<string> | null;
  ctx: SqdProcessorContext<Store>;
  allProcessedAccountsPerBlock: Map<number, Set<string>>;
}) {
  const refAsset = await getOrCreateAsset({
    assetRegistryId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
    ctx,
    ensure: true,
    blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
  });

  if (!refAsset) throw Error('Ref asset not found');

  const allInvolvedAccountsInBatchSet = new Set(
    Array.from(allProcessedAccountsPerBlock.values())
      .map((accSet) => Array.from(accSet.values()))
      .flat()
  );

  const {
    accountDepositBalancesPerBlockPerAsset: omnipoolLiquidityMiningDepositsMap,
    allDepositsInvolvedInBatch,
  } = await getOmnipoolLiquidityMiningDepositsForAccounts({
    ctx,
    involvedAccountsPerBlock: allProcessedAccountsPerBlock,
    involvedAccountsInBatch: allInvolvedAccountsInBatchSet,
  });

  const omnipoolLiquidityPositionsMap =
    await getOmnipoolLiquidityPositionsForAccounts({
      ctx,
      involvedAccountsPerBlock: allProcessedAccountsPerBlock,
      involvedAccountsInBatch: allInvolvedAccountsInBatchSet,
      allDepositsInvolvedInBatch,
    });

  const xykpoolLiquidityDepositsMap =
    await getXykLiquidityMiningDepositsForAccounts({
      ctx,
      involvedAccountsPerBlock: allProcessedAccountsPerBlock,
      involvedAccountsInBatch: allInvolvedAccountsInBatchSet,
    });

  /**
   * Add Omnipool liquidity positions to the total transferable balance.
   */
  await addLiquidityMiningWorthToTotalBalance({
    lmWorthData: xykpoolLiquidityDepositsMap,
    refAssetId: refAsset.id,
    preProcessedTotalBalances,
    ctx,
  });

  /**
   * Add Omnipool Liquidity Mining deposits to the total transferable balance.
   */
  await addLiquidityMiningWorthToTotalBalance({
    lmWorthData: omnipoolLiquidityMiningDepositsMap,
    refAssetId: refAsset.id,
    preProcessedTotalBalances,
    ctx,
  });

  /**
   * Add XYK Liquidity Mining deposits to the total transferable balance.
   */
  await addLiquidityMiningWorthToTotalBalance({
    lmWorthData: omnipoolLiquidityPositionsMap,
    refAssetId: refAsset.id,
    preProcessedTotalBalances,
    ctx,
  });
}

async function addLiquidityMiningWorthToTotalBalance({
  preProcessedTotalBalances,
  lmWorthData,
  refAssetId,
  ctx,
}: {
  ctx: SqdProcessorContext<Store>;
  preProcessedTotalBalances?: Set<string> | null;
  refAssetId: string;
  lmWorthData: AccountPositionBalancesPerBlockPerAsset;
}) {
  for (const blockData of lmWorthData.values()) {
    for (const [accountId, accountAssetData] of blockData.data.entries()) {
      if (
        preProcessedTotalBalances &&
        preProcessedTotalBalances.has(
          `${accountId}-${blockData.blockHeader.height}`
        )
      )
        continue;

      const accountTotalBalance =
        await getOrCreateAccountTotalBalanceHistoricalData({
          accountId,
          refAssetId,
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
                  amount: BigInt(balanceBn.toFixed() ?? '0'),
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

/**
 * Reconciles account asset balances across blocks by backfilling unchanged assets.
 *
 * When an asset is not involved in any activity during a block, the indexer skips
 * creating a balance snapshot for that block. This function retrieves the most recent
 * balance records from previous blocks for such unchanged assets and includes them in
 * the current block's total balance calculation, ensuring complete and accurate
 * account balance aggregation.
 */
export async function handleUnchangedAccountAssetBalances({
  ctx,
}: {
  ctx: SqdProcessorContext<Store>;
}) {
  /**
   * A map that organizes asset balance historical data by block and account.
   */
  const assetBalancesIndexedByBlockAndAccountMap: AssetBalancesIndexedByBlockAndAccountMap =
    new Map();

  /**
   * A map that organizes asset balance historical data by account and asset.
   * Asset balances are sorted in DESC order by paraBlockHeight.
   */
  const assetBalancesIndexedByAccountAndAssetMap: AssetBalancesIndexedByAccountAndAssetMap =
    new Map();

  /**
   * Final result accumulator
   */
  const unchangedAccountAssetBalancesPerBlock: UnchangedAccountAssetBalancesPerBlockMap =
    new Map();

  const assetPriceBaseAsset = await getOrCreateAsset({
    id: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
    ctx,
    ensure: false,
  });

  if (!assetPriceBaseAsset) throw Error('Asset price base asset not found');

  indexAccountAssetBalancesAccumulators({
    assetBalancesIndexedByBlockAndAccountMap,
    assetBalancesIndexedByAccountAndAssetMap,
    ctx,
  });

  const pgPool = CommonPgPool.getInstance();

  /**
   * LOOP L1 :: Iterating block by block. Only blocks are involved where there is at least
   * some account asset balance change.
   *
   * Goal: process all blocks in blocks batch
   */
  blocks_loop: for (const [
    blockHeight,
    assetBalancesByAccountAtBlock,
  ] of assetBalancesIndexedByBlockAndAccountMap.entries()) {
    const unchangedAssetBalancesFromPrevBlockIndexedByAccount = new Map<
      AccountId,
      Map<AssetId, UnchangedAccountAssetBalanceHistoricalData>
    >();

    /**
     * LOOP L2 :: Iterating accounts involved at specific block.
     *
     * Goal: find account asset balances for the specific account at the specific
     * block which are involved in the current block
     * (check consts involvedAssetIdsSet and assetIdsForAccountToIgnoreInDbAggregation)
     */
    accounts_loop: for (const [
      accountId,
      assetBalancesAtBlock,
    ] of assetBalancesByAccountAtBlock.entries()) {
      if (!unchangedAssetBalancesFromPrevBlockIndexedByAccount.has(accountId))
        unchangedAssetBalancesFromPrevBlockIndexedByAccount.set(
          accountId,
          new Map()
        );

      const involvedAssetIdsSet = new Set(
        assetBalancesAtBlock.map((balance) => balance.assetId)
      );
      const assetIdsForAccountToIgnoreInDbAggregation = new Set<AssetId>(
        involvedAssetIdsSet.values()
      );

      /**
       * LOOP L3 :: Iterating account asset balances for the specific account BUT
       * within all blocks in the processing blocks batch.
       *
       * Goal: find account asset balances for the specific account from
       * previous blocks that are not involved in the current block.
       */
      acc_asset_balance_at_any_block_loop: for (const [
        assetId,
        assetBalancesAtMultipleBlocks,
      ] of (
        assetBalancesIndexedByAccountAndAssetMap.get(accountId) ||
        new Map<AssetId, AccountAssetBalanceHistoricalData[]>()
      ).entries()) {
        if (involvedAssetIdsSet.has(assetId))
          continue acc_asset_balance_at_any_block_loop;

        const previousAssetBalanceFromCache =
          assetBalancesAtMultipleBlocks.find(
            (e) => e.paraBlockHeight < blockHeight
          );

        if (previousAssetBalanceFromCache) {
          const unchangedAssetBalanceData =
            await getUnchangedAccountAssetBalanceFromCachedEntity({
              previousAssetBalanceFromCache,
              blockHeight,
              ctx,
            });

          if (!unchangedAssetBalanceData)
            continue acc_asset_balance_at_any_block_loop;

          unchangedAssetBalancesFromPrevBlockIndexedByAccount
            .get(accountId)!
            .set(
              previousAssetBalanceFromCache.assetId,
              unchangedAssetBalanceData
            );

          assetIdsForAccountToIgnoreInDbAggregation.add(
            previousAssetBalanceFromCache.assetId
          );
        }
      }

      let persistentAssetBalances: RawAccountAssetBalanceHistoricalData[] = [];

      try {
        persistentAssetBalances = (
          await pgPool.query<RawAccountAssetBalanceHistoricalData>(
            getPreviousAssetAccountBalancesSql,
            [
              accountId,
              Array.from(assetIdsForAccountToIgnoreInDbAggregation.values()),
            ]
          )
        ).rows;
      } catch (e) {
        console.log(e);
      }

      for (const balance of persistentAssetBalances) {
        const unchangedAssetBalanceData =
          await getUnchangedAccountAssetBalanceFromPersistentEntity({
            previousAssetBalancePersistent: balance,
            blockHeight,
            ctx,
          });

        if (!unchangedAssetBalanceData) continue;

        unchangedAssetBalancesFromPrevBlockIndexedByAccount
          .get(accountId)!
          .set(balance.asset_id, unchangedAssetBalanceData);
      }
    }

    unchangedAccountAssetBalancesPerBlock.set(
      blockHeight,
      unchangedAssetBalancesFromPrevBlockIndexedByAccount
    );
  }

  const ensuredUnchangedAccountAssetBalancesPerBlock =
    await ensureAccountAssetBalancesForOutdatedBalancesWithOnChainData({
      unchangedAccountAssetBalancesPerBlock,
      ctx,
    });
  await createAccountAssetBalancesForOutdatedBalances({
    unchangedAccountAssetBalancesPerBlock:
      ensuredUnchangedAccountAssetBalancesPerBlock,
    ctx,
  });
}
