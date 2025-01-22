import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const transfer =  {
    name: 'Tokens.Transfer',
    /**
     * Transfer succeeded.
     */
    v257: new EventType(
        'Tokens.Transfer',
        sts.struct({
            currencyId: sts.number(),
            from: v257.AccountId32,
            to: v257.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
