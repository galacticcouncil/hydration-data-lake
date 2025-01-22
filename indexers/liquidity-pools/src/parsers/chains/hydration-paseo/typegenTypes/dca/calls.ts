import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const schedule =  {
    name: 'DCA.schedule',
    /**
     * See [`Pallet::schedule`].
     */
    v257: new CallType(
        'DCA.schedule',
        sts.struct({
            schedule: v257.Schedule,
            startExecutionBlock: sts.option(() => sts.number()),
        })
    ),
}

export const terminate =  {
    name: 'DCA.terminate',
    /**
     * See [`Pallet::terminate`].
     */
    v257: new CallType(
        'DCA.terminate',
        sts.struct({
            scheduleId: sts.number(),
            nextExecutionBlock: sts.option(() => sts.number()),
        })
    ),
}
