import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const accountCodes =  {
    v287: new StorageType('EVM.AccountCodes', 'Default', [v287.H160], sts.bytes()) as AccountCodesV287,
}

export interface AccountCodesV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): Bytes
    get(block: Block, key: v287.H160): Promise<(Bytes | undefined)>
    getMany(block: Block, keys: v287.H160[]): Promise<(Bytes | undefined)[]>
    getKeys(block: Block): Promise<v287.H160[]>
    getKeys(block: Block, key: v287.H160): Promise<v287.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.H160): AsyncIterable<v287.H160[]>
    getPairs(block: Block): Promise<[k: v287.H160, v: (Bytes | undefined)][]>
    getPairs(block: Block, key: v287.H160): Promise<[k: v287.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.H160): AsyncIterable<[k: v287.H160, v: (Bytes | undefined)][]>
}

export const accountCodesMetadata =  {
    v287: new StorageType('EVM.AccountCodesMetadata', 'Optional', [v287.H160], v287.CodeMetadata) as AccountCodesMetadataV287,
}

export interface AccountCodesMetadataV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v287.H160): Promise<(v287.CodeMetadata | undefined)>
    getMany(block: Block, keys: v287.H160[]): Promise<(v287.CodeMetadata | undefined)[]>
    getKeys(block: Block): Promise<v287.H160[]>
    getKeys(block: Block, key: v287.H160): Promise<v287.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.H160): AsyncIterable<v287.H160[]>
    getPairs(block: Block): Promise<[k: v287.H160, v: (v287.CodeMetadata | undefined)][]>
    getPairs(block: Block, key: v287.H160): Promise<[k: v287.H160, v: (v287.CodeMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.H160, v: (v287.CodeMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.H160): AsyncIterable<[k: v287.H160, v: (v287.CodeMetadata | undefined)][]>
}

export const accountStorages =  {
    v287: new StorageType('EVM.AccountStorages', 'Default', [v287.H160, v287.H256], v287.H256) as AccountStoragesV287,
}

export interface AccountStoragesV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.H256
    get(block: Block, key1: v287.H160, key2: v287.H256): Promise<(v287.H256 | undefined)>
    getMany(block: Block, keys: [v287.H160, v287.H256][]): Promise<(v287.H256 | undefined)[]>
    getKeys(block: Block): Promise<[v287.H160, v287.H256][]>
    getKeys(block: Block, key1: v287.H160): Promise<[v287.H160, v287.H256][]>
    getKeys(block: Block, key1: v287.H160, key2: v287.H256): Promise<[v287.H160, v287.H256][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v287.H160, v287.H256][]>
    getKeysPaged(pageSize: number, block: Block, key1: v287.H160): AsyncIterable<[v287.H160, v287.H256][]>
    getKeysPaged(pageSize: number, block: Block, key1: v287.H160, key2: v287.H256): AsyncIterable<[v287.H160, v287.H256][]>
    getPairs(block: Block): Promise<[k: [v287.H160, v287.H256], v: (v287.H256 | undefined)][]>
    getPairs(block: Block, key1: v287.H160): Promise<[k: [v287.H160, v287.H256], v: (v287.H256 | undefined)][]>
    getPairs(block: Block, key1: v287.H160, key2: v287.H256): Promise<[k: [v287.H160, v287.H256], v: (v287.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v287.H160, v287.H256], v: (v287.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v287.H160): AsyncIterable<[k: [v287.H160, v287.H256], v: (v287.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v287.H160, key2: v287.H256): AsyncIterable<[k: [v287.H160, v287.H256], v: (v287.H256 | undefined)][]>
}

export const suicided =  {
    v287: new StorageType('EVM.Suicided', 'Optional', [v287.H160], sts.unit()) as SuicidedV287,
}

export interface SuicidedV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v287.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v287.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v287.H160[]>
    getKeys(block: Block, key: v287.H160): Promise<v287.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.H160): AsyncIterable<v287.H160[]>
    getPairs(block: Block): Promise<[k: v287.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v287.H160): Promise<[k: v287.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.H160): AsyncIterable<[k: v287.H160, v: (null | undefined)][]>
}
