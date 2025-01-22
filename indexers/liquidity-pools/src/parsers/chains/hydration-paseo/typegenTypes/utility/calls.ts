import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v257 from '../v257'
import * as v264 from '../v264'

export const batch =  {
    name: 'Utility.batch',
    /**
     * See [`Pallet::batch`].
     */
    v257: new CallType(
        'Utility.batch',
        sts.struct({
            calls: sts.array(() => v257.Call),
        })
    ),
    /**
     * Send a batch of dispatch calls.
     * 
     * May be called from any origin except `None`.
     * 
     * - `calls`: The calls to be dispatched from the same origin. The number of call must not
     *   exceed the constant: `batched_calls_limit` (available in constant metadata).
     * 
     * If origin is root then the calls are dispatched without checking origin filter. (This
     * includes bypassing `frame_system::Config::BaseCallFilter`).
     * 
     * ## Complexity
     * - O(C) where C is the number of calls to be batched.
     * 
     * This will return `Ok` in all circumstances. To determine the success of the batch, an
     * event is deposited. If a call failed and the batch was interrupted, then the
     * `BatchInterrupted` event is deposited, along with the number of successful calls made
     * and the error of the failed call. If all were successful, then the `BatchCompleted`
     * event is deposited.
     */
    v264: new CallType(
        'Utility.batch',
        sts.struct({
            calls: sts.array(() => v264.Call),
        })
    ),
}

export const asDerivative =  {
    name: 'Utility.as_derivative',
    /**
     * See [`Pallet::as_derivative`].
     */
    v257: new CallType(
        'Utility.as_derivative',
        sts.struct({
            index: sts.number(),
            call: v257.Call,
        })
    ),
    /**
     * Send a call through an indexed pseudonym of the sender.
     * 
     * Filter from origin are passed along. The call will be dispatched with an origin which
     * use the same filter as the origin of this call.
     * 
     * NOTE: If you need to ensure that any account-based filtering is not honored (i.e.
     * because you expect `proxy` to have been used prior in the call stack and you do not want
     * the call restrictions to apply to any sub-accounts), then use `as_multi_threshold_1`
     * in the Multisig pallet instead.
     * 
     * NOTE: Prior to version *12, this was called `as_limited_sub`.
     * 
     * The dispatch origin for this call must be _Signed_.
     */
    v264: new CallType(
        'Utility.as_derivative',
        sts.struct({
            index: sts.number(),
            call: v264.Call,
        })
    ),
}

export const batchAll =  {
    name: 'Utility.batch_all',
    /**
     * See [`Pallet::batch_all`].
     */
    v257: new CallType(
        'Utility.batch_all',
        sts.struct({
            calls: sts.array(() => v257.Call),
        })
    ),
    /**
     * Send a batch of dispatch calls and atomically execute them.
     * The whole transaction will rollback and fail if any of the calls failed.
     * 
     * May be called from any origin except `None`.
     * 
     * - `calls`: The calls to be dispatched from the same origin. The number of call must not
     *   exceed the constant: `batched_calls_limit` (available in constant metadata).
     * 
     * If origin is root then the calls are dispatched without checking origin filter. (This
     * includes bypassing `frame_system::Config::BaseCallFilter`).
     * 
     * ## Complexity
     * - O(C) where C is the number of calls to be batched.
     */
    v264: new CallType(
        'Utility.batch_all',
        sts.struct({
            calls: sts.array(() => v264.Call),
        })
    ),
}

export const dispatchAs =  {
    name: 'Utility.dispatch_as',
    /**
     * See [`Pallet::dispatch_as`].
     */
    v257: new CallType(
        'Utility.dispatch_as',
        sts.struct({
            asOrigin: v257.OriginCaller,
            call: v257.Call,
        })
    ),
    /**
     * Dispatches a function call with a provided origin.
     * 
     * The dispatch origin for this call must be _Root_.
     * 
     * ## Complexity
     * - O(1).
     */
    v264: new CallType(
        'Utility.dispatch_as',
        sts.struct({
            asOrigin: v264.OriginCaller,
            call: v264.Call,
        })
    ),
}

export const forceBatch =  {
    name: 'Utility.force_batch',
    /**
     * See [`Pallet::force_batch`].
     */
    v257: new CallType(
        'Utility.force_batch',
        sts.struct({
            calls: sts.array(() => v257.Call),
        })
    ),
    /**
     * Send a batch of dispatch calls.
     * Unlike `batch`, it allows errors and won't interrupt.
     * 
     * May be called from any origin except `None`.
     * 
     * - `calls`: The calls to be dispatched from the same origin. The number of call must not
     *   exceed the constant: `batched_calls_limit` (available in constant metadata).
     * 
     * If origin is root then the calls are dispatch without checking origin filter. (This
     * includes bypassing `frame_system::Config::BaseCallFilter`).
     * 
     * ## Complexity
     * - O(C) where C is the number of calls to be batched.
     */
    v264: new CallType(
        'Utility.force_batch',
        sts.struct({
            calls: sts.array(() => v264.Call),
        })
    ),
}

export const withWeight =  {
    name: 'Utility.with_weight',
    /**
     * See [`Pallet::with_weight`].
     */
    v257: new CallType(
        'Utility.with_weight',
        sts.struct({
            call: v257.Call,
            weight: v257.Weight,
        })
    ),
    /**
     * Dispatch a function call with a specified weight.
     * 
     * This function does not check the weight of the call, and instead allows the
     * Root origin to specify the weight of the call.
     * 
     * The dispatch origin for this call must be _Root_.
     */
    v264: new CallType(
        'Utility.with_weight',
        sts.struct({
            call: v264.Call,
            weight: v264.Weight,
        })
    ),
}
