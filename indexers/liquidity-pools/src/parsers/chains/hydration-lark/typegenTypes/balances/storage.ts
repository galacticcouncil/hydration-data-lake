import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const totalIssuance =  {
    /**
     *  The total units issued in the system.
     */
    v405: new StorageType('Balances.TotalIssuance', 'Default', [], sts.bigint()) as TotalIssuanceV405,
}

/**
 *  The total units issued in the system.
 */
export interface TotalIssuanceV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const inactiveIssuance =  {
    /**
     *  The total units of outstanding deactivated balance in the system.
     */
    v405: new StorageType('Balances.InactiveIssuance', 'Default', [], sts.bigint()) as InactiveIssuanceV405,
}

/**
 *  The total units of outstanding deactivated balance in the system.
 */
export interface InactiveIssuanceV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const account =  {
    /**
     *  The Balances pallet example of storing the balance of an account.
     * 
     *  # Example
     * 
     *  ```nocompile
     *   impl pallet_balances::Config for Runtime {
     *     type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
     *   }
     *  ```
     * 
     *  You can also store the balance of an account in the `System` pallet.
     * 
     *  # Example
     * 
     *  ```nocompile
     *   impl pallet_balances::Config for Runtime {
     *    type AccountStore = System
     *   }
     *  ```
     * 
     *  But this comes with tradeoffs, storing account balances in the system pallet stores
     *  `frame_system` data alongside the account data contrary to storing account balances in the
     *  `Balances` pallet, which uses a `StorageMap` to store balances data only.
     *  NOTE: This is only used in the case that this pallet is used to store balances.
     */
    v405: new StorageType('Balances.Account', 'Default', [v405.AccountId32], v405.AccountData) as AccountV405,
}

/**
 *  The Balances pallet example of storing the balance of an account.
 * 
 *  # Example
 * 
 *  ```nocompile
 *   impl pallet_balances::Config for Runtime {
 *     type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
 *   }
 *  ```
 * 
 *  You can also store the balance of an account in the `System` pallet.
 * 
 *  # Example
 * 
 *  ```nocompile
 *   impl pallet_balances::Config for Runtime {
 *    type AccountStore = System
 *   }
 *  ```
 * 
 *  But this comes with tradeoffs, storing account balances in the system pallet stores
 *  `frame_system` data alongside the account data contrary to storing account balances in the
 *  `Balances` pallet, which uses a `StorageMap` to store balances data only.
 *  NOTE: This is only used in the case that this pallet is used to store balances.
 */
