import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const nextFeeMultiplier =  {
    v287: new StorageType('TransactionPayment.NextFeeMultiplier', 'Default', [], v287.FixedU128) as NextFeeMultiplierV287,
}

export interface NextFeeMultiplierV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.FixedU128
    get(block: Block): Promise<(v287.FixedU128 | undefined)>
}

export const storageVersion =  {
    v287: new StorageType('TransactionPayment.StorageVersion', 'Default', [], v287.Releases) as StorageVersionV287,
}

export interface StorageVersionV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.Releases
    get(block: Block): Promise<(v287.Releases | undefined)>
}
