import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'

export const sell =  {
    name: 'Stableswap.sell',
    /**
     * See [`Pallet::sell`].
     */
    v257: new CallType(
        'Stableswap.sell',
        sts.struct({
            poolId: sts.number(),
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            minBuyAmount: sts.bigint(),
        })
    ),
}

export const buy =  {
    name: 'Stableswap.buy',
    /**
     * See [`Pallet::buy`].
     */
    v257: new CallType(
        'Stableswap.buy',
        sts.struct({
            poolId: sts.number(),
            assetOut: sts.number(),
            assetIn: sts.number(),
            amountOut: sts.bigint(),
            maxSellAmount: sts.bigint(),
        })
    ),
}
