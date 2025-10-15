import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const dusted =  {
    name: 'Duster.Dusted',
    /**
     * Account dusted.
     */
    v287: new EventType(
        'Duster.Dusted',
        sts.struct({
            who: v287.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const added =  {
    name: 'Duster.Added',
    /**
     * Account added to non-dustable list.
     */
    v287: new EventType(
        'Duster.Added',
        sts.struct({
            who: v287.AccountId32,
        })
    ),
}

export const removed =  {
    name: 'Duster.Removed',
    /**
     * Account removed from non-dustable list.
     */
    v287: new EventType(
        'Duster.Removed',
        sts.struct({
            who: v287.AccountId32,
        })
    ),
}
