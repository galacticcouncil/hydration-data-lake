import { storage } from '../typegenTypes/';
import {
  DcaGetScheduleInput,
  DcaGetSchedulesManyInput,
  DcaScheduleData,
  DcaScheduleDataWithId,
} from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { decorateDcaSchedule } from '../utils';
import { Schedule } from '../../hydration-paseo/typegenTypes/v347';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

async function getDcaSchedule({
  scheduleId,
  block,
}: DcaGetScheduleInput): Promise<DcaScheduleData | null> {
  if (storage.dca.schedules.v324.is(block)) {
    const resp = await storage.dca.schedules.v324.get(block, scheduleId);

    if (!resp) return null;

    return decorateDcaSchedule(resp);
  }

  throw new UnknownVersionError('storage.dca.schedules');
}

async function getDcaSchedulesMany({
  scheduleIds,
  block,
}: DcaGetSchedulesManyInput): Promise<DcaScheduleDataWithId[] | null> {
  const getDecorateResult = (rawResponse: (Schedule | undefined)[]) => {
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
      if (block.specVersion < 324) return null;

      if (storage.dca.schedules.v324.is(block)) {
        const resp = await storage.dca.schedules.v324.getMany(
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
