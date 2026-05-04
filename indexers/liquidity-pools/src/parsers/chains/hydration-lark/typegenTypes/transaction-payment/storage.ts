import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const nextFeeMultiplier =  {
    v405: new StorageType('TransactionPayment.NextFeeMultiplier', 'Default', [], v405.FixedU128) as NextFeeMultiplierV405,
}

export interface NextFeeMultiplierV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.FixedU128
    get(block: Block): Promise<(v405.FixedU128 | undefined)>
}

export const storageVersion =  {
    v405: new StorageType('TransactionPayment.StorageVersion', 'Default', [], v405.Releases) as StorageVersionV405,
}

export interface StorageVersionV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.Releases
    get(block: Block): Promise<(v405.Releases | undefined)>
}
