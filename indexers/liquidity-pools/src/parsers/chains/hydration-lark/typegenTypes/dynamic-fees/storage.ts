import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const assetFee =  {
    /**
     *  Stores last calculated fee of an asset and block number in which it was changed..
     *  Stored as (Asset fee, Protocol fee, Block number)
     */
    v405: new StorageType('DynamicFees.AssetFee', 'Optional', [sts.number()], v405.FeeEntry) as AssetFeeV405,
}

/**
 *  Stores last calculated fee of an asset and block number in which it was changed..
 *  Stored as (Asset fee, Protocol fee, Block number)
 */
export interface AssetFeeV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v405.FeeEntry | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.FeeEntry | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.FeeEntry | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.FeeEntry | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.FeeEntry | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.FeeEntry | undefined)][]>
}

export const assetFeeConfiguration =  {
    /**
     *  Stores per-asset fee configuration (Fixed or Dynamic)
     */
    v405: new StorageType('DynamicFees.AssetFeeConfiguration', 'Optional', [sts.number()], v405.AssetFeeConfig) as AssetFeeConfigurationV405,
}

/**
 *  Stores per-asset fee configuration (Fixed or Dynamic)
 */
export interface AssetFeeConfigurationV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v405.AssetFeeConfig | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.AssetFeeConfig | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.AssetFeeConfig | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.AssetFeeConfig | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.AssetFeeConfig | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.AssetFeeConfig | undefined)][]>
}
