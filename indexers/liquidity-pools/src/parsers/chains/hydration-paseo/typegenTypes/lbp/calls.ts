import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const createPool =  {
    name: 'LBP.create_pool',
    /**
     * See [`Pallet::create_pool`].
     */
    v257: new CallType(
        'LBP.create_pool',
        sts.struct({
            poolOwner: v257.AccountId32,
            assetA: sts.number(),
            assetAAmount: sts.bigint(),
            assetB: sts.number(),
            assetBAmount: sts.bigint(),
            initialWeight: sts.number(),
            finalWeight: sts.number(),
            weightCurve: v257.WeightCurveType,
            fee: sts.tuple(() => [sts.number(), sts.number()]),
            feeCollector: v257.AccountId32,
            repayTarget: sts.bigint(),
        })
    ),
}

export const sell =  {
    name: 'LBP.sell',
    /**
     * See [`Pallet::sell`].
     */
    v257: new CallType(
        'LBP.sell',
        sts.struct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amount: sts.bigint(),
            maxLimit: sts.bigint(),
        })
    ),
}

export const buy =  {
    name: 'LBP.buy',
    /**
     * See [`Pallet::buy`].
     */
    v257: new CallType(
        'LBP.buy',
        sts.struct({
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            maxLimit: sts.bigint(),
        })
    ),
}
