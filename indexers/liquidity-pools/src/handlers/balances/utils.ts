import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AccountAssetBalanceHistoricalData } from '../../model';
import { getOrCreateAsset } from '../assets/asset';
import { calcPriceNormalized } from '../../utils/helpers';
import {
  AssetBalancesIndexedByAccountAndAssetMap,
  AssetBalancesIndexedByBlockAndAccountMap,
  RawAccountAssetBalanceHistoricalData,
  UnchangedAccountAssetBalanceHistoricalData,
  UnchangedAccountAssetBalancesPerBlockMap,
} from './accountTotalBalance';
import { BigNumber } from '@galacticcouncil/sdk';
import {
  BalancesAccountInfoWithAccountId,
  TokenAccountBalancesWithAccountId,
} from '../../parsers/types/storage';
import { AssetBalancesStorageDataPerBlockPerAccountMap } from './commonAssetBalances';
import { getOrCreateAccountAssetBalanceHistoricalData } from './accountAssetBalance';
import { getOrCreateAccount } from '../accounts';
type AssetId = string;

export async function initAccountAssetBalancesForExistingParticipants({}: {
  ctx: SqdProcessorContext<Store>;
}) {
  /**
   * We need
   * - get all involved accounts from the batch
   * - filter them by marker isAssetBalancesHistoryInitialized (must be added)
   * - add these accounts to allProcessedAccountsPerBlock at first block of the batch
   * to collect balances for all normal assets, aTokens, debtTokens
   */
}

export async function getUnchangedAccountAssetBalanceFromCachedEntity({
  previousAssetBalanceFromCache,
  blockHeight,
  ctx,
}: {
  previousAssetBalanceFromCache: AccountAssetBalanceHistoricalData;
  blockHeight: number;
  ctx: SqdProcessorContext<Store>;
}): Promise<UnchangedAccountAssetBalanceHistoricalData | null> {
  const latestAssetPrice =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
      `${previousAssetBalanceFromCache.assetId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${blockHeight}`
    );

  const asset = await getOrCreateAsset({
    id: previousAssetBalanceFromCache.assetId,
    ctx,
    ensure: false,
  });
  if (!asset) return null;

  /**
   * We need to actualize normalized balances based on price at the specific block.
   * It's necessary in case of a big gap between the current processing block
   * and the latest asset balance snapshot. The price of asset can be changed
   * dramatically during this period, so account's total balance will be wrong
   * if we don't actualize balance with the latest price.
   */
  const transferableInRefAssetNorm =
    !latestAssetPrice || !asset.decimals
      ? previousAssetBalanceFromCache.transferableInRefAssetNorm
      : calcPriceNormalized({
          amount: BigInt(previousAssetBalanceFromCache.transferable),
          assetDecimals: asset!.decimals!,
          spotPrice: latestAssetPrice.priceNormalised,
        });

  const totalLockedInRefAssetNorm =
    !latestAssetPrice || !asset.decimals
      ? previousAssetBalanceFromCache.totalLockedInRefAssetNorm
      : calcPriceNormalized({
          amount: BigInt(previousAssetBalanceFromCache.totalLocked),
          assetDecimals: asset!.decimals!,
          spotPrice: latestAssetPrice.priceNormalised,
        });

  return {
    id: previousAssetBalanceFromCache.id,
    accountId: previousAssetBalanceFromCache.accountId,
    assetId: previousAssetBalanceFromCache.assetId,
    transferableInRefAssetNorm: transferableInRefAssetNorm ?? '0',
    totalLockedInRefAssetNorm: totalLockedInRefAssetNorm ?? '0',
    paraBlockHeight: previousAssetBalanceFromCache.paraBlockHeight,
    processingParaBlockHeight: blockHeight,
  };
}

