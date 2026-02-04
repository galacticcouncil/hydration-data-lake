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

export const positions =  {
    /**
     *  LP positions. Maps NFT instance id to corresponding position
     */
    v347: new StorageType('Omnipool.Positions', 'Optional', [sts.bigint()], v347.Position) as PositionsV347,
}

/**
 *  LP positions. Maps NFT instance id to corresponding position
 */
export interface PositionsV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v347.Position | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v347.Position | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v347.Position | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v347.Position | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v347.Position | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v347.Position | undefined)][]>
}

export const nextPositionId =  {
    /**
     *  Position ids sequencer
     */
    v347: new StorageType('Omnipool.NextPositionId', 'Default', [], sts.bigint()) as NextPositionIdV347,
}

/**
 *  Position ids sequencer
 */
export interface NextPositionIdV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}
