import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v287 from '../v287'
import * as v299 from '../v299'

export const poolCreated =  {
    name: 'Stableswap.PoolCreated',
    /**
     * A pool was created.
     */
    v287: new EventType(
        'Stableswap.PoolCreated',
        sts.struct({
            poolId: sts.number(),
            assets: sts.array(() => sts.number()),
            amplification: v287.NonZeroU16,
            fee: v287.Permill,
        })
    ),
    /**
     * A pool was created.
     */
    v299: new EventType(
        'Stableswap.PoolCreated',
        sts.struct({
            poolId: sts.number(),
            assets: sts.array(() => sts.number()),
            amplification: v299.NonZeroU16,
            fee: v299.Permill,
            peg: sts.option(() => v299.PoolPegInfo),
        })
    ),
}

export const liquidityAdded =  {
    name: 'Stableswap.LiquidityAdded',
    /**
     * Liquidity of an asset was added to a pool.
     */
    v287: new EventType(
        'Stableswap.LiquidityAdded',
        sts.struct({
            poolId: sts.number(),
            who: v287.AccountId32,
            shares: sts.bigint(),
            assets: sts.array(() => v287.AssetAmount),
        })
    ),
}

export const liquidityRemoved =  {
    name: 'Stableswap.LiquidityRemoved',
    /**
     * Liquidity removed.
     */
    v287: new EventType(
        'Stableswap.LiquidityRemoved',
        sts.struct({
            poolId: sts.number(),
            who: v287.AccountId32,
            shares: sts.bigint(),
            amounts: sts.array(() => v287.AssetAmount),
            fee: sts.bigint(),
        })
    ),
}

export const sellExecuted =  {
    name: 'Stableswap.SellExecuted',
    /**
     * Sell trade executed. Trade fee paid in asset leaving the pool (already subtracted from amount_out).
     * Deprecated. Replaced by pallet_broadcast::Swapped
     */
    v287: new EventType(
        'Stableswap.SellExecuted',
        sts.struct({
            who: v287.AccountId32,
            poolId: sts.number(),
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            fee: sts.bigint(),
        })
    ),
}

export const buyExecuted =  {
    name: 'Stableswap.BuyExecuted',
    /**
     * Buy trade executed. Trade fee paid in asset entering the pool (already included in amount_in).
     * Deprecated. Replaced by pallet_broadcast::Swapped
     */
    v287: new EventType(
        'Stableswap.BuyExecuted',
        sts.struct({
            who: v287.AccountId32,
            poolId: sts.number(),
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            fee: sts.bigint(),
        })
    ),
}
