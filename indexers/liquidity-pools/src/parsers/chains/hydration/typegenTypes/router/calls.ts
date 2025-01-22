import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v160 from '../v160'

export const sell =  {
    name: 'Router.sell',
    /**
     * Executes a sell with a series of trades specified in the route.
     * The price for each trade is determined by the corresponding AMM.
     * 
     * - `origin`: The executor of the trade
     * - `asset_in`: The identifier of the asset to sell
     * - `asset_out`: The identifier of the asset to receive
     * - `amount_in`: The amount of `asset_in` to sell
     * - `min_amount_out`: The minimum amount of `asset_out` to receive.
     * - `route`: Series of [`Trade<AssetId>`] to be executed. A [`Trade<AssetId>`] specifies the asset pair (`asset_in`, `asset_out`) and the AMM (`pool`) in which the trade is executed.
     * 
     * Emits `RouteExecuted` when successful.
     */
    v160: new CallType(
        'Router.sell',
        sts.struct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            minAmountOut: sts.bigint(),
            route: sts.array(() => v160.Trade),
        })
    ),
}

export const buy =  {
    name: 'Router.buy',
    /**
     * Executes a buy with a series of trades specified in the route.
     * The price for each trade is determined by the corresponding AMM.
     * 
     * - `origin`: The executor of the trade
     * - `asset_in`: The identifier of the asset to be swapped to buy `asset_out`
     * - `asset_out`: The identifier of the asset to buy
     * - `amount_out`: The amount of `asset_out` to buy
     * - `max_amount_in`: The max amount of `asset_in` to spend on the buy.
     * - `route`: Series of [`Trade<AssetId>`] to be executed. A [`Trade<AssetId>`] specifies the asset pair (`asset_in`, `asset_out`) and the AMM (`pool`) in which the trade is executed.
     * 
     * Emits `RouteExecuted` when successful.
     */
    v160: new CallType(
        'Router.buy',
        sts.struct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountOut: sts.bigint(),
            maxAmountIn: sts.bigint(),
            route: sts.array(() => v160.Trade),
        })
    ),
}
