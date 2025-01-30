import { SqdCall } from '../../../../processor';
import { DcaScheduleCallArgs } from '../../../types/calls';
import { calls } from '../typegenTypes';
import { UnknownVersionError } from '../../../../utils/errors';
import { decorateDcaSchedule } from '../utils';

function parseScheduleArgs(call: SqdCall): DcaScheduleCallArgs {
  if (calls.dca.schedule.v160.is(call)) {
    const { startExecutionBlock, schedule } =
      calls.dca.schedule.v160.decode(call);

    return {
      startExecutionBlock,
      scheduleData: decorateDcaSchedule(schedule),
    };
  }

  throw new UnknownVersionError(call.name);
}

export default { parseScheduleArgs };
