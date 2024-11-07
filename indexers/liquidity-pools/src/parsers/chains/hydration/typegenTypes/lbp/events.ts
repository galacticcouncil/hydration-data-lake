import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v176 from '../v176'

export const poolCreated =  {
    name: 'LBP.PoolCreated',
    /**
     * Pool was created by the `CreatePool` origin.
     */
    v176: new EventType(
        'LBP.PoolCreated',
        sts.struct({
            pool: v176.AccountId32,
            data: v176.Pool,
        })
    ),
}

export const poolUpdated =  {
    name: 'LBP.PoolUpdated',
    /**
     * Pool data were updated.
     */
    v176: new EventType(
        'LBP.PoolUpdated',
        sts.struct({
            pool: v176.AccountId32,
            data: v176.Pool,
        })
    ),
}

export const sellExecuted =  {
    name: 'LBP.SellExecuted',
    /**
     * Sale executed.
     */
    v176: new EventType(
        'LBP.SellExecuted',
        sts.struct({
            who: v176.AccountId32,
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
     */
    v176: new EventType(
        'LBP.BuyExecuted',
        sts.struct({
            who: v176.AccountId32,
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            buyPrice: sts.bigint(),
            feeAsset: sts.number(),
            feeAmount: sts.bigint(),
        })
    ),
}
