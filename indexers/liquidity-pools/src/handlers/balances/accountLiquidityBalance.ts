import { FindOptionsRelations } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import {
  Account,
  AccountAssetBalanceHistoricalData,
  AccountLiquidityBalanceHistoricalData,
  AccountLiquidityType,
  OmnipoolLiquidityPosition,
} from '../../model';
import { SqdBlock, SqdProcessorContext } from '../../processor';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';
import { getOrCreateAsset } from '../assets/asset';
import { getOmnipoolLiquidityPositionAmountOut } from '../liquidity/omnipool/liquidityPositions/liquidityPositionUtils';

export async function getOrCreateAccountLiquidityBalanceHistoricalData({
  accountId,
  assetId,
  positionId,
  depositId,
  liquidityType,
  ctx,
  blockHeader,
  fetchFromDb = false,
  relations = {},
}: {
  accountId: string;
  assetId: string;
  positionId?: string;
  depositId?: string;
  liquidityType: AccountLiquidityType;
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<AccountAssetBalanceHistoricalData>;
}) {
  if (!positionId && !depositId)
    throw Error(`positionId or depositId must be provided`);

  const batchState = ctx.batchState.state;

  // If depositId and positionId are provided at the same time, depositId must
  // be used in composite ID as it means that balance is created for deposit.
  const entityId = `${accountId}-${liquidityType === AccountLiquidityType.OmnipoolPosition ? positionId : (depositId ?? positionId)}-${liquidityType}-${blockHeader.height}`;

  let dataEntity =
    batchState.accountLiquidityBalanceHistoricalData.get(entityId);

  if (dataEntity) return dataEntity;

  if (!dataEntity && fetchFromDb) {
    dataEntity = await ctx.storeUtils.findOneWithLogs(
      AccountLiquidityBalanceHistoricalData,
      {
        where: { id: entityId },
        relations,
      },
      {
        className: 'AccountLiquidityBalanceHistoricalData',
        originCallFn: 'getOrCreateAccountLiquidityBalanceHistoricalData',
      }
    );

    if (dataEntity) {
      ctx.batchState.state.accountLiquidityBalanceHistoricalData.set(
        dataEntity.id,
        dataEntity
      );
      return dataEntity;
    }
  }

  const block = ctx.batchState.getParaBlockFromCacheByHeight(
    blockHeader.height
  );

  if (!block) throw Error('Block not found');

  dataEntity = new AccountLiquidityBalanceHistoricalData({
    id: `${accountId}-${positionId}-${blockHeader.height}`,
    accountId,
    assetId,
    positionId: positionId ?? null,
    depositId: depositId ?? null,
    liquidityType,

    liquidityAmount: 0n,
    hubLiquidityAmount: 0n,

    liquidityAmountNorm: '0',
    hubLiquidityAmountNorm: '0',

    paraBlockHeight: block.height,
  });

  ctx.batchState.state.accountLiquidityBalanceHistoricalData.set(
    dataEntity.id,
    dataEntity
  );
  return dataEntity;
}

export async function getOrCreateAccountLiquidityBalanceWithAmounts({
  accountId,
  assetId,
  position,
  actualAssetAmount,
  actualSharesAmount,
  depositId,
  liquidityType,
  ctx,
  blockHeader,
}: {
  accountId: string;
  assetId: string;
  position?: OmnipoolLiquidityPosition;
  depositId?: string;
  actualAssetAmount?: bigint;
  actualSharesAmount?: bigint;
  liquidityType: AccountLiquidityType;
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
}) {
  const asset = await getOrCreateAsset({ ctx, id: assetId, ensure: false });
  if (!asset) throw Error(`Asset ${assetId} not found`);

  const assetSpotPrice = getAssetsPairPrice({
    assetInId: assetId,
    blockHeight: blockHeader.height,
    ctx,
  });

  if (liquidityType === AccountLiquidityType.XykDeposit) {
    if (!depositId) throw Error('depositId must be provided');

    const balanceEntity =
      await getOrCreateAccountLiquidityBalanceHistoricalData({
        ctx,
        blockHeader,
        accountId,
        assetId,
        depositId,
        liquidityType,
      });

    balanceEntity.liquidityAmount = actualAssetAmount ?? 0n;
    balanceEntity.liquidityAmountNorm = asset.decimals
      ? calcPriceNormalized({
          amount: actualAssetAmount ?? 0n,
          assetDecimals: asset.decimals,
          spotPrice: assetSpotPrice ?? '0',
        })
      : '0';

    return balanceEntity;
  }
  if (!position) throw Error('position must be provided');

  const hubAsset = await getOrCreateAsset({ ctx, id: '1', ensure: false });
  if (!hubAsset) throw Error(`Hub Asset ${assetId} not found`);

  const hubAssetSpotPrice = getAssetsPairPrice({
    assetInId: '1',
    blockHeight: blockHeader.height,
    ctx,
  });

  const balanceEntity = await getOrCreateAccountLiquidityBalanceHistoricalData({
    ctx,
    blockHeader,
    accountId,
    assetId,
    positionId: position.id,
    depositId,
    liquidityType,
  });

  const positionOutputAtBlock = await getOmnipoolLiquidityPositionAmountOut({
    ctx,
    blockHeader,
    position,
    actualAssetAmount,
    actualSharesAmount,
  });

  balanceEntity.liquidityAmount = BigInt(positionOutputAtBlock.liquidity);
  balanceEntity.hubLiquidityAmount = BigInt(positionOutputAtBlock.hubLiquidity);
  balanceEntity.liquidityAmountNorm = asset.decimals
    ? calcPriceNormalized({
        amount: BigInt(positionOutputAtBlock.liquidity),
        assetDecimals: asset.decimals,
        spotPrice: assetSpotPrice ?? '0',
      })
    : '0';
  balanceEntity.hubLiquidityAmountNorm = hubAsset.decimals
    ? calcPriceNormalized({
        amount: BigInt(positionOutputAtBlock.hubLiquidity),
        assetDecimals: hubAsset.decimals,
        spotPrice: hubAssetSpotPrice ?? '0',
      })
    : '0';

  return balanceEntity;
}
