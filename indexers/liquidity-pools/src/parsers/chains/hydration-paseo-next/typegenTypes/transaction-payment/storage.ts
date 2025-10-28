import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const nextFeeMultiplier =  {
    v347: new StorageType('TransactionPayment.NextFeeMultiplier', 'Default', [], v347.FixedU128) as NextFeeMultiplierV347,
}

export interface NextFeeMultiplierV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.FixedU128
    get(block: Block): Promise<(v347.FixedU128 | undefined)>
}

export const storageVersion =  {
    v347: new StorageType('TransactionPayment.StorageVersion', 'Default', [], v347.Releases) as StorageVersionV347,
}

export interface StorageVersionV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.Releases
    get(block: Block): Promise<(v347.Releases | undefined)>
}
