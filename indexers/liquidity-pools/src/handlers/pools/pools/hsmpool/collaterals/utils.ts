import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AaveFacilitatorHistoricalData,
  HsmCollateralConfigHistoricalData,
} from '../../../../../model';
import { LessThan } from 'typeorm';

export async function getPreviousCollateralHistDataEntity({
  collateralId,
  blockHeight,
  ctx,
}: {
  collateralId: string;
  blockHeight: number;
  ctx: SqdProcessorContext<Store>;
}): Promise<HsmCollateralConfigHistoricalData | null> {
  return (
    ctx.batchState.getPreviousHistDataEntity<HsmCollateralConfigHistoricalData>(
      {
        entitiesMap: ctx.batchState.state.hsmCollateralsConfigHistData,
        entityId: collateralId,
        currentBlockHeight: blockHeight,
        blockHeightValPosition: 2,
      }
    ) ||
    (await getOldCollateralHistDataEntity({
      ctx,
      collateralId,
      currentBlockHeight: blockHeight,
    })) ||
    null
  );
}

export async function getOldCollateralHistDataEntity({
  ctx,
  collateralId,
  currentBlockHeight,
}: {
  ctx: SqdProcessorContext<Store>;
  collateralId: string;
  currentBlockHeight?: number;
}) {
  return await ctx.storeUtils.findOneWithLogs(HsmCollateralConfigHistoricalData, {
    where: {
      collateral: { id: collateralId },
      ...(currentBlockHeight
        ? { paraBlockHeight: LessThan(currentBlockHeight) }
        : {}),
    },
    relations: {
      collateral: true,
    },
    order: {
      paraBlockHeight: 'DESC',
    },
  }, {
    className: 'HsmCollateralConfigHistoricalData',
    originCallFn: 'getOldCollateralHistDataEntity',
  });
}
