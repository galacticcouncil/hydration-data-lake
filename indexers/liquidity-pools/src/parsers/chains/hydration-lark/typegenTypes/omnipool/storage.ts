import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const assets =  {
    /**
     *  State of an asset in the omnipool
     */
    v405: new StorageType('Omnipool.Assets', 'Optional', [sts.number()], v405.AssetState) as AssetsV405,
}

/**
 *  State of an asset in the omnipool
 */
export interface AssetsV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v405.AssetState | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.AssetState | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.AssetState | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.AssetState | undefined)][]>
}

export const hubAssetTradability =  {
    /**
     *  Tradable state of hub asset.
     */
    v405: new StorageType('Omnipool.HubAssetTradability', 'Default', [], v405.Tradability) as HubAssetTradabilityV405,
}

/**
 *  Tradable state of hub asset.
 */
export interface HubAssetTradabilityV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.Tradability
    get(block: Block): Promise<(v405.Tradability | undefined)>
}

export const positions =  {
    /**
     *  LP positions. Maps NFT instance id to corresponding position
     */
    v405: new StorageType('Omnipool.Positions', 'Optional', [sts.bigint()], v405.Position) as PositionsV405,
}

/**
 *  LP positions. Maps NFT instance id to corresponding position
 */
export interface PositionsV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v405.Position | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v405.Position | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v405.Position | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v405.Position | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v405.Position | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v405.Position | undefined)][]>
}

export const nextPositionId =  {
    /**
     *  Position ids sequencer
     */
    v405: new StorageType('Omnipool.NextPositionId', 'Default', [], sts.bigint()) as NextPositionIdV405,
}

/**
 *  Position ids sequencer
 */
export interface NextPositionIdV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const slipFee =  {
    /**
     *  Global slip fee configuration.
     *  `None` = slip fees disabled (default). `Some(config)` = enabled.
     *  Set via `set_slip_fee` extrinsic (governance).
     */
    v405: new StorageType('Omnipool.SlipFee', 'Optional', [], v405.SlipFeeConfig) as SlipFeeV405,
}

/**
 *  Global slip fee configuration.
 *  `None` = slip fees disabled (default). `Some(config)` = enabled.
 *  Set via `set_slip_fee` extrinsic (governance).
 */
export interface SlipFeeV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v405.SlipFeeConfig | undefined)>
}

export const slipFeeHubReserveAtBlockStart =  {
    /**
     *  Snapshot of each asset's hub_reserve at the start of the current block.
     *  Lazily populated on first trade per asset per block, cleared in on_finalize.
     */
    v405: new StorageType('Omnipool.SlipFeeHubReserveAtBlockStart', 'Optional', [sts.number()], sts.bigint()) as SlipFeeHubReserveAtBlockStartV405,
}

/**
 *  Snapshot of each asset's hub_reserve at the start of the current block.
 *  Lazily populated on first trade per asset per block, cleared in on_finalize.
 */
export interface SlipFeeHubReserveAtBlockStartV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(bigint | undefined)>
    getMany(block: Block, keys: number[]): Promise<(bigint | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (bigint | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (bigint | undefined)][]>
}

export const slipFeeDelta =  {
    /**
     *  Cumulative net hub asset delta per asset in the current block.
     *  Negative = net hub asset outflow, positive = net hub asset inflow.
     *  Cleared in on_finalize.
     */
    v405: new StorageType('Omnipool.SlipFeeDelta', 'Default', [sts.number()], v405.SignedBalance) as SlipFeeDeltaV405,
}

/**
 *  Cumulative net hub asset delta per asset in the current block.
 *  Negative = net hub asset outflow, positive = net hub asset inflow.
 *  Cleared in on_finalize.
 */
export interface SlipFeeDeltaV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.SignedBalance
    get(block: Block, key: number): Promise<(v405.SignedBalance | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.SignedBalance | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.SignedBalance | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.SignedBalance | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.SignedBalance | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.SignedBalance | undefined)][]>
}
