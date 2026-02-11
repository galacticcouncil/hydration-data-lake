import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v108 from '../v108'
import * as v115 from '../v115'
import * as v160 from '../v160'
import * as v170 from '../v170'
import * as v205 from '../v205'

export const proxyExecuted =  {
    name: 'Proxy.ProxyExecuted',
    /**
     * A proxy was executed correctly, with the given.
     */
    v108: new EventType(
        'Proxy.ProxyExecuted',
        sts.struct({
            result: sts.result(() => sts.unit(), () => v108.DispatchError),
        })
    ),
    /**
     * A proxy was executed correctly, with the given.
     */
    v115: new EventType(
        'Proxy.ProxyExecuted',
        sts.struct({
            result: sts.result(() => sts.unit(), () => v115.DispatchError),
        })
    ),
    /**
     * A proxy was executed correctly, with the given.
     */
    v160: new EventType(
        'Proxy.ProxyExecuted',
        sts.struct({
            result: sts.result(() => sts.unit(), () => v160.DispatchError),
        })
    ),
    /**
     * A proxy was executed correctly, with the given.
     */
    v205: new EventType(
        'Proxy.ProxyExecuted',
        sts.struct({
            result: sts.result(() => sts.unit(), () => v205.DispatchError),
        })
    ),
}

export const anonymousCreated =  {
    name: 'Proxy.AnonymousCreated',
    /**
     * Anonymous account has been created by new proxy with given
     * disambiguation index and proxy type.
     */
    v108: new EventType(
        'Proxy.AnonymousCreated',
        sts.struct({
            anonymous: v108.AccountId32,
            who: v108.AccountId32,
            proxyType: v108.ProxyType,
            disambiguationIndex: sts.number(),
        })
    ),
}

export const announced =  {
    name: 'Proxy.Announced',
    /**
     * An announcement was placed to make a call in the future.
     */
    v108: new EventType(
        'Proxy.Announced',
        sts.struct({
            real: v108.AccountId32,
            proxy: v108.AccountId32,
            callHash: v108.H256,
        })
    ),
}

export const proxyAdded =  {
    name: 'Proxy.ProxyAdded',
    /**
     * A proxy was added.
     */
    v108: new EventType(
        'Proxy.ProxyAdded',
        sts.struct({
            delegator: v108.AccountId32,
            delegatee: v108.AccountId32,
            proxyType: v108.ProxyType,
            delay: sts.number(),
        })
    ),
    /**
     * A proxy was added.
     */
    v170: new EventType(
        'Proxy.ProxyAdded',
        sts.struct({
            delegator: v170.AccountId32,
            delegatee: v170.AccountId32,
            proxyType: v170.ProxyType,
            delay: sts.number(),
        })
    ),
}

export const proxyRemoved =  {
    name: 'Proxy.ProxyRemoved',
    /**
     * A proxy was removed.
     */
    v115: new EventType(
        'Proxy.ProxyRemoved',
        sts.struct({
            delegator: v115.AccountId32,
            delegatee: v115.AccountId32,
            proxyType: v115.ProxyType,
            delay: sts.number(),
        })
    ),
    /**
     * A proxy was removed.
     */
    v170: new EventType(
        'Proxy.ProxyRemoved',
        sts.struct({
            delegator: v170.AccountId32,
            delegatee: v170.AccountId32,
            proxyType: v170.ProxyType,
            delay: sts.number(),
        })
    ),
}

export const pureCreated =  {
    name: 'Proxy.PureCreated',
    /**
     * A pure account has been created by new proxy with given
     * disambiguation index and proxy type.
     */
    v160: new EventType(
        'Proxy.PureCreated',
        sts.struct({
            pure: v160.AccountId32,
            who: v160.AccountId32,
            proxyType: v160.ProxyType,
            disambiguationIndex: sts.number(),
        })
    ),
    /**
     * A pure account has been created by new proxy with given
     * disambiguation index and proxy type.
     */
    v170: new EventType(
        'Proxy.PureCreated',
        sts.struct({
            pure: v170.AccountId32,
            who: v170.AccountId32,
            proxyType: v170.ProxyType,
            disambiguationIndex: sts.number(),
        })
    ),
}
