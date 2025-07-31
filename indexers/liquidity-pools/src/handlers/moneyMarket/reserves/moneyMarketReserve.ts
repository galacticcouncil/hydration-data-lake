import {
  MoneyMarketContractsManager,
  MoneyMarketResourceDetails,
} from '../../../utils/evmTools/moneyMarketContractsManager';
import { SqdBlock, SqdProcessorContext } from '../../../processor';
import {
  processMmReserveIndexesHistoricalData,
  processMmReserveIndexesHistoricalDataEntity,
} from './moneyMarketReservesIndexesHistoricalData';
import { Store } from '@subsquid/typeorm-store';
import {
  EvmContractName,
  EvmEventName,
  MoneyMarketReserve,
} from '../../../model';
import {
  getOrCreateAsset,
  getOrCreateMoneyMarketAsset,
} from '../../assets/asset';
import { getOrCreateAavepool } from '../../pools/aavepool';
import { handleMoneyMarketReserveConfigOnConfiguratorUpdate } from './moneyMarketReservesConfigHistoricalData';

export async function getOrCreateMoneyMarketReserve({
  id,
  reserveData,
  ctx,
  blockHeader,
}: {
  id: string;
  reserveData?: MoneyMarketResourceDetails;
  blockHeader: SqdBlock;
  ctx: SqdProcessorContext<Store>;
}) {
  let reserveEntity = ctx.batchState.state.moneyMarketReserves.get(id);

  if (reserveEntity) return reserveEntity;

  reserveEntity = await ctx.store.findOne(MoneyMarketReserve, {
    where: { id },
    relations: {
      aToken: true,
      underlyingAsset: true,
      variableDebtToken: true,
      aavePool: true,
    },
  });

  if (reserveEntity) {
    ctx.batchState.state.moneyMarketReserves.set(id, reserveEntity);
    return reserveEntity;
  }

  let reserveDataToProcess = reserveData ?? null;

  if (!reserveData) {
    const allReservesData =
      await MoneyMarketContractsManager.getInstance().getReservesData({
        blockNumber: blockHeader.height,
      });

    reserveDataToProcess = allReservesData
      ? (allReservesData.find(
          (r) => r.aTokenAddress.toLowerCase() === id.toLowerCase()
        ) ?? null)
      : null;
  }

  if (!reserveDataToProcess) {
    console.log(
      `getOrCreateMoneyMarketReserve :: reserveDataToProcess is not found`
    );
    return null;
  }

  const underliningAssetEntity = await getOrCreateAsset({
    evmAddress: reserveDataToProcess.underlyingAssetAddress.toLowerCase(),
    ctx,
    ensure: true,
    blockHeader,
  });
  if (!underliningAssetEntity) {
    console.log(
      `getOrCreateMoneyMarketReserve :: underliningAssetEntity is not found`
    );
    return null;
  }

  const aTokenEntity = await getOrCreateMoneyMarketAsset({
    evmAddress: reserveDataToProcess.aTokenAddress.toLowerCase(),
    ctx,
    ensure: true,
  });
  if (!aTokenEntity) {
    console.log(`getOrCreateMoneyMarketReserve :: aTokenEntity is not found`);
    return null;
  }

  const variableDebtTokenEntity = await getOrCreateMoneyMarketAsset({
    evmAddress: reserveDataToProcess.variableDebtTokenAddress.toLowerCase(),
    ctx,
    ensure: true,
  });
  if (!variableDebtTokenEntity) {
    console.log(
      `getOrCreateMoneyMarketReserve :: variableDebtTokenEntity is not found`
    );
    return null;
  }

  const aavepoolEntity = await getOrCreateAavepool({
    reserveAssetId: underliningAssetEntity.assetRegistryId!,
    aTokenId: aTokenEntity.assetRegistryId!,
    ensure: true,
    blockHeader,
    ctx,
  });
  if (!aavepoolEntity) {
    console.log(`getOrCreateMoneyMarketReserve :: aavepoolEntity is not found`);
    return null;
  }

  reserveEntity = new MoneyMarketReserve({
    id: reserveDataToProcess.underlyingAssetAddress.toLowerCase(),
    aToken: aTokenEntity,
    underlyingAsset: underliningAssetEntity,
    variableDebtToken: variableDebtTokenEntity,
    aavePool: aavepoolEntity,

    name: reserveDataToProcess.name,
    symbol: reserveDataToProcess.symbol,
    decimals: reserveDataToProcess.decimals,
  });

  ctx.batchState.state.moneyMarketReserves.set(id, reserveEntity);
  await ctx.store.upsert(reserveEntity);

  aavepoolEntity.moneyMarketReserve = reserveEntity;
  ctx.batchState.state.aavePools.set(aavepoolEntity.id, aavepoolEntity);
  await ctx.store.upsert(aavepoolEntity);

  return reserveEntity;
}

export async function actualizeMoneyMarketReserves({
  reserves,
  blockNumber,
  ctx,
}: {
  reserves?: MoneyMarketResourceDetails[];
  blockNumber?: number;
  ctx: SqdProcessorContext<Store>;
}) {
  if (ctx.batchState.state.moneyMarketReserves.size > 0) return;

  const existingPersistentReserveEntities = await ctx.store.find(
    MoneyMarketReserve,
    {
      where: {},
      relations: {
        aToken: true,
        underlyingAsset: true,
        variableDebtToken: true,
        aavePool: true,
      },
    }
  );

  if (
    existingPersistentReserveEntities &&
    existingPersistentReserveEntities.length > 0
  ) {
    for (const entity of existingPersistentReserveEntities) {
      ctx.batchState.state.moneyMarketReserves.set(entity.id, entity);
    }
    return;
  }

  const reservesToProcess =
    reserves ??
    Array.from(
      MoneyMarketContractsManager.getInstance().moneyMarketReservesDetailsMap.values()
    );

  for (const reserveData of reservesToProcess) {
    const blockHeader = ctx.batchState.getBlockHeaderByBlockHeight(
      blockNumber ?? ctx.blocks[ctx.blocks.length - 1].header.height
    );
    await getOrCreateMoneyMarketReserve({
      id: reserveData.underlyingAssetAddress.toLowerCase(),
      reserveData,
      blockHeader,
      ctx,
    });

    await handleMoneyMarketReserveConfigOnConfiguratorUpdate({
      reserveData,
      blockHeader,
      ctx,
    });

    await processMmReserveIndexesHistoricalDataEntity({
      data: {
        contractName: EvmContractName.AavePoolImpl,
        eventName: EvmEventName.ReserveDataUpdated,
        reserveAddress: reserveData.underlyingAssetAddress.toLowerCase(),
        liquidityRate: BigInt(reserveData.liquidityRate),
        stableBorrowRate: BigInt(0),
        variableBorrowRate: BigInt(reserveData.variableBorrowRate),
        liquidityIndex: BigInt(reserveData.liquidityIndex),
        variableBorrowIndex: BigInt(reserveData.variableBorrowIndex),
      },
      blockHeader: blockHeader,
      ctx,
    });
  }
}
