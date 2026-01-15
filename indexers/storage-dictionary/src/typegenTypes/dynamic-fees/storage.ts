import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v170 from '../v170'
import * as v335 from '../v335'

export const assetFee =  {
    /**
     *  Stores last calculated fee of an asset and block number in which it was changed..
     *  Stored as (Asset fee, Protocol fee, Block number)
     */
    v170: new StorageType('DynamicFees.AssetFee', 'Optional', [sts.number()], v170.FeeEntry) as AssetFeeV170,
}

/**
 *  Stores last calculated fee of an asset and block number in which it was changed..
 *  Stored as (Asset fee, Protocol fee, Block number)
 */
export interface AssetFeeV170  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v170.FeeEntry | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v170.FeeEntry | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v170.FeeEntry | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v170.FeeEntry | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v170.FeeEntry | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v170.FeeEntry | undefined)][]>
}

export const assetFeeConfiguration =  {
    /**
     *  Stores per-asset fee configuration (Fixed or Dynamic)
     */
    v335: new StorageType('DynamicFees.AssetFeeConfiguration', 'Optional', [sts.number()], v335.AssetFeeConfig) as AssetFeeConfigurationV335,
}

/**
 *  Stores per-asset fee configuration (Fixed or Dynamic)
 */
export interface AssetFeeConfigurationV335  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v335.AssetFeeConfig | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v335.AssetFeeConfig | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v335.AssetFeeConfig | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v335.AssetFeeConfig | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v335.AssetFeeConfig | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v335.AssetFeeConfig | undefined)][]>
}
