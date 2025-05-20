import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v170 from '../v170'

export const assetFeeParameters =  {
    v170: new ConstantType(
        'DynamicFees.AssetFeeParameters',
        v170.FeeParams
    ),
}

export const protocolFeeParameters =  {
    v170: new ConstantType(
        'DynamicFees.ProtocolFeeParameters',
        v170.FeeParams
    ),
}
