import { Store } from '@subsquid/typeorm-store';

import {
  Asset,
  EvmEventName,
  MmSupply,
  MmWithdraw,
  ResourceType,
  RoutedTrade,
  Swap,
  SwapAssetBalance,
} from '../../model';
import { EvmLogData } from '../../parsers/batchBlocksParser/types/evm';
import { EvmLogEventParams } from '../../parsers/types/events';
import {
  SqdBlock,
  SqdProcessorContext,
} from '../../processor';
import { getOrCreateAccount } from '../accounts';
import {
  batchGetOrCreateAssets,
  getOrCreateAsset,
} from '../assets/asset';
import { processNewMoneyMarketEvent } from './moneyMarketEvent';

// Helper function to create synthetic EVM log data for money market events
function createSyntheticEvmLogData(
  swap: Swap,
  eventName: EvmEventName
): EvmLogData {
  return {
    eventData: {
      params: {
        eventName,
        address: '',
        signature: '',
        args: {},
      } as EvmLogEventParams,
      metadata: {
        id: swap.event.id,
        traceId: swap.event.traceId,
        indexInBlock: swap.event.indexInBlock,
        blockHeader: {
          height: swap.paraBlockHeight,
        } as SqdBlock,
      },
    },
    callData: {},
  } as EvmLogData;
}

export async function createMoneyMarketEventsFromRoutedTrades(
  ctx: SqdProcessorContext<Store>,
  routedTrades: RoutedTrade[]
) {
  if (routedTrades.length === 0) return;

  // Step 1: Collect ALL unique asset IDs from all swaps in all trades
  const uniqueAssetIds = new Set<string>();
  const swapBlockHeights = new Map<string, number>(); // Track block height per asset for proper fetching

  for (const trade of routedTrades) {
    for (const swap of trade.swaps) {
      // Collect from inputs
      for (const input of swap.inputs) {
        if (input.assetId) {
          uniqueAssetIds.add(input.assetId);
          swapBlockHeights.set(input.assetId, swap.paraBlockHeight);
        }
      }
      // Collect from outputs
      for (const output of swap.outputs) {
        if (output.assetId) {
          uniqueAssetIds.add(output.assetId);
          swapBlockHeights.set(output.assetId, swap.paraBlockHeight);
        }
      }
    }
  }

  if (uniqueAssetIds.size === 0) return;

  // Step 2: Batch fetch all assets in SINGLE database query (5-10x faster!)
  const firstBlockHeight = Math.min(...Array.from(swapBlockHeights.values()));
  const assetCache = await batchGetOrCreateAssets({
    ctx,
    ids: Array.from(uniqueAssetIds),
    ensure: true,
    blockHeader: { height: firstBlockHeight } as SqdBlock,
  });

  // Step 3: Process each trade and filter for collateral assets using fetched data
  const tradesWithCollateral: Array<{
    trade: RoutedTrade;
    firstSwap: Swap;
    inputBalances: SwapAssetBalance[];
    outputBalances: SwapAssetBalance[];
  }> = [];

  for (const trade of routedTrades) {
    if (!trade.swaps || trade.swaps.length === 0) continue;

    // Sort swaps by event index
    const orderedSwaps = trade.swaps.sort(
      (a, b) => a.event.indexInBlock - b.event.indexInBlock
    );

    const firstSwap = orderedSwaps[0];
    const lastSwap = orderedSwaps[orderedSwaps.length - 1];

    // Filter inputs for collateral assets using fetched asset data
    const collateralInputs = firstSwap.inputs.filter((sab) => {
      const asset = assetCache.get(sab.assetId);
      return asset?.resourceType === ResourceType.Collateral;
    });

    // Filter outputs for collateral assets using fetched asset data
    const collateralOutputs = lastSwap.outputs.filter((sab) => {
      const asset = assetCache.get(sab.assetId);
      return asset?.resourceType === ResourceType.Collateral;
    });

    // Skip if no collateral assets found
    if (collateralInputs.length === 0 && collateralOutputs.length === 0) continue;

    tradesWithCollateral.push({
      trade,
      firstSwap,
      inputBalances: collateralInputs,
      outputBalances: collateralOutputs,
    });
  }

  if (tradesWithCollateral.length === 0) return;

  // Step 4: Process all trades in parallel
  await Promise.all(
    tradesWithCollateral.map(async ({ trade, firstSwap, inputBalances, outputBalances }) => {
      // Process withdrawals and supplies concurrently
      const withdrawalPromises = inputBalances.map((assetBalance) =>
        createSyntheticMmWithdrawalEvent({
          swap: firstSwap,
          assetBalance,
          trade,
          ctx,
          assetCache,
        })
      );

      const supplyPromises = outputBalances.map((assetBalance) =>
        createSyntheticMmSupplyEvent({
          swap: firstSwap,
          assetBalance,
          trade,
          ctx,
          assetCache,
        })
      );

      await Promise.all([...withdrawalPromises, ...supplyPromises]);
    })
  );
}

