import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const nextOrderId =  {
    /**
     *  ID sequencer for Orders
     */
    v347: new StorageType('OTC.NextOrderId', 'Default', [], sts.number()) as NextOrderIdV347,
}

/**
 *  ID sequencer for Orders
 */
export interface NextOrderIdV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const orders =  {
    v347: new StorageType('OTC.Orders', 'Optional', [sts.number()], v347.Type_649) as OrdersV347,
}

export interface OrdersV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v347.Type_649 | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v347.Type_649 | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v347.Type_649 | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v347.Type_649 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v347.Type_649 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v347.Type_649 | undefined)][]>
}
