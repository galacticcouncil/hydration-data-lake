import { Store } from '@subsquid/typeorm-store';
import { SqdProcessorContext } from '../../processor';
import {
  AccountAssetBalanceHistoricalData,
  AssetResourceType,
} from '../../model';
import { LatestProcessedDataCacheManager } from '../../utils/latestProcessedDataCacheManager';
import { getOrCreateAccountTotalBalanceHistoricalData } from './accountTotalBalance';
import { getOrCreateAsset } from '../assets/asset';
import { calcPriceNormalized } from '../../utils/helpers';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { BigNumber, toFixedTrimmed } from '../../utils/bignumber';
import {
  BalanceLogInput,
  BalancesLoggerManager,
} from './balancesLoggerManager';

type AccountId = string;
type AssetId = string;
type BlockHeight = number;

/**
 * Events-driven total balance aggregation.
 *
 * Replaces both handleAccountTotalBalance and handleUnchangedAccountAssetBalances
 * for the delta-based flow.
 *
 * For each (account, block) in batchState's accountAssetBalanceHistoricalData:
 * 1. Collect changed assets at this block (already in batchState)
 * 2. Find ALL other assets for this account from:
 *    - accountAssetBalanceHistoricalData batchState (block N-1 or older, single latest per asset)
 *    - LatestProcessedDataCacheManager (single latest per asset, prefetched from DB at batch start)
 * 3. Deduplicate: if both sources have a record, prefer newer blockHeight
 * 4. Compute total balance from all assets (changed + unchanged)
 */
