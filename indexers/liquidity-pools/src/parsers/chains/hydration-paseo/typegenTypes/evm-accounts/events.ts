import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const bound =  {
    name: 'EVMAccounts.Bound',
    /**
     * Binding was created.
     */
    v287: new EventType(
        'EVMAccounts.Bound',
        sts.struct({
            account: v287.AccountId32,
            address: v287.H160,
        })
    ),
}
