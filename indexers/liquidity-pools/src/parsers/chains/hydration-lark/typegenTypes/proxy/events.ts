import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const proxyExecuted =  {
    name: 'Proxy.ProxyExecuted',
    /**
     * A proxy was executed correctly, with the given.
     */
    v405: new EventType(
        'Proxy.ProxyExecuted',
        sts.struct({
            result: sts.result(() => sts.unit(), () => v405.DispatchError),
        })
    ),
}

export const pureCreated =  {
    name: 'Proxy.PureCreated',
    /**
     * A pure account has been created by new proxy with given
     * disambiguation index and proxy type.
     */
    v405: new EventType(
        'Proxy.PureCreated',
        sts.struct({
            pure: v405.AccountId32,
            who: v405.AccountId32,
            proxyType: v405.ProxyType,
            disambiguationIndex: sts.number(),
        })
    ),
}

export const pureKilled =  {
    name: 'Proxy.PureKilled',
    /**
     * A pure proxy was killed by its spawner.
     */
    v405: new EventType(
        'Proxy.PureKilled',
        sts.struct({
            pure: v405.AccountId32,
            spawner: v405.AccountId32,
            proxyType: v405.ProxyType,
            disambiguationIndex: sts.number(),
        })
    ),
}

export const announced =  {
    name: 'Proxy.Announced',
    /**
     * An announcement was placed to make a call in the future.
     */
    v405: new EventType(
        'Proxy.Announced',
        sts.struct({
            real: v405.AccountId32,
            proxy: v405.AccountId32,
            callHash: v405.H256,
        })
    ),
}

export const proxyAdded =  {
    name: 'Proxy.ProxyAdded',
    /**
     * A proxy was added.
     */
    v405: new EventType(
        'Proxy.ProxyAdded',
        sts.struct({
            delegator: v405.AccountId32,
            delegatee: v405.AccountId32,
            proxyType: v405.ProxyType,
            delay: sts.number(),
        })
    ),
}

export const proxyRemoved =  {
    name: 'Proxy.ProxyRemoved',
    /**
     * A proxy was removed.
     */
    v405: new EventType(
        'Proxy.ProxyRemoved',
        sts.struct({
            delegator: v405.AccountId32,
            delegatee: v405.AccountId32,
            proxyType: v405.ProxyType,
            delay: sts.number(),
        })
    ),
}

export const depositPoked =  {
    name: 'Proxy.DepositPoked',
    /**
     * A deposit stored for proxies or announcements was poked / updated.
     */
    v405: new EventType(
        'Proxy.DepositPoked',
        sts.struct({
            who: v405.AccountId32,
            kind: v405.DepositKind,
            oldDeposit: sts.bigint(),
            newDeposit: sts.bigint(),
        })
    ),
}
