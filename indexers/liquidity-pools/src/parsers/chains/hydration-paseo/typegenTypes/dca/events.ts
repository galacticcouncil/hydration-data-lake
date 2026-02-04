import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v347 from '../v347'
import * as v390 from '../v390'

export const executionStarted =  {
    name: 'DCA.ExecutionStarted',
    /**
     * The DCA execution is started
     */
    v347: new EventType(
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
    v347: new EventType(
        'DCA.Scheduled',
        sts.struct({
            id: sts.number(),
            who: v347.AccountId32,
            period: sts.number(),
            totalAmount: sts.bigint(),
            order: v347.Order,
        })
    ),
}

export const executionPlanned =  {
    name: 'DCA.ExecutionPlanned',
    /**
     * The DCA is planned for blocknumber
     */
    v347: new EventType(
        'DCA.ExecutionPlanned',
        sts.struct({
            id: sts.number(),
            who: v347.AccountId32,
            block: sts.number(),
        })
    ),
}

export const tradeExecuted =  {
    name: 'DCA.TradeExecuted',
    /**
     * The DCA trade is successfully executed
     */
    v347: new EventType(
        'DCA.TradeExecuted',
        sts.struct({
            id: sts.number(),
            who: v347.AccountId32,
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
    v347: new EventType(
        'DCA.TradeFailed',
        sts.struct({
            id: sts.number(),
            who: v347.AccountId32,
            error: v347.DispatchError,
        })
    ),
    /**
     * The DCA trade execution is failed
     */
    v390: new EventType(
        'DCA.TradeFailed',
        sts.struct({
            id: sts.number(),
            who: v390.AccountId32,
            error: v390.DispatchError,
        })
    ),
}

export const terminated =  {
    name: 'DCA.Terminated',
    /**
     * The DCA is terminated and completely removed from the chain
     */
    v347: new EventType(
        'DCA.Terminated',
        sts.struct({
            id: sts.number(),
            who: v347.AccountId32,
            error: v347.DispatchError,
        })
    ),
    /**
     * The DCA is terminated and completely removed from the chain
     */
    v390: new EventType(
        'DCA.Terminated',
        sts.struct({
            id: sts.number(),
            who: v390.AccountId32,
            error: v390.DispatchError,
        })
    ),
}

export const completed =  {
    name: 'DCA.Completed',
    /**
     * The DCA is completed and completely removed from the chain
     */
    v347: new EventType(
        'DCA.Completed',
        sts.struct({
            id: sts.number(),
            who: v347.AccountId32,
        })
    ),
}

export const randomnessGenerationFailed =  {
    name: 'DCA.RandomnessGenerationFailed',
    /**
     * Randomness generation failed possibly coming from missing data about relay chain
     */
    v347: new EventType(
        'DCA.RandomnessGenerationFailed',
        sts.struct({
            block: sts.number(),
            error: v347.DispatchError,
        })
    ),
    /**
     * Randomness generation failed possibly coming from missing data about relay chain
     */
    v390: new EventType(
        'DCA.RandomnessGenerationFailed',
        sts.struct({
            block: sts.number(),
            error: v390.DispatchError,
        })
    ),
}

export const reserveUnlocked =  {
    name: 'DCA.ReserveUnlocked',
    /**
     * DCA reserve for the given asset have been unlocked for a user
     */
    v347: new EventType(
        'DCA.ReserveUnlocked',
        sts.struct({
            who: v347.AccountId32,
            assetId: sts.number(),
        })
    ),
}
