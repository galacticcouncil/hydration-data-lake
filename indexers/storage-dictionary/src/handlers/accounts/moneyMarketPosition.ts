// import { Block, ProcessorContext } from '../../processor';
// import { Store } from '@subsquid/typeorm-store';
// import { MoneyMarketContractsManager } from '../../utils/evm/moneyMarketContractsManager';
// import { AccountMmPositionHistoricalData } from '../../model';
// import {
//   getOrCreateAccount,
//   getOrCreateAccountByBoundEvmAddress,
// } from './index';
// import { constants, ethers } from 'ethers';
// import parsers from '../../parsers';
// import pMap from 'p-map';
//
// const maxHealthFactor =
//   '115792089237316195423570985008687907853269984665640564039457.584007913129639935';
//
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
//   const block = ctx.batchState.getParaBlockFromCacheByHeight(
//     blockHeader.height
//   );
//
//   if (!block) throw Error('Block not found');
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
//     account,
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
//     paraBlockHeight: block.height,
//     relayBlockHeight: block.relayBlockHeight,
//     block,
//   });
//
//   ctx.batchState.state.accountMmPositionHistoricalData.set(
//     newPositionHistData.id,
//     newPositionHistData
//   );
// }
//
// export async function handleAllAccountsMmPositionDataUpdate({
//   blockHeader,
//   ctx,
// }: {
//   blockHeader: SqdBlock;
//   ctx: SqdProcessorContext<Store>;
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
