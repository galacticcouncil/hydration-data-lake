import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v347 from '../v347'
import * as v390 from '../v390'

export const withdraw =  {
    name: 'EVM.withdraw',
    /**
     * Withdraw balance from EVM into currency/balances pallet.
     */
    v347: new CallType(
        'EVM.withdraw',
        sts.struct({
            address: v347.H160,
            value: sts.bigint(),
        })
    ),
}

export const call =  {
    name: 'EVM.call',
    /**
     * Issue an EVM call operation. This is similar to a message call transaction in Ethereum.
     */
    v347: new CallType(
        'EVM.call',
        sts.struct({
            source: v347.H160,
            target: v347.H160,
            input: sts.bytes(),
            value: sts.bigint(),
            gasLimit: sts.bigint(),
            maxFeePerGas: sts.bigint(),
            maxPriorityFeePerGas: sts.option(() => sts.bigint()),
            nonce: sts.option(() => sts.bigint()),
            accessList: sts.array(() => sts.tuple(() => [v347.H160, sts.array(() => v347.H256)])),
        })
    ),
    /**
     * Issue an EVM call operation. This is similar to a message call transaction in Ethereum.
     */
    v390: new CallType(
        'EVM.call',
        sts.struct({
            source: v390.H160,
            target: v390.H160,
            input: sts.bytes(),
            value: sts.bigint(),
            gasLimit: sts.bigint(),
            maxFeePerGas: sts.bigint(),
            maxPriorityFeePerGas: sts.option(() => sts.bigint()),
            nonce: sts.option(() => sts.bigint()),
            accessList: sts.array(() => sts.tuple(() => [v390.H160, sts.array(() => v390.H256)])),
            authorizationList: sts.array(() => v390.AuthorizationListItem),
        })
    ),
}

export const create =  {
    name: 'EVM.create',
    /**
     * Issue an EVM create operation. This is similar to a contract creation transaction in
     * Ethereum.
     */
    v347: new CallType(
        'EVM.create',
        sts.struct({
            source: v347.H160,
            init: sts.bytes(),
            value: sts.bigint(),
            gasLimit: sts.bigint(),
            maxFeePerGas: sts.bigint(),
            maxPriorityFeePerGas: sts.option(() => sts.bigint()),
            nonce: sts.option(() => sts.bigint()),
            accessList: sts.array(() => sts.tuple(() => [v347.H160, sts.array(() => v347.H256)])),
        })
    ),
    /**
     * Issue an EVM create operation. This is similar to a contract creation transaction in
     * Ethereum.
     */
    v390: new CallType(
        'EVM.create',
        sts.struct({
            source: v390.H160,
            init: sts.bytes(),
            value: sts.bigint(),
            gasLimit: sts.bigint(),
            maxFeePerGas: sts.bigint(),
            maxPriorityFeePerGas: sts.option(() => sts.bigint()),
            nonce: sts.option(() => sts.bigint()),
            accessList: sts.array(() => sts.tuple(() => [v390.H160, sts.array(() => v390.H256)])),
            authorizationList: sts.array(() => v390.AuthorizationListItem),
        })
    ),
}

export const create2 =  {
    name: 'EVM.create2',
    /**
     * Issue an EVM create2 operation.
     */
    v347: new CallType(
        'EVM.create2',
        sts.struct({
            source: v347.H160,
            init: sts.bytes(),
            salt: v347.H256,
            value: sts.bigint(),
            gasLimit: sts.bigint(),
            maxFeePerGas: sts.bigint(),
            maxPriorityFeePerGas: sts.option(() => sts.bigint()),
            nonce: sts.option(() => sts.bigint()),
            accessList: sts.array(() => sts.tuple(() => [v347.H160, sts.array(() => v347.H256)])),
        })
    ),
    /**
     * Issue an EVM create2 operation.
     */
    v390: new CallType(
        'EVM.create2',
        sts.struct({
            source: v390.H160,
            init: sts.bytes(),
            salt: v390.H256,
            value: sts.bigint(),
            gasLimit: sts.bigint(),
            maxFeePerGas: sts.bigint(),
            maxPriorityFeePerGas: sts.option(() => sts.bigint()),
            nonce: sts.option(() => sts.bigint()),
            accessList: sts.array(() => sts.tuple(() => [v390.H160, sts.array(() => v390.H256)])),
            authorizationList: sts.array(() => v390.AuthorizationListItem),
        })
    ),
}
