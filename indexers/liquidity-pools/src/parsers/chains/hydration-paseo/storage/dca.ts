import { storage } from '../typegenTypes/';
import { DcaGetScheduleInput, DcaScheduleData } from '../../../types/storage';
import { UnknownVersionError } from '../../../../utils/errors';
import { decorateDcaSchedule } from '../utils';

async function getDcaSchedule({
  scheduleId,
  block,
}: DcaGetScheduleInput): Promise<DcaScheduleData | null> {
  if (storage.dca.schedules.v276.is(block)) {
    const resp = await storage.dca.schedules.v276.get(block, scheduleId);

    if (!resp) return null;

    return decorateDcaSchedule(resp);
  }

  throw new UnknownVersionError('storage.dca.schedules');
}

export default { getDcaSchedule };
