import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const totalIssuance =  {
    /**
     *  The total units issued in the system.
     */
    v347: new StorageType('Balances.TotalIssuance', 'Default', [], sts.bigint()) as TotalIssuanceV347,
}

/**
 *  The total units issued in the system.
 */
export interface TotalIssuanceV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const inactiveIssuance =  {
    /**
     *  The total units of outstanding deactivated balance in the system.
     */
    v347: new StorageType('Balances.InactiveIssuance', 'Default', [], sts.bigint()) as InactiveIssuanceV347,
}

/**
 *  The total units of outstanding deactivated balance in the system.
 */
export interface InactiveIssuanceV347  {
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
    v347: new StorageType('Balances.Account', 'Default', [v347.AccountId32], v347.AccountData) as AccountV347,
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
export interface AccountV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.AccountData
    get(block: Block, key: v347.AccountId32): Promise<(v347.AccountData | undefined)>
    getMany(block: Block, keys: v347.AccountId32[]): Promise<(v347.AccountData | undefined)[]>
    getKeys(block: Block): Promise<v347.AccountId32[]>
    getKeys(block: Block, key: v347.AccountId32): Promise<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<v347.AccountId32[]>
    getPairs(block: Block): Promise<[k: v347.AccountId32, v: (v347.AccountData | undefined)][]>
    getPairs(block: Block, key: v347.AccountId32): Promise<[k: v347.AccountId32, v: (v347.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.AccountId32, v: (v347.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<[k: v347.AccountId32, v: (v347.AccountData | undefined)][]>
}

export const locks =  {
    /**
     *  Any liquidity locks on some account balances.
     *  NOTE: Should only be accessed when setting, changing and freeing a lock.
     * 
     *  Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    v347: new StorageType('Balances.Locks', 'Default', [v347.AccountId32], sts.array(() => v347.BalanceLock)) as LocksV347,
}

/**
 *  Any liquidity locks on some account balances.
 *  NOTE: Should only be accessed when setting, changing and freeing a lock.
 * 
 *  Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
 */
export interface LocksV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.BalanceLock[]
    get(block: Block, key: v347.AccountId32): Promise<(v347.BalanceLock[] | undefined)>
    getMany(block: Block, keys: v347.AccountId32[]): Promise<(v347.BalanceLock[] | undefined)[]>
    getKeys(block: Block): Promise<v347.AccountId32[]>
    getKeys(block: Block, key: v347.AccountId32): Promise<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<v347.AccountId32[]>
    getPairs(block: Block): Promise<[k: v347.AccountId32, v: (v347.BalanceLock[] | undefined)][]>
    getPairs(block: Block, key: v347.AccountId32): Promise<[k: v347.AccountId32, v: (v347.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.AccountId32, v: (v347.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<[k: v347.AccountId32, v: (v347.BalanceLock[] | undefined)][]>
}

export const reserves =  {
    /**
     *  Named reserves on some account balances.
     * 
     *  Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    v347: new StorageType('Balances.Reserves', 'Default', [v347.AccountId32], sts.array(() => v347.ReserveData)) as ReservesV347,
}

/**
 *  Named reserves on some account balances.
 * 
 *  Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
 */
export interface ReservesV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.ReserveData[]
    get(block: Block, key: v347.AccountId32): Promise<(v347.ReserveData[] | undefined)>
    getMany(block: Block, keys: v347.AccountId32[]): Promise<(v347.ReserveData[] | undefined)[]>
    getKeys(block: Block): Promise<v347.AccountId32[]>
    getKeys(block: Block, key: v347.AccountId32): Promise<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<v347.AccountId32[]>
    getPairs(block: Block): Promise<[k: v347.AccountId32, v: (v347.ReserveData[] | undefined)][]>
    getPairs(block: Block, key: v347.AccountId32): Promise<[k: v347.AccountId32, v: (v347.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.AccountId32, v: (v347.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<[k: v347.AccountId32, v: (v347.ReserveData[] | undefined)][]>
}

export const holds =  {
    /**
     *  Holds on account balances.
     */
    v347: new StorageType('Balances.Holds', 'Default', [v347.AccountId32], sts.array(() => v347.IdAmount)) as HoldsV347,
}

/**
 *  Holds on account balances.
 */
export interface HoldsV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.IdAmount[]
    get(block: Block, key: v347.AccountId32): Promise<(v347.IdAmount[] | undefined)>
    getMany(block: Block, keys: v347.AccountId32[]): Promise<(v347.IdAmount[] | undefined)[]>
    getKeys(block: Block): Promise<v347.AccountId32[]>
    getKeys(block: Block, key: v347.AccountId32): Promise<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<v347.AccountId32[]>
    getPairs(block: Block): Promise<[k: v347.AccountId32, v: (v347.IdAmount[] | undefined)][]>
    getPairs(block: Block, key: v347.AccountId32): Promise<[k: v347.AccountId32, v: (v347.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.AccountId32, v: (v347.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<[k: v347.AccountId32, v: (v347.IdAmount[] | undefined)][]>
}

export const freezes =  {
    /**
     *  Freeze locks on account balances.
     */
    v347: new StorageType('Balances.Freezes', 'Default', [v347.AccountId32], sts.array(() => v347.Type_513)) as FreezesV347,
}

/**
 *  Freeze locks on account balances.
 */
export interface FreezesV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.Type_513[]
    get(block: Block, key: v347.AccountId32): Promise<(v347.Type_513[] | undefined)>
    getMany(block: Block, keys: v347.AccountId32[]): Promise<(v347.Type_513[] | undefined)[]>
    getKeys(block: Block): Promise<v347.AccountId32[]>
    getKeys(block: Block, key: v347.AccountId32): Promise<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<v347.AccountId32[]>
    getPairs(block: Block): Promise<[k: v347.AccountId32, v: (v347.Type_513[] | undefined)][]>
    getPairs(block: Block, key: v347.AccountId32): Promise<[k: v347.AccountId32, v: (v347.Type_513[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.AccountId32, v: (v347.Type_513[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<[k: v347.AccountId32, v: (v347.Type_513[] | undefined)][]>
}
