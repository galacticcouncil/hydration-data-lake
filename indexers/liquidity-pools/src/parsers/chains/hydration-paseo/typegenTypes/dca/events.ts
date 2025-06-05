import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v287 from '../v287'
import * as v295 from '../v295'

export const executionStarted =  {
    name: 'DCA.ExecutionStarted',
    /**
     * The DCA execution is started
     */
    v287: new EventType(
        'DCA.ExecutionStarted',
        sts.struct({
            id: sts.number(),
            block: sts.number(),
        })
    ),
}

export const scheduled =  {
    name: 'DCA.Scheduled',
    /**
     * The DCA is scheduled for next execution
     */
    v287: new EventType(
        'DCA.Scheduled',
        sts.struct({
            id: sts.number(),
            who: v287.AccountId32,
            period: sts.number(),
            totalAmount: sts.bigint(),
            order: v287.Order,
        })
    ),
    /**
     * The DCA is scheduled for next execution
     */
    v295: new EventType(
        'DCA.Scheduled',
        sts.struct({
            id: sts.number(),
            who: v295.AccountId32,
            period: sts.number(),
            totalAmount: sts.bigint(),
            order: v295.Order,
        })
    ),
}

export const executionPlanned =  {
    name: 'DCA.ExecutionPlanned',
    /**
     * The DCA is planned for blocknumber
     */
    v287: new EventType(
        'DCA.ExecutionPlanned',
        sts.struct({
            id: sts.number(),
            who: v287.AccountId32,
            block: sts.number(),
        })
    ),
}

export const tradeExecuted =  {
    name: 'DCA.TradeExecuted',
    /**
     * Deprecated. Use pallet_amm::Event::Swapped instead.
     * The DCA trade is successfully executed
     */
    v287: new EventType(
        'DCA.TradeExecuted',
        sts.struct({
            id: sts.number(),
            who: v287.AccountId32,
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
        })
    ),
}

export const tradeFailed =  {
    name: 'DCA.TradeFailed',
    /**
     * The DCA trade execution is failed
     */
    v287: new EventType(
        'DCA.TradeFailed',
        sts.struct({
            id: sts.number(),
            who: v287.AccountId32,
            error: v287.DispatchError,
        })
    ),
}

export const terminated =  {
    name: 'DCA.Terminated',
    /**
     * The DCA is terminated and completely removed from the chain
     */
    v287: new EventType(
        'DCA.Terminated',
        sts.struct({
            id: sts.number(),
            who: v287.AccountId32,
            error: v287.DispatchError,
        })
    ),
}

export const completed =  {
    name: 'DCA.Completed',
    /**
     * The DCA is completed and completely removed from the chain
     */
    v287: new EventType(
        'DCA.Completed',
        sts.struct({
            id: sts.number(),
            who: v287.AccountId32,
        })
    ),
}

export const randomnessGenerationFailed =  {
    name: 'DCA.RandomnessGenerationFailed',
    /**
     * Randomness generation failed possibly coming from missing data about relay chain
     */
    v287: new EventType(
        'DCA.RandomnessGenerationFailed',
        sts.struct({
            block: sts.number(),
            error: v287.DispatchError,
        })
    ),
}
