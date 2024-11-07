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
