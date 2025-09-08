import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const nextFeeMultiplier =  {
    v324: new StorageType('TransactionPayment.NextFeeMultiplier', 'Default', [], v324.FixedU128) as NextFeeMultiplierV324,
}

export interface NextFeeMultiplierV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.FixedU128
    get(block: Block): Promise<(v324.FixedU128 | undefined)>
}

export const storageVersion =  {
    v324: new StorageType('TransactionPayment.StorageVersion', 'Default', [], v324.Releases) as StorageVersionV324,
}

export interface StorageVersionV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.Releases
    get(block: Block): Promise<(v324.Releases | undefined)>
}
