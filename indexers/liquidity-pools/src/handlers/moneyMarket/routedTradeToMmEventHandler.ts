import { Store } from '@subsquid/typeorm-store';

import {
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
import { processNewMoneyMarketEvent } from './moneyMarketEvent';

export async function createMoneyMarketEventsFromRoutedTrades(
  ctx: SqdProcessorContext<Store>,
  routedTrades: RoutedTrade[]
) {
  for (const trade of routedTrades) {
    const orderedSwaps = trade.swaps.sort(
      (a, b) => a.event.indexInBlock - b.event.indexInBlock
    );
    const collateralAssetInputToTrade = orderedSwaps[0].inputs.filter(
      (sab) => sab.assetInfo.resourceType === ResourceType.Collateral
    );
    const collateralAssetsOutputFromTrade = orderedSwaps[
      orderedSwaps.length - 1
    ].outputs.filter(
      (sab) => sab.assetInfo.resourceType === ResourceType.Collateral
    );

    if (collateralAssetInputToTrade.length > 0) {
      for (const assetBalance of collateralAssetInputToTrade) {
        await createSyntheticMmWithdrawalEvent({
          swap: orderedSwaps[0],
          assetBalance,
          trade,
          ctx,
        });
      }
    }

    if (collateralAssetsOutputFromTrade.length > 0) {
      for (const assetBalance of collateralAssetsOutputFromTrade) {
        await createSyntheticMmSupplyEvent({
          swap: orderedSwaps[0],
          assetBalance,
          trade,
          ctx,
        });
      }
    }
  }
}

async function createSyntheticMmWithdrawalEvent({
  assetBalance,
  swap,
  trade,
  ctx,
}: {
  assetBalance: SwapAssetBalance;
  swap: Swap;
  trade: RoutedTrade;
  ctx: SqdProcessorContext<Store>;
}) {
  const assetEntity = assetBalance.assetInfo;

  const accountFrom = swap.swapper;
  const accountTo = swap.swapper;

  const mmWithdrawEntity = new MmWithdraw({
    id: swap.id,
    traceIds: swap.traceIds,
    assetId: assetEntity.id,
    accountFrom,
    accountTo,
    amount: assetBalance.amount,
    relayBlockHeight: swap.relayBlockHeight,
    paraBlockHeight: swap.paraBlockHeight,
    event: swap.event,
    initiatedByTrade: trade,
  });

  ctx.batchState.state.mmWithdrawals.set(mmWithdrawEntity.id, mmWithdrawEntity);

  const eventCallData = {
    eventData: {
      params: {
        eventName: EvmEventName.Withdraw,
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

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedAssetRegistryIds: [assetEntity.assetRegistryId],
    allInvolvedAssetDetails: [assetEntity.name, assetEntity.symbol],
    allInvolvedParticipants: [accountFrom.id, accountTo.id],
    withdraw: mmWithdrawEntity,
  });
}

async function createSyntheticMmSupplyEvent({
  assetBalance,
  swap,
  trade,
  ctx,
}: {
  assetBalance: SwapAssetBalance;
  swap: Swap;
  trade: RoutedTrade;
  ctx: SqdProcessorContext<Store>;
}) {
  const assetEntity = assetBalance.assetInfo;

  const account = swap.swapper;

  const accountOnBehalfOf = swap.swapper;

  const mmSupplyEntity = new MmSupply({
    id: swap.id,
    traceIds: swap.traceIds,
    assetId: assetEntity.id,
    account,
    accountOnBehalfOf,
    amount: assetBalance.amount,
    relayBlockHeight: swap.relayBlockHeight,
    paraBlockHeight: swap.paraBlockHeight,
    event: swap.event,
    initiatedByTrade: trade,
  });

  ctx.batchState.state.mmSupplies.set(mmSupplyEntity.id, mmSupplyEntity);

  const eventCallData = {
    eventData: {
      params: {
        eventName: EvmEventName.Supply,
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

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedAssetRegistryIds: [assetEntity.assetRegistryId],
    allInvolvedAssetDetails: [assetEntity.name, assetEntity.symbol],
    allInvolvedParticipants: [account.id, accountOnBehalfOf.id],
    supply: mmSupplyEntity,
  });
}
