import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AaveMoneyMarketsRegistry } from '../../utils/evm/aave/aaveMoneyMarketsRegistry/aaveMoneyMarketsRegistry';
import { AccountMmPositionHistoricalData } from '../../model';
import {
  getOrCreateAccount,
  getOrCreateAccountByBoundEvmAddress,
} from './index';
import { constants } from 'ethers';
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

    const positionsData =
      await AaveMoneyMarketsRegistry.getInstance().getAccountMmPositionData({
        accountAddress: accountEvmAddress,
        blockNumber: blockHeader.height,
      });

    if (!positionsData || positionsData.length === 0) return;

    const account = await getOrCreateAccountByBoundEvmAddress({
      ctx,
      evmAddress: accountEvmAddress,
      blockHeader: blockHeader,
    });

    if (!account) {
      console.log(`Account not found for EVM address: ${accountEvmAddress} `);
      return;
    }

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

      const poolAddressDecorated = poolAddress.toLowerCase();

      const newPositionHistData = new AccountMmPositionHistoricalData({
        id: `${account.id}-${poolAddressDecorated}-${blockHeader.height}`,
        accountId: account.id,
        accountBoundEvmAddress: account.boundEvmAddress,

        totalCollateralBase,
        totalDebtBase,
        availableBorrowsBase,
        currentLiquidationThreshold,
        ltv,
        healthFactor:
          this.maxHealthFactor !== healthFactor ? healthFactor : null,

        poolAddress: poolAddressDecorated,

        paraBlockHeight: blockHeader.height,
      });

      ctx.batchState.state.accMmPositionHistData.set(
        newPositionHistData.id,
        newPositionHistData
      );
    }
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
