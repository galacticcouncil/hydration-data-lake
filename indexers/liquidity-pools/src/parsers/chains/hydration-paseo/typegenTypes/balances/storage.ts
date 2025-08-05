import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const totalIssuance =  {
    /**
     *  The total units issued in the system.
     */
    v287: new StorageType('Balances.TotalIssuance', 'Default', [], sts.bigint()) as TotalIssuanceV287,
}

/**
 *  The total units issued in the system.
 */
export interface TotalIssuanceV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const inactiveIssuance =  {
    /**
     *  The total units of outstanding deactivated balance in the system.
     */
    v287: new StorageType('Balances.InactiveIssuance', 'Default', [], sts.bigint()) as InactiveIssuanceV287,
}

/**
 *  The total units of outstanding deactivated balance in the system.
 */
export interface InactiveIssuanceV287  {
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
    v287: new StorageType('Balances.Account', 'Default', [v287.AccountId32], v287.AccountData) as AccountV287,
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
export interface AccountV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.AccountData
    get(block: Block, key: v287.AccountId32): Promise<(v287.AccountData | undefined)>
    getMany(block: Block, keys: v287.AccountId32[]): Promise<(v287.AccountData | undefined)[]>
    getKeys(block: Block): Promise<v287.AccountId32[]>
    getKeys(block: Block, key: v287.AccountId32): Promise<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<v287.AccountId32[]>
    getPairs(block: Block): Promise<[k: v287.AccountId32, v: (v287.AccountData | undefined)][]>
    getPairs(block: Block, key: v287.AccountId32): Promise<[k: v287.AccountId32, v: (v287.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.AccountId32, v: (v287.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<[k: v287.AccountId32, v: (v287.AccountData | undefined)][]>
}

export const locks =  {
    /**
     *  Any liquidity locks on some account balances.
     *  NOTE: Should only be accessed when setting, changing and freeing a lock.
     * 
     *  Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    v287: new StorageType('Balances.Locks', 'Default', [v287.AccountId32], sts.array(() => v287.BalanceLock)) as LocksV287,
}

/**
 *  Any liquidity locks on some account balances.
 *  NOTE: Should only be accessed when setting, changing and freeing a lock.
 * 
 *  Use of locks is deprecated in favour of freezes. See `https://github.com/paritytech/substrate/pull/12951/`
 */
export interface LocksV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.BalanceLock[]
    get(block: Block, key: v287.AccountId32): Promise<(v287.BalanceLock[] | undefined)>
    getMany(block: Block, keys: v287.AccountId32[]): Promise<(v287.BalanceLock[] | undefined)[]>
    getKeys(block: Block): Promise<v287.AccountId32[]>
    getKeys(block: Block, key: v287.AccountId32): Promise<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<v287.AccountId32[]>
    getPairs(block: Block): Promise<[k: v287.AccountId32, v: (v287.BalanceLock[] | undefined)][]>
    getPairs(block: Block, key: v287.AccountId32): Promise<[k: v287.AccountId32, v: (v287.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.AccountId32, v: (v287.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<[k: v287.AccountId32, v: (v287.BalanceLock[] | undefined)][]>
}

export const reserves =  {
    /**
     *  Named reserves on some account balances.
     * 
     *  Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
     */
    v287: new StorageType('Balances.Reserves', 'Default', [v287.AccountId32], sts.array(() => v287.ReserveData)) as ReservesV287,
}

/**
 *  Named reserves on some account balances.
 * 
 *  Use of reserves is deprecated in favour of holds. See `https://github.com/paritytech/substrate/pull/12951/`
 */
export interface ReservesV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.ReserveData[]
    get(block: Block, key: v287.AccountId32): Promise<(v287.ReserveData[] | undefined)>
    getMany(block: Block, keys: v287.AccountId32[]): Promise<(v287.ReserveData[] | undefined)[]>
    getKeys(block: Block): Promise<v287.AccountId32[]>
    getKeys(block: Block, key: v287.AccountId32): Promise<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<v287.AccountId32[]>
    getPairs(block: Block): Promise<[k: v287.AccountId32, v: (v287.ReserveData[] | undefined)][]>
    getPairs(block: Block, key: v287.AccountId32): Promise<[k: v287.AccountId32, v: (v287.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.AccountId32, v: (v287.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<[k: v287.AccountId32, v: (v287.ReserveData[] | undefined)][]>
}

export const holds =  {
    /**
     *  Holds on account balances.
     */
    v287: new StorageType('Balances.Holds', 'Default', [v287.AccountId32], sts.array(() => v287.IdAmount)) as HoldsV287,
}

/**
 *  Holds on account balances.
 */
export interface HoldsV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.IdAmount[]
    get(block: Block, key: v287.AccountId32): Promise<(v287.IdAmount[] | undefined)>
    getMany(block: Block, keys: v287.AccountId32[]): Promise<(v287.IdAmount[] | undefined)[]>
    getKeys(block: Block): Promise<v287.AccountId32[]>
    getKeys(block: Block, key: v287.AccountId32): Promise<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<v287.AccountId32[]>
    getPairs(block: Block): Promise<[k: v287.AccountId32, v: (v287.IdAmount[] | undefined)][]>
    getPairs(block: Block, key: v287.AccountId32): Promise<[k: v287.AccountId32, v: (v287.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.AccountId32, v: (v287.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<[k: v287.AccountId32, v: (v287.IdAmount[] | undefined)][]>
}

export const freezes =  {
    /**
     *  Freeze locks on account balances.
     */
    v287: new StorageType('Balances.Freezes', 'Default', [v287.AccountId32], sts.array(() => v287.Type_504)) as FreezesV287,
}

/**
 *  Freeze locks on account balances.
 */
export interface FreezesV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.Type_504[]
    get(block: Block, key: v287.AccountId32): Promise<(v287.Type_504[] | undefined)>
    getMany(block: Block, keys: v287.AccountId32[]): Promise<(v287.Type_504[] | undefined)[]>
    getKeys(block: Block): Promise<v287.AccountId32[]>
    getKeys(block: Block, key: v287.AccountId32): Promise<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<v287.AccountId32[]>
    getPairs(block: Block): Promise<[k: v287.AccountId32, v: (v287.Type_504[] | undefined)][]>
    getPairs(block: Block, key: v287.AccountId32): Promise<[k: v287.AccountId32, v: (v287.Type_504[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.AccountId32, v: (v287.Type_504[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<[k: v287.AccountId32, v: (v287.Type_504[] | undefined)][]>
}
