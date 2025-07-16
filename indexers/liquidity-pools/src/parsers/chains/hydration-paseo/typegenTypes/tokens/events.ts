import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const endowed =  {
    name: 'Tokens.Endowed',
    /**
     * An account was created with some free balance.
     */
    v276: new EventType(
        'Tokens.Endowed',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const dustLost =  {
    name: 'Tokens.DustLost',
    /**
     * An account was removed whose balance was non-zero but below
     * ExistentialDeposit, resulting in an outright loss.
     */
    v276: new EventType(
        'Tokens.DustLost',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const transfer =  {
    name: 'Tokens.Transfer',
    /**
     * Transfer succeeded.
     */
    v276: new EventType(
        'Tokens.Transfer',
        sts.struct({
            currencyId: sts.number(),
            from: v276.AccountId32,
            to: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const reserved =  {
    name: 'Tokens.Reserved',
    /**
     * Some balance was reserved (moved from free to reserved).
     */
    v276: new EventType(
        'Tokens.Reserved',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const unreserved =  {
    name: 'Tokens.Unreserved',
    /**
     * Some balance was unreserved (moved from reserved to free).
     */
    v276: new EventType(
        'Tokens.Unreserved',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const reserveRepatriated =  {
    name: 'Tokens.ReserveRepatriated',
    /**
     * Some reserved balance was repatriated (moved from reserved to
     * another account).
     */
    v276: new EventType(
        'Tokens.ReserveRepatriated',
        sts.struct({
            currencyId: sts.number(),
            from: v276.AccountId32,
            to: v276.AccountId32,
            amount: sts.bigint(),
            status: v276.BalanceStatus,
        })
    ),
}

export const balanceSet =  {
    name: 'Tokens.BalanceSet',
    /**
     * A balance was set by root.
     */
    v276: new EventType(
        'Tokens.BalanceSet',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            free: sts.bigint(),
            reserved: sts.bigint(),
        })
    ),
}

export const totalIssuanceSet =  {
    name: 'Tokens.TotalIssuanceSet',
    /**
     * The total issuance of an currency has been set
     */
    v276: new EventType(
        'Tokens.TotalIssuanceSet',
        sts.struct({
            currencyId: sts.number(),
            amount: sts.bigint(),
        })
    ),
}

export const withdrawn =  {
    name: 'Tokens.Withdrawn',
    /**
     * Some balances were withdrawn (e.g. pay for transaction fee)
     */
    v276: new EventType(
        'Tokens.Withdrawn',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const slashed =  {
    name: 'Tokens.Slashed',
    /**
     * Some balances were slashed (e.g. due to mis-behavior)
     */
    v276: new EventType(
        'Tokens.Slashed',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            freeAmount: sts.bigint(),
            reservedAmount: sts.bigint(),
        })
    ),
}

export const deposited =  {
    name: 'Tokens.Deposited',
    /**
     * Deposited some balance into an account
     */
    v276: new EventType(
        'Tokens.Deposited',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const lockSet =  {
    name: 'Tokens.LockSet',
    /**
     * Some funds are locked
     */
    v276: new EventType(
        'Tokens.LockSet',
        sts.struct({
            lockId: sts.bytes(),
            currencyId: sts.number(),
            who: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const lockRemoved =  {
    name: 'Tokens.LockRemoved',
    /**
     * Some locked funds were unlocked
     */
    v276: new EventType(
        'Tokens.LockRemoved',
        sts.struct({
            lockId: sts.bytes(),
            currencyId: sts.number(),
            who: v276.AccountId32,
        })
    ),
}

export const locked =  {
    name: 'Tokens.Locked',
    /**
     * Some free balance was locked.
     */
    v276: new EventType(
        'Tokens.Locked',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const unlocked =  {
    name: 'Tokens.Unlocked',
    /**
     * Some locked balance was freed.
     */
    v276: new EventType(
        'Tokens.Unlocked',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const issued =  {
    name: 'Tokens.Issued',
    v276: new EventType(
        'Tokens.Issued',
        sts.struct({
            currencyId: sts.number(),
            amount: sts.bigint(),
        })
    ),
}

export const rescinded =  {
    name: 'Tokens.Rescinded',
    v276: new EventType(
        'Tokens.Rescinded',
        sts.struct({
            currencyId: sts.number(),
            amount: sts.bigint(),
        })
    ),
}
