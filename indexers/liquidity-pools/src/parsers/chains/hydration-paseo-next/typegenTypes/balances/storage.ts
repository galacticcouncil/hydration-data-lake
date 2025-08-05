import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const totalIssuance =  {
    /**
     *  The total units issued in the system.
     */
    v324: new StorageType('Balances.TotalIssuance', 'Default', [], sts.bigint()) as TotalIssuanceV324,
}

/**
 *  The total units issued in the system.
 */
export interface TotalIssuanceV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const inactiveIssuance =  {
    /**
     *  The total units of outstanding deactivated balance in the system.
     */
    v324: new StorageType('Balances.InactiveIssuance', 'Default', [], sts.bigint()) as InactiveIssuanceV324,
}

/**
 *  The total units of outstanding deactivated balance in the system.
 */
export interface InactiveIssuanceV324  {
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
    v324: new StorageType('Balances.Account', 'Default', [v324.AccountId32], v324.AccountData) as AccountV324,
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
export interface AccountV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.AccountData
    get(block: Block, key: v324.AccountId32): Promise<(v324.AccountData | undefined)>
    getMany(block: Block, keys: v324.AccountId32[]): Promise<(v324.AccountData | undefined)[]>
    getKeys(block: Block): Promise<v324.AccountId32[]>
    getKeys(block: Block, key: v324.AccountId32): Promise<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<v324.AccountId32[]>
    getPairs(block: Block): Promise<[k: v324.AccountId32, v: (v324.AccountData | undefined)][]>
    getPairs(block: Block, key: v324.AccountId32): Promise<[k: v324.AccountId32, v: (v324.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.AccountId32, v: (v324.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<[k: v324.AccountId32, v: (v324.AccountData | undefined)][]>
}

export const locks =  {
    /**
     *  Any liquidity locks on some account balances.
     *  NOTE: Should only be accessed when setting, changing and freeing a lock.
     * 
     *  Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    v324: new StorageType('Balances.Locks', 'Default', [v324.AccountId32], sts.array(() => v324.BalanceLock)) as LocksV324,
}

/**
 *  Any liquidity locks on some account balances.
 *  NOTE: Should only be accessed when setting, changing and freeing a lock.
 * 
 *  Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
 */
export interface LocksV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.BalanceLock[]
    get(block: Block, key: v324.AccountId32): Promise<(v324.BalanceLock[] | undefined)>
    getMany(block: Block, keys: v324.AccountId32[]): Promise<(v324.BalanceLock[] | undefined)[]>
    getKeys(block: Block): Promise<v324.AccountId32[]>
    getKeys(block: Block, key: v324.AccountId32): Promise<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<v324.AccountId32[]>
    getPairs(block: Block): Promise<[k: v324.AccountId32, v: (v324.BalanceLock[] | undefined)][]>
    getPairs(block: Block, key: v324.AccountId32): Promise<[k: v324.AccountId32, v: (v324.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.AccountId32, v: (v324.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<[k: v324.AccountId32, v: (v324.BalanceLock[] | undefined)][]>
}

export const reserves =  {
    /**
     *  Named reserves on some account balances.
     * 
     *  Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    v324: new StorageType('Balances.Reserves', 'Default', [v324.AccountId32], sts.array(() => v324.ReserveData)) as ReservesV324,
}

/**
 *  Named reserves on some account balances.
 * 
 *  Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
 */
export interface ReservesV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.ReserveData[]
    get(block: Block, key: v324.AccountId32): Promise<(v324.ReserveData[] | undefined)>
    getMany(block: Block, keys: v324.AccountId32[]): Promise<(v324.ReserveData[] | undefined)[]>
    getKeys(block: Block): Promise<v324.AccountId32[]>
    getKeys(block: Block, key: v324.AccountId32): Promise<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<v324.AccountId32[]>
    getPairs(block: Block): Promise<[k: v324.AccountId32, v: (v324.ReserveData[] | undefined)][]>
    getPairs(block: Block, key: v324.AccountId32): Promise<[k: v324.AccountId32, v: (v324.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.AccountId32, v: (v324.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<[k: v324.AccountId32, v: (v324.ReserveData[] | undefined)][]>
}

export const holds =  {
    /**
     *  Holds on account balances.
     */
    v324: new StorageType('Balances.Holds', 'Default', [v324.AccountId32], sts.array(() => v324.IdAmount)) as HoldsV324,
}

/**
 *  Holds on account balances.
 */
export interface HoldsV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.IdAmount[]
    get(block: Block, key: v324.AccountId32): Promise<(v324.IdAmount[] | undefined)>
    getMany(block: Block, keys: v324.AccountId32[]): Promise<(v324.IdAmount[] | undefined)[]>
    getKeys(block: Block): Promise<v324.AccountId32[]>
    getKeys(block: Block, key: v324.AccountId32): Promise<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<v324.AccountId32[]>
    getPairs(block: Block): Promise<[k: v324.AccountId32, v: (v324.IdAmount[] | undefined)][]>
    getPairs(block: Block, key: v324.AccountId32): Promise<[k: v324.AccountId32, v: (v324.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.AccountId32, v: (v324.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<[k: v324.AccountId32, v: (v324.IdAmount[] | undefined)][]>
}

export const freezes =  {
    /**
     *  Freeze locks on account balances.
     */
    v324: new StorageType('Balances.Freezes', 'Default', [v324.AccountId32], sts.array(() => v324.Type_521)) as FreezesV324,
}

/**
 *  Freeze locks on account balances.
 */
export interface FreezesV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.Type_521[]
    get(block: Block, key: v324.AccountId32): Promise<(v324.Type_521[] | undefined)>
    getMany(block: Block, keys: v324.AccountId32[]): Promise<(v324.Type_521[] | undefined)[]>
    getKeys(block: Block): Promise<v324.AccountId32[]>
    getKeys(block: Block, key: v324.AccountId32): Promise<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<v324.AccountId32[]>
    getPairs(block: Block): Promise<[k: v324.AccountId32, v: (v324.Type_521[] | undefined)][]>
    getPairs(block: Block, key: v324.AccountId32): Promise<[k: v324.AccountId32, v: (v324.Type_521[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.AccountId32, v: (v324.Type_521[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<[k: v324.AccountId32, v: (v324.Type_521[] | undefined)][]>
}
