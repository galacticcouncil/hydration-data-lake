import {
  MoneyMarketContractsManager,
  MoneyMarketResourceDetails,
} from '../../../utils/evmTools/moneyMarketContractsManager';
import { SqdBlock, SqdProcessorContext } from '../../../processor';
import { processMmReserveIndexesHistoricalDataEntity } from './moneyMarketReservesIndexesHistoricalData';
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
import { getOrCreateAavepool } from '../../pools/pools/aavepool';
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

  reserveEntity = await ctx.storeUtils.findOneWithLogs(MoneyMarketReserve, {
    where: { id },
    relations: {
      aToken: true,
      underlyingAsset: true,
      variableDebtToken: true,
      aavePool: true,
    },
  }, { className: 'MoneyMarketReserve' });

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

  let aTokenEntity = await getOrCreateAsset({
    evmAddress: reserveDataToProcess.aTokenAddress.toLowerCase(),
    ctx,
    ensure: true,
    blockHeader,
  });

  if (!aTokenEntity) {
    aTokenEntity = await getOrCreateMoneyMarketAsset({
      evmAddress: reserveDataToProcess.aTokenAddress.toLowerCase(),
      ctx,
      ensure: true,
    });
  }

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

  let aavepoolEntity = null;

  if (
    underliningAssetEntity.assetRegistryId !== undefined &&
    underliningAssetEntity.assetRegistryId !== null &&
    aTokenEntity.assetRegistryId !== undefined &&
    aTokenEntity.assetRegistryId !== null
  )
    aavepoolEntity = await getOrCreateAavepool({
      reserveAssetId: underliningAssetEntity.assetRegistryId!,
      aTokenId: aTokenEntity.assetRegistryId!,
      ensure: true,
      blockHeader,
      ctx,
    });

  reserveEntity = new MoneyMarketReserve({
    id: reserveDataToProcess.underlyingAssetAddress.toLowerCase(),
    aToken: aTokenEntity,
    underlyingAsset: underliningAssetEntity,
    variableDebtToken: variableDebtTokenEntity,
    aavePool: aavepoolEntity ?? null,

    name: reserveDataToProcess.name,
    symbol: reserveDataToProcess.symbol,
    decimals: reserveDataToProcess.decimals,
  });

  ctx.batchState.state.moneyMarketReserves.set(id, reserveEntity);
  await ctx.store.upsert(reserveEntity);

  if (aavepoolEntity) {
    aavepoolEntity.moneyMarketReserve = reserveEntity;
    ctx.batchState.state.aavePools.set(aavepoolEntity.id, aavepoolEntity);
    await ctx.store.upsert(aavepoolEntity);
  }

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
  let existingPersistentReserveEntitiesMap =
    ctx.batchState.state.moneyMarketReserves;

  if (
    !existingPersistentReserveEntitiesMap ||
    existingPersistentReserveEntitiesMap.size === 0
  ) {
    existingPersistentReserveEntitiesMap = new Map(
      (
        await ctx.storeUtils.findWithLogs(MoneyMarketReserve, {
          where: {},
          relations: {
            aToken: true,
            underlyingAsset: true,
            variableDebtToken: true,
            aavePool: true,
          },
        }, { className: 'MoneyMarketReserve' })
      ).map((r) => [r.id, r])
    );

    if (
      existingPersistentReserveEntitiesMap &&
      existingPersistentReserveEntitiesMap.size > 0
    ) {
      for (const entity of existingPersistentReserveEntitiesMap.values()) {
        ctx.batchState.state.moneyMarketReserves.set(entity.id, entity);
      }
    }
  }

  const reservesToProcess =
    reserves ??
    Array.from(
      MoneyMarketContractsManager.getInstance().moneyMarketReservesDetailsMap.values()
    );

  for (const reserveData of reservesToProcess) {
    if (
      existingPersistentReserveEntitiesMap.has(
        reserveData.underlyingAssetAddress.toLowerCase()
      )
    )
      continue;

    const blockHeader = ctx.batchState.getBlockHeaderByBlockHeight(
      blockNumber ?? ctx.blocks[ctx.blocks.length - 1].header.height
    );
    const reserveEntity = await getOrCreateMoneyMarketReserve({
      id: reserveData.underlyingAssetAddress.toLowerCase(),
      reserveData,
      blockHeader,
      ctx,
    });

    if (!reserveEntity) {
      console.log(
        `actualizeMoneyMarketReserves :: reserveEntity ${reserveData.underlyingAssetAddress.toLowerCase()} is not found. Skipping ...`
      );
      continue;
    }

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
