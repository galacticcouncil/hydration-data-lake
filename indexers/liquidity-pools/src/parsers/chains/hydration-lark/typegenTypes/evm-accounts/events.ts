import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const bound =  {
    name: 'EVMAccounts.Bound',
    /**
     * Binding was created.
     */
    v405: new EventType(
        'EVMAccounts.Bound',
        sts.struct({
            account: v405.AccountId32,
            address: v405.H160,
        })
    ),
}
