import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v138 from '../v138'

export const accountBlacklist =  {
    /**
     *  Accounts excluded from dusting.
     */
    v138: new StorageType('Duster.AccountBlacklist', 'Optional', [v138.AccountId32], sts.unit()) as AccountBlacklistV138,
}

/**
 *  Accounts excluded from dusting.
 */
export interface AccountBlacklistV138  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v138.AccountId32): Promise<(null | undefined)>
    getMany(block: Block, keys: v138.AccountId32[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v138.AccountId32[]>
    getKeys(block: Block, key: v138.AccountId32): Promise<v138.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v138.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v138.AccountId32): AsyncIterable<v138.AccountId32[]>
    getPairs(block: Block): Promise<[k: v138.AccountId32, v: (null | undefined)][]>
    getPairs(block: Block, key: v138.AccountId32): Promise<[k: v138.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v138.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v138.AccountId32): AsyncIterable<[k: v138.AccountId32, v: (null | undefined)][]>
}

export const rewardAccount =  {
    /**
     *  Account to take reward from.
     */
    v138: new StorageType('Duster.RewardAccount', 'Optional', [], v138.AccountId32) as RewardAccountV138,
}

/**
 *  Account to take reward from.
 */
export interface RewardAccountV138  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v138.AccountId32 | undefined)>
}

export const dustAccount =  {
    /**
     *  Account to send dust to.
     */
    v138: new StorageType('Duster.DustAccount', 'Optional', [], v138.AccountId32) as DustAccountV138,
}

/**
 *  Account to send dust to.
 */
export interface DustAccountV138  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v138.AccountId32 | undefined)>
}
