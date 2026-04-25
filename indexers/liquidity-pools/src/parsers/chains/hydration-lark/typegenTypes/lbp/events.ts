import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const poolCreated =  {
    name: 'LBP.PoolCreated',
    /**
     * Pool was created by the `CreatePool` origin.
     */
    v405: new EventType(
        'LBP.PoolCreated',
        sts.struct({
            pool: v405.AccountId32,
            data: v405.Pool,
        })
    ),
}

export const poolUpdated =  {
    name: 'LBP.PoolUpdated',
    /**
     * Pool data were updated.
     */
    v405: new EventType(
        'LBP.PoolUpdated',
        sts.struct({
            pool: v405.AccountId32,
            data: v405.Pool,
        })
    ),
}

export const sellExecuted =  {
    name: 'LBP.SellExecuted',
    /**
     * Sale executed.
     * Deprecated. Replaced by pallet_broadcast::Swapped
     */
    v405: new EventType(
        'LBP.SellExecuted',
        sts.struct({
            who: v405.AccountId32,
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
    v405: new EventType(
        'LBP.BuyExecuted',
        sts.struct({
            who: v405.AccountId32,
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            buyPrice: sts.bigint(),
            feeAsset: sts.number(),
            feeAmount: sts.bigint(),
        })
    ),
}
