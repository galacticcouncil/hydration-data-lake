import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v176 from '../v176'

export const palletId =  {
    /**
     *  The pallet id, used for deriving its sovereign account ID.
     */
    v176: new ConstantType(
        'Bonds.PalletId',
        v176.PalletId
    ),
}

export const protocolFee =  {
    /**
     *  Protocol fee.
     */
    v176: new ConstantType(
        'Bonds.ProtocolFee',
        v176.Permill
    ),
}

export const feeReceiver =  {
    /**
     *  Protocol fee receiver.
     */
    v176: new ConstantType(
        'Bonds.FeeReceiver',
        v176.AccountId32
    ),
}
