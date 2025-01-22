import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'

export const createPool =  {
    name: 'XYK.create_pool',
    /**
     * See [`Pallet::create_pool`].
     */
    v257: new CallType(
        'XYK.create_pool',
        sts.struct({
            assetA: sts.number(),
            amountA: sts.bigint(),
            assetB: sts.number(),
            amountB: sts.bigint(),
        })
    ),
}

export const sell =  {
    name: 'XYK.sell',
    /**
     * See [`Pallet::sell`].
     */
    v257: new CallType(
        'XYK.sell',
        sts.struct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amount: sts.bigint(),
            maxLimit: sts.bigint(),
            discount: sts.boolean(),
        })
    ),
}

export const buy =  {
    name: 'XYK.buy',
    /**
     * See [`Pallet::buy`].
     */
    v257: new CallType(
        'XYK.buy',
        sts.struct({
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            maxLimit: sts.bigint(),
            discount: sts.boolean(),
        })
    ),
}
