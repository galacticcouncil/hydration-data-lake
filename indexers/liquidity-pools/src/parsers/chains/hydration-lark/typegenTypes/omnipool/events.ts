import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const tokenAdded =  {
    name: 'Omnipool.TokenAdded',
    /**
     * An asset was added to Omnipool
     */
    v405: new EventType(
        'Omnipool.TokenAdded',
        sts.struct({
            assetId: sts.number(),
            initialAmount: sts.bigint(),
            initialPrice: v405.FixedU128,
        })
    ),
}

export const tokenRemoved =  {
    name: 'Omnipool.TokenRemoved',
    /**
     * An asset was removed from Omnipool
     */
    v405: new EventType(
        'Omnipool.TokenRemoved',
        sts.struct({
            assetId: sts.number(),
            amount: sts.bigint(),
            hubWithdrawn: sts.bigint(),
        })
    ),
}

export const liquidityAdded =  {
    name: 'Omnipool.LiquidityAdded',
    /**
     * Liquidity of an asset was added to Omnipool.
     */
    v405: new EventType(
        'Omnipool.LiquidityAdded',
        sts.struct({
            who: v405.AccountId32,
            assetId: sts.number(),
            amount: sts.bigint(),
            positionId: sts.bigint(),
        })
    ),
}

export const liquidityRemoved =  {
    name: 'Omnipool.LiquidityRemoved',
    /**
     * Liquidity of an asset was removed from Omnipool.
     */
    v405: new EventType(
        'Omnipool.LiquidityRemoved',
        sts.struct({
            who: v405.AccountId32,
            positionId: sts.bigint(),
            assetId: sts.number(),
            sharesRemoved: sts.bigint(),
            fee: v405.FixedU128,
        })
    ),
}

export const protocolLiquidityRemoved =  {
    name: 'Omnipool.ProtocolLiquidityRemoved',
    /**
     * PRotocol Liquidity was removed from Omnipool.
     */
    v405: new EventType(
        'Omnipool.ProtocolLiquidityRemoved',
        sts.struct({
            who: v405.AccountId32,
            assetId: sts.number(),
            amount: sts.bigint(),
            hubAmount: sts.bigint(),
            sharesRemoved: sts.bigint(),
        })
    ),
}

export const sellExecuted =  {
    name: 'Omnipool.SellExecuted',
    /**
     * Sell trade executed.
     * Deprecated. Replaced by pallet_broadcast::Swapped
     */
    v405: new EventType(
        'Omnipool.SellExecuted',
        sts.struct({
            who: v405.AccountId32,
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
    v405: new EventType(
        'Omnipool.BuyExecuted',
        sts.struct({
            who: v405.AccountId32,
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

export const positionCreated =  {
    name: 'Omnipool.PositionCreated',
    /**
     * LP Position was created and NFT instance minted.
     */
    v405: new EventType(
        'Omnipool.PositionCreated',
        sts.struct({
            positionId: sts.bigint(),
            owner: v405.AccountId32,
            asset: sts.number(),
            amount: sts.bigint(),
            shares: sts.bigint(),
            price: v405.FixedU128,
        })
    ),
}

export const positionDestroyed =  {
    name: 'Omnipool.PositionDestroyed',
    /**
     * LP Position was destroyed and NFT instance burned.
     */
    v405: new EventType(
        'Omnipool.PositionDestroyed',
        sts.struct({
            positionId: sts.bigint(),
            owner: v405.AccountId32,
        })
    ),
}

export const positionUpdated =  {
    name: 'Omnipool.PositionUpdated',
    /**
     * LP Position was updated.
     */
    v405: new EventType(
        'Omnipool.PositionUpdated',
        sts.struct({
            positionId: sts.bigint(),
            owner: v405.AccountId32,
            asset: sts.number(),
            amount: sts.bigint(),
            shares: sts.bigint(),
            price: v405.FixedU128,
        })
    ),
}

export const tradableStateUpdated =  {
    name: 'Omnipool.TradableStateUpdated',
    /**
     * Asset's tradable state has been updated.
     */
    v405: new EventType(
        'Omnipool.TradableStateUpdated',
        sts.struct({
            assetId: sts.number(),
            state: v405.Tradability,
        })
    ),
}

export const assetRefunded =  {
    name: 'Omnipool.AssetRefunded',
    /**
     * Amount has been refunded for asset which has not been accepted to add to omnipool.
     */
    v405: new EventType(
        'Omnipool.AssetRefunded',
        sts.struct({
            assetId: sts.number(),
            amount: sts.bigint(),
            recipient: v405.AccountId32,
        })
    ),
}

export const assetWeightCapUpdated =  {
    name: 'Omnipool.AssetWeightCapUpdated',
    /**
     * Asset's weight cap has been updated.
     */
    v405: new EventType(
        'Omnipool.AssetWeightCapUpdated',
        sts.struct({
            assetId: sts.number(),
            cap: v405.Permill,
        })
    ),
}

export const slipFeeSet =  {
    name: 'Omnipool.SlipFeeSet',
    /**
     * Slip fee configuration was updated.
     */
    v405: new EventType(
        'Omnipool.SlipFeeSet',
        sts.struct({
            slipFee: sts.option(() => v405.SlipFeeConfig),
        })
    ),
}
