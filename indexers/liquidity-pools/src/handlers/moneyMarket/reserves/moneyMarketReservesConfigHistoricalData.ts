import { MoneyMarketResourceDetails } from '../../../utils/evmTools/moneyMarketContractsManager';
import { SqdBlock, SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { getOrCreateMoneyMarketReserve } from './moneyMarketReserve';
import {
  MoneyMarketReserve,
  MmReserveConfigHistoricalData,
} from '../../../model';

export async function handleMoneyMarketReserveConfigOnConfiguratorUpdate({
  reserveData,
  blockHeader,
  ctx,
}: {
  reserveData: MoneyMarketResourceDetails;
  blockHeader: SqdBlock;
  ctx: SqdProcessorContext<Store>;
}) {
  const mmReserveEntity = await getOrCreateMoneyMarketReserve({
    id: reserveData.underlyingAssetAddress.toLowerCase(),
    reserveData,
    blockHeader,
    ctx,
  });

  if (!mmReserveEntity) {
    console.log(
      `handleMoneyMarketReserveOnConfiguratorUpdate :: mmReserveEntity is not found with id ${reserveData.underlyingAssetAddress.toLowerCase()}`
    );
    return;
  }

  const block = ctx.batchState.getParaBlockFromCacheByHeight(
    blockHeader.height
  );

  if (!block) {
    console.log(`Block not found at height ${blockHeader.height}`);
    return;
  }

  const reserveEntity = new MmReserveConfigHistoricalData({
    id: `${mmReserveEntity.id}-${blockHeader.height}`,
    reserve: mmReserveEntity,

    interestRateStrategyAddress: reserveData.interestRateStrategyAddress,

    reserveFactor: BigInt(reserveData.reserveFactor),
    usageAsCollateralEnabled: reserveData.usageAsCollateralEnabled,
    borrowingEnabled: reserveData.borrowingEnabled,

    isActive: reserveData.isActive,
    isFrozen: reserveData.isFrozen,
    isPaused: reserveData.isPaused,
    isSiloedBorrowing: reserveData.isSiloedBorrowing,
    accruedToTreasury: BigInt(reserveData.accruedToTreasury),
    unbacked: BigInt(reserveData.unbacked),
    flashLoanEnabled: reserveData.flashLoanEnabled,
    debtCeiling: BigInt(reserveData.debtCeiling),
    debtCeilingDecimals: BigInt(reserveData.debtCeilingDecimals),
    eModeCategoryId: +reserveData.eModeCategoryId,
    borrowCap: BigInt(reserveData.borrowCap),
    supplyCap: BigInt(reserveData.supplyCap),
    borrowableInIsolation: reserveData.borrowableInIsolation,
    baseLTVasCollateral: BigInt(reserveData.baseLTVasCollateral),
    reserveLiquidationThreshold: BigInt(
      reserveData.reserveLiquidationThreshold
    ),
    reserveLiquidationBonus: BigInt(reserveData.reserveLiquidationBonus),
    variableRateSlope1: BigInt(reserveData.variableRateSlope1),
    variableRateSlope2: BigInt(reserveData.variableRateSlope2),
    baseVariableBorrowRate: BigInt(reserveData.baseVariableBorrowRate),
    optimalUsageRatio: BigInt(reserveData.optimalUsageRatio),
    lastUpdateTimestamp: new Date(
      reserveData.lastUpdateTimestamp
        ? +reserveData.lastUpdateTimestamp * 1000
        : Date.now()
    ),

    paraBlockHeight: blockHeader.height,
    relayBlockHeight: block.relayBlockHeight,
    blockId: block.id,
  });

  ctx.batchState.state.moneyMarketReserveConfigHistData.set(
    reserveEntity.id,
    reserveEntity
  );
}
