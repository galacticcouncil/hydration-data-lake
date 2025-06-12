import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v193 from '../v193'
import * as v205 from '../v205'

export const accountCodes =  {
    v193: new StorageType('EVM.AccountCodes', 'Default', [v193.H160], sts.bytes()) as AccountCodesV193,
}

export interface AccountCodesV193  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): Bytes
    get(block: Block, key: v193.H160): Promise<(Bytes | undefined)>
    getMany(block: Block, keys: v193.H160[]): Promise<(Bytes | undefined)[]>
    getKeys(block: Block): Promise<v193.H160[]>
    getKeys(block: Block, key: v193.H160): Promise<v193.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v193.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v193.H160): AsyncIterable<v193.H160[]>
    getPairs(block: Block): Promise<[k: v193.H160, v: (Bytes | undefined)][]>
    getPairs(block: Block, key: v193.H160): Promise<[k: v193.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v193.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v193.H160): AsyncIterable<[k: v193.H160, v: (Bytes | undefined)][]>
}

export const accountStorages =  {
    v193: new StorageType('EVM.AccountStorages', 'Default', [v193.H160, v193.H256], v193.H256) as AccountStoragesV193,
}

export interface AccountStoragesV193  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v193.H256
    get(block: Block, key1: v193.H160, key2: v193.H256): Promise<(v193.H256 | undefined)>
    getMany(block: Block, keys: [v193.H160, v193.H256][]): Promise<(v193.H256 | undefined)[]>
    getKeys(block: Block): Promise<[v193.H160, v193.H256][]>
    getKeys(block: Block, key1: v193.H160): Promise<[v193.H160, v193.H256][]>
    getKeys(block: Block, key1: v193.H160, key2: v193.H256): Promise<[v193.H160, v193.H256][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v193.H160, v193.H256][]>
    getKeysPaged(pageSize: number, block: Block, key1: v193.H160): AsyncIterable<[v193.H160, v193.H256][]>
    getKeysPaged(pageSize: number, block: Block, key1: v193.H160, key2: v193.H256): AsyncIterable<[v193.H160, v193.H256][]>
    getPairs(block: Block): Promise<[k: [v193.H160, v193.H256], v: (v193.H256 | undefined)][]>
    getPairs(block: Block, key1: v193.H160): Promise<[k: [v193.H160, v193.H256], v: (v193.H256 | undefined)][]>
    getPairs(block: Block, key1: v193.H160, key2: v193.H256): Promise<[k: [v193.H160, v193.H256], v: (v193.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v193.H160, v193.H256], v: (v193.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v193.H160): AsyncIterable<[k: [v193.H160, v193.H256], v: (v193.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v193.H160, key2: v193.H256): AsyncIterable<[k: [v193.H160, v193.H256], v: (v193.H256 | undefined)][]>
}

export const accountCodesMetadata =  {
    v205: new StorageType('EVM.AccountCodesMetadata', 'Optional', [v205.H160], v205.CodeMetadata) as AccountCodesMetadataV205,
}

export interface AccountCodesMetadataV205  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v205.H160): Promise<(v205.CodeMetadata | undefined)>
    getMany(block: Block, keys: v205.H160[]): Promise<(v205.CodeMetadata | undefined)[]>
    getKeys(block: Block): Promise<v205.H160[]>
    getKeys(block: Block, key: v205.H160): Promise<v205.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v205.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v205.H160): AsyncIterable<v205.H160[]>
    getPairs(block: Block): Promise<[k: v205.H160, v: (v205.CodeMetadata | undefined)][]>
    getPairs(block: Block, key: v205.H160): Promise<[k: v205.H160, v: (v205.CodeMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v205.H160, v: (v205.CodeMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v205.H160): AsyncIterable<[k: v205.H160, v: (v205.CodeMetadata | undefined)][]>
}

export const suicided =  {
    v205: new StorageType('EVM.Suicided', 'Optional', [v205.H160], sts.unit()) as SuicidedV205,
}

export interface SuicidedV205  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v205.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v205.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v205.H160[]>
    getKeys(block: Block, key: v205.H160): Promise<v205.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v205.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v205.H160): AsyncIterable<v205.H160[]>
    getPairs(block: Block): Promise<[k: v205.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v205.H160): Promise<[k: v205.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v205.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v205.H160): AsyncIterable<[k: v205.H160, v: (null | undefined)][]>
}
