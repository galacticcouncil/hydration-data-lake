import { storage } from '../typegenTypes/';
import { DcaGetScheduleInput, DcaScheduleData } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { decorateDcaSchedule } from '../utils';
import { measureStorageFetch } from '../../../../utils/hydratedLogger/utils';

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

export default { getDcaSchedule };
