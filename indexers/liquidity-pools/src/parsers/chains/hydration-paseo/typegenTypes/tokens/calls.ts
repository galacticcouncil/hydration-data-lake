import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const transfer =  {
    name: 'Tokens.transfer',
    /**
     * See [`Pallet::transfer`].
     */
    v257: new CallType(
        'Tokens.transfer',
        sts.struct({
            dest: v257.AccountId32,
            currencyId: sts.number(),
            amount: sts.bigint(),
        })
    ),
}

export const transferAll =  {
    name: 'Tokens.transfer_all',
    /**
     * See [`Pallet::transfer_all`].
     */
    v257: new CallType(
        'Tokens.transfer_all',
        sts.struct({
            dest: v257.AccountId32,
            currencyId: sts.number(),
            keepAlive: sts.boolean(),
        })
    ),
}

export const transferKeepAlive =  {
    name: 'Tokens.transfer_keep_alive',
    /**
     * See [`Pallet::transfer_keep_alive`].
     */
    v257: new CallType(
        'Tokens.transfer_keep_alive',
        sts.struct({
            dest: v257.AccountId32,
            currencyId: sts.number(),
            amount: sts.bigint(),
        })
    ),
}

export const forceTransfer =  {
    name: 'Tokens.force_transfer',
    /**
     * See [`Pallet::force_transfer`].
     */
    v257: new CallType(
        'Tokens.force_transfer',
        sts.struct({
            source: v257.AccountId32,
            dest: v257.AccountId32,
            currencyId: sts.number(),
            amount: sts.bigint(),
        })
    ),
}

export const setBalance =  {
    name: 'Tokens.set_balance',
    /**
     * See [`Pallet::set_balance`].
     */
    v257: new CallType(
        'Tokens.set_balance',
        sts.struct({
            who: v257.AccountId32,
            currencyId: sts.number(),
            newFree: sts.bigint(),
            newReserved: sts.bigint(),
        })
    ),
}
