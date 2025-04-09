import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const nativeAssetId =  {
    /**
     *  Native Asset Id
     */
    v108: new ConstantType(
        'AssetRegistry.NativeAssetId',
        sts.number()
    ),
}

export const sequentialIdStartAt =  {
    v138: new ConstantType(
        'AssetRegistry.SequentialIdStartAt',
        sts.number()
    ),
}

export const stringLimit =  {
    /**
     *  The maximum length of a name or symbol stored on-chain.
     */
    v222: new ConstantType(
        'AssetRegistry.StringLimit',
        sts.number()
    ),
}

export const minStringLimit =  {
    /**
     *  The min length of a name or symbol stored on-chain.
     */
    v222: new ConstantType(
        'AssetRegistry.MinStringLimit',
        sts.number()
    ),
}

export const regExternalWeightMultiplier =  {
    /**
     *  Weight multiplier for `register_external` extrinsic
     */
    v222: new ConstantType(
        'AssetRegistry.RegExternalWeightMultiplier',
        sts.bigint()
    ),
}
