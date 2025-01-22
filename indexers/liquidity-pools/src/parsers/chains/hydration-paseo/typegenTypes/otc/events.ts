import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const cancelled =  {
    name: 'OTC.Cancelled',
    /**
     * An Order has been cancelled
     */
    v257: new EventType(
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
    v257: new EventType(
        'OTC.Filled',
        sts.struct({
            orderId: sts.number(),
            who: v257.AccountId32,
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
    v257: new EventType(
        'OTC.PartiallyFilled',
        sts.struct({
            orderId: sts.number(),
            who: v257.AccountId32,
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
    v257: new EventType(
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
