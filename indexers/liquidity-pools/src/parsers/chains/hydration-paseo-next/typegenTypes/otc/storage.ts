import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const nextOrderId =  {
    /**
     *  ID sequencer for Orders
     */
    v324: new StorageType('OTC.NextOrderId', 'Default', [], sts.number()) as NextOrderIdV324,
}

/**
 *  ID sequencer for Orders
 */
export interface NextOrderIdV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const orders =  {
    v324: new StorageType('OTC.Orders', 'Optional', [sts.number()], v324.Type_664) as OrdersV324,
}

export interface OrdersV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v324.Type_664 | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v324.Type_664 | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v324.Type_664 | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v324.Type_664 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v324.Type_664 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v324.Type_664 | undefined)][]>
}
