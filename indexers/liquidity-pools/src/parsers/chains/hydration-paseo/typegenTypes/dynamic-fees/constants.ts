import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const assetFeeParameters =  {
    v287: new ConstantType(
        'DynamicFees.AssetFeeParameters',
        v287.FeeParams
    ),
}

export const protocolFeeParameters =  {
    v287: new ConstantType(
        'DynamicFees.ProtocolFeeParameters',
        v287.FeeParams
    ),
}
