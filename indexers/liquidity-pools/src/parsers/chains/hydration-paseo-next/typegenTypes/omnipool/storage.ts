import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const assets =  {
    /**
     *  State of an asset in the omnipool
     */
    v347: new StorageType('Omnipool.Assets', 'Optional', [sts.number()], v347.AssetState) as AssetsV347,
}

/**
 *  State of an asset in the omnipool
 */
export interface AssetsV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v347.AssetState | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v347.AssetState | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v347.AssetState | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v347.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v347.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v347.AssetState | undefined)][]>
}

export const hubAssetTradability =  {
    /**
     *  Tradable state of hub asset.
     */
    v347: new StorageType('Omnipool.HubAssetTradability', 'Default', [], v347.Tradability) as HubAssetTradabilityV347,
}

/**
 *  Tradable state of hub asset.
 */
export interface HubAssetTradabilityV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.Tradability
    get(block: Block): Promise<(v347.Tradability | undefined)>
}
