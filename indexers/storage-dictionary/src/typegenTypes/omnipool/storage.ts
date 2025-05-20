import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v115 from '../v115'
import * as v123 from '../v123'

export const assets =  {
    /**
     *  State of an asset in the omnipool
     */
    v115: new StorageType('Omnipool.Assets', 'Optional', [sts.number()], v115.AssetState) as AssetsV115,
}

/**
 *  State of an asset in the omnipool
 */
export interface AssetsV115  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v115.AssetState | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v115.AssetState | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v115.AssetState | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v115.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v115.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v115.AssetState | undefined)][]>
}

export const hubAssetImbalance =  {
    /**
     *  Imbalance of hub asset
     */
    v115: new StorageType('Omnipool.HubAssetImbalance', 'Default', [], v115.SimpleImbalance) as HubAssetImbalanceV115,
}

/**
 *  Imbalance of hub asset
 */
export interface HubAssetImbalanceV115  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v115.SimpleImbalance
    get(block: Block): Promise<(v115.SimpleImbalance | undefined)>
}

export const hubAssetTradability =  {
    /**
     *  Tradable state of hub asset.
     */
    v115: new StorageType('Omnipool.HubAssetTradability', 'Default', [], v115.Tradability) as HubAssetTradabilityV115,
}

/**
 *  Tradable state of hub asset.
 */
export interface HubAssetTradabilityV115  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v115.Tradability
    get(block: Block): Promise<(v115.Tradability | undefined)>
}

export const positions =  {
    /**
     *  LP positions. Maps NFT instance id to corresponding position
     */
    v115: new StorageType('Omnipool.Positions', 'Optional', [sts.bigint()], v115.Position) as PositionsV115,
    /**
     *  LP positions. Maps NFT instance id to corresponding position
     */
    v123: new StorageType('Omnipool.Positions', 'Optional', [sts.bigint()], v123.Position) as PositionsV123,
}

/**
 *  LP positions. Maps NFT instance id to corresponding position
 */
export interface PositionsV115  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v115.Position | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v115.Position | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v115.Position | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v115.Position | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v115.Position | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v115.Position | undefined)][]>
}

/**
 *  LP positions. Maps NFT instance id to corresponding position
 */
export interface PositionsV123  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v123.Position | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v123.Position | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v123.Position | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v123.Position | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v123.Position | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v123.Position | undefined)][]>
}

export const nextPositionId =  {
    /**
     *  Position ids sequencer
     */
    v115: new StorageType('Omnipool.NextPositionId', 'Default', [], sts.bigint()) as NextPositionIdV115,
}

/**
 *  Position ids sequencer
 */
export interface NextPositionIdV115  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const tvlCap =  {
    /**
     *  TVL cap
     */
    v125: new StorageType('Omnipool.TvlCap', 'Default', [], sts.bigint()) as TvlCapV125,
}

/**
 *  TVL cap
 */
export interface TvlCapV125  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}
