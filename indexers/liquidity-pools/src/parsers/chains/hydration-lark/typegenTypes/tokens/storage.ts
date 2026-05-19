import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const totalIssuance =  {
    /**
     *  The total issuance of a token type.
     */
    v405: new StorageType('Tokens.TotalIssuance', 'Default', [sts.number()], sts.bigint()) as TotalIssuanceV405,
}

/**
 *  The total issuance of a token type.
 */
export interface TotalIssuanceV405  {
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
    v405: new StorageType('Tokens.Accounts', 'Default', [v405.AccountId32, sts.number()], v405.Type_770) as AccountsV405,
}

/**
 *  The balance of a token type under an account.
 * 
 *  NOTE: If the total is ever zero, decrease account ref account.
 * 
 *  NOTE: This is only used in the case that this module is used to store
 *  balances.
 */
export interface AccountsV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.Type_770
    get(block: Block, key1: v405.AccountId32, key2: number): Promise<(v405.Type_770 | undefined)>
    getMany(block: Block, keys: [v405.AccountId32, number][]): Promise<(v405.Type_770 | undefined)[]>
    getKeys(block: Block): Promise<[v405.AccountId32, number][]>
    getKeys(block: Block, key1: v405.AccountId32): Promise<[v405.AccountId32, number][]>
    getKeys(block: Block, key1: v405.AccountId32, key2: number): Promise<[v405.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v405.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v405.AccountId32): AsyncIterable<[v405.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v405.AccountId32, key2: number): AsyncIterable<[v405.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v405.AccountId32, number], v: (v405.Type_770 | undefined)][]>
    getPairs(block: Block, key1: v405.AccountId32): Promise<[k: [v405.AccountId32, number], v: (v405.Type_770 | undefined)][]>
    getPairs(block: Block, key1: v405.AccountId32, key2: number): Promise<[k: [v405.AccountId32, number], v: (v405.Type_770 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v405.AccountId32, number], v: (v405.Type_770 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v405.AccountId32): AsyncIterable<[k: [v405.AccountId32, number], v: (v405.Type_770 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v405.AccountId32, key2: number): AsyncIterable<[k: [v405.AccountId32, number], v: (v405.Type_770 | undefined)][]>
}
