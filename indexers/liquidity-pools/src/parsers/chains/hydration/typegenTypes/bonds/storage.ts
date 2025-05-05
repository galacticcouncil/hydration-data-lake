import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'

export const bondIds =  {
    /**
     *  Registered bond ids.
     *  Maps (underlying asset ID, maturity) -> bond ID
     */
    v176: new StorageType('Bonds.BondIds', 'Optional', [sts.tuple(() => [sts.number(), sts.bigint()])], sts.number()) as BondIdsV176,
}

/**
 *  Registered bond ids.
 *  Maps (underlying asset ID, maturity) -> bond ID
 */
export interface BondIdsV176  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: [number, bigint]): Promise<(number | undefined)>
    getMany(block: Block, keys: [number, bigint][]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<[number, bigint][]>
    getKeys(block: Block, key: [number, bigint]): Promise<[number, bigint][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[number, bigint][]>
    getKeysPaged(pageSize: number, block: Block, key: [number, bigint]): AsyncIterable<[number, bigint][]>
    getPairs(block: Block): Promise<[k: [number, bigint], v: (number | undefined)][]>
    getPairs(block: Block, key: [number, bigint]): Promise<[k: [number, bigint], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [number, bigint], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: [number, bigint]): AsyncIterable<[k: [number, bigint], v: (number | undefined)][]>
}

export const bonds =  {
    /**
     *  Registered bonds.
     *  Maps bond ID -> (underlying asset ID, maturity)
     */
    v176: new StorageType('Bonds.Bonds', 'Optional', [sts.number()], sts.tuple(() => [sts.number(), sts.bigint()])) as BondsV176,
}

/**
 *  Registered bonds.
 *  Maps bond ID -> (underlying asset ID, maturity)
 */
export interface BondsV176  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<([number, bigint] | undefined)>
    getMany(block: Block, keys: number[]): Promise<([number, bigint] | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: ([number, bigint] | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: ([number, bigint] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: ([number, bigint] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: ([number, bigint] | undefined)][]>
}
