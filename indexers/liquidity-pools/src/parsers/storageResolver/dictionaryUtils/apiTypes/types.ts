import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigFloat: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AccountBalances = {
  __typename?: 'AccountBalances';
  feeFrozen?: Maybe<Scalars['BigInt']['output']>;
  flags?: Maybe<Scalars['BigInt']['output']>;
  free: Scalars['BigInt']['output'];
  frozen?: Maybe<Scalars['BigInt']['output']>;
  miscFrozen?: Maybe<Scalars['BigInt']['output']>;
  reserved: Scalars['BigInt']['output'];
};

export type ApiSupportResponse = {
  __typename?: 'ApiSupportResponse';
  accountBalances?: Maybe<AccountBalances>;
  omnipoolAssetState?: Maybe<OmnipoolAssetState>;
  tradability?: Maybe<Tradability>;
};

/** A filter to be used against BigFloat fields. All fields are combined with a logical ‘and.’ */
export type BigFloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
};

/** A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’ */
export type BigIntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigInt']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigInt']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigInt']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigInt']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type HavingBigfloatFilter = {
  equalTo?: InputMaybe<Scalars['BigFloat']['input']>;
  greaterThan?: InputMaybe<Scalars['BigFloat']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  lessThan?: InputMaybe<Scalars['BigFloat']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  notEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
};

export type HavingBigintFilter = {
  equalTo?: InputMaybe<Scalars['BigInt']['input']>;
  greaterThan?: InputMaybe<Scalars['BigInt']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  lessThan?: InputMaybe<Scalars['BigInt']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  notEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
};

export type HavingIntFilter = {
  equalTo?: InputMaybe<Scalars['Int']['input']>;
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** A filter to be used against Int List fields. All fields are combined with a logical ‘and.’ */
export type IntListFilter = {
  /** Any array item is equal to the specified value. */
  anyEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: InputMaybe<Scalars['Int']['input']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: InputMaybe<Scalars['Int']['input']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Contained by the specified list of values. */
  containedBy?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Contains the specified list of values. */
  contains?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Contained by the specified JSON. */
  containedBy?: InputMaybe<Scalars['JSON']['input']>;
  /** Contains the specified JSON. */
  contains?: InputMaybe<Scalars['JSON']['input']>;
  /** Contains all of the specified keys. */
  containsAllKeys?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains any of the specified keys. */
  containsAnyKeys?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains the specified key. */
  containsKey?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['JSON']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['JSON']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['JSON']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['JSON']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['JSON']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['JSON']['input']>>;
};

export type LbpPool = {
  __typename?: 'LbpPool';
  assetAId: Scalars['Int']['output'];
  assetBId: Scalars['Int']['output'];
  end?: Maybe<Scalars['Int']['output']>;
  fee: Array<Maybe<Scalars['Int']['output']>>;
  feeCollector?: Maybe<Scalars['String']['output']>;
  finalWeight: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  initialWeight: Scalars['Int']['output'];
  /** Reads and enables pagination through a set of `LbpPoolAssetsDatum`. */
  lbpPoolAssetsDataByPoolId: LbpPoolAssetsDataConnection;
  owner: Scalars['String']['output'];
  paraChainBlockHeight: Scalars['Int']['output'];
  poolAddress: Scalars['String']['output'];
  repayTarget: Scalars['BigFloat']['output'];
  start?: Maybe<Scalars['Int']['output']>;
  weightCurve: Scalars['String']['output'];
};


export type LbpPoolLbpPoolAssetsDataByPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<LbpPoolAssetsDatumCondition>;
  filter?: InputMaybe<LbpPoolAssetsDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LbpPoolAssetsDataOrderBy>>;
};

export type LbpPoolAggregates = {
  __typename?: 'LbpPoolAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<LbpPoolAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<LbpPoolDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<LbpPoolMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<LbpPoolMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<LbpPoolStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<LbpPoolStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<LbpPoolSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<LbpPoolVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<LbpPoolVarianceSampleAggregates>;
};

