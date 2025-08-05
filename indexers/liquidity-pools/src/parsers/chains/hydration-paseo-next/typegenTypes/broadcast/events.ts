import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

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
    v324: new EventType(
        'Broadcast.Swapped3',
        sts.struct({
            swapper: v324.AccountId32,
            filler: v324.AccountId32,
            fillerType: v324.Filler,
            operation: v324.TradeOperation,
            inputs: sts.array(() => v324.Asset),
            outputs: sts.array(() => v324.Asset),
            fees: sts.array(() => v324.Fee),
            operationStack: sts.array(() => v324.ExecutionType),
        })
    ),
}
