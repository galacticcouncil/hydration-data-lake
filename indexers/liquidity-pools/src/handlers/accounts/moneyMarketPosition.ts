import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import { AccountMmPositionHistoricalData, EvmEventName } from '../../model';
import {
  getOrCreateAccount,
  getOrCreateAccountByBoundEvmAddress,
} from './index';
import { constants, ethers } from 'ethers';
import parsers from '../../parsers';
import pMap from 'p-map';
import { isValueMaxUint256 } from '../../utils/helpers';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EventName } from '../../parsers/types/events';

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
  //
  // console.dir(
  //   Array.from(accountsToProcessPerBlock.entries()).map(
  //     ([blockHeight, data]) => [blockHeight, data.evmAddresses]
  //   ),
  //   { depth: null }
  // );

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

  const contractData =
    await MoneyMarketContractsManager.getInstance().getAccountMmPositionData({
      accountAddress: accountEvmAddress,
      blockNumber: blockHeader.height,
    });

  if (!contractData) {
    // console.log(`No contract data for address ${accountEvmAddress}`);
    return;
  }

  const account = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: accountEvmAddress,
    blockHeader: blockHeader,
  });

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
  } = contractData;

  const newPositionHistData = new AccountMmPositionHistoricalData({
    id: `${account.id}-${blockHeader.height}`,
    account,
    accountBoundEvmAddress: account.boundEvmAddress,

    totalCollateralBase,
    totalDebtBase,
    availableBorrowsBase,
    currentLiquidationThreshold,
    ltv,
    healthFactor: maxHealthFactor !== healthFactor ? healthFactor : null,

    poolAddress,

    paraBlockHeight: block.height,
    relayBlockHeight: block.relayBlockHeight,
    block,
  });

  ctx.batchState.state.accountMmPositionHistoricalData.set(
    newPositionHistData.id,
    newPositionHistData
  );
}

export async function handleAllAccountsMmPositionDataUpdate({
  blockHeader,
  ctx,
}: {
  blockHeader: SqdBlock;
  ctx: SqdProcessorContext<Store>;
}) {
  const allEvmAccounts =
    await parsers.storage.evmAccounts.getAllAccountsExtensions({
      block: blockHeader,
    });

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
