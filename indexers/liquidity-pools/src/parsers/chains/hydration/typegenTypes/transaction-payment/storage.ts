import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v100 from '../v100'

export const nextFeeMultiplier =  {
    v100: new StorageType('TransactionPayment.NextFeeMultiplier', 'Default', [], v100.FixedU128) as NextFeeMultiplierV100,
}

export interface NextFeeMultiplierV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.FixedU128
    get(block: Block): Promise<(v100.FixedU128 | undefined)>
}

export const storageVersion =  {
    v100: new StorageType('TransactionPayment.StorageVersion', 'Default', [], v100.Type_80) as StorageVersionV100,
}

export interface StorageVersionV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.Type_80
    get(block: Block): Promise<(v100.Type_80 | undefined)>
}
