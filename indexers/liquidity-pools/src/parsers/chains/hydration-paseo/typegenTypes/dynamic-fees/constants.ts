import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const assetFeeParameters =  {
    v276: new ConstantType(
        'DynamicFees.AssetFeeParameters',
        v276.FeeParams
    ),
}

export const protocolFeeParameters =  {
    v276: new ConstantType(
        'DynamicFees.ProtocolFeeParameters',
        v276.FeeParams
    ),
}
