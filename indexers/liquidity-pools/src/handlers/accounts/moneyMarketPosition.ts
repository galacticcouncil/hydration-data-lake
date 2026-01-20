import { constants } from 'ethers';
import pMap from 'p-map';

import { Store } from '@subsquid/typeorm-store';

import { AccountMmPositionHistoricalData, EvmEventName } from '../../model';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { StorageResolver } from '../../parsers/storageResolver';
import { EventName } from '../../parsers/types/events';
import { EvmAccountsAccountExtensionWithEvmAddress } from '../../parsers/types/storage';
import { SqdBlock, SqdProcessorContext } from '../../processor';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import {
  getOrCreateAccount,
  getOrCreateAccountByBoundEvmAddress,
} from './index';

const maxHealthFactor =
  '115792089237316195423570985008687907853269984665640564039457.584007913129639935';

export async function handleAccountMmPositionData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const accountsToProcessPerBlock: Map<
    number,
    { blockHeader: SqdBlock; evmAddresses: Set<string> }
  > = new Map();

  for (const event of Array.from(
    parsedEvents.getSectionByEventName(EventName.EVM_Log).values()
  )) {
    if (event.eventData.params?.eventName === EvmEventName.OracleUpdate)
      continue;

    if (
      !accountsToProcessPerBlock.has(
        event.eventData.metadata.blockHeader.height
      )
    )
      accountsToProcessPerBlock.set(
        event.eventData.metadata.blockHeader.height,
        {
          blockHeader: event.eventData.metadata.blockHeader,
          evmAddresses: new Set(),
        }
      );

    const blockSlotData = accountsToProcessPerBlock.get(
      event.eventData.metadata.blockHeader.height
    )!;

    const mmEvent = ctx.batchState.state.moneyMarketEvents.get(
      event.eventData.metadata.id
    );

    if (!mmEvent) continue;

    involvedAccountsLoop: for (const accountId of mmEvent.allInvolvedParticipants) {
      const account = await getOrCreateAccount({ id: accountId, ctx });
      if (!account || !account.boundEvmAddress) {
        console.log(`No account found ${accountId}`);
        continue involvedAccountsLoop;
      }
      blockSlotData.evmAddresses.add(account.boundEvmAddress);
    }
    accountsToProcessPerBlock.set(
      blockSlotData.blockHeader.height,
      blockSlotData
    );
  }

  for (const blockSlotData of accountsToProcessPerBlock.values()) {
    await pMap(
      Array.from(blockSlotData.evmAddresses.values()),
      async (accountEvmAddress) => {
        await handleAccountMmPositionDataOnMmEvent({
          ctx,
          blockHeader: blockSlotData.blockHeader,
          accountEvmAddress,
        });
      },
      { concurrency: 50 }
    );
  }
}

export async function handleAccountMmPositionDataOnMmEvent({
  accountEvmAddress,
  blockHeader,
  ctx,
}: {
  accountEvmAddress: string;
  blockHeader: SqdBlock;
  ctx: SqdProcessorContext<Store>;
}) {
  if (accountEvmAddress === constants.AddressZero) return;

  const account = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: accountEvmAddress,
    blockHeader: blockHeader,
  });

  const positionData =
    StorageResolver.getInstance().storageDictionaryManager?.getAccountMmPositionData(
      { accountId: account.id, block: blockHeader }
    ) ??
    (await MoneyMarketContractsManager.getInstance().getAccountMmPositionDataWithLogs(
      {
        accountAddress: accountEvmAddress,
        blockNumber: blockHeader.height,
      }
    ));

  if (!positionData) {
    // console.log(`No contract data for address ${accountEvmAddress}`);
    return;
  }

  const block = ctx.batchState.getParaBlockFromCacheByHeight(
    blockHeader.height
  );

  if (!block) throw Error('Block not found');

  const {
    totalCollateralBase,
    totalDebtBase,
    availableBorrowsBase,
    currentLiquidationThreshold,
    ltv,
    healthFactor,
    pool: poolAddress,
  } = positionData;

  const newPositionHistData = new AccountMmPositionHistoricalData({
    id: `${account.id}-${blockHeader.height}`,
    accountId: account.id,
    accountBoundEvmAddress: account.boundEvmAddress,

    totalCollateralBase,
    totalDebtBase,
    availableBorrowsBase,
    currentLiquidationThreshold,
    ltv,
    healthFactor: maxHealthFactor !== healthFactor ? healthFactor : null,

    poolAddress,

    paraBlockHeight: block.height,
  });

  ctx.batchState.state.accountMmPositionHistoricalData.set(
    newPositionHistData.id,
    newPositionHistData
  );
}

export async function handleAllAccountsMmPositionDataUpdate({
  allEvmAccounts,
  blockHeader,
  ctx,
}: {
  allEvmAccounts: EvmAccountsAccountExtensionWithEvmAddress[];
  blockHeader: SqdBlock;
  ctx: SqdProcessorContext<Store>;
}) {
  await pMap(
    allEvmAccounts || [],
    async ({ h160Address, extension }) => {
      const accId = `${h160Address}${extension.replace(/^0x/, '')}`;
      await getOrCreateAccount({
        id: accId,
        ctx,
        boundEvmAddress: h160Address,
      });

      await handleAccountMmPositionDataOnMmEvent({
        ctx,
        blockHeader,
        accountEvmAddress: h160Address,
      });
    },
    {
      concurrency: ctx.appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY,
    }
  );
}
