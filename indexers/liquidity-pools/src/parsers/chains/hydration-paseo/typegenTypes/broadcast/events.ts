import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v282 from '../v282'

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
