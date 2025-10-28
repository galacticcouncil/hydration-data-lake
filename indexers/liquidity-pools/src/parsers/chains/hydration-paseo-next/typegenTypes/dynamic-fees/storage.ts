import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const assetFee =  {
    /**
     *  Stores last calculated fee of an asset and block number in which it was changed..
     *  Stored as (Asset fee, Protocol fee, Block number)
     */
    v347: new StorageType('DynamicFees.AssetFee', 'Optional', [sts.number()], v347.FeeEntry) as AssetFeeV347,
}

/**
 *  Stores last calculated fee of an asset and block number in which it was changed..
 *  Stored as (Asset fee, Protocol fee, Block number)
 */
export interface AssetFeeV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v347.FeeEntry | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v347.FeeEntry | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v347.FeeEntry | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v347.FeeEntry | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v347.FeeEntry | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v347.FeeEntry | undefined)][]>
}

export const assetFeeConfiguration =  {
    /**
     *  Stores per-asset fee configuration (Fixed or Dynamic)
     */
    v347: new StorageType('DynamicFees.AssetFeeConfiguration', 'Optional', [sts.number()], v347.AssetFeeConfig) as AssetFeeConfigurationV347,
}

/**
 *  Stores per-asset fee configuration (Fixed or Dynamic)
 */
export interface AssetFeeConfigurationV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v347.AssetFeeConfig | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v347.AssetFeeConfig | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v347.AssetFeeConfig | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v347.AssetFeeConfig | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v347.AssetFeeConfig | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v347.AssetFeeConfig | undefined)][]>
}
