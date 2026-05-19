import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const accountCodes =  {
    v405: new StorageType('EVM.AccountCodes', 'Default', [v405.H160], sts.bytes()) as AccountCodesV405,
}

export interface AccountCodesV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): Bytes
    get(block: Block, key: v405.H160): Promise<(Bytes | undefined)>
    getMany(block: Block, keys: v405.H160[]): Promise<(Bytes | undefined)[]>
    getKeys(block: Block): Promise<v405.H160[]>
    getKeys(block: Block, key: v405.H160): Promise<v405.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v405.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v405.H160): AsyncIterable<v405.H160[]>
    getPairs(block: Block): Promise<[k: v405.H160, v: (Bytes | undefined)][]>
    getPairs(block: Block, key: v405.H160): Promise<[k: v405.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v405.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v405.H160): AsyncIterable<[k: v405.H160, v: (Bytes | undefined)][]>
}

export const accountCodesMetadata =  {
    v405: new StorageType('EVM.AccountCodesMetadata', 'Optional', [v405.H160], v405.CodeMetadata) as AccountCodesMetadataV405,
}

export interface AccountCodesMetadataV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v405.H160): Promise<(v405.CodeMetadata | undefined)>
    getMany(block: Block, keys: v405.H160[]): Promise<(v405.CodeMetadata | undefined)[]>
    getKeys(block: Block): Promise<v405.H160[]>
    getKeys(block: Block, key: v405.H160): Promise<v405.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v405.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v405.H160): AsyncIterable<v405.H160[]>
    getPairs(block: Block): Promise<[k: v405.H160, v: (v405.CodeMetadata | undefined)][]>
    getPairs(block: Block, key: v405.H160): Promise<[k: v405.H160, v: (v405.CodeMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v405.H160, v: (v405.CodeMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v405.H160): AsyncIterable<[k: v405.H160, v: (v405.CodeMetadata | undefined)][]>
}

export const accountStorages =  {
    v405: new StorageType('EVM.AccountStorages', 'Default', [v405.H160, v405.H256], v405.H256) as AccountStoragesV405,
}

export interface AccountStoragesV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.H256
    get(block: Block, key1: v405.H160, key2: v405.H256): Promise<(v405.H256 | undefined)>
    getMany(block: Block, keys: [v405.H160, v405.H256][]): Promise<(v405.H256 | undefined)[]>
    getKeys(block: Block): Promise<[v405.H160, v405.H256][]>
    getKeys(block: Block, key1: v405.H160): Promise<[v405.H160, v405.H256][]>
    getKeys(block: Block, key1: v405.H160, key2: v405.H256): Promise<[v405.H160, v405.H256][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v405.H160, v405.H256][]>
    getKeysPaged(pageSize: number, block: Block, key1: v405.H160): AsyncIterable<[v405.H160, v405.H256][]>
    getKeysPaged(pageSize: number, block: Block, key1: v405.H160, key2: v405.H256): AsyncIterable<[v405.H160, v405.H256][]>
    getPairs(block: Block): Promise<[k: [v405.H160, v405.H256], v: (v405.H256 | undefined)][]>
    getPairs(block: Block, key1: v405.H160): Promise<[k: [v405.H160, v405.H256], v: (v405.H256 | undefined)][]>
    getPairs(block: Block, key1: v405.H160, key2: v405.H256): Promise<[k: [v405.H160, v405.H256], v: (v405.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v405.H160, v405.H256], v: (v405.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v405.H160): AsyncIterable<[k: [v405.H160, v405.H256], v: (v405.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v405.H160, key2: v405.H256): AsyncIterable<[k: [v405.H160, v405.H256], v: (v405.H256 | undefined)][]>
}
