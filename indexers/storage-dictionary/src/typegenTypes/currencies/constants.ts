import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v295 from '../v295'

export const getNativeCurrencyId =  {
    v108: new ConstantType(
        'Currencies.GetNativeCurrencyId',
        sts.number()
    ),
}

export const reserveAccount =  {
    v295: new ConstantType(
        'Currencies.ReserveAccount',
        v295.AccountId32
    ),
}
