import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v276: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v276.AccountId32,
            to: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
