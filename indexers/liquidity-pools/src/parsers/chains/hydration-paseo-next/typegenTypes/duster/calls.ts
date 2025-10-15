import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const dustAccount =  {
    name: 'Duster.dust_account',
    /**
     * Dust specified account.
     * IF account balance is < min. existential deposit of given currency, and account is allowed to
     * be dusted, the remaining balance is transferred to selected account (usually treasury).
     * 
     * Caller is rewarded with chosen reward in native currency.
     */
    v324: new CallType(
        'Duster.dust_account',
        sts.struct({
            account: v324.AccountId32,
            currencyId: sts.number(),
        })
    ),
}

export const addNondustableAccount =  {
    name: 'Duster.add_nondustable_account',
    /**
     * Add account to list of non-dustable account. Account whihc are excluded from udsting.
     * If such account should be dusted - `AccountBlacklisted` error is returned.
     * Only root can perform this action.
     */
    v324: new CallType(
        'Duster.add_nondustable_account',
        sts.struct({
            account: v324.AccountId32,
        })
    ),
}

export const removeNondustableAccount =  {
    name: 'Duster.remove_nondustable_account',
    /**
     * Remove account from list of non-dustable accounts. That means account can be dusted again.
     */
    v324: new CallType(
        'Duster.remove_nondustable_account',
        sts.struct({
            account: v324.AccountId32,
        })
    ),
}
