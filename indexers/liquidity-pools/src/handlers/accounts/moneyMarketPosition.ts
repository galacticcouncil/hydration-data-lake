import { constants } from 'ethers';
import pMap from 'p-map';

import { Store } from '@subsquid/typeorm-store';

import { AccountMmPositionHistoricalData, EvmEventName } from '../../model';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { StorageResolver } from '../../parsers/storageResolver';
import {
  EventName,
  EvmAccountsBoundEventParams,
} from '../../parsers/types/events';
import { EvmAccountsAccountExtensionWithEvmAddress } from '../../parsers/types/storage';
import { SqdBlock, SqdProcessorContext } from '../../processor';
import { AaveMoneyMarketManager } from '../../utils/evmTools/aave/aaveMoneyMarketManager';
import {
  getOrCreateAccount,
  getOrCreateAccountByBoundEvmAddress,
} from './index';
import parsers from '../../parsers';
import { AccountEvmExtensionsCacheManager } from '../../utils/accountEvmExtensionsCacheManager';
import { getPreviousAssetAccountBalancesForListOfAccountsSql } from '../../utils/pgConnectionManagers/queries/getPreviousAssetAccountBalances.sql';
import { RawAccountAssetBalanceHistoricalData } from '../balances/accountTotalBalance';
import { CommonPgPool } from '../../utils/pgConnectionManagers/pgPool';
import { getAccountsWithMmAssetBalancesSql } from '../../utils/pgConnectionManagers/queries/getAccountsWithMmAssetBalances.sql';
import { getAllMoneyMarketAssets } from '../assets/asset';
import { AaveMoneyMarketsRegistry } from '../../utils/evmTools/aave/aaveMoneyMarketsRegistry/aaveMoneyMarketsRegistry';
import {
  AccountMmPositionDataContractData,
  WithMarketTag,
} from '../../utils/evmTools/aave/types';

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

  const blocksWithOracleUpdate: Map<number, SqdBlock> = new Map();

  for (const event of Array.from(
    parsedEvents.getSectionByEventName(EventName.EVM_Log).values()
  )) {
    if (event.eventData.params?.eventName === EvmEventName.OracleUpdate) {
      blocksWithOracleUpdate.set(
        event.eventData.metadata.blockHeader.height,
        event.eventData.metadata.blockHeader
      );

      continue;
    }

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

  /**
   * Process accounts explicitly involved in EVM actions
   */
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

  /**
   * Process accounts on Oracle update
   */

  if (blocksWithOracleUpdate.size === 0) return;

  // const latestBlockWithOracleUpdate = Array.from(
  //   blocksWithOracleUpdate.keys()
  // ).sort((a, b) => b - a)[0];

  let allEvmAccounts =
    await AccountEvmExtensionsCacheManager.getInstance().getAllBoundedAccountsList(
      ctx
    );

  const allExistingMmAssets = await getAllMoneyMarketAssets(ctx);

  try {
    const resp = (
      await CommonPgPool.getInstance().query<{
        account_id: string;
      }>(getAccountsWithMmAssetBalancesSql, [
        allEvmAccounts.map((a) => a.accountAddress),
        allExistingMmAssets.map((a) => a.id),
      ])
    ).rows;

    const responseSet = new Set(resp.map((r) => r.account_id));

    allEvmAccounts = allEvmAccounts.filter((a) =>
      responseSet.has(a.accountAddress)
    );
  } catch (e) {
    console.log(e);
  }

  if (!allEvmAccounts) return;

  for (const blockHeader of blocksWithOracleUpdate.values()) {
    await handleAllAccountsMmPositionDataUpdate({
      allEvmAccounts,
      blockHeader,
      ctx,
    });
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

  let positionsData: WithMarketTag<AccountMmPositionDataContractData>[] | null =
    StorageResolver.getInstance().storageDictionaryManager?.getAccountMmPositionData(
      {
        accountId: account.id,
        block: blockHeader,
        mmPoolAddresses: AaveMoneyMarketsRegistry.getInstance()
          .getAllMarkets()
          .map((market) => market.poolImplementationProxyAddress.toLowerCase()),
      }
    ) ?? null;

  if (!positionsData) {
    const contractData =
      await AaveMoneyMarketsRegistry.getInstance().getAccountMmPositionDataWithLogs(
        {
          accountAddress: accountEvmAddress,
          blockNumber: blockHeader.height,
        }
      );
    if (contractData) positionsData = contractData;
  }

  if (!positionsData || positionsData.length === 0) {
    // console.log(`No contract data for address ${accountEvmAddress}`);
    return;
  }

  const block = ctx.batchState.getParaBlockFromCacheByHeight(
    blockHeader.height
  );

  if (!block) throw Error('Block not found');

  for (const positionData of positionsData) {
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
      id: `${account.id}-${poolAddress.toLowerCase()}-${blockHeader.height}`,
      accountId: account.id,
      accountBoundEvmAddress: account.boundEvmAddress,

      totalCollateralBase,
      totalDebtBase,
      availableBorrowsBase,
      currentLiquidationThreshold,
      ltv,
      healthFactor: maxHealthFactor !== healthFactor ? healthFactor : null,

      poolAddress: poolAddress.toLowerCase(),

      paraBlockHeight: block.height,
    });

    ctx.batchState.state.accountMmPositionHistoricalData.set(
      newPositionHistData.id,
      newPositionHistData
    );
  }
}

export async function handleAllAccountsMmPositionDataUpdate({
  allEvmAccounts,
  blockHeader,
  ctx,
}: {
  allEvmAccounts: EvmAccountsBoundEventParams[];
  blockHeader: SqdBlock;
  ctx: SqdProcessorContext<Store>;
}) {
  await pMap(
    allEvmAccounts || [],
    async ({ accountAddress, evmAddress }) => {
      await getOrCreateAccount({
        id: accountAddress,
        ctx,
        boundEvmAddress: evmAddress,
      });

      await handleAccountMmPositionDataOnMmEvent({
        ctx,
        blockHeader,
        accountEvmAddress: evmAddress,
      });
    },
    {
      concurrency: ctx.appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY,
    }
  );
}
