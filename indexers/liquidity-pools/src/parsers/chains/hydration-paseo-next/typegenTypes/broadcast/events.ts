import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

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
    v347: new EventType(
        'Broadcast.Swapped3',
        sts.struct({
            swapper: v347.AccountId32,
            filler: v347.AccountId32,
            fillerType: v347.Filler,
            operation: v347.TradeOperation,
            inputs: sts.array(() => v347.Asset),
            outputs: sts.array(() => v347.Asset),
            fees: sts.array(() => v347.Fee),
            operationStack: sts.array(() => v347.ExecutionType),
        })
    ),
}
