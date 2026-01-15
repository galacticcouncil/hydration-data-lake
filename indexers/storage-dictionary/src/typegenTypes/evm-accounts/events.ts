import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v222 from '../v222'

export const bound =  {
    name: 'EVMAccounts.Bound',
    /**
     * Binding was created.
     */
    v222: new EventType(
        'EVMAccounts.Bound',
        sts.struct({
            account: v222.AccountId32,
            address: v222.H160,
        })
    ),
}
