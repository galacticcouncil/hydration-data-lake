import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const dusted =  {
    name: 'Duster.Dusted',
    /**
     * Account dusted.
     */
    v405: new EventType(
        'Duster.Dusted',
        sts.struct({
            who: v405.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const added =  {
    name: 'Duster.Added',
    /**
     * Account added to non-dustable list.
     */
    v405: new EventType(
        'Duster.Added',
        sts.struct({
            who: v405.AccountId32,
        })
    ),
}

export const removed =  {
    name: 'Duster.Removed',
    /**
     * Account removed from non-dustable list.
     */
    v405: new EventType(
        'Duster.Removed',
        sts.struct({
            who: v405.AccountId32,
        })
    ),
}
