import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v264 from '../v264'

export const selfParaId =  {
    /**
     *  Returns the parachain ID we are running with.
     */
    v264: new ConstantType(
        'ParachainSystem.SelfParaId',
        v264.Id
    ),
}
