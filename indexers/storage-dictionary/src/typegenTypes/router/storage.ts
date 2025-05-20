import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v193 from '../v193'
import * as v257 from '../v257'
import * as v295 from '../v295'

export const routes =  {
    /**
     *  Storing routes for asset pairs
     */
    v193: new StorageType('Router.Routes', 'Optional', [v193.AssetPair], sts.array(() => v193.Trade)) as RoutesV193,
    /**
     *  Storing routes for asset pairs
     */
    v295: new StorageType('Router.Routes', 'Optional', [v295.AssetPair], sts.array(() => v295.Trade)) as RoutesV295,
}

/**
 *  Storing routes for asset pairs
 */
export interface RoutesV193  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v193.AssetPair): Promise<(v193.Trade[] | undefined)>
    getMany(block: Block, keys: v193.AssetPair[]): Promise<(v193.Trade[] | undefined)[]>
    getKeys(block: Block): Promise<v193.AssetPair[]>
    getKeys(block: Block, key: v193.AssetPair): Promise<v193.AssetPair[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v193.AssetPair[]>
    getKeysPaged(pageSize: number, block: Block, key: v193.AssetPair): AsyncIterable<v193.AssetPair[]>
    getPairs(block: Block): Promise<[k: v193.AssetPair, v: (v193.Trade[] | undefined)][]>
    getPairs(block: Block, key: v193.AssetPair): Promise<[k: v193.AssetPair, v: (v193.Trade[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v193.AssetPair, v: (v193.Trade[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v193.AssetPair): AsyncIterable<[k: v193.AssetPair, v: (v193.Trade[] | undefined)][]>
}

/**
 *  Storing routes for asset pairs
 */
export interface RoutesV295  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v295.AssetPair): Promise<(v295.Trade[] | undefined)>
    getMany(block: Block, keys: v295.AssetPair[]): Promise<(v295.Trade[] | undefined)[]>
    getKeys(block: Block): Promise<v295.AssetPair[]>
    getKeys(block: Block, key: v295.AssetPair): Promise<v295.AssetPair[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v295.AssetPair[]>
    getKeysPaged(pageSize: number, block: Block, key: v295.AssetPair): AsyncIterable<v295.AssetPair[]>
    getPairs(block: Block): Promise<[k: v295.AssetPair, v: (v295.Trade[] | undefined)][]>
    getPairs(block: Block, key: v295.AssetPair): Promise<[k: v295.AssetPair, v: (v295.Trade[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v295.AssetPair, v: (v295.Trade[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v295.AssetPair): AsyncIterable<[k: v295.AssetPair, v: (v295.Trade[] | undefined)][]>
}

export const skipEd =  {
    /**
     * Flag to indicate when to skip ED handling
     */
    v257: new StorageType('Router.SkipEd', 'Optional', [], v257.SkipEd) as SkipEdV257,
}

/**
 * Flag to indicate when to skip ED handling
 */
export interface SkipEdV257  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v257.SkipEd | undefined)>
}
