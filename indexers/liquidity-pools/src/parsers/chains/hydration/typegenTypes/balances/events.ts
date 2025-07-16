import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v100 from '../v100'
import * as v104 from '../v104'
import * as v205 from '../v205'

export const endowed =  {
    name: 'Balances.Endowed',
    /**
     * An account was created with some free balance. \[account, free_balance\]
     */
    v100: new EventType(
        'Balances.Endowed',
        sts.tuple([v100.AccountId32, sts.bigint()])
    ),
    /**
     * An account was created with some free balance.
     */
    v104: new EventType(
        'Balances.Endowed',
        sts.struct({
            account: v104.AccountId32,
            freeBalance: sts.bigint(),
        })
    ),
}

export const dustLost =  {
    name: 'Balances.DustLost',
    /**
     * An account was removed whose balance was non-zero but below ExistentialDeposit,
     * resulting in an outright loss. \[account, balance\]
     */
    v100: new EventType(
        'Balances.DustLost',
        sts.tuple([v100.AccountId32, sts.bigint()])
    ),
    /**
     * An account was removed whose balance was non-zero but below ExistentialDeposit,
     * resulting in an outright loss.
     */
    v104: new EventType(
        'Balances.DustLost',
        sts.struct({
            account: v104.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const transfer =  {
    name: 'Balances.Transfer',
    /**
     * Transfer succeeded. \[from, to, value\]
     */
    v100: new EventType(
        'Balances.Transfer',
        sts.tuple([v100.AccountId32, v100.AccountId32, sts.bigint()])
    ),
    /**
     * Transfer succeeded.
     */
    v104: new EventType(
        'Balances.Transfer',
        sts.struct({
            from: v104.AccountId32,
            to: v104.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const balanceSet =  {
    name: 'Balances.BalanceSet',
    /**
     * A balance was set by root. \[who, free, reserved\]
     */
    v100: new EventType(
        'Balances.BalanceSet',
        sts.tuple([v100.AccountId32, sts.bigint(), sts.bigint()])
    ),
    /**
     * A balance was set by root.
     */
    v104: new EventType(
        'Balances.BalanceSet',
        sts.struct({
            who: v104.AccountId32,
            free: sts.bigint(),
            reserved: sts.bigint(),
        })
    ),
    /**
     * A balance was set by root.
     */
    v205: new EventType(
        'Balances.BalanceSet',
        sts.struct({
            who: v205.AccountId32,
            free: sts.bigint(),
        })
    ),
}

export const reserved =  {
    name: 'Balances.Reserved',
    /**
     * Some balance was reserved (moved from free to reserved). \[who, value\]
     */
    v100: new EventType(
        'Balances.Reserved',
        sts.tuple([v100.AccountId32, sts.bigint()])
    ),
    /**
     * Some balance was reserved (moved from free to reserved).
     */
    v104: new EventType(
        'Balances.Reserved',
        sts.struct({
            who: v104.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const unreserved =  {
    name: 'Balances.Unreserved',
    /**
     * Some balance was unreserved (moved from reserved to free). \[who, value\]
     */
    v100: new EventType(
        'Balances.Unreserved',
        sts.tuple([v100.AccountId32, sts.bigint()])
    ),
    /**
     * Some balance was unreserved (moved from reserved to free).
     */
    v104: new EventType(
        'Balances.Unreserved',
        sts.struct({
            who: v104.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const reserveRepatriated =  {
    name: 'Balances.ReserveRepatriated',
    /**
     * Some balance was moved from the reserve of the first account to the second account.
     * Final argument indicates the destination balance type.
     * \[from, to, balance, destination_status\]
     */
    v100: new EventType(
        'Balances.ReserveRepatriated',
        sts.tuple([v100.AccountId32, v100.AccountId32, sts.bigint(), v100.BalanceStatus])
    ),
    /**
     * Some balance was moved from the reserve of the first account to the second account.
     * Final argument indicates the destination balance type.
     */
    v104: new EventType(
        'Balances.ReserveRepatriated',
        sts.struct({
            from: v104.AccountId32,
            to: v104.AccountId32,
            amount: sts.bigint(),
            destinationStatus: v104.BalanceStatus,
        })
    ),
}

export const deposit =  {
    name: 'Balances.Deposit',
    /**
     * Some amount was deposited into the account (e.g. for transaction fees). \[who,
     * deposit\]
     */
    v100: new EventType(
        'Balances.Deposit',
        sts.tuple([v100.AccountId32, sts.bigint()])
    ),
    /**
     * Some amount was deposited (e.g. for transaction fees).
     */
    v104: new EventType(
        'Balances.Deposit',
        sts.struct({
            who: v104.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const withdraw =  {
    name: 'Balances.Withdraw',
    /**
     * Some amount was withdrawn from the account (e.g. for transaction fees). \[who, value\]
     */
    v100: new EventType(
        'Balances.Withdraw',
        sts.tuple([v100.AccountId32, sts.bigint()])
    ),
    /**
     * Some amount was withdrawn from the account (e.g. for transaction fees).
     */
    v104: new EventType(
        'Balances.Withdraw',
        sts.struct({
            who: v104.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const slashed =  {
    name: 'Balances.Slashed',
    /**
     * Some amount was removed from the account (e.g. for misbehavior). \[who,
     * amount_slashed\]
     */
    v100: new EventType(
        'Balances.Slashed',
        sts.tuple([v100.AccountId32, sts.bigint()])
    ),
    /**
     * Some amount was removed from the account (e.g. for misbehavior).
     */
    v104: new EventType(
        'Balances.Slashed',
        sts.struct({
            who: v104.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const minted =  {
    name: 'Balances.Minted',
    /**
     * Some amount was minted into an account.
     */
    v205: new EventType(
        'Balances.Minted',
        sts.struct({
            who: v205.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const burned =  {
    name: 'Balances.Burned',
    /**
     * Some amount was burned from an account.
     */
    v205: new EventType(
        'Balances.Burned',
        sts.struct({
            who: v205.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const suspended =  {
    name: 'Balances.Suspended',
    /**
     * Some amount was suspended from an account (it can be restored later).
     */
    v205: new EventType(
        'Balances.Suspended',
        sts.struct({
            who: v205.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const restored =  {
    name: 'Balances.Restored',
    /**
     * Some amount was restored into an account.
     */
    v205: new EventType(
        'Balances.Restored',
        sts.struct({
            who: v205.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const upgraded =  {
    name: 'Balances.Upgraded',
    /**
     * An account was upgraded.
     */
    v205: new EventType(
        'Balances.Upgraded',
        sts.struct({
            who: v205.AccountId32,
        })
    ),
}

export const issued =  {
    name: 'Balances.Issued',
    /**
     * Total issuance was increased by `amount`, creating a credit to be balanced.
     */
    v205: new EventType(
        'Balances.Issued',
        sts.struct({
            amount: sts.bigint(),
        })
    ),
}

export const rescinded =  {
    name: 'Balances.Rescinded',
    /**
     * Total issuance was decreased by `amount`, creating a debt to be balanced.
     */
    v205: new EventType(
        'Balances.Rescinded',
        sts.struct({
            amount: sts.bigint(),
        })
    ),
}

export const locked =  {
    name: 'Balances.Locked',
    /**
     * Some balance was locked.
     */
    v205: new EventType(
        'Balances.Locked',
        sts.struct({
            who: v205.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const unlocked =  {
    name: 'Balances.Unlocked',
    /**
     * Some balance was unlocked.
     */
    v205: new EventType(
        'Balances.Unlocked',
        sts.struct({
            who: v205.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const frozen =  {
    name: 'Balances.Frozen',
    /**
     * Some balance was frozen.
     */
    v205: new EventType(
        'Balances.Frozen',
        sts.struct({
            who: v205.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const thawed =  {
    name: 'Balances.Thawed',
    /**
     * Some balance was thawed.
     */
    v205: new EventType(
        'Balances.Thawed',
        sts.struct({
            who: v205.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const totalIssuanceForced =  {
    name: 'Balances.TotalIssuanceForced',
    /**
     * The `TotalIssuance` was forcefully changed.
     */
    v244: new EventType(
        'Balances.TotalIssuanceForced',
        sts.struct({
            old: sts.bigint(),
            new: sts.bigint(),
        })
    ),
}