export async function handleAccountTotalBalanceEventsDriven({
  preProcessedTotalBalances,
  ctx,
}: {
  preProcessedTotalBalances?: Set<string> | null;
  ctx: SqdProcessorContext<Store>;
}) {
  const cacheManager = LatestProcessedDataCacheManager.getInstance();

  const refAsset = await getOrCreateAsset({
    assetRegistryId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
    ctx,
    ensure: true,
    blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
  });

  if (!refAsset) throw Error('Ref asset not found');

  // Step 1: Single linear pass — index entries by (block, account) -> asset
  // and group them per account for the per-block "older snapshot" build below.
  const changedByBlockAndAccount = new Map<
    BlockHeight,
    Map<AccountId, Map<AssetId, AccountAssetBalanceHistoricalData>>
  >();

  const entriesByAccount = new Map<
    AccountId,
    AccountAssetBalanceHistoricalData[]
  >();

  for (const entity of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
    // Skip pre-processed entries (from handleAllAccountBalancesInit)
    if (
      preProcessedTotalBalances &&
      preProcessedTotalBalances.has(
        `${entity.accountId}-${entity.paraBlockHeight}`
      )
    )
      continue;

    // Index by block+account
    let blockMap = changedByBlockAndAccount.get(entity.paraBlockHeight);
    if (!blockMap) {
      blockMap = new Map();
      changedByBlockAndAccount.set(entity.paraBlockHeight, blockMap);
    }
    let accountAssetMap = blockMap.get(entity.accountId);
    if (!accountAssetMap) {
      accountAssetMap = new Map();
      blockMap.set(entity.accountId, accountAssetMap);
    }
    accountAssetMap.set(entity.assetId, entity);

    // Group per account for the snapshot pass below
    let accountEntries = entriesByAccount.get(entity.accountId);
    if (!accountEntries) {
      accountEntries = [];
      entriesByAccount.set(entity.accountId, accountEntries);
    }
    accountEntries.push(entity);
  }

  if (changedByBlockAndAccount.size === 0) return;

  // For each account, walk entries in ascending block order and accumulate
  // a running "latest seen per asset" map. At each distinct block, snapshot
  // the running map BEFORE adding that block's entries — that snapshot is
  // exactly the set of older balances available to this block.
  // Skip the snapshot clone when the running map is empty (common for
  // accounts that only appear once in the batch).
  const batchStateLatestByAccountAsset = new Map<
    AccountId,
    Map<BlockHeight, Map<AssetId, AccountAssetBalanceHistoricalData>>
  >();

  for (const [accountId, entries] of entriesByAccount) {
    // Group this account's entries by block, then iterate blocks in ascending order.
    const entriesByBlock = new Map<
      BlockHeight,
      AccountAssetBalanceHistoricalData[]
    >();
    for (const entry of entries) {
      const bucket = entriesByBlock.get(entry.paraBlockHeight);
      if (bucket) bucket.push(entry);
      else entriesByBlock.set(entry.paraBlockHeight, [entry]);
    }
    const sortedBlockHeights = [...entriesByBlock.keys()].sort((a, b) => a - b);

    const latestPerAsset = new Map<
      AssetId,
      AccountAssetBalanceHistoricalData
    >();
    const blockSnapshots = new Map<
      BlockHeight,
      Map<AssetId, AccountAssetBalanceHistoricalData>
    >();

    for (const blockHeight of sortedBlockHeights) {
      // Snapshot "older balances" available to this block (skip if empty —
      // the first block for an account always has nothing older).
      if (latestPerAsset.size > 0) {
        blockSnapshots.set(blockHeight, new Map(latestPerAsset));
      }

      // Apply this block's entries to the running map for the next iteration.
      for (const entry of entriesByBlock.get(blockHeight)!) {
        const prev = latestPerAsset.get(entry.assetId);
        if (!prev || prev.paraBlockHeight < entry.paraBlockHeight) {
          latestPerAsset.set(entry.assetId, entry);
        }
      }
    }

    if (blockSnapshots.size > 0) {
      batchStateLatestByAccountAsset.set(accountId, blockSnapshots);
    }
  }

  // Step 2: For each (block, account), compute total balance from ALL assets
  // All balances are already prefetched in processBalanceEventsSequentially -> prefetchPreviousBalances
  for (const [
    blockHeight,
    accountsAtBlock,
  ] of changedByBlockAndAccount.entries()) {
    for (const [accountId, changedAssetsMap] of accountsAtBlock.entries()) {
      const accountTotalBalance =
        await getOrCreateAccountTotalBalanceHistoricalData({
          accountId,
          refAssetId: refAsset.id,
          blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
          ctx,
        });

      // Collect ALL asset balances for this account at this block:
      // - Changed assets: use batchState entity at this block
      // - Unchanged assets: find latest from cacheManager or batchState (older block)

      const allAccountAssetBalancesAtBlock = new Map<
        AssetId,
        { transferable: bigint; totalLocked: bigint; blockHeight: number }
      >();

      // Source 1: cacheManager (prefetched from DB at batch start, updated between batches)
      const cachedBalances = cacheManager.getAllAccountAssetBalances(accountId);
      for (const [assetId, cachedEntity] of cachedBalances.entries()) {
        allAccountAssetBalancesAtBlock.set(assetId, {
          transferable: BigInt(cachedEntity.transferable),
          totalLocked: BigInt(cachedEntity.totalLocked),
          blockHeight: cachedEntity.paraBlockHeight,
        });
      }

      // Source 2: batchState entries at older blocks (overrides if newer)
      const batchAssets = batchStateLatestByAccountAsset
        .get(accountId)
        ?.get(blockHeight);

      if (batchAssets) {
        for (const [assetId, batchEntity] of batchAssets.entries()) {
          if (batchEntity.paraBlockHeight < blockHeight) {
            const existing = allAccountAssetBalancesAtBlock.get(assetId);
            if (
              !existing ||
              existing.blockHeight < batchEntity.paraBlockHeight
            ) {
              allAccountAssetBalancesAtBlock.set(assetId, {
                transferable: BigInt(batchEntity.transferable),
                totalLocked: BigInt(batchEntity.totalLocked),
                blockHeight: batchEntity.paraBlockHeight,
              });
            }
          }
        }
      }

      // Override with changed assets at THIS block (definitive values)
      for (const [assetId, entity] of changedAssetsMap.entries()) {
        allAccountAssetBalancesAtBlock.set(assetId, {
          transferable: BigInt(entity.transferable),
          totalLocked: BigInt(entity.totalLocked),
          blockHeight: blockHeight,
        });
      }

      // Now compute total balance from all assets
      for (const [
        assetId,
        balance,
      ] of allAccountAssetBalancesAtBlock.entries()) {
        if (balance.transferable === 0n && balance.totalLocked === 0n) continue;

        const asset = await getOrCreateAsset({
          id: assetId,
          ctx,
          ensure: false,
        });
        if (!asset) continue;

        const assetSpotPrice = getAssetsPairPrice({
          ctx,
          assetInId: assetId,
          blockHeight,
        });

        const transferableNorm =
          assetSpotPrice && asset.decimals
            ? calcPriceNormalized({
                amount: balance.transferable,
                assetDecimals: asset.decimals,
                spotPrice: assetSpotPrice,
              })
            : '0';

        const totalLockedNorm =
          assetSpotPrice && asset.decimals
            ? calcPriceNormalized({
                amount: balance.totalLocked,
                assetDecimals: asset.decimals,
                spotPrice: assetSpotPrice,
              })
            : '0';

        // Handle ref asset special case
        const isChangedAsset = changedAssetsMap.has(assetId);
        if (isChangedAsset && assetId === refAsset.id) {
          const entity = changedAssetsMap.get(assetId)!;
          entity.transferableInRefAssetNorm = calcPriceNormalized({
            amount: BigInt(entity.transferable.toString() ?? '0'),
            assetDecimals: asset.decimals!,
            spotPrice: '1',
          });
        }

        // Debt tokens subtract from total
        if (asset.resourceType === AssetResourceType.Debt) {
          accountTotalBalance.totalTransferableNorm = toFixedTrimmed(
            BigNumber(accountTotalBalance.totalTransferableNorm).minus(
              transferableNorm || '0'
            )
          );

          accountTotalBalance.totalDebtNorm = toFixedTrimmed(
            BigNumber(accountTotalBalance.totalDebtNorm ?? '0').plus(
              transferableNorm || '0'
            )
          );
        } else {
          accountTotalBalance.totalTransferableNorm = toFixedTrimmed(
            BigNumber(accountTotalBalance.totalTransferableNorm).plus(
              transferableNorm || '0'
            )
          );
        }

        accountTotalBalance.totalLockedNorm = toFixedTrimmed(
          BigNumber(accountTotalBalance.totalLockedNorm).plus(
            totalLockedNorm || '0'
          )
        );

        BalancesLoggerManager.getInstance().addLog({
          accountId,
          assetId,
          source: isChangedAsset
            ? 'ASSET_BALANCE_EXPLICIT'
            : ('ASSET_BALANCE_UNCHANGED_EVENTS_DRIVEN' as BalanceLogInput['source']),
          memo: 'fn :: handleAccountTotalBalanceEventsDriven',
          paraBlockHeight: blockHeight,
          transferable: balance.transferable,
          totalLocked: balance.totalLocked,
          transferableNorm: transferableNorm,
          totalLockedNorm: totalLockedNorm,
        });
      }

      ctx.batchState.state.accountTotalBalanceHistoricalData.set(
        accountTotalBalance.id,
        accountTotalBalance
      );
    }
  }
}
//
// export async function handleAccountTotalBalanceEventsDriven({
//   preProcessedTotalBalances,
//   ctx,
// }: {
//   preProcessedTotalBalances?: Set<string> | null;
//   ctx: SqdProcessorContext<Store>;
// }) {
//   const cacheManager = LatestProcessedDataCacheManager.getInstance();
//
//   const refAsset = await getOrCreateAsset({
//     assetRegistryId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
//     ctx,
//     ensure: true,
//     blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
//   });
//
//   if (!refAsset) throw Error('Ref asset not found');
//
//   // Step 1: Index batchState entries by (block, account) -> asset[]
//   const changedByBlockAndAccount = new Map<
//     BlockHeight,
//     Map<AccountId, Map<AssetId, AccountAssetBalanceHistoricalData>>
//   >();
//
//   // Also index by (account, asset) keeping the latest entry per asset (across all blocks)
//   const batchStateLatestByAccountAsset = new Map<
//     AccountId,
//     Map<AssetId, AccountAssetBalanceHistoricalData>
//   >();
//
//   for (const entity of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
//     // Skip pre-processed entries (from handleAllAccountBalancesInit)
//     if (
//       preProcessedTotalBalances &&
//       preProcessedTotalBalances.has(
//         `${entity.accountId}-${entity.paraBlockHeight}`
//       )
//     )
//       continue;
//
//     // Index by block+account
//     if (!changedByBlockAndAccount.has(entity.paraBlockHeight)) {
//       changedByBlockAndAccount.set(entity.paraBlockHeight, new Map());
//     }
//     const blockMap = changedByBlockAndAccount.get(entity.paraBlockHeight)!;
//     if (!blockMap.has(entity.accountId)) {
//       blockMap.set(entity.accountId, new Map());
//     }
//     blockMap.get(entity.accountId)!.set(entity.assetId, entity);
//
//     // Index latest per (account, asset) across all blocks
//     if (!batchStateLatestByAccountAsset.has(entity.accountId)) {
//       batchStateLatestByAccountAsset.set(entity.accountId, new Map());
//     }
//     const accountMap = batchStateLatestByAccountAsset.get(entity.accountId)!;
//     const existing = accountMap.get(entity.assetId);
//     if (!existing || existing.paraBlockHeight < entity.paraBlockHeight) {
//       accountMap.set(entity.assetId, entity);
//     }
//   }
//
//   if (changedByBlockAndAccount.size === 0) return;
//
//   // Step 2: For each (block, account), compute total balance from ALL assets
//   // All balances are already prefetched in processBalanceEventsSequentially -> prefetchPreviousBalances
//   for (const [
//     blockHeight,
//     accountsAtBlock,
//   ] of changedByBlockAndAccount.entries()) {
//     for (const [accountId, changedAssetsMap] of accountsAtBlock.entries()) {
//       const accountTotalBalance =
//         await getOrCreateAccountTotalBalanceHistoricalData({
//           accountId,
//           refAssetId: refAsset.id,
//           blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
//           ctx,
//         });
//
//       // Collect ALL asset balances for this account at this block:
//       // - Changed assets: use batchState entity at this block
//       // - Unchanged assets: find latest from cacheManager or batchState (older block)
//
//       const allAssetBalances = new Map<
//         AssetId,
//         { transferable: bigint; totalLocked: bigint; blockHeight: number }
//       >();
//
//       // Source 1: cacheManager (prefetched from DB at batch start, updated between batches)
//       const cachedBalances = cacheManager.getAllAccountAssetBalances(accountId);
//       for (const [assetId, cachedEntity] of cachedBalances.entries()) {
//         allAssetBalances.set(assetId, {
//           transferable: BigInt(cachedEntity.transferable),
//           totalLocked: BigInt(cachedEntity.totalLocked),
//           blockHeight: cachedEntity.paraBlockHeight,
//         });
//       }
//
//       // Source 2: batchState entries at older blocks (overrides if newer)
//       const batchAssets = batchStateLatestByAccountAsset.get(accountId);
//       if (batchAssets) {
//         for (const [assetId, batchEntity] of batchAssets.entries()) {
//           // Only use entries from blocks before current block for unchanged assets
//           if (batchEntity.paraBlockHeight < blockHeight) {
//             const existing = allAssetBalances.get(assetId);
//             if (
//               !existing ||
//               batchEntity.paraBlockHeight > existing.blockHeight
//             ) {
//               allAssetBalances.set(assetId, {
//                 transferable: BigInt(batchEntity.transferable),
//                 totalLocked: BigInt(batchEntity.totalLocked),
//                 blockHeight: batchEntity.paraBlockHeight,
//               });
//             }
//           }
//         }
//       }
//
//       // Override with changed assets at THIS block (definitive values)
//       for (const [assetId, entity] of changedAssetsMap.entries()) {
//         allAssetBalances.set(assetId, {
//           transferable: BigInt(entity.transferable),
//           totalLocked: BigInt(entity.totalLocked),
//           blockHeight: blockHeight,
//         });
//       }
//
//       // Now compute total balance from all assets
//       for (const [assetId, balance] of allAssetBalances.entries()) {
//         if (balance.transferable === 0n && balance.totalLocked === 0n) continue;
//
//         const asset = await getOrCreateAsset({
//           id: assetId,
//           ctx,
//           ensure: false,
//         });
//         if (!asset) continue;
//
//         const assetSpotPrice = getAssetsPairPrice({
//           ctx,
//           assetInId: assetId,
//           blockHeight,
//         });
//
//         const transferableNorm =
//           assetSpotPrice && asset.decimals
//             ? calcPriceNormalized({
//                 amount: balance.transferable,
//                 assetDecimals: asset.decimals,
//                 spotPrice: assetSpotPrice,
//               })
//             : '0';
//
//         const totalLockedNorm =
//           assetSpotPrice && asset.decimals
//             ? calcPriceNormalized({
//                 amount: balance.totalLocked,
//                 assetDecimals: asset.decimals,
//                 spotPrice: assetSpotPrice,
//               })
//             : '0';
//
//         // Handle ref asset special case
//         const isChangedAsset = changedAssetsMap.has(assetId);
//         if (isChangedAsset && assetId === refAsset.id) {
//           const entity = changedAssetsMap.get(assetId)!;
//           entity.transferableInRefAssetNorm = calcPriceNormalized({
//             amount: BigInt(entity.transferable.toString() ?? '0'),
//             assetDecimals: asset.decimals!,
//             spotPrice: '1',
//           });
//         }
//
//         // Debt tokens subtract from total
//         if (asset.resourceType === AssetResourceType.Debt) {
//           accountTotalBalance.totalTransferableNorm = BigNumber(
//             accountTotalBalance.totalTransferableNorm
//           )
//             .minus(transferableNorm || '0')
//             .toFixed();
//
//           accountTotalBalance.totalDebtNorm = BigNumber(
//             accountTotalBalance.totalDebtNorm ?? '0'
//           )
//             .plus(transferableNorm || '0')
//             .toFixed();
//         } else {
//           accountTotalBalance.totalTransferableNorm = BigNumber(
//             accountTotalBalance.totalTransferableNorm
//           )
//             .plus(transferableNorm || '0')
//             .toFixed();
//         }
//
//         accountTotalBalance.totalLockedNorm = BigNumber(
//           accountTotalBalance.totalLockedNorm
//         )
//           .plus(totalLockedNorm || '0')
//           .toFixed();
//
//         BalancesLoggerManager.getInstance().addLog({
//           accountId,
//           assetId,
//           source: isChangedAsset
//             ? 'ASSET_BALANCE_EXPLICIT'
//             : ('ASSET_BALANCE_UNCHANGED_EVENTS_DRIVEN' as BalanceLogInput['source']),
//           memo: 'fn :: handleAccountTotalBalanceEventsDriven',
//           paraBlockHeight: blockHeight,
//           transferable: balance.transferable,
//           totalLocked: balance.totalLocked,
//           transferableNorm: transferableNorm,
//           totalLockedNorm: totalLockedNorm,
//         });
//       }
//
//       ctx.batchState.state.accountTotalBalanceHistoricalData.set(
//         accountTotalBalance.id,
//         accountTotalBalance
//       );
//     }
//   }
// }
