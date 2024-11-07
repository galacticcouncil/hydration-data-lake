import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'

export const createPool =  {
    name: 'XYK.create_pool',
    /**
     * See [`Pallet::create_pool`].
     */
    v257: new CallType(
        'XYK.create_pool',
        sts.struct({
            assetA: sts.number(),
            amountA: sts.bigint(),
            assetB: sts.number(),
            amountB: sts.bigint(),
        })
    ),
}
