import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const transferred =  {
    name: 'Currencies.Transferred',
    /**
     * Currency transfer success.
     */
    v324: new EventType(
        'Currencies.Transferred',
        sts.struct({
            currencyId: sts.number(),
            from: v324.AccountId32,
            to: v324.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
