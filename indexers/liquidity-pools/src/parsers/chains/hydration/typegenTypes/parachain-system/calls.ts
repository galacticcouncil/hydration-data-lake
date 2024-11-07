import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v100 from '../v100'

export const setValidationData =  {
    name: 'ParachainSystem.set_validation_data',
    /**
     * Set the current validation data.
     * 
     * This should be invoked exactly once per block. It will panic at the finalization
     * phase if the call was not invoked.
     * 
     * The dispatch origin for this call must be `Inherent`
     * 
     * As a side effect, this function upgrades the current validation function
     * if the appropriate time has come.
     */
    v100: new CallType(
        'ParachainSystem.set_validation_data',
        sts.struct({
            data: v100.ParachainInherentData,
        })
    ),
}
