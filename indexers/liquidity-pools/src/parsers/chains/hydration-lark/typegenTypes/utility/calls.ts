import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v405 from '../v405'
import * as v406 from '../v406'

export const batch =  {
    name: 'Utility.batch',
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
    v405: new CallType(
        'Utility.batch',
        sts.struct({
            calls: sts.array(() => v405.Call),
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
    v406: new CallType(
        'Utility.batch',
        sts.struct({
            calls: sts.array(() => v406.Call),
        })
    ),
}

export const asDerivative =  {
    name: 'Utility.as_derivative',
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
    v405: new CallType(
        'Utility.as_derivative',
        sts.struct({
            index: sts.number(),
            call: v405.Call,
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
    v406: new CallType(
        'Utility.as_derivative',
        sts.struct({
            index: sts.number(),
            call: v406.Call,
        })
    ),
}

export const batchAll =  {
    name: 'Utility.batch_all',
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
    v405: new CallType(
        'Utility.batch_all',
        sts.struct({
            calls: sts.array(() => v405.Call),
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
    v406: new CallType(
        'Utility.batch_all',
        sts.struct({
            calls: sts.array(() => v406.Call),
        })
    ),
}

export const dispatchAs =  {
    name: 'Utility.dispatch_as',
    /**
     * Dispatches a function call with a provided origin.
     * 
     * The dispatch origin for this call must be _Root_.
     * 
     * ## Complexity
     * - O(1).
     */
    v405: new CallType(
        'Utility.dispatch_as',
        sts.struct({
            asOrigin: v405.OriginCaller,
            call: v405.Call,
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
    v406: new CallType(
        'Utility.dispatch_as',
        sts.struct({
            asOrigin: v406.OriginCaller,
            call: v406.Call,
        })
    ),
}

export const forceBatch =  {
    name: 'Utility.force_batch',
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
    v405: new CallType(
        'Utility.force_batch',
        sts.struct({
            calls: sts.array(() => v405.Call),
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
    v406: new CallType(
        'Utility.force_batch',
        sts.struct({
            calls: sts.array(() => v406.Call),
        })
    ),
}

export const withWeight =  {
    name: 'Utility.with_weight',
    /**
     * Dispatch a function call with a specified weight.
     * 
     * This function does not check the weight of the call, and instead allows the
     * Root origin to specify the weight of the call.
     * 
     * The dispatch origin for this call must be _Root_.
     */
    v405: new CallType(
        'Utility.with_weight',
        sts.struct({
            call: v405.Call,
            weight: v405.Weight,
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
    v406: new CallType(
        'Utility.with_weight',
        sts.struct({
            call: v406.Call,
            weight: v406.Weight,
        })
    ),
}

export const ifElse =  {
    name: 'Utility.if_else',
    /**
     * Dispatch a fallback call in the event the main call fails to execute.
     * May be called from any origin except `None`.
     * 
     * This function first attempts to dispatch the `main` call.
     * If the `main` call fails, the `fallback` is attemted.
     * if the fallback is successfully dispatched, the weights of both calls
     * are accumulated and an event containing the main call error is deposited.
     * 
     * In the event of a fallback failure the whole call fails
     * with the weights returned.
     * 
     * - `main`: The main call to be dispatched. This is the primary action to execute.
     * - `fallback`: The fallback call to be dispatched in case the `main` call fails.
     * 
     * ## Dispatch Logic
     * - If the origin is `root`, both the main and fallback calls are executed without
     *   applying any origin filters.
     * - If the origin is not `root`, the origin filter is applied to both the `main` and
     *   `fallback` calls.
     * 
     * ## Use Case
     * - Some use cases might involve submitting a `batch` type call in either main, fallback
     *   or both.
     */
    v405: new CallType(
        'Utility.if_else',
        sts.struct({
            main: v405.Call,
            fallback: v405.Call,
        })
    ),
    /**
     * Dispatch a fallback call in the event the main call fails to execute.
     * May be called from any origin except `None`.
     * 
     * This function first attempts to dispatch the `main` call.
     * If the `main` call fails, the `fallback` is attemted.
     * if the fallback is successfully dispatched, the weights of both calls
     * are accumulated and an event containing the main call error is deposited.
     * 
     * In the event of a fallback failure the whole call fails
     * with the weights returned.
     * 
     * - `main`: The main call to be dispatched. This is the primary action to execute.
     * - `fallback`: The fallback call to be dispatched in case the `main` call fails.
     * 
     * ## Dispatch Logic
     * - If the origin is `root`, both the main and fallback calls are executed without
     *   applying any origin filters.
     * - If the origin is not `root`, the origin filter is applied to both the `main` and
     *   `fallback` calls.
     * 
     * ## Use Case
     * - Some use cases might involve submitting a `batch` type call in either main, fallback
     *   or both.
     */
    v406: new CallType(
        'Utility.if_else',
        sts.struct({
            main: v406.Call,
            fallback: v406.Call,
        })
    ),
}

export const dispatchAsFallible =  {
    name: 'Utility.dispatch_as_fallible',
    /**
     * Dispatches a function call with a provided origin.
     * 
     * Almost the same as [`Pallet::dispatch_as`] but forwards any error of the inner call.
     * 
     * The dispatch origin for this call must be _Root_.
     */
    v405: new CallType(
        'Utility.dispatch_as_fallible',
        sts.struct({
            asOrigin: v405.OriginCaller,
            call: v405.Call,
        })
    ),
    /**
     * Dispatches a function call with a provided origin.
     * 
     * Almost the same as [`Pallet::dispatch_as`] but forwards any error of the inner call.
     * 
     * The dispatch origin for this call must be _Root_.
     */
    v406: new CallType(
        'Utility.dispatch_as_fallible',
        sts.struct({
            asOrigin: v406.OriginCaller,
            call: v406.Call,
        })
    ),
}
