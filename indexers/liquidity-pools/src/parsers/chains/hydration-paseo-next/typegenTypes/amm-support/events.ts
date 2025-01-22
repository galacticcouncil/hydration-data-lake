import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v278 from '../v278'

export const swapped =  {
    name: 'AmmSupport.Swapped',
    /**
     * Trade executed.
     */
    v278: new EventType(
        'AmmSupport.Swapped',
        sts.struct({
            swapper: v278.AccountId32,
            filler: v278.AccountId32,
            fillerType: v278.Filler,
            operation: v278.TradeOperation,
            inputs: sts.array(() => v278.Asset),
            outputs: sts.array(() => v278.Asset),
            fees: sts.array(() => v278.Fee),
            operationStack: sts.array(() => v278.ExecutionType),
        })
    ),
}