/** A connection to a list of `LbpPoolAssetsDatum` values. */
export type LbpPoolAssetsDataConnection = {
  __typename?: 'LbpPoolAssetsDataConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<LbpPoolAssetsDatumAggregates>;
  /** A list of edges which contains the `LbpPoolAssetsDatum` and cursor to aid in pagination. */
  edges: Array<LbpPoolAssetsDataEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<LbpPoolAssetsDatumAggregates>>;
  /** A list of `LbpPoolAssetsDatum` objects. */
  nodes: Array<Maybe<LbpPoolAssetsDatum>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `LbpPoolAssetsDatum` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `LbpPoolAssetsDatum` values. */
export type LbpPoolAssetsDataConnectionGroupedAggregatesArgs = {
  groupBy: Array<LbpPoolAssetsDataGroupBy>;
  having?: InputMaybe<LbpPoolAssetsDataHavingInput>;
};

/** A `LbpPoolAssetsDatum` edge in the connection. */
export type LbpPoolAssetsDataEdge = {
  __typename?: 'LbpPoolAssetsDataEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `LbpPoolAssetsDatum` at the end of the edge. */
  node?: Maybe<LbpPoolAssetsDatum>;
};

/** Grouping methods for `LbpPoolAssetsDatum` for usage during aggregation. */
export enum LbpPoolAssetsDataGroupBy {
  AssetId = 'ASSET_ID',
  Balances = 'BALANCES',
  ParaChainBlockHeight = 'PARA_CHAIN_BLOCK_HEIGHT',
  PoolId = 'POOL_ID'
}

export type LbpPoolAssetsDataHavingAverageInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolAssetsDataHavingDistinctCountInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `LbpPoolAssetsDatum` aggregates. */
export type LbpPoolAssetsDataHavingInput = {
  AND?: InputMaybe<Array<LbpPoolAssetsDataHavingInput>>;
  OR?: InputMaybe<Array<LbpPoolAssetsDataHavingInput>>;
  average?: InputMaybe<LbpPoolAssetsDataHavingAverageInput>;
  distinctCount?: InputMaybe<LbpPoolAssetsDataHavingDistinctCountInput>;
  max?: InputMaybe<LbpPoolAssetsDataHavingMaxInput>;
  min?: InputMaybe<LbpPoolAssetsDataHavingMinInput>;
  stddevPopulation?: InputMaybe<LbpPoolAssetsDataHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<LbpPoolAssetsDataHavingStddevSampleInput>;
  sum?: InputMaybe<LbpPoolAssetsDataHavingSumInput>;
  variancePopulation?: InputMaybe<LbpPoolAssetsDataHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<LbpPoolAssetsDataHavingVarianceSampleInput>;
};

export type LbpPoolAssetsDataHavingMaxInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolAssetsDataHavingMinInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolAssetsDataHavingStddevPopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolAssetsDataHavingStddevSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolAssetsDataHavingSumInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolAssetsDataHavingVariancePopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolAssetsDataHavingVarianceSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Methods to use when ordering `LbpPoolAssetsDatum`. */
export enum LbpPoolAssetsDataOrderBy {
  AssetIdAsc = 'ASSET_ID_ASC',
  AssetIdDesc = 'ASSET_ID_DESC',
  BalancesAsc = 'BALANCES_ASC',
  BalancesDesc = 'BALANCES_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  ParaChainBlockHeightAsc = 'PARA_CHAIN_BLOCK_HEIGHT_ASC',
  ParaChainBlockHeightDesc = 'PARA_CHAIN_BLOCK_HEIGHT_DESC',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type LbpPoolAssetsDatum = {
  __typename?: 'LbpPoolAssetsDatum';
  assetId: Scalars['Int']['output'];
  balances: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  paraChainBlockHeight: Scalars['Int']['output'];
  /** Reads a single `LbpPool` that is related to this `LbpPoolAssetsDatum`. */
  pool?: Maybe<LbpPool>;
  poolId?: Maybe<Scalars['String']['output']>;
};

export type LbpPoolAssetsDatumAggregates = {
  __typename?: 'LbpPoolAssetsDatumAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<LbpPoolAssetsDatumAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<LbpPoolAssetsDatumDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<LbpPoolAssetsDatumMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<LbpPoolAssetsDatumMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<LbpPoolAssetsDatumStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<LbpPoolAssetsDatumStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<LbpPoolAssetsDatumSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<LbpPoolAssetsDatumVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<LbpPoolAssetsDatumVarianceSampleAggregates>;
};

export type LbpPoolAssetsDatumAverageAggregates = {
  __typename?: 'LbpPoolAssetsDatumAverageAggregates';
  /** Mean average of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `LbpPoolAssetsDatum` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type LbpPoolAssetsDatumCondition = {
  /** Checks for equality with the object’s `assetId` field. */
  assetId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `balances` field. */
  balances?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolId` field. */
  poolId?: InputMaybe<Scalars['String']['input']>;
};

export type LbpPoolAssetsDatumDistinctCountAggregates = {
  __typename?: 'LbpPoolAssetsDatumDistinctCountAggregates';
  /** Distinct count of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of balances across the matching connection */
  balances?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `LbpPoolAssetsDatum` object types. All fields are combined with a logical ‘and.’ */
export type LbpPoolAssetsDatumFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<LbpPoolAssetsDatumFilter>>;
  /** Filter by the object’s `assetId` field. */
  assetId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `balances` field. */
  balances?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<LbpPoolAssetsDatumFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<LbpPoolAssetsDatumFilter>>;
  /** Filter by the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
};

export type LbpPoolAssetsDatumMaxAggregates = {
  __typename?: 'LbpPoolAssetsDatumMaxAggregates';
  /** Maximum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type LbpPoolAssetsDatumMinAggregates = {
  __typename?: 'LbpPoolAssetsDatumMinAggregates';
  /** Minimum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type LbpPoolAssetsDatumStddevPopulationAggregates = {
  __typename?: 'LbpPoolAssetsDatumStddevPopulationAggregates';
  /** Population standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbpPoolAssetsDatumStddevSampleAggregates = {
  __typename?: 'LbpPoolAssetsDatumStddevSampleAggregates';
  /** Sample standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbpPoolAssetsDatumSumAggregates = {
  __typename?: 'LbpPoolAssetsDatumSumAggregates';
  /** Sum of assetId across the matching connection */
  assetId: Scalars['BigInt']['output'];
  /** Sum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight: Scalars['BigInt']['output'];
};

export type LbpPoolAssetsDatumVariancePopulationAggregates = {
  __typename?: 'LbpPoolAssetsDatumVariancePopulationAggregates';
  /** Population variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbpPoolAssetsDatumVarianceSampleAggregates = {
  __typename?: 'LbpPoolAssetsDatumVarianceSampleAggregates';
  /** Sample variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbpPoolAverageAggregates = {
  __typename?: 'LbpPoolAverageAggregates';
  /** Mean average of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of end across the matching connection */
  end?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of finalWeight across the matching connection */
  finalWeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of initialWeight across the matching connection */
  initialWeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of repayTarget across the matching connection */
  repayTarget?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of start across the matching connection */
  start?: Maybe<Scalars['BigFloat']['output']>;
};

/** A condition to be used against `LbpPool` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type LbpPoolCondition = {
  /** Checks for equality with the object’s `assetAId` field. */
  assetAId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `assetBId` field. */
  assetBId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `end` field. */
  end?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `fee` field. */
  fee?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** Checks for equality with the object’s `feeCollector` field. */
  feeCollector?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `finalWeight` field. */
  finalWeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `initialWeight` field. */
  initialWeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `owner` field. */
  owner?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `repayTarget` field. */
  repayTarget?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Checks for equality with the object’s `start` field. */
  start?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `weightCurve` field. */
  weightCurve?: InputMaybe<Scalars['String']['input']>;
};

export type LbpPoolDistinctCountAggregates = {
  __typename?: 'LbpPoolDistinctCountAggregates';
  /** Distinct count of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of end across the matching connection */
  end?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of fee across the matching connection */
  fee?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of feeCollector across the matching connection */
  feeCollector?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of finalWeight across the matching connection */
  finalWeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of initialWeight across the matching connection */
  initialWeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of owner across the matching connection */
  owner?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolAddress across the matching connection */
  poolAddress?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of repayTarget across the matching connection */
  repayTarget?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of start across the matching connection */
  start?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of weightCurve across the matching connection */
  weightCurve?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `LbpPool` object types. All fields are combined with a logical ‘and.’ */
export type LbpPoolFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<LbpPoolFilter>>;
  /** Filter by the object’s `assetAId` field. */
  assetAId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `assetBId` field. */
  assetBId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `end` field. */
  end?: InputMaybe<IntFilter>;
  /** Filter by the object’s `fee` field. */
  fee?: InputMaybe<IntListFilter>;
  /** Filter by the object’s `feeCollector` field. */
  feeCollector?: InputMaybe<StringFilter>;
  /** Filter by the object’s `finalWeight` field. */
  finalWeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `initialWeight` field. */
  initialWeight?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<LbpPoolFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<LbpPoolFilter>>;
  /** Filter by the object’s `owner` field. */
  owner?: InputMaybe<StringFilter>;
  /** Filter by the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<StringFilter>;
  /** Filter by the object’s `repayTarget` field. */
  repayTarget?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `start` field. */
  start?: InputMaybe<IntFilter>;
  /** Filter by the object’s `weightCurve` field. */
  weightCurve?: InputMaybe<StringFilter>;
};

/** Grouping methods for `LbpPool` for usage during aggregation. */
export enum LbpPoolGroupBy {
  AssetAId = 'ASSET_A_ID',
  AssetBId = 'ASSET_B_ID',
  End = 'END',
  Fee = 'FEE',
  FeeCollector = 'FEE_COLLECTOR',
  FinalWeight = 'FINAL_WEIGHT',
  InitialWeight = 'INITIAL_WEIGHT',
  Owner = 'OWNER',
  ParaChainBlockHeight = 'PARA_CHAIN_BLOCK_HEIGHT',
  PoolAddress = 'POOL_ADDRESS',
  RepayTarget = 'REPAY_TARGET',
  Start = 'START',
  WeightCurve = 'WEIGHT_CURVE'
}

export type LbpPoolHavingAverageInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  repayTarget?: InputMaybe<HavingBigfloatFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolHavingDistinctCountInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  repayTarget?: InputMaybe<HavingBigfloatFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `LbpPool` aggregates. */
export type LbpPoolHavingInput = {
  AND?: InputMaybe<Array<LbpPoolHavingInput>>;
  OR?: InputMaybe<Array<LbpPoolHavingInput>>;
  average?: InputMaybe<LbpPoolHavingAverageInput>;
  distinctCount?: InputMaybe<LbpPoolHavingDistinctCountInput>;
  max?: InputMaybe<LbpPoolHavingMaxInput>;
  min?: InputMaybe<LbpPoolHavingMinInput>;
  stddevPopulation?: InputMaybe<LbpPoolHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<LbpPoolHavingStddevSampleInput>;
  sum?: InputMaybe<LbpPoolHavingSumInput>;
  variancePopulation?: InputMaybe<LbpPoolHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<LbpPoolHavingVarianceSampleInput>;
};

export type LbpPoolHavingMaxInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  repayTarget?: InputMaybe<HavingBigfloatFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolHavingMinInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  repayTarget?: InputMaybe<HavingBigfloatFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolHavingStddevPopulationInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  repayTarget?: InputMaybe<HavingBigfloatFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolHavingStddevSampleInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  repayTarget?: InputMaybe<HavingBigfloatFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolHavingSumInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  repayTarget?: InputMaybe<HavingBigfloatFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolHavingVariancePopulationInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  repayTarget?: InputMaybe<HavingBigfloatFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolHavingVarianceSampleInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  repayTarget?: InputMaybe<HavingBigfloatFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbpPoolMaxAggregates = {
  __typename?: 'LbpPoolMaxAggregates';
  /** Maximum of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of end across the matching connection */
  end?: Maybe<Scalars['Int']['output']>;
  /** Maximum of finalWeight across the matching connection */
  finalWeight?: Maybe<Scalars['Int']['output']>;
  /** Maximum of initialWeight across the matching connection */
  initialWeight?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
  /** Maximum of repayTarget across the matching connection */
  repayTarget?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of start across the matching connection */
  start?: Maybe<Scalars['Int']['output']>;
};

export type LbpPoolMinAggregates = {
  __typename?: 'LbpPoolMinAggregates';
  /** Minimum of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of end across the matching connection */
  end?: Maybe<Scalars['Int']['output']>;
  /** Minimum of finalWeight across the matching connection */
  finalWeight?: Maybe<Scalars['Int']['output']>;
  /** Minimum of initialWeight across the matching connection */
  initialWeight?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
  /** Minimum of repayTarget across the matching connection */
  repayTarget?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of start across the matching connection */
  start?: Maybe<Scalars['Int']['output']>;
};

export type LbpPoolStddevPopulationAggregates = {
  __typename?: 'LbpPoolStddevPopulationAggregates';
  /** Population standard deviation of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of end across the matching connection */
  end?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of finalWeight across the matching connection */
  finalWeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of initialWeight across the matching connection */
  initialWeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of repayTarget across the matching connection */
  repayTarget?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of start across the matching connection */
  start?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbpPoolStddevSampleAggregates = {
  __typename?: 'LbpPoolStddevSampleAggregates';
  /** Sample standard deviation of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of end across the matching connection */
  end?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of finalWeight across the matching connection */
  finalWeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of initialWeight across the matching connection */
  initialWeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of repayTarget across the matching connection */
  repayTarget?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of start across the matching connection */
  start?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbpPoolSumAggregates = {
  __typename?: 'LbpPoolSumAggregates';
  /** Sum of assetAId across the matching connection */
  assetAId: Scalars['BigInt']['output'];
  /** Sum of assetBId across the matching connection */
  assetBId: Scalars['BigInt']['output'];
  /** Sum of end across the matching connection */
  end: Scalars['BigInt']['output'];
  /** Sum of finalWeight across the matching connection */
  finalWeight: Scalars['BigInt']['output'];
  /** Sum of initialWeight across the matching connection */
  initialWeight: Scalars['BigInt']['output'];
  /** Sum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight: Scalars['BigInt']['output'];
  /** Sum of repayTarget across the matching connection */
  repayTarget: Scalars['BigFloat']['output'];
  /** Sum of start across the matching connection */
  start: Scalars['BigInt']['output'];
};

export type LbpPoolVariancePopulationAggregates = {
  __typename?: 'LbpPoolVariancePopulationAggregates';
  /** Population variance of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of end across the matching connection */
  end?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of finalWeight across the matching connection */
  finalWeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of initialWeight across the matching connection */
  initialWeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of repayTarget across the matching connection */
  repayTarget?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of start across the matching connection */
  start?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbpPoolVarianceSampleAggregates = {
  __typename?: 'LbpPoolVarianceSampleAggregates';
  /** Sample variance of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of end across the matching connection */
  end?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of finalWeight across the matching connection */
  finalWeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of initialWeight across the matching connection */
  initialWeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of repayTarget across the matching connection */
  repayTarget?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of start across the matching connection */
  start?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `LbpPool` values. */
export type LbpPoolsConnection = {
  __typename?: 'LbpPoolsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<LbpPoolAggregates>;
  /** A list of edges which contains the `LbpPool` and cursor to aid in pagination. */
  edges: Array<LbpPoolsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<LbpPoolAggregates>>;
  /** A list of `LbpPool` objects. */
  nodes: Array<Maybe<LbpPool>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `LbpPool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `LbpPool` values. */
export type LbpPoolsConnectionGroupedAggregatesArgs = {
  groupBy: Array<LbpPoolGroupBy>;
  having?: InputMaybe<LbpPoolHavingInput>;
};

/** A `LbpPool` edge in the connection. */
export type LbpPoolsEdge = {
  __typename?: 'LbpPoolsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `LbpPool` at the end of the edge. */
  node?: Maybe<LbpPool>;
};

/** Methods to use when ordering `LbpPool`. */
export enum LbpPoolsOrderBy {
  AssetAIdAsc = 'ASSET_A_ID_ASC',
  AssetAIdDesc = 'ASSET_A_ID_DESC',
  AssetBIdAsc = 'ASSET_B_ID_ASC',
  AssetBIdDesc = 'ASSET_B_ID_DESC',
  EndAsc = 'END_ASC',
  EndDesc = 'END_DESC',
  FeeAsc = 'FEE_ASC',
  FeeCollectorAsc = 'FEE_COLLECTOR_ASC',
  FeeCollectorDesc = 'FEE_COLLECTOR_DESC',
  FeeDesc = 'FEE_DESC',
  FinalWeightAsc = 'FINAL_WEIGHT_ASC',
  FinalWeightDesc = 'FINAL_WEIGHT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  InitialWeightAsc = 'INITIAL_WEIGHT_ASC',
  InitialWeightDesc = 'INITIAL_WEIGHT_DESC',
  LbpPoolAssetsDataByPoolIdAverageAssetIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_ASC',
  LbpPoolAssetsDataByPoolIdAverageAssetIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_DESC',
  LbpPoolAssetsDataByPoolIdAverageBalancesAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_BALANCES_ASC',
  LbpPoolAssetsDataByPoolIdAverageBalancesDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_BALANCES_DESC',
  LbpPoolAssetsDataByPoolIdAverageIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ID_ASC',
  LbpPoolAssetsDataByPoolIdAverageIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ID_DESC',
  LbpPoolAssetsDataByPoolIdAverageParaChainBlockHeightAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  LbpPoolAssetsDataByPoolIdAverageParaChainBlockHeightDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  LbpPoolAssetsDataByPoolIdAveragePoolIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_POOL_ID_ASC',
  LbpPoolAssetsDataByPoolIdAveragePoolIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_POOL_ID_DESC',
  LbpPoolAssetsDataByPoolIdCountAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_COUNT_ASC',
  LbpPoolAssetsDataByPoolIdCountDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_COUNT_DESC',
  LbpPoolAssetsDataByPoolIdDistinctCountAssetIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_ASC',
  LbpPoolAssetsDataByPoolIdDistinctCountAssetIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_DESC',
  LbpPoolAssetsDataByPoolIdDistinctCountBalancesAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_ASC',
  LbpPoolAssetsDataByPoolIdDistinctCountBalancesDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_DESC',
  LbpPoolAssetsDataByPoolIdDistinctCountIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_ASC',
  LbpPoolAssetsDataByPoolIdDistinctCountIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_DESC',
  LbpPoolAssetsDataByPoolIdDistinctCountParaChainBlockHeightAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  LbpPoolAssetsDataByPoolIdDistinctCountParaChainBlockHeightDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  LbpPoolAssetsDataByPoolIdDistinctCountPoolIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_ASC',
  LbpPoolAssetsDataByPoolIdDistinctCountPoolIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_DESC',
  LbpPoolAssetsDataByPoolIdMaxAssetIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MAX_ASSET_ID_ASC',
  LbpPoolAssetsDataByPoolIdMaxAssetIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MAX_ASSET_ID_DESC',
  LbpPoolAssetsDataByPoolIdMaxBalancesAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MAX_BALANCES_ASC',
  LbpPoolAssetsDataByPoolIdMaxBalancesDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MAX_BALANCES_DESC',
  LbpPoolAssetsDataByPoolIdMaxIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MAX_ID_ASC',
  LbpPoolAssetsDataByPoolIdMaxIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MAX_ID_DESC',
  LbpPoolAssetsDataByPoolIdMaxParaChainBlockHeightAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MAX_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  LbpPoolAssetsDataByPoolIdMaxParaChainBlockHeightDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MAX_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  LbpPoolAssetsDataByPoolIdMaxPoolIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MAX_POOL_ID_ASC',
  LbpPoolAssetsDataByPoolIdMaxPoolIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MAX_POOL_ID_DESC',
  LbpPoolAssetsDataByPoolIdMinAssetIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MIN_ASSET_ID_ASC',
  LbpPoolAssetsDataByPoolIdMinAssetIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MIN_ASSET_ID_DESC',
  LbpPoolAssetsDataByPoolIdMinBalancesAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MIN_BALANCES_ASC',
  LbpPoolAssetsDataByPoolIdMinBalancesDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MIN_BALANCES_DESC',
  LbpPoolAssetsDataByPoolIdMinIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MIN_ID_ASC',
  LbpPoolAssetsDataByPoolIdMinIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MIN_ID_DESC',
  LbpPoolAssetsDataByPoolIdMinParaChainBlockHeightAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MIN_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  LbpPoolAssetsDataByPoolIdMinParaChainBlockHeightDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MIN_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  LbpPoolAssetsDataByPoolIdMinPoolIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MIN_POOL_ID_ASC',
  LbpPoolAssetsDataByPoolIdMinPoolIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_MIN_POOL_ID_DESC',
  LbpPoolAssetsDataByPoolIdStddevPopulationAssetIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_ASC',
  LbpPoolAssetsDataByPoolIdStddevPopulationAssetIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_DESC',
  LbpPoolAssetsDataByPoolIdStddevPopulationBalancesAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_ASC',
  LbpPoolAssetsDataByPoolIdStddevPopulationBalancesDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_DESC',
  LbpPoolAssetsDataByPoolIdStddevPopulationIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_ASC',
  LbpPoolAssetsDataByPoolIdStddevPopulationIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_DESC',
  LbpPoolAssetsDataByPoolIdStddevPopulationParaChainBlockHeightAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  LbpPoolAssetsDataByPoolIdStddevPopulationParaChainBlockHeightDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  LbpPoolAssetsDataByPoolIdStddevPopulationPoolIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_ASC',
  LbpPoolAssetsDataByPoolIdStddevPopulationPoolIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_DESC',
  LbpPoolAssetsDataByPoolIdStddevSampleAssetIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_ASC',
  LbpPoolAssetsDataByPoolIdStddevSampleAssetIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_DESC',
  LbpPoolAssetsDataByPoolIdStddevSampleBalancesAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_ASC',
  LbpPoolAssetsDataByPoolIdStddevSampleBalancesDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_DESC',
  LbpPoolAssetsDataByPoolIdStddevSampleIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_ASC',
  LbpPoolAssetsDataByPoolIdStddevSampleIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_DESC',
  LbpPoolAssetsDataByPoolIdStddevSampleParaChainBlockHeightAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  LbpPoolAssetsDataByPoolIdStddevSampleParaChainBlockHeightDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  LbpPoolAssetsDataByPoolIdStddevSamplePoolIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_ASC',
  LbpPoolAssetsDataByPoolIdStddevSamplePoolIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_DESC',
  LbpPoolAssetsDataByPoolIdSumAssetIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_SUM_ASSET_ID_ASC',
  LbpPoolAssetsDataByPoolIdSumAssetIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_SUM_ASSET_ID_DESC',
  LbpPoolAssetsDataByPoolIdSumBalancesAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_SUM_BALANCES_ASC',
  LbpPoolAssetsDataByPoolIdSumBalancesDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_SUM_BALANCES_DESC',
  LbpPoolAssetsDataByPoolIdSumIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_SUM_ID_ASC',
  LbpPoolAssetsDataByPoolIdSumIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_SUM_ID_DESC',
  LbpPoolAssetsDataByPoolIdSumParaChainBlockHeightAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_SUM_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  LbpPoolAssetsDataByPoolIdSumParaChainBlockHeightDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_SUM_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  LbpPoolAssetsDataByPoolIdSumPoolIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_SUM_POOL_ID_ASC',
  LbpPoolAssetsDataByPoolIdSumPoolIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_SUM_POOL_ID_DESC',
  LbpPoolAssetsDataByPoolIdVariancePopulationAssetIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_ASC',
  LbpPoolAssetsDataByPoolIdVariancePopulationAssetIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_DESC',
  LbpPoolAssetsDataByPoolIdVariancePopulationBalancesAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_ASC',
  LbpPoolAssetsDataByPoolIdVariancePopulationBalancesDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_DESC',
  LbpPoolAssetsDataByPoolIdVariancePopulationIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_ASC',
  LbpPoolAssetsDataByPoolIdVariancePopulationIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_DESC',
  LbpPoolAssetsDataByPoolIdVariancePopulationParaChainBlockHeightAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  LbpPoolAssetsDataByPoolIdVariancePopulationParaChainBlockHeightDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  LbpPoolAssetsDataByPoolIdVariancePopulationPoolIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_ASC',
  LbpPoolAssetsDataByPoolIdVariancePopulationPoolIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_DESC',
  LbpPoolAssetsDataByPoolIdVarianceSampleAssetIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_ASC',
  LbpPoolAssetsDataByPoolIdVarianceSampleAssetIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_DESC',
  LbpPoolAssetsDataByPoolIdVarianceSampleBalancesAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_ASC',
  LbpPoolAssetsDataByPoolIdVarianceSampleBalancesDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_DESC',
  LbpPoolAssetsDataByPoolIdVarianceSampleIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_ASC',
  LbpPoolAssetsDataByPoolIdVarianceSampleIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_DESC',
  LbpPoolAssetsDataByPoolIdVarianceSampleParaChainBlockHeightAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  LbpPoolAssetsDataByPoolIdVarianceSampleParaChainBlockHeightDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  LbpPoolAssetsDataByPoolIdVarianceSamplePoolIdAsc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_ASC',
  LbpPoolAssetsDataByPoolIdVarianceSamplePoolIdDesc = 'LBP_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_DESC',
  Natural = 'NATURAL',
  OwnerAsc = 'OWNER_ASC',
  OwnerDesc = 'OWNER_DESC',
  ParaChainBlockHeightAsc = 'PARA_CHAIN_BLOCK_HEIGHT_ASC',
  ParaChainBlockHeightDesc = 'PARA_CHAIN_BLOCK_HEIGHT_DESC',
  PoolAddressAsc = 'POOL_ADDRESS_ASC',
  PoolAddressDesc = 'POOL_ADDRESS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RepayTargetAsc = 'REPAY_TARGET_ASC',
  RepayTargetDesc = 'REPAY_TARGET_DESC',
  StartAsc = 'START_ASC',
  StartDesc = 'START_DESC',
  WeightCurveAsc = 'WEIGHT_CURVE_ASC',
  WeightCurveDesc = 'WEIGHT_CURVE_DESC'
}

export type Migration = {
  __typename?: 'Migration';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  timestamp: Scalars['BigInt']['output'];
};

export type MigrationAggregates = {
  __typename?: 'MigrationAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<MigrationAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<MigrationDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<MigrationMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<MigrationMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<MigrationStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<MigrationStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<MigrationSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<MigrationVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<MigrationVarianceSampleAggregates>;
};

export type MigrationAverageAggregates = {
  __typename?: 'MigrationAverageAggregates';
  /** Mean average of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `Migration` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type MigrationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
};

export type MigrationDistinctCountAggregates = {
  __typename?: 'MigrationDistinctCountAggregates';
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Migration` object types. All fields are combined with a logical ‘and.’ */
export type MigrationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MigrationFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<MigrationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MigrationFilter>>;
  /** Filter by the object’s `timestamp` field. */
  timestamp?: InputMaybe<BigIntFilter>;
};

export type MigrationMaxAggregates = {
  __typename?: 'MigrationMaxAggregates';
  /** Maximum of id across the matching connection */
  id?: Maybe<Scalars['Int']['output']>;
  /** Maximum of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigInt']['output']>;
};

export type MigrationMinAggregates = {
  __typename?: 'MigrationMinAggregates';
  /** Minimum of id across the matching connection */
  id?: Maybe<Scalars['Int']['output']>;
  /** Minimum of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigInt']['output']>;
};

export type MigrationStddevPopulationAggregates = {
  __typename?: 'MigrationStddevPopulationAggregates';
  /** Population standard deviation of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type MigrationStddevSampleAggregates = {
  __typename?: 'MigrationStddevSampleAggregates';
  /** Sample standard deviation of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type MigrationSumAggregates = {
  __typename?: 'MigrationSumAggregates';
  /** Sum of id across the matching connection */
  id: Scalars['BigInt']['output'];
  /** Sum of timestamp across the matching connection */
  timestamp: Scalars['BigFloat']['output'];
};

export type MigrationVariancePopulationAggregates = {
  __typename?: 'MigrationVariancePopulationAggregates';
  /** Population variance of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>;
};

export type MigrationVarianceSampleAggregates = {
  __typename?: 'MigrationVarianceSampleAggregates';
  /** Sample variance of id across the matching connection */
  id?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Migration` values. */
export type MigrationsConnection = {
  __typename?: 'MigrationsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<MigrationAggregates>;
  /** A list of edges which contains the `Migration` and cursor to aid in pagination. */
  edges: Array<MigrationsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<MigrationAggregates>>;
  /** A list of `Migration` objects. */
  nodes: Array<Maybe<Migration>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Migration` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Migration` values. */
export type MigrationsConnectionGroupedAggregatesArgs = {
  groupBy: Array<MigrationsGroupBy>;
  having?: InputMaybe<MigrationsHavingInput>;
};

/** A `Migration` edge in the connection. */
export type MigrationsEdge = {
  __typename?: 'MigrationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Migration` at the end of the edge. */
  node?: Maybe<Migration>;
};

/** Grouping methods for `Migration` for usage during aggregation. */
export enum MigrationsGroupBy {
  Name = 'NAME',
  Timestamp = 'TIMESTAMP'
}

export type MigrationsHavingAverageInput = {
  id?: InputMaybe<HavingIntFilter>;
  timestamp?: InputMaybe<HavingBigintFilter>;
};

export type MigrationsHavingDistinctCountInput = {
  id?: InputMaybe<HavingIntFilter>;
  timestamp?: InputMaybe<HavingBigintFilter>;
};

/** Conditions for `Migration` aggregates. */
export type MigrationsHavingInput = {
  AND?: InputMaybe<Array<MigrationsHavingInput>>;
  OR?: InputMaybe<Array<MigrationsHavingInput>>;
  average?: InputMaybe<MigrationsHavingAverageInput>;
  distinctCount?: InputMaybe<MigrationsHavingDistinctCountInput>;
  max?: InputMaybe<MigrationsHavingMaxInput>;
  min?: InputMaybe<MigrationsHavingMinInput>;
  stddevPopulation?: InputMaybe<MigrationsHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<MigrationsHavingStddevSampleInput>;
  sum?: InputMaybe<MigrationsHavingSumInput>;
  variancePopulation?: InputMaybe<MigrationsHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<MigrationsHavingVarianceSampleInput>;
};

export type MigrationsHavingMaxInput = {
  id?: InputMaybe<HavingIntFilter>;
  timestamp?: InputMaybe<HavingBigintFilter>;
};

export type MigrationsHavingMinInput = {
  id?: InputMaybe<HavingIntFilter>;
  timestamp?: InputMaybe<HavingBigintFilter>;
};

export type MigrationsHavingStddevPopulationInput = {
  id?: InputMaybe<HavingIntFilter>;
  timestamp?: InputMaybe<HavingBigintFilter>;
};

export type MigrationsHavingStddevSampleInput = {
  id?: InputMaybe<HavingIntFilter>;
  timestamp?: InputMaybe<HavingBigintFilter>;
};

export type MigrationsHavingSumInput = {
  id?: InputMaybe<HavingIntFilter>;
  timestamp?: InputMaybe<HavingBigintFilter>;
};

export type MigrationsHavingVariancePopulationInput = {
  id?: InputMaybe<HavingIntFilter>;
  timestamp?: InputMaybe<HavingBigintFilter>;
};

export type MigrationsHavingVarianceSampleInput = {
  id?: InputMaybe<HavingIntFilter>;
  timestamp?: InputMaybe<HavingBigintFilter>;
};

/** Methods to use when ordering `Migration`. */
export enum MigrationsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC'
}

/** A connection to a list of `OmnipoolAssetDatum` values. */
export type OmnipoolAssetDataConnection = {
  __typename?: 'OmnipoolAssetDataConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<OmnipoolAssetDatumAggregates>;
  /** A list of edges which contains the `OmnipoolAssetDatum` and cursor to aid in pagination. */
  edges: Array<OmnipoolAssetDataEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<OmnipoolAssetDatumAggregates>>;
  /** A list of `OmnipoolAssetDatum` objects. */
  nodes: Array<Maybe<OmnipoolAssetDatum>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `OmnipoolAssetDatum` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `OmnipoolAssetDatum` values. */
export type OmnipoolAssetDataConnectionGroupedAggregatesArgs = {
  groupBy: Array<OmnipoolAssetDataGroupBy>;
  having?: InputMaybe<OmnipoolAssetDataHavingInput>;
};

/** A `OmnipoolAssetDatum` edge in the connection. */
export type OmnipoolAssetDataEdge = {
  __typename?: 'OmnipoolAssetDataEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `OmnipoolAssetDatum` at the end of the edge. */
  node?: Maybe<OmnipoolAssetDatum>;
};

/** Grouping methods for `OmnipoolAssetDatum` for usage during aggregation. */
export enum OmnipoolAssetDataGroupBy {
  AssetId = 'ASSET_ID',
  AssetState = 'ASSET_STATE',
  Balances = 'BALANCES',
  ParaChainBlockHeight = 'PARA_CHAIN_BLOCK_HEIGHT',
  PoolAddress = 'POOL_ADDRESS'
}

export type OmnipoolAssetDataHavingAverageInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingDistinctCountInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `OmnipoolAssetDatum` aggregates. */
export type OmnipoolAssetDataHavingInput = {
  AND?: InputMaybe<Array<OmnipoolAssetDataHavingInput>>;
  OR?: InputMaybe<Array<OmnipoolAssetDataHavingInput>>;
  average?: InputMaybe<OmnipoolAssetDataHavingAverageInput>;
  distinctCount?: InputMaybe<OmnipoolAssetDataHavingDistinctCountInput>;
  max?: InputMaybe<OmnipoolAssetDataHavingMaxInput>;
  min?: InputMaybe<OmnipoolAssetDataHavingMinInput>;
  stddevPopulation?: InputMaybe<OmnipoolAssetDataHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<OmnipoolAssetDataHavingStddevSampleInput>;
  sum?: InputMaybe<OmnipoolAssetDataHavingSumInput>;
  variancePopulation?: InputMaybe<OmnipoolAssetDataHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<OmnipoolAssetDataHavingVarianceSampleInput>;
};

export type OmnipoolAssetDataHavingMaxInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingMinInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingStddevPopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingStddevSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingSumInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingVariancePopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingVarianceSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Methods to use when ordering `OmnipoolAssetDatum`. */
export enum OmnipoolAssetDataOrderBy {
  AssetIdAsc = 'ASSET_ID_ASC',
  AssetIdDesc = 'ASSET_ID_DESC',
  AssetStateAsc = 'ASSET_STATE_ASC',
  AssetStateDesc = 'ASSET_STATE_DESC',
  BalancesAsc = 'BALANCES_ASC',
  BalancesDesc = 'BALANCES_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  ParaChainBlockHeightAsc = 'PARA_CHAIN_BLOCK_HEIGHT_ASC',
  ParaChainBlockHeightDesc = 'PARA_CHAIN_BLOCK_HEIGHT_DESC',
  PoolAddressAsc = 'POOL_ADDRESS_ASC',
  PoolAddressDesc = 'POOL_ADDRESS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type OmnipoolAssetDatum = {
  __typename?: 'OmnipoolAssetDatum';
  assetId: Scalars['Int']['output'];
  assetState: Scalars['JSON']['output'];
  balances: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  paraChainBlockHeight: Scalars['Int']['output'];
  poolAddress: Scalars['String']['output'];
};

export type OmnipoolAssetDatumAggregates = {
  __typename?: 'OmnipoolAssetDatumAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<OmnipoolAssetDatumAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<OmnipoolAssetDatumDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<OmnipoolAssetDatumMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<OmnipoolAssetDatumMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<OmnipoolAssetDatumStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<OmnipoolAssetDatumStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<OmnipoolAssetDatumSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<OmnipoolAssetDatumVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<OmnipoolAssetDatumVarianceSampleAggregates>;
};

export type OmnipoolAssetDatumAverageAggregates = {
  __typename?: 'OmnipoolAssetDatumAverageAggregates';
  /** Mean average of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `OmnipoolAssetDatum` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type OmnipoolAssetDatumCondition = {
  /** Checks for equality with the object’s `assetId` field. */
  assetId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `assetState` field. */
  assetState?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `balances` field. */
  balances?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<Scalars['String']['input']>;
};

export type OmnipoolAssetDatumDistinctCountAggregates = {
  __typename?: 'OmnipoolAssetDatumDistinctCountAggregates';
  /** Distinct count of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of assetState across the matching connection */
  assetState?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of balances across the matching connection */
  balances?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolAddress across the matching connection */
  poolAddress?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `OmnipoolAssetDatum` object types. All fields are combined with a logical ‘and.’ */
export type OmnipoolAssetDatumFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<OmnipoolAssetDatumFilter>>;
  /** Filter by the object’s `assetId` field. */
  assetId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `assetState` field. */
  assetState?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `balances` field. */
  balances?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<OmnipoolAssetDatumFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<OmnipoolAssetDatumFilter>>;
  /** Filter by the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<StringFilter>;
};

export type OmnipoolAssetDatumMaxAggregates = {
  __typename?: 'OmnipoolAssetDatumMaxAggregates';
  /** Maximum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type OmnipoolAssetDatumMinAggregates = {
  __typename?: 'OmnipoolAssetDatumMinAggregates';
  /** Minimum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type OmnipoolAssetDatumStddevPopulationAggregates = {
  __typename?: 'OmnipoolAssetDatumStddevPopulationAggregates';
  /** Population standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type OmnipoolAssetDatumStddevSampleAggregates = {
  __typename?: 'OmnipoolAssetDatumStddevSampleAggregates';
  /** Sample standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type OmnipoolAssetDatumSumAggregates = {
  __typename?: 'OmnipoolAssetDatumSumAggregates';
  /** Sum of assetId across the matching connection */
  assetId: Scalars['BigInt']['output'];
  /** Sum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight: Scalars['BigInt']['output'];
};

export type OmnipoolAssetDatumVariancePopulationAggregates = {
  __typename?: 'OmnipoolAssetDatumVariancePopulationAggregates';
  /** Population variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type OmnipoolAssetDatumVarianceSampleAggregates = {
  __typename?: 'OmnipoolAssetDatumVarianceSampleAggregates';
  /** Sample variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type OmnipoolAssetState = {
  __typename?: 'OmnipoolAssetState';
  cap: Scalars['BigInt']['output'];
  hubReserve: Scalars['BigInt']['output'];
  protocolShares: Scalars['BigInt']['output'];
  shares: Scalars['BigInt']['output'];
  tradable?: Maybe<Tradability>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: 'Query';
  _apiSupport?: Maybe<ApiSupportResponse>;
  _squidStatus: Array<_ProcessorStatus>;
  lbpPool?: Maybe<LbpPool>;
  /** Reads and enables pagination through a set of `LbpPoolAssetsDatum`. */
  lbpPoolAssetsData?: Maybe<LbpPoolAssetsDataConnection>;
  lbpPoolAssetsDatum?: Maybe<LbpPoolAssetsDatum>;
  /** Reads and enables pagination through a set of `LbpPool`. */
  lbpPools?: Maybe<LbpPoolsConnection>;
  migration?: Maybe<Migration>;
  /** Reads and enables pagination through a set of `Migration`. */
  migrations?: Maybe<MigrationsConnection>;
  /** Reads and enables pagination through a set of `OmnipoolAssetDatum`. */
  omnipoolAssetData?: Maybe<OmnipoolAssetDataConnection>;
  omnipoolAssetDatum?: Maybe<OmnipoolAssetDatum>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  stablepool?: Maybe<Stablepool>;
  /** Reads and enables pagination through a set of `StablepoolAssetDatum`. */
  stablepoolAssetData?: Maybe<StablepoolAssetDataConnection>;
  stablepoolAssetDatum?: Maybe<StablepoolAssetDatum>;
  /** Reads and enables pagination through a set of `Stablepool`. */
  stablepools?: Maybe<StablepoolsConnection>;
  subProcessorStatus?: Maybe<SubProcessorStatus>;
  /** Reads and enables pagination through a set of `SubProcessorStatus`. */
  subProcessorStatuses?: Maybe<SubProcessorStatusesConnection>;
  xykPool?: Maybe<XykPool>;
  /** Reads and enables pagination through a set of `XykPoolAssetsDatum`. */
  xykPoolAssetsData?: Maybe<XykPoolAssetsDataConnection>;
  xykPoolAssetsDatum?: Maybe<XykPoolAssetsDatum>;
  /** Reads and enables pagination through a set of `XykPool`. */
  xykPools?: Maybe<XykPoolsConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryLbpPoolArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryLbpPoolAssetsDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<LbpPoolAssetsDatumCondition>;
  filter?: InputMaybe<LbpPoolAssetsDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LbpPoolAssetsDataOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryLbpPoolAssetsDatumArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryLbpPoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<LbpPoolCondition>;
  filter?: InputMaybe<LbpPoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LbpPoolsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMigrationArgs = {
  id: Scalars['Int']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMigrationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<MigrationCondition>;
  filter?: InputMaybe<MigrationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MigrationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryOmnipoolAssetDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<OmnipoolAssetDatumCondition>;
  filter?: InputMaybe<OmnipoolAssetDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<OmnipoolAssetDataOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryOmnipoolAssetDatumArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryStablepoolArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryStablepoolAssetDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<StablepoolAssetDatumCondition>;
  filter?: InputMaybe<StablepoolAssetDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<StablepoolAssetDataOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryStablepoolAssetDatumArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryStablepoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<StablepoolCondition>;
  filter?: InputMaybe<StablepoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<StablepoolsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySubProcessorStatusArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySubProcessorStatusesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SubProcessorStatusCondition>;
  filter?: InputMaybe<SubProcessorStatusFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SubProcessorStatusesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryXykPoolArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryXykPoolAssetsDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<XykPoolAssetsDatumCondition>;
  filter?: InputMaybe<XykPoolAssetsDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<XykPoolAssetsDataOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryXykPoolAssetsDatumArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryXykPoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<XykPoolCondition>;
  filter?: InputMaybe<XykPoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<XykPoolsOrderBy>>;
};

export type SquidStatusSubscriptionPayload = {
  __typename?: 'SquidStatusSubscriptionPayload';
  event: Scalars['String']['output'];
  node: _ProcessorStatus;
};

export type Stablepool = {
  __typename?: 'Stablepool';
  fee: Scalars['Int']['output'];
  finalAmplification: Scalars['Int']['output'];
  finalBlock: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  initialAmplification: Scalars['Int']['output'];
  initialBlock: Scalars['Int']['output'];
  paraChainBlockHeight: Scalars['Int']['output'];
  poolAddress: Scalars['String']['output'];
  poolId: Scalars['Int']['output'];
  /** Reads and enables pagination through a set of `StablepoolAssetDatum`. */
  stablepoolAssetDataByPoolId: StablepoolAssetDataConnection;
};


export type StablepoolStablepoolAssetDataByPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<StablepoolAssetDatumCondition>;
  filter?: InputMaybe<StablepoolAssetDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<StablepoolAssetDataOrderBy>>;
};

export type StablepoolAggregates = {
  __typename?: 'StablepoolAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<StablepoolAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<StablepoolDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<StablepoolMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<StablepoolMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<StablepoolStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<StablepoolStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<StablepoolSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<StablepoolVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<StablepoolVarianceSampleAggregates>;
};

/** A connection to a list of `StablepoolAssetDatum` values. */
export type StablepoolAssetDataConnection = {
  __typename?: 'StablepoolAssetDataConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<StablepoolAssetDatumAggregates>;
  /** A list of edges which contains the `StablepoolAssetDatum` and cursor to aid in pagination. */
  edges: Array<StablepoolAssetDataEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<StablepoolAssetDatumAggregates>>;
  /** A list of `StablepoolAssetDatum` objects. */
  nodes: Array<Maybe<StablepoolAssetDatum>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `StablepoolAssetDatum` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `StablepoolAssetDatum` values. */
export type StablepoolAssetDataConnectionGroupedAggregatesArgs = {
  groupBy: Array<StablepoolAssetDataGroupBy>;
  having?: InputMaybe<StablepoolAssetDataHavingInput>;
};

/** A `StablepoolAssetDatum` edge in the connection. */
export type StablepoolAssetDataEdge = {
  __typename?: 'StablepoolAssetDataEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `StablepoolAssetDatum` at the end of the edge. */
  node?: Maybe<StablepoolAssetDatum>;
};

/** Grouping methods for `StablepoolAssetDatum` for usage during aggregation. */
export enum StablepoolAssetDataGroupBy {
  AssetId = 'ASSET_ID',
  Balances = 'BALANCES',
  ParaChainBlockHeight = 'PARA_CHAIN_BLOCK_HEIGHT',
  PoolId = 'POOL_ID'
}

export type StablepoolAssetDataHavingAverageInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StablepoolAssetDataHavingDistinctCountInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `StablepoolAssetDatum` aggregates. */
export type StablepoolAssetDataHavingInput = {
  AND?: InputMaybe<Array<StablepoolAssetDataHavingInput>>;
  OR?: InputMaybe<Array<StablepoolAssetDataHavingInput>>;
  average?: InputMaybe<StablepoolAssetDataHavingAverageInput>;
  distinctCount?: InputMaybe<StablepoolAssetDataHavingDistinctCountInput>;
  max?: InputMaybe<StablepoolAssetDataHavingMaxInput>;
  min?: InputMaybe<StablepoolAssetDataHavingMinInput>;
  stddevPopulation?: InputMaybe<StablepoolAssetDataHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<StablepoolAssetDataHavingStddevSampleInput>;
  sum?: InputMaybe<StablepoolAssetDataHavingSumInput>;
  variancePopulation?: InputMaybe<StablepoolAssetDataHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<StablepoolAssetDataHavingVarianceSampleInput>;
};

export type StablepoolAssetDataHavingMaxInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StablepoolAssetDataHavingMinInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StablepoolAssetDataHavingStddevPopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StablepoolAssetDataHavingStddevSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StablepoolAssetDataHavingSumInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StablepoolAssetDataHavingVariancePopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StablepoolAssetDataHavingVarianceSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Methods to use when ordering `StablepoolAssetDatum`. */
export enum StablepoolAssetDataOrderBy {
  AssetIdAsc = 'ASSET_ID_ASC',
  AssetIdDesc = 'ASSET_ID_DESC',
  BalancesAsc = 'BALANCES_ASC',
  BalancesDesc = 'BALANCES_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  ParaChainBlockHeightAsc = 'PARA_CHAIN_BLOCK_HEIGHT_ASC',
  ParaChainBlockHeightDesc = 'PARA_CHAIN_BLOCK_HEIGHT_DESC',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type StablepoolAssetDatum = {
  __typename?: 'StablepoolAssetDatum';
  assetId: Scalars['Int']['output'];
  balances: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  paraChainBlockHeight: Scalars['Int']['output'];
  /** Reads a single `Stablepool` that is related to this `StablepoolAssetDatum`. */
  pool?: Maybe<Stablepool>;
  poolId?: Maybe<Scalars['String']['output']>;
};

export type StablepoolAssetDatumAggregates = {
  __typename?: 'StablepoolAssetDatumAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<StablepoolAssetDatumAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<StablepoolAssetDatumDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<StablepoolAssetDatumMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<StablepoolAssetDatumMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<StablepoolAssetDatumStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<StablepoolAssetDatumStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<StablepoolAssetDatumSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<StablepoolAssetDatumVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<StablepoolAssetDatumVarianceSampleAggregates>;
};

export type StablepoolAssetDatumAverageAggregates = {
  __typename?: 'StablepoolAssetDatumAverageAggregates';
  /** Mean average of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `StablepoolAssetDatum` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type StablepoolAssetDatumCondition = {
  /** Checks for equality with the object’s `assetId` field. */
  assetId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `balances` field. */
  balances?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolId` field. */
  poolId?: InputMaybe<Scalars['String']['input']>;
};

export type StablepoolAssetDatumDistinctCountAggregates = {
  __typename?: 'StablepoolAssetDatumDistinctCountAggregates';
  /** Distinct count of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of balances across the matching connection */
  balances?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `StablepoolAssetDatum` object types. All fields are combined with a logical ‘and.’ */
export type StablepoolAssetDatumFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<StablepoolAssetDatumFilter>>;
  /** Filter by the object’s `assetId` field. */
  assetId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `balances` field. */
  balances?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<StablepoolAssetDatumFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<StablepoolAssetDatumFilter>>;
  /** Filter by the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
};

export type StablepoolAssetDatumMaxAggregates = {
  __typename?: 'StablepoolAssetDatumMaxAggregates';
  /** Maximum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type StablepoolAssetDatumMinAggregates = {
  __typename?: 'StablepoolAssetDatumMinAggregates';
  /** Minimum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type StablepoolAssetDatumStddevPopulationAggregates = {
  __typename?: 'StablepoolAssetDatumStddevPopulationAggregates';
  /** Population standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type StablepoolAssetDatumStddevSampleAggregates = {
  __typename?: 'StablepoolAssetDatumStddevSampleAggregates';
  /** Sample standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type StablepoolAssetDatumSumAggregates = {
  __typename?: 'StablepoolAssetDatumSumAggregates';
  /** Sum of assetId across the matching connection */
  assetId: Scalars['BigInt']['output'];
  /** Sum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight: Scalars['BigInt']['output'];
};

export type StablepoolAssetDatumVariancePopulationAggregates = {
  __typename?: 'StablepoolAssetDatumVariancePopulationAggregates';
  /** Population variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type StablepoolAssetDatumVarianceSampleAggregates = {
  __typename?: 'StablepoolAssetDatumVarianceSampleAggregates';
  /** Sample variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type StablepoolAverageAggregates = {
  __typename?: 'StablepoolAverageAggregates';
  /** Mean average of fee across the matching connection */
  fee?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of finalAmplification across the matching connection */
  finalAmplification?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of finalBlock across the matching connection */
  finalBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of initialAmplification across the matching connection */
  initialAmplification?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of initialBlock across the matching connection */
  initialBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `Stablepool` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type StablepoolCondition = {
  /** Checks for equality with the object’s `fee` field. */
  fee?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `finalAmplification` field. */
  finalAmplification?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `finalBlock` field. */
  finalBlock?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `initialAmplification` field. */
  initialAmplification?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `initialBlock` field. */
  initialBlock?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `poolId` field. */
  poolId?: InputMaybe<Scalars['Int']['input']>;
};

export type StablepoolDistinctCountAggregates = {
  __typename?: 'StablepoolDistinctCountAggregates';
  /** Distinct count of fee across the matching connection */
  fee?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of finalAmplification across the matching connection */
  finalAmplification?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of finalBlock across the matching connection */
  finalBlock?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of initialAmplification across the matching connection */
  initialAmplification?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of initialBlock across the matching connection */
  initialBlock?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolAddress across the matching connection */
  poolAddress?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Stablepool` object types. All fields are combined with a logical ‘and.’ */
export type StablepoolFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<StablepoolFilter>>;
  /** Filter by the object’s `fee` field. */
  fee?: InputMaybe<IntFilter>;
  /** Filter by the object’s `finalAmplification` field. */
  finalAmplification?: InputMaybe<IntFilter>;
  /** Filter by the object’s `finalBlock` field. */
  finalBlock?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `initialAmplification` field. */
  initialAmplification?: InputMaybe<IntFilter>;
  /** Filter by the object’s `initialBlock` field. */
  initialBlock?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<StablepoolFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<StablepoolFilter>>;
  /** Filter by the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<StringFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<IntFilter>;
};

/** Grouping methods for `Stablepool` for usage during aggregation. */
export enum StablepoolGroupBy {
  Fee = 'FEE',
  FinalAmplification = 'FINAL_AMPLIFICATION',
  FinalBlock = 'FINAL_BLOCK',
  InitialAmplification = 'INITIAL_AMPLIFICATION',
  InitialBlock = 'INITIAL_BLOCK',
  ParaChainBlockHeight = 'PARA_CHAIN_BLOCK_HEIGHT',
  PoolAddress = 'POOL_ADDRESS',
  PoolId = 'POOL_ID'
}

export type StablepoolHavingAverageInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StablepoolHavingDistinctCountInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `Stablepool` aggregates. */
export type StablepoolHavingInput = {
  AND?: InputMaybe<Array<StablepoolHavingInput>>;
  OR?: InputMaybe<Array<StablepoolHavingInput>>;
  average?: InputMaybe<StablepoolHavingAverageInput>;
  distinctCount?: InputMaybe<StablepoolHavingDistinctCountInput>;
  max?: InputMaybe<StablepoolHavingMaxInput>;
  min?: InputMaybe<StablepoolHavingMinInput>;
  stddevPopulation?: InputMaybe<StablepoolHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<StablepoolHavingStddevSampleInput>;
  sum?: InputMaybe<StablepoolHavingSumInput>;
  variancePopulation?: InputMaybe<StablepoolHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<StablepoolHavingVarianceSampleInput>;
};

export type StablepoolHavingMaxInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StablepoolHavingMinInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StablepoolHavingStddevPopulationInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StablepoolHavingStddevSampleInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StablepoolHavingSumInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StablepoolHavingVariancePopulationInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StablepoolHavingVarianceSampleInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StablepoolMaxAggregates = {
  __typename?: 'StablepoolMaxAggregates';
  /** Maximum of fee across the matching connection */
  fee?: Maybe<Scalars['Int']['output']>;
  /** Maximum of finalAmplification across the matching connection */
  finalAmplification?: Maybe<Scalars['Int']['output']>;
  /** Maximum of finalBlock across the matching connection */
  finalBlock?: Maybe<Scalars['Int']['output']>;
  /** Maximum of initialAmplification across the matching connection */
  initialAmplification?: Maybe<Scalars['Int']['output']>;
  /** Maximum of initialBlock across the matching connection */
  initialBlock?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
  /** Maximum of poolId across the matching connection */
  poolId?: Maybe<Scalars['Int']['output']>;
};

export type StablepoolMinAggregates = {
  __typename?: 'StablepoolMinAggregates';
  /** Minimum of fee across the matching connection */
  fee?: Maybe<Scalars['Int']['output']>;
  /** Minimum of finalAmplification across the matching connection */
  finalAmplification?: Maybe<Scalars['Int']['output']>;
  /** Minimum of finalBlock across the matching connection */
  finalBlock?: Maybe<Scalars['Int']['output']>;
  /** Minimum of initialAmplification across the matching connection */
  initialAmplification?: Maybe<Scalars['Int']['output']>;
  /** Minimum of initialBlock across the matching connection */
  initialBlock?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
  /** Minimum of poolId across the matching connection */
  poolId?: Maybe<Scalars['Int']['output']>;
};

export type StablepoolStddevPopulationAggregates = {
  __typename?: 'StablepoolStddevPopulationAggregates';
  /** Population standard deviation of fee across the matching connection */
  fee?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of finalAmplification across the matching connection */
  finalAmplification?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of finalBlock across the matching connection */
  finalBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of initialAmplification across the matching connection */
  initialAmplification?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of initialBlock across the matching connection */
  initialBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>;
};

export type StablepoolStddevSampleAggregates = {
  __typename?: 'StablepoolStddevSampleAggregates';
  /** Sample standard deviation of fee across the matching connection */
  fee?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of finalAmplification across the matching connection */
  finalAmplification?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of finalBlock across the matching connection */
  finalBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of initialAmplification across the matching connection */
  initialAmplification?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of initialBlock across the matching connection */
  initialBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>;
};

export type StablepoolSumAggregates = {
  __typename?: 'StablepoolSumAggregates';
  /** Sum of fee across the matching connection */
  fee: Scalars['BigInt']['output'];
  /** Sum of finalAmplification across the matching connection */
  finalAmplification: Scalars['BigInt']['output'];
  /** Sum of finalBlock across the matching connection */
  finalBlock: Scalars['BigInt']['output'];
  /** Sum of initialAmplification across the matching connection */
  initialAmplification: Scalars['BigInt']['output'];
  /** Sum of initialBlock across the matching connection */
  initialBlock: Scalars['BigInt']['output'];
  /** Sum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight: Scalars['BigInt']['output'];
  /** Sum of poolId across the matching connection */
  poolId: Scalars['BigInt']['output'];
};

export type StablepoolVariancePopulationAggregates = {
  __typename?: 'StablepoolVariancePopulationAggregates';
  /** Population variance of fee across the matching connection */
  fee?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of finalAmplification across the matching connection */
  finalAmplification?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of finalBlock across the matching connection */
  finalBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of initialAmplification across the matching connection */
  initialAmplification?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of initialBlock across the matching connection */
  initialBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>;
};

export type StablepoolVarianceSampleAggregates = {
  __typename?: 'StablepoolVarianceSampleAggregates';
  /** Sample variance of fee across the matching connection */
  fee?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of finalAmplification across the matching connection */
  finalAmplification?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of finalBlock across the matching connection */
  finalBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of initialAmplification across the matching connection */
  initialAmplification?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of initialBlock across the matching connection */
  initialBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Stablepool` values. */
export type StablepoolsConnection = {
  __typename?: 'StablepoolsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<StablepoolAggregates>;
  /** A list of edges which contains the `Stablepool` and cursor to aid in pagination. */
  edges: Array<StablepoolsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<StablepoolAggregates>>;
  /** A list of `Stablepool` objects. */
  nodes: Array<Maybe<Stablepool>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Stablepool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Stablepool` values. */
export type StablepoolsConnectionGroupedAggregatesArgs = {
  groupBy: Array<StablepoolGroupBy>;
  having?: InputMaybe<StablepoolHavingInput>;
};

/** A `Stablepool` edge in the connection. */
export type StablepoolsEdge = {
  __typename?: 'StablepoolsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Stablepool` at the end of the edge. */
  node?: Maybe<Stablepool>;
};

/** Methods to use when ordering `Stablepool`. */
export enum StablepoolsOrderBy {
  FeeAsc = 'FEE_ASC',
  FeeDesc = 'FEE_DESC',
  FinalAmplificationAsc = 'FINAL_AMPLIFICATION_ASC',
  FinalAmplificationDesc = 'FINAL_AMPLIFICATION_DESC',
  FinalBlockAsc = 'FINAL_BLOCK_ASC',
  FinalBlockDesc = 'FINAL_BLOCK_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  InitialAmplificationAsc = 'INITIAL_AMPLIFICATION_ASC',
  InitialAmplificationDesc = 'INITIAL_AMPLIFICATION_DESC',
  InitialBlockAsc = 'INITIAL_BLOCK_ASC',
  InitialBlockDesc = 'INITIAL_BLOCK_DESC',
  Natural = 'NATURAL',
  ParaChainBlockHeightAsc = 'PARA_CHAIN_BLOCK_HEIGHT_ASC',
  ParaChainBlockHeightDesc = 'PARA_CHAIN_BLOCK_HEIGHT_DESC',
  PoolAddressAsc = 'POOL_ADDRESS_ASC',
  PoolAddressDesc = 'POOL_ADDRESS_DESC',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  StablepoolAssetDataByPoolIdAverageAssetIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_ASC',
  StablepoolAssetDataByPoolIdAverageAssetIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_DESC',
  StablepoolAssetDataByPoolIdAverageBalancesAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_BALANCES_ASC',
  StablepoolAssetDataByPoolIdAverageBalancesDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_BALANCES_DESC',
  StablepoolAssetDataByPoolIdAverageIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_ID_ASC',
  StablepoolAssetDataByPoolIdAverageIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_ID_DESC',
  StablepoolAssetDataByPoolIdAverageParaChainBlockHeightAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  StablepoolAssetDataByPoolIdAverageParaChainBlockHeightDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  StablepoolAssetDataByPoolIdAveragePoolIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_POOL_ID_ASC',
  StablepoolAssetDataByPoolIdAveragePoolIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_POOL_ID_DESC',
  StablepoolAssetDataByPoolIdCountAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_COUNT_ASC',
  StablepoolAssetDataByPoolIdCountDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_COUNT_DESC',
  StablepoolAssetDataByPoolIdDistinctCountAssetIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_ASC',
  StablepoolAssetDataByPoolIdDistinctCountAssetIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_DESC',
  StablepoolAssetDataByPoolIdDistinctCountBalancesAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_ASC',
  StablepoolAssetDataByPoolIdDistinctCountBalancesDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_DESC',
  StablepoolAssetDataByPoolIdDistinctCountIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_ASC',
  StablepoolAssetDataByPoolIdDistinctCountIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_DESC',
  StablepoolAssetDataByPoolIdDistinctCountParaChainBlockHeightAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  StablepoolAssetDataByPoolIdDistinctCountParaChainBlockHeightDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  StablepoolAssetDataByPoolIdDistinctCountPoolIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_ASC',
  StablepoolAssetDataByPoolIdDistinctCountPoolIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_DESC',
  StablepoolAssetDataByPoolIdMaxAssetIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MAX_ASSET_ID_ASC',
  StablepoolAssetDataByPoolIdMaxAssetIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MAX_ASSET_ID_DESC',
  StablepoolAssetDataByPoolIdMaxBalancesAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MAX_BALANCES_ASC',
  StablepoolAssetDataByPoolIdMaxBalancesDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MAX_BALANCES_DESC',
  StablepoolAssetDataByPoolIdMaxIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MAX_ID_ASC',
  StablepoolAssetDataByPoolIdMaxIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MAX_ID_DESC',
  StablepoolAssetDataByPoolIdMaxParaChainBlockHeightAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MAX_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  StablepoolAssetDataByPoolIdMaxParaChainBlockHeightDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MAX_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  StablepoolAssetDataByPoolIdMaxPoolIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MAX_POOL_ID_ASC',
  StablepoolAssetDataByPoolIdMaxPoolIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MAX_POOL_ID_DESC',
  StablepoolAssetDataByPoolIdMinAssetIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MIN_ASSET_ID_ASC',
  StablepoolAssetDataByPoolIdMinAssetIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MIN_ASSET_ID_DESC',
  StablepoolAssetDataByPoolIdMinBalancesAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MIN_BALANCES_ASC',
  StablepoolAssetDataByPoolIdMinBalancesDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MIN_BALANCES_DESC',
  StablepoolAssetDataByPoolIdMinIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MIN_ID_ASC',
  StablepoolAssetDataByPoolIdMinIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MIN_ID_DESC',
  StablepoolAssetDataByPoolIdMinParaChainBlockHeightAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MIN_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  StablepoolAssetDataByPoolIdMinParaChainBlockHeightDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MIN_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  StablepoolAssetDataByPoolIdMinPoolIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MIN_POOL_ID_ASC',
  StablepoolAssetDataByPoolIdMinPoolIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_MIN_POOL_ID_DESC',
  StablepoolAssetDataByPoolIdStddevPopulationAssetIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_ASC',
  StablepoolAssetDataByPoolIdStddevPopulationAssetIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_DESC',
  StablepoolAssetDataByPoolIdStddevPopulationBalancesAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_ASC',
  StablepoolAssetDataByPoolIdStddevPopulationBalancesDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_DESC',
  StablepoolAssetDataByPoolIdStddevPopulationIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_ASC',
  StablepoolAssetDataByPoolIdStddevPopulationIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_DESC',
  StablepoolAssetDataByPoolIdStddevPopulationParaChainBlockHeightAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  StablepoolAssetDataByPoolIdStddevPopulationParaChainBlockHeightDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  StablepoolAssetDataByPoolIdStddevPopulationPoolIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_ASC',
  StablepoolAssetDataByPoolIdStddevPopulationPoolIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_DESC',
  StablepoolAssetDataByPoolIdStddevSampleAssetIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_ASC',
  StablepoolAssetDataByPoolIdStddevSampleAssetIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_DESC',
  StablepoolAssetDataByPoolIdStddevSampleBalancesAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_ASC',
  StablepoolAssetDataByPoolIdStddevSampleBalancesDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_DESC',
  StablepoolAssetDataByPoolIdStddevSampleIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_ASC',
  StablepoolAssetDataByPoolIdStddevSampleIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_DESC',
  StablepoolAssetDataByPoolIdStddevSampleParaChainBlockHeightAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  StablepoolAssetDataByPoolIdStddevSampleParaChainBlockHeightDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  StablepoolAssetDataByPoolIdStddevSamplePoolIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_ASC',
  StablepoolAssetDataByPoolIdStddevSamplePoolIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_DESC',
  StablepoolAssetDataByPoolIdSumAssetIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_SUM_ASSET_ID_ASC',
  StablepoolAssetDataByPoolIdSumAssetIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_SUM_ASSET_ID_DESC',
  StablepoolAssetDataByPoolIdSumBalancesAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_SUM_BALANCES_ASC',
  StablepoolAssetDataByPoolIdSumBalancesDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_SUM_BALANCES_DESC',
  StablepoolAssetDataByPoolIdSumIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_SUM_ID_ASC',
  StablepoolAssetDataByPoolIdSumIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_SUM_ID_DESC',
  StablepoolAssetDataByPoolIdSumParaChainBlockHeightAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_SUM_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  StablepoolAssetDataByPoolIdSumParaChainBlockHeightDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_SUM_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  StablepoolAssetDataByPoolIdSumPoolIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_SUM_POOL_ID_ASC',
  StablepoolAssetDataByPoolIdSumPoolIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_SUM_POOL_ID_DESC',
  StablepoolAssetDataByPoolIdVariancePopulationAssetIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_ASC',
  StablepoolAssetDataByPoolIdVariancePopulationAssetIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_DESC',
  StablepoolAssetDataByPoolIdVariancePopulationBalancesAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_ASC',
  StablepoolAssetDataByPoolIdVariancePopulationBalancesDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_DESC',
  StablepoolAssetDataByPoolIdVariancePopulationIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_ASC',
  StablepoolAssetDataByPoolIdVariancePopulationIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_DESC',
  StablepoolAssetDataByPoolIdVariancePopulationParaChainBlockHeightAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  StablepoolAssetDataByPoolIdVariancePopulationParaChainBlockHeightDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  StablepoolAssetDataByPoolIdVariancePopulationPoolIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_ASC',
  StablepoolAssetDataByPoolIdVariancePopulationPoolIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_DESC',
  StablepoolAssetDataByPoolIdVarianceSampleAssetIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_ASC',
  StablepoolAssetDataByPoolIdVarianceSampleAssetIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_DESC',
  StablepoolAssetDataByPoolIdVarianceSampleBalancesAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_ASC',
  StablepoolAssetDataByPoolIdVarianceSampleBalancesDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_DESC',
  StablepoolAssetDataByPoolIdVarianceSampleIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_ASC',
  StablepoolAssetDataByPoolIdVarianceSampleIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_DESC',
  StablepoolAssetDataByPoolIdVarianceSampleParaChainBlockHeightAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  StablepoolAssetDataByPoolIdVarianceSampleParaChainBlockHeightDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  StablepoolAssetDataByPoolIdVarianceSamplePoolIdAsc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_ASC',
  StablepoolAssetDataByPoolIdVarianceSamplePoolIdDesc = 'STABLEPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_DESC'
}

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']['input']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']['input']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']['input']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
};

export type SubProcessorStatus = {
  __typename?: 'SubProcessorStatus';
  fromBlock: Scalars['Int']['output'];
  height: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  toBlock: Scalars['Int']['output'];
};

export type SubProcessorStatusAggregates = {
  __typename?: 'SubProcessorStatusAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<SubProcessorStatusAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<SubProcessorStatusDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<SubProcessorStatusMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<SubProcessorStatusMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<SubProcessorStatusStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<SubProcessorStatusStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<SubProcessorStatusSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<SubProcessorStatusVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<SubProcessorStatusVarianceSampleAggregates>;
};

export type SubProcessorStatusAverageAggregates = {
  __typename?: 'SubProcessorStatusAverageAggregates';
  /** Mean average of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `SubProcessorStatus` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SubProcessorStatusCondition = {
  /** Checks for equality with the object’s `fromBlock` field. */
  fromBlock?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `height` field. */
  height?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `toBlock` field. */
  toBlock?: InputMaybe<Scalars['Int']['input']>;
};

export type SubProcessorStatusDistinctCountAggregates = {
  __typename?: 'SubProcessorStatusDistinctCountAggregates';
  /** Distinct count of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of height across the matching connection */
  height?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `SubProcessorStatus` object types. All fields are combined with a logical ‘and.’ */
export type SubProcessorStatusFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SubProcessorStatusFilter>>;
  /** Filter by the object’s `fromBlock` field. */
  fromBlock?: InputMaybe<IntFilter>;
  /** Filter by the object’s `height` field. */
  height?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SubProcessorStatusFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SubProcessorStatusFilter>>;
  /** Filter by the object’s `toBlock` field. */
  toBlock?: InputMaybe<IntFilter>;
};

/** Grouping methods for `SubProcessorStatus` for usage during aggregation. */
export enum SubProcessorStatusGroupBy {
  FromBlock = 'FROM_BLOCK',
  Height = 'HEIGHT',
  ToBlock = 'TO_BLOCK'
}

export type SubProcessorStatusHavingAverageInput = {
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingDistinctCountInput = {
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `SubProcessorStatus` aggregates. */
export type SubProcessorStatusHavingInput = {
  AND?: InputMaybe<Array<SubProcessorStatusHavingInput>>;
  OR?: InputMaybe<Array<SubProcessorStatusHavingInput>>;
  average?: InputMaybe<SubProcessorStatusHavingAverageInput>;
  distinctCount?: InputMaybe<SubProcessorStatusHavingDistinctCountInput>;
  max?: InputMaybe<SubProcessorStatusHavingMaxInput>;
  min?: InputMaybe<SubProcessorStatusHavingMinInput>;
  stddevPopulation?: InputMaybe<SubProcessorStatusHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<SubProcessorStatusHavingStddevSampleInput>;
  sum?: InputMaybe<SubProcessorStatusHavingSumInput>;
  variancePopulation?: InputMaybe<SubProcessorStatusHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<SubProcessorStatusHavingVarianceSampleInput>;
};

export type SubProcessorStatusHavingMaxInput = {
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingMinInput = {
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingStddevPopulationInput = {
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingStddevSampleInput = {
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingSumInput = {
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingVariancePopulationInput = {
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingVarianceSampleInput = {
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusMaxAggregates = {
  __typename?: 'SubProcessorStatusMaxAggregates';
  /** Maximum of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['Int']['output']>;
  /** Maximum of height across the matching connection */
  height?: Maybe<Scalars['Int']['output']>;
  /** Maximum of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['Int']['output']>;
};

export type SubProcessorStatusMinAggregates = {
  __typename?: 'SubProcessorStatusMinAggregates';
  /** Minimum of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['Int']['output']>;
  /** Minimum of height across the matching connection */
  height?: Maybe<Scalars['Int']['output']>;
  /** Minimum of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['Int']['output']>;
};

export type SubProcessorStatusStddevPopulationAggregates = {
  __typename?: 'SubProcessorStatusStddevPopulationAggregates';
  /** Population standard deviation of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['BigFloat']['output']>;
};

export type SubProcessorStatusStddevSampleAggregates = {
  __typename?: 'SubProcessorStatusStddevSampleAggregates';
  /** Sample standard deviation of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['BigFloat']['output']>;
};

export type SubProcessorStatusSumAggregates = {
  __typename?: 'SubProcessorStatusSumAggregates';
  /** Sum of fromBlock across the matching connection */
  fromBlock: Scalars['BigInt']['output'];
  /** Sum of height across the matching connection */
  height: Scalars['BigInt']['output'];
  /** Sum of toBlock across the matching connection */
  toBlock: Scalars['BigInt']['output'];
};

export type SubProcessorStatusVariancePopulationAggregates = {
  __typename?: 'SubProcessorStatusVariancePopulationAggregates';
  /** Population variance of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['BigFloat']['output']>;
};

export type SubProcessorStatusVarianceSampleAggregates = {
  __typename?: 'SubProcessorStatusVarianceSampleAggregates';
  /** Sample variance of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `SubProcessorStatus` values. */
export type SubProcessorStatusesConnection = {
  __typename?: 'SubProcessorStatusesConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<SubProcessorStatusAggregates>;
  /** A list of edges which contains the `SubProcessorStatus` and cursor to aid in pagination. */
  edges: Array<SubProcessorStatusesEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<SubProcessorStatusAggregates>>;
  /** A list of `SubProcessorStatus` objects. */
  nodes: Array<Maybe<SubProcessorStatus>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SubProcessorStatus` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `SubProcessorStatus` values. */
export type SubProcessorStatusesConnectionGroupedAggregatesArgs = {
  groupBy: Array<SubProcessorStatusGroupBy>;
  having?: InputMaybe<SubProcessorStatusHavingInput>;
};

/** A `SubProcessorStatus` edge in the connection. */
export type SubProcessorStatusesEdge = {
  __typename?: 'SubProcessorStatusesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `SubProcessorStatus` at the end of the edge. */
  node?: Maybe<SubProcessorStatus>;
};

/** Methods to use when ordering `SubProcessorStatus`. */
export enum SubProcessorStatusesOrderBy {
  FromBlockAsc = 'FROM_BLOCK_ASC',
  FromBlockDesc = 'FROM_BLOCK_DESC',
  HeightAsc = 'HEIGHT_ASC',
  HeightDesc = 'HEIGHT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ToBlockAsc = 'TO_BLOCK_ASC',
  ToBlockDesc = 'TO_BLOCK_DESC'
}

/** The root subscription type: contains realtime events you can subscribe to with the `subscription` operation. */
export type Subscription = {
  __typename?: 'Subscription';
  squidStatus?: Maybe<SquidStatusSubscriptionPayload>;
};

export type Tradability = {
  __typename?: 'Tradability';
  bits: Scalars['Int']['output'];
};

export type XykPool = {
  __typename?: 'XykPool';
  assetAId: Scalars['Int']['output'];
  assetBId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  paraChainBlockHeight: Scalars['Int']['output'];
  poolAddress: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `XykPoolAssetsDatum`. */
  xykPoolAssetsDataByPoolId: XykPoolAssetsDataConnection;
};


export type XykPoolXykPoolAssetsDataByPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<XykPoolAssetsDatumCondition>;
  filter?: InputMaybe<XykPoolAssetsDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<XykPoolAssetsDataOrderBy>>;
};

export type XykPoolAggregates = {
  __typename?: 'XykPoolAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<XykPoolAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<XykPoolDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<XykPoolMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<XykPoolMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<XykPoolStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<XykPoolStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<XykPoolSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<XykPoolVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<XykPoolVarianceSampleAggregates>;
};

/** A connection to a list of `XykPoolAssetsDatum` values. */
export type XykPoolAssetsDataConnection = {
  __typename?: 'XykPoolAssetsDataConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<XykPoolAssetsDatumAggregates>;
  /** A list of edges which contains the `XykPoolAssetsDatum` and cursor to aid in pagination. */
  edges: Array<XykPoolAssetsDataEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<XykPoolAssetsDatumAggregates>>;
  /** A list of `XykPoolAssetsDatum` objects. */
  nodes: Array<Maybe<XykPoolAssetsDatum>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `XykPoolAssetsDatum` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `XykPoolAssetsDatum` values. */
export type XykPoolAssetsDataConnectionGroupedAggregatesArgs = {
  groupBy: Array<XykPoolAssetsDataGroupBy>;
  having?: InputMaybe<XykPoolAssetsDataHavingInput>;
};

/** A `XykPoolAssetsDatum` edge in the connection. */
export type XykPoolAssetsDataEdge = {
  __typename?: 'XykPoolAssetsDataEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `XykPoolAssetsDatum` at the end of the edge. */
  node?: Maybe<XykPoolAssetsDatum>;
};

/** Grouping methods for `XykPoolAssetsDatum` for usage during aggregation. */
export enum XykPoolAssetsDataGroupBy {
  AssetId = 'ASSET_ID',
  Balances = 'BALANCES',
  ParaChainBlockHeight = 'PARA_CHAIN_BLOCK_HEIGHT',
  PoolId = 'POOL_ID'
}

export type XykPoolAssetsDataHavingAverageInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolAssetsDataHavingDistinctCountInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `XykPoolAssetsDatum` aggregates. */
export type XykPoolAssetsDataHavingInput = {
  AND?: InputMaybe<Array<XykPoolAssetsDataHavingInput>>;
  OR?: InputMaybe<Array<XykPoolAssetsDataHavingInput>>;
  average?: InputMaybe<XykPoolAssetsDataHavingAverageInput>;
  distinctCount?: InputMaybe<XykPoolAssetsDataHavingDistinctCountInput>;
  max?: InputMaybe<XykPoolAssetsDataHavingMaxInput>;
  min?: InputMaybe<XykPoolAssetsDataHavingMinInput>;
  stddevPopulation?: InputMaybe<XykPoolAssetsDataHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<XykPoolAssetsDataHavingStddevSampleInput>;
  sum?: InputMaybe<XykPoolAssetsDataHavingSumInput>;
  variancePopulation?: InputMaybe<XykPoolAssetsDataHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<XykPoolAssetsDataHavingVarianceSampleInput>;
};

export type XykPoolAssetsDataHavingMaxInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolAssetsDataHavingMinInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolAssetsDataHavingStddevPopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolAssetsDataHavingStddevSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolAssetsDataHavingSumInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolAssetsDataHavingVariancePopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolAssetsDataHavingVarianceSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Methods to use when ordering `XykPoolAssetsDatum`. */
export enum XykPoolAssetsDataOrderBy {
  AssetIdAsc = 'ASSET_ID_ASC',
  AssetIdDesc = 'ASSET_ID_DESC',
  BalancesAsc = 'BALANCES_ASC',
  BalancesDesc = 'BALANCES_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  ParaChainBlockHeightAsc = 'PARA_CHAIN_BLOCK_HEIGHT_ASC',
  ParaChainBlockHeightDesc = 'PARA_CHAIN_BLOCK_HEIGHT_DESC',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type XykPoolAssetsDatum = {
  __typename?: 'XykPoolAssetsDatum';
  assetId: Scalars['Int']['output'];
  balances: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  paraChainBlockHeight: Scalars['Int']['output'];
  /** Reads a single `XykPool` that is related to this `XykPoolAssetsDatum`. */
  pool?: Maybe<XykPool>;
  poolId?: Maybe<Scalars['String']['output']>;
};

export type XykPoolAssetsDatumAggregates = {
  __typename?: 'XykPoolAssetsDatumAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<XykPoolAssetsDatumAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<XykPoolAssetsDatumDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<XykPoolAssetsDatumMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<XykPoolAssetsDatumMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<XykPoolAssetsDatumStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<XykPoolAssetsDatumStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<XykPoolAssetsDatumSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<XykPoolAssetsDatumVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<XykPoolAssetsDatumVarianceSampleAggregates>;
};

export type XykPoolAssetsDatumAverageAggregates = {
  __typename?: 'XykPoolAssetsDatumAverageAggregates';
  /** Mean average of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `XykPoolAssetsDatum` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type XykPoolAssetsDatumCondition = {
  /** Checks for equality with the object’s `assetId` field. */
  assetId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `balances` field. */
  balances?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolId` field. */
  poolId?: InputMaybe<Scalars['String']['input']>;
};

export type XykPoolAssetsDatumDistinctCountAggregates = {
  __typename?: 'XykPoolAssetsDatumDistinctCountAggregates';
  /** Distinct count of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of balances across the matching connection */
  balances?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `XykPoolAssetsDatum` object types. All fields are combined with a logical ‘and.’ */
export type XykPoolAssetsDatumFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<XykPoolAssetsDatumFilter>>;
  /** Filter by the object’s `assetId` field. */
  assetId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `balances` field. */
  balances?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<XykPoolAssetsDatumFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<XykPoolAssetsDatumFilter>>;
  /** Filter by the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
};

export type XykPoolAssetsDatumMaxAggregates = {
  __typename?: 'XykPoolAssetsDatumMaxAggregates';
  /** Maximum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type XykPoolAssetsDatumMinAggregates = {
  __typename?: 'XykPoolAssetsDatumMinAggregates';
  /** Minimum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type XykPoolAssetsDatumStddevPopulationAggregates = {
  __typename?: 'XykPoolAssetsDatumStddevPopulationAggregates';
  /** Population standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykPoolAssetsDatumStddevSampleAggregates = {
  __typename?: 'XykPoolAssetsDatumStddevSampleAggregates';
  /** Sample standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykPoolAssetsDatumSumAggregates = {
  __typename?: 'XykPoolAssetsDatumSumAggregates';
  /** Sum of assetId across the matching connection */
  assetId: Scalars['BigInt']['output'];
  /** Sum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight: Scalars['BigInt']['output'];
};

export type XykPoolAssetsDatumVariancePopulationAggregates = {
  __typename?: 'XykPoolAssetsDatumVariancePopulationAggregates';
  /** Population variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykPoolAssetsDatumVarianceSampleAggregates = {
  __typename?: 'XykPoolAssetsDatumVarianceSampleAggregates';
  /** Sample variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykPoolAverageAggregates = {
  __typename?: 'XykPoolAverageAggregates';
  /** Mean average of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/** A condition to be used against `XykPool` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type XykPoolCondition = {
  /** Checks for equality with the object’s `assetAId` field. */
  assetAId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `assetBId` field. */
  assetBId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<Scalars['String']['input']>;
};

export type XykPoolDistinctCountAggregates = {
  __typename?: 'XykPoolDistinctCountAggregates';
  /** Distinct count of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolAddress across the matching connection */
  poolAddress?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `XykPool` object types. All fields are combined with a logical ‘and.’ */
export type XykPoolFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<XykPoolFilter>>;
  /** Filter by the object’s `assetAId` field. */
  assetAId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `assetBId` field. */
  assetBId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<XykPoolFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<XykPoolFilter>>;
  /** Filter by the object’s `paraChainBlockHeight` field. */
  paraChainBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<StringFilter>;
};

/** Grouping methods for `XykPool` for usage during aggregation. */
export enum XykPoolGroupBy {
  AssetAId = 'ASSET_A_ID',
  AssetBId = 'ASSET_B_ID',
  ParaChainBlockHeight = 'PARA_CHAIN_BLOCK_HEIGHT',
  PoolAddress = 'POOL_ADDRESS'
}

export type XykPoolHavingAverageInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolHavingDistinctCountInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `XykPool` aggregates. */
export type XykPoolHavingInput = {
  AND?: InputMaybe<Array<XykPoolHavingInput>>;
  OR?: InputMaybe<Array<XykPoolHavingInput>>;
  average?: InputMaybe<XykPoolHavingAverageInput>;
  distinctCount?: InputMaybe<XykPoolHavingDistinctCountInput>;
  max?: InputMaybe<XykPoolHavingMaxInput>;
  min?: InputMaybe<XykPoolHavingMinInput>;
  stddevPopulation?: InputMaybe<XykPoolHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<XykPoolHavingStddevSampleInput>;
  sum?: InputMaybe<XykPoolHavingSumInput>;
  variancePopulation?: InputMaybe<XykPoolHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<XykPoolHavingVarianceSampleInput>;
};

export type XykPoolHavingMaxInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolHavingMinInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolHavingStddevPopulationInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolHavingStddevSampleInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolHavingSumInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolHavingVariancePopulationInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolHavingVarianceSampleInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraChainBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykPoolMaxAggregates = {
  __typename?: 'XykPoolMaxAggregates';
  /** Maximum of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type XykPoolMinAggregates = {
  __typename?: 'XykPoolMinAggregates';
  /** Minimum of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type XykPoolStddevPopulationAggregates = {
  __typename?: 'XykPoolStddevPopulationAggregates';
  /** Population standard deviation of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykPoolStddevSampleAggregates = {
  __typename?: 'XykPoolStddevSampleAggregates';
  /** Sample standard deviation of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykPoolSumAggregates = {
  __typename?: 'XykPoolSumAggregates';
  /** Sum of assetAId across the matching connection */
  assetAId: Scalars['BigInt']['output'];
  /** Sum of assetBId across the matching connection */
  assetBId: Scalars['BigInt']['output'];
  /** Sum of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight: Scalars['BigInt']['output'];
};

export type XykPoolVariancePopulationAggregates = {
  __typename?: 'XykPoolVariancePopulationAggregates';
  /** Population variance of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykPoolVarianceSampleAggregates = {
  __typename?: 'XykPoolVarianceSampleAggregates';
  /** Sample variance of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraChainBlockHeight across the matching connection */
  paraChainBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `XykPool` values. */
export type XykPoolsConnection = {
  __typename?: 'XykPoolsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<XykPoolAggregates>;
  /** A list of edges which contains the `XykPool` and cursor to aid in pagination. */
  edges: Array<XykPoolsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<XykPoolAggregates>>;
  /** A list of `XykPool` objects. */
  nodes: Array<Maybe<XykPool>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `XykPool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `XykPool` values. */
export type XykPoolsConnectionGroupedAggregatesArgs = {
  groupBy: Array<XykPoolGroupBy>;
  having?: InputMaybe<XykPoolHavingInput>;
};

/** A `XykPool` edge in the connection. */
export type XykPoolsEdge = {
  __typename?: 'XykPoolsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `XykPool` at the end of the edge. */
  node?: Maybe<XykPool>;
};

/** Methods to use when ordering `XykPool`. */
export enum XykPoolsOrderBy {
  AssetAIdAsc = 'ASSET_A_ID_ASC',
  AssetAIdDesc = 'ASSET_A_ID_DESC',
  AssetBIdAsc = 'ASSET_B_ID_ASC',
  AssetBIdDesc = 'ASSET_B_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  ParaChainBlockHeightAsc = 'PARA_CHAIN_BLOCK_HEIGHT_ASC',
  ParaChainBlockHeightDesc = 'PARA_CHAIN_BLOCK_HEIGHT_DESC',
  PoolAddressAsc = 'POOL_ADDRESS_ASC',
  PoolAddressDesc = 'POOL_ADDRESS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  XykPoolAssetsDataByPoolIdAverageAssetIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_ASC',
  XykPoolAssetsDataByPoolIdAverageAssetIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_DESC',
  XykPoolAssetsDataByPoolIdAverageBalancesAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_BALANCES_ASC',
  XykPoolAssetsDataByPoolIdAverageBalancesDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_BALANCES_DESC',
  XykPoolAssetsDataByPoolIdAverageIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ID_ASC',
  XykPoolAssetsDataByPoolIdAverageIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ID_DESC',
  XykPoolAssetsDataByPoolIdAverageParaChainBlockHeightAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  XykPoolAssetsDataByPoolIdAverageParaChainBlockHeightDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  XykPoolAssetsDataByPoolIdAveragePoolIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_POOL_ID_ASC',
  XykPoolAssetsDataByPoolIdAveragePoolIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_POOL_ID_DESC',
  XykPoolAssetsDataByPoolIdCountAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_COUNT_ASC',
  XykPoolAssetsDataByPoolIdCountDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_COUNT_DESC',
  XykPoolAssetsDataByPoolIdDistinctCountAssetIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_ASC',
  XykPoolAssetsDataByPoolIdDistinctCountAssetIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_DESC',
  XykPoolAssetsDataByPoolIdDistinctCountBalancesAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_ASC',
  XykPoolAssetsDataByPoolIdDistinctCountBalancesDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_DESC',
  XykPoolAssetsDataByPoolIdDistinctCountIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_ASC',
  XykPoolAssetsDataByPoolIdDistinctCountIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_DESC',
  XykPoolAssetsDataByPoolIdDistinctCountParaChainBlockHeightAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  XykPoolAssetsDataByPoolIdDistinctCountParaChainBlockHeightDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  XykPoolAssetsDataByPoolIdDistinctCountPoolIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_ASC',
  XykPoolAssetsDataByPoolIdDistinctCountPoolIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_DESC',
  XykPoolAssetsDataByPoolIdMaxAssetIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MAX_ASSET_ID_ASC',
  XykPoolAssetsDataByPoolIdMaxAssetIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MAX_ASSET_ID_DESC',
  XykPoolAssetsDataByPoolIdMaxBalancesAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MAX_BALANCES_ASC',
  XykPoolAssetsDataByPoolIdMaxBalancesDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MAX_BALANCES_DESC',
  XykPoolAssetsDataByPoolIdMaxIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MAX_ID_ASC',
  XykPoolAssetsDataByPoolIdMaxIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MAX_ID_DESC',
  XykPoolAssetsDataByPoolIdMaxParaChainBlockHeightAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MAX_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  XykPoolAssetsDataByPoolIdMaxParaChainBlockHeightDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MAX_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  XykPoolAssetsDataByPoolIdMaxPoolIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MAX_POOL_ID_ASC',
  XykPoolAssetsDataByPoolIdMaxPoolIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MAX_POOL_ID_DESC',
  XykPoolAssetsDataByPoolIdMinAssetIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MIN_ASSET_ID_ASC',
  XykPoolAssetsDataByPoolIdMinAssetIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MIN_ASSET_ID_DESC',
  XykPoolAssetsDataByPoolIdMinBalancesAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MIN_BALANCES_ASC',
  XykPoolAssetsDataByPoolIdMinBalancesDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MIN_BALANCES_DESC',
  XykPoolAssetsDataByPoolIdMinIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MIN_ID_ASC',
  XykPoolAssetsDataByPoolIdMinIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MIN_ID_DESC',
  XykPoolAssetsDataByPoolIdMinParaChainBlockHeightAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MIN_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  XykPoolAssetsDataByPoolIdMinParaChainBlockHeightDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MIN_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  XykPoolAssetsDataByPoolIdMinPoolIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MIN_POOL_ID_ASC',
  XykPoolAssetsDataByPoolIdMinPoolIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_MIN_POOL_ID_DESC',
  XykPoolAssetsDataByPoolIdStddevPopulationAssetIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_ASC',
  XykPoolAssetsDataByPoolIdStddevPopulationAssetIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_DESC',
  XykPoolAssetsDataByPoolIdStddevPopulationBalancesAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_ASC',
  XykPoolAssetsDataByPoolIdStddevPopulationBalancesDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_DESC',
  XykPoolAssetsDataByPoolIdStddevPopulationIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_ASC',
  XykPoolAssetsDataByPoolIdStddevPopulationIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_DESC',
  XykPoolAssetsDataByPoolIdStddevPopulationParaChainBlockHeightAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  XykPoolAssetsDataByPoolIdStddevPopulationParaChainBlockHeightDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  XykPoolAssetsDataByPoolIdStddevPopulationPoolIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_ASC',
  XykPoolAssetsDataByPoolIdStddevPopulationPoolIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_DESC',
  XykPoolAssetsDataByPoolIdStddevSampleAssetIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_ASC',
  XykPoolAssetsDataByPoolIdStddevSampleAssetIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_DESC',
  XykPoolAssetsDataByPoolIdStddevSampleBalancesAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_ASC',
  XykPoolAssetsDataByPoolIdStddevSampleBalancesDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_DESC',
  XykPoolAssetsDataByPoolIdStddevSampleIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_ASC',
  XykPoolAssetsDataByPoolIdStddevSampleIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_DESC',
  XykPoolAssetsDataByPoolIdStddevSampleParaChainBlockHeightAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  XykPoolAssetsDataByPoolIdStddevSampleParaChainBlockHeightDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  XykPoolAssetsDataByPoolIdStddevSamplePoolIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_ASC',
  XykPoolAssetsDataByPoolIdStddevSamplePoolIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_DESC',
  XykPoolAssetsDataByPoolIdSumAssetIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_SUM_ASSET_ID_ASC',
  XykPoolAssetsDataByPoolIdSumAssetIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_SUM_ASSET_ID_DESC',
  XykPoolAssetsDataByPoolIdSumBalancesAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_SUM_BALANCES_ASC',
  XykPoolAssetsDataByPoolIdSumBalancesDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_SUM_BALANCES_DESC',
  XykPoolAssetsDataByPoolIdSumIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_SUM_ID_ASC',
  XykPoolAssetsDataByPoolIdSumIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_SUM_ID_DESC',
  XykPoolAssetsDataByPoolIdSumParaChainBlockHeightAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_SUM_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  XykPoolAssetsDataByPoolIdSumParaChainBlockHeightDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_SUM_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  XykPoolAssetsDataByPoolIdSumPoolIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_SUM_POOL_ID_ASC',
  XykPoolAssetsDataByPoolIdSumPoolIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_SUM_POOL_ID_DESC',
  XykPoolAssetsDataByPoolIdVariancePopulationAssetIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_ASC',
  XykPoolAssetsDataByPoolIdVariancePopulationAssetIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_DESC',
  XykPoolAssetsDataByPoolIdVariancePopulationBalancesAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_ASC',
  XykPoolAssetsDataByPoolIdVariancePopulationBalancesDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_DESC',
  XykPoolAssetsDataByPoolIdVariancePopulationIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_ASC',
  XykPoolAssetsDataByPoolIdVariancePopulationIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_DESC',
  XykPoolAssetsDataByPoolIdVariancePopulationParaChainBlockHeightAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  XykPoolAssetsDataByPoolIdVariancePopulationParaChainBlockHeightDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  XykPoolAssetsDataByPoolIdVariancePopulationPoolIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_ASC',
  XykPoolAssetsDataByPoolIdVariancePopulationPoolIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_DESC',
  XykPoolAssetsDataByPoolIdVarianceSampleAssetIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_ASC',
  XykPoolAssetsDataByPoolIdVarianceSampleAssetIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_DESC',
  XykPoolAssetsDataByPoolIdVarianceSampleBalancesAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_ASC',
  XykPoolAssetsDataByPoolIdVarianceSampleBalancesDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_DESC',
  XykPoolAssetsDataByPoolIdVarianceSampleIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_ASC',
  XykPoolAssetsDataByPoolIdVarianceSampleIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_DESC',
  XykPoolAssetsDataByPoolIdVarianceSampleParaChainBlockHeightAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_CHAIN_BLOCK_HEIGHT_ASC',
  XykPoolAssetsDataByPoolIdVarianceSampleParaChainBlockHeightDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_CHAIN_BLOCK_HEIGHT_DESC',
  XykPoolAssetsDataByPoolIdVarianceSamplePoolIdAsc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_ASC',
  XykPoolAssetsDataByPoolIdVarianceSamplePoolIdDesc = 'XYK_POOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_DESC'
}

export type _ProcessorStatus = {
  __typename?: '_ProcessorStatus';
  batchBlockFrom: Scalars['Int']['output'];
  batchBlockTo: Scalars['Int']['output'];
  hash: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type GetOmnipoolBlocksStorageStateQueryVariables = Exact<{
  filter?: InputMaybe<OmnipoolAssetDatumFilter>;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<OmnipoolAssetDataOrderBy> | OmnipoolAssetDataOrderBy>;
}>;


export type GetOmnipoolBlocksStorageStateQuery = { __typename?: 'Query', omnipoolAssetData?: { __typename?: 'OmnipoolAssetDataConnection', totalCount: number, nodes: Array<{ __typename?: 'OmnipoolAssetDatum', assetId: number, assetState: any, balances: any, id: string, paraChainBlockHeight: number, poolAddress: string } | null> } | null };

export type GetLbpPoolBlocksStorageStateQueryVariables = Exact<{
  filter?: InputMaybe<LbpPoolFilter>;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<LbpPoolsOrderBy> | LbpPoolsOrderBy>;
}>;


export type GetLbpPoolBlocksStorageStateQuery = { __typename?: 'Query', lbpPools?: { __typename?: 'LbpPoolsConnection', totalCount: number, nodes: Array<{ __typename?: 'LbpPool', id: string, poolAddress: string, assetAId: number, assetBId: number, owner: string, repayTarget: any, weightCurve: string, initialWeight: number, finalWeight: number, feeCollector?: string | null, fee: Array<number | null>, start?: number | null, end?: number | null, paraChainBlockHeight: number, lbpPoolAssetsDataByPoolId: { __typename?: 'LbpPoolAssetsDataConnection', nodes: Array<{ __typename?: 'LbpPoolAssetsDatum', id: string, assetId: number, poolId?: string | null, balances: any, paraChainBlockHeight: number } | null> } } | null> } | null };

export type GetXykPoolBlocksStorageStateQueryVariables = Exact<{
  filter?: InputMaybe<XykPoolFilter>;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<XykPoolsOrderBy> | XykPoolsOrderBy>;
}>;


export type GetXykPoolBlocksStorageStateQuery = { __typename?: 'Query', xykPools?: { __typename?: 'XykPoolsConnection', totalCount: number, nodes: Array<{ __typename?: 'XykPool', assetAId: number, assetBId: number, id: string, paraChainBlockHeight: number, poolAddress: string, xykPoolAssetsDataByPoolId: { __typename?: 'XykPoolAssetsDataConnection', nodes: Array<{ __typename?: 'XykPoolAssetsDatum', assetId: number, balances: any, id: string, paraChainBlockHeight: number, poolId?: string | null } | null> } } | null> } | null };

export type GetStablepoolBlocksStorageStateQueryVariables = Exact<{
  filter?: InputMaybe<StablepoolFilter>;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<StablepoolsOrderBy> | StablepoolsOrderBy>;
}>;


export type GetStablepoolBlocksStorageStateQuery = { __typename?: 'Query', stablepools?: { __typename?: 'StablepoolsConnection', totalCount: number, nodes: Array<{ __typename?: 'Stablepool', fee: number, finalAmplification: number, finalBlock: number, id: string, initialAmplification: number, initialBlock: number, paraChainBlockHeight: number, poolAddress: string, poolId: number, stablepoolAssetDataByPoolId: { __typename?: 'StablepoolAssetDataConnection', nodes: Array<{ __typename?: 'StablepoolAssetDatum', assetId: number, balances: any, id: string, paraChainBlockHeight: number, poolId?: string | null } | null> } } | null> } | null };


export const GetOmnipoolBlocksStorageState = gql`
    query GetOmnipoolBlocksStorageState($filter: OmnipoolAssetDatumFilter, $first: Int!, $offset: Int!, $orderBy: [OmnipoolAssetDataOrderBy!]) {
  omnipoolAssetData(
    filter: $filter
    orderBy: $orderBy
    first: $first
    offset: $offset
  ) {
    nodes {
      assetId
      assetState
      balances
      id
      paraChainBlockHeight
      poolAddress
    }
    totalCount
  }
}
    `;
export const GetLbpPoolBlocksStorageState = gql`
    query GetLbpPoolBlocksStorageState($filter: LbpPoolFilter, $first: Int!, $offset: Int!, $orderBy: [LbpPoolsOrderBy!]) {
  lbpPools(filter: $filter, orderBy: $orderBy, first: $first, offset: $offset) {
    nodes {
      id
      poolAddress
      assetAId
      assetBId
      owner
      repayTarget
      weightCurve
      initialWeight
      finalWeight
      feeCollector
      fee
      start
      end
      paraChainBlockHeight
      lbpPoolAssetsDataByPoolId {
        nodes {
          id
          assetId
          poolId
          balances
          paraChainBlockHeight
        }
      }
    }
    totalCount
  }
}
    `;
export const GetXykPoolBlocksStorageState = gql`
    query GetXykPoolBlocksStorageState($filter: XykPoolFilter, $first: Int!, $offset: Int!, $orderBy: [XykPoolsOrderBy!]) {
  xykPools(filter: $filter, orderBy: $orderBy, first: $first, offset: $offset) {
    nodes {
      assetAId
      assetBId
      id
      paraChainBlockHeight
      poolAddress
      xykPoolAssetsDataByPoolId {
        nodes {
          assetId
          balances
          id
          paraChainBlockHeight
          poolId
        }
      }
    }
    totalCount
  }
}
    `;
export const GetStablepoolBlocksStorageState = gql`
    query GetStablepoolBlocksStorageState($filter: StablepoolFilter, $first: Int!, $offset: Int!, $orderBy: [StablepoolsOrderBy!]) {
  stablepools(filter: $filter, orderBy: $orderBy, first: $first, offset: $offset) {
    nodes {
      fee
      finalAmplification
      finalBlock
      id
      initialAmplification
      initialBlock
      paraChainBlockHeight
      poolAddress
      poolId
      stablepoolAssetDataByPoolId {
        nodes {
          assetId
          balances
          id
          paraChainBlockHeight
          poolId
        }
      }
    }
    totalCount
  }
}
    `;