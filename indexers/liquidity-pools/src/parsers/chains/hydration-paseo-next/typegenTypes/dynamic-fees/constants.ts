import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const assetFeeParameters =  {
    v324: new ConstantType(
        'DynamicFees.AssetFeeParameters',
        v324.FeeParams
    ),
}

export const protocolFeeParameters =  {
    v324: new ConstantType(
        'DynamicFees.ProtocolFeeParameters',
        v324.FeeParams
    ),
}
