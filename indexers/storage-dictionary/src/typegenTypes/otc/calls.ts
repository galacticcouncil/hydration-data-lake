import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'

export const placeOrder =  {
    name: 'OTC.place_order',
    /**
     * Create a new OTC order
     *  
     * Parameters:
     * - `asset_in`: Asset which is being bought
     * - `asset_out`: Asset which is being sold
     * - `amount_in`: Amount that the order is seeking to buy
     * - `amount_out`: Amount that the order is selling
     * - `partially_fillable`: Flag indicating whether users can fill the order partially
     * 
     * Validations:
     * - asset_in must be registered
     * - amount_in must be higher than the existential deposit of asset_in multiplied by
     *   ExistentialDepositMultiplier
     * - amount_out must be higher than the existential deposit of asset_out multiplied by
     *   ExistentialDepositMultiplier
     * 
     * Events:
     * - `Placed` event when successful.
     */
    v138: new CallType(
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
     * Fill an OTC order (partially)
     *  
     * Parameters:
     * - `order_id`: ID of the order
     * - `amount_in`: Amount with which the order is being filled
     * 
     * Validations:
     * - order must be partially_fillable
     * - after the partial_fill, the remaining order.amount_in must be higher than the existential deposit
     *   of asset_in multiplied by ExistentialDepositMultiplier
     * - after the partial_fill, the remaining order.amount_out must be higher than the existential deposit
     *   of asset_out multiplied by ExistentialDepositMultiplier
     * 
     * Events:
     * `PartiallyFilled` event when successful.
     */
    v138: new CallType(
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
     * Fill an OTC order (completely)
     *  
     * Parameters:
     * - `order_id`: ID of the order
     * 
     * Events:
     * `Filled` event when successful.
     */
    v138: new CallType(
        'OTC.fill_order',
        sts.struct({
            orderId: sts.number(),
        })
    ),
}

export const cancelOrder =  {
    name: 'OTC.cancel_order',
    /**
     * Cancel an open OTC order
     *  
     * Parameters:
     * - `order_id`: ID of the order
     * - `asset`: Asset which is being filled
     * - `amount`: Amount which is being filled
     * 
     * Validations:
     * - caller is order owner
     * 
     * Emits `Cancelled` event when successful.
     */
    v138: new CallType(
        'OTC.cancel_order',
        sts.struct({
            orderId: sts.number(),
        })
    ),
}
