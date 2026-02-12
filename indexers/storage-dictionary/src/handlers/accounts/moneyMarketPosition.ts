import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { MoneyMarketContractsManager } from '../../utils/evm/moneyMarketContractsManager';
import { AccountMmPositionHistoricalData } from '../../model';
import {
  getOrCreateAccount,
  getOrCreateAccountByBoundEvmAddress,
} from './index';
import { constants, ethers } from 'ethers';
import parsers from '../../parsers';
import pMap from 'p-map';

export class AccountMoneyMarketPositionDataManager {
  readonly maxHealthFactor: string =
    '115792089237316195423570985008687907853269984665640564039457.584007913129639935';
  private static instance: AccountMoneyMarketPositionDataManager;
  private dataToProcessAcc: Map<
    number,
    { blockHeader: Block; evmAddresses: Set<string> }
  > = new Map();

  static getInstance(): AccountMoneyMarketPositionDataManager {
    if (!AccountMoneyMarketPositionDataManager.instance) {
      AccountMoneyMarketPositionDataManager.instance =
        new AccountMoneyMarketPositionDataManager();
    }
    return AccountMoneyMarketPositionDataManager.instance;
  }

  addAccountEvmAddressToProcessingQueue({
    accountEvmAddress,
    blockHeader,
  }: {
    accountEvmAddress: string;
    blockHeader: Block;
  }) {
    const blockSlot = this.dataToProcessAcc.get(blockHeader.height) ?? {
      blockHeader,
      evmAddresses: new Set(),
    };

    blockSlot.evmAddresses.add(accountEvmAddress);
    this.dataToProcessAcc.set(blockHeader.height, blockSlot);
  }

  wipeDataToProcessAcc() {
    this.dataToProcessAcc = new Map();
  }

  async processAccountMmPositionDataUpdateQueue(ctx: ProcessorContext<Store>) {
    if (this.dataToProcessAcc.size === 0) return;

    for (const {
      blockHeader,
      evmAddresses,
    } of this.dataToProcessAcc.values()) {
      await pMap(
        Array.from(evmAddresses.values()),
        (accountEvmAddress) =>
          this.handleAccountMmPositionDataUpdate({
            accountEvmAddress,
            blockHeader,
            ctx,
          }),
        { concurrency: ctx.appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY }
      );
    }

    this.wipeDataToProcessAcc();
  }

  async handleAccountMmPositionDataUpdate({
    accountEvmAddress,
    blockHeader,
    ctx,
  }: {
    accountEvmAddress: string;
    blockHeader: Block;
    ctx: ProcessorContext<Store>;
  }) {
    if (accountEvmAddress === constants.AddressZero) return;

    const contractData =
      await MoneyMarketContractsManager.getInstance().getAccountMmPositionData({
        accountAddress: accountEvmAddress,
        blockNumber: blockHeader.height,
      });

    if (!contractData) return;

    const account = await getOrCreateAccountByBoundEvmAddress({
      ctx,
      evmAddress: accountEvmAddress,
      blockHeader: blockHeader,
    });

    if (!account) {
      console.log(`Account not found for EVM address: ${accountEvmAddress} `);
      return;
    }

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
      accountId: account.id,
      accountBoundEvmAddress: account.boundEvmAddress,

      totalCollateralBase,
      totalDebtBase,
      availableBorrowsBase,
      currentLiquidationThreshold,
      ltv,
      healthFactor: this.maxHealthFactor !== healthFactor ? healthFactor : null,

      poolAddress,

      paraBlockHeight: blockHeader.height,
    });

    ctx.batchState.state.accMmPositionHistData.set(
      newPositionHistData.id,
      newPositionHistData
    );
  }

  async handleAllAccountsMmPositionDataUpdate({
    blockHeader,
    ctx,
  }: {
    blockHeader: Block;
    ctx: ProcessorContext<Store>;
  }) {

    await pMap(
      Array.from(ctx.batchState.state.evmAccountExtensions.entries()) || [],
      async ([h160Address, extension]) => {
        const accId = `${h160Address}${extension.replace(/^0x/, '')}`;
        await getOrCreateAccount({
          id: accId,
          ctx,
          boundEvmAddress: h160Address,
          ensureBoundEvmAddress: true,
        });

        await this.handleAccountMmPositionDataUpdate({
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
}

// const maxHealthFactor =
//   '115792089237316195423570985008687907853269984665640564039457.584007913129639935';

// export async function handleAccountMmPositionDataUpdate({
//   accountEvmAddress,
//   blockHeader,
//   ctx,
// }: {
//   accountEvmAddress: string;
//   blockHeader: Block;
//   ctx: ProcessorContext<Store>;
// }) {
//   if (accountEvmAddress === constants.AddressZero) return;
//
//   const contractData =
//     await MoneyMarketContractsManager.getInstance().getAccountMmPositionData({
//       accountAddress: accountEvmAddress,
//       blockNumber: blockHeader.height,
//     });
//
//   if (!contractData) return;
//
//   const account = await getOrCreateAccountByBoundEvmAddress({
//     ctx,
//     evmAddress: accountEvmAddress,
//     blockHeader: blockHeader,
//   });
//
//   if (!account) {
//     console.log(`Account not found for EVM address: ${accountEvmAddress} `);
//     return;
//   }
//
//   const {
//     totalCollateralBase,
//     totalDebtBase,
//     availableBorrowsBase,
//     currentLiquidationThreshold,
//     ltv,
//     healthFactor,
//     pool: poolAddress,
//   } = contractData;
//
//   const newPositionHistData = new AccountMmPositionHistoricalData({
//     id: `${account.id}-${blockHeader.height}`,
//     accountId: account.id,
//     accountBoundEvmAddress: account.boundEvmAddress,
//
//     totalCollateralBase,
//     totalDebtBase,
//     availableBorrowsBase,
//     currentLiquidationThreshold,
//     ltv,
//     healthFactor: maxHealthFactor !== healthFactor ? healthFactor : null,
//
//     poolAddress,
//
//     paraBlockHeight: blockHeader.height,
//   });
//
//   ctx.batchState.state.accMmPositionHistData.set(
//     newPositionHistData.id,
//     newPositionHistData
//   );
// }

// export async function handleAllAccountsMmPositionDataUpdate({
//   blockHeader,
//   ctx,
// }: {
//   blockHeader: Block;
//   ctx: ProcessorContext<Store>;
// }) {
//   const allEvmAccounts =
//     await parsers.storage.evmAccounts.getAllAccountsExtensions({
//       block: blockHeader,
//     });
//
//   await pMap(
//     allEvmAccounts || [],
//     async ({ h160Address, extension }) => {
//       const accId = `${h160Address}${extension.replace(/^0x/, '')}`;
//       await getOrCreateAccount({
//         id: accId,
//         ctx,
//         boundEvmAddress: h160Address,
//         ensureBoundEvmAddress: true,
//       });
//
//       await handleAccountMmPositionDataUpdate({
//         ctx,
//         blockHeader,
//         accountEvmAddress: h160Address,
//       });
//     },
//     {
//       concurrency: ctx.appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY,
//     }
//   );
// }
