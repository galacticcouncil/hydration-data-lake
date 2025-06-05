import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const poolCreated =  {
    name: 'LBP.PoolCreated',
    /**
     * Pool was created by the `CreatePool` origin.
     */
    v287: new EventType(
        'LBP.PoolCreated',
        sts.struct({
            pool: v287.AccountId32,
            data: v287.Pool,
        })
    ),
}

export const poolUpdated =  {
    name: 'LBP.PoolUpdated',
    /**
     * Pool data were updated.
     */
    v287: new EventType(
        'LBP.PoolUpdated',
        sts.struct({
            pool: v287.AccountId32,
            data: v287.Pool,
        })
    ),
}

export const sellExecuted =  {
    name: 'LBP.SellExecuted',
    /**
     * Sale executed.
     * Deprecated. Replaced by pallet_broadcast::Swapped
     */
    v287: new EventType(
        'LBP.SellExecuted',
        sts.struct({
            who: v287.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amount: sts.bigint(),
            salePrice: sts.bigint(),
            feeAsset: sts.number(),
            feeAmount: sts.bigint(),
        })
    ),
}

export const buyExecuted =  {
    name: 'LBP.BuyExecuted',
    /**
     * Purchase executed.
     * Deprecated. Replaced by pallet_broadcast::Swapped
     */
    v287: new EventType(
        'LBP.BuyExecuted',
        sts.struct({
            who: v287.AccountId32,
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            buyPrice: sts.bigint(),
            feeAsset: sts.number(),
            feeAmount: sts.bigint(),
        })
    ),
}
