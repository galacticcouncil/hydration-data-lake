import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const assetFee =  {
    /**
     *  Stores last calculated fee of an asset and block number in which it was changed..
     *  Stored as (Asset fee, Protocol fee, Block number)
     */
    v276: new StorageType('DynamicFees.AssetFee', 'Optional', [sts.number()], v276.FeeEntry) as AssetFeeV276,
}

/**
 *  Stores last calculated fee of an asset and block number in which it was changed..
 *  Stored as (Asset fee, Protocol fee, Block number)
 */
export interface AssetFeeV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v276.FeeEntry | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v276.FeeEntry | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v276.FeeEntry | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v276.FeeEntry | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v276.FeeEntry | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v276.FeeEntry | undefined)][]>
}
