import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v295 from '../v295'

export const maxUniqueEntries =  {
    /**
     *  Maximum number of unique oracle entries expected in one block.
     */
    v138: new ConstantType(
        'EmaOracle.MaxUniqueEntries',
        sts.number()
    ),
}

export const maxAllowedPriceDifference =  {
    /**
     *  Maximum allowed percentage difference for bifrost oracle price update
     */
    v295: new ConstantType(
        'EmaOracle.MaxAllowedPriceDifference',
        v295.Permill
    ),
}
