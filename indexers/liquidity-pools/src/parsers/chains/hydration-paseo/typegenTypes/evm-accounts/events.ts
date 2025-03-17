import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const bound =  {
    name: 'EVMAccounts.Bound',
    /**
     * Binding was created.
     */
    v276: new EventType(
        'EVMAccounts.Bound',
        sts.struct({
            account: v276.AccountId32,
            address: v276.H160,
        })
    ),
}
