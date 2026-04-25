import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const swapped3 =  {
    name: 'Broadcast.Swapped3',
    /**
     * Trade executed.
     * 
     * Swapped3 is a fixed and renamed version of original Swapped,
     * as Swapped contained wrong input/output amounts for XYK buy trade
     * 
     * Swapped3 is a fixed and renamed version of original Swapped3,
     * as Swapped contained wrong filler account on AAVE trades
     * 
     */
    v405: new EventType(
        'Broadcast.Swapped3',
        sts.struct({
            swapper: v405.AccountId32,
            filler: v405.AccountId32,
            fillerType: v405.Filler,
            operation: v405.TradeOperation,
            inputs: sts.array(() => v405.Asset),
            outputs: sts.array(() => v405.Asset),
            fees: sts.array(() => v405.Fee),
            operationStack: sts.array(() => v405.ExecutionType),
        })
    ),
}
