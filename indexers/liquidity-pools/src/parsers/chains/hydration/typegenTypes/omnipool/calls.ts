import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'

export const sell =  {
    name: 'Omnipool.sell',
    /**
     * Execute a swap of `asset_in` for `asset_out`.
     * 
     * Price is determined by the Omnipool.
     * 
     * Hub asset is traded separately.
     * 
     * Asset's tradable states must contain SELL flag for asset_in and BUY flag for asset_out, otherwise `NotAllowed` error is returned.
     * 
     * Parameters:
     * - `asset_in`: ID of asset sold to the pool
     * - `asset_out`: ID of asset bought from the pool
     * - `amount`: Amount of asset sold
     * - `min_buy_amount`: Minimum amount required to receive
     * 
     * Emits `SellExecuted` event when successful.
     * 
     */
    v115: new CallType(
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
     * Execute a swap of `asset_out` for `asset_in`.
     * 
     * Price is determined by the Omnipool.
     * 
     * Hub asset is traded separately.
     * 
     * Asset's tradable states must contain SELL flag for asset_in and BUY flag for asset_out, otherwise `NotAllowed` error is returned.
     * 
     * Parameters:
     * - `asset_in`: ID of asset sold to the pool
     * - `asset_out`: ID of asset bought from the pool
     * - `amount`: Amount of asset sold
     * - `max_sell_amount`: Maximum amount to be sold.
     * 
     * Emits `BuyExecuted` event when successful.
     * 
     */
    v115: new CallType(
        'Omnipool.buy',
        sts.struct({
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            maxSellAmount: sts.bigint(),
        })
    ),
}
