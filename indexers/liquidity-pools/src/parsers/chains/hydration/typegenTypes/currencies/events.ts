import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v108 from '../v108'

export const transferred =  {
    name: 'Currencies.Transferred',
    /**
     * Currency transfer success.
     */
    v108: new EventType(
        'Currencies.Transferred',
        sts.struct({
            currencyId: sts.number(),
            from: v108.AccountId32,
            to: v108.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
