import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const sell =  {
    name: 'Router.sell',
    /**
     * See [`Pallet::sell`].
     */
    v257: new CallType(
        'Router.sell',
        sts.struct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            minAmountOut: sts.bigint(),
            route: sts.array(() => v257.Trade),
        })
    ),
}

export const buy =  {
    name: 'Router.buy',
    /**
     * See [`Pallet::buy`].
     */
    v257: new CallType(
        'Router.buy',
        sts.struct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountOut: sts.bigint(),
            maxAmountIn: sts.bigint(),
            route: sts.array(() => v257.Trade),
        })
    ),
}
