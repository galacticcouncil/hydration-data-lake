import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const accountCodes =  {
    v347: new StorageType('EVM.AccountCodes', 'Default', [v347.H160], sts.bytes()) as AccountCodesV347,
}

export interface AccountCodesV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): Bytes
    get(block: Block, key: v347.H160): Promise<(Bytes | undefined)>
    getMany(block: Block, keys: v347.H160[]): Promise<(Bytes | undefined)[]>
    getKeys(block: Block): Promise<v347.H160[]>
    getKeys(block: Block, key: v347.H160): Promise<v347.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.H160): AsyncIterable<v347.H160[]>
    getPairs(block: Block): Promise<[k: v347.H160, v: (Bytes | undefined)][]>
    getPairs(block: Block, key: v347.H160): Promise<[k: v347.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.H160): AsyncIterable<[k: v347.H160, v: (Bytes | undefined)][]>
}

export const accountCodesMetadata =  {
    v347: new StorageType('EVM.AccountCodesMetadata', 'Optional', [v347.H160], v347.CodeMetadata) as AccountCodesMetadataV347,
}

export interface AccountCodesMetadataV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v347.H160): Promise<(v347.CodeMetadata | undefined)>
    getMany(block: Block, keys: v347.H160[]): Promise<(v347.CodeMetadata | undefined)[]>
    getKeys(block: Block): Promise<v347.H160[]>
    getKeys(block: Block, key: v347.H160): Promise<v347.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.H160): AsyncIterable<v347.H160[]>
    getPairs(block: Block): Promise<[k: v347.H160, v: (v347.CodeMetadata | undefined)][]>
    getPairs(block: Block, key: v347.H160): Promise<[k: v347.H160, v: (v347.CodeMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.H160, v: (v347.CodeMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.H160): AsyncIterable<[k: v347.H160, v: (v347.CodeMetadata | undefined)][]>
}

export const accountStorages =  {
    v347: new StorageType('EVM.AccountStorages', 'Default', [v347.H160, v347.H256], v347.H256) as AccountStoragesV347,
}

export interface AccountStoragesV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.H256
    get(block: Block, key1: v347.H160, key2: v347.H256): Promise<(v347.H256 | undefined)>
    getMany(block: Block, keys: [v347.H160, v347.H256][]): Promise<(v347.H256 | undefined)[]>
    getKeys(block: Block): Promise<[v347.H160, v347.H256][]>
    getKeys(block: Block, key1: v347.H160): Promise<[v347.H160, v347.H256][]>
    getKeys(block: Block, key1: v347.H160, key2: v347.H256): Promise<[v347.H160, v347.H256][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v347.H160, v347.H256][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.H160): AsyncIterable<[v347.H160, v347.H256][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.H160, key2: v347.H256): AsyncIterable<[v347.H160, v347.H256][]>
    getPairs(block: Block): Promise<[k: [v347.H160, v347.H256], v: (v347.H256 | undefined)][]>
    getPairs(block: Block, key1: v347.H160): Promise<[k: [v347.H160, v347.H256], v: (v347.H256 | undefined)][]>
    getPairs(block: Block, key1: v347.H160, key2: v347.H256): Promise<[k: [v347.H160, v347.H256], v: (v347.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v347.H160, v347.H256], v: (v347.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.H160): AsyncIterable<[k: [v347.H160, v347.H256], v: (v347.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.H160, key2: v347.H256): AsyncIterable<[k: [v347.H160, v347.H256], v: (v347.H256 | undefined)][]>
}

export const suicided =  {
    v347: new StorageType('EVM.Suicided', 'Optional', [v347.H160], sts.unit()) as SuicidedV347,
}

export interface SuicidedV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v347.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v347.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v347.H160[]>
    getKeys(block: Block, key: v347.H160): Promise<v347.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.H160): AsyncIterable<v347.H160[]>
    getPairs(block: Block): Promise<[k: v347.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v347.H160): Promise<[k: v347.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.H160): AsyncIterable<[k: v347.H160, v: (null | undefined)][]>
}
