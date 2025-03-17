import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const accountCodes =  {
    v276: new StorageType('EVM.AccountCodes', 'Default', [v276.H160], sts.bytes()) as AccountCodesV276,
}

export interface AccountCodesV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): Bytes
    get(block: Block, key: v276.H160): Promise<(Bytes | undefined)>
    getMany(block: Block, keys: v276.H160[]): Promise<(Bytes | undefined)[]>
    getKeys(block: Block): Promise<v276.H160[]>
    getKeys(block: Block, key: v276.H160): Promise<v276.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.H160): AsyncIterable<v276.H160[]>
    getPairs(block: Block): Promise<[k: v276.H160, v: (Bytes | undefined)][]>
    getPairs(block: Block, key: v276.H160): Promise<[k: v276.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.H160): AsyncIterable<[k: v276.H160, v: (Bytes | undefined)][]>
}

export const accountCodesMetadata =  {
    v276: new StorageType('EVM.AccountCodesMetadata', 'Optional', [v276.H160], v276.CodeMetadata) as AccountCodesMetadataV276,
}

export interface AccountCodesMetadataV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v276.H160): Promise<(v276.CodeMetadata | undefined)>
    getMany(block: Block, keys: v276.H160[]): Promise<(v276.CodeMetadata | undefined)[]>
    getKeys(block: Block): Promise<v276.H160[]>
    getKeys(block: Block, key: v276.H160): Promise<v276.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.H160): AsyncIterable<v276.H160[]>
    getPairs(block: Block): Promise<[k: v276.H160, v: (v276.CodeMetadata | undefined)][]>
    getPairs(block: Block, key: v276.H160): Promise<[k: v276.H160, v: (v276.CodeMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.H160, v: (v276.CodeMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.H160): AsyncIterable<[k: v276.H160, v: (v276.CodeMetadata | undefined)][]>
}

export const accountStorages =  {
    v276: new StorageType('EVM.AccountStorages', 'Default', [v276.H160, v276.H256], v276.H256) as AccountStoragesV276,
}

export interface AccountStoragesV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v276.H256
    get(block: Block, key1: v276.H160, key2: v276.H256): Promise<(v276.H256 | undefined)>
    getMany(block: Block, keys: [v276.H160, v276.H256][]): Promise<(v276.H256 | undefined)[]>
    getKeys(block: Block): Promise<[v276.H160, v276.H256][]>
    getKeys(block: Block, key1: v276.H160): Promise<[v276.H160, v276.H256][]>
    getKeys(block: Block, key1: v276.H160, key2: v276.H256): Promise<[v276.H160, v276.H256][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v276.H160, v276.H256][]>
    getKeysPaged(pageSize: number, block: Block, key1: v276.H160): AsyncIterable<[v276.H160, v276.H256][]>
    getKeysPaged(pageSize: number, block: Block, key1: v276.H160, key2: v276.H256): AsyncIterable<[v276.H160, v276.H256][]>
    getPairs(block: Block): Promise<[k: [v276.H160, v276.H256], v: (v276.H256 | undefined)][]>
    getPairs(block: Block, key1: v276.H160): Promise<[k: [v276.H160, v276.H256], v: (v276.H256 | undefined)][]>
    getPairs(block: Block, key1: v276.H160, key2: v276.H256): Promise<[k: [v276.H160, v276.H256], v: (v276.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v276.H160, v276.H256], v: (v276.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v276.H160): AsyncIterable<[k: [v276.H160, v276.H256], v: (v276.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v276.H160, key2: v276.H256): AsyncIterable<[k: [v276.H160, v276.H256], v: (v276.H256 | undefined)][]>
}

export const suicided =  {
    v276: new StorageType('EVM.Suicided', 'Optional', [v276.H160], sts.unit()) as SuicidedV276,
}

export interface SuicidedV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v276.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v276.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v276.H160[]>
    getKeys(block: Block, key: v276.H160): Promise<v276.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.H160): AsyncIterable<v276.H160[]>
    getPairs(block: Block): Promise<[k: v276.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v276.H160): Promise<[k: v276.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.H160): AsyncIterable<[k: v276.H160, v: (null | undefined)][]>
}
