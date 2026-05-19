import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const nextOrderId =  {
    /**
     *  ID sequencer for Orders
     */
    v405: new StorageType('OTC.NextOrderId', 'Default', [], sts.number()) as NextOrderIdV405,
}

/**
 *  ID sequencer for Orders
 */
export interface NextOrderIdV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const orders =  {
    v405: new StorageType('OTC.Orders', 'Optional', [sts.number()], v405.Type_724) as OrdersV405,
}

export interface OrdersV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v405.Type_724 | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.Type_724 | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.Type_724 | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.Type_724 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.Type_724 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.Type_724 | undefined)][]>
}
