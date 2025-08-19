import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const tokenAdded =  {
    name: 'Omnipool.TokenAdded',
    /**
     * An asset was added to Omnipool
     */
    v324: new EventType(
        'Omnipool.TokenAdded',
        sts.struct({
            assetId: sts.number(),
            initialAmount: sts.bigint(),
            initialPrice: v324.FixedU128,
        })
    ),
}

export const tokenRemoved =  {
    name: 'Omnipool.TokenRemoved',
    /**
     * An asset was removed from Omnipool
     */
    v324: new EventType(
        'Omnipool.TokenRemoved',
        sts.struct({
            assetId: sts.number(),
            amount: sts.bigint(),
            hubWithdrawn: sts.bigint(),
        })
    ),
}

export const sellExecuted =  {
    name: 'Omnipool.SellExecuted',
    /**
     * Sell trade executed.
     * Deprecated. Replaced by pallet_broadcast::Swapped
     */
    v324: new EventType(
        'Omnipool.SellExecuted',
        sts.struct({
            who: v324.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            hubAmountIn: sts.bigint(),
            hubAmountOut: sts.bigint(),
            assetFeeAmount: sts.bigint(),
            protocolFeeAmount: sts.bigint(),
        })
    ),
}

export const buyExecuted =  {
    name: 'Omnipool.BuyExecuted',
    /**
     * Buy trade executed.
     * Deprecated. Replaced by pallet_broadcast::Swapped
     */
    v324: new EventType(
        'Omnipool.BuyExecuted',
        sts.struct({
            who: v324.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            hubAmountIn: sts.bigint(),
            hubAmountOut: sts.bigint(),
            assetFeeAmount: sts.bigint(),
            protocolFeeAmount: sts.bigint(),
        })
    ),
}
