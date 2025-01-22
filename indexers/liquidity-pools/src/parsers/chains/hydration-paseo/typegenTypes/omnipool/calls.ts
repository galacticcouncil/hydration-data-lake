import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'

export const sell =  {
    name: 'Omnipool.sell',
    /**
     * See [`Pallet::sell`].
     */
    v257: new CallType(
        'Omnipool.sell',
        sts.struct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amount: sts.bigint(),
            minBuyAmount: sts.bigint(),
        })
    ),
}

export const buy =  {
    name: 'Omnipool.buy',
    /**
     * See [`Pallet::buy`].
     */
    v257: new CallType(
        'Omnipool.buy',
        sts.struct({
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            maxSellAmount: sts.bigint(),
        })
    ),
}
