import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const account =  {
    /**
     *  The full account information for a particular account ID.
     */
    v276: new StorageType('System.Account', 'Default', [v276.AccountId32], v276.AccountInfo) as AccountV276,
}

/**
 *  The full account information for a particular account ID.
 */
export interface AccountV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v276.AccountInfo
    get(block: Block, key: v276.AccountId32): Promise<(v276.AccountInfo | undefined)>
    getMany(block: Block, keys: v276.AccountId32[]): Promise<(v276.AccountInfo | undefined)[]>
    getKeys(block: Block): Promise<v276.AccountId32[]>
    getKeys(block: Block, key: v276.AccountId32): Promise<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<v276.AccountId32[]>
    getPairs(block: Block): Promise<[k: v276.AccountId32, v: (v276.AccountInfo | undefined)][]>
    getPairs(block: Block, key: v276.AccountId32): Promise<[k: v276.AccountId32, v: (v276.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.AccountId32, v: (v276.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<[k: v276.AccountId32, v: (v276.AccountInfo | undefined)][]>
}
