import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v138 from '../v138'
import * as v170 from '../v170'

export const accumulator =  {
    /**
     *  Accumulator for oracle data in current block that will be recorded at the end of the block.
     */
    v138: new StorageType('EmaOracle.Accumulator', 'Default', [], sts.array(() => sts.tuple(() => [sts.tuple(() => [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()])]), v138.OracleEntry]))) as AccumulatorV138,
    /**
     *  Accumulator for oracle data in current block that will be recorded at the end of the block.
     */
    v170: new StorageType('EmaOracle.Accumulator', 'Default', [], sts.array(() => sts.tuple(() => [sts.tuple(() => [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()])]), v170.OracleEntry]))) as AccumulatorV170,
}

/**
 *  Accumulator for oracle data in current block that will be recorded at the end of the block.
 */
export interface AccumulatorV138  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): [[Bytes, [number, number]], v138.OracleEntry][]
    get(block: Block): Promise<([[Bytes, [number, number]], v138.OracleEntry][] | undefined)>
}

/**
 *  Accumulator for oracle data in current block that will be recorded at the end of the block.
 */
export interface AccumulatorV170  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): [[Bytes, [number, number]], v170.OracleEntry][]
    get(block: Block): Promise<([[Bytes, [number, number]], v170.OracleEntry][] | undefined)>
}

export const oracles =  {
    /**
     *  Orace storage keyed by data source, involved asset ids and the period length of the oracle.
     * 
     *  Stores the data entry as well as the block number when the oracle was first initialized.
     */
    v138: new StorageType('EmaOracle.Oracles', 'Optional', [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()]), v138.OraclePeriod], sts.tuple(() => [v138.OracleEntry, sts.number()])) as OraclesV138,
    /**
     *  Orace storage keyed by data source, involved asset ids and the period length of the oracle.
     * 
     *  Stores the data entry as well as the block number when the oracle was first initialized.
     */
    v170: new StorageType('EmaOracle.Oracles', 'Optional', [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()]), v170.OraclePeriod], sts.tuple(() => [v170.OracleEntry, sts.number()])) as OraclesV170,
}

/**
 *  Orace storage keyed by data source, involved asset ids and the period length of the oracle.
 * 
 *  Stores the data entry as well as the block number when the oracle was first initialized.
 */
export interface OraclesV138  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: Bytes, key2: [number, number], key3: v138.OraclePeriod): Promise<([v138.OracleEntry, number] | undefined)>
    getMany(block: Block, keys: [Bytes, [number, number], v138.OraclePeriod][]): Promise<([v138.OracleEntry, number] | undefined)[]>
    getKeys(block: Block): Promise<[Bytes, [number, number], v138.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes): Promise<[Bytes, [number, number], v138.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes, key2: [number, number]): Promise<[Bytes, [number, number], v138.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes, key2: [number, number], key3: v138.OraclePeriod): Promise<[Bytes, [number, number], v138.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[Bytes, [number, number], v138.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes): AsyncIterable<[Bytes, [number, number], v138.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number]): AsyncIterable<[Bytes, [number, number], v138.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number], key3: v138.OraclePeriod): AsyncIterable<[Bytes, [number, number], v138.OraclePeriod][]>
    getPairs(block: Block): Promise<[k: [Bytes, [number, number], v138.OraclePeriod], v: ([v138.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes): Promise<[k: [Bytes, [number, number], v138.OraclePeriod], v: ([v138.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes, key2: [number, number]): Promise<[k: [Bytes, [number, number], v138.OraclePeriod], v: ([v138.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes, key2: [number, number], key3: v138.OraclePeriod): Promise<[k: [Bytes, [number, number], v138.OraclePeriod], v: ([v138.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [Bytes, [number, number], v138.OraclePeriod], v: ([v138.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes): AsyncIterable<[k: [Bytes, [number, number], v138.OraclePeriod], v: ([v138.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number]): AsyncIterable<[k: [Bytes, [number, number], v138.OraclePeriod], v: ([v138.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number], key3: v138.OraclePeriod): AsyncIterable<[k: [Bytes, [number, number], v138.OraclePeriod], v: ([v138.OracleEntry, number] | undefined)][]>
}

/**
 *  Orace storage keyed by data source, involved asset ids and the period length of the oracle.
 * 
 *  Stores the data entry as well as the block number when the oracle was first initialized.
 */
export interface OraclesV170  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: Bytes, key2: [number, number], key3: v170.OraclePeriod): Promise<([v170.OracleEntry, number] | undefined)>
    getMany(block: Block, keys: [Bytes, [number, number], v170.OraclePeriod][]): Promise<([v170.OracleEntry, number] | undefined)[]>
    getKeys(block: Block): Promise<[Bytes, [number, number], v170.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes): Promise<[Bytes, [number, number], v170.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes, key2: [number, number]): Promise<[Bytes, [number, number], v170.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes, key2: [number, number], key3: v170.OraclePeriod): Promise<[Bytes, [number, number], v170.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[Bytes, [number, number], v170.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes): AsyncIterable<[Bytes, [number, number], v170.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number]): AsyncIterable<[Bytes, [number, number], v170.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number], key3: v170.OraclePeriod): AsyncIterable<[Bytes, [number, number], v170.OraclePeriod][]>
    getPairs(block: Block): Promise<[k: [Bytes, [number, number], v170.OraclePeriod], v: ([v170.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes): Promise<[k: [Bytes, [number, number], v170.OraclePeriod], v: ([v170.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes, key2: [number, number]): Promise<[k: [Bytes, [number, number], v170.OraclePeriod], v: ([v170.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes, key2: [number, number], key3: v170.OraclePeriod): Promise<[k: [Bytes, [number, number], v170.OraclePeriod], v: ([v170.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [Bytes, [number, number], v170.OraclePeriod], v: ([v170.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes): AsyncIterable<[k: [Bytes, [number, number], v170.OraclePeriod], v: ([v170.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number]): AsyncIterable<[k: [Bytes, [number, number], v170.OraclePeriod], v: ([v170.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number], key3: v170.OraclePeriod): AsyncIterable<[k: [Bytes, [number, number], v170.OraclePeriod], v: ([v170.OracleEntry, number] | undefined)][]>
}

export const whitelistedAssets =  {
    /**
     *  Assets that are whitelisted and tracked by the pallet.
     */
    v227: new StorageType('EmaOracle.WhitelistedAssets', 'Default', [], sts.array(() => sts.tuple(() => [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()])]))) as WhitelistedAssetsV227,
}

/**
 *  Assets that are whitelisted and tracked by the pallet.
 */
export interface WhitelistedAssetsV227  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): [Bytes, [number, number]][]
    get(block: Block): Promise<([Bytes, [number, number]][] | undefined)>
}
