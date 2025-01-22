import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const transferAllowDeath =  {
    name: 'Balances.transfer_allow_death',
    /**
     * See [`Pallet::transfer_allow_death`].
     */
    v257: new CallType(
        'Balances.transfer_allow_death',
        sts.struct({
            dest: v257.AccountId32,
            value: sts.bigint(),
        })
    ),
}

export const forceTransfer =  {
    name: 'Balances.force_transfer',
    /**
     * See [`Pallet::force_transfer`].
     */
    v257: new CallType(
        'Balances.force_transfer',
        sts.struct({
            source: v257.AccountId32,
            dest: v257.AccountId32,
            value: sts.bigint(),
        })
    ),
}

export const transferKeepAlive =  {
    name: 'Balances.transfer_keep_alive',
    /**
     * See [`Pallet::transfer_keep_alive`].
     */
    v257: new CallType(
        'Balances.transfer_keep_alive',
        sts.struct({
            dest: v257.AccountId32,
            value: sts.bigint(),
        })
    ),
}

export const transferAll =  {
    name: 'Balances.transfer_all',
    /**
     * See [`Pallet::transfer_all`].
     */
    v257: new CallType(
        'Balances.transfer_all',
        sts.struct({
            dest: v257.AccountId32,
            keepAlive: sts.boolean(),
        })
    ),
}

export const forceUnreserve =  {
    name: 'Balances.force_unreserve',
    /**
     * See [`Pallet::force_unreserve`].
     */
    v257: new CallType(
        'Balances.force_unreserve',
        sts.struct({
            who: v257.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const upgradeAccounts =  {
    name: 'Balances.upgrade_accounts',
    /**
     * See [`Pallet::upgrade_accounts`].
     */
    v257: new CallType(
        'Balances.upgrade_accounts',
        sts.struct({
            who: sts.array(() => v257.AccountId32),
        })
    ),
}

export const forceSetBalance =  {
    name: 'Balances.force_set_balance',
    /**
     * See [`Pallet::force_set_balance`].
     */
    v257: new CallType(
        'Balances.force_set_balance',
        sts.struct({
            who: v257.AccountId32,
            newFree: sts.bigint(),
        })
    ),
}

export const forceAdjustTotalIssuance =  {
    name: 'Balances.force_adjust_total_issuance',
    /**
     * See [`Pallet::force_adjust_total_issuance`].
     */
    v257: new CallType(
        'Balances.force_adjust_total_issuance',
        sts.struct({
            direction: v257.AdjustmentDirection,
            delta: sts.bigint(),
        })
    ),
}
