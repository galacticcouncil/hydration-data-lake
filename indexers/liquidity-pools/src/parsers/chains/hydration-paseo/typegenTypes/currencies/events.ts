import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const transferred =  {
    name: 'Currencies.Transferred',
    /**
     * Currency transfer success.
     */
    v276: new EventType(
        'Currencies.Transferred',
        sts.struct({
            currencyId: sts.number(),
            from: v276.AccountId32,
            to: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const balanceUpdated =  {
    name: 'Currencies.BalanceUpdated',
    /**
     * Update balance success.
     */
    v276: new EventType(
        'Currencies.BalanceUpdated',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const deposited =  {
    name: 'Currencies.Deposited',
    /**
     * Deposit success.
     */
    v276: new EventType(
        'Currencies.Deposited',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}

export const withdrawn =  {
    name: 'Currencies.Withdrawn',
    /**
     * Withdraw success.
     */
    v276: new EventType(
        'Currencies.Withdrawn',
        sts.struct({
            currencyId: sts.number(),
            who: v276.AccountId32,
            amount: sts.bigint(),
        })
    ),
}