export async function getUnchangedAccountAssetBalanceFromPersistentEntity({
  previousAssetBalancePersistent,
  blockHeight,
  ctx,
}: {
  previousAssetBalancePersistent: RawAccountAssetBalanceHistoricalData;
  blockHeight: number;
  ctx: SqdProcessorContext<Store>;
}): Promise<UnchangedAccountAssetBalanceHistoricalData | null> {
  const latestAssetPrice =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
      `${previousAssetBalancePersistent.asset_id}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${blockHeight}`
    );

  const asset = await getOrCreateAsset({
    id: previousAssetBalancePersistent.asset_id,
    ctx,
    ensure: false,
  });
  if (!asset) return null;

  /**
   * We need to actualize normalized balances based on price at the specific block.
   * It's necessary in case of a big gap between the current processing block
   * and the latest asset balance snapshot. The price of asset can be changed
   * dramatically during this period, so account's total balance will be wrong
   * if we don't actualize balance with the latest price.
   */
  const transferableInRefAssetNorm =
    !latestAssetPrice || !asset.decimals
      ? previousAssetBalancePersistent.transferable_in_ref_asset_norm
      : calcPriceNormalized({
          amount: BigInt(previousAssetBalancePersistent.transferable),
          assetDecimals: asset!.decimals!,
          spotPrice: latestAssetPrice.priceNormalised,
        });

  const totalLockedInRefAssetNorm =
    !latestAssetPrice || !asset.decimals
      ? previousAssetBalancePersistent.total_locked_in_ref_asset_norm
      : calcPriceNormalized({
          amount: BigInt(previousAssetBalancePersistent.total_locked),
          assetDecimals: asset!.decimals!,
          spotPrice: latestAssetPrice.priceNormalised,
        });

  return {
    id: previousAssetBalancePersistent.id,
    accountId: previousAssetBalancePersistent.account_id,
    assetId: previousAssetBalancePersistent.asset_id,
    transferableInRefAssetNorm: transferableInRefAssetNorm ?? '0',
    totalLockedInRefAssetNorm: totalLockedInRefAssetNorm ?? '0',
    paraBlockHeight: previousAssetBalancePersistent.para_block_height,
    processingParaBlockHeight: blockHeight,
  };
}

export async function createAccountAssetBalancesForOutdatedBalances({
  unchangedAccountAssetBalancesPerBlock,
  ctx,
}: {
  unchangedAccountAssetBalancesPerBlock: UnchangedAccountAssetBalancesPerBlockMap;
  ctx: SqdProcessorContext<Store>;
}) {
  for (const [
    blockNumber,
    blockData,
  ] of unchangedAccountAssetBalancesPerBlock.entries()) {
    for (const [accountId, accountBalances] of blockData.entries()) {
      const account = await getOrCreateAccount({ ctx, id: accountId });

      for (const assetBalance of accountBalances.values()) {
        const assetBalanceHistData =
          await getOrCreateAccountAssetBalanceHistoricalData({
            ctx,
            assetId: assetBalance.assetId,
            account,
            blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(
              assetBalance.processingParaBlockHeight
            ),
            fetchFromDb: false,
          });

        assetBalanceHistData.transferable = 0n;
        assetBalanceHistData.totalLocked = 0n;
        assetBalanceHistData.transferableInRefAssetNorm = '0';
        assetBalanceHistData.totalLockedInRefAssetNorm = '0';

        ctx.batchState.state.accountAssetBalanceHistoricalData.set(
          assetBalanceHistData.id,
          assetBalanceHistData
        );
      }
    }
  }
}

export function updateAccountTotalBalanceHistoricalDataWithUnchangedBalances({
  unchangedAccountAssetBalancesPerBlock,
  ctx,
}: {
  unchangedAccountAssetBalancesPerBlock: UnchangedAccountAssetBalancesPerBlockMap;
  ctx: SqdProcessorContext<Store>;
}) {
  for (const accountTotalBalance of ctx.batchState.state.accountTotalBalanceHistoricalData.values()) {
    console.log(
      `accountTotalBalance OLD - ${accountTotalBalance.accountId} - ${accountTotalBalance.paraBlockHeight} - ${accountTotalBalance.totalTransferableNorm}`
    );
    const accountTotalTransferableBalanceSummaryAtBlock = Array.from(
      (
        unchangedAccountAssetBalancesPerBlock
          .get(accountTotalBalance.paraBlockHeight)
          ?.get(accountTotalBalance.accountId) ||
        new Map<AssetId, UnchangedAccountAssetBalanceHistoricalData>()
      ).values()
    ).reduce((acc, value) => {
      return acc.plus(value.transferableInRefAssetNorm);
    }, BigNumber(accountTotalBalance.totalTransferableNorm));

    console.log(
      `accountTotalTransferableBalanceSummaryAtBlock - ${accountTotalBalance.accountId} - ${accountTotalBalance.paraBlockHeight} - ${accountTotalTransferableBalanceSummaryAtBlock.toFixed(
        18,
        BigNumber.ROUND_HALF_UP
      )}`
    );

    accountTotalBalance.totalTransferableNorm =
      accountTotalTransferableBalanceSummaryAtBlock.toFixed(
        18,
        BigNumber.ROUND_HALF_UP
      );

    ctx.batchState.state.accountTotalBalanceHistoricalData.set(
      accountTotalBalance.id,
      accountTotalBalance
    );
  }
}

