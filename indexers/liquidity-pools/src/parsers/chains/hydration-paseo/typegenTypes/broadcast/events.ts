import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v287 from '../v287'
import * as v308 from '../v308'
import * as v312 from '../v312'

export const swapped =  {
    name: 'Broadcast.Swapped',
    /**
     * Trade executed.
     */
    v287: new EventType(
        'Broadcast.Swapped',
        sts.struct({
            swapper: v287.AccountId32,
            filler: v287.AccountId32,
            fillerType: v287.Filler,
            operation: v287.TradeOperation,
            inputs: sts.array(() => v287.Asset),
            outputs: sts.array(() => v287.Asset),
            fees: sts.array(() => v287.Fee),
            operationStack: sts.array(() => v287.ExecutionType),
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
    v308: new EventType(
        'Broadcast.Swapped2',
        sts.struct({
            swapper: v308.AccountId32,
            filler: v308.AccountId32,
            fillerType: v308.Filler,
            operation: v308.TradeOperation,
            inputs: sts.array(() => v308.Asset),
            outputs: sts.array(() => v308.Asset),
            fees: sts.array(() => v308.Fee),
            operationStack: sts.array(() => v308.ExecutionType),
        })
    ),
}

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
    v312: new EventType(
        'Broadcast.Swapped3',
        sts.struct({
            swapper: v312.AccountId32,
            filler: v312.AccountId32,
            fillerType: v312.Filler,
            operation: v312.TradeOperation,
            inputs: sts.array(() => v312.Asset),
            outputs: sts.array(() => v312.Asset),
            fees: sts.array(() => v312.Fee),
            operationStack: sts.array(() => v312.ExecutionType),
        })
    ),
}
