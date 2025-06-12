import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'

export const omniPositionId =  {
    /**
     *  Map of omnipool position's ids to LM's deposit ids.
     */
    v138: new StorageType('OmnipoolLiquidityMining.OmniPositionId', 'Optional', [sts.bigint()], sts.bigint()) as OmniPositionIdV138,
}

/**
 *  Map of omnipool position's ids to LM's deposit ids.
 */
export interface OmniPositionIdV138  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(bigint | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(bigint | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (bigint | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (bigint | undefined)][]>
}
