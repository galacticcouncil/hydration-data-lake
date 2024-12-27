import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v160 from '../v160'

export const schedule =  {
    name: 'DCA.schedule',
    /**
     * Creates a new DCA (Dollar-Cost Averaging) schedule and plans the next execution
     * for the specified block.
     * 
     * If the block is not specified, the execution is planned for the next block.
     * If the given block is full, the execution will be planned in the subsequent block.
     * 
     * Once the schedule is created, the specified `total_amount` will be reserved for DCA.
     * The reservation currency will be the `amount_in` currency of the order.
     * 
     * Trades are executed as long as there is budget remaining
     * from the initial `total_amount` allocation.
     * 
     * If a trade fails due to slippage limit or price stability errors, it will be retried.
     * If the number of retries reaches the maximum allowed,
     * the schedule will be terminated permanently.
     * In the case of a successful trade, the retry counter is reset.
     * 
     * Parameters:
     * - `origin`: schedule owner
     * - `schedule`: schedule details
     * - `start_execution_block`: start execution block for the schedule
     * 
     * Emits `Scheduled` and `ExecutionPlanned` event when successful.
     * 
     */
    v160: new CallType(
        'DCA.schedule',
        sts.struct({
            schedule: v160.Schedule,
            startExecutionBlock: sts.option(() => sts.number()),
        })
    ),
}

export const terminate =  {
    name: 'DCA.terminate',
    /**
     * Terminates a DCA schedule and remove it completely from the chain.
     * 
     * This can be called by both schedule owner or the configured `T::TechnicalOrigin`
     * 
     * Parameters:
     * - `origin`: schedule owner
     * - `schedule_id`: schedule id
     * - `next_execution_block`: block number where the schedule is planned.
     * 
     * Emits `Terminated` event when successful.
     * 
     */
    v160: new CallType(
        'DCA.terminate',
        sts.struct({
            scheduleId: sts.number(),
            nextExecutionBlock: sts.option(() => sts.number()),
        })
    ),
}
