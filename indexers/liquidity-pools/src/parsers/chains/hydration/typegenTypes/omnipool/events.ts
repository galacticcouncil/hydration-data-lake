import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v115 from '../v115'
import * as v148 from '../v148'
import * as v170 from '../v170'
import * as v185 from '../v185'
import * as v201 from '../v201'

export const tokenAdded =  {
    name: 'Omnipool.TokenAdded',
    /**
     * An asset was added to Omnipool
     */
    v115: new EventType(
        'Omnipool.TokenAdded',
        sts.struct({
            assetId: sts.number(),
            initialAmount: sts.bigint(),
            initialPrice: v115.FixedU128,
        })
    ),
}

export const liquidityAdded =  {
    name: 'Omnipool.LiquidityAdded',
    /**
     * Liquidity of an asset was added to Omnipool.
     */
    v115: new EventType(
        'Omnipool.LiquidityAdded',
        sts.struct({
            who: v115.AccountId32,
            assetId: sts.number(),
            amount: sts.bigint(),
            positionId: sts.bigint(),
        })
    ),
}

export const liquidityRemoved =  {
    name: 'Omnipool.LiquidityRemoved',
    /**
     * Liquidity of an asset was removed to Omnipool.
     */
    v115: new EventType(
        'Omnipool.LiquidityRemoved',
        sts.struct({
            who: v115.AccountId32,
            positionId: sts.bigint(),
            assetId: sts.number(),
            sharesRemoved: sts.bigint(),
        })
    ),
    /**
     * Liquidity of an asset was removed to Omnipool.
     */
    v148: new EventType(
        'Omnipool.LiquidityRemoved',
        sts.struct({
            who: v148.AccountId32,
            positionId: sts.bigint(),
            assetId: sts.number(),
            sharesRemoved: sts.bigint(),
            fee: v148.FixedU128,
        })
    ),
}

export const sellExecuted =  {
    name: 'Omnipool.SellExecuted',
    /**
     * Sell trade executed.
     */
    v115: new EventType(
        'Omnipool.SellExecuted',
        sts.struct({
            who: v115.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
        })
    ),
    /**
     * Sell trade executed.
     */
    v170: new EventType(
        'Omnipool.SellExecuted',
        sts.struct({
            who: v170.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            assetFeeAmount: sts.bigint(),
            protocolFeeAmount: sts.bigint(),
        })
    ),
    /**
     * Sell trade executed.
     */
    v201: new EventType(
        'Omnipool.SellExecuted',
        sts.struct({
            who: v201.AccountId32,
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
     */
    v115: new EventType(
        'Omnipool.BuyExecuted',
        sts.struct({
            who: v115.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
        })
    ),
    /**
     * Buy trade executed.
     */
    v170: new EventType(
        'Omnipool.BuyExecuted',
        sts.struct({
            who: v170.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            assetFeeAmount: sts.bigint(),
            protocolFeeAmount: sts.bigint(),
        })
    ),
    /**
     * Buy trade executed.
     */
    v201: new EventType(
        'Omnipool.BuyExecuted',
        sts.struct({
            who: v201.AccountId32,
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
    v115: new EventType(
        'Omnipool.PositionCreated',
        sts.struct({
            positionId: sts.bigint(),
            owner: v115.AccountId32,
            asset: sts.number(),
            amount: sts.bigint(),
            shares: sts.bigint(),
            price: v115.FixedU128,
        })
    ),
}

export const positionDestroyed =  {
    name: 'Omnipool.PositionDestroyed',
    /**
     * LP Position was destroyed and NFT instance burned.
     */
    v115: new EventType(
        'Omnipool.PositionDestroyed',
        sts.struct({
            positionId: sts.bigint(),
            owner: v115.AccountId32,
        })
    ),
}

export const positionUpdated =  {
    name: 'Omnipool.PositionUpdated',
    /**
     * LP Position was created and NFT instance minted.
     */
    v115: new EventType(
        'Omnipool.PositionUpdated',
        sts.struct({
            positionId: sts.bigint(),
            owner: v115.AccountId32,
            asset: sts.number(),
            amount: sts.bigint(),
            shares: sts.bigint(),
            price: v115.FixedU128,
        })
    ),
}

export const tradableStateUpdated =  {
    name: 'Omnipool.TradableStateUpdated',
    /**
     * Aseet's tradable state has been updated.
     */
    v115: new EventType(
        'Omnipool.TradableStateUpdated',
        sts.struct({
            assetId: sts.number(),
            state: v115.Tradability,
        })
    ),
}

export const assetRefunded =  {
    name: 'Omnipool.AssetRefunded',
    /**
     * Amount has been refunded for asset which has not been accepted to add to omnipool.
     */
    v115: new EventType(
        'Omnipool.AssetRefunded',
        sts.struct({
            assetId: sts.number(),
            amount: sts.bigint(),
            recipient: v115.AccountId32,
        })
    ),
}

export const assetWeightCapUpdated =  {
    name: 'Omnipool.AssetWeightCapUpdated',
    /**
     * Asset's weight cap has been updated.
     */
    v115: new EventType(
        'Omnipool.AssetWeightCapUpdated',
        sts.struct({
            assetId: sts.number(),
            cap: v115.Permill,
        })
    ),
}

export const tvlCapUpdated =  {
    name: 'Omnipool.TVLCapUpdated',
    /**
     * TVL cap has been updated.
     */
    v125: new EventType(
        'Omnipool.TVLCapUpdated',
        sts.struct({
            cap: sts.bigint(),
        })
    ),
}

export const tokenRemoved =  {
    name: 'Omnipool.TokenRemoved',
    /**
     * An asset was removed from Omnipool
     */
    v185: new EventType(
        'Omnipool.TokenRemoved',
        sts.struct({
            assetId: sts.number(),
            amount: sts.bigint(),
            hubWithdrawn: sts.bigint(),
        })
    ),
}

export const protocolLiquidityRemoved =  {
    name: 'Omnipool.ProtocolLiquidityRemoved',
    /**
     * Liquidity of an asset was removed to Omnipool.
     */
    v185: new EventType(
        'Omnipool.ProtocolLiquidityRemoved',
        sts.struct({
            who: v185.AccountId32,
            assetId: sts.number(),
            amount: sts.bigint(),
            hubAmount: sts.bigint(),
            sharesRemoved: sts.bigint(),
        })
    ),
}
