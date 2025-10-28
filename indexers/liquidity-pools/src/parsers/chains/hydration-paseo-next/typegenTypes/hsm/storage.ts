import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const collaterals =  {
    /**
     *  List of approved assets that Hollar can be purchased with
     * 
     *  This storage maps asset IDs to their collateral configuration information.
     *  Only assets in this map can be used to mint or redeem Hollar through HSM.
     *  Each collateral has specific parameters controlling its usage in the HSM mechanism.
     */
    v347: new StorageType('HSM.Collaterals', 'Optional', [sts.number()], v347.CollateralInfo) as CollateralsV347,
}

/**
 *  List of approved assets that Hollar can be purchased with
 * 
 *  This storage maps asset IDs to their collateral configuration information.
 *  Only assets in this map can be used to mint or redeem Hollar through HSM.
 *  Each collateral has specific parameters controlling its usage in the HSM mechanism.
 */
export interface CollateralsV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v347.CollateralInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v347.CollateralInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v347.CollateralInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v347.CollateralInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v347.CollateralInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v347.CollateralInfo | undefined)][]>
}

export const hollarAmountReceived =  {
    /**
     *  Amount of Hollar bought with an asset in a single block
     * 
     *  This storage tracks how much Hollar has been bought back by HSM for each collateral
     *  asset within the current block. This is used to enforce rate limiting on Hollar redemptions.
     *  Values are reset to zero at the end of each block in on_finalize.
     */
    v347: new StorageType('HSM.HollarAmountReceived', 'Default', [sts.number()], sts.bigint()) as HollarAmountReceivedV347,
}

/**
 *  Amount of Hollar bought with an asset in a single block
 * 
 *  This storage tracks how much Hollar has been bought back by HSM for each collateral
 *  asset within the current block. This is used to enforce rate limiting on Hollar redemptions.
 *  Values are reset to zero at the end of each block in on_finalize.
 */
export interface HollarAmountReceivedV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
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

export const flashMinter =  {
    /**
     *  Address of the flash loan receiver.
     */
    v347: new StorageType('HSM.FlashMinter', 'Optional', [], v347.H160) as FlashMinterV347,
}

/**
 *  Address of the flash loan receiver.
 */
export interface FlashMinterV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v347.H160 | undefined)>
}
