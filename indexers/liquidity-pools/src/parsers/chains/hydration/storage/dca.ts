import { storage } from '../typegenTypes/';
import {
  DcaGetScheduleInput,
  DcaGetSchedulesManyInput,
  DcaScheduleData,
  DcaScheduleDataWithId,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { decorateDcaSchedule } from '../utils';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';
import { XykpoolLMDepositDataWithId } from '../../../types/storage/xykpoolLiquidityMining';
import { Schedule as Schedule_v160 } from '../typegenTypes/v160';
import { Schedule as Schedule_v295 } from '../typegenTypes/v295';
import { Schedule as Schedule_v323 } from '../typegenTypes/v323';

async function getDcaSchedule({
  scheduleId,
  block,
}: DcaGetScheduleInput): Promise<DcaScheduleData | null> {
  return measureStorageFetch({
    storageName: 'dca.schedules',
    originFn: 'getDcaSchedule',
    blockHeight: block.height,
    args: { scheduleId },
    fn: async () => {
      if (block.specVersion < 160) return null;
      if (storage.dca.schedules.v160.is(block)) {
        const resp = await storage.dca.schedules.v160.get(block, scheduleId);

        if (!resp) return null;

        return decorateDcaSchedule(resp);
      }
      if (storage.dca.schedules.v295.is(block)) {
        const resp = await storage.dca.schedules.v295.get(block, scheduleId);

        if (!resp) return null;

        return decorateDcaSchedule(resp);
      }
      if (storage.dca.schedules.v323.is(block)) {
        const resp = await storage.dca.schedules.v323.get(block, scheduleId);

        if (!resp) return null;

        return decorateDcaSchedule(resp);
      }

      throw new UnknownVersionError('storage.dca.schedules');
    },
  });
}

async function getDcaSchedulesMany({
  scheduleIds,
  block,
}: DcaGetSchedulesManyInput): Promise<DcaScheduleDataWithId[] | null> {
  const getDecorateResult = (
    rawResponse: (Schedule_v160 | Schedule_v295 | Schedule_v323 | undefined)[]
  ) => {
    const decoratedResp: DcaScheduleDataWithId[] = [];

    scheduleIds.forEach((scheduleId, index) => {
      const respItem = rawResponse[index];
      decoratedResp.push({
        scheduleId,
        data: !respItem ? null : decorateDcaSchedule(respItem),
      });
    });

    return decoratedResp;
  };

  return measureStorageFetch({
    storageName: 'dca.schedules',
    originFn: 'getDcaSchedulesMany',
    blockHeight: block.height,
    args: { scheduleIds },
    fn: async () => {
      if (block.specVersion < 160) return null;

      if (storage.dca.schedules.v160.is(block)) {
        const resp = await storage.dca.schedules.v160.getMany(
          block,
          scheduleIds
        );

        return getDecorateResult(resp);
      }

      if (storage.dca.schedules.v295.is(block)) {
        const resp = await storage.dca.schedules.v295.getMany(
          block,
          scheduleIds
        );

        return getDecorateResult(resp);
      }

      if (storage.dca.schedules.v323.is(block)) {
        const resp = await storage.dca.schedules.v323.getMany(
          block,
          scheduleIds
        );

        return getDecorateResult(resp);
      }

      throw new UnknownVersionError('storage.dca.schedules');
    },
  });
}

export default { getDcaSchedule, getDcaSchedulesMany };
