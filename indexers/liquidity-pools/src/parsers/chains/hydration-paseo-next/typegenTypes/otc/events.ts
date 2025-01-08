import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const cancelled =  {
    name: 'OTC.Cancelled',
    /**
     * An Order has been cancelled
     */
    v276: new EventType(
        'OTC.Cancelled',
        sts.struct({
            orderId: sts.number(),
        })
    ),
}

export const filled =  {
    name: 'OTC.Filled',
    /**
     * An Order has been completely filled
     */
    v276: new EventType(
        'OTC.Filled',
        sts.struct({
            orderId: sts.number(),
            who: v276.AccountId32,
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            fee: sts.bigint(),
        })
    ),
}

export const partiallyFilled =  {
    name: 'OTC.PartiallyFilled',
    /**
     * An Order has been partially filled
     */
    v276: new EventType(
        'OTC.PartiallyFilled',
        sts.struct({
            orderId: sts.number(),
            who: v276.AccountId32,
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            fee: sts.bigint(),
        })
    ),
}

export const placed =  {
    name: 'OTC.Placed',
    /**
     * An Order has been placed
     */
    v276: new EventType(
        'OTC.Placed',
        sts.struct({
            orderId: sts.number(),
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            partiallyFillable: sts.boolean(),
        })
    ),
}
