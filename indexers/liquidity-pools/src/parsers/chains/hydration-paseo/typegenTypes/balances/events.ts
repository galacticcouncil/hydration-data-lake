import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded.
     */
    v287: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v287.AccountId32,
            to: v287.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
