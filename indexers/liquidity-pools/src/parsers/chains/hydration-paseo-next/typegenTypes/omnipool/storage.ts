import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const assets =  {
    /**
     *  State of an asset in the omnipool
     */
    v324: new StorageType('Omnipool.Assets', 'Optional', [sts.number()], v324.AssetState) as AssetsV324,
}

/**
 *  State of an asset in the omnipool
 */
export interface AssetsV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v324.AssetState | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v324.AssetState | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v324.AssetState | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v324.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v324.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v324.AssetState | undefined)][]>
}

export const hubAssetTradability =  {
    /**
     *  Tradable state of hub asset.
     */
    v324: new StorageType('Omnipool.HubAssetTradability', 'Default', [], v324.Tradability) as HubAssetTradabilityV324,
}

/**
 *  Tradable state of hub asset.
 */
export interface HubAssetTradabilityV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.Tradability
    get(block: Block): Promise<(v324.Tradability | undefined)>
}

export const positions =  {
    /**
     *  LP positions. Maps NFT instance id to corresponding position
     */
    v324: new StorageType('Omnipool.Positions', 'Optional', [sts.bigint()], v324.Position) as PositionsV324,
}

/**
 *  LP positions. Maps NFT instance id to corresponding position
 */
export interface PositionsV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v324.Position | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v324.Position | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v324.Position | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v324.Position | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v324.Position | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v324.Position | undefined)][]>
}

export const nextPositionId =  {
    /**
     *  Position ids sequencer
     */
    v324: new StorageType('Omnipool.NextPositionId', 'Default', [], sts.bigint()) as NextPositionIdV324,
}

/**
 *  Position ids sequencer
 */
export interface NextPositionIdV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}
