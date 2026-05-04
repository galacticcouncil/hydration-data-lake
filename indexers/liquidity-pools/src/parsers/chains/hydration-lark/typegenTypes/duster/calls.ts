import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const dustAccount =  {
    name: 'Duster.dust_account',
    /**
     * Dust specified account.
     * IF account balance is < min. existential deposit of given currency, and account is allowed to
     * be dusted, the remaining balance is transferred to treasury account.
     * 
     * In case of AToken, we perform an erc20 dust, which does a wihtdraw all to the treasury account
     * Note that in this case, the treasury will just receive the underlying token, not the atoken variant.
     * 
     * The transaction fee is returned back in case of successful dusting.
     * 
     * Treasury account can never be dusted.
     * 
     * Emits `Dusted` event when successful.
     */
    v405: new CallType(
        'Duster.dust_account',
        sts.struct({
            account: v405.AccountId32,
            currencyId: sts.number(),
        })
    ),
}

export const whitelistAccount =  {
    name: 'Duster.whitelist_account',
    /**
     * Add account to list of whitelist accounts. Account which are excluded from dusting.
     * If such account should be dusted - `AccountWhitelisted` error is returned.
     * Only root can perform this action.
     * 
     * Emits `Added` event when successful.
     * 
     */
    v405: new CallType(
        'Duster.whitelist_account',
        sts.struct({
            account: v405.AccountId32,
        })
    ),
}

export const removeFromWhitelist =  {
    name: 'Duster.remove_from_whitelist',
    /**
     * Remove account from list of whitelist accounts. That means account can be dusted again.
     * 
     * Emits `Removed` event when successful.
     * 
     */
    v405: new CallType(
        'Duster.remove_from_whitelist',
        sts.struct({
            account: v405.AccountId32,
        })
    ),
}
