import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const assetFeeParameters =  {
    v405: new ConstantType(
        'DynamicFees.AssetFeeParameters',
        v405.FeeParams
    ),
}

export const protocolFeeParameters =  {
    v405: new ConstantType(
        'DynamicFees.ProtocolFeeParameters',
        v405.FeeParams
    ),
}
