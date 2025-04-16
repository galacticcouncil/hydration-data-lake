import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v282 from '../v282'
import * as v305 from '../v305'

export const swapped =  {
    name: 'Broadcast.Swapped',
    /**
     * Trade executed.
     */
    v282: new EventType(
        'Broadcast.Swapped',
        sts.struct({
            swapper: v282.AccountId32,
            filler: v282.AccountId32,
            fillerType: v282.Filler,
            operation: v282.TradeOperation,
            inputs: sts.array(() => v282.Asset),
            outputs: sts.array(() => v282.Asset),
            fees: sts.array(() => v282.Fee),
            operationStack: sts.array(() => v282.ExecutionType),
        })
    ),
}

export const swapped2 =  {
    name: 'Broadcast.Swapped2',
    /**
     * Trade executed.
     * 
     * Swapped2 is a fixed and renamed version of original Swapped,
     * as Swapped contained wrong input/output amounts for XYK buy trade
     */
    v305: new EventType(
        'Broadcast.Swapped2',
        sts.struct({
            swapper: v305.AccountId32,
            filler: v305.AccountId32,
            fillerType: v305.Filler,
            operation: v305.TradeOperation,
            inputs: sts.array(() => v305.Asset),
            outputs: sts.array(() => v305.Asset),
            fees: sts.array(() => v305.Fee),
            operationStack: sts.array(() => v305.ExecutionType),
        })
    ),
}
