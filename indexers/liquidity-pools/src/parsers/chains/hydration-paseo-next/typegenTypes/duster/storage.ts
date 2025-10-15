import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const accountBlacklist =  {
    /**
     *  Accounts excluded from dusting.
     */
    v324: new StorageType('Duster.AccountBlacklist', 'Optional', [v324.AccountId32], sts.unit()) as AccountBlacklistV324,
}

/**
 *  Accounts excluded from dusting.
 */
export interface AccountBlacklistV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v324.AccountId32): Promise<(null | undefined)>
    getMany(block: Block, keys: v324.AccountId32[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v324.AccountId32[]>
    getKeys(block: Block, key: v324.AccountId32): Promise<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<v324.AccountId32[]>
    getPairs(block: Block): Promise<[k: v324.AccountId32, v: (null | undefined)][]>
    getPairs(block: Block, key: v324.AccountId32): Promise<[k: v324.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<[k: v324.AccountId32, v: (null | undefined)][]>
}

export const rewardAccount =  {
    /**
     *  Account to take reward from.
     */
    v324: new StorageType('Duster.RewardAccount', 'Optional', [], v324.AccountId32) as RewardAccountV324,
}

/**
 *  Account to take reward from.
 */
export interface RewardAccountV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v324.AccountId32 | undefined)>
}

export const dustAccount =  {
    /**
     *  Account to send dust to.
     */
    v324: new StorageType('Duster.DustAccount', 'Optional', [], v324.AccountId32) as DustAccountV324,
}

/**
 *  Account to send dust to.
 */
export interface DustAccountV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v324.AccountId32 | undefined)>
}
