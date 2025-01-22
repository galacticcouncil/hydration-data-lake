import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v257: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v257.AccountId32,
            to: v257.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
