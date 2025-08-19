import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const bound =  {
    name: 'EVMAccounts.Bound',
    /**
     * Binding was created.
     */
    v324: new EventType(
        'EVMAccounts.Bound',
        sts.struct({
            account: v324.AccountId32,
            address: v324.H160,
        })
    ),
}
