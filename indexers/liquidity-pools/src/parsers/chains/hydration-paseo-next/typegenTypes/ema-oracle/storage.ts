import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'
import * as v335 from '../v335'

export const accumulator =  {
    /**
     *  Accumulator for oracle data in current block that will be recorded at the end of the block.
     */
    v324: new StorageType('EmaOracle.Accumulator', 'Default', [], sts.array(() => sts.tuple(() => [sts.tuple(() => [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()])]), v324.OracleEntry]))) as AccumulatorV324,
    /**
     *  Accumulator for oracle data in current block that will be recorded at the end of the block.
     */
    v335: new StorageType('EmaOracle.Accumulator', 'Default', [], sts.array(() => sts.tuple(() => [sts.tuple(() => [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()])]), v335.OracleEntry]))) as AccumulatorV335,
}

/**
 *  Accumulator for oracle data in current block that will be recorded at the end of the block.
 */
export interface AccumulatorV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): [[Bytes, [number, number]], v324.OracleEntry][]
    get(block: Block): Promise<([[Bytes, [number, number]], v324.OracleEntry][] | undefined)>
}

/**
 *  Accumulator for oracle data in current block that will be recorded at the end of the block.
 */
export interface AccumulatorV335  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): [[Bytes, [number, number]], v335.OracleEntry][]
    get(block: Block): Promise<([[Bytes, [number, number]], v335.OracleEntry][] | undefined)>
}

export const oracles =  {
    /**
     *  Oracle storage keyed by data source, involved asset ids and the period length of the oracle.
     * 
     *  Stores the data entry as well as the block number when the oracle was first initialized.
     */
    v324: new StorageType('EmaOracle.Oracles', 'Optional', [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()]), v324.OraclePeriod], sts.tuple(() => [v324.OracleEntry, sts.number()])) as OraclesV324,
    /**
     *  Oracle storage keyed by data source, involved asset ids and the period length of the oracle.
     * 
     *  Stores the data entry as well as the block number when the oracle was first initialized.
     */
    v335: new StorageType('EmaOracle.Oracles', 'Optional', [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()]), v335.OraclePeriod], sts.tuple(() => [v335.OracleEntry, sts.number()])) as OraclesV335,
}

/**
 *  Oracle storage keyed by data source, involved asset ids and the period length of the oracle.
 * 
 *  Stores the data entry as well as the block number when the oracle was first initialized.
 */
export interface OraclesV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: Bytes, key2: [number, number], key3: v324.OraclePeriod): Promise<([v324.OracleEntry, number] | undefined)>
    getMany(block: Block, keys: [Bytes, [number, number], v324.OraclePeriod][]): Promise<([v324.OracleEntry, number] | undefined)[]>
    getKeys(block: Block): Promise<[Bytes, [number, number], v324.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes): Promise<[Bytes, [number, number], v324.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes, key2: [number, number]): Promise<[Bytes, [number, number], v324.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes, key2: [number, number], key3: v324.OraclePeriod): Promise<[Bytes, [number, number], v324.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[Bytes, [number, number], v324.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes): AsyncIterable<[Bytes, [number, number], v324.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number]): AsyncIterable<[Bytes, [number, number], v324.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number], key3: v324.OraclePeriod): AsyncIterable<[Bytes, [number, number], v324.OraclePeriod][]>
    getPairs(block: Block): Promise<[k: [Bytes, [number, number], v324.OraclePeriod], v: ([v324.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes): Promise<[k: [Bytes, [number, number], v324.OraclePeriod], v: ([v324.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes, key2: [number, number]): Promise<[k: [Bytes, [number, number], v324.OraclePeriod], v: ([v324.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes, key2: [number, number], key3: v324.OraclePeriod): Promise<[k: [Bytes, [number, number], v324.OraclePeriod], v: ([v324.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [Bytes, [number, number], v324.OraclePeriod], v: ([v324.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes): AsyncIterable<[k: [Bytes, [number, number], v324.OraclePeriod], v: ([v324.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number]): AsyncIterable<[k: [Bytes, [number, number], v324.OraclePeriod], v: ([v324.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number], key3: v324.OraclePeriod): AsyncIterable<[k: [Bytes, [number, number], v324.OraclePeriod], v: ([v324.OracleEntry, number] | undefined)][]>
}

/**
 *  Oracle storage keyed by data source, involved asset ids and the period length of the oracle.
 * 
 *  Stores the data entry as well as the block number when the oracle was first initialized.
 */
export interface OraclesV335  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: Bytes, key2: [number, number], key3: v335.OraclePeriod): Promise<([v335.OracleEntry, number] | undefined)>
    getMany(block: Block, keys: [Bytes, [number, number], v335.OraclePeriod][]): Promise<([v335.OracleEntry, number] | undefined)[]>
    getKeys(block: Block): Promise<[Bytes, [number, number], v335.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes): Promise<[Bytes, [number, number], v335.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes, key2: [number, number]): Promise<[Bytes, [number, number], v335.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes, key2: [number, number], key3: v335.OraclePeriod): Promise<[Bytes, [number, number], v335.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[Bytes, [number, number], v335.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes): AsyncIterable<[Bytes, [number, number], v335.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number]): AsyncIterable<[Bytes, [number, number], v335.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number], key3: v335.OraclePeriod): AsyncIterable<[Bytes, [number, number], v335.OraclePeriod][]>
    getPairs(block: Block): Promise<[k: [Bytes, [number, number], v335.OraclePeriod], v: ([v335.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes): Promise<[k: [Bytes, [number, number], v335.OraclePeriod], v: ([v335.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes, key2: [number, number]): Promise<[k: [Bytes, [number, number], v335.OraclePeriod], v: ([v335.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes, key2: [number, number], key3: v335.OraclePeriod): Promise<[k: [Bytes, [number, number], v335.OraclePeriod], v: ([v335.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [Bytes, [number, number], v335.OraclePeriod], v: ([v335.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes): AsyncIterable<[k: [Bytes, [number, number], v335.OraclePeriod], v: ([v335.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number]): AsyncIterable<[k: [Bytes, [number, number], v335.OraclePeriod], v: ([v335.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number], key3: v335.OraclePeriod): AsyncIterable<[k: [Bytes, [number, number], v335.OraclePeriod], v: ([v335.OracleEntry, number] | undefined)][]>
}

export const whitelistedAssets =  {
    /**
     *  Assets that are whitelisted and tracked by the pallet.
     */
    v324: new StorageType('EmaOracle.WhitelistedAssets', 'Default', [], sts.array(() => sts.tuple(() => [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()])]))) as WhitelistedAssetsV324,
}

/**
 *  Assets that are whitelisted and tracked by the pallet.
 */
export interface WhitelistedAssetsV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): [Bytes, [number, number]][]
    get(block: Block): Promise<([Bytes, [number, number]][] | undefined)>
}
