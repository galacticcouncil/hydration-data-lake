import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const account =  {
    /**
     *  The full account information for a particular account ID.
     */
    v287: new StorageType('System.Account', 'Default', [v287.AccountId32], v287.AccountInfo) as AccountV287,
}

/**
 *  The full account information for a particular account ID.
 */
export interface AccountV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.AccountInfo
    get(block: Block, key: v287.AccountId32): Promise<(v287.AccountInfo | undefined)>
    getMany(block: Block, keys: v287.AccountId32[]): Promise<(v287.AccountInfo | undefined)[]>
    getKeys(block: Block): Promise<v287.AccountId32[]>
    getKeys(block: Block, key: v287.AccountId32): Promise<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<v287.AccountId32[]>
    getPairs(block: Block): Promise<[k: v287.AccountId32, v: (v287.AccountInfo | undefined)][]>
    getPairs(block: Block, key: v287.AccountId32): Promise<[k: v287.AccountId32, v: (v287.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.AccountId32, v: (v287.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<[k: v287.AccountId32, v: (v287.AccountInfo | undefined)][]>
}
