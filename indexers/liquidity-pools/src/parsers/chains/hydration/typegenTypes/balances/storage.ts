import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v100 from '../v100'
import * as v205 from '../v205'
import * as v244 from '../v244'

export const totalIssuance =  {
    /**
     *  The total units issued in the system.
     */
    v100: new StorageType('Balances.TotalIssuance', 'Default', [], sts.bigint()) as TotalIssuanceV100,
}

/**
 *  The total units issued in the system.
 */
export interface TotalIssuanceV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const account =  {
    /**
     *  The balance of an account.
     * 
     *  NOTE: This is only used in the case that this pallet is used to store balances.
     */
    v100: new StorageType('Balances.Account', 'Default', [v100.AccountId32], v100.AccountData) as AccountV100,
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
    v205: new StorageType('Balances.Account', 'Default', [v205.AccountId32], v205.AccountData) as AccountV205,
}

/**
 *  The balance of an account.
 * 
 *  NOTE: This is only used in the case that this pallet is used to store balances.
 */
export interface AccountV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.AccountData
    get(block: Block, key: v100.AccountId32): Promise<(v100.AccountData | undefined)>
    getMany(block: Block, keys: v100.AccountId32[]): Promise<(v100.AccountData | undefined)[]>
    getKeys(block: Block): Promise<v100.AccountId32[]>
    getKeys(block: Block, key: v100.AccountId32): Promise<v100.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v100.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v100.AccountId32): AsyncIterable<v100.AccountId32[]>
    getPairs(block: Block): Promise<[k: v100.AccountId32, v: (v100.AccountData | undefined)][]>
    getPairs(block: Block, key: v100.AccountId32): Promise<[k: v100.AccountId32, v: (v100.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v100.AccountId32, v: (v100.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v100.AccountId32): AsyncIterable<[k: v100.AccountId32, v: (v100.AccountData | undefined)][]>
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
export interface AccountV205  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v205.AccountData
    get(block: Block, key: v205.AccountId32): Promise<(v205.AccountData | undefined)>
    getMany(block: Block, keys: v205.AccountId32[]): Promise<(v205.AccountData | undefined)[]>
    getKeys(block: Block): Promise<v205.AccountId32[]>
    getKeys(block: Block, key: v205.AccountId32): Promise<v205.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v205.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v205.AccountId32): AsyncIterable<v205.AccountId32[]>
    getPairs(block: Block): Promise<[k: v205.AccountId32, v: (v205.AccountData | undefined)][]>
    getPairs(block: Block, key: v205.AccountId32): Promise<[k: v205.AccountId32, v: (v205.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v205.AccountId32, v: (v205.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v205.AccountId32): AsyncIterable<[k: v205.AccountId32, v: (v205.AccountData | undefined)][]>
}

export const locks =  {
    /**
     *  Any liquidity locks on some account balances.
     *  NOTE: Should only be accessed when setting, changing and freeing a lock.
     */
    v100: new StorageType('Balances.Locks', 'Default', [v100.AccountId32], sts.array(() => v100.BalanceLock)) as LocksV100,
}

/**
 *  Any liquidity locks on some account balances.
 *  NOTE: Should only be accessed when setting, changing and freeing a lock.
 */
export interface LocksV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.BalanceLock[]
    get(block: Block, key: v100.AccountId32): Promise<(v100.BalanceLock[] | undefined)>
    getMany(block: Block, keys: v100.AccountId32[]): Promise<(v100.BalanceLock[] | undefined)[]>
    getKeys(block: Block): Promise<v100.AccountId32[]>
    getKeys(block: Block, key: v100.AccountId32): Promise<v100.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v100.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v100.AccountId32): AsyncIterable<v100.AccountId32[]>
    getPairs(block: Block): Promise<[k: v100.AccountId32, v: (v100.BalanceLock[] | undefined)][]>
    getPairs(block: Block, key: v100.AccountId32): Promise<[k: v100.AccountId32, v: (v100.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v100.AccountId32, v: (v100.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v100.AccountId32): AsyncIterable<[k: v100.AccountId32, v: (v100.BalanceLock[] | undefined)][]>
}

export const reserves =  {
    /**
     *  Named reserves on some account balances.
     */
    v100: new StorageType('Balances.Reserves', 'Default', [v100.AccountId32], sts.array(() => v100.ReserveData)) as ReservesV100,
}

/**
 *  Named reserves on some account balances.
 */
export interface ReservesV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.ReserveData[]
    get(block: Block, key: v100.AccountId32): Promise<(v100.ReserveData[] | undefined)>
    getMany(block: Block, keys: v100.AccountId32[]): Promise<(v100.ReserveData[] | undefined)[]>
    getKeys(block: Block): Promise<v100.AccountId32[]>
    getKeys(block: Block, key: v100.AccountId32): Promise<v100.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v100.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v100.AccountId32): AsyncIterable<v100.AccountId32[]>
    getPairs(block: Block): Promise<[k: v100.AccountId32, v: (v100.ReserveData[] | undefined)][]>
    getPairs(block: Block, key: v100.AccountId32): Promise<[k: v100.AccountId32, v: (v100.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v100.AccountId32, v: (v100.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v100.AccountId32): AsyncIterable<[k: v100.AccountId32, v: (v100.ReserveData[] | undefined)][]>
}

export const storageVersion =  {
    /**
     *  Storage version of the pallet.
     * 
     *  This is set to v2.0.0 for new networks.
     */
    v100: new StorageType('Balances.StorageVersion', 'Default', [], v100.Releases) as StorageVersionV100,
}

/**
 *  Storage version of the pallet.
 * 
 *  This is set to v2.0.0 for new networks.
 */
export interface StorageVersionV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.Releases
    get(block: Block): Promise<(v100.Releases | undefined)>
}

export const inactiveIssuance =  {
    /**
     *  The total units of outstanding deactivated balance in the system.
     */
    v160: new StorageType('Balances.InactiveIssuance', 'Default', [], sts.bigint()) as InactiveIssuanceV160,
}

/**
 *  The total units of outstanding deactivated balance in the system.
 */
export interface InactiveIssuanceV160  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const holds =  {
    /**
     *  Holds on account balances.
     */
    v205: new StorageType('Balances.Holds', 'Default', [v205.AccountId32], sts.array(() => v205.IdAmount)) as HoldsV205,
    /**
     *  Holds on account balances.
     */
    v244: new StorageType('Balances.Holds', 'Default', [v244.AccountId32], sts.array(() => v244.IdAmount)) as HoldsV244,
}

/**
 *  Holds on account balances.
 */
export interface HoldsV205  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v205.IdAmount[]
    get(block: Block, key: v205.AccountId32): Promise<(v205.IdAmount[] | undefined)>
    getMany(block: Block, keys: v205.AccountId32[]): Promise<(v205.IdAmount[] | undefined)[]>
    getKeys(block: Block): Promise<v205.AccountId32[]>
    getKeys(block: Block, key: v205.AccountId32): Promise<v205.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v205.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v205.AccountId32): AsyncIterable<v205.AccountId32[]>
    getPairs(block: Block): Promise<[k: v205.AccountId32, v: (v205.IdAmount[] | undefined)][]>
    getPairs(block: Block, key: v205.AccountId32): Promise<[k: v205.AccountId32, v: (v205.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v205.AccountId32, v: (v205.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v205.AccountId32): AsyncIterable<[k: v205.AccountId32, v: (v205.IdAmount[] | undefined)][]>
}

/**
 *  Holds on account balances.
 */
export interface HoldsV244  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v244.IdAmount[]
    get(block: Block, key: v244.AccountId32): Promise<(v244.IdAmount[] | undefined)>
    getMany(block: Block, keys: v244.AccountId32[]): Promise<(v244.IdAmount[] | undefined)[]>
    getKeys(block: Block): Promise<v244.AccountId32[]>
    getKeys(block: Block, key: v244.AccountId32): Promise<v244.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v244.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v244.AccountId32): AsyncIterable<v244.AccountId32[]>
    getPairs(block: Block): Promise<[k: v244.AccountId32, v: (v244.IdAmount[] | undefined)][]>
    getPairs(block: Block, key: v244.AccountId32): Promise<[k: v244.AccountId32, v: (v244.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v244.AccountId32, v: (v244.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v244.AccountId32): AsyncIterable<[k: v244.AccountId32, v: (v244.IdAmount[] | undefined)][]>
}

export const freezes =  {
    /**
     *  Freeze locks on account balances.
     */
    v205: new StorageType('Balances.Freezes', 'Default', [v205.AccountId32], sts.array(() => v205.IdAmount)) as FreezesV205,
}

/**
 *  Freeze locks on account balances.
 */
export interface FreezesV205  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v205.IdAmount[]
    get(block: Block, key: v205.AccountId32): Promise<(v205.IdAmount[] | undefined)>
    getMany(block: Block, keys: v205.AccountId32[]): Promise<(v205.IdAmount[] | undefined)[]>
    getKeys(block: Block): Promise<v205.AccountId32[]>
    getKeys(block: Block, key: v205.AccountId32): Promise<v205.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v205.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v205.AccountId32): AsyncIterable<v205.AccountId32[]>
    getPairs(block: Block): Promise<[k: v205.AccountId32, v: (v205.IdAmount[] | undefined)][]>
    getPairs(block: Block, key: v205.AccountId32): Promise<[k: v205.AccountId32, v: (v205.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v205.AccountId32, v: (v205.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v205.AccountId32): AsyncIterable<[k: v205.AccountId32, v: (v205.IdAmount[] | undefined)][]>
}
