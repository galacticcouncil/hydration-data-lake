import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v347 from '../v347'
import * as v390 from '../v390'

export const proxyExecuted =  {
    name: 'Proxy.ProxyExecuted',
    /**
     * A proxy was executed correctly, with the given.
     */
    v347: new EventType(
        'Proxy.ProxyExecuted',
        sts.struct({
            result: sts.result(() => sts.unit(), () => v347.DispatchError),
        })
    ),
    /**
     * A proxy was executed correctly, with the given.
     */
    v390: new EventType(
        'Proxy.ProxyExecuted',
        sts.struct({
            result: sts.result(() => sts.unit(), () => v390.DispatchError),
        })
    ),
}

export const pureCreated =  {
    name: 'Proxy.PureCreated',
    /**
     * A pure account has been created by new proxy with given
     * disambiguation index and proxy type.
     */
    v347: new EventType(
        'Proxy.PureCreated',
        sts.struct({
            pure: v347.AccountId32,
            who: v347.AccountId32,
            proxyType: v347.ProxyType,
            disambiguationIndex: sts.number(),
        })
    ),
}

export const announced =  {
    name: 'Proxy.Announced',
    /**
     * An announcement was placed to make a call in the future.
     */
    v347: new EventType(
        'Proxy.Announced',
        sts.struct({
            real: v347.AccountId32,
            proxy: v347.AccountId32,
            callHash: v347.H256,
        })
    ),
}

export const proxyAdded =  {
    name: 'Proxy.ProxyAdded',
    /**
     * A proxy was added.
     */
    v347: new EventType(
        'Proxy.ProxyAdded',
        sts.struct({
            delegator: v347.AccountId32,
            delegatee: v347.AccountId32,
            proxyType: v347.ProxyType,
            delay: sts.number(),
        })
    ),
}

export const proxyRemoved =  {
    name: 'Proxy.ProxyRemoved',
    /**
     * A proxy was removed.
     */
    v347: new EventType(
        'Proxy.ProxyRemoved',
        sts.struct({
            delegator: v347.AccountId32,
            delegatee: v347.AccountId32,
            proxyType: v347.ProxyType,
            delay: sts.number(),
        })
    ),
}

export const depositPoked =  {
    name: 'Proxy.DepositPoked',
    /**
     * A deposit stored for proxies or announcements was poked / updated.
     */
    v390: new EventType(
        'Proxy.DepositPoked',
        sts.struct({
            who: v390.AccountId32,
            kind: v390.DepositKind,
            oldDeposit: sts.bigint(),
            newDeposit: sts.bigint(),
        })
    ),
}