export interface AccountV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.AccountData
    get(block: Block, key: v405.AccountId32): Promise<(v405.AccountData | undefined)>
    getMany(block: Block, keys: v405.AccountId32[]): Promise<(v405.AccountData | undefined)[]>
    getKeys(block: Block): Promise<v405.AccountId32[]>
    getKeys(block: Block, key: v405.AccountId32): Promise<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<v405.AccountId32[]>
    getPairs(block: Block): Promise<[k: v405.AccountId32, v: (v405.AccountData | undefined)][]>
    getPairs(block: Block, key: v405.AccountId32): Promise<[k: v405.AccountId32, v: (v405.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v405.AccountId32, v: (v405.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<[k: v405.AccountId32, v: (v405.AccountData | undefined)][]>
}

export const locks =  {
    /**
     *  Any liquidity locks on some account balances.
     *  NOTE: Should only be accessed when setting, changing and freeing a lock.
     * 
     *  Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    v405: new StorageType('Balances.Locks', 'Default', [v405.AccountId32], sts.array(() => v405.BalanceLock)) as LocksV405,
}

/**
 *  Any liquidity locks on some account balances.
 *  NOTE: Should only be accessed when setting, changing and freeing a lock.
 * 
 *  Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
 */
export interface LocksV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.BalanceLock[]
    get(block: Block, key: v405.AccountId32): Promise<(v405.BalanceLock[] | undefined)>
    getMany(block: Block, keys: v405.AccountId32[]): Promise<(v405.BalanceLock[] | undefined)[]>
    getKeys(block: Block): Promise<v405.AccountId32[]>
    getKeys(block: Block, key: v405.AccountId32): Promise<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<v405.AccountId32[]>
    getPairs(block: Block): Promise<[k: v405.AccountId32, v: (v405.BalanceLock[] | undefined)][]>
    getPairs(block: Block, key: v405.AccountId32): Promise<[k: v405.AccountId32, v: (v405.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v405.AccountId32, v: (v405.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<[k: v405.AccountId32, v: (v405.BalanceLock[] | undefined)][]>
}

export const reserves =  {
    /**
     *  Named reserves on some account balances.
     * 
     *  Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    v405: new StorageType('Balances.Reserves', 'Default', [v405.AccountId32], sts.array(() => v405.ReserveData)) as ReservesV405,
}

/**
 *  Named reserves on some account balances.
 * 
 *  Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
 */
export interface ReservesV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.ReserveData[]
    get(block: Block, key: v405.AccountId32): Promise<(v405.ReserveData[] | undefined)>
    getMany(block: Block, keys: v405.AccountId32[]): Promise<(v405.ReserveData[] | undefined)[]>
    getKeys(block: Block): Promise<v405.AccountId32[]>
    getKeys(block: Block, key: v405.AccountId32): Promise<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<v405.AccountId32[]>
    getPairs(block: Block): Promise<[k: v405.AccountId32, v: (v405.ReserveData[] | undefined)][]>
    getPairs(block: Block, key: v405.AccountId32): Promise<[k: v405.AccountId32, v: (v405.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v405.AccountId32, v: (v405.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<[k: v405.AccountId32, v: (v405.ReserveData[] | undefined)][]>
}

export const holds =  {
    /**
     *  Holds on account balances.
     */
    v405: new StorageType('Balances.Holds', 'Default', [v405.AccountId32], sts.array(() => v405.IdAmount)) as HoldsV405,
}

/**
 *  Holds on account balances.
 */
export interface HoldsV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.IdAmount[]
    get(block: Block, key: v405.AccountId32): Promise<(v405.IdAmount[] | undefined)>
    getMany(block: Block, keys: v405.AccountId32[]): Promise<(v405.IdAmount[] | undefined)[]>
    getKeys(block: Block): Promise<v405.AccountId32[]>
    getKeys(block: Block, key: v405.AccountId32): Promise<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<v405.AccountId32[]>
    getPairs(block: Block): Promise<[k: v405.AccountId32, v: (v405.IdAmount[] | undefined)][]>
    getPairs(block: Block, key: v405.AccountId32): Promise<[k: v405.AccountId32, v: (v405.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v405.AccountId32, v: (v405.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<[k: v405.AccountId32, v: (v405.IdAmount[] | undefined)][]>
}

export const freezes =  {
    /**
     *  Freeze locks on account balances.
     */
    v405: new StorageType('Balances.Freezes', 'Default', [v405.AccountId32], sts.array(() => v405.Type_586)) as FreezesV405,
}

/**
 *  Freeze locks on account balances.
 */
export interface FreezesV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.Type_586[]
    get(block: Block, key: v405.AccountId32): Promise<(v405.Type_586[] | undefined)>
    getMany(block: Block, keys: v405.AccountId32[]): Promise<(v405.Type_586[] | undefined)[]>
    getKeys(block: Block): Promise<v405.AccountId32[]>
    getKeys(block: Block, key: v405.AccountId32): Promise<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<v405.AccountId32[]>
    getPairs(block: Block): Promise<[k: v405.AccountId32, v: (v405.Type_586[] | undefined)][]>
    getPairs(block: Block, key: v405.AccountId32): Promise<[k: v405.AccountId32, v: (v405.Type_586[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v405.AccountId32, v: (v405.Type_586[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<[k: v405.AccountId32, v: (v405.Type_586[] | undefined)][]>
}
