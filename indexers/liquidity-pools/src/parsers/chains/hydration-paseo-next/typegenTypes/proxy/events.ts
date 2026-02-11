import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const proxyExecuted =  {
    name: 'Proxy.ProxyExecuted',
    /**
     * A proxy was executed correctly, with the given.
     */
    v324: new EventType(
        'Proxy.ProxyExecuted',
        sts.struct({
            result: sts.result(() => sts.unit(), () => v324.DispatchError),
        })
    ),
}

export const pureCreated =  {
    name: 'Proxy.PureCreated',
    /**
     * A pure account has been created by new proxy with given
     * disambiguation index and proxy type.
     */
    v324: new EventType(
        'Proxy.PureCreated',
        sts.struct({
            pure: v324.AccountId32,
            who: v324.AccountId32,
            proxyType: v324.ProxyType,
            disambiguationIndex: sts.number(),
        })
    ),
}

export const announced =  {
    name: 'Proxy.Announced',
    /**
     * An announcement was placed to make a call in the future.
     */
    v324: new EventType(
        'Proxy.Announced',
        sts.struct({
            real: v324.AccountId32,
            proxy: v324.AccountId32,
            callHash: v324.H256,
        })
    ),
}

export const proxyAdded =  {
    name: 'Proxy.ProxyAdded',
    /**
     * A proxy was added.
     */
    v324: new EventType(
        'Proxy.ProxyAdded',
        sts.struct({
            delegator: v324.AccountId32,
            delegatee: v324.AccountId32,
            proxyType: v324.ProxyType,
            delay: sts.number(),
        })
    ),
}

export const proxyRemoved =  {
    name: 'Proxy.ProxyRemoved',
    /**
     * A proxy was removed.
     */
    v324: new EventType(
        'Proxy.ProxyRemoved',
        sts.struct({
            delegator: v324.AccountId32,
            delegatee: v324.AccountId32,
            proxyType: v324.ProxyType,
            delay: sts.number(),
        })
    ),
}
