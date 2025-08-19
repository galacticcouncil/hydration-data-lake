import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v324: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v324.AccountId32,
            to: v324.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
