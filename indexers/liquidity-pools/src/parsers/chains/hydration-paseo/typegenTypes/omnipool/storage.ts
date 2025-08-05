import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const assets =  {
    /**
     *  State of an asset in the omnipool
     */
    v287: new StorageType('Omnipool.Assets', 'Optional', [sts.number()], v287.AssetState) as AssetsV287,
}

/**
 *  State of an asset in the omnipool
 */
export interface AssetsV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v287.AssetState | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v287.AssetState | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v287.AssetState | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v287.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v287.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v287.AssetState | undefined)][]>
}

export const hubAssetTradability =  {
    /**
     *  Tradable state of hub asset.
     */
    v287: new StorageType('Omnipool.HubAssetTradability', 'Default', [], v287.Tradability) as HubAssetTradabilityV287,
}

/**
 *  Tradable state of hub asset.
 */
export interface HubAssetTradabilityV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.Tradability
    get(block: Block): Promise<(v287.Tradability | undefined)>
}