async function createSyntheticMmWithdrawalEvent({
  assetBalance,
  swap,
  trade,
  ctx,
  assetCache,
}: {
  assetBalance: SwapAssetBalance;
  swap: Swap;
  trade: RoutedTrade;
  ctx: SqdProcessorContext<Store>;
  assetCache?: Map<string, Asset>;
}) {
  // Use cached asset if available, otherwise fetch
  const assetEntity = assetBalance.assetId
    ? assetCache?.get(assetBalance.assetId) ?? await getOrCreateAsset({
        ctx,
        id: assetBalance.assetId,
        ensure: true,
        blockHeader: { height: swap.paraBlockHeight } as SqdBlock,
      })
    : null;

  if (!assetEntity) {
    console.log(
      `Asset ${assetBalance.assetId} not found for synthetic MM Withdraw event creation for swap ${swap.id}`
    );
    return;
  }

  const accountFrom = swap.swapperId ? await getOrCreateAccount({
    ctx,
    id: swap.swapperId,
  }) : undefined;
  const accountTo = swap.swapperId ? await getOrCreateAccount({
    ctx,
    id: swap.swapperId,
  }) : undefined;

  const mmWithdrawEntity = new MmWithdraw({
    id: swap.id,
    traceIds: swap.traceIds,
    assetId: assetEntity.id,
    accountFromId: accountFrom?.id,
    accountToId: accountTo?.id,
    amount: assetBalance.amount,
    paraBlockHeight: swap.paraBlockHeight,
    event: swap.event,
    initiatedByTrade: trade,
  });

  ctx.batchState.state.mmWithdrawals.set(mmWithdrawEntity.id, mmWithdrawEntity);

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData: createSyntheticEvmLogData(swap, EvmEventName.Withdraw),
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedAssetRegistryIds: [assetEntity.assetRegistryId],
    allInvolvedAssetDetails: [assetEntity.name, assetEntity.symbol],
    allInvolvedParticipants: [accountFrom?.id ?? "", accountTo?.id ?? ""],
    withdraw: mmWithdrawEntity,
  });
}

async function createSyntheticMmSupplyEvent({
  assetBalance,
  swap,
  trade,
  ctx,
  assetCache,
}: {
  assetBalance: SwapAssetBalance;
  swap: Swap;
  trade: RoutedTrade;
  ctx: SqdProcessorContext<Store>;
  assetCache?: Map<string, Asset>;
}) {
  // Use cached asset if available, otherwise fetch
  const assetEntity = assetBalance.assetId
    ? assetCache?.get(assetBalance.assetId) ?? await getOrCreateAsset({
        ctx,
        id: assetBalance.assetId,
        ensure: true,
        blockHeader: { height: swap.paraBlockHeight } as SqdBlock,
      })
    : null;

  if (!assetEntity) {
    console.log(
      `Asset ${assetBalance.assetId} not found for synthetic MM Withdraw event creation for swap ${swap.id}`
    );
    return;
  }
  const account = swap.swapperId ? await getOrCreateAccount({
    ctx,
    id: swap.swapperId,
  }) : undefined;

  const accountOnBehalfOf = swap.swapperId ? await getOrCreateAccount({
    ctx,
    id: swap.swapperId,
  }) : undefined;

  const mmSupplyEntity = new MmSupply({
    id: swap.id,
    traceIds: swap.traceIds,
    assetId: assetEntity.id,
    accountId: account?.id,
    accountOnBehalfOfId: accountOnBehalfOf?.id,
    amount: assetBalance.amount,
    paraBlockHeight: swap.paraBlockHeight,
    event: swap.event,
    initiatedByTrade: trade,
  });

  ctx.batchState.state.mmSupplies.set(mmSupplyEntity.id, mmSupplyEntity);

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData: createSyntheticEvmLogData(swap, EvmEventName.Supply),
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedAssetRegistryIds: [assetEntity.assetRegistryId],
    allInvolvedAssetDetails: [assetEntity.name, assetEntity.symbol],
    allInvolvedParticipants: [account?.id ?? "", accountOnBehalfOf?.id ?? ""],
    supply: mmSupplyEntity,
  });
}
