import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v108 from '../v108'

export const transfer =  {
    name: 'Tokens.transfer',
    /**
     * Transfer some liquid free balance to another account.
     * 
     * `transfer` will set the `FreeBalance` of the sender and receiver.
     * It will decrease the total issuance of the system by the
     * `TransferFee`. If the sender's account is below the existential
     * deposit as a result of the transfer, the account will be reaped.
     * 
     * The dispatch origin for this call must be `Signed` by the
     * transactor.
     * 
     * - `dest`: The recipient of the transfer.
     * - `currency_id`: currency type.
     * - `amount`: free balance amount to tranfer.
     */
    v108: new CallType(
        'Tokens.transfer',
        sts.struct({
            dest: v108.AccountId32,
            currencyId: sts.number(),
            amount: sts.bigint(),
        })
    ),
}

export const transferAll =  {
    name: 'Tokens.transfer_all',
    /**
     * Transfer all remaining balance to the given account.
     * 
     * NOTE: This function only attempts to transfer _transferable_
     * balances. This means that any locked, reserved, or existential
     * deposits (when `keep_alive` is `true`), will not be transferred by
     * this function. To ensure that this function results in a killed
     * account, you might need to prepare the account by removing any
     * reference counters, storage deposits, etc...
     * 
     * The dispatch origin for this call must be `Signed` by the
     * transactor.
     * 
     * - `dest`: The recipient of the transfer.
     * - `currency_id`: currency type.
     * - `keep_alive`: A boolean to determine if the `transfer_all`
     *   operation should send all of the funds the account has, causing
     *   the sender account to be killed (false), or transfer everything
     *   except at least the existential deposit, which will guarantee to
     *   keep the sender account alive (true).
     */
    v108: new CallType(
        'Tokens.transfer_all',
        sts.struct({
            dest: v108.AccountId32,
            currencyId: sts.number(),
            keepAlive: sts.boolean(),
        })
    ),
}

export const transferKeepAlive =  {
    name: 'Tokens.transfer_keep_alive',
    /**
     * Same as the [`transfer`] call, but with a check that the transfer
     * will not kill the origin account.
     * 
     * 99% of the time you want [`transfer`] instead.
     * 
     * The dispatch origin for this call must be `Signed` by the
     * transactor.
     * 
     * - `dest`: The recipient of the transfer.
     * - `currency_id`: currency type.
     * - `amount`: free balance amount to tranfer.
     */
    v108: new CallType(
        'Tokens.transfer_keep_alive',
        sts.struct({
            dest: v108.AccountId32,
            currencyId: sts.number(),
            amount: sts.bigint(),
        })
    ),
}

export const forceTransfer =  {
    name: 'Tokens.force_transfer',
    /**
     * Exactly as `transfer`, except the origin must be root and the source
     * account may be specified.
     * 
     * The dispatch origin for this call must be _Root_.
     * 
     * - `source`: The sender of the transfer.
     * - `dest`: The recipient of the transfer.
     * - `currency_id`: currency type.
     * - `amount`: free balance amount to tranfer.
     */
    v108: new CallType(
        'Tokens.force_transfer',
        sts.struct({
            source: v108.AccountId32,
            dest: v108.AccountId32,
            currencyId: sts.number(),
            amount: sts.bigint(),
        })
    ),
}

export const setBalance =  {
    name: 'Tokens.set_balance',
    /**
     * Set the balances of a given account.
     * 
     * This will alter `FreeBalance` and `ReservedBalance` in storage. it
     * will also decrease the total issuance of the system
     * (`TotalIssuance`). If the new free or reserved balance is below the
     * existential deposit, it will reap the `AccountInfo`.
     * 
     * The dispatch origin for this call is `root`.
     */
    v108: new CallType(
        'Tokens.set_balance',
        sts.struct({
            who: v108.AccountId32,
            currencyId: sts.number(),
            newFree: sts.bigint(),
            newReserved: sts.bigint(),
        })
    ),
}
