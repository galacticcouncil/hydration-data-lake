import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AaveFacilitatorHistoricalData } from '../../model';
import { LessThan } from 'typeorm';

export async function getOldAaveFacilitatorHistDataEntity({
  ctx,
  currentBlockHeight,
  address,
}: {
  ctx: SqdProcessorContext<Store>;
  address: string;
  currentBlockHeight?: number;
}) {
  return await ctx.storeUtils.findOneWithLogs(AaveFacilitatorHistoricalData, {
    where: {
      facilitator: { id: address },
      ...(currentBlockHeight
        ? { paraBlockHeight: LessThan(currentBlockHeight) }
        : {}),
    },
    relations: {
      facilitator: true,
    },
    order: {
      paraBlockHeight: 'DESC',
    },
  }, {
    className: 'AaveFacilitatorHistoricalData',
    originCallFn: 'getOldAaveFacilitatorHistDataEntity',
  });
}
