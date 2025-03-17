import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const transferred =  {
    name: 'Currencies.Transferred',
    /**
     * Currency transfer success.
     */
    v276: new EventType(
        'Currencies.Transferred',
        sts.struct({
            currencyId: sts.number(),
            from: v276.AccountId32,
            to: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
