import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v100 from '../v100'
import * as v104 from '../v104'
import * as v108 from '../v108'

export const sudo =  {
    name: 'Sudo.sudo',
    /**
     * Authenticates the sudo key and dispatches a function call with `Root` origin.
     * 
     * The dispatch origin for this call must be _Signed_.
     * 
     * # <weight>
     * - O(1).
     * - Limited storage reads.
     * - One DB write (event).
     * - Weight of derivative `call` execution + 10,000.
     * # </weight>
     */
    v100: new CallType(
        'Sudo.sudo',
        sts.struct({
            call: v100.Call,
        })
    ),
    /**
     * Authenticates the sudo key and dispatches a function call with `Root` origin.
     * 
     * The dispatch origin for this call must be _Signed_.
     * 
     * # <weight>
     * - O(1).
     * - Limited storage reads.
     * - One DB write (event).
     * - Weight of derivative `call` execution + 10,000.
     * # </weight>
     */
    v104: new CallType(
        'Sudo.sudo',
        sts.struct({
            call: v104.Call,
        })
    ),
    /**
     * Authenticates the sudo key and dispatches a function call with `Root` origin.
     * 
     * The dispatch origin for this call must be _Signed_.
     * 
     * # <weight>
     * - O(1).
     * - Limited storage reads.
     * - One DB write (event).
     * - Weight of derivative `call` execution + 10,000.
     * # </weight>
     */
    v108: new CallType(
        'Sudo.sudo',
        sts.struct({
            call: v108.Call,
        })
    ),
}

export const sudoUncheckedWeight =  {
    name: 'Sudo.sudo_unchecked_weight',
    /**
     * Authenticates the sudo key and dispatches a function call with `Root` origin.
     * This function does not check the weight of the call, and instead allows the
     * Sudo user to specify the weight of the call.
     * 
     * The dispatch origin for this call must be _Signed_.
     * 
     * # <weight>
     * - O(1).
     * - The weight of this call is defined by the caller.
     * # </weight>
     */
    v100: new CallType(
        'Sudo.sudo_unchecked_weight',
        sts.struct({
            call: v100.Call,
            weight: sts.bigint(),
        })
    ),
    /**
     * Authenticates the sudo key and dispatches a function call with `Root` origin.
     * This function does not check the weight of the call, and instead allows the
     * Sudo user to specify the weight of the call.
     * 
     * The dispatch origin for this call must be _Signed_.
     * 
     * # <weight>
     * - O(1).
     * - The weight of this call is defined by the caller.
     * # </weight>
     */
    v104: new CallType(
        'Sudo.sudo_unchecked_weight',
        sts.struct({
            call: v104.Call,
            weight: sts.bigint(),
        })
    ),
    /**
     * Authenticates the sudo key and dispatches a function call with `Root` origin.
     * This function does not check the weight of the call, and instead allows the
     * Sudo user to specify the weight of the call.
     * 
     * The dispatch origin for this call must be _Signed_.
     * 
     * # <weight>
     * - O(1).
     * - The weight of this call is defined by the caller.
     * # </weight>
     */
    v108: new CallType(
        'Sudo.sudo_unchecked_weight',
        sts.struct({
            call: v108.Call,
            weight: sts.bigint(),
        })
    ),
}

export const setKey =  {
    name: 'Sudo.set_key',
    /**
     * Authenticates the current sudo key and sets the given AccountId (`new`) as the new sudo
     * key.
     * 
     * The dispatch origin for this call must be _Signed_.
     * 
     * # <weight>
     * - O(1).
     * - Limited storage reads.
     * - One DB change.
     * # </weight>
     */
    v100: new CallType(
        'Sudo.set_key',
        sts.struct({
            new: v100.AccountId32,
        })
    ),
}

export const sudoAs =  {
    name: 'Sudo.sudo_as',
    /**
     * Authenticates the sudo key and dispatches a function call with `Signed` origin from
     * a given account.
     * 
     * The dispatch origin for this call must be _Signed_.
     * 
     * # <weight>
     * - O(1).
     * - Limited storage reads.
     * - One DB write (event).
     * - Weight of derivative `call` execution + 10,000.
     * # </weight>
     */
    v100: new CallType(
        'Sudo.sudo_as',
        sts.struct({
            who: v100.AccountId32,
            call: v100.Call,
        })
    ),
    /**
     * Authenticates the sudo key and dispatches a function call with `Signed` origin from
     * a given account.
     * 
     * The dispatch origin for this call must be _Signed_.
     * 
     * # <weight>
     * - O(1).
     * - Limited storage reads.
     * - One DB write (event).
     * - Weight of derivative `call` execution + 10,000.
     * # </weight>
     */
    v104: new CallType(
        'Sudo.sudo_as',
        sts.struct({
            who: v104.AccountId32,
            call: v104.Call,
        })
    ),
    /**
     * Authenticates the sudo key and dispatches a function call with `Signed` origin from
     * a given account.
     * 
     * The dispatch origin for this call must be _Signed_.
     * 
     * # <weight>
     * - O(1).
     * - Limited storage reads.
     * - One DB write (event).
     * - Weight of derivative `call` execution + 10,000.
     * # </weight>
     */
    v108: new CallType(
        'Sudo.sudo_as',
        sts.struct({
            who: v108.AccountId32,
            call: v108.Call,
        })
    ),
}
