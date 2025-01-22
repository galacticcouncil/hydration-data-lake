import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const nextOrderId =  {
    /**
     *  ID sequencer for Orders
     */
    v276: new StorageType('OTC.NextOrderId', 'Default', [], sts.number()) as NextOrderIdV276,
}

/**
 *  ID sequencer for Orders
 */
export interface NextOrderIdV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const orders =  {
    v276: new StorageType('OTC.Orders', 'Optional', [sts.number()], v276.Type_636) as OrdersV276,
}

export interface OrdersV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v276.Type_636 | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v276.Type_636 | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v276.Type_636 | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v276.Type_636 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v276.Type_636 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v276.Type_636 | undefined)][]>
}
