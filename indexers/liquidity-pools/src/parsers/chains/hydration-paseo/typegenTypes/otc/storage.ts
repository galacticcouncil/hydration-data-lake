import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const nextOrderId =  {
    /**
     *  ID sequencer for Orders
     */
    v287: new StorageType('OTC.NextOrderId', 'Default', [], sts.number()) as NextOrderIdV287,
}

/**
 *  ID sequencer for Orders
 */
export interface NextOrderIdV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const orders =  {
    v287: new StorageType('OTC.Orders', 'Optional', [sts.number()], v287.Type_649) as OrdersV287,
}

export interface OrdersV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v287.Type_649 | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v287.Type_649 | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v287.Type_649 | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v287.Type_649 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v287.Type_649 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v287.Type_649 | undefined)][]>
}
