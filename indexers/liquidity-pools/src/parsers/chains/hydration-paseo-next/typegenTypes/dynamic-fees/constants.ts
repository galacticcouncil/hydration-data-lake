import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const assetFeeParameters =  {
    v347: new ConstantType(
        'DynamicFees.AssetFeeParameters',
        v347.FeeParams
    ),
}

export const protocolFeeParameters =  {
    v347: new ConstantType(
        'DynamicFees.ProtocolFeeParameters',
        v347.FeeParams
    ),
}
