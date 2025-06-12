import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v138 from '../v138'

export const nextOrderId =  {
    /**
     *  ID sequencer for Orders
     */
    v138: new StorageType('OTC.NextOrderId', 'Default', [], sts.number()) as NextOrderIdV138,
}

/**
 *  ID sequencer for Orders
 */
export interface NextOrderIdV138  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const orders =  {
    v138: new StorageType('OTC.Orders', 'Optional', [sts.number()], v138.Order) as OrdersV138,
}

export interface OrdersV138  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v138.Order | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v138.Order | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v138.Order | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v138.Order | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v138.Order | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v138.Order | undefined)][]>
}
