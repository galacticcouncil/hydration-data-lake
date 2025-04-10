import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const totalIssuance =  {
    /**
     *  The total units issued in the system.
     */
    v276: new StorageType('Balances.TotalIssuance', 'Default', [], sts.bigint()) as TotalIssuanceV276,
}

/**
 *  The total units issued in the system.
 */
export interface TotalIssuanceV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const inactiveIssuance =  {
    /**
     *  The total units of outstanding deactivated balance in the system.
     */
    v276: new StorageType('Balances.InactiveIssuance', 'Default', [], sts.bigint()) as InactiveIssuanceV276,
}

/**
 *  The total units of outstanding deactivated balance in the system.
 */
export interface InactiveIssuanceV276  {
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
    v276: new StorageType('Balances.Account', 'Default', [v276.AccountId32], v276.AccountData) as AccountV276,
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
export interface AccountV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v276.AccountData
    get(block: Block, key: v276.AccountId32): Promise<(v276.AccountData | undefined)>
    getMany(block: Block, keys: v276.AccountId32[]): Promise<(v276.AccountData | undefined)[]>
    getKeys(block: Block): Promise<v276.AccountId32[]>
    getKeys(block: Block, key: v276.AccountId32): Promise<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<v276.AccountId32[]>
    getPairs(block: Block): Promise<[k: v276.AccountId32, v: (v276.AccountData | undefined)][]>
    getPairs(block: Block, key: v276.AccountId32): Promise<[k: v276.AccountId32, v: (v276.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.AccountId32, v: (v276.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<[k: v276.AccountId32, v: (v276.AccountData | undefined)][]>
}

export const locks =  {
    /**
     *  Any liquidity locks on some account balances.
     *  NOTE: Should only be accessed when setting, changing and freeing a lock.
     * 
     *  Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    v276: new StorageType('Balances.Locks', 'Default', [v276.AccountId32], sts.array(() => v276.BalanceLock)) as LocksV276,
}

/**
 *  Any liquidity locks on some account balances.
 *  NOTE: Should only be accessed when setting, changing and freeing a lock.
 * 
 *  Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
 */
export interface LocksV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v276.BalanceLock[]
    get(block: Block, key: v276.AccountId32): Promise<(v276.BalanceLock[] | undefined)>
    getMany(block: Block, keys: v276.AccountId32[]): Promise<(v276.BalanceLock[] | undefined)[]>
    getKeys(block: Block): Promise<v276.AccountId32[]>
    getKeys(block: Block, key: v276.AccountId32): Promise<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<v276.AccountId32[]>
    getPairs(block: Block): Promise<[k: v276.AccountId32, v: (v276.BalanceLock[] | undefined)][]>
    getPairs(block: Block, key: v276.AccountId32): Promise<[k: v276.AccountId32, v: (v276.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.AccountId32, v: (v276.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<[k: v276.AccountId32, v: (v276.BalanceLock[] | undefined)][]>
}

export const reserves =  {
    /**
     *  Named reserves on some account balances.
     * 
     *  Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    v276: new StorageType('Balances.Reserves', 'Default', [v276.AccountId32], sts.array(() => v276.ReserveData)) as ReservesV276,
}

/**
 *  Named reserves on some account balances.
 * 
 *  Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
 */
export interface ReservesV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v276.ReserveData[]
    get(block: Block, key: v276.AccountId32): Promise<(v276.ReserveData[] | undefined)>
    getMany(block: Block, keys: v276.AccountId32[]): Promise<(v276.ReserveData[] | undefined)[]>
    getKeys(block: Block): Promise<v276.AccountId32[]>
    getKeys(block: Block, key: v276.AccountId32): Promise<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<v276.AccountId32[]>
    getPairs(block: Block): Promise<[k: v276.AccountId32, v: (v276.ReserveData[] | undefined)][]>
    getPairs(block: Block, key: v276.AccountId32): Promise<[k: v276.AccountId32, v: (v276.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.AccountId32, v: (v276.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<[k: v276.AccountId32, v: (v276.ReserveData[] | undefined)][]>
}

export const holds =  {
    /**
     *  Holds on account balances.
     */
    v276: new StorageType('Balances.Holds', 'Default', [v276.AccountId32], sts.array(() => v276.IdAmount)) as HoldsV276,
}

/**
 *  Holds on account balances.
 */
export interface HoldsV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v276.IdAmount[]
    get(block: Block, key: v276.AccountId32): Promise<(v276.IdAmount[] | undefined)>
    getMany(block: Block, keys: v276.AccountId32[]): Promise<(v276.IdAmount[] | undefined)[]>
    getKeys(block: Block): Promise<v276.AccountId32[]>
    getKeys(block: Block, key: v276.AccountId32): Promise<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<v276.AccountId32[]>
    getPairs(block: Block): Promise<[k: v276.AccountId32, v: (v276.IdAmount[] | undefined)][]>
    getPairs(block: Block, key: v276.AccountId32): Promise<[k: v276.AccountId32, v: (v276.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.AccountId32, v: (v276.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<[k: v276.AccountId32, v: (v276.IdAmount[] | undefined)][]>
}

export const freezes =  {
    /**
     *  Freeze locks on account balances.
     */
    v276: new StorageType('Balances.Freezes', 'Default', [v276.AccountId32], sts.array(() => v276.Type_490)) as FreezesV276,
}

/**
 *  Freeze locks on account balances.
 */
export interface FreezesV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v276.Type_490[]
    get(block: Block, key: v276.AccountId32): Promise<(v276.Type_490[] | undefined)>
    getMany(block: Block, keys: v276.AccountId32[]): Promise<(v276.Type_490[] | undefined)[]>
    getKeys(block: Block): Promise<v276.AccountId32[]>
    getKeys(block: Block, key: v276.AccountId32): Promise<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<v276.AccountId32[]>
    getPairs(block: Block): Promise<[k: v276.AccountId32, v: (v276.Type_490[] | undefined)][]>
    getPairs(block: Block, key: v276.AccountId32): Promise<[k: v276.AccountId32, v: (v276.Type_490[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.AccountId32, v: (v276.Type_490[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<[k: v276.AccountId32, v: (v276.Type_490[] | undefined)][]>
}
