import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v138 from '../v138'
import * as v253 from '../v253'

export const cancelled =  {
    name: 'OTC.Cancelled',
    /**
     * An Order has been cancelled
     */
    v138: new EventType(
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
    v138: new EventType(
        'OTC.Filled',
        sts.struct({
            orderId: sts.number(),
            who: v138.AccountId32,
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
        })
    ),
    /**
     * An Order has been completely filled
     */
    v253: new EventType(
        'OTC.Filled',
        sts.struct({
            orderId: sts.number(),
            who: v253.AccountId32,
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
    v138: new EventType(
        'OTC.PartiallyFilled',
        sts.struct({
            orderId: sts.number(),
            who: v138.AccountId32,
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
        })
    ),
    /**
     * An Order has been partially filled
     */
    v253: new EventType(
        'OTC.PartiallyFilled',
        sts.struct({
            orderId: sts.number(),
            who: v253.AccountId32,
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
    v138: new EventType(
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
