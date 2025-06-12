import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const assets =  {
    /**
     *  State of an asset in the omnipool
     */
    v276: new StorageType('Omnipool.Assets', 'Optional', [sts.number()], v276.AssetState) as AssetsV276,
}

/**
 *  State of an asset in the omnipool
 */
export interface AssetsV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v276.AssetState | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v276.AssetState | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v276.AssetState | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v276.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v276.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v276.AssetState | undefined)][]>
}
