import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const setValidationData =  {
    name: 'ParachainSystem.set_validation_data',
    /**
     * See [`Pallet::set_validation_data`].
     */
    v257: new CallType(
        'ParachainSystem.set_validation_data',
        sts.struct({
            data: v257.ParachainInherentData,
        })
    ),
}
