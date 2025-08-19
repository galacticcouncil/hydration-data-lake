import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const totalIssuance =  {
    /**
     *  The total issuance of a token type.
     */
    v324: new StorageType('Tokens.TotalIssuance', 'Default', [sts.number()], sts.bigint()) as TotalIssuanceV324,
}

/**
 *  The total issuance of a token type.
 */
export interface TotalIssuanceV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block, key: number): Promise<(bigint | undefined)>
    getMany(block: Block, keys: number[]): Promise<(bigint | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (bigint | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (bigint | undefined)][]>
}

export const accounts =  {
    /**
     *  The balance of a token type under an account.
     * 
     *  NOTE: If the total is ever zero, decrease account ref account.
     * 
     *  NOTE: This is only used in the case that this module is used to store
     *  balances.
     */
    v324: new StorageType('Tokens.Accounts', 'Default', [v324.AccountId32, sts.number()], v324.Type_705) as AccountsV324,
}

/**
 *  The balance of a token type under an account.
 * 
 *  NOTE: If the total is ever zero, decrease account ref account.
 * 
 *  NOTE: This is only used in the case that this module is used to store
 *  balances.
 */
export interface AccountsV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.Type_705
    get(block: Block, key1: v324.AccountId32, key2: number): Promise<(v324.Type_705 | undefined)>
    getMany(block: Block, keys: [v324.AccountId32, number][]): Promise<(v324.Type_705 | undefined)[]>
    getKeys(block: Block): Promise<[v324.AccountId32, number][]>
    getKeys(block: Block, key1: v324.AccountId32): Promise<[v324.AccountId32, number][]>
    getKeys(block: Block, key1: v324.AccountId32, key2: number): Promise<[v324.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v324.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v324.AccountId32): AsyncIterable<[v324.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v324.AccountId32, key2: number): AsyncIterable<[v324.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v324.AccountId32, number], v: (v324.Type_705 | undefined)][]>
    getPairs(block: Block, key1: v324.AccountId32): Promise<[k: [v324.AccountId32, number], v: (v324.Type_705 | undefined)][]>
    getPairs(block: Block, key1: v324.AccountId32, key2: number): Promise<[k: [v324.AccountId32, number], v: (v324.Type_705 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v324.AccountId32, number], v: (v324.Type_705 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v324.AccountId32): AsyncIterable<[k: [v324.AccountId32, number], v: (v324.Type_705 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v324.AccountId32, key2: number): AsyncIterable<[k: [v324.AccountId32, number], v: (v324.Type_705 | undefined)][]>
}
