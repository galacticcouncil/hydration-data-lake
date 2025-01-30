import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'

export const sell =  {
    name: 'Stableswap.sell',
    /**
     * Execute a swap of `asset_in` for `asset_out` by specifying how much to put in.
     * 
     * Parameters:
     * - `origin`: origin of the caller
     * - `pool_id`: Id of a pool
     * - `asset_in`: ID of asset sold to the pool
     * - `asset_out`: ID of asset bought from the pool
     * - `amount_in`: Amount of asset to be sold to the pool
     * - `min_buy_amount`: Minimum amount required to receive
     * 
     * Emits `SellExecuted` event when successful.
     * 
     */
    v183: new CallType(
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
     * Execute a swap of `asset_in` for `asset_out` by specifying how much to get out.
     * 
     * Parameters:
     * - `origin`:
     * - `pool_id`: Id of a pool
     * - `asset_out`: ID of asset bought from the pool
     * - `asset_in`: ID of asset sold to the pool
     * - `amount_out`: Amount of asset to receive from the pool
     * - `max_sell_amount`: Maximum amount allowed to be sold
     * 
     * Emits `BuyExecuted` event when successful.
     * 
     */
    v183: new CallType(
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
