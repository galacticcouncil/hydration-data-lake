import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const bound =  {
    name: 'EVMAccounts.Bound',
    /**
     * Binding was created.
     */
    v347: new EventType(
        'EVMAccounts.Bound',
        sts.struct({
            account: v347.AccountId32,
            address: v347.H160,
        })
    ),
}