export function indexAccountAssetBalancesAccumulators({
  assetBalancesIndexedByBlockAndAccountMap,
  assetBalancesIndexedByAccountAndAssetMap,
  ctx,
}: {
  assetBalancesIndexedByBlockAndAccountMap: AssetBalancesIndexedByBlockAndAccountMap;
  assetBalancesIndexedByAccountAndAssetMap: AssetBalancesIndexedByAccountAndAssetMap;
  ctx: SqdProcessorContext<Store>;
}) {
  for (const assetBalance of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
    if (
      !assetBalancesIndexedByBlockAndAccountMap.has(
        assetBalance.paraBlockHeight
      )
    )
      assetBalancesIndexedByBlockAndAccountMap.set(
        assetBalance.paraBlockHeight,
        new Map()
      );

    if (
      !assetBalancesIndexedByBlockAndAccountMap
        .get(assetBalance.paraBlockHeight)!
        .has(assetBalance.accountId)
    )
      assetBalancesIndexedByBlockAndAccountMap
        .get(assetBalance.paraBlockHeight)!
        .set(assetBalance.accountId, []);

    assetBalancesIndexedByBlockAndAccountMap
      .get(assetBalance.paraBlockHeight)!
      .get(assetBalance.accountId)!
      .push(assetBalance);

    if (!assetBalancesIndexedByAccountAndAssetMap.has(assetBalance.accountId))
      assetBalancesIndexedByAccountAndAssetMap.set(
        assetBalance.accountId,
        new Map()
      );

    if (
      !assetBalancesIndexedByAccountAndAssetMap
        .get(assetBalance.accountId)!
        .has(assetBalance.assetId)
    )
      assetBalancesIndexedByAccountAndAssetMap
        .get(assetBalance.accountId)!
        .set(assetBalance.assetId, []);

    assetBalancesIndexedByAccountAndAssetMap
      .get(assetBalance.accountId)!
      .get(assetBalance.assetId)!
      .push(assetBalance);
  }

  for (const [
    accountId,
    accountBalancesByAsset,
  ] of assetBalancesIndexedByAccountAndAssetMap.entries()) {
    for (const [assetId, accountBalances] of accountBalancesByAsset.entries()) {
      assetBalancesIndexedByAccountAndAssetMap.get(accountId)!.set(
        assetId,
        accountBalances.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
      );
    }
  }
}

export function addAssetBalancesToAccumulator({
  commonTokenBalances,
  nativeTokenBalances,
  accumulator,
  blockNumber,
}: {
  accumulator: AssetBalancesStorageDataPerBlockPerAccountMap;
  nativeTokenBalances: BalancesAccountInfoWithAccountId[];
  commonTokenBalances: TokenAccountBalancesWithAccountId[];
  blockNumber: number;
}) {
  if (!accumulator.has(blockNumber)) accumulator.set(blockNumber, new Map());

  const currentBlockData = accumulator.get(blockNumber)!;

  for (const nativeTokenBalance of nativeTokenBalances) {
    if (!currentBlockData.has(nativeTokenBalance.accountId)) {
      currentBlockData.set(nativeTokenBalance.accountId, new Map());
    }

    currentBlockData
      .get(nativeTokenBalance.accountId)!
      .set('0', nativeTokenBalance.data);
  }

  for (const commonTokenBalance of commonTokenBalances) {
    if (!currentBlockData.has(commonTokenBalance.accountId)) {
      currentBlockData.set(commonTokenBalance.accountId, new Map());
    }

    const accountData = currentBlockData.get(commonTokenBalance.accountId)!;
    for (const balance of commonTokenBalance.assetBalances) {
      accountData.set(balance.assetId, balance.data);
    }
  }
}
