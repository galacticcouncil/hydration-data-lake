import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const nextOrderId =  {
    /**
     *  ID sequencer for Orders
     */
    v257: new StorageType('OTC.NextOrderId', 'Default', [], sts.number()) as NextOrderIdV257,
}

/**
 *  ID sequencer for Orders
 */
export interface NextOrderIdV257  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const orders =  {
    v257: new StorageType('OTC.Orders', 'Optional', [sts.number()], v257.Type_584) as OrdersV257,
}

export interface OrdersV257  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v257.Type_584 | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v257.Type_584 | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v257.Type_584 | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v257.Type_584 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v257.Type_584 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v257.Type_584 | undefined)][]>
}
