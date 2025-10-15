import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const accountBlacklist =  {
    /**
     *  Accounts excluded from dusting.
     */
    v287: new StorageType('Duster.AccountBlacklist', 'Optional', [v287.AccountId32], sts.unit()) as AccountBlacklistV287,
}

/**
 *  Accounts excluded from dusting.
 */
export interface AccountBlacklistV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v287.AccountId32): Promise<(null | undefined)>
    getMany(block: Block, keys: v287.AccountId32[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v287.AccountId32[]>
    getKeys(block: Block, key: v287.AccountId32): Promise<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<v287.AccountId32[]>
    getPairs(block: Block): Promise<[k: v287.AccountId32, v: (null | undefined)][]>
    getPairs(block: Block, key: v287.AccountId32): Promise<[k: v287.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<[k: v287.AccountId32, v: (null | undefined)][]>
}

export const rewardAccount =  {
    /**
     *  Account to take reward from.
     */
    v287: new StorageType('Duster.RewardAccount', 'Optional', [], v287.AccountId32) as RewardAccountV287,
}

/**
 *  Account to take reward from.
 */
export interface RewardAccountV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v287.AccountId32 | undefined)>
}

export const dustAccount =  {
    /**
     *  Account to send dust to.
     */
    v287: new StorageType('Duster.DustAccount', 'Optional', [], v287.AccountId32) as DustAccountV287,
}

/**
 *  Account to send dust to.
 */
export interface DustAccountV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v287.AccountId32 | undefined)>
}
