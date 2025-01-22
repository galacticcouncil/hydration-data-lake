import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const poolCreated =  {
    name: 'XYK.PoolCreated',
    /**
     * Pool was created.
     */
    v257: new EventType(
        'XYK.PoolCreated',
        sts.struct({
            who: v257.AccountId32,
            assetA: sts.number(),
            assetB: sts.number(),
            initialSharesAmount: sts.bigint(),
            shareToken: sts.number(),
            pool: v257.AccountId32,
        })
    ),
}

export const poolDestroyed =  {
    name: 'XYK.PoolDestroyed',
    /**
     * Pool was destroyed.
     */
    v257: new EventType(
        'XYK.PoolDestroyed',
        sts.struct({
            who: v257.AccountId32,
            assetA: sts.number(),
            assetB: sts.number(),
            shareToken: sts.number(),
            pool: v257.AccountId32,
        })
    ),
}

export const sellExecuted =  {
    name: 'XYK.SellExecuted',
    /**
     * Asset sale executed.
     */
    v257: new EventType(
        'XYK.SellExecuted',
        sts.struct({
            who: v257.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amount: sts.bigint(),
            salePrice: sts.bigint(),
            feeAsset: sts.number(),
            feeAmount: sts.bigint(),
            pool: v257.AccountId32,
        })
    ),
}

export const buyExecuted =  {
    name: 'XYK.BuyExecuted',
    /**
     * Asset purchase executed.
     */
    v257: new EventType(
        'XYK.BuyExecuted',
        sts.struct({
            who: v257.AccountId32,
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            buyPrice: sts.bigint(),
            feeAsset: sts.number(),
            feeAmount: sts.bigint(),
            pool: v257.AccountId32,
        })
    ),
}
