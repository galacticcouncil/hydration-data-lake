import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'

export const placeOrder =  {
    name: 'OTC.place_order',
    /**
     * See [`Pallet::place_order`].
     */
    v257: new CallType(
        'OTC.place_order',
        sts.struct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            partiallyFillable: sts.boolean(),
        })
    ),
}

export const partialFillOrder =  {
    name: 'OTC.partial_fill_order',
    /**
     * See [`Pallet::partial_fill_order`].
     */
    v257: new CallType(
        'OTC.partial_fill_order',
        sts.struct({
            orderId: sts.number(),
            amountIn: sts.bigint(),
        })
    ),
}

export const fillOrder =  {
    name: 'OTC.fill_order',
    /**
     * See [`Pallet::fill_order`].
     */
    v257: new CallType(
        'OTC.fill_order',
        sts.struct({
            orderId: sts.number(),
        })
    ),
}

export const cancelOrder =  {
    name: 'OTC.cancel_order',
    /**
     * See [`Pallet::cancel_order`].
     */
    v257: new CallType(
        'OTC.cancel_order',
        sts.struct({
            orderId: sts.number(),
        })
    ),
}
