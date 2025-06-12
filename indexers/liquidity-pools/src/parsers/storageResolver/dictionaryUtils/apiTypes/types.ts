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

export type Aavepool = {
  __typename?: 'Aavepool';
  /** Reads a single `Asset` that is related to this `Aavepool`. */
  aToken?: Maybe<Asset>;
  aTokenId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  liquidityIn: Scalars['String']['output'];
  liquidityOut: Scalars['String']['output'];
  paraBlockHeight: Scalars['Int']['output'];
  poolId: Scalars['String']['output'];
  /** Reads a single `Asset` that is related to this `Aavepool`. */
  reserveAsset?: Maybe<Asset>;
  reserveAssetId?: Maybe<Scalars['String']['output']>;
};

export type AavepoolAggregates = {
  __typename?: 'AavepoolAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<AavepoolAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<AavepoolDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<AavepoolMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<AavepoolMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<AavepoolStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<AavepoolStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<AavepoolSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<AavepoolVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<AavepoolVarianceSampleAggregates>;
};

export type AavepoolAverageAggregates = {
  __typename?: 'AavepoolAverageAggregates';
  /** Mean average of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `Aavepool` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type AavepoolCondition = {
  /** Checks for equality with the object’s `aTokenId` field. */
  aTokenId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `liquidityIn` field. */
  liquidityIn?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `liquidityOut` field. */
  liquidityOut?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolId` field. */
  poolId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `reserveAssetId` field. */
  reserveAssetId?: InputMaybe<Scalars['String']['input']>;
};

export type AavepoolDistinctCountAggregates = {
  __typename?: 'AavepoolDistinctCountAggregates';
  /** Distinct count of aTokenId across the matching connection */
  aTokenId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of liquidityIn across the matching connection */
  liquidityIn?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of liquidityOut across the matching connection */
  liquidityOut?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of reserveAssetId across the matching connection */
  reserveAssetId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Aavepool` object types. All fields are combined with a logical ‘and.’ */
export type AavepoolFilter = {
  /** Filter by the object’s `aTokenId` field. */
  aTokenId?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AavepoolFilter>>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `liquidityIn` field. */
  liquidityIn?: InputMaybe<StringFilter>;
  /** Filter by the object’s `liquidityOut` field. */
  liquidityOut?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<AavepoolFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AavepoolFilter>>;
  /** Filter by the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `reserveAssetId` field. */
  reserveAssetId?: InputMaybe<StringFilter>;
};

/** Grouping methods for `Aavepool` for usage during aggregation. */
export enum AavepoolGroupBy {
  ATokenId = 'A_TOKEN_ID',
  LiquidityIn = 'LIQUIDITY_IN',
  LiquidityOut = 'LIQUIDITY_OUT',
  ParaBlockHeight = 'PARA_BLOCK_HEIGHT',
  PoolId = 'POOL_ID',
  ReserveAssetId = 'RESERVE_ASSET_ID'
}

export type AavepoolHavingAverageInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AavepoolHavingDistinctCountInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `Aavepool` aggregates. */
export type AavepoolHavingInput = {
  AND?: InputMaybe<Array<AavepoolHavingInput>>;
  OR?: InputMaybe<Array<AavepoolHavingInput>>;
  average?: InputMaybe<AavepoolHavingAverageInput>;
  distinctCount?: InputMaybe<AavepoolHavingDistinctCountInput>;
  max?: InputMaybe<AavepoolHavingMaxInput>;
  min?: InputMaybe<AavepoolHavingMinInput>;
  stddevPopulation?: InputMaybe<AavepoolHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<AavepoolHavingStddevSampleInput>;
  sum?: InputMaybe<AavepoolHavingSumInput>;
  variancePopulation?: InputMaybe<AavepoolHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<AavepoolHavingVarianceSampleInput>;
};

export type AavepoolHavingMaxInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AavepoolHavingMinInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AavepoolHavingStddevPopulationInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AavepoolHavingStddevSampleInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AavepoolHavingSumInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AavepoolHavingVariancePopulationInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AavepoolHavingVarianceSampleInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AavepoolMaxAggregates = {
  __typename?: 'AavepoolMaxAggregates';
  /** Maximum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type AavepoolMinAggregates = {
  __typename?: 'AavepoolMinAggregates';
  /** Minimum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type AavepoolStddevPopulationAggregates = {
  __typename?: 'AavepoolStddevPopulationAggregates';
  /** Population standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type AavepoolStddevSampleAggregates = {
  __typename?: 'AavepoolStddevSampleAggregates';
  /** Sample standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type AavepoolSumAggregates = {
  __typename?: 'AavepoolSumAggregates';
  /** Sum of paraBlockHeight across the matching connection */
  paraBlockHeight: Scalars['BigInt']['output'];
};

export type AavepoolVariancePopulationAggregates = {
  __typename?: 'AavepoolVariancePopulationAggregates';
  /** Population variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type AavepoolVarianceSampleAggregates = {
  __typename?: 'AavepoolVarianceSampleAggregates';
  /** Sample variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Aavepool` values. */
export type AavepoolsConnection = {
  __typename?: 'AavepoolsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AavepoolAggregates>;
  /** A list of edges which contains the `Aavepool` and cursor to aid in pagination. */
  edges: Array<AavepoolsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<AavepoolAggregates>>;
  /** A list of `Aavepool` objects. */
  nodes: Array<Maybe<Aavepool>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Aavepool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Aavepool` values. */
export type AavepoolsConnectionGroupedAggregatesArgs = {
  groupBy: Array<AavepoolGroupBy>;
  having?: InputMaybe<AavepoolHavingInput>;
};

/** A `Aavepool` edge in the connection. */
export type AavepoolsEdge = {
  __typename?: 'AavepoolsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Aavepool` at the end of the edge. */
  node?: Maybe<Aavepool>;
};

/** Methods to use when ordering `Aavepool`. */
export enum AavepoolsOrderBy {
  ATokenIdAsc = 'A_TOKEN_ID_ASC',
  ATokenIdDesc = 'A_TOKEN_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LiquidityInAsc = 'LIQUIDITY_IN_ASC',
  LiquidityInDesc = 'LIQUIDITY_IN_DESC',
  LiquidityOutAsc = 'LIQUIDITY_OUT_ASC',
  LiquidityOutDesc = 'LIQUIDITY_OUT_DESC',
  Natural = 'NATURAL',
  ParaBlockHeightAsc = 'PARA_BLOCK_HEIGHT_ASC',
  ParaBlockHeightDesc = 'PARA_BLOCK_HEIGHT_DESC',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ReserveAssetIdAsc = 'RESERVE_ASSET_ID_ASC',
  ReserveAssetIdDesc = 'RESERVE_ASSET_ID_DESC'
}

export type AccountBalances = {
  __typename?: 'AccountBalances';
  feeFrozen?: Maybe<Scalars['String']['output']>;
  flags?: Maybe<Scalars['String']['output']>;
  free: Scalars['String']['output'];
  frozen?: Maybe<Scalars['String']['output']>;
  miscFrozen?: Maybe<Scalars['String']['output']>;
  reserved: Scalars['String']['output'];
};

export type ApiSupportResponse = {
  __typename?: 'ApiSupportResponse';
  accountBalances?: Maybe<AccountBalances>;
  assetDynamicFee?: Maybe<AssetDynamicFee>;
  minifiedDataStructure?: Maybe<MinifiedDataStructure>;
  minifiedDataStructureTypeName?: Maybe<MinifiedDataStructureTypeName>;
  omnipoolAssetState?: Maybe<OmnipoolAssetState>;
  tradability?: Maybe<Tradability>;
};

export type Asset = {
  __typename?: 'Asset';
  /** Reads and enables pagination through a set of `Aavepool`. */
  aavepoolsByATokenId: AavepoolsConnection;
  /** Reads and enables pagination through a set of `Aavepool`. */
  aavepoolsByReserveAssetId: AavepoolsConnection;
  /** Reads and enables pagination through a set of `AssetHistoricalDatum`. */
  assetHistoricalData: AssetHistoricalDataConnection;
  assetType: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Asset`. */
  assetsByBondUnderlyingAssetId: AssetsConnection;
  bondMaturity?: Maybe<Scalars['BigFloat']['output']>;
  /** Reads a single `Asset` that is related to this `Asset`. */
  bondUnderlyingAsset?: Maybe<Asset>;
  bondUnderlyingAssetId?: Maybe<Scalars['String']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  isSufficient: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
  xcmRateLimit?: Maybe<Scalars['BigFloat']['output']>;
};


export type AssetAavepoolsByATokenIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AavepoolCondition>;
  filter?: InputMaybe<AavepoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AavepoolsOrderBy>>;
};


export type AssetAavepoolsByReserveAssetIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AavepoolCondition>;
  filter?: InputMaybe<AavepoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AavepoolsOrderBy>>;
};


export type AssetAssetHistoricalDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AssetHistoricalDatumCondition>;
  filter?: InputMaybe<AssetHistoricalDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AssetHistoricalDataOrderBy>>;
};


export type AssetAssetsByBondUnderlyingAssetIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AssetCondition>;
  filter?: InputMaybe<AssetFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AssetsOrderBy>>;
};

export type AssetAggregates = {
  __typename?: 'AssetAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<AssetAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<AssetDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<AssetMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<AssetMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<AssetStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<AssetStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<AssetSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<AssetVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<AssetVarianceSampleAggregates>;
};

export type AssetAverageAggregates = {
  __typename?: 'AssetAverageAggregates';
  /** Mean average of bondMaturity across the matching connection */
  bondMaturity?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of decimals across the matching connection */
  decimals?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of xcmRateLimit across the matching connection */
  xcmRateLimit?: Maybe<Scalars['BigFloat']['output']>;
};

/** A condition to be used against `Asset` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AssetCondition = {
  /** Checks for equality with the object’s `assetType` field. */
  assetType?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `bondMaturity` field. */
  bondMaturity?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Checks for equality with the object’s `bondUnderlyingAssetId` field. */
  bondUnderlyingAssetId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `decimals` field. */
  decimals?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `isSufficient` field. */
  isSufficient?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `symbol` field. */
  symbol?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `xcmRateLimit` field. */
  xcmRateLimit?: InputMaybe<Scalars['BigFloat']['input']>;
};

export type AssetDistinctCountAggregates = {
  __typename?: 'AssetDistinctCountAggregates';
  /** Distinct count of assetType across the matching connection */
  assetType?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of bondMaturity across the matching connection */
  bondMaturity?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of bondUnderlyingAssetId across the matching connection */
  bondUnderlyingAssetId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of decimals across the matching connection */
  decimals?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of isSufficient across the matching connection */
  isSufficient?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of symbol across the matching connection */
  symbol?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of xcmRateLimit across the matching connection */
  xcmRateLimit?: Maybe<Scalars['BigInt']['output']>;
};

export type AssetDynamicFee = {
  __typename?: 'AssetDynamicFee';
  assetFee: Scalars['Int']['output'];
  protocolFee: Scalars['Int']['output'];
  timestamp: Scalars['Int']['output'];
};

/** A filter to be used against `Asset` object types. All fields are combined with a logical ‘and.’ */
export type AssetFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AssetFilter>>;
  /** Filter by the object’s `assetType` field. */
  assetType?: InputMaybe<StringFilter>;
  /** Filter by the object’s `bondMaturity` field. */
  bondMaturity?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `bondUnderlyingAssetId` field. */
  bondUnderlyingAssetId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `decimals` field. */
  decimals?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `isSufficient` field. */
  isSufficient?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<AssetFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AssetFilter>>;
  /** Filter by the object’s `symbol` field. */
  symbol?: InputMaybe<StringFilter>;
  /** Filter by the object’s `xcmRateLimit` field. */
  xcmRateLimit?: InputMaybe<BigFloatFilter>;
};

/** Grouping methods for `Asset` for usage during aggregation. */
export enum AssetGroupBy {
  AssetType = 'ASSET_TYPE',
  BondMaturity = 'BOND_MATURITY',
  BondUnderlyingAssetId = 'BOND_UNDERLYING_ASSET_ID',
  Decimals = 'DECIMALS',
  IsSufficient = 'IS_SUFFICIENT',
  Name = 'NAME',
  Symbol = 'SYMBOL',
  XcmRateLimit = 'XCM_RATE_LIMIT'
}

export type AssetHavingAverageInput = {
  bondMaturity?: InputMaybe<HavingBigfloatFilter>;
  decimals?: InputMaybe<HavingIntFilter>;
  xcmRateLimit?: InputMaybe<HavingBigfloatFilter>;
};

export type AssetHavingDistinctCountInput = {
  bondMaturity?: InputMaybe<HavingBigfloatFilter>;
  decimals?: InputMaybe<HavingIntFilter>;
  xcmRateLimit?: InputMaybe<HavingBigfloatFilter>;
};

/** Conditions for `Asset` aggregates. */
export type AssetHavingInput = {
  AND?: InputMaybe<Array<AssetHavingInput>>;
  OR?: InputMaybe<Array<AssetHavingInput>>;
  average?: InputMaybe<AssetHavingAverageInput>;
  distinctCount?: InputMaybe<AssetHavingDistinctCountInput>;
  max?: InputMaybe<AssetHavingMaxInput>;
  min?: InputMaybe<AssetHavingMinInput>;
  stddevPopulation?: InputMaybe<AssetHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<AssetHavingStddevSampleInput>;
  sum?: InputMaybe<AssetHavingSumInput>;
  variancePopulation?: InputMaybe<AssetHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<AssetHavingVarianceSampleInput>;
};

export type AssetHavingMaxInput = {
  bondMaturity?: InputMaybe<HavingBigfloatFilter>;
  decimals?: InputMaybe<HavingIntFilter>;
  xcmRateLimit?: InputMaybe<HavingBigfloatFilter>;
};

export type AssetHavingMinInput = {
  bondMaturity?: InputMaybe<HavingBigfloatFilter>;
  decimals?: InputMaybe<HavingIntFilter>;
  xcmRateLimit?: InputMaybe<HavingBigfloatFilter>;
};

export type AssetHavingStddevPopulationInput = {
  bondMaturity?: InputMaybe<HavingBigfloatFilter>;
  decimals?: InputMaybe<HavingIntFilter>;
  xcmRateLimit?: InputMaybe<HavingBigfloatFilter>;
};

export type AssetHavingStddevSampleInput = {
  bondMaturity?: InputMaybe<HavingBigfloatFilter>;
  decimals?: InputMaybe<HavingIntFilter>;
  xcmRateLimit?: InputMaybe<HavingBigfloatFilter>;
};

export type AssetHavingSumInput = {
  bondMaturity?: InputMaybe<HavingBigfloatFilter>;
  decimals?: InputMaybe<HavingIntFilter>;
  xcmRateLimit?: InputMaybe<HavingBigfloatFilter>;
};

export type AssetHavingVariancePopulationInput = {
  bondMaturity?: InputMaybe<HavingBigfloatFilter>;
  decimals?: InputMaybe<HavingIntFilter>;
  xcmRateLimit?: InputMaybe<HavingBigfloatFilter>;
};

export type AssetHavingVarianceSampleInput = {
  bondMaturity?: InputMaybe<HavingBigfloatFilter>;
  decimals?: InputMaybe<HavingIntFilter>;
  xcmRateLimit?: InputMaybe<HavingBigfloatFilter>;
};

/** A connection to a list of `AssetHistoricalDatum` values. */
export type AssetHistoricalDataConnection = {
  __typename?: 'AssetHistoricalDataConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AssetHistoricalDatumAggregates>;
  /** A list of edges which contains the `AssetHistoricalDatum` and cursor to aid in pagination. */
  edges: Array<AssetHistoricalDataEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<AssetHistoricalDatumAggregates>>;
  /** A list of `AssetHistoricalDatum` objects. */
  nodes: Array<Maybe<AssetHistoricalDatum>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `AssetHistoricalDatum` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `AssetHistoricalDatum` values. */
export type AssetHistoricalDataConnectionGroupedAggregatesArgs = {
  groupBy: Array<AssetHistoricalDataGroupBy>;
  having?: InputMaybe<AssetHistoricalDataHavingInput>;
};

/** A `AssetHistoricalDatum` edge in the connection. */
export type AssetHistoricalDataEdge = {
  __typename?: 'AssetHistoricalDataEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `AssetHistoricalDatum` at the end of the edge. */
  node?: Maybe<AssetHistoricalDatum>;
};

/** Grouping methods for `AssetHistoricalDatum` for usage during aggregation. */
export enum AssetHistoricalDataGroupBy {
  AssetId = 'ASSET_ID',
  DynamicFee = 'DYNAMIC_FEE',
  ExistentialDeposit = 'EXISTENTIAL_DEPOSIT',
  ParaBlockHeight = 'PARA_BLOCK_HEIGHT',
  TotalIssuance = 'TOTAL_ISSUANCE'
}

export type AssetHistoricalDataHavingAverageInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AssetHistoricalDataHavingDistinctCountInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `AssetHistoricalDatum` aggregates. */
export type AssetHistoricalDataHavingInput = {
  AND?: InputMaybe<Array<AssetHistoricalDataHavingInput>>;
  OR?: InputMaybe<Array<AssetHistoricalDataHavingInput>>;
  average?: InputMaybe<AssetHistoricalDataHavingAverageInput>;
  distinctCount?: InputMaybe<AssetHistoricalDataHavingDistinctCountInput>;
  max?: InputMaybe<AssetHistoricalDataHavingMaxInput>;
  min?: InputMaybe<AssetHistoricalDataHavingMinInput>;
  stddevPopulation?: InputMaybe<AssetHistoricalDataHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<AssetHistoricalDataHavingStddevSampleInput>;
  sum?: InputMaybe<AssetHistoricalDataHavingSumInput>;
  variancePopulation?: InputMaybe<AssetHistoricalDataHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<AssetHistoricalDataHavingVarianceSampleInput>;
};

export type AssetHistoricalDataHavingMaxInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AssetHistoricalDataHavingMinInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AssetHistoricalDataHavingStddevPopulationInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AssetHistoricalDataHavingStddevSampleInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AssetHistoricalDataHavingSumInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AssetHistoricalDataHavingVariancePopulationInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type AssetHistoricalDataHavingVarianceSampleInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Methods to use when ordering `AssetHistoricalDatum`. */
export enum AssetHistoricalDataOrderBy {
  AssetIdAsc = 'ASSET_ID_ASC',
  AssetIdDesc = 'ASSET_ID_DESC',
  DynamicFeeAsc = 'DYNAMIC_FEE_ASC',
  DynamicFeeDesc = 'DYNAMIC_FEE_DESC',
  ExistentialDepositAsc = 'EXISTENTIAL_DEPOSIT_ASC',
  ExistentialDepositDesc = 'EXISTENTIAL_DEPOSIT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  ParaBlockHeightAsc = 'PARA_BLOCK_HEIGHT_ASC',
  ParaBlockHeightDesc = 'PARA_BLOCK_HEIGHT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TotalIssuanceAsc = 'TOTAL_ISSUANCE_ASC',
  TotalIssuanceDesc = 'TOTAL_ISSUANCE_DESC'
}

export type AssetHistoricalDatum = {
  __typename?: 'AssetHistoricalDatum';
  /** Reads a single `Asset` that is related to this `AssetHistoricalDatum`. */
  asset?: Maybe<Asset>;
  assetId?: Maybe<Scalars['String']['output']>;
  dynamicFee?: Maybe<Scalars['JSON']['output']>;
  existentialDeposit: Scalars['String']['output'];
  id: Scalars['String']['output'];
  paraBlockHeight: Scalars['Int']['output'];
  totalIssuance: Scalars['String']['output'];
};

export type AssetHistoricalDatumAggregates = {
  __typename?: 'AssetHistoricalDatumAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<AssetHistoricalDatumAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<AssetHistoricalDatumDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<AssetHistoricalDatumMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<AssetHistoricalDatumMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<AssetHistoricalDatumStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<AssetHistoricalDatumStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<AssetHistoricalDatumSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<AssetHistoricalDatumVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<AssetHistoricalDatumVarianceSampleAggregates>;
};

export type AssetHistoricalDatumAverageAggregates = {
  __typename?: 'AssetHistoricalDatumAverageAggregates';
  /** Mean average of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `AssetHistoricalDatum` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type AssetHistoricalDatumCondition = {
  /** Checks for equality with the object’s `assetId` field. */
  assetId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `dynamicFee` field. */
  dynamicFee?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `existentialDeposit` field. */
  existentialDeposit?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `totalIssuance` field. */
  totalIssuance?: InputMaybe<Scalars['String']['input']>;
};

export type AssetHistoricalDatumDistinctCountAggregates = {
  __typename?: 'AssetHistoricalDatumDistinctCountAggregates';
  /** Distinct count of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of dynamicFee across the matching connection */
  dynamicFee?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of existentialDeposit across the matching connection */
  existentialDeposit?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of totalIssuance across the matching connection */
  totalIssuance?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `AssetHistoricalDatum` object types. All fields are combined with a logical ‘and.’ */
export type AssetHistoricalDatumFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AssetHistoricalDatumFilter>>;
  /** Filter by the object’s `assetId` field. */
  assetId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `dynamicFee` field. */
  dynamicFee?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `existentialDeposit` field. */
  existentialDeposit?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<AssetHistoricalDatumFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AssetHistoricalDatumFilter>>;
  /** Filter by the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `totalIssuance` field. */
  totalIssuance?: InputMaybe<StringFilter>;
};

export type AssetHistoricalDatumMaxAggregates = {
  __typename?: 'AssetHistoricalDatumMaxAggregates';
  /** Maximum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type AssetHistoricalDatumMinAggregates = {
  __typename?: 'AssetHistoricalDatumMinAggregates';
  /** Minimum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type AssetHistoricalDatumStddevPopulationAggregates = {
  __typename?: 'AssetHistoricalDatumStddevPopulationAggregates';
  /** Population standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type AssetHistoricalDatumStddevSampleAggregates = {
  __typename?: 'AssetHistoricalDatumStddevSampleAggregates';
  /** Sample standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type AssetHistoricalDatumSumAggregates = {
  __typename?: 'AssetHistoricalDatumSumAggregates';
  /** Sum of paraBlockHeight across the matching connection */
  paraBlockHeight: Scalars['BigInt']['output'];
};

export type AssetHistoricalDatumVariancePopulationAggregates = {
  __typename?: 'AssetHistoricalDatumVariancePopulationAggregates';
  /** Population variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type AssetHistoricalDatumVarianceSampleAggregates = {
  __typename?: 'AssetHistoricalDatumVarianceSampleAggregates';
  /** Sample variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type AssetMaxAggregates = {
  __typename?: 'AssetMaxAggregates';
  /** Maximum of bondMaturity across the matching connection */
  bondMaturity?: Maybe<Scalars['BigFloat']['output']>;
  /** Maximum of decimals across the matching connection */
  decimals?: Maybe<Scalars['Int']['output']>;
  /** Maximum of xcmRateLimit across the matching connection */
  xcmRateLimit?: Maybe<Scalars['BigFloat']['output']>;
};

export type AssetMinAggregates = {
  __typename?: 'AssetMinAggregates';
  /** Minimum of bondMaturity across the matching connection */
  bondMaturity?: Maybe<Scalars['BigFloat']['output']>;
  /** Minimum of decimals across the matching connection */
  decimals?: Maybe<Scalars['Int']['output']>;
  /** Minimum of xcmRateLimit across the matching connection */
  xcmRateLimit?: Maybe<Scalars['BigFloat']['output']>;
};

export type AssetStddevPopulationAggregates = {
  __typename?: 'AssetStddevPopulationAggregates';
  /** Population standard deviation of bondMaturity across the matching connection */
  bondMaturity?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of decimals across the matching connection */
  decimals?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of xcmRateLimit across the matching connection */
  xcmRateLimit?: Maybe<Scalars['BigFloat']['output']>;
};

export type AssetStddevSampleAggregates = {
  __typename?: 'AssetStddevSampleAggregates';
  /** Sample standard deviation of bondMaturity across the matching connection */
  bondMaturity?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of decimals across the matching connection */
  decimals?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of xcmRateLimit across the matching connection */
  xcmRateLimit?: Maybe<Scalars['BigFloat']['output']>;
};

export type AssetSumAggregates = {
  __typename?: 'AssetSumAggregates';
  /** Sum of bondMaturity across the matching connection */
  bondMaturity: Scalars['BigFloat']['output'];
  /** Sum of decimals across the matching connection */
  decimals: Scalars['BigInt']['output'];
  /** Sum of xcmRateLimit across the matching connection */
  xcmRateLimit: Scalars['BigFloat']['output'];
};

export type AssetVariancePopulationAggregates = {
  __typename?: 'AssetVariancePopulationAggregates';
  /** Population variance of bondMaturity across the matching connection */
  bondMaturity?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of decimals across the matching connection */
  decimals?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of xcmRateLimit across the matching connection */
  xcmRateLimit?: Maybe<Scalars['BigFloat']['output']>;
};

export type AssetVarianceSampleAggregates = {
  __typename?: 'AssetVarianceSampleAggregates';
  /** Sample variance of bondMaturity across the matching connection */
  bondMaturity?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of decimals across the matching connection */
  decimals?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of xcmRateLimit across the matching connection */
  xcmRateLimit?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Asset` values. */
export type AssetsConnection = {
  __typename?: 'AssetsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AssetAggregates>;
  /** A list of edges which contains the `Asset` and cursor to aid in pagination. */
  edges: Array<AssetsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<AssetAggregates>>;
  /** A list of `Asset` objects. */
  nodes: Array<Maybe<Asset>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Asset` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Asset` values. */
export type AssetsConnectionGroupedAggregatesArgs = {
  groupBy: Array<AssetGroupBy>;
  having?: InputMaybe<AssetHavingInput>;
};

/** A `Asset` edge in the connection. */
export type AssetsEdge = {
  __typename?: 'AssetsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Asset` at the end of the edge. */
  node?: Maybe<Asset>;
};

/** Methods to use when ordering `Asset`. */
export enum AssetsOrderBy {
  AavepoolsByAtokenIdAverageATokenIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_A_TOKEN_ID_ASC',
  AavepoolsByAtokenIdAverageATokenIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_A_TOKEN_ID_DESC',
  AavepoolsByAtokenIdAverageIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_ID_ASC',
  AavepoolsByAtokenIdAverageIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_ID_DESC',
  AavepoolsByAtokenIdAverageLiquidityInAsc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_LIQUIDITY_IN_ASC',
  AavepoolsByAtokenIdAverageLiquidityInDesc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_LIQUIDITY_IN_DESC',
  AavepoolsByAtokenIdAverageLiquidityOutAsc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_LIQUIDITY_OUT_ASC',
  AavepoolsByAtokenIdAverageLiquidityOutDesc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_LIQUIDITY_OUT_DESC',
  AavepoolsByAtokenIdAverageParaBlockHeightAsc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByAtokenIdAverageParaBlockHeightDesc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByAtokenIdAveragePoolIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_POOL_ID_ASC',
  AavepoolsByAtokenIdAveragePoolIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_POOL_ID_DESC',
  AavepoolsByAtokenIdAverageReserveAssetIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_RESERVE_ASSET_ID_ASC',
  AavepoolsByAtokenIdAverageReserveAssetIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_AVERAGE_RESERVE_ASSET_ID_DESC',
  AavepoolsByAtokenIdCountAsc = 'AAVEPOOLS_BY_ATOKEN_ID_COUNT_ASC',
  AavepoolsByAtokenIdCountDesc = 'AAVEPOOLS_BY_ATOKEN_ID_COUNT_DESC',
  AavepoolsByAtokenIdDistinctCountATokenIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_A_TOKEN_ID_ASC',
  AavepoolsByAtokenIdDistinctCountATokenIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_A_TOKEN_ID_DESC',
  AavepoolsByAtokenIdDistinctCountIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_ID_ASC',
  AavepoolsByAtokenIdDistinctCountIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_ID_DESC',
  AavepoolsByAtokenIdDistinctCountLiquidityInAsc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_LIQUIDITY_IN_ASC',
  AavepoolsByAtokenIdDistinctCountLiquidityInDesc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_LIQUIDITY_IN_DESC',
  AavepoolsByAtokenIdDistinctCountLiquidityOutAsc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_LIQUIDITY_OUT_ASC',
  AavepoolsByAtokenIdDistinctCountLiquidityOutDesc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_LIQUIDITY_OUT_DESC',
  AavepoolsByAtokenIdDistinctCountParaBlockHeightAsc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByAtokenIdDistinctCountParaBlockHeightDesc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByAtokenIdDistinctCountPoolIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_POOL_ID_ASC',
  AavepoolsByAtokenIdDistinctCountPoolIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_POOL_ID_DESC',
  AavepoolsByAtokenIdDistinctCountReserveAssetIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_RESERVE_ASSET_ID_ASC',
  AavepoolsByAtokenIdDistinctCountReserveAssetIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_DISTINCT_COUNT_RESERVE_ASSET_ID_DESC',
  AavepoolsByAtokenIdMaxATokenIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_A_TOKEN_ID_ASC',
  AavepoolsByAtokenIdMaxATokenIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_A_TOKEN_ID_DESC',
  AavepoolsByAtokenIdMaxIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_ID_ASC',
  AavepoolsByAtokenIdMaxIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_ID_DESC',
  AavepoolsByAtokenIdMaxLiquidityInAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_LIQUIDITY_IN_ASC',
  AavepoolsByAtokenIdMaxLiquidityInDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_LIQUIDITY_IN_DESC',
  AavepoolsByAtokenIdMaxLiquidityOutAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_LIQUIDITY_OUT_ASC',
  AavepoolsByAtokenIdMaxLiquidityOutDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_LIQUIDITY_OUT_DESC',
  AavepoolsByAtokenIdMaxParaBlockHeightAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByAtokenIdMaxParaBlockHeightDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByAtokenIdMaxPoolIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_POOL_ID_ASC',
  AavepoolsByAtokenIdMaxPoolIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_POOL_ID_DESC',
  AavepoolsByAtokenIdMaxReserveAssetIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_RESERVE_ASSET_ID_ASC',
  AavepoolsByAtokenIdMaxReserveAssetIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MAX_RESERVE_ASSET_ID_DESC',
  AavepoolsByAtokenIdMinATokenIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_A_TOKEN_ID_ASC',
  AavepoolsByAtokenIdMinATokenIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_A_TOKEN_ID_DESC',
  AavepoolsByAtokenIdMinIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_ID_ASC',
  AavepoolsByAtokenIdMinIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_ID_DESC',
  AavepoolsByAtokenIdMinLiquidityInAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_LIQUIDITY_IN_ASC',
  AavepoolsByAtokenIdMinLiquidityInDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_LIQUIDITY_IN_DESC',
  AavepoolsByAtokenIdMinLiquidityOutAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_LIQUIDITY_OUT_ASC',
  AavepoolsByAtokenIdMinLiquidityOutDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_LIQUIDITY_OUT_DESC',
  AavepoolsByAtokenIdMinParaBlockHeightAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByAtokenIdMinParaBlockHeightDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByAtokenIdMinPoolIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_POOL_ID_ASC',
  AavepoolsByAtokenIdMinPoolIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_POOL_ID_DESC',
  AavepoolsByAtokenIdMinReserveAssetIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_RESERVE_ASSET_ID_ASC',
  AavepoolsByAtokenIdMinReserveAssetIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_MIN_RESERVE_ASSET_ID_DESC',
  AavepoolsByAtokenIdStddevPopulationATokenIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_A_TOKEN_ID_ASC',
  AavepoolsByAtokenIdStddevPopulationATokenIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_A_TOKEN_ID_DESC',
  AavepoolsByAtokenIdStddevPopulationIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_ID_ASC',
  AavepoolsByAtokenIdStddevPopulationIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_ID_DESC',
  AavepoolsByAtokenIdStddevPopulationLiquidityInAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_LIQUIDITY_IN_ASC',
  AavepoolsByAtokenIdStddevPopulationLiquidityInDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_LIQUIDITY_IN_DESC',
  AavepoolsByAtokenIdStddevPopulationLiquidityOutAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_LIQUIDITY_OUT_ASC',
  AavepoolsByAtokenIdStddevPopulationLiquidityOutDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_LIQUIDITY_OUT_DESC',
  AavepoolsByAtokenIdStddevPopulationParaBlockHeightAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByAtokenIdStddevPopulationParaBlockHeightDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByAtokenIdStddevPopulationPoolIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_POOL_ID_ASC',
  AavepoolsByAtokenIdStddevPopulationPoolIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_POOL_ID_DESC',
  AavepoolsByAtokenIdStddevPopulationReserveAssetIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_RESERVE_ASSET_ID_ASC',
  AavepoolsByAtokenIdStddevPopulationReserveAssetIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_POPULATION_RESERVE_ASSET_ID_DESC',
  AavepoolsByAtokenIdStddevSampleATokenIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_A_TOKEN_ID_ASC',
  AavepoolsByAtokenIdStddevSampleATokenIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_A_TOKEN_ID_DESC',
  AavepoolsByAtokenIdStddevSampleIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_ID_ASC',
  AavepoolsByAtokenIdStddevSampleIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_ID_DESC',
  AavepoolsByAtokenIdStddevSampleLiquidityInAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_LIQUIDITY_IN_ASC',
  AavepoolsByAtokenIdStddevSampleLiquidityInDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_LIQUIDITY_IN_DESC',
  AavepoolsByAtokenIdStddevSampleLiquidityOutAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_LIQUIDITY_OUT_ASC',
  AavepoolsByAtokenIdStddevSampleLiquidityOutDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_LIQUIDITY_OUT_DESC',
  AavepoolsByAtokenIdStddevSampleParaBlockHeightAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByAtokenIdStddevSampleParaBlockHeightDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByAtokenIdStddevSamplePoolIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_POOL_ID_ASC',
  AavepoolsByAtokenIdStddevSamplePoolIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_POOL_ID_DESC',
  AavepoolsByAtokenIdStddevSampleReserveAssetIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_RESERVE_ASSET_ID_ASC',
  AavepoolsByAtokenIdStddevSampleReserveAssetIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_STDDEV_SAMPLE_RESERVE_ASSET_ID_DESC',
  AavepoolsByAtokenIdSumATokenIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_A_TOKEN_ID_ASC',
  AavepoolsByAtokenIdSumATokenIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_A_TOKEN_ID_DESC',
  AavepoolsByAtokenIdSumIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_ID_ASC',
  AavepoolsByAtokenIdSumIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_ID_DESC',
  AavepoolsByAtokenIdSumLiquidityInAsc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_LIQUIDITY_IN_ASC',
  AavepoolsByAtokenIdSumLiquidityInDesc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_LIQUIDITY_IN_DESC',
  AavepoolsByAtokenIdSumLiquidityOutAsc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_LIQUIDITY_OUT_ASC',
  AavepoolsByAtokenIdSumLiquidityOutDesc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_LIQUIDITY_OUT_DESC',
  AavepoolsByAtokenIdSumParaBlockHeightAsc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByAtokenIdSumParaBlockHeightDesc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByAtokenIdSumPoolIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_POOL_ID_ASC',
  AavepoolsByAtokenIdSumPoolIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_POOL_ID_DESC',
  AavepoolsByAtokenIdSumReserveAssetIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_RESERVE_ASSET_ID_ASC',
  AavepoolsByAtokenIdSumReserveAssetIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_SUM_RESERVE_ASSET_ID_DESC',
  AavepoolsByAtokenIdVariancePopulationATokenIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_A_TOKEN_ID_ASC',
  AavepoolsByAtokenIdVariancePopulationATokenIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_A_TOKEN_ID_DESC',
  AavepoolsByAtokenIdVariancePopulationIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_ID_ASC',
  AavepoolsByAtokenIdVariancePopulationIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_ID_DESC',
  AavepoolsByAtokenIdVariancePopulationLiquidityInAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_LIQUIDITY_IN_ASC',
  AavepoolsByAtokenIdVariancePopulationLiquidityInDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_LIQUIDITY_IN_DESC',
  AavepoolsByAtokenIdVariancePopulationLiquidityOutAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_LIQUIDITY_OUT_ASC',
  AavepoolsByAtokenIdVariancePopulationLiquidityOutDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_LIQUIDITY_OUT_DESC',
  AavepoolsByAtokenIdVariancePopulationParaBlockHeightAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByAtokenIdVariancePopulationParaBlockHeightDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByAtokenIdVariancePopulationPoolIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_POOL_ID_ASC',
  AavepoolsByAtokenIdVariancePopulationPoolIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_POOL_ID_DESC',
  AavepoolsByAtokenIdVariancePopulationReserveAssetIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_RESERVE_ASSET_ID_ASC',
  AavepoolsByAtokenIdVariancePopulationReserveAssetIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_POPULATION_RESERVE_ASSET_ID_DESC',
  AavepoolsByAtokenIdVarianceSampleATokenIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_A_TOKEN_ID_ASC',
  AavepoolsByAtokenIdVarianceSampleATokenIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_A_TOKEN_ID_DESC',
  AavepoolsByAtokenIdVarianceSampleIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_ID_ASC',
  AavepoolsByAtokenIdVarianceSampleIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_ID_DESC',
  AavepoolsByAtokenIdVarianceSampleLiquidityInAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_LIQUIDITY_IN_ASC',
  AavepoolsByAtokenIdVarianceSampleLiquidityInDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_LIQUIDITY_IN_DESC',
  AavepoolsByAtokenIdVarianceSampleLiquidityOutAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_LIQUIDITY_OUT_ASC',
  AavepoolsByAtokenIdVarianceSampleLiquidityOutDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_LIQUIDITY_OUT_DESC',
  AavepoolsByAtokenIdVarianceSampleParaBlockHeightAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByAtokenIdVarianceSampleParaBlockHeightDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByAtokenIdVarianceSamplePoolIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_POOL_ID_ASC',
  AavepoolsByAtokenIdVarianceSamplePoolIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_POOL_ID_DESC',
  AavepoolsByAtokenIdVarianceSampleReserveAssetIdAsc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_RESERVE_ASSET_ID_ASC',
  AavepoolsByAtokenIdVarianceSampleReserveAssetIdDesc = 'AAVEPOOLS_BY_ATOKEN_ID_VARIANCE_SAMPLE_RESERVE_ASSET_ID_DESC',
  AavepoolsByReserveAssetIdAverageATokenIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_A_TOKEN_ID_ASC',
  AavepoolsByReserveAssetIdAverageATokenIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_A_TOKEN_ID_DESC',
  AavepoolsByReserveAssetIdAverageIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_ID_ASC',
  AavepoolsByReserveAssetIdAverageIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_ID_DESC',
  AavepoolsByReserveAssetIdAverageLiquidityInAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_LIQUIDITY_IN_ASC',
  AavepoolsByReserveAssetIdAverageLiquidityInDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_LIQUIDITY_IN_DESC',
  AavepoolsByReserveAssetIdAverageLiquidityOutAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_LIQUIDITY_OUT_ASC',
  AavepoolsByReserveAssetIdAverageLiquidityOutDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_LIQUIDITY_OUT_DESC',
  AavepoolsByReserveAssetIdAverageParaBlockHeightAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByReserveAssetIdAverageParaBlockHeightDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByReserveAssetIdAveragePoolIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_POOL_ID_ASC',
  AavepoolsByReserveAssetIdAveragePoolIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_POOL_ID_DESC',
  AavepoolsByReserveAssetIdAverageReserveAssetIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_RESERVE_ASSET_ID_ASC',
  AavepoolsByReserveAssetIdAverageReserveAssetIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_AVERAGE_RESERVE_ASSET_ID_DESC',
  AavepoolsByReserveAssetIdCountAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_COUNT_ASC',
  AavepoolsByReserveAssetIdCountDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_COUNT_DESC',
  AavepoolsByReserveAssetIdDistinctCountATokenIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_A_TOKEN_ID_ASC',
  AavepoolsByReserveAssetIdDistinctCountATokenIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_A_TOKEN_ID_DESC',
  AavepoolsByReserveAssetIdDistinctCountIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_ID_ASC',
  AavepoolsByReserveAssetIdDistinctCountIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_ID_DESC',
  AavepoolsByReserveAssetIdDistinctCountLiquidityInAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_LIQUIDITY_IN_ASC',
  AavepoolsByReserveAssetIdDistinctCountLiquidityInDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_LIQUIDITY_IN_DESC',
  AavepoolsByReserveAssetIdDistinctCountLiquidityOutAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_LIQUIDITY_OUT_ASC',
  AavepoolsByReserveAssetIdDistinctCountLiquidityOutDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_LIQUIDITY_OUT_DESC',
  AavepoolsByReserveAssetIdDistinctCountParaBlockHeightAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByReserveAssetIdDistinctCountParaBlockHeightDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByReserveAssetIdDistinctCountPoolIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_POOL_ID_ASC',
  AavepoolsByReserveAssetIdDistinctCountPoolIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_POOL_ID_DESC',
  AavepoolsByReserveAssetIdDistinctCountReserveAssetIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_RESERVE_ASSET_ID_ASC',
  AavepoolsByReserveAssetIdDistinctCountReserveAssetIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_DISTINCT_COUNT_RESERVE_ASSET_ID_DESC',
  AavepoolsByReserveAssetIdMaxATokenIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_A_TOKEN_ID_ASC',
  AavepoolsByReserveAssetIdMaxATokenIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_A_TOKEN_ID_DESC',
  AavepoolsByReserveAssetIdMaxIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_ID_ASC',
  AavepoolsByReserveAssetIdMaxIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_ID_DESC',
  AavepoolsByReserveAssetIdMaxLiquidityInAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_LIQUIDITY_IN_ASC',
  AavepoolsByReserveAssetIdMaxLiquidityInDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_LIQUIDITY_IN_DESC',
  AavepoolsByReserveAssetIdMaxLiquidityOutAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_LIQUIDITY_OUT_ASC',
  AavepoolsByReserveAssetIdMaxLiquidityOutDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_LIQUIDITY_OUT_DESC',
  AavepoolsByReserveAssetIdMaxParaBlockHeightAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByReserveAssetIdMaxParaBlockHeightDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByReserveAssetIdMaxPoolIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_POOL_ID_ASC',
  AavepoolsByReserveAssetIdMaxPoolIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_POOL_ID_DESC',
  AavepoolsByReserveAssetIdMaxReserveAssetIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_RESERVE_ASSET_ID_ASC',
  AavepoolsByReserveAssetIdMaxReserveAssetIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MAX_RESERVE_ASSET_ID_DESC',
  AavepoolsByReserveAssetIdMinATokenIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_A_TOKEN_ID_ASC',
  AavepoolsByReserveAssetIdMinATokenIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_A_TOKEN_ID_DESC',
  AavepoolsByReserveAssetIdMinIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_ID_ASC',
  AavepoolsByReserveAssetIdMinIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_ID_DESC',
  AavepoolsByReserveAssetIdMinLiquidityInAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_LIQUIDITY_IN_ASC',
  AavepoolsByReserveAssetIdMinLiquidityInDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_LIQUIDITY_IN_DESC',
  AavepoolsByReserveAssetIdMinLiquidityOutAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_LIQUIDITY_OUT_ASC',
  AavepoolsByReserveAssetIdMinLiquidityOutDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_LIQUIDITY_OUT_DESC',
  AavepoolsByReserveAssetIdMinParaBlockHeightAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByReserveAssetIdMinParaBlockHeightDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByReserveAssetIdMinPoolIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_POOL_ID_ASC',
  AavepoolsByReserveAssetIdMinPoolIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_POOL_ID_DESC',
  AavepoolsByReserveAssetIdMinReserveAssetIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_RESERVE_ASSET_ID_ASC',
  AavepoolsByReserveAssetIdMinReserveAssetIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_MIN_RESERVE_ASSET_ID_DESC',
  AavepoolsByReserveAssetIdStddevPopulationATokenIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_A_TOKEN_ID_ASC',
  AavepoolsByReserveAssetIdStddevPopulationATokenIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_A_TOKEN_ID_DESC',
  AavepoolsByReserveAssetIdStddevPopulationIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_ID_ASC',
  AavepoolsByReserveAssetIdStddevPopulationIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_ID_DESC',
  AavepoolsByReserveAssetIdStddevPopulationLiquidityInAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_LIQUIDITY_IN_ASC',
  AavepoolsByReserveAssetIdStddevPopulationLiquidityInDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_LIQUIDITY_IN_DESC',
  AavepoolsByReserveAssetIdStddevPopulationLiquidityOutAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_LIQUIDITY_OUT_ASC',
  AavepoolsByReserveAssetIdStddevPopulationLiquidityOutDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_LIQUIDITY_OUT_DESC',
  AavepoolsByReserveAssetIdStddevPopulationParaBlockHeightAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByReserveAssetIdStddevPopulationParaBlockHeightDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByReserveAssetIdStddevPopulationPoolIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_POOL_ID_ASC',
  AavepoolsByReserveAssetIdStddevPopulationPoolIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_POOL_ID_DESC',
  AavepoolsByReserveAssetIdStddevPopulationReserveAssetIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_RESERVE_ASSET_ID_ASC',
  AavepoolsByReserveAssetIdStddevPopulationReserveAssetIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_POPULATION_RESERVE_ASSET_ID_DESC',
  AavepoolsByReserveAssetIdStddevSampleATokenIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_A_TOKEN_ID_ASC',
  AavepoolsByReserveAssetIdStddevSampleATokenIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_A_TOKEN_ID_DESC',
  AavepoolsByReserveAssetIdStddevSampleIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_ID_ASC',
  AavepoolsByReserveAssetIdStddevSampleIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_ID_DESC',
  AavepoolsByReserveAssetIdStddevSampleLiquidityInAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_LIQUIDITY_IN_ASC',
  AavepoolsByReserveAssetIdStddevSampleLiquidityInDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_LIQUIDITY_IN_DESC',
  AavepoolsByReserveAssetIdStddevSampleLiquidityOutAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_LIQUIDITY_OUT_ASC',
  AavepoolsByReserveAssetIdStddevSampleLiquidityOutDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_LIQUIDITY_OUT_DESC',
  AavepoolsByReserveAssetIdStddevSampleParaBlockHeightAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByReserveAssetIdStddevSampleParaBlockHeightDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByReserveAssetIdStddevSamplePoolIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_POOL_ID_ASC',
  AavepoolsByReserveAssetIdStddevSamplePoolIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_POOL_ID_DESC',
  AavepoolsByReserveAssetIdStddevSampleReserveAssetIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_RESERVE_ASSET_ID_ASC',
  AavepoolsByReserveAssetIdStddevSampleReserveAssetIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_STDDEV_SAMPLE_RESERVE_ASSET_ID_DESC',
  AavepoolsByReserveAssetIdSumATokenIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_A_TOKEN_ID_ASC',
  AavepoolsByReserveAssetIdSumATokenIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_A_TOKEN_ID_DESC',
  AavepoolsByReserveAssetIdSumIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_ID_ASC',
  AavepoolsByReserveAssetIdSumIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_ID_DESC',
  AavepoolsByReserveAssetIdSumLiquidityInAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_LIQUIDITY_IN_ASC',
  AavepoolsByReserveAssetIdSumLiquidityInDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_LIQUIDITY_IN_DESC',
  AavepoolsByReserveAssetIdSumLiquidityOutAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_LIQUIDITY_OUT_ASC',
  AavepoolsByReserveAssetIdSumLiquidityOutDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_LIQUIDITY_OUT_DESC',
  AavepoolsByReserveAssetIdSumParaBlockHeightAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByReserveAssetIdSumParaBlockHeightDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByReserveAssetIdSumPoolIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_POOL_ID_ASC',
  AavepoolsByReserveAssetIdSumPoolIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_POOL_ID_DESC',
  AavepoolsByReserveAssetIdSumReserveAssetIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_RESERVE_ASSET_ID_ASC',
  AavepoolsByReserveAssetIdSumReserveAssetIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_SUM_RESERVE_ASSET_ID_DESC',
  AavepoolsByReserveAssetIdVariancePopulationATokenIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_A_TOKEN_ID_ASC',
  AavepoolsByReserveAssetIdVariancePopulationATokenIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_A_TOKEN_ID_DESC',
  AavepoolsByReserveAssetIdVariancePopulationIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_ID_ASC',
  AavepoolsByReserveAssetIdVariancePopulationIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_ID_DESC',
  AavepoolsByReserveAssetIdVariancePopulationLiquidityInAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_LIQUIDITY_IN_ASC',
  AavepoolsByReserveAssetIdVariancePopulationLiquidityInDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_LIQUIDITY_IN_DESC',
  AavepoolsByReserveAssetIdVariancePopulationLiquidityOutAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_LIQUIDITY_OUT_ASC',
  AavepoolsByReserveAssetIdVariancePopulationLiquidityOutDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_LIQUIDITY_OUT_DESC',
  AavepoolsByReserveAssetIdVariancePopulationParaBlockHeightAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByReserveAssetIdVariancePopulationParaBlockHeightDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByReserveAssetIdVariancePopulationPoolIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_POOL_ID_ASC',
  AavepoolsByReserveAssetIdVariancePopulationPoolIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_POOL_ID_DESC',
  AavepoolsByReserveAssetIdVariancePopulationReserveAssetIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_RESERVE_ASSET_ID_ASC',
  AavepoolsByReserveAssetIdVariancePopulationReserveAssetIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_POPULATION_RESERVE_ASSET_ID_DESC',
  AavepoolsByReserveAssetIdVarianceSampleATokenIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_A_TOKEN_ID_ASC',
  AavepoolsByReserveAssetIdVarianceSampleATokenIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_A_TOKEN_ID_DESC',
  AavepoolsByReserveAssetIdVarianceSampleIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_ID_ASC',
  AavepoolsByReserveAssetIdVarianceSampleIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_ID_DESC',
  AavepoolsByReserveAssetIdVarianceSampleLiquidityInAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_LIQUIDITY_IN_ASC',
  AavepoolsByReserveAssetIdVarianceSampleLiquidityInDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_LIQUIDITY_IN_DESC',
  AavepoolsByReserveAssetIdVarianceSampleLiquidityOutAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_LIQUIDITY_OUT_ASC',
  AavepoolsByReserveAssetIdVarianceSampleLiquidityOutDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_LIQUIDITY_OUT_DESC',
  AavepoolsByReserveAssetIdVarianceSampleParaBlockHeightAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  AavepoolsByReserveAssetIdVarianceSampleParaBlockHeightDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  AavepoolsByReserveAssetIdVarianceSamplePoolIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_POOL_ID_ASC',
  AavepoolsByReserveAssetIdVarianceSamplePoolIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_POOL_ID_DESC',
  AavepoolsByReserveAssetIdVarianceSampleReserveAssetIdAsc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_RESERVE_ASSET_ID_ASC',
  AavepoolsByReserveAssetIdVarianceSampleReserveAssetIdDesc = 'AAVEPOOLS_BY_RESERVE_ASSET_ID_VARIANCE_SAMPLE_RESERVE_ASSET_ID_DESC',
  AssetsByBondUnderlyingAssetIdAverageAssetTypeAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_ASSET_TYPE_ASC',
  AssetsByBondUnderlyingAssetIdAverageAssetTypeDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_ASSET_TYPE_DESC',
  AssetsByBondUnderlyingAssetIdAverageBondMaturityAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_BOND_MATURITY_ASC',
  AssetsByBondUnderlyingAssetIdAverageBondMaturityDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_BOND_MATURITY_DESC',
  AssetsByBondUnderlyingAssetIdAverageBondUnderlyingAssetIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_BOND_UNDERLYING_ASSET_ID_ASC',
  AssetsByBondUnderlyingAssetIdAverageBondUnderlyingAssetIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_BOND_UNDERLYING_ASSET_ID_DESC',
  AssetsByBondUnderlyingAssetIdAverageDecimalsAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_DECIMALS_ASC',
  AssetsByBondUnderlyingAssetIdAverageDecimalsDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_DECIMALS_DESC',
  AssetsByBondUnderlyingAssetIdAverageIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_ID_ASC',
  AssetsByBondUnderlyingAssetIdAverageIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_ID_DESC',
  AssetsByBondUnderlyingAssetIdAverageIsSufficientAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_IS_SUFFICIENT_ASC',
  AssetsByBondUnderlyingAssetIdAverageIsSufficientDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_IS_SUFFICIENT_DESC',
  AssetsByBondUnderlyingAssetIdAverageNameAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_NAME_ASC',
  AssetsByBondUnderlyingAssetIdAverageNameDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_NAME_DESC',
  AssetsByBondUnderlyingAssetIdAverageSymbolAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_SYMBOL_ASC',
  AssetsByBondUnderlyingAssetIdAverageSymbolDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_SYMBOL_DESC',
  AssetsByBondUnderlyingAssetIdAverageXcmRateLimitAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_XCM_RATE_LIMIT_ASC',
  AssetsByBondUnderlyingAssetIdAverageXcmRateLimitDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_AVERAGE_XCM_RATE_LIMIT_DESC',
  AssetsByBondUnderlyingAssetIdCountAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_COUNT_ASC',
  AssetsByBondUnderlyingAssetIdCountDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_COUNT_DESC',
  AssetsByBondUnderlyingAssetIdDistinctCountAssetTypeAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_ASSET_TYPE_ASC',
  AssetsByBondUnderlyingAssetIdDistinctCountAssetTypeDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_ASSET_TYPE_DESC',
  AssetsByBondUnderlyingAssetIdDistinctCountBondMaturityAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_BOND_MATURITY_ASC',
  AssetsByBondUnderlyingAssetIdDistinctCountBondMaturityDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_BOND_MATURITY_DESC',
  AssetsByBondUnderlyingAssetIdDistinctCountBondUnderlyingAssetIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_BOND_UNDERLYING_ASSET_ID_ASC',
  AssetsByBondUnderlyingAssetIdDistinctCountBondUnderlyingAssetIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_BOND_UNDERLYING_ASSET_ID_DESC',
  AssetsByBondUnderlyingAssetIdDistinctCountDecimalsAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_DECIMALS_ASC',
  AssetsByBondUnderlyingAssetIdDistinctCountDecimalsDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_DECIMALS_DESC',
  AssetsByBondUnderlyingAssetIdDistinctCountIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_ID_ASC',
  AssetsByBondUnderlyingAssetIdDistinctCountIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_ID_DESC',
  AssetsByBondUnderlyingAssetIdDistinctCountIsSufficientAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_IS_SUFFICIENT_ASC',
  AssetsByBondUnderlyingAssetIdDistinctCountIsSufficientDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_IS_SUFFICIENT_DESC',
  AssetsByBondUnderlyingAssetIdDistinctCountNameAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_NAME_ASC',
  AssetsByBondUnderlyingAssetIdDistinctCountNameDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_NAME_DESC',
  AssetsByBondUnderlyingAssetIdDistinctCountSymbolAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_SYMBOL_ASC',
  AssetsByBondUnderlyingAssetIdDistinctCountSymbolDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_SYMBOL_DESC',
  AssetsByBondUnderlyingAssetIdDistinctCountXcmRateLimitAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_XCM_RATE_LIMIT_ASC',
  AssetsByBondUnderlyingAssetIdDistinctCountXcmRateLimitDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_DISTINCT_COUNT_XCM_RATE_LIMIT_DESC',
  AssetsByBondUnderlyingAssetIdMaxAssetTypeAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_ASSET_TYPE_ASC',
  AssetsByBondUnderlyingAssetIdMaxAssetTypeDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_ASSET_TYPE_DESC',
  AssetsByBondUnderlyingAssetIdMaxBondMaturityAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_BOND_MATURITY_ASC',
  AssetsByBondUnderlyingAssetIdMaxBondMaturityDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_BOND_MATURITY_DESC',
  AssetsByBondUnderlyingAssetIdMaxBondUnderlyingAssetIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_BOND_UNDERLYING_ASSET_ID_ASC',
  AssetsByBondUnderlyingAssetIdMaxBondUnderlyingAssetIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_BOND_UNDERLYING_ASSET_ID_DESC',
  AssetsByBondUnderlyingAssetIdMaxDecimalsAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_DECIMALS_ASC',
  AssetsByBondUnderlyingAssetIdMaxDecimalsDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_DECIMALS_DESC',
  AssetsByBondUnderlyingAssetIdMaxIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_ID_ASC',
  AssetsByBondUnderlyingAssetIdMaxIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_ID_DESC',
  AssetsByBondUnderlyingAssetIdMaxIsSufficientAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_IS_SUFFICIENT_ASC',
  AssetsByBondUnderlyingAssetIdMaxIsSufficientDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_IS_SUFFICIENT_DESC',
  AssetsByBondUnderlyingAssetIdMaxNameAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_NAME_ASC',
  AssetsByBondUnderlyingAssetIdMaxNameDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_NAME_DESC',
  AssetsByBondUnderlyingAssetIdMaxSymbolAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_SYMBOL_ASC',
  AssetsByBondUnderlyingAssetIdMaxSymbolDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_SYMBOL_DESC',
  AssetsByBondUnderlyingAssetIdMaxXcmRateLimitAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_XCM_RATE_LIMIT_ASC',
  AssetsByBondUnderlyingAssetIdMaxXcmRateLimitDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MAX_XCM_RATE_LIMIT_DESC',
  AssetsByBondUnderlyingAssetIdMinAssetTypeAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_ASSET_TYPE_ASC',
  AssetsByBondUnderlyingAssetIdMinAssetTypeDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_ASSET_TYPE_DESC',
  AssetsByBondUnderlyingAssetIdMinBondMaturityAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_BOND_MATURITY_ASC',
  AssetsByBondUnderlyingAssetIdMinBondMaturityDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_BOND_MATURITY_DESC',
  AssetsByBondUnderlyingAssetIdMinBondUnderlyingAssetIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_BOND_UNDERLYING_ASSET_ID_ASC',
  AssetsByBondUnderlyingAssetIdMinBondUnderlyingAssetIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_BOND_UNDERLYING_ASSET_ID_DESC',
  AssetsByBondUnderlyingAssetIdMinDecimalsAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_DECIMALS_ASC',
  AssetsByBondUnderlyingAssetIdMinDecimalsDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_DECIMALS_DESC',
  AssetsByBondUnderlyingAssetIdMinIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_ID_ASC',
  AssetsByBondUnderlyingAssetIdMinIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_ID_DESC',
  AssetsByBondUnderlyingAssetIdMinIsSufficientAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_IS_SUFFICIENT_ASC',
  AssetsByBondUnderlyingAssetIdMinIsSufficientDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_IS_SUFFICIENT_DESC',
  AssetsByBondUnderlyingAssetIdMinNameAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_NAME_ASC',
  AssetsByBondUnderlyingAssetIdMinNameDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_NAME_DESC',
  AssetsByBondUnderlyingAssetIdMinSymbolAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_SYMBOL_ASC',
  AssetsByBondUnderlyingAssetIdMinSymbolDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_SYMBOL_DESC',
  AssetsByBondUnderlyingAssetIdMinXcmRateLimitAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_XCM_RATE_LIMIT_ASC',
  AssetsByBondUnderlyingAssetIdMinXcmRateLimitDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_MIN_XCM_RATE_LIMIT_DESC',
  AssetsByBondUnderlyingAssetIdStddevPopulationAssetTypeAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_ASSET_TYPE_ASC',
  AssetsByBondUnderlyingAssetIdStddevPopulationAssetTypeDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_ASSET_TYPE_DESC',
  AssetsByBondUnderlyingAssetIdStddevPopulationBondMaturityAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_BOND_MATURITY_ASC',
  AssetsByBondUnderlyingAssetIdStddevPopulationBondMaturityDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_BOND_MATURITY_DESC',
  AssetsByBondUnderlyingAssetIdStddevPopulationBondUnderlyingAssetIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_BOND_UNDERLYING_ASSET_ID_ASC',
  AssetsByBondUnderlyingAssetIdStddevPopulationBondUnderlyingAssetIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_BOND_UNDERLYING_ASSET_ID_DESC',
  AssetsByBondUnderlyingAssetIdStddevPopulationDecimalsAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_DECIMALS_ASC',
  AssetsByBondUnderlyingAssetIdStddevPopulationDecimalsDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_DECIMALS_DESC',
  AssetsByBondUnderlyingAssetIdStddevPopulationIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_ID_ASC',
  AssetsByBondUnderlyingAssetIdStddevPopulationIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_ID_DESC',
  AssetsByBondUnderlyingAssetIdStddevPopulationIsSufficientAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_IS_SUFFICIENT_ASC',
  AssetsByBondUnderlyingAssetIdStddevPopulationIsSufficientDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_IS_SUFFICIENT_DESC',
  AssetsByBondUnderlyingAssetIdStddevPopulationNameAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_NAME_ASC',
  AssetsByBondUnderlyingAssetIdStddevPopulationNameDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_NAME_DESC',
  AssetsByBondUnderlyingAssetIdStddevPopulationSymbolAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_SYMBOL_ASC',
  AssetsByBondUnderlyingAssetIdStddevPopulationSymbolDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_SYMBOL_DESC',
  AssetsByBondUnderlyingAssetIdStddevPopulationXcmRateLimitAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_XCM_RATE_LIMIT_ASC',
  AssetsByBondUnderlyingAssetIdStddevPopulationXcmRateLimitDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_POPULATION_XCM_RATE_LIMIT_DESC',
  AssetsByBondUnderlyingAssetIdStddevSampleAssetTypeAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_ASSET_TYPE_ASC',
  AssetsByBondUnderlyingAssetIdStddevSampleAssetTypeDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_ASSET_TYPE_DESC',
  AssetsByBondUnderlyingAssetIdStddevSampleBondMaturityAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_BOND_MATURITY_ASC',
  AssetsByBondUnderlyingAssetIdStddevSampleBondMaturityDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_BOND_MATURITY_DESC',
  AssetsByBondUnderlyingAssetIdStddevSampleBondUnderlyingAssetIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_BOND_UNDERLYING_ASSET_ID_ASC',
  AssetsByBondUnderlyingAssetIdStddevSampleBondUnderlyingAssetIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_BOND_UNDERLYING_ASSET_ID_DESC',
  AssetsByBondUnderlyingAssetIdStddevSampleDecimalsAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_DECIMALS_ASC',
  AssetsByBondUnderlyingAssetIdStddevSampleDecimalsDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_DECIMALS_DESC',
  AssetsByBondUnderlyingAssetIdStddevSampleIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_ID_ASC',
  AssetsByBondUnderlyingAssetIdStddevSampleIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_ID_DESC',
  AssetsByBondUnderlyingAssetIdStddevSampleIsSufficientAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_IS_SUFFICIENT_ASC',
  AssetsByBondUnderlyingAssetIdStddevSampleIsSufficientDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_IS_SUFFICIENT_DESC',
  AssetsByBondUnderlyingAssetIdStddevSampleNameAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_NAME_ASC',
  AssetsByBondUnderlyingAssetIdStddevSampleNameDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_NAME_DESC',
  AssetsByBondUnderlyingAssetIdStddevSampleSymbolAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_SYMBOL_ASC',
  AssetsByBondUnderlyingAssetIdStddevSampleSymbolDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_SYMBOL_DESC',
  AssetsByBondUnderlyingAssetIdStddevSampleXcmRateLimitAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_XCM_RATE_LIMIT_ASC',
  AssetsByBondUnderlyingAssetIdStddevSampleXcmRateLimitDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_STDDEV_SAMPLE_XCM_RATE_LIMIT_DESC',
  AssetsByBondUnderlyingAssetIdSumAssetTypeAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_ASSET_TYPE_ASC',
  AssetsByBondUnderlyingAssetIdSumAssetTypeDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_ASSET_TYPE_DESC',
  AssetsByBondUnderlyingAssetIdSumBondMaturityAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_BOND_MATURITY_ASC',
  AssetsByBondUnderlyingAssetIdSumBondMaturityDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_BOND_MATURITY_DESC',
  AssetsByBondUnderlyingAssetIdSumBondUnderlyingAssetIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_BOND_UNDERLYING_ASSET_ID_ASC',
  AssetsByBondUnderlyingAssetIdSumBondUnderlyingAssetIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_BOND_UNDERLYING_ASSET_ID_DESC',
  AssetsByBondUnderlyingAssetIdSumDecimalsAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_DECIMALS_ASC',
  AssetsByBondUnderlyingAssetIdSumDecimalsDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_DECIMALS_DESC',
  AssetsByBondUnderlyingAssetIdSumIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_ID_ASC',
  AssetsByBondUnderlyingAssetIdSumIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_ID_DESC',
  AssetsByBondUnderlyingAssetIdSumIsSufficientAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_IS_SUFFICIENT_ASC',
  AssetsByBondUnderlyingAssetIdSumIsSufficientDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_IS_SUFFICIENT_DESC',
  AssetsByBondUnderlyingAssetIdSumNameAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_NAME_ASC',
  AssetsByBondUnderlyingAssetIdSumNameDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_NAME_DESC',
  AssetsByBondUnderlyingAssetIdSumSymbolAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_SYMBOL_ASC',
  AssetsByBondUnderlyingAssetIdSumSymbolDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_SYMBOL_DESC',
  AssetsByBondUnderlyingAssetIdSumXcmRateLimitAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_XCM_RATE_LIMIT_ASC',
  AssetsByBondUnderlyingAssetIdSumXcmRateLimitDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_SUM_XCM_RATE_LIMIT_DESC',
  AssetsByBondUnderlyingAssetIdVariancePopulationAssetTypeAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_ASSET_TYPE_ASC',
  AssetsByBondUnderlyingAssetIdVariancePopulationAssetTypeDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_ASSET_TYPE_DESC',
  AssetsByBondUnderlyingAssetIdVariancePopulationBondMaturityAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_BOND_MATURITY_ASC',
  AssetsByBondUnderlyingAssetIdVariancePopulationBondMaturityDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_BOND_MATURITY_DESC',
  AssetsByBondUnderlyingAssetIdVariancePopulationBondUnderlyingAssetIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_BOND_UNDERLYING_ASSET_ID_ASC',
  AssetsByBondUnderlyingAssetIdVariancePopulationBondUnderlyingAssetIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_BOND_UNDERLYING_ASSET_ID_DESC',
  AssetsByBondUnderlyingAssetIdVariancePopulationDecimalsAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_DECIMALS_ASC',
  AssetsByBondUnderlyingAssetIdVariancePopulationDecimalsDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_DECIMALS_DESC',
  AssetsByBondUnderlyingAssetIdVariancePopulationIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_ID_ASC',
  AssetsByBondUnderlyingAssetIdVariancePopulationIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_ID_DESC',
  AssetsByBondUnderlyingAssetIdVariancePopulationIsSufficientAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_IS_SUFFICIENT_ASC',
  AssetsByBondUnderlyingAssetIdVariancePopulationIsSufficientDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_IS_SUFFICIENT_DESC',
  AssetsByBondUnderlyingAssetIdVariancePopulationNameAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_NAME_ASC',
  AssetsByBondUnderlyingAssetIdVariancePopulationNameDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_NAME_DESC',
  AssetsByBondUnderlyingAssetIdVariancePopulationSymbolAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_SYMBOL_ASC',
  AssetsByBondUnderlyingAssetIdVariancePopulationSymbolDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_SYMBOL_DESC',
  AssetsByBondUnderlyingAssetIdVariancePopulationXcmRateLimitAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_XCM_RATE_LIMIT_ASC',
  AssetsByBondUnderlyingAssetIdVariancePopulationXcmRateLimitDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_POPULATION_XCM_RATE_LIMIT_DESC',
  AssetsByBondUnderlyingAssetIdVarianceSampleAssetTypeAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_ASSET_TYPE_ASC',
  AssetsByBondUnderlyingAssetIdVarianceSampleAssetTypeDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_ASSET_TYPE_DESC',
  AssetsByBondUnderlyingAssetIdVarianceSampleBondMaturityAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_BOND_MATURITY_ASC',
  AssetsByBondUnderlyingAssetIdVarianceSampleBondMaturityDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_BOND_MATURITY_DESC',
  AssetsByBondUnderlyingAssetIdVarianceSampleBondUnderlyingAssetIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_BOND_UNDERLYING_ASSET_ID_ASC',
  AssetsByBondUnderlyingAssetIdVarianceSampleBondUnderlyingAssetIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_BOND_UNDERLYING_ASSET_ID_DESC',
  AssetsByBondUnderlyingAssetIdVarianceSampleDecimalsAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_DECIMALS_ASC',
  AssetsByBondUnderlyingAssetIdVarianceSampleDecimalsDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_DECIMALS_DESC',
  AssetsByBondUnderlyingAssetIdVarianceSampleIdAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_ID_ASC',
  AssetsByBondUnderlyingAssetIdVarianceSampleIdDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_ID_DESC',
  AssetsByBondUnderlyingAssetIdVarianceSampleIsSufficientAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_IS_SUFFICIENT_ASC',
  AssetsByBondUnderlyingAssetIdVarianceSampleIsSufficientDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_IS_SUFFICIENT_DESC',
  AssetsByBondUnderlyingAssetIdVarianceSampleNameAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_NAME_ASC',
  AssetsByBondUnderlyingAssetIdVarianceSampleNameDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_NAME_DESC',
  AssetsByBondUnderlyingAssetIdVarianceSampleSymbolAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_SYMBOL_ASC',
  AssetsByBondUnderlyingAssetIdVarianceSampleSymbolDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_SYMBOL_DESC',
  AssetsByBondUnderlyingAssetIdVarianceSampleXcmRateLimitAsc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_XCM_RATE_LIMIT_ASC',
  AssetsByBondUnderlyingAssetIdVarianceSampleXcmRateLimitDesc = 'ASSETS_BY_BOND_UNDERLYING_ASSET_ID_VARIANCE_SAMPLE_XCM_RATE_LIMIT_DESC',
  AssetHistoricalDataAverageAssetIdAsc = 'ASSET_HISTORICAL_DATA_AVERAGE_ASSET_ID_ASC',
  AssetHistoricalDataAverageAssetIdDesc = 'ASSET_HISTORICAL_DATA_AVERAGE_ASSET_ID_DESC',
  AssetHistoricalDataAverageDynamicFeeAsc = 'ASSET_HISTORICAL_DATA_AVERAGE_DYNAMIC_FEE_ASC',
  AssetHistoricalDataAverageDynamicFeeDesc = 'ASSET_HISTORICAL_DATA_AVERAGE_DYNAMIC_FEE_DESC',
  AssetHistoricalDataAverageExistentialDepositAsc = 'ASSET_HISTORICAL_DATA_AVERAGE_EXISTENTIAL_DEPOSIT_ASC',
  AssetHistoricalDataAverageExistentialDepositDesc = 'ASSET_HISTORICAL_DATA_AVERAGE_EXISTENTIAL_DEPOSIT_DESC',
  AssetHistoricalDataAverageIdAsc = 'ASSET_HISTORICAL_DATA_AVERAGE_ID_ASC',
  AssetHistoricalDataAverageIdDesc = 'ASSET_HISTORICAL_DATA_AVERAGE_ID_DESC',
  AssetHistoricalDataAverageParaBlockHeightAsc = 'ASSET_HISTORICAL_DATA_AVERAGE_PARA_BLOCK_HEIGHT_ASC',
  AssetHistoricalDataAverageParaBlockHeightDesc = 'ASSET_HISTORICAL_DATA_AVERAGE_PARA_BLOCK_HEIGHT_DESC',
  AssetHistoricalDataAverageTotalIssuanceAsc = 'ASSET_HISTORICAL_DATA_AVERAGE_TOTAL_ISSUANCE_ASC',
  AssetHistoricalDataAverageTotalIssuanceDesc = 'ASSET_HISTORICAL_DATA_AVERAGE_TOTAL_ISSUANCE_DESC',
  AssetHistoricalDataCountAsc = 'ASSET_HISTORICAL_DATA_COUNT_ASC',
  AssetHistoricalDataCountDesc = 'ASSET_HISTORICAL_DATA_COUNT_DESC',
  AssetHistoricalDataDistinctCountAssetIdAsc = 'ASSET_HISTORICAL_DATA_DISTINCT_COUNT_ASSET_ID_ASC',
  AssetHistoricalDataDistinctCountAssetIdDesc = 'ASSET_HISTORICAL_DATA_DISTINCT_COUNT_ASSET_ID_DESC',
  AssetHistoricalDataDistinctCountDynamicFeeAsc = 'ASSET_HISTORICAL_DATA_DISTINCT_COUNT_DYNAMIC_FEE_ASC',
  AssetHistoricalDataDistinctCountDynamicFeeDesc = 'ASSET_HISTORICAL_DATA_DISTINCT_COUNT_DYNAMIC_FEE_DESC',
  AssetHistoricalDataDistinctCountExistentialDepositAsc = 'ASSET_HISTORICAL_DATA_DISTINCT_COUNT_EXISTENTIAL_DEPOSIT_ASC',
  AssetHistoricalDataDistinctCountExistentialDepositDesc = 'ASSET_HISTORICAL_DATA_DISTINCT_COUNT_EXISTENTIAL_DEPOSIT_DESC',
  AssetHistoricalDataDistinctCountIdAsc = 'ASSET_HISTORICAL_DATA_DISTINCT_COUNT_ID_ASC',
  AssetHistoricalDataDistinctCountIdDesc = 'ASSET_HISTORICAL_DATA_DISTINCT_COUNT_ID_DESC',
  AssetHistoricalDataDistinctCountParaBlockHeightAsc = 'ASSET_HISTORICAL_DATA_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_ASC',
  AssetHistoricalDataDistinctCountParaBlockHeightDesc = 'ASSET_HISTORICAL_DATA_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_DESC',
  AssetHistoricalDataDistinctCountTotalIssuanceAsc = 'ASSET_HISTORICAL_DATA_DISTINCT_COUNT_TOTAL_ISSUANCE_ASC',
  AssetHistoricalDataDistinctCountTotalIssuanceDesc = 'ASSET_HISTORICAL_DATA_DISTINCT_COUNT_TOTAL_ISSUANCE_DESC',
  AssetHistoricalDataMaxAssetIdAsc = 'ASSET_HISTORICAL_DATA_MAX_ASSET_ID_ASC',
  AssetHistoricalDataMaxAssetIdDesc = 'ASSET_HISTORICAL_DATA_MAX_ASSET_ID_DESC',
  AssetHistoricalDataMaxDynamicFeeAsc = 'ASSET_HISTORICAL_DATA_MAX_DYNAMIC_FEE_ASC',
  AssetHistoricalDataMaxDynamicFeeDesc = 'ASSET_HISTORICAL_DATA_MAX_DYNAMIC_FEE_DESC',
  AssetHistoricalDataMaxExistentialDepositAsc = 'ASSET_HISTORICAL_DATA_MAX_EXISTENTIAL_DEPOSIT_ASC',
  AssetHistoricalDataMaxExistentialDepositDesc = 'ASSET_HISTORICAL_DATA_MAX_EXISTENTIAL_DEPOSIT_DESC',
  AssetHistoricalDataMaxIdAsc = 'ASSET_HISTORICAL_DATA_MAX_ID_ASC',
  AssetHistoricalDataMaxIdDesc = 'ASSET_HISTORICAL_DATA_MAX_ID_DESC',
  AssetHistoricalDataMaxParaBlockHeightAsc = 'ASSET_HISTORICAL_DATA_MAX_PARA_BLOCK_HEIGHT_ASC',
  AssetHistoricalDataMaxParaBlockHeightDesc = 'ASSET_HISTORICAL_DATA_MAX_PARA_BLOCK_HEIGHT_DESC',
  AssetHistoricalDataMaxTotalIssuanceAsc = 'ASSET_HISTORICAL_DATA_MAX_TOTAL_ISSUANCE_ASC',
  AssetHistoricalDataMaxTotalIssuanceDesc = 'ASSET_HISTORICAL_DATA_MAX_TOTAL_ISSUANCE_DESC',
  AssetHistoricalDataMinAssetIdAsc = 'ASSET_HISTORICAL_DATA_MIN_ASSET_ID_ASC',
  AssetHistoricalDataMinAssetIdDesc = 'ASSET_HISTORICAL_DATA_MIN_ASSET_ID_DESC',
  AssetHistoricalDataMinDynamicFeeAsc = 'ASSET_HISTORICAL_DATA_MIN_DYNAMIC_FEE_ASC',
  AssetHistoricalDataMinDynamicFeeDesc = 'ASSET_HISTORICAL_DATA_MIN_DYNAMIC_FEE_DESC',
  AssetHistoricalDataMinExistentialDepositAsc = 'ASSET_HISTORICAL_DATA_MIN_EXISTENTIAL_DEPOSIT_ASC',
  AssetHistoricalDataMinExistentialDepositDesc = 'ASSET_HISTORICAL_DATA_MIN_EXISTENTIAL_DEPOSIT_DESC',
  AssetHistoricalDataMinIdAsc = 'ASSET_HISTORICAL_DATA_MIN_ID_ASC',
  AssetHistoricalDataMinIdDesc = 'ASSET_HISTORICAL_DATA_MIN_ID_DESC',
  AssetHistoricalDataMinParaBlockHeightAsc = 'ASSET_HISTORICAL_DATA_MIN_PARA_BLOCK_HEIGHT_ASC',
  AssetHistoricalDataMinParaBlockHeightDesc = 'ASSET_HISTORICAL_DATA_MIN_PARA_BLOCK_HEIGHT_DESC',
  AssetHistoricalDataMinTotalIssuanceAsc = 'ASSET_HISTORICAL_DATA_MIN_TOTAL_ISSUANCE_ASC',
  AssetHistoricalDataMinTotalIssuanceDesc = 'ASSET_HISTORICAL_DATA_MIN_TOTAL_ISSUANCE_DESC',
  AssetHistoricalDataStddevPopulationAssetIdAsc = 'ASSET_HISTORICAL_DATA_STDDEV_POPULATION_ASSET_ID_ASC',
  AssetHistoricalDataStddevPopulationAssetIdDesc = 'ASSET_HISTORICAL_DATA_STDDEV_POPULATION_ASSET_ID_DESC',
  AssetHistoricalDataStddevPopulationDynamicFeeAsc = 'ASSET_HISTORICAL_DATA_STDDEV_POPULATION_DYNAMIC_FEE_ASC',
  AssetHistoricalDataStddevPopulationDynamicFeeDesc = 'ASSET_HISTORICAL_DATA_STDDEV_POPULATION_DYNAMIC_FEE_DESC',
  AssetHistoricalDataStddevPopulationExistentialDepositAsc = 'ASSET_HISTORICAL_DATA_STDDEV_POPULATION_EXISTENTIAL_DEPOSIT_ASC',
  AssetHistoricalDataStddevPopulationExistentialDepositDesc = 'ASSET_HISTORICAL_DATA_STDDEV_POPULATION_EXISTENTIAL_DEPOSIT_DESC',
  AssetHistoricalDataStddevPopulationIdAsc = 'ASSET_HISTORICAL_DATA_STDDEV_POPULATION_ID_ASC',
  AssetHistoricalDataStddevPopulationIdDesc = 'ASSET_HISTORICAL_DATA_STDDEV_POPULATION_ID_DESC',
  AssetHistoricalDataStddevPopulationParaBlockHeightAsc = 'ASSET_HISTORICAL_DATA_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  AssetHistoricalDataStddevPopulationParaBlockHeightDesc = 'ASSET_HISTORICAL_DATA_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  AssetHistoricalDataStddevPopulationTotalIssuanceAsc = 'ASSET_HISTORICAL_DATA_STDDEV_POPULATION_TOTAL_ISSUANCE_ASC',
  AssetHistoricalDataStddevPopulationTotalIssuanceDesc = 'ASSET_HISTORICAL_DATA_STDDEV_POPULATION_TOTAL_ISSUANCE_DESC',
  AssetHistoricalDataStddevSampleAssetIdAsc = 'ASSET_HISTORICAL_DATA_STDDEV_SAMPLE_ASSET_ID_ASC',
  AssetHistoricalDataStddevSampleAssetIdDesc = 'ASSET_HISTORICAL_DATA_STDDEV_SAMPLE_ASSET_ID_DESC',
  AssetHistoricalDataStddevSampleDynamicFeeAsc = 'ASSET_HISTORICAL_DATA_STDDEV_SAMPLE_DYNAMIC_FEE_ASC',
  AssetHistoricalDataStddevSampleDynamicFeeDesc = 'ASSET_HISTORICAL_DATA_STDDEV_SAMPLE_DYNAMIC_FEE_DESC',
  AssetHistoricalDataStddevSampleExistentialDepositAsc = 'ASSET_HISTORICAL_DATA_STDDEV_SAMPLE_EXISTENTIAL_DEPOSIT_ASC',
  AssetHistoricalDataStddevSampleExistentialDepositDesc = 'ASSET_HISTORICAL_DATA_STDDEV_SAMPLE_EXISTENTIAL_DEPOSIT_DESC',
  AssetHistoricalDataStddevSampleIdAsc = 'ASSET_HISTORICAL_DATA_STDDEV_SAMPLE_ID_ASC',
  AssetHistoricalDataStddevSampleIdDesc = 'ASSET_HISTORICAL_DATA_STDDEV_SAMPLE_ID_DESC',
  AssetHistoricalDataStddevSampleParaBlockHeightAsc = 'ASSET_HISTORICAL_DATA_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  AssetHistoricalDataStddevSampleParaBlockHeightDesc = 'ASSET_HISTORICAL_DATA_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  AssetHistoricalDataStddevSampleTotalIssuanceAsc = 'ASSET_HISTORICAL_DATA_STDDEV_SAMPLE_TOTAL_ISSUANCE_ASC',
  AssetHistoricalDataStddevSampleTotalIssuanceDesc = 'ASSET_HISTORICAL_DATA_STDDEV_SAMPLE_TOTAL_ISSUANCE_DESC',
  AssetHistoricalDataSumAssetIdAsc = 'ASSET_HISTORICAL_DATA_SUM_ASSET_ID_ASC',
  AssetHistoricalDataSumAssetIdDesc = 'ASSET_HISTORICAL_DATA_SUM_ASSET_ID_DESC',
  AssetHistoricalDataSumDynamicFeeAsc = 'ASSET_HISTORICAL_DATA_SUM_DYNAMIC_FEE_ASC',
  AssetHistoricalDataSumDynamicFeeDesc = 'ASSET_HISTORICAL_DATA_SUM_DYNAMIC_FEE_DESC',
  AssetHistoricalDataSumExistentialDepositAsc = 'ASSET_HISTORICAL_DATA_SUM_EXISTENTIAL_DEPOSIT_ASC',
  AssetHistoricalDataSumExistentialDepositDesc = 'ASSET_HISTORICAL_DATA_SUM_EXISTENTIAL_DEPOSIT_DESC',
  AssetHistoricalDataSumIdAsc = 'ASSET_HISTORICAL_DATA_SUM_ID_ASC',
  AssetHistoricalDataSumIdDesc = 'ASSET_HISTORICAL_DATA_SUM_ID_DESC',
  AssetHistoricalDataSumParaBlockHeightAsc = 'ASSET_HISTORICAL_DATA_SUM_PARA_BLOCK_HEIGHT_ASC',
  AssetHistoricalDataSumParaBlockHeightDesc = 'ASSET_HISTORICAL_DATA_SUM_PARA_BLOCK_HEIGHT_DESC',
  AssetHistoricalDataSumTotalIssuanceAsc = 'ASSET_HISTORICAL_DATA_SUM_TOTAL_ISSUANCE_ASC',
  AssetHistoricalDataSumTotalIssuanceDesc = 'ASSET_HISTORICAL_DATA_SUM_TOTAL_ISSUANCE_DESC',
  AssetHistoricalDataVariancePopulationAssetIdAsc = 'ASSET_HISTORICAL_DATA_VARIANCE_POPULATION_ASSET_ID_ASC',
  AssetHistoricalDataVariancePopulationAssetIdDesc = 'ASSET_HISTORICAL_DATA_VARIANCE_POPULATION_ASSET_ID_DESC',
  AssetHistoricalDataVariancePopulationDynamicFeeAsc = 'ASSET_HISTORICAL_DATA_VARIANCE_POPULATION_DYNAMIC_FEE_ASC',
  AssetHistoricalDataVariancePopulationDynamicFeeDesc = 'ASSET_HISTORICAL_DATA_VARIANCE_POPULATION_DYNAMIC_FEE_DESC',
  AssetHistoricalDataVariancePopulationExistentialDepositAsc = 'ASSET_HISTORICAL_DATA_VARIANCE_POPULATION_EXISTENTIAL_DEPOSIT_ASC',
  AssetHistoricalDataVariancePopulationExistentialDepositDesc = 'ASSET_HISTORICAL_DATA_VARIANCE_POPULATION_EXISTENTIAL_DEPOSIT_DESC',
  AssetHistoricalDataVariancePopulationIdAsc = 'ASSET_HISTORICAL_DATA_VARIANCE_POPULATION_ID_ASC',
  AssetHistoricalDataVariancePopulationIdDesc = 'ASSET_HISTORICAL_DATA_VARIANCE_POPULATION_ID_DESC',
  AssetHistoricalDataVariancePopulationParaBlockHeightAsc = 'ASSET_HISTORICAL_DATA_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  AssetHistoricalDataVariancePopulationParaBlockHeightDesc = 'ASSET_HISTORICAL_DATA_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  AssetHistoricalDataVariancePopulationTotalIssuanceAsc = 'ASSET_HISTORICAL_DATA_VARIANCE_POPULATION_TOTAL_ISSUANCE_ASC',
  AssetHistoricalDataVariancePopulationTotalIssuanceDesc = 'ASSET_HISTORICAL_DATA_VARIANCE_POPULATION_TOTAL_ISSUANCE_DESC',
  AssetHistoricalDataVarianceSampleAssetIdAsc = 'ASSET_HISTORICAL_DATA_VARIANCE_SAMPLE_ASSET_ID_ASC',
  AssetHistoricalDataVarianceSampleAssetIdDesc = 'ASSET_HISTORICAL_DATA_VARIANCE_SAMPLE_ASSET_ID_DESC',
  AssetHistoricalDataVarianceSampleDynamicFeeAsc = 'ASSET_HISTORICAL_DATA_VARIANCE_SAMPLE_DYNAMIC_FEE_ASC',
  AssetHistoricalDataVarianceSampleDynamicFeeDesc = 'ASSET_HISTORICAL_DATA_VARIANCE_SAMPLE_DYNAMIC_FEE_DESC',
  AssetHistoricalDataVarianceSampleExistentialDepositAsc = 'ASSET_HISTORICAL_DATA_VARIANCE_SAMPLE_EXISTENTIAL_DEPOSIT_ASC',
  AssetHistoricalDataVarianceSampleExistentialDepositDesc = 'ASSET_HISTORICAL_DATA_VARIANCE_SAMPLE_EXISTENTIAL_DEPOSIT_DESC',
  AssetHistoricalDataVarianceSampleIdAsc = 'ASSET_HISTORICAL_DATA_VARIANCE_SAMPLE_ID_ASC',
  AssetHistoricalDataVarianceSampleIdDesc = 'ASSET_HISTORICAL_DATA_VARIANCE_SAMPLE_ID_DESC',
  AssetHistoricalDataVarianceSampleParaBlockHeightAsc = 'ASSET_HISTORICAL_DATA_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  AssetHistoricalDataVarianceSampleParaBlockHeightDesc = 'ASSET_HISTORICAL_DATA_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  AssetHistoricalDataVarianceSampleTotalIssuanceAsc = 'ASSET_HISTORICAL_DATA_VARIANCE_SAMPLE_TOTAL_ISSUANCE_ASC',
  AssetHistoricalDataVarianceSampleTotalIssuanceDesc = 'ASSET_HISTORICAL_DATA_VARIANCE_SAMPLE_TOTAL_ISSUANCE_DESC',
  AssetTypeAsc = 'ASSET_TYPE_ASC',
  AssetTypeDesc = 'ASSET_TYPE_DESC',
  BondMaturityAsc = 'BOND_MATURITY_ASC',
  BondMaturityDesc = 'BOND_MATURITY_DESC',
  BondUnderlyingAssetIdAsc = 'BOND_UNDERLYING_ASSET_ID_ASC',
  BondUnderlyingAssetIdDesc = 'BOND_UNDERLYING_ASSET_ID_DESC',
  DecimalsAsc = 'DECIMALS_ASC',
  DecimalsDesc = 'DECIMALS_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsSufficientAsc = 'IS_SUFFICIENT_ASC',
  IsSufficientDesc = 'IS_SUFFICIENT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SymbolAsc = 'SYMBOL_ASC',
  SymbolDesc = 'SYMBOL_DESC',
  XcmRateLimitAsc = 'XCM_RATE_LIMIT_ASC',
  XcmRateLimitDesc = 'XCM_RATE_LIMIT_DESC'
}

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

export type Block = {
  __typename?: 'Block';
  hash: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  relayBlockHeight: Scalars['Int']['output'];
  timestamp: Scalars['String']['output'];
};

export type BlockAggregates = {
  __typename?: 'BlockAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<BlockAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<BlockDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<BlockMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<BlockMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<BlockStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<BlockStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<BlockSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<BlockVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<BlockVarianceSampleAggregates>;
};

export type BlockAverageAggregates = {
  __typename?: 'BlockAverageAggregates';
  /** Mean average of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of relayBlockHeight across the matching connection */
  relayBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `BlockCompressedDatum` values. */
export type BlockCompressedDataConnection = {
  __typename?: 'BlockCompressedDataConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<BlockCompressedDatumAggregates>;
  /** A list of edges which contains the `BlockCompressedDatum` and cursor to aid in pagination. */
  edges: Array<BlockCompressedDataEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<BlockCompressedDatumAggregates>>;
  /** A list of `BlockCompressedDatum` objects. */
  nodes: Array<Maybe<BlockCompressedDatum>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `BlockCompressedDatum` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `BlockCompressedDatum` values. */
export type BlockCompressedDataConnectionGroupedAggregatesArgs = {
  groupBy: Array<BlockCompressedDataGroupBy>;
  having?: InputMaybe<BlockCompressedDataHavingInput>;
};

/** A `BlockCompressedDatum` edge in the connection. */
export type BlockCompressedDataEdge = {
  __typename?: 'BlockCompressedDataEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `BlockCompressedDatum` at the end of the edge. */
  node?: Maybe<BlockCompressedDatum>;
};

/** Grouping methods for `BlockCompressedDatum` for usage during aggregation. */
export enum BlockCompressedDataGroupBy {
  Algo = 'ALGO',
  CompStrFormat = 'COMP_STR_FORMAT',
  Data = 'DATA',
  ParaBlockHeight = 'PARA_BLOCK_HEIGHT'
}

export type BlockCompressedDataHavingAverageInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockCompressedDataHavingDistinctCountInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `BlockCompressedDatum` aggregates. */
export type BlockCompressedDataHavingInput = {
  AND?: InputMaybe<Array<BlockCompressedDataHavingInput>>;
  OR?: InputMaybe<Array<BlockCompressedDataHavingInput>>;
  average?: InputMaybe<BlockCompressedDataHavingAverageInput>;
  distinctCount?: InputMaybe<BlockCompressedDataHavingDistinctCountInput>;
  max?: InputMaybe<BlockCompressedDataHavingMaxInput>;
  min?: InputMaybe<BlockCompressedDataHavingMinInput>;
  stddevPopulation?: InputMaybe<BlockCompressedDataHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<BlockCompressedDataHavingStddevSampleInput>;
  sum?: InputMaybe<BlockCompressedDataHavingSumInput>;
  variancePopulation?: InputMaybe<BlockCompressedDataHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<BlockCompressedDataHavingVarianceSampleInput>;
};

export type BlockCompressedDataHavingMaxInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockCompressedDataHavingMinInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockCompressedDataHavingStddevPopulationInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockCompressedDataHavingStddevSampleInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockCompressedDataHavingSumInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockCompressedDataHavingVariancePopulationInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockCompressedDataHavingVarianceSampleInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Methods to use when ordering `BlockCompressedDatum`. */
export enum BlockCompressedDataOrderBy {
  AlgoAsc = 'ALGO_ASC',
  AlgoDesc = 'ALGO_DESC',
  CompStrFormatAsc = 'COMP_STR_FORMAT_ASC',
  CompStrFormatDesc = 'COMP_STR_FORMAT_DESC',
  DataAsc = 'DATA_ASC',
  DataDesc = 'DATA_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  ParaBlockHeightAsc = 'PARA_BLOCK_HEIGHT_ASC',
  ParaBlockHeightDesc = 'PARA_BLOCK_HEIGHT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type BlockCompressedDatum = {
  __typename?: 'BlockCompressedDatum';
  algo: Scalars['String']['output'];
  compStrFormat: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['String']['output'];
  paraBlockHeight: Scalars['Int']['output'];
};

export type BlockCompressedDatumAggregates = {
  __typename?: 'BlockCompressedDatumAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<BlockCompressedDatumAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<BlockCompressedDatumDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<BlockCompressedDatumMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<BlockCompressedDatumMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<BlockCompressedDatumStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<BlockCompressedDatumStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<BlockCompressedDatumSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<BlockCompressedDatumVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<BlockCompressedDatumVarianceSampleAggregates>;
};

export type BlockCompressedDatumAverageAggregates = {
  __typename?: 'BlockCompressedDatumAverageAggregates';
  /** Mean average of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `BlockCompressedDatum` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type BlockCompressedDatumCondition = {
  /** Checks for equality with the object’s `algo` field. */
  algo?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `compStrFormat` field. */
  compStrFormat?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `data` field. */
  data?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<Scalars['Int']['input']>;
};

export type BlockCompressedDatumDistinctCountAggregates = {
  __typename?: 'BlockCompressedDatumDistinctCountAggregates';
  /** Distinct count of algo across the matching connection */
  algo?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of compStrFormat across the matching connection */
  compStrFormat?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of data across the matching connection */
  data?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `BlockCompressedDatum` object types. All fields are combined with a logical ‘and.’ */
export type BlockCompressedDatumFilter = {
  /** Filter by the object’s `algo` field. */
  algo?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<BlockCompressedDatumFilter>>;
  /** Filter by the object’s `compStrFormat` field. */
  compStrFormat?: InputMaybe<StringFilter>;
  /** Filter by the object’s `data` field. */
  data?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<BlockCompressedDatumFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<BlockCompressedDatumFilter>>;
  /** Filter by the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<IntFilter>;
};

export type BlockCompressedDatumMaxAggregates = {
  __typename?: 'BlockCompressedDatumMaxAggregates';
  /** Maximum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type BlockCompressedDatumMinAggregates = {
  __typename?: 'BlockCompressedDatumMinAggregates';
  /** Minimum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type BlockCompressedDatumStddevPopulationAggregates = {
  __typename?: 'BlockCompressedDatumStddevPopulationAggregates';
  /** Population standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type BlockCompressedDatumStddevSampleAggregates = {
  __typename?: 'BlockCompressedDatumStddevSampleAggregates';
  /** Sample standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type BlockCompressedDatumSumAggregates = {
  __typename?: 'BlockCompressedDatumSumAggregates';
  /** Sum of paraBlockHeight across the matching connection */
  paraBlockHeight: Scalars['BigInt']['output'];
};

export type BlockCompressedDatumVariancePopulationAggregates = {
  __typename?: 'BlockCompressedDatumVariancePopulationAggregates';
  /** Population variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type BlockCompressedDatumVarianceSampleAggregates = {
  __typename?: 'BlockCompressedDatumVarianceSampleAggregates';
  /** Sample variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/** A condition to be used against `Block` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type BlockCondition = {
  /** Checks for equality with the object’s `hash` field. */
  hash?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `height` field. */
  height?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `relayBlockHeight` field. */
  relayBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp?: InputMaybe<Scalars['String']['input']>;
};

export type BlockDistinctCountAggregates = {
  __typename?: 'BlockDistinctCountAggregates';
  /** Distinct count of hash across the matching connection */
  hash?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of height across the matching connection */
  height?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of relayBlockHeight across the matching connection */
  relayBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of timestamp across the matching connection */
  timestamp?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Block` object types. All fields are combined with a logical ‘and.’ */
export type BlockFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<BlockFilter>>;
  /** Filter by the object’s `hash` field. */
  hash?: InputMaybe<StringFilter>;
  /** Filter by the object’s `height` field. */
  height?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<BlockFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<BlockFilter>>;
  /** Filter by the object’s `relayBlockHeight` field. */
  relayBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `timestamp` field. */
  timestamp?: InputMaybe<StringFilter>;
};

/** Grouping methods for `Block` for usage during aggregation. */
export enum BlockGroupBy {
  Hash = 'HASH',
  Height = 'HEIGHT',
  RelayBlockHeight = 'RELAY_BLOCK_HEIGHT',
  Timestamp = 'TIMESTAMP'
}

export type BlockHavingAverageInput = {
  height?: InputMaybe<HavingIntFilter>;
  relayBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockHavingDistinctCountInput = {
  height?: InputMaybe<HavingIntFilter>;
  relayBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `Block` aggregates. */
export type BlockHavingInput = {
  AND?: InputMaybe<Array<BlockHavingInput>>;
  OR?: InputMaybe<Array<BlockHavingInput>>;
  average?: InputMaybe<BlockHavingAverageInput>;
  distinctCount?: InputMaybe<BlockHavingDistinctCountInput>;
  max?: InputMaybe<BlockHavingMaxInput>;
  min?: InputMaybe<BlockHavingMinInput>;
  stddevPopulation?: InputMaybe<BlockHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<BlockHavingStddevSampleInput>;
  sum?: InputMaybe<BlockHavingSumInput>;
  variancePopulation?: InputMaybe<BlockHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<BlockHavingVarianceSampleInput>;
};

export type BlockHavingMaxInput = {
  height?: InputMaybe<HavingIntFilter>;
  relayBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockHavingMinInput = {
  height?: InputMaybe<HavingIntFilter>;
  relayBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockHavingStddevPopulationInput = {
  height?: InputMaybe<HavingIntFilter>;
  relayBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockHavingStddevSampleInput = {
  height?: InputMaybe<HavingIntFilter>;
  relayBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockHavingSumInput = {
  height?: InputMaybe<HavingIntFilter>;
  relayBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockHavingVariancePopulationInput = {
  height?: InputMaybe<HavingIntFilter>;
  relayBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockHavingVarianceSampleInput = {
  height?: InputMaybe<HavingIntFilter>;
  relayBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type BlockMaxAggregates = {
  __typename?: 'BlockMaxAggregates';
  /** Maximum of height across the matching connection */
  height?: Maybe<Scalars['Int']['output']>;
  /** Maximum of relayBlockHeight across the matching connection */
  relayBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type BlockMinAggregates = {
  __typename?: 'BlockMinAggregates';
  /** Minimum of height across the matching connection */
  height?: Maybe<Scalars['Int']['output']>;
  /** Minimum of relayBlockHeight across the matching connection */
  relayBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type BlockStddevPopulationAggregates = {
  __typename?: 'BlockStddevPopulationAggregates';
  /** Population standard deviation of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of relayBlockHeight across the matching connection */
  relayBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type BlockStddevSampleAggregates = {
  __typename?: 'BlockStddevSampleAggregates';
  /** Sample standard deviation of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of relayBlockHeight across the matching connection */
  relayBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type BlockSumAggregates = {
  __typename?: 'BlockSumAggregates';
  /** Sum of height across the matching connection */
  height: Scalars['BigInt']['output'];
  /** Sum of relayBlockHeight across the matching connection */
  relayBlockHeight: Scalars['BigInt']['output'];
};

export type BlockVariancePopulationAggregates = {
  __typename?: 'BlockVariancePopulationAggregates';
  /** Population variance of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of relayBlockHeight across the matching connection */
  relayBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type BlockVarianceSampleAggregates = {
  __typename?: 'BlockVarianceSampleAggregates';
  /** Sample variance of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of relayBlockHeight across the matching connection */
  relayBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Block` values. */
export type BlocksConnection = {
  __typename?: 'BlocksConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<BlockAggregates>;
  /** A list of edges which contains the `Block` and cursor to aid in pagination. */
  edges: Array<BlocksEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<BlockAggregates>>;
  /** A list of `Block` objects. */
  nodes: Array<Maybe<Block>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Block` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Block` values. */
export type BlocksConnectionGroupedAggregatesArgs = {
  groupBy: Array<BlockGroupBy>;
  having?: InputMaybe<BlockHavingInput>;
};

/** A `Block` edge in the connection. */
export type BlocksEdge = {
  __typename?: 'BlocksEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Block` at the end of the edge. */
  node?: Maybe<Block>;
};

/** Methods to use when ordering `Block`. */
export enum BlocksOrderBy {
  HashAsc = 'HASH_ASC',
  HashDesc = 'HASH_DESC',
  HeightAsc = 'HEIGHT_ASC',
  HeightDesc = 'HEIGHT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RelayBlockHeightAsc = 'RELAY_BLOCK_HEIGHT_ASC',
  RelayBlockHeightDesc = 'RELAY_BLOCK_HEIGHT_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC'
}

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Boolean']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export type DataStructureType = {
  __typename?: 'DataStructureType';
  definition: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DataStructureTypeAggregates = {
  __typename?: 'DataStructureTypeAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<DataStructureTypeDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
};

/**
 * A condition to be used against `DataStructureType` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type DataStructureTypeCondition = {
  /** Checks for equality with the object’s `definition` field. */
  definition?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type DataStructureTypeDistinctCountAggregates = {
  __typename?: 'DataStructureTypeDistinctCountAggregates';
  /** Distinct count of definition across the matching connection */
  definition?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `DataStructureType` object types. All fields are combined with a logical ‘and.’ */
export type DataStructureTypeFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<DataStructureTypeFilter>>;
  /** Filter by the object’s `definition` field. */
  definition?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<DataStructureTypeFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<DataStructureTypeFilter>>;
};

/** Grouping methods for `DataStructureType` for usage during aggregation. */
export enum DataStructureTypeGroupBy {
  Definition = 'DEFINITION',
  Name = 'NAME'
}

/** Conditions for `DataStructureType` aggregates. */
export type DataStructureTypeHavingInput = {
  AND?: InputMaybe<Array<DataStructureTypeHavingInput>>;
  OR?: InputMaybe<Array<DataStructureTypeHavingInput>>;
};

/** A connection to a list of `DataStructureType` values. */
export type DataStructureTypesConnection = {
  __typename?: 'DataStructureTypesConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<DataStructureTypeAggregates>;
  /** A list of edges which contains the `DataStructureType` and cursor to aid in pagination. */
  edges: Array<DataStructureTypesEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<DataStructureTypeAggregates>>;
  /** A list of `DataStructureType` objects. */
  nodes: Array<Maybe<DataStructureType>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `DataStructureType` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `DataStructureType` values. */
export type DataStructureTypesConnectionGroupedAggregatesArgs = {
  groupBy: Array<DataStructureTypeGroupBy>;
  having?: InputMaybe<DataStructureTypeHavingInput>;
};

/** A `DataStructureType` edge in the connection. */
export type DataStructureTypesEdge = {
  __typename?: 'DataStructureTypesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `DataStructureType` at the end of the edge. */
  node?: Maybe<DataStructureType>;
};

/** Methods to use when ordering `DataStructureType`. */
export enum DataStructureTypesOrderBy {
  DefinitionAsc = 'DEFINITION_ASC',
  DefinitionDesc = 'DEFINITION_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type EmaOracle = {
  __typename?: 'EmaOracle';
  entries: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  paraBlockHeight: Scalars['Int']['output'];
};

export type EmaOracleAggregates = {
  __typename?: 'EmaOracleAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<EmaOracleAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<EmaOracleDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<EmaOracleMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<EmaOracleMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<EmaOracleStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<EmaOracleStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<EmaOracleSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<EmaOracleVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<EmaOracleVarianceSampleAggregates>;
};

export type EmaOracleAverageAggregates = {
  __typename?: 'EmaOracleAverageAggregates';
  /** Mean average of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `EmaOracle` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type EmaOracleCondition = {
  /** Checks for equality with the object’s `entries` field. */
  entries?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<Scalars['Int']['input']>;
};

export type EmaOracleDistinctCountAggregates = {
  __typename?: 'EmaOracleDistinctCountAggregates';
  /** Distinct count of entries across the matching connection */
  entries?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `EmaOracle` object types. All fields are combined with a logical ‘and.’ */
export type EmaOracleFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EmaOracleFilter>>;
  /** Filter by the object’s `entries` field. */
  entries?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EmaOracleFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EmaOracleFilter>>;
  /** Filter by the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<IntFilter>;
};

/** Grouping methods for `EmaOracle` for usage during aggregation. */
export enum EmaOracleGroupBy {
  Entries = 'ENTRIES',
  ParaBlockHeight = 'PARA_BLOCK_HEIGHT'
}

export type EmaOracleHavingAverageInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type EmaOracleHavingDistinctCountInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `EmaOracle` aggregates. */
export type EmaOracleHavingInput = {
  AND?: InputMaybe<Array<EmaOracleHavingInput>>;
  OR?: InputMaybe<Array<EmaOracleHavingInput>>;
  average?: InputMaybe<EmaOracleHavingAverageInput>;
  distinctCount?: InputMaybe<EmaOracleHavingDistinctCountInput>;
  max?: InputMaybe<EmaOracleHavingMaxInput>;
  min?: InputMaybe<EmaOracleHavingMinInput>;
  stddevPopulation?: InputMaybe<EmaOracleHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<EmaOracleHavingStddevSampleInput>;
  sum?: InputMaybe<EmaOracleHavingSumInput>;
  variancePopulation?: InputMaybe<EmaOracleHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<EmaOracleHavingVarianceSampleInput>;
};

export type EmaOracleHavingMaxInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type EmaOracleHavingMinInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type EmaOracleHavingStddevPopulationInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type EmaOracleHavingStddevSampleInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type EmaOracleHavingSumInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type EmaOracleHavingVariancePopulationInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type EmaOracleHavingVarianceSampleInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type EmaOracleMaxAggregates = {
  __typename?: 'EmaOracleMaxAggregates';
  /** Maximum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type EmaOracleMinAggregates = {
  __typename?: 'EmaOracleMinAggregates';
  /** Minimum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type EmaOracleStddevPopulationAggregates = {
  __typename?: 'EmaOracleStddevPopulationAggregates';
  /** Population standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type EmaOracleStddevSampleAggregates = {
  __typename?: 'EmaOracleStddevSampleAggregates';
  /** Sample standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type EmaOracleSumAggregates = {
  __typename?: 'EmaOracleSumAggregates';
  /** Sum of paraBlockHeight across the matching connection */
  paraBlockHeight: Scalars['BigInt']['output'];
};

export type EmaOracleVariancePopulationAggregates = {
  __typename?: 'EmaOracleVariancePopulationAggregates';
  /** Population variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type EmaOracleVarianceSampleAggregates = {
  __typename?: 'EmaOracleVarianceSampleAggregates';
  /** Sample variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `EmaOracle` values. */
export type EmaOraclesConnection = {
  __typename?: 'EmaOraclesConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<EmaOracleAggregates>;
  /** A list of edges which contains the `EmaOracle` and cursor to aid in pagination. */
  edges: Array<EmaOraclesEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<EmaOracleAggregates>>;
  /** A list of `EmaOracle` objects. */
  nodes: Array<Maybe<EmaOracle>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `EmaOracle` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `EmaOracle` values. */
export type EmaOraclesConnectionGroupedAggregatesArgs = {
  groupBy: Array<EmaOracleGroupBy>;
  having?: InputMaybe<EmaOracleHavingInput>;
};

/** A `EmaOracle` edge in the connection. */
export type EmaOraclesEdge = {
  __typename?: 'EmaOraclesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `EmaOracle` at the end of the edge. */
  node?: Maybe<EmaOracle>;
};

/** Methods to use when ordering `EmaOracle`. */
export enum EmaOraclesOrderBy {
  EntriesAsc = 'ENTRIES_ASC',
  EntriesDesc = 'ENTRIES_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  ParaBlockHeightAsc = 'PARA_BLOCK_HEIGHT_ASC',
  ParaBlockHeightDesc = 'PARA_BLOCK_HEIGHT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

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

export type Lbppool = {
  __typename?: 'Lbppool';
  assetAId: Scalars['Int']['output'];
  assetBId: Scalars['Int']['output'];
  end?: Maybe<Scalars['Int']['output']>;
  fee: Array<Maybe<Scalars['Int']['output']>>;
  feeCollector?: Maybe<Scalars['String']['output']>;
  finalWeight: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  initialWeight: Scalars['Int']['output'];
  /** Reads and enables pagination through a set of `LbppoolAssetsDatum`. */
  lbppoolAssetsDataByPoolId: LbppoolAssetsDataConnection;
  owner: Scalars['String']['output'];
  paraBlockHeight: Scalars['Int']['output'];
  poolAddress: Scalars['String']['output'];
  repayTarget: Scalars['String']['output'];
  start?: Maybe<Scalars['Int']['output']>;
  weightCurve: Scalars['String']['output'];
};


export type LbppoolLbppoolAssetsDataByPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<LbppoolAssetsDatumCondition>;
  filter?: InputMaybe<LbppoolAssetsDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LbppoolAssetsDataOrderBy>>;
};

export type LbppoolAggregates = {
  __typename?: 'LbppoolAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<LbppoolAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<LbppoolDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<LbppoolMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<LbppoolMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<LbppoolStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<LbppoolStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<LbppoolSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<LbppoolVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<LbppoolVarianceSampleAggregates>;
};

/** A connection to a list of `LbppoolAssetsDatum` values. */
export type LbppoolAssetsDataConnection = {
  __typename?: 'LbppoolAssetsDataConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<LbppoolAssetsDatumAggregates>;
  /** A list of edges which contains the `LbppoolAssetsDatum` and cursor to aid in pagination. */
  edges: Array<LbppoolAssetsDataEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<LbppoolAssetsDatumAggregates>>;
  /** A list of `LbppoolAssetsDatum` objects. */
  nodes: Array<Maybe<LbppoolAssetsDatum>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `LbppoolAssetsDatum` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `LbppoolAssetsDatum` values. */
export type LbppoolAssetsDataConnectionGroupedAggregatesArgs = {
  groupBy: Array<LbppoolAssetsDataGroupBy>;
  having?: InputMaybe<LbppoolAssetsDataHavingInput>;
};

/** A `LbppoolAssetsDatum` edge in the connection. */
export type LbppoolAssetsDataEdge = {
  __typename?: 'LbppoolAssetsDataEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `LbppoolAssetsDatum` at the end of the edge. */
  node?: Maybe<LbppoolAssetsDatum>;
};

/** Grouping methods for `LbppoolAssetsDatum` for usage during aggregation. */
export enum LbppoolAssetsDataGroupBy {
  AssetId = 'ASSET_ID',
  Balances = 'BALANCES',
  ParaBlockHeight = 'PARA_BLOCK_HEIGHT',
  PoolId = 'POOL_ID'
}

export type LbppoolAssetsDataHavingAverageInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbppoolAssetsDataHavingDistinctCountInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `LbppoolAssetsDatum` aggregates. */
export type LbppoolAssetsDataHavingInput = {
  AND?: InputMaybe<Array<LbppoolAssetsDataHavingInput>>;
  OR?: InputMaybe<Array<LbppoolAssetsDataHavingInput>>;
  average?: InputMaybe<LbppoolAssetsDataHavingAverageInput>;
  distinctCount?: InputMaybe<LbppoolAssetsDataHavingDistinctCountInput>;
  max?: InputMaybe<LbppoolAssetsDataHavingMaxInput>;
  min?: InputMaybe<LbppoolAssetsDataHavingMinInput>;
  stddevPopulation?: InputMaybe<LbppoolAssetsDataHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<LbppoolAssetsDataHavingStddevSampleInput>;
  sum?: InputMaybe<LbppoolAssetsDataHavingSumInput>;
  variancePopulation?: InputMaybe<LbppoolAssetsDataHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<LbppoolAssetsDataHavingVarianceSampleInput>;
};

export type LbppoolAssetsDataHavingMaxInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbppoolAssetsDataHavingMinInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbppoolAssetsDataHavingStddevPopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbppoolAssetsDataHavingStddevSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbppoolAssetsDataHavingSumInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbppoolAssetsDataHavingVariancePopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type LbppoolAssetsDataHavingVarianceSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Methods to use when ordering `LbppoolAssetsDatum`. */
export enum LbppoolAssetsDataOrderBy {
  AssetIdAsc = 'ASSET_ID_ASC',
  AssetIdDesc = 'ASSET_ID_DESC',
  BalancesAsc = 'BALANCES_ASC',
  BalancesDesc = 'BALANCES_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  ParaBlockHeightAsc = 'PARA_BLOCK_HEIGHT_ASC',
  ParaBlockHeightDesc = 'PARA_BLOCK_HEIGHT_DESC',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type LbppoolAssetsDatum = {
  __typename?: 'LbppoolAssetsDatum';
  assetId: Scalars['Int']['output'];
  balances: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  paraBlockHeight: Scalars['Int']['output'];
  /** Reads a single `Lbppool` that is related to this `LbppoolAssetsDatum`. */
  pool?: Maybe<Lbppool>;
  poolId?: Maybe<Scalars['String']['output']>;
};

export type LbppoolAssetsDatumAggregates = {
  __typename?: 'LbppoolAssetsDatumAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<LbppoolAssetsDatumAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<LbppoolAssetsDatumDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<LbppoolAssetsDatumMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<LbppoolAssetsDatumMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<LbppoolAssetsDatumStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<LbppoolAssetsDatumStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<LbppoolAssetsDatumSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<LbppoolAssetsDatumVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<LbppoolAssetsDatumVarianceSampleAggregates>;
};

export type LbppoolAssetsDatumAverageAggregates = {
  __typename?: 'LbppoolAssetsDatumAverageAggregates';
  /** Mean average of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `LbppoolAssetsDatum` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type LbppoolAssetsDatumCondition = {
  /** Checks for equality with the object’s `assetId` field. */
  assetId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `balances` field. */
  balances?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolId` field. */
  poolId?: InputMaybe<Scalars['String']['input']>;
};

export type LbppoolAssetsDatumDistinctCountAggregates = {
  __typename?: 'LbppoolAssetsDatumDistinctCountAggregates';
  /** Distinct count of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of balances across the matching connection */
  balances?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `LbppoolAssetsDatum` object types. All fields are combined with a logical ‘and.’ */
export type LbppoolAssetsDatumFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<LbppoolAssetsDatumFilter>>;
  /** Filter by the object’s `assetId` field. */
  assetId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `balances` field. */
  balances?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<LbppoolAssetsDatumFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<LbppoolAssetsDatumFilter>>;
  /** Filter by the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
};

export type LbppoolAssetsDatumMaxAggregates = {
  __typename?: 'LbppoolAssetsDatumMaxAggregates';
  /** Maximum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type LbppoolAssetsDatumMinAggregates = {
  __typename?: 'LbppoolAssetsDatumMinAggregates';
  /** Minimum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type LbppoolAssetsDatumStddevPopulationAggregates = {
  __typename?: 'LbppoolAssetsDatumStddevPopulationAggregates';
  /** Population standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbppoolAssetsDatumStddevSampleAggregates = {
  __typename?: 'LbppoolAssetsDatumStddevSampleAggregates';
  /** Sample standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbppoolAssetsDatumSumAggregates = {
  __typename?: 'LbppoolAssetsDatumSumAggregates';
  /** Sum of assetId across the matching connection */
  assetId: Scalars['BigInt']['output'];
  /** Sum of paraBlockHeight across the matching connection */
  paraBlockHeight: Scalars['BigInt']['output'];
};

export type LbppoolAssetsDatumVariancePopulationAggregates = {
  __typename?: 'LbppoolAssetsDatumVariancePopulationAggregates';
  /** Population variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbppoolAssetsDatumVarianceSampleAggregates = {
  __typename?: 'LbppoolAssetsDatumVarianceSampleAggregates';
  /** Sample variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbppoolAverageAggregates = {
  __typename?: 'LbppoolAverageAggregates';
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
  /** Mean average of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of start across the matching connection */
  start?: Maybe<Scalars['BigFloat']['output']>;
};

/** A condition to be used against `Lbppool` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type LbppoolCondition = {
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
  /** Checks for equality with the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `repayTarget` field. */
  repayTarget?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `start` field. */
  start?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `weightCurve` field. */
  weightCurve?: InputMaybe<Scalars['String']['input']>;
};

export type LbppoolDistinctCountAggregates = {
  __typename?: 'LbppoolDistinctCountAggregates';
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
  /** Distinct count of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolAddress across the matching connection */
  poolAddress?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of repayTarget across the matching connection */
  repayTarget?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of start across the matching connection */
  start?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of weightCurve across the matching connection */
  weightCurve?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Lbppool` object types. All fields are combined with a logical ‘and.’ */
export type LbppoolFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<LbppoolFilter>>;
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
  not?: InputMaybe<LbppoolFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<LbppoolFilter>>;
  /** Filter by the object’s `owner` field. */
  owner?: InputMaybe<StringFilter>;
  /** Filter by the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<StringFilter>;
  /** Filter by the object’s `repayTarget` field. */
  repayTarget?: InputMaybe<StringFilter>;
  /** Filter by the object’s `start` field. */
  start?: InputMaybe<IntFilter>;
  /** Filter by the object’s `weightCurve` field. */
  weightCurve?: InputMaybe<StringFilter>;
};

/** Grouping methods for `Lbppool` for usage during aggregation. */
export enum LbppoolGroupBy {
  AssetAId = 'ASSET_A_ID',
  AssetBId = 'ASSET_B_ID',
  End = 'END',
  Fee = 'FEE',
  FeeCollector = 'FEE_COLLECTOR',
  FinalWeight = 'FINAL_WEIGHT',
  InitialWeight = 'INITIAL_WEIGHT',
  Owner = 'OWNER',
  ParaBlockHeight = 'PARA_BLOCK_HEIGHT',
  PoolAddress = 'POOL_ADDRESS',
  RepayTarget = 'REPAY_TARGET',
  Start = 'START',
  WeightCurve = 'WEIGHT_CURVE'
}

export type LbppoolHavingAverageInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbppoolHavingDistinctCountInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `Lbppool` aggregates. */
export type LbppoolHavingInput = {
  AND?: InputMaybe<Array<LbppoolHavingInput>>;
  OR?: InputMaybe<Array<LbppoolHavingInput>>;
  average?: InputMaybe<LbppoolHavingAverageInput>;
  distinctCount?: InputMaybe<LbppoolHavingDistinctCountInput>;
  max?: InputMaybe<LbppoolHavingMaxInput>;
  min?: InputMaybe<LbppoolHavingMinInput>;
  stddevPopulation?: InputMaybe<LbppoolHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<LbppoolHavingStddevSampleInput>;
  sum?: InputMaybe<LbppoolHavingSumInput>;
  variancePopulation?: InputMaybe<LbppoolHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<LbppoolHavingVarianceSampleInput>;
};

export type LbppoolHavingMaxInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbppoolHavingMinInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbppoolHavingStddevPopulationInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbppoolHavingStddevSampleInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbppoolHavingSumInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbppoolHavingVariancePopulationInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbppoolHavingVarianceSampleInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  end?: InputMaybe<HavingIntFilter>;
  finalWeight?: InputMaybe<HavingIntFilter>;
  initialWeight?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  start?: InputMaybe<HavingIntFilter>;
};

export type LbppoolMaxAggregates = {
  __typename?: 'LbppoolMaxAggregates';
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
  /** Maximum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
  /** Maximum of start across the matching connection */
  start?: Maybe<Scalars['Int']['output']>;
};

export type LbppoolMinAggregates = {
  __typename?: 'LbppoolMinAggregates';
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
  /** Minimum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
  /** Minimum of start across the matching connection */
  start?: Maybe<Scalars['Int']['output']>;
};

export type LbppoolStddevPopulationAggregates = {
  __typename?: 'LbppoolStddevPopulationAggregates';
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
  /** Population standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of start across the matching connection */
  start?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbppoolStddevSampleAggregates = {
  __typename?: 'LbppoolStddevSampleAggregates';
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
  /** Sample standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of start across the matching connection */
  start?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbppoolSumAggregates = {
  __typename?: 'LbppoolSumAggregates';
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
  /** Sum of paraBlockHeight across the matching connection */
  paraBlockHeight: Scalars['BigInt']['output'];
  /** Sum of start across the matching connection */
  start: Scalars['BigInt']['output'];
};

export type LbppoolVariancePopulationAggregates = {
  __typename?: 'LbppoolVariancePopulationAggregates';
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
  /** Population variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of start across the matching connection */
  start?: Maybe<Scalars['BigFloat']['output']>;
};

export type LbppoolVarianceSampleAggregates = {
  __typename?: 'LbppoolVarianceSampleAggregates';
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
  /** Sample variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of start across the matching connection */
  start?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Lbppool` values. */
export type LbppoolsConnection = {
  __typename?: 'LbppoolsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<LbppoolAggregates>;
  /** A list of edges which contains the `Lbppool` and cursor to aid in pagination. */
  edges: Array<LbppoolsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<LbppoolAggregates>>;
  /** A list of `Lbppool` objects. */
  nodes: Array<Maybe<Lbppool>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Lbppool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Lbppool` values. */
export type LbppoolsConnectionGroupedAggregatesArgs = {
  groupBy: Array<LbppoolGroupBy>;
  having?: InputMaybe<LbppoolHavingInput>;
};

/** A `Lbppool` edge in the connection. */
export type LbppoolsEdge = {
  __typename?: 'LbppoolsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Lbppool` at the end of the edge. */
  node?: Maybe<Lbppool>;
};

/** Methods to use when ordering `Lbppool`. */
export enum LbppoolsOrderBy {
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
  LbppoolAssetsDataByPoolIdAverageAssetIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_ASC',
  LbppoolAssetsDataByPoolIdAverageAssetIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_DESC',
  LbppoolAssetsDataByPoolIdAverageBalancesAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_BALANCES_ASC',
  LbppoolAssetsDataByPoolIdAverageBalancesDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_BALANCES_DESC',
  LbppoolAssetsDataByPoolIdAverageIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ID_ASC',
  LbppoolAssetsDataByPoolIdAverageIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ID_DESC',
  LbppoolAssetsDataByPoolIdAverageParaBlockHeightAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_PARA_BLOCK_HEIGHT_ASC',
  LbppoolAssetsDataByPoolIdAverageParaBlockHeightDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_PARA_BLOCK_HEIGHT_DESC',
  LbppoolAssetsDataByPoolIdAveragePoolIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_POOL_ID_ASC',
  LbppoolAssetsDataByPoolIdAveragePoolIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_POOL_ID_DESC',
  LbppoolAssetsDataByPoolIdCountAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_COUNT_ASC',
  LbppoolAssetsDataByPoolIdCountDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_COUNT_DESC',
  LbppoolAssetsDataByPoolIdDistinctCountAssetIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_ASC',
  LbppoolAssetsDataByPoolIdDistinctCountAssetIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_DESC',
  LbppoolAssetsDataByPoolIdDistinctCountBalancesAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_ASC',
  LbppoolAssetsDataByPoolIdDistinctCountBalancesDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_DESC',
  LbppoolAssetsDataByPoolIdDistinctCountIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_ASC',
  LbppoolAssetsDataByPoolIdDistinctCountIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_DESC',
  LbppoolAssetsDataByPoolIdDistinctCountParaBlockHeightAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_ASC',
  LbppoolAssetsDataByPoolIdDistinctCountParaBlockHeightDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_DESC',
  LbppoolAssetsDataByPoolIdDistinctCountPoolIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_ASC',
  LbppoolAssetsDataByPoolIdDistinctCountPoolIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_DESC',
  LbppoolAssetsDataByPoolIdMaxAssetIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MAX_ASSET_ID_ASC',
  LbppoolAssetsDataByPoolIdMaxAssetIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MAX_ASSET_ID_DESC',
  LbppoolAssetsDataByPoolIdMaxBalancesAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MAX_BALANCES_ASC',
  LbppoolAssetsDataByPoolIdMaxBalancesDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MAX_BALANCES_DESC',
  LbppoolAssetsDataByPoolIdMaxIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MAX_ID_ASC',
  LbppoolAssetsDataByPoolIdMaxIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MAX_ID_DESC',
  LbppoolAssetsDataByPoolIdMaxParaBlockHeightAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MAX_PARA_BLOCK_HEIGHT_ASC',
  LbppoolAssetsDataByPoolIdMaxParaBlockHeightDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MAX_PARA_BLOCK_HEIGHT_DESC',
  LbppoolAssetsDataByPoolIdMaxPoolIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MAX_POOL_ID_ASC',
  LbppoolAssetsDataByPoolIdMaxPoolIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MAX_POOL_ID_DESC',
  LbppoolAssetsDataByPoolIdMinAssetIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MIN_ASSET_ID_ASC',
  LbppoolAssetsDataByPoolIdMinAssetIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MIN_ASSET_ID_DESC',
  LbppoolAssetsDataByPoolIdMinBalancesAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MIN_BALANCES_ASC',
  LbppoolAssetsDataByPoolIdMinBalancesDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MIN_BALANCES_DESC',
  LbppoolAssetsDataByPoolIdMinIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MIN_ID_ASC',
  LbppoolAssetsDataByPoolIdMinIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MIN_ID_DESC',
  LbppoolAssetsDataByPoolIdMinParaBlockHeightAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MIN_PARA_BLOCK_HEIGHT_ASC',
  LbppoolAssetsDataByPoolIdMinParaBlockHeightDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MIN_PARA_BLOCK_HEIGHT_DESC',
  LbppoolAssetsDataByPoolIdMinPoolIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MIN_POOL_ID_ASC',
  LbppoolAssetsDataByPoolIdMinPoolIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_MIN_POOL_ID_DESC',
  LbppoolAssetsDataByPoolIdStddevPopulationAssetIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_ASC',
  LbppoolAssetsDataByPoolIdStddevPopulationAssetIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_DESC',
  LbppoolAssetsDataByPoolIdStddevPopulationBalancesAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_ASC',
  LbppoolAssetsDataByPoolIdStddevPopulationBalancesDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_DESC',
  LbppoolAssetsDataByPoolIdStddevPopulationIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_ASC',
  LbppoolAssetsDataByPoolIdStddevPopulationIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_DESC',
  LbppoolAssetsDataByPoolIdStddevPopulationParaBlockHeightAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  LbppoolAssetsDataByPoolIdStddevPopulationParaBlockHeightDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  LbppoolAssetsDataByPoolIdStddevPopulationPoolIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_ASC',
  LbppoolAssetsDataByPoolIdStddevPopulationPoolIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_DESC',
  LbppoolAssetsDataByPoolIdStddevSampleAssetIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_ASC',
  LbppoolAssetsDataByPoolIdStddevSampleAssetIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_DESC',
  LbppoolAssetsDataByPoolIdStddevSampleBalancesAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_ASC',
  LbppoolAssetsDataByPoolIdStddevSampleBalancesDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_DESC',
  LbppoolAssetsDataByPoolIdStddevSampleIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_ASC',
  LbppoolAssetsDataByPoolIdStddevSampleIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_DESC',
  LbppoolAssetsDataByPoolIdStddevSampleParaBlockHeightAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  LbppoolAssetsDataByPoolIdStddevSampleParaBlockHeightDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  LbppoolAssetsDataByPoolIdStddevSamplePoolIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_ASC',
  LbppoolAssetsDataByPoolIdStddevSamplePoolIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_DESC',
  LbppoolAssetsDataByPoolIdSumAssetIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_SUM_ASSET_ID_ASC',
  LbppoolAssetsDataByPoolIdSumAssetIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_SUM_ASSET_ID_DESC',
  LbppoolAssetsDataByPoolIdSumBalancesAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_SUM_BALANCES_ASC',
  LbppoolAssetsDataByPoolIdSumBalancesDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_SUM_BALANCES_DESC',
  LbppoolAssetsDataByPoolIdSumIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_SUM_ID_ASC',
  LbppoolAssetsDataByPoolIdSumIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_SUM_ID_DESC',
  LbppoolAssetsDataByPoolIdSumParaBlockHeightAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_SUM_PARA_BLOCK_HEIGHT_ASC',
  LbppoolAssetsDataByPoolIdSumParaBlockHeightDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_SUM_PARA_BLOCK_HEIGHT_DESC',
  LbppoolAssetsDataByPoolIdSumPoolIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_SUM_POOL_ID_ASC',
  LbppoolAssetsDataByPoolIdSumPoolIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_SUM_POOL_ID_DESC',
  LbppoolAssetsDataByPoolIdVariancePopulationAssetIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_ASC',
  LbppoolAssetsDataByPoolIdVariancePopulationAssetIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_DESC',
  LbppoolAssetsDataByPoolIdVariancePopulationBalancesAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_ASC',
  LbppoolAssetsDataByPoolIdVariancePopulationBalancesDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_DESC',
  LbppoolAssetsDataByPoolIdVariancePopulationIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_ASC',
  LbppoolAssetsDataByPoolIdVariancePopulationIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_DESC',
  LbppoolAssetsDataByPoolIdVariancePopulationParaBlockHeightAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  LbppoolAssetsDataByPoolIdVariancePopulationParaBlockHeightDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  LbppoolAssetsDataByPoolIdVariancePopulationPoolIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_ASC',
  LbppoolAssetsDataByPoolIdVariancePopulationPoolIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_DESC',
  LbppoolAssetsDataByPoolIdVarianceSampleAssetIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_ASC',
  LbppoolAssetsDataByPoolIdVarianceSampleAssetIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_DESC',
  LbppoolAssetsDataByPoolIdVarianceSampleBalancesAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_ASC',
  LbppoolAssetsDataByPoolIdVarianceSampleBalancesDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_DESC',
  LbppoolAssetsDataByPoolIdVarianceSampleIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_ASC',
  LbppoolAssetsDataByPoolIdVarianceSampleIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_DESC',
  LbppoolAssetsDataByPoolIdVarianceSampleParaBlockHeightAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  LbppoolAssetsDataByPoolIdVarianceSampleParaBlockHeightDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  LbppoolAssetsDataByPoolIdVarianceSamplePoolIdAsc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_ASC',
  LbppoolAssetsDataByPoolIdVarianceSamplePoolIdDesc = 'LBPPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_DESC',
  Natural = 'NATURAL',
  OwnerAsc = 'OWNER_ASC',
  OwnerDesc = 'OWNER_DESC',
  ParaBlockHeightAsc = 'PARA_BLOCK_HEIGHT_ASC',
  ParaBlockHeightDesc = 'PARA_BLOCK_HEIGHT_DESC',
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

export type MinifiedDataStructure = {
  __typename?: 'MinifiedDataStructure';
  d: Array<Scalars['String']['output']>;
  t: MinifiedDataStructureTypeName;
};

export enum MinifiedDataStructureTypeName {
  AccountBalances = 'AccountBalances',
  AssetDynamicFee = 'AssetDynamicFee',
  OmnipoolAssetState = 'OmnipoolAssetState'
}

export type Omnipool = {
  __typename?: 'Omnipool';
  hubAssetTradability: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `OmnipoolAssetDatum`. */
  omnipoolAssetDataByPoolId: OmnipoolAssetDataConnection;
  paraBlockHeight: Scalars['Int']['output'];
  poolAddress: Scalars['String']['output'];
};


export type OmnipoolOmnipoolAssetDataByPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<OmnipoolAssetDatumCondition>;
  filter?: InputMaybe<OmnipoolAssetDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<OmnipoolAssetDataOrderBy>>;
};

export type OmnipoolAggregates = {
  __typename?: 'OmnipoolAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<OmnipoolAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<OmnipoolDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<OmnipoolMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<OmnipoolMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<OmnipoolStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<OmnipoolStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<OmnipoolSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<OmnipoolVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<OmnipoolVarianceSampleAggregates>;
};

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
  ParaBlockHeight = 'PARA_BLOCK_HEIGHT',
  PoolId = 'POOL_ID'
}

export type OmnipoolAssetDataHavingAverageInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingDistinctCountInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
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
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingMinInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingStddevPopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingStddevSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingSumInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingVariancePopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolAssetDataHavingVarianceSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
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
  ParaBlockHeightAsc = 'PARA_BLOCK_HEIGHT_ASC',
  ParaBlockHeightDesc = 'PARA_BLOCK_HEIGHT_DESC',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type OmnipoolAssetDatum = {
  __typename?: 'OmnipoolAssetDatum';
  assetId: Scalars['Int']['output'];
  assetState: Scalars['JSON']['output'];
  balances: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  paraBlockHeight: Scalars['Int']['output'];
  /** Reads a single `Omnipool` that is related to this `OmnipoolAssetDatum`. */
  pool?: Maybe<Omnipool>;
  poolId?: Maybe<Scalars['String']['output']>;
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
  /** Mean average of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
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
  /** Checks for equality with the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolId` field. */
  poolId?: InputMaybe<Scalars['String']['input']>;
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
  /** Distinct count of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
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
  /** Filter by the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
};

export type OmnipoolAssetDatumMaxAggregates = {
  __typename?: 'OmnipoolAssetDatumMaxAggregates';
  /** Maximum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type OmnipoolAssetDatumMinAggregates = {
  __typename?: 'OmnipoolAssetDatumMinAggregates';
  /** Minimum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type OmnipoolAssetDatumStddevPopulationAggregates = {
  __typename?: 'OmnipoolAssetDatumStddevPopulationAggregates';
  /** Population standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type OmnipoolAssetDatumStddevSampleAggregates = {
  __typename?: 'OmnipoolAssetDatumStddevSampleAggregates';
  /** Sample standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type OmnipoolAssetDatumSumAggregates = {
  __typename?: 'OmnipoolAssetDatumSumAggregates';
  /** Sum of assetId across the matching connection */
  assetId: Scalars['BigInt']['output'];
  /** Sum of paraBlockHeight across the matching connection */
  paraBlockHeight: Scalars['BigInt']['output'];
};

export type OmnipoolAssetDatumVariancePopulationAggregates = {
  __typename?: 'OmnipoolAssetDatumVariancePopulationAggregates';
  /** Population variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type OmnipoolAssetDatumVarianceSampleAggregates = {
  __typename?: 'OmnipoolAssetDatumVarianceSampleAggregates';
  /** Sample variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type OmnipoolAssetState = {
  __typename?: 'OmnipoolAssetState';
  cap: Scalars['String']['output'];
  hubReserve: Scalars['String']['output'];
  protocolShares: Scalars['String']['output'];
  shares: Scalars['String']['output'];
  tradable?: Maybe<Tradability>;
};

export type OmnipoolAverageAggregates = {
  __typename?: 'OmnipoolAverageAggregates';
  /** Mean average of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `Omnipool` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type OmnipoolCondition = {
  /** Checks for equality with the object’s `hubAssetTradability` field. */
  hubAssetTradability?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<Scalars['String']['input']>;
};

export type OmnipoolDistinctCountAggregates = {
  __typename?: 'OmnipoolDistinctCountAggregates';
  /** Distinct count of hubAssetTradability across the matching connection */
  hubAssetTradability?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolAddress across the matching connection */
  poolAddress?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Omnipool` object types. All fields are combined with a logical ‘and.’ */
export type OmnipoolFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<OmnipoolFilter>>;
  /** Filter by the object’s `hubAssetTradability` field. */
  hubAssetTradability?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<OmnipoolFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<OmnipoolFilter>>;
  /** Filter by the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<StringFilter>;
};

/** Grouping methods for `Omnipool` for usage during aggregation. */
export enum OmnipoolGroupBy {
  HubAssetTradability = 'HUB_ASSET_TRADABILITY',
  ParaBlockHeight = 'PARA_BLOCK_HEIGHT',
  PoolAddress = 'POOL_ADDRESS'
}

export type OmnipoolHavingAverageInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolHavingDistinctCountInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `Omnipool` aggregates. */
export type OmnipoolHavingInput = {
  AND?: InputMaybe<Array<OmnipoolHavingInput>>;
  OR?: InputMaybe<Array<OmnipoolHavingInput>>;
  average?: InputMaybe<OmnipoolHavingAverageInput>;
  distinctCount?: InputMaybe<OmnipoolHavingDistinctCountInput>;
  max?: InputMaybe<OmnipoolHavingMaxInput>;
  min?: InputMaybe<OmnipoolHavingMinInput>;
  stddevPopulation?: InputMaybe<OmnipoolHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<OmnipoolHavingStddevSampleInput>;
  sum?: InputMaybe<OmnipoolHavingSumInput>;
  variancePopulation?: InputMaybe<OmnipoolHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<OmnipoolHavingVarianceSampleInput>;
};

export type OmnipoolHavingMaxInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolHavingMinInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolHavingStddevPopulationInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolHavingStddevSampleInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolHavingSumInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolHavingVariancePopulationInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolHavingVarianceSampleInput = {
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type OmnipoolMaxAggregates = {
  __typename?: 'OmnipoolMaxAggregates';
  /** Maximum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type OmnipoolMinAggregates = {
  __typename?: 'OmnipoolMinAggregates';
  /** Minimum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type OmnipoolStddevPopulationAggregates = {
  __typename?: 'OmnipoolStddevPopulationAggregates';
  /** Population standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type OmnipoolStddevSampleAggregates = {
  __typename?: 'OmnipoolStddevSampleAggregates';
  /** Sample standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type OmnipoolSumAggregates = {
  __typename?: 'OmnipoolSumAggregates';
  /** Sum of paraBlockHeight across the matching connection */
  paraBlockHeight: Scalars['BigInt']['output'];
};

export type OmnipoolVariancePopulationAggregates = {
  __typename?: 'OmnipoolVariancePopulationAggregates';
  /** Population variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type OmnipoolVarianceSampleAggregates = {
  __typename?: 'OmnipoolVarianceSampleAggregates';
  /** Sample variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Omnipool` values. */
export type OmnipoolsConnection = {
  __typename?: 'OmnipoolsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<OmnipoolAggregates>;
  /** A list of edges which contains the `Omnipool` and cursor to aid in pagination. */
  edges: Array<OmnipoolsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<OmnipoolAggregates>>;
  /** A list of `Omnipool` objects. */
  nodes: Array<Maybe<Omnipool>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Omnipool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Omnipool` values. */
export type OmnipoolsConnectionGroupedAggregatesArgs = {
  groupBy: Array<OmnipoolGroupBy>;
  having?: InputMaybe<OmnipoolHavingInput>;
};

/** A `Omnipool` edge in the connection. */
export type OmnipoolsEdge = {
  __typename?: 'OmnipoolsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Omnipool` at the end of the edge. */
  node?: Maybe<Omnipool>;
};

/** Methods to use when ordering `Omnipool`. */
export enum OmnipoolsOrderBy {
  HubAssetTradabilityAsc = 'HUB_ASSET_TRADABILITY_ASC',
  HubAssetTradabilityDesc = 'HUB_ASSET_TRADABILITY_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  OmnipoolAssetDataByPoolIdAverageAssetIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_ASC',
  OmnipoolAssetDataByPoolIdAverageAssetIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_DESC',
  OmnipoolAssetDataByPoolIdAverageAssetStateAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_ASSET_STATE_ASC',
  OmnipoolAssetDataByPoolIdAverageAssetStateDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_ASSET_STATE_DESC',
  OmnipoolAssetDataByPoolIdAverageBalancesAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_BALANCES_ASC',
  OmnipoolAssetDataByPoolIdAverageBalancesDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_BALANCES_DESC',
  OmnipoolAssetDataByPoolIdAverageIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_ID_ASC',
  OmnipoolAssetDataByPoolIdAverageIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_ID_DESC',
  OmnipoolAssetDataByPoolIdAverageParaBlockHeightAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_PARA_BLOCK_HEIGHT_ASC',
  OmnipoolAssetDataByPoolIdAverageParaBlockHeightDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_PARA_BLOCK_HEIGHT_DESC',
  OmnipoolAssetDataByPoolIdAveragePoolIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_POOL_ID_ASC',
  OmnipoolAssetDataByPoolIdAveragePoolIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_AVERAGE_POOL_ID_DESC',
  OmnipoolAssetDataByPoolIdCountAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_COUNT_ASC',
  OmnipoolAssetDataByPoolIdCountDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_COUNT_DESC',
  OmnipoolAssetDataByPoolIdDistinctCountAssetIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_ASC',
  OmnipoolAssetDataByPoolIdDistinctCountAssetIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_DESC',
  OmnipoolAssetDataByPoolIdDistinctCountAssetStateAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_STATE_ASC',
  OmnipoolAssetDataByPoolIdDistinctCountAssetStateDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_STATE_DESC',
  OmnipoolAssetDataByPoolIdDistinctCountBalancesAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_ASC',
  OmnipoolAssetDataByPoolIdDistinctCountBalancesDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_DESC',
  OmnipoolAssetDataByPoolIdDistinctCountIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_ASC',
  OmnipoolAssetDataByPoolIdDistinctCountIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_DESC',
  OmnipoolAssetDataByPoolIdDistinctCountParaBlockHeightAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_ASC',
  OmnipoolAssetDataByPoolIdDistinctCountParaBlockHeightDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_DESC',
  OmnipoolAssetDataByPoolIdDistinctCountPoolIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_ASC',
  OmnipoolAssetDataByPoolIdDistinctCountPoolIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_DESC',
  OmnipoolAssetDataByPoolIdMaxAssetIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MAX_ASSET_ID_ASC',
  OmnipoolAssetDataByPoolIdMaxAssetIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MAX_ASSET_ID_DESC',
  OmnipoolAssetDataByPoolIdMaxAssetStateAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MAX_ASSET_STATE_ASC',
  OmnipoolAssetDataByPoolIdMaxAssetStateDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MAX_ASSET_STATE_DESC',
  OmnipoolAssetDataByPoolIdMaxBalancesAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MAX_BALANCES_ASC',
  OmnipoolAssetDataByPoolIdMaxBalancesDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MAX_BALANCES_DESC',
  OmnipoolAssetDataByPoolIdMaxIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MAX_ID_ASC',
  OmnipoolAssetDataByPoolIdMaxIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MAX_ID_DESC',
  OmnipoolAssetDataByPoolIdMaxParaBlockHeightAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MAX_PARA_BLOCK_HEIGHT_ASC',
  OmnipoolAssetDataByPoolIdMaxParaBlockHeightDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MAX_PARA_BLOCK_HEIGHT_DESC',
  OmnipoolAssetDataByPoolIdMaxPoolIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MAX_POOL_ID_ASC',
  OmnipoolAssetDataByPoolIdMaxPoolIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MAX_POOL_ID_DESC',
  OmnipoolAssetDataByPoolIdMinAssetIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MIN_ASSET_ID_ASC',
  OmnipoolAssetDataByPoolIdMinAssetIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MIN_ASSET_ID_DESC',
  OmnipoolAssetDataByPoolIdMinAssetStateAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MIN_ASSET_STATE_ASC',
  OmnipoolAssetDataByPoolIdMinAssetStateDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MIN_ASSET_STATE_DESC',
  OmnipoolAssetDataByPoolIdMinBalancesAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MIN_BALANCES_ASC',
  OmnipoolAssetDataByPoolIdMinBalancesDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MIN_BALANCES_DESC',
  OmnipoolAssetDataByPoolIdMinIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MIN_ID_ASC',
  OmnipoolAssetDataByPoolIdMinIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MIN_ID_DESC',
  OmnipoolAssetDataByPoolIdMinParaBlockHeightAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MIN_PARA_BLOCK_HEIGHT_ASC',
  OmnipoolAssetDataByPoolIdMinParaBlockHeightDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MIN_PARA_BLOCK_HEIGHT_DESC',
  OmnipoolAssetDataByPoolIdMinPoolIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MIN_POOL_ID_ASC',
  OmnipoolAssetDataByPoolIdMinPoolIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_MIN_POOL_ID_DESC',
  OmnipoolAssetDataByPoolIdStddevPopulationAssetIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_ASC',
  OmnipoolAssetDataByPoolIdStddevPopulationAssetIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_DESC',
  OmnipoolAssetDataByPoolIdStddevPopulationAssetStateAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_STATE_ASC',
  OmnipoolAssetDataByPoolIdStddevPopulationAssetStateDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_STATE_DESC',
  OmnipoolAssetDataByPoolIdStddevPopulationBalancesAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_ASC',
  OmnipoolAssetDataByPoolIdStddevPopulationBalancesDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_DESC',
  OmnipoolAssetDataByPoolIdStddevPopulationIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_ASC',
  OmnipoolAssetDataByPoolIdStddevPopulationIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_DESC',
  OmnipoolAssetDataByPoolIdStddevPopulationParaBlockHeightAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  OmnipoolAssetDataByPoolIdStddevPopulationParaBlockHeightDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  OmnipoolAssetDataByPoolIdStddevPopulationPoolIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_ASC',
  OmnipoolAssetDataByPoolIdStddevPopulationPoolIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_DESC',
  OmnipoolAssetDataByPoolIdStddevSampleAssetIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_ASC',
  OmnipoolAssetDataByPoolIdStddevSampleAssetIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_DESC',
  OmnipoolAssetDataByPoolIdStddevSampleAssetStateAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_STATE_ASC',
  OmnipoolAssetDataByPoolIdStddevSampleAssetStateDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_STATE_DESC',
  OmnipoolAssetDataByPoolIdStddevSampleBalancesAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_ASC',
  OmnipoolAssetDataByPoolIdStddevSampleBalancesDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_DESC',
  OmnipoolAssetDataByPoolIdStddevSampleIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_ASC',
  OmnipoolAssetDataByPoolIdStddevSampleIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_DESC',
  OmnipoolAssetDataByPoolIdStddevSampleParaBlockHeightAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  OmnipoolAssetDataByPoolIdStddevSampleParaBlockHeightDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  OmnipoolAssetDataByPoolIdStddevSamplePoolIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_ASC',
  OmnipoolAssetDataByPoolIdStddevSamplePoolIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_DESC',
  OmnipoolAssetDataByPoolIdSumAssetIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_SUM_ASSET_ID_ASC',
  OmnipoolAssetDataByPoolIdSumAssetIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_SUM_ASSET_ID_DESC',
  OmnipoolAssetDataByPoolIdSumAssetStateAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_SUM_ASSET_STATE_ASC',
  OmnipoolAssetDataByPoolIdSumAssetStateDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_SUM_ASSET_STATE_DESC',
  OmnipoolAssetDataByPoolIdSumBalancesAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_SUM_BALANCES_ASC',
  OmnipoolAssetDataByPoolIdSumBalancesDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_SUM_BALANCES_DESC',
  OmnipoolAssetDataByPoolIdSumIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_SUM_ID_ASC',
  OmnipoolAssetDataByPoolIdSumIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_SUM_ID_DESC',
  OmnipoolAssetDataByPoolIdSumParaBlockHeightAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_SUM_PARA_BLOCK_HEIGHT_ASC',
  OmnipoolAssetDataByPoolIdSumParaBlockHeightDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_SUM_PARA_BLOCK_HEIGHT_DESC',
  OmnipoolAssetDataByPoolIdSumPoolIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_SUM_POOL_ID_ASC',
  OmnipoolAssetDataByPoolIdSumPoolIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_SUM_POOL_ID_DESC',
  OmnipoolAssetDataByPoolIdVariancePopulationAssetIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_ASC',
  OmnipoolAssetDataByPoolIdVariancePopulationAssetIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_DESC',
  OmnipoolAssetDataByPoolIdVariancePopulationAssetStateAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_STATE_ASC',
  OmnipoolAssetDataByPoolIdVariancePopulationAssetStateDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_STATE_DESC',
  OmnipoolAssetDataByPoolIdVariancePopulationBalancesAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_ASC',
  OmnipoolAssetDataByPoolIdVariancePopulationBalancesDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_DESC',
  OmnipoolAssetDataByPoolIdVariancePopulationIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_ASC',
  OmnipoolAssetDataByPoolIdVariancePopulationIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_DESC',
  OmnipoolAssetDataByPoolIdVariancePopulationParaBlockHeightAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  OmnipoolAssetDataByPoolIdVariancePopulationParaBlockHeightDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  OmnipoolAssetDataByPoolIdVariancePopulationPoolIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_ASC',
  OmnipoolAssetDataByPoolIdVariancePopulationPoolIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_DESC',
  OmnipoolAssetDataByPoolIdVarianceSampleAssetIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_ASC',
  OmnipoolAssetDataByPoolIdVarianceSampleAssetIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_DESC',
  OmnipoolAssetDataByPoolIdVarianceSampleAssetStateAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_STATE_ASC',
  OmnipoolAssetDataByPoolIdVarianceSampleAssetStateDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_STATE_DESC',
  OmnipoolAssetDataByPoolIdVarianceSampleBalancesAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_ASC',
  OmnipoolAssetDataByPoolIdVarianceSampleBalancesDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_DESC',
  OmnipoolAssetDataByPoolIdVarianceSampleIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_ASC',
  OmnipoolAssetDataByPoolIdVarianceSampleIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_DESC',
  OmnipoolAssetDataByPoolIdVarianceSampleParaBlockHeightAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  OmnipoolAssetDataByPoolIdVarianceSampleParaBlockHeightDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  OmnipoolAssetDataByPoolIdVarianceSamplePoolIdAsc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_ASC',
  OmnipoolAssetDataByPoolIdVarianceSamplePoolIdDesc = 'OMNIPOOL_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_DESC',
  ParaBlockHeightAsc = 'PARA_BLOCK_HEIGHT_ASC',
  ParaBlockHeightDesc = 'PARA_BLOCK_HEIGHT_DESC',
  PoolAddressAsc = 'POOL_ADDRESS_ASC',
  PoolAddressDesc = 'POOL_ADDRESS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

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
  aavepool?: Maybe<Aavepool>;
  /** Reads and enables pagination through a set of `Aavepool`. */
  aavepools?: Maybe<AavepoolsConnection>;
  asset?: Maybe<Asset>;
  /** Reads and enables pagination through a set of `AssetHistoricalDatum`. */
  assetHistoricalData?: Maybe<AssetHistoricalDataConnection>;
  assetHistoricalDatum?: Maybe<AssetHistoricalDatum>;
  /** Reads and enables pagination through a set of `Asset`. */
  assets?: Maybe<AssetsConnection>;
  block?: Maybe<Block>;
  /** Reads and enables pagination through a set of `BlockCompressedDatum`. */
  blockCompressedData?: Maybe<BlockCompressedDataConnection>;
  blockCompressedDatum?: Maybe<BlockCompressedDatum>;
  /** Reads and enables pagination through a set of `Block`. */
  blocks?: Maybe<BlocksConnection>;
  dataStructureType?: Maybe<DataStructureType>;
  /** Reads and enables pagination through a set of `DataStructureType`. */
  dataStructureTypes?: Maybe<DataStructureTypesConnection>;
  emaOracle?: Maybe<EmaOracle>;
  /** Reads and enables pagination through a set of `EmaOracle`. */
  emaOracles?: Maybe<EmaOraclesConnection>;
  lbppool?: Maybe<Lbppool>;
  /** Reads and enables pagination through a set of `LbppoolAssetsDatum`. */
  lbppoolAssetsData?: Maybe<LbppoolAssetsDataConnection>;
  lbppoolAssetsDatum?: Maybe<LbppoolAssetsDatum>;
  /** Reads and enables pagination through a set of `Lbppool`. */
  lbppools?: Maybe<LbppoolsConnection>;
  migration?: Maybe<Migration>;
  /** Reads and enables pagination through a set of `Migration`. */
  migrations?: Maybe<MigrationsConnection>;
  omnipool?: Maybe<Omnipool>;
  /** Reads and enables pagination through a set of `OmnipoolAssetDatum`. */
  omnipoolAssetData?: Maybe<OmnipoolAssetDataConnection>;
  omnipoolAssetDatum?: Maybe<OmnipoolAssetDatum>;
  /** Reads and enables pagination through a set of `Omnipool`. */
  omnipools?: Maybe<OmnipoolsConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  stableswap?: Maybe<Stableswap>;
  /** Reads and enables pagination through a set of `StableswapAssetDatum`. */
  stableswapAssetData?: Maybe<StableswapAssetDataConnection>;
  stableswapAssetDatum?: Maybe<StableswapAssetDatum>;
  /** Reads and enables pagination through a set of `Stableswap`. */
  stableswaps?: Maybe<StableswapsConnection>;
  subProcessorStatus?: Maybe<SubProcessorStatus>;
  /** Reads and enables pagination through a set of `SubProcessorStatus`. */
  subProcessorStatuses?: Maybe<SubProcessorStatusesConnection>;
  xykpool?: Maybe<Xykpool>;
  /** Reads and enables pagination through a set of `XykpoolAssetsDatum`. */
  xykpoolAssetsData?: Maybe<XykpoolAssetsDataConnection>;
  xykpoolAssetsDatum?: Maybe<XykpoolAssetsDatum>;
  /** Reads and enables pagination through a set of `Xykpool`. */
  xykpools?: Maybe<XykpoolsConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAavepoolArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAavepoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AavepoolCondition>;
  filter?: InputMaybe<AavepoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AavepoolsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAssetArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAssetHistoricalDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AssetHistoricalDatumCondition>;
  filter?: InputMaybe<AssetHistoricalDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AssetHistoricalDataOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAssetHistoricalDatumArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAssetsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AssetCondition>;
  filter?: InputMaybe<AssetFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AssetsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryBlockArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryBlockCompressedDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<BlockCompressedDatumCondition>;
  filter?: InputMaybe<BlockCompressedDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BlockCompressedDataOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryBlockCompressedDatumArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryBlocksArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<BlockCondition>;
  filter?: InputMaybe<BlockFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BlocksOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryDataStructureTypeArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryDataStructureTypesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<DataStructureTypeCondition>;
  filter?: InputMaybe<DataStructureTypeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DataStructureTypesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryEmaOracleArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEmaOraclesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EmaOracleCondition>;
  filter?: InputMaybe<EmaOracleFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EmaOraclesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryLbppoolArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryLbppoolAssetsDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<LbppoolAssetsDatumCondition>;
  filter?: InputMaybe<LbppoolAssetsDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LbppoolAssetsDataOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryLbppoolAssetsDatumArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryLbppoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<LbppoolCondition>;
  filter?: InputMaybe<LbppoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LbppoolsOrderBy>>;
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
export type QueryOmnipoolArgs = {
  id: Scalars['String']['input'];
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
export type QueryOmnipoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<OmnipoolCondition>;
  filter?: InputMaybe<OmnipoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<OmnipoolsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryStableswapArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryStableswapAssetDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<StableswapAssetDatumCondition>;
  filter?: InputMaybe<StableswapAssetDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<StableswapAssetDataOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryStableswapAssetDatumArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryStableswapsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<StableswapCondition>;
  filter?: InputMaybe<StableswapFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<StableswapsOrderBy>>;
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
export type QueryXykpoolArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryXykpoolAssetsDataArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<XykpoolAssetsDatumCondition>;
  filter?: InputMaybe<XykpoolAssetsDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<XykpoolAssetsDataOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryXykpoolAssetsDatumArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryXykpoolsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<XykpoolCondition>;
  filter?: InputMaybe<XykpoolFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<XykpoolsOrderBy>>;
};

export type SquidStatusSubscriptionPayload = {
  __typename?: 'SquidStatusSubscriptionPayload';
  event: Scalars['String']['output'];
  node: _ProcessorStatus;
};

export type Stableswap = {
  __typename?: 'Stableswap';
  fee: Scalars['Int']['output'];
  finalAmplification: Scalars['Int']['output'];
  finalBlock: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  initialAmplification: Scalars['Int']['output'];
  initialBlock: Scalars['Int']['output'];
  maxPegUpdate?: Maybe<Scalars['Int']['output']>;
  paraBlockHeight: Scalars['Int']['output'];
  pegSources?: Maybe<Scalars['JSON']['output']>;
  pegs: Scalars['JSON']['output'];
  poolAddress: Scalars['String']['output'];
  poolId: Scalars['Int']['output'];
  /** Reads and enables pagination through a set of `StableswapAssetDatum`. */
  stableswapAssetDataByPoolId: StableswapAssetDataConnection;
};


export type StableswapStableswapAssetDataByPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<StableswapAssetDatumCondition>;
  filter?: InputMaybe<StableswapAssetDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<StableswapAssetDataOrderBy>>;
};

export type StableswapAggregates = {
  __typename?: 'StableswapAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<StableswapAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<StableswapDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<StableswapMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<StableswapMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<StableswapStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<StableswapStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<StableswapSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<StableswapVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<StableswapVarianceSampleAggregates>;
};

/** A connection to a list of `StableswapAssetDatum` values. */
export type StableswapAssetDataConnection = {
  __typename?: 'StableswapAssetDataConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<StableswapAssetDatumAggregates>;
  /** A list of edges which contains the `StableswapAssetDatum` and cursor to aid in pagination. */
  edges: Array<StableswapAssetDataEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<StableswapAssetDatumAggregates>>;
  /** A list of `StableswapAssetDatum` objects. */
  nodes: Array<Maybe<StableswapAssetDatum>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `StableswapAssetDatum` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `StableswapAssetDatum` values. */
export type StableswapAssetDataConnectionGroupedAggregatesArgs = {
  groupBy: Array<StableswapAssetDataGroupBy>;
  having?: InputMaybe<StableswapAssetDataHavingInput>;
};

/** A `StableswapAssetDatum` edge in the connection. */
export type StableswapAssetDataEdge = {
  __typename?: 'StableswapAssetDataEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `StableswapAssetDatum` at the end of the edge. */
  node?: Maybe<StableswapAssetDatum>;
};

/** Grouping methods for `StableswapAssetDatum` for usage during aggregation. */
export enum StableswapAssetDataGroupBy {
  AssetId = 'ASSET_ID',
  Balances = 'BALANCES',
  ParaBlockHeight = 'PARA_BLOCK_HEIGHT',
  PoolId = 'POOL_ID',
  Tradable = 'TRADABLE'
}

export type StableswapAssetDataHavingAverageInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StableswapAssetDataHavingDistinctCountInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `StableswapAssetDatum` aggregates. */
export type StableswapAssetDataHavingInput = {
  AND?: InputMaybe<Array<StableswapAssetDataHavingInput>>;
  OR?: InputMaybe<Array<StableswapAssetDataHavingInput>>;
  average?: InputMaybe<StableswapAssetDataHavingAverageInput>;
  distinctCount?: InputMaybe<StableswapAssetDataHavingDistinctCountInput>;
  max?: InputMaybe<StableswapAssetDataHavingMaxInput>;
  min?: InputMaybe<StableswapAssetDataHavingMinInput>;
  stddevPopulation?: InputMaybe<StableswapAssetDataHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<StableswapAssetDataHavingStddevSampleInput>;
  sum?: InputMaybe<StableswapAssetDataHavingSumInput>;
  variancePopulation?: InputMaybe<StableswapAssetDataHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<StableswapAssetDataHavingVarianceSampleInput>;
};

export type StableswapAssetDataHavingMaxInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StableswapAssetDataHavingMinInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StableswapAssetDataHavingStddevPopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StableswapAssetDataHavingStddevSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StableswapAssetDataHavingSumInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StableswapAssetDataHavingVariancePopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type StableswapAssetDataHavingVarianceSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Methods to use when ordering `StableswapAssetDatum`. */
export enum StableswapAssetDataOrderBy {
  AssetIdAsc = 'ASSET_ID_ASC',
  AssetIdDesc = 'ASSET_ID_DESC',
  BalancesAsc = 'BALANCES_ASC',
  BalancesDesc = 'BALANCES_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  ParaBlockHeightAsc = 'PARA_BLOCK_HEIGHT_ASC',
  ParaBlockHeightDesc = 'PARA_BLOCK_HEIGHT_DESC',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TradableAsc = 'TRADABLE_ASC',
  TradableDesc = 'TRADABLE_DESC'
}

export type StableswapAssetDatum = {
  __typename?: 'StableswapAssetDatum';
  assetId: Scalars['Int']['output'];
  balances: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  paraBlockHeight: Scalars['Int']['output'];
  /** Reads a single `Stableswap` that is related to this `StableswapAssetDatum`. */
  pool?: Maybe<Stableswap>;
  poolId?: Maybe<Scalars['String']['output']>;
  tradable?: Maybe<Scalars['JSON']['output']>;
};

export type StableswapAssetDatumAggregates = {
  __typename?: 'StableswapAssetDatumAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<StableswapAssetDatumAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<StableswapAssetDatumDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<StableswapAssetDatumMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<StableswapAssetDatumMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<StableswapAssetDatumStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<StableswapAssetDatumStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<StableswapAssetDatumSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<StableswapAssetDatumVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<StableswapAssetDatumVarianceSampleAggregates>;
};

export type StableswapAssetDatumAverageAggregates = {
  __typename?: 'StableswapAssetDatumAverageAggregates';
  /** Mean average of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `StableswapAssetDatum` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type StableswapAssetDatumCondition = {
  /** Checks for equality with the object’s `assetId` field. */
  assetId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `balances` field. */
  balances?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolId` field. */
  poolId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `tradable` field. */
  tradable?: InputMaybe<Scalars['JSON']['input']>;
};

export type StableswapAssetDatumDistinctCountAggregates = {
  __typename?: 'StableswapAssetDatumDistinctCountAggregates';
  /** Distinct count of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of balances across the matching connection */
  balances?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of tradable across the matching connection */
  tradable?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `StableswapAssetDatum` object types. All fields are combined with a logical ‘and.’ */
export type StableswapAssetDatumFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<StableswapAssetDatumFilter>>;
  /** Filter by the object’s `assetId` field. */
  assetId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `balances` field. */
  balances?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<StableswapAssetDatumFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<StableswapAssetDatumFilter>>;
  /** Filter by the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tradable` field. */
  tradable?: InputMaybe<JsonFilter>;
};

export type StableswapAssetDatumMaxAggregates = {
  __typename?: 'StableswapAssetDatumMaxAggregates';
  /** Maximum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type StableswapAssetDatumMinAggregates = {
  __typename?: 'StableswapAssetDatumMinAggregates';
  /** Minimum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type StableswapAssetDatumStddevPopulationAggregates = {
  __typename?: 'StableswapAssetDatumStddevPopulationAggregates';
  /** Population standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type StableswapAssetDatumStddevSampleAggregates = {
  __typename?: 'StableswapAssetDatumStddevSampleAggregates';
  /** Sample standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type StableswapAssetDatumSumAggregates = {
  __typename?: 'StableswapAssetDatumSumAggregates';
  /** Sum of assetId across the matching connection */
  assetId: Scalars['BigInt']['output'];
  /** Sum of paraBlockHeight across the matching connection */
  paraBlockHeight: Scalars['BigInt']['output'];
};

export type StableswapAssetDatumVariancePopulationAggregates = {
  __typename?: 'StableswapAssetDatumVariancePopulationAggregates';
  /** Population variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type StableswapAssetDatumVarianceSampleAggregates = {
  __typename?: 'StableswapAssetDatumVarianceSampleAggregates';
  /** Sample variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type StableswapAverageAggregates = {
  __typename?: 'StableswapAverageAggregates';
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
  /** Mean average of maxPegUpdate across the matching connection */
  maxPegUpdate?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `Stableswap` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type StableswapCondition = {
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
  /** Checks for equality with the object’s `maxPegUpdate` field. */
  maxPegUpdate?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `pegSources` field. */
  pegSources?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `pegs` field. */
  pegs?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `poolId` field. */
  poolId?: InputMaybe<Scalars['Int']['input']>;
};

export type StableswapDistinctCountAggregates = {
  __typename?: 'StableswapDistinctCountAggregates';
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
  /** Distinct count of maxPegUpdate across the matching connection */
  maxPegUpdate?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of pegSources across the matching connection */
  pegSources?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of pegs across the matching connection */
  pegs?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolAddress across the matching connection */
  poolAddress?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Stableswap` object types. All fields are combined with a logical ‘and.’ */
export type StableswapFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<StableswapFilter>>;
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
  /** Filter by the object’s `maxPegUpdate` field. */
  maxPegUpdate?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<StableswapFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<StableswapFilter>>;
  /** Filter by the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `pegSources` field. */
  pegSources?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `pegs` field. */
  pegs?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<StringFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<IntFilter>;
};

/** Grouping methods for `Stableswap` for usage during aggregation. */
export enum StableswapGroupBy {
  Fee = 'FEE',
  FinalAmplification = 'FINAL_AMPLIFICATION',
  FinalBlock = 'FINAL_BLOCK',
  InitialAmplification = 'INITIAL_AMPLIFICATION',
  InitialBlock = 'INITIAL_BLOCK',
  MaxPegUpdate = 'MAX_PEG_UPDATE',
  ParaBlockHeight = 'PARA_BLOCK_HEIGHT',
  Pegs = 'PEGS',
  PegSources = 'PEG_SOURCES',
  PoolAddress = 'POOL_ADDRESS',
  PoolId = 'POOL_ID'
}

export type StableswapHavingAverageInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  maxPegUpdate?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StableswapHavingDistinctCountInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  maxPegUpdate?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `Stableswap` aggregates. */
export type StableswapHavingInput = {
  AND?: InputMaybe<Array<StableswapHavingInput>>;
  OR?: InputMaybe<Array<StableswapHavingInput>>;
  average?: InputMaybe<StableswapHavingAverageInput>;
  distinctCount?: InputMaybe<StableswapHavingDistinctCountInput>;
  max?: InputMaybe<StableswapHavingMaxInput>;
  min?: InputMaybe<StableswapHavingMinInput>;
  stddevPopulation?: InputMaybe<StableswapHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<StableswapHavingStddevSampleInput>;
  sum?: InputMaybe<StableswapHavingSumInput>;
  variancePopulation?: InputMaybe<StableswapHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<StableswapHavingVarianceSampleInput>;
};

export type StableswapHavingMaxInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  maxPegUpdate?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StableswapHavingMinInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  maxPegUpdate?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StableswapHavingStddevPopulationInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  maxPegUpdate?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StableswapHavingStddevSampleInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  maxPegUpdate?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StableswapHavingSumInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  maxPegUpdate?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StableswapHavingVariancePopulationInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  maxPegUpdate?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StableswapHavingVarianceSampleInput = {
  fee?: InputMaybe<HavingIntFilter>;
  finalAmplification?: InputMaybe<HavingIntFilter>;
  finalBlock?: InputMaybe<HavingIntFilter>;
  initialAmplification?: InputMaybe<HavingIntFilter>;
  initialBlock?: InputMaybe<HavingIntFilter>;
  maxPegUpdate?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
  poolId?: InputMaybe<HavingIntFilter>;
};

export type StableswapMaxAggregates = {
  __typename?: 'StableswapMaxAggregates';
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
  /** Maximum of maxPegUpdate across the matching connection */
  maxPegUpdate?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
  /** Maximum of poolId across the matching connection */
  poolId?: Maybe<Scalars['Int']['output']>;
};

export type StableswapMinAggregates = {
  __typename?: 'StableswapMinAggregates';
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
  /** Minimum of maxPegUpdate across the matching connection */
  maxPegUpdate?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
  /** Minimum of poolId across the matching connection */
  poolId?: Maybe<Scalars['Int']['output']>;
};

export type StableswapStddevPopulationAggregates = {
  __typename?: 'StableswapStddevPopulationAggregates';
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
  /** Population standard deviation of maxPegUpdate across the matching connection */
  maxPegUpdate?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>;
};

export type StableswapStddevSampleAggregates = {
  __typename?: 'StableswapStddevSampleAggregates';
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
  /** Sample standard deviation of maxPegUpdate across the matching connection */
  maxPegUpdate?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>;
};

export type StableswapSumAggregates = {
  __typename?: 'StableswapSumAggregates';
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
  /** Sum of maxPegUpdate across the matching connection */
  maxPegUpdate: Scalars['BigInt']['output'];
  /** Sum of paraBlockHeight across the matching connection */
  paraBlockHeight: Scalars['BigInt']['output'];
  /** Sum of poolId across the matching connection */
  poolId: Scalars['BigInt']['output'];
};

export type StableswapVariancePopulationAggregates = {
  __typename?: 'StableswapVariancePopulationAggregates';
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
  /** Population variance of maxPegUpdate across the matching connection */
  maxPegUpdate?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>;
};

export type StableswapVarianceSampleAggregates = {
  __typename?: 'StableswapVarianceSampleAggregates';
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
  /** Sample variance of maxPegUpdate across the matching connection */
  maxPegUpdate?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Stableswap` values. */
export type StableswapsConnection = {
  __typename?: 'StableswapsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<StableswapAggregates>;
  /** A list of edges which contains the `Stableswap` and cursor to aid in pagination. */
  edges: Array<StableswapsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<StableswapAggregates>>;
  /** A list of `Stableswap` objects. */
  nodes: Array<Maybe<Stableswap>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Stableswap` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Stableswap` values. */
export type StableswapsConnectionGroupedAggregatesArgs = {
  groupBy: Array<StableswapGroupBy>;
  having?: InputMaybe<StableswapHavingInput>;
};

/** A `Stableswap` edge in the connection. */
export type StableswapsEdge = {
  __typename?: 'StableswapsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Stableswap` at the end of the edge. */
  node?: Maybe<Stableswap>;
};

/** Methods to use when ordering `Stableswap`. */
export enum StableswapsOrderBy {
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
  MaxPegUpdateAsc = 'MAX_PEG_UPDATE_ASC',
  MaxPegUpdateDesc = 'MAX_PEG_UPDATE_DESC',
  Natural = 'NATURAL',
  ParaBlockHeightAsc = 'PARA_BLOCK_HEIGHT_ASC',
  ParaBlockHeightDesc = 'PARA_BLOCK_HEIGHT_DESC',
  PegsAsc = 'PEGS_ASC',
  PegsDesc = 'PEGS_DESC',
  PegSourcesAsc = 'PEG_SOURCES_ASC',
  PegSourcesDesc = 'PEG_SOURCES_DESC',
  PoolAddressAsc = 'POOL_ADDRESS_ASC',
  PoolAddressDesc = 'POOL_ADDRESS_DESC',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  StableswapAssetDataByPoolIdAverageAssetIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_ASC',
  StableswapAssetDataByPoolIdAverageAssetIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_DESC',
  StableswapAssetDataByPoolIdAverageBalancesAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_AVERAGE_BALANCES_ASC',
  StableswapAssetDataByPoolIdAverageBalancesDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_AVERAGE_BALANCES_DESC',
  StableswapAssetDataByPoolIdAverageIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_AVERAGE_ID_ASC',
  StableswapAssetDataByPoolIdAverageIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_AVERAGE_ID_DESC',
  StableswapAssetDataByPoolIdAverageParaBlockHeightAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_AVERAGE_PARA_BLOCK_HEIGHT_ASC',
  StableswapAssetDataByPoolIdAverageParaBlockHeightDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_AVERAGE_PARA_BLOCK_HEIGHT_DESC',
  StableswapAssetDataByPoolIdAveragePoolIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_AVERAGE_POOL_ID_ASC',
  StableswapAssetDataByPoolIdAveragePoolIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_AVERAGE_POOL_ID_DESC',
  StableswapAssetDataByPoolIdAverageTradableAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_AVERAGE_TRADABLE_ASC',
  StableswapAssetDataByPoolIdAverageTradableDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_AVERAGE_TRADABLE_DESC',
  StableswapAssetDataByPoolIdCountAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_COUNT_ASC',
  StableswapAssetDataByPoolIdCountDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_COUNT_DESC',
  StableswapAssetDataByPoolIdDistinctCountAssetIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_ASC',
  StableswapAssetDataByPoolIdDistinctCountAssetIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_DESC',
  StableswapAssetDataByPoolIdDistinctCountBalancesAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_ASC',
  StableswapAssetDataByPoolIdDistinctCountBalancesDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_DESC',
  StableswapAssetDataByPoolIdDistinctCountIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_ASC',
  StableswapAssetDataByPoolIdDistinctCountIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_DESC',
  StableswapAssetDataByPoolIdDistinctCountParaBlockHeightAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_ASC',
  StableswapAssetDataByPoolIdDistinctCountParaBlockHeightDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_DESC',
  StableswapAssetDataByPoolIdDistinctCountPoolIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_ASC',
  StableswapAssetDataByPoolIdDistinctCountPoolIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_DESC',
  StableswapAssetDataByPoolIdDistinctCountTradableAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_TRADABLE_ASC',
  StableswapAssetDataByPoolIdDistinctCountTradableDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_DISTINCT_COUNT_TRADABLE_DESC',
  StableswapAssetDataByPoolIdMaxAssetIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MAX_ASSET_ID_ASC',
  StableswapAssetDataByPoolIdMaxAssetIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MAX_ASSET_ID_DESC',
  StableswapAssetDataByPoolIdMaxBalancesAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MAX_BALANCES_ASC',
  StableswapAssetDataByPoolIdMaxBalancesDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MAX_BALANCES_DESC',
  StableswapAssetDataByPoolIdMaxIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MAX_ID_ASC',
  StableswapAssetDataByPoolIdMaxIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MAX_ID_DESC',
  StableswapAssetDataByPoolIdMaxParaBlockHeightAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MAX_PARA_BLOCK_HEIGHT_ASC',
  StableswapAssetDataByPoolIdMaxParaBlockHeightDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MAX_PARA_BLOCK_HEIGHT_DESC',
  StableswapAssetDataByPoolIdMaxPoolIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MAX_POOL_ID_ASC',
  StableswapAssetDataByPoolIdMaxPoolIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MAX_POOL_ID_DESC',
  StableswapAssetDataByPoolIdMaxTradableAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MAX_TRADABLE_ASC',
  StableswapAssetDataByPoolIdMaxTradableDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MAX_TRADABLE_DESC',
  StableswapAssetDataByPoolIdMinAssetIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MIN_ASSET_ID_ASC',
  StableswapAssetDataByPoolIdMinAssetIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MIN_ASSET_ID_DESC',
  StableswapAssetDataByPoolIdMinBalancesAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MIN_BALANCES_ASC',
  StableswapAssetDataByPoolIdMinBalancesDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MIN_BALANCES_DESC',
  StableswapAssetDataByPoolIdMinIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MIN_ID_ASC',
  StableswapAssetDataByPoolIdMinIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MIN_ID_DESC',
  StableswapAssetDataByPoolIdMinParaBlockHeightAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MIN_PARA_BLOCK_HEIGHT_ASC',
  StableswapAssetDataByPoolIdMinParaBlockHeightDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MIN_PARA_BLOCK_HEIGHT_DESC',
  StableswapAssetDataByPoolIdMinPoolIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MIN_POOL_ID_ASC',
  StableswapAssetDataByPoolIdMinPoolIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MIN_POOL_ID_DESC',
  StableswapAssetDataByPoolIdMinTradableAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MIN_TRADABLE_ASC',
  StableswapAssetDataByPoolIdMinTradableDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_MIN_TRADABLE_DESC',
  StableswapAssetDataByPoolIdStddevPopulationAssetIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_ASC',
  StableswapAssetDataByPoolIdStddevPopulationAssetIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_DESC',
  StableswapAssetDataByPoolIdStddevPopulationBalancesAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_ASC',
  StableswapAssetDataByPoolIdStddevPopulationBalancesDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_DESC',
  StableswapAssetDataByPoolIdStddevPopulationIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_ASC',
  StableswapAssetDataByPoolIdStddevPopulationIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_DESC',
  StableswapAssetDataByPoolIdStddevPopulationParaBlockHeightAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  StableswapAssetDataByPoolIdStddevPopulationParaBlockHeightDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  StableswapAssetDataByPoolIdStddevPopulationPoolIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_ASC',
  StableswapAssetDataByPoolIdStddevPopulationPoolIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_DESC',
  StableswapAssetDataByPoolIdStddevPopulationTradableAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_TRADABLE_ASC',
  StableswapAssetDataByPoolIdStddevPopulationTradableDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_POPULATION_TRADABLE_DESC',
  StableswapAssetDataByPoolIdStddevSampleAssetIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_ASC',
  StableswapAssetDataByPoolIdStddevSampleAssetIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_DESC',
  StableswapAssetDataByPoolIdStddevSampleBalancesAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_ASC',
  StableswapAssetDataByPoolIdStddevSampleBalancesDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_DESC',
  StableswapAssetDataByPoolIdStddevSampleIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_ASC',
  StableswapAssetDataByPoolIdStddevSampleIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_DESC',
  StableswapAssetDataByPoolIdStddevSampleParaBlockHeightAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  StableswapAssetDataByPoolIdStddevSampleParaBlockHeightDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  StableswapAssetDataByPoolIdStddevSamplePoolIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_ASC',
  StableswapAssetDataByPoolIdStddevSamplePoolIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_DESC',
  StableswapAssetDataByPoolIdStddevSampleTradableAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_TRADABLE_ASC',
  StableswapAssetDataByPoolIdStddevSampleTradableDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_STDDEV_SAMPLE_TRADABLE_DESC',
  StableswapAssetDataByPoolIdSumAssetIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_SUM_ASSET_ID_ASC',
  StableswapAssetDataByPoolIdSumAssetIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_SUM_ASSET_ID_DESC',
  StableswapAssetDataByPoolIdSumBalancesAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_SUM_BALANCES_ASC',
  StableswapAssetDataByPoolIdSumBalancesDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_SUM_BALANCES_DESC',
  StableswapAssetDataByPoolIdSumIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_SUM_ID_ASC',
  StableswapAssetDataByPoolIdSumIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_SUM_ID_DESC',
  StableswapAssetDataByPoolIdSumParaBlockHeightAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_SUM_PARA_BLOCK_HEIGHT_ASC',
  StableswapAssetDataByPoolIdSumParaBlockHeightDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_SUM_PARA_BLOCK_HEIGHT_DESC',
  StableswapAssetDataByPoolIdSumPoolIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_SUM_POOL_ID_ASC',
  StableswapAssetDataByPoolIdSumPoolIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_SUM_POOL_ID_DESC',
  StableswapAssetDataByPoolIdSumTradableAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_SUM_TRADABLE_ASC',
  StableswapAssetDataByPoolIdSumTradableDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_SUM_TRADABLE_DESC',
  StableswapAssetDataByPoolIdVariancePopulationAssetIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_ASC',
  StableswapAssetDataByPoolIdVariancePopulationAssetIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_DESC',
  StableswapAssetDataByPoolIdVariancePopulationBalancesAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_ASC',
  StableswapAssetDataByPoolIdVariancePopulationBalancesDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_DESC',
  StableswapAssetDataByPoolIdVariancePopulationIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_ASC',
  StableswapAssetDataByPoolIdVariancePopulationIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_DESC',
  StableswapAssetDataByPoolIdVariancePopulationParaBlockHeightAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  StableswapAssetDataByPoolIdVariancePopulationParaBlockHeightDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  StableswapAssetDataByPoolIdVariancePopulationPoolIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_ASC',
  StableswapAssetDataByPoolIdVariancePopulationPoolIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_DESC',
  StableswapAssetDataByPoolIdVariancePopulationTradableAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_TRADABLE_ASC',
  StableswapAssetDataByPoolIdVariancePopulationTradableDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_POPULATION_TRADABLE_DESC',
  StableswapAssetDataByPoolIdVarianceSampleAssetIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_ASC',
  StableswapAssetDataByPoolIdVarianceSampleAssetIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_DESC',
  StableswapAssetDataByPoolIdVarianceSampleBalancesAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_ASC',
  StableswapAssetDataByPoolIdVarianceSampleBalancesDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_DESC',
  StableswapAssetDataByPoolIdVarianceSampleIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_ASC',
  StableswapAssetDataByPoolIdVarianceSampleIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_DESC',
  StableswapAssetDataByPoolIdVarianceSampleParaBlockHeightAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  StableswapAssetDataByPoolIdVarianceSampleParaBlockHeightDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  StableswapAssetDataByPoolIdVarianceSamplePoolIdAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_ASC',
  StableswapAssetDataByPoolIdVarianceSamplePoolIdDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_DESC',
  StableswapAssetDataByPoolIdVarianceSampleTradableAsc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_TRADABLE_ASC',
  StableswapAssetDataByPoolIdVarianceSampleTradableDesc = 'STABLESWAP_ASSET_DATA_BY_POOL_ID_VARIANCE_SAMPLE_TRADABLE_DESC'
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
  assetsActualisedAtBlock?: Maybe<Scalars['Int']['output']>;
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
  /** Mean average of assetsActualisedAtBlock across the matching connection */
  assetsActualisedAtBlock?: Maybe<Scalars['BigFloat']['output']>;
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
  /** Checks for equality with the object’s `assetsActualisedAtBlock` field. */
  assetsActualisedAtBlock?: InputMaybe<Scalars['Int']['input']>;
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
  /** Distinct count of assetsActualisedAtBlock across the matching connection */
  assetsActualisedAtBlock?: Maybe<Scalars['BigInt']['output']>;
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
  /** Filter by the object’s `assetsActualisedAtBlock` field. */
  assetsActualisedAtBlock?: InputMaybe<IntFilter>;
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
  AssetsActualisedAtBlock = 'ASSETS_ACTUALISED_AT_BLOCK',
  FromBlock = 'FROM_BLOCK',
  Height = 'HEIGHT',
  ToBlock = 'TO_BLOCK'
}

export type SubProcessorStatusHavingAverageInput = {
  assetsActualisedAtBlock?: InputMaybe<HavingIntFilter>;
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingDistinctCountInput = {
  assetsActualisedAtBlock?: InputMaybe<HavingIntFilter>;
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
  assetsActualisedAtBlock?: InputMaybe<HavingIntFilter>;
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingMinInput = {
  assetsActualisedAtBlock?: InputMaybe<HavingIntFilter>;
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingStddevPopulationInput = {
  assetsActualisedAtBlock?: InputMaybe<HavingIntFilter>;
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingStddevSampleInput = {
  assetsActualisedAtBlock?: InputMaybe<HavingIntFilter>;
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingSumInput = {
  assetsActualisedAtBlock?: InputMaybe<HavingIntFilter>;
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingVariancePopulationInput = {
  assetsActualisedAtBlock?: InputMaybe<HavingIntFilter>;
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusHavingVarianceSampleInput = {
  assetsActualisedAtBlock?: InputMaybe<HavingIntFilter>;
  fromBlock?: InputMaybe<HavingIntFilter>;
  height?: InputMaybe<HavingIntFilter>;
  toBlock?: InputMaybe<HavingIntFilter>;
};

export type SubProcessorStatusMaxAggregates = {
  __typename?: 'SubProcessorStatusMaxAggregates';
  /** Maximum of assetsActualisedAtBlock across the matching connection */
  assetsActualisedAtBlock?: Maybe<Scalars['Int']['output']>;
  /** Maximum of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['Int']['output']>;
  /** Maximum of height across the matching connection */
  height?: Maybe<Scalars['Int']['output']>;
  /** Maximum of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['Int']['output']>;
};

export type SubProcessorStatusMinAggregates = {
  __typename?: 'SubProcessorStatusMinAggregates';
  /** Minimum of assetsActualisedAtBlock across the matching connection */
  assetsActualisedAtBlock?: Maybe<Scalars['Int']['output']>;
  /** Minimum of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['Int']['output']>;
  /** Minimum of height across the matching connection */
  height?: Maybe<Scalars['Int']['output']>;
  /** Minimum of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['Int']['output']>;
};

export type SubProcessorStatusStddevPopulationAggregates = {
  __typename?: 'SubProcessorStatusStddevPopulationAggregates';
  /** Population standard deviation of assetsActualisedAtBlock across the matching connection */
  assetsActualisedAtBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['BigFloat']['output']>;
};

export type SubProcessorStatusStddevSampleAggregates = {
  __typename?: 'SubProcessorStatusStddevSampleAggregates';
  /** Sample standard deviation of assetsActualisedAtBlock across the matching connection */
  assetsActualisedAtBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['BigFloat']['output']>;
};

export type SubProcessorStatusSumAggregates = {
  __typename?: 'SubProcessorStatusSumAggregates';
  /** Sum of assetsActualisedAtBlock across the matching connection */
  assetsActualisedAtBlock: Scalars['BigInt']['output'];
  /** Sum of fromBlock across the matching connection */
  fromBlock: Scalars['BigInt']['output'];
  /** Sum of height across the matching connection */
  height: Scalars['BigInt']['output'];
  /** Sum of toBlock across the matching connection */
  toBlock: Scalars['BigInt']['output'];
};

export type SubProcessorStatusVariancePopulationAggregates = {
  __typename?: 'SubProcessorStatusVariancePopulationAggregates';
  /** Population variance of assetsActualisedAtBlock across the matching connection */
  assetsActualisedAtBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of fromBlock across the matching connection */
  fromBlock?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of height across the matching connection */
  height?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of toBlock across the matching connection */
  toBlock?: Maybe<Scalars['BigFloat']['output']>;
};

export type SubProcessorStatusVarianceSampleAggregates = {
  __typename?: 'SubProcessorStatusVarianceSampleAggregates';
  /** Sample variance of assetsActualisedAtBlock across the matching connection */
  assetsActualisedAtBlock?: Maybe<Scalars['BigFloat']['output']>;
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
  AssetsActualisedAtBlockAsc = 'ASSETS_ACTUALISED_AT_BLOCK_ASC',
  AssetsActualisedAtBlockDesc = 'ASSETS_ACTUALISED_AT_BLOCK_DESC',
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

export type Xykpool = {
  __typename?: 'Xykpool';
  assetAId: Scalars['Int']['output'];
  assetBId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  paraBlockHeight: Scalars['Int']['output'];
  poolAddress: Scalars['String']['output'];
  shareTokenId?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `XykpoolAssetsDatum`. */
  xykpoolAssetsDataByPoolId: XykpoolAssetsDataConnection;
};


export type XykpoolXykpoolAssetsDataByPoolIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<XykpoolAssetsDatumCondition>;
  filter?: InputMaybe<XykpoolAssetsDatumFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<XykpoolAssetsDataOrderBy>>;
};

export type XykpoolAggregates = {
  __typename?: 'XykpoolAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<XykpoolAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<XykpoolDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<XykpoolMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<XykpoolMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<XykpoolStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<XykpoolStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<XykpoolSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<XykpoolVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<XykpoolVarianceSampleAggregates>;
};

/** A connection to a list of `XykpoolAssetsDatum` values. */
export type XykpoolAssetsDataConnection = {
  __typename?: 'XykpoolAssetsDataConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<XykpoolAssetsDatumAggregates>;
  /** A list of edges which contains the `XykpoolAssetsDatum` and cursor to aid in pagination. */
  edges: Array<XykpoolAssetsDataEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<XykpoolAssetsDatumAggregates>>;
  /** A list of `XykpoolAssetsDatum` objects. */
  nodes: Array<Maybe<XykpoolAssetsDatum>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `XykpoolAssetsDatum` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `XykpoolAssetsDatum` values. */
export type XykpoolAssetsDataConnectionGroupedAggregatesArgs = {
  groupBy: Array<XykpoolAssetsDataGroupBy>;
  having?: InputMaybe<XykpoolAssetsDataHavingInput>;
};

/** A `XykpoolAssetsDatum` edge in the connection. */
export type XykpoolAssetsDataEdge = {
  __typename?: 'XykpoolAssetsDataEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `XykpoolAssetsDatum` at the end of the edge. */
  node?: Maybe<XykpoolAssetsDatum>;
};

/** Grouping methods for `XykpoolAssetsDatum` for usage during aggregation. */
export enum XykpoolAssetsDataGroupBy {
  AssetId = 'ASSET_ID',
  Balances = 'BALANCES',
  ParaBlockHeight = 'PARA_BLOCK_HEIGHT',
  PoolId = 'POOL_ID'
}

export type XykpoolAssetsDataHavingAverageInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolAssetsDataHavingDistinctCountInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `XykpoolAssetsDatum` aggregates. */
export type XykpoolAssetsDataHavingInput = {
  AND?: InputMaybe<Array<XykpoolAssetsDataHavingInput>>;
  OR?: InputMaybe<Array<XykpoolAssetsDataHavingInput>>;
  average?: InputMaybe<XykpoolAssetsDataHavingAverageInput>;
  distinctCount?: InputMaybe<XykpoolAssetsDataHavingDistinctCountInput>;
  max?: InputMaybe<XykpoolAssetsDataHavingMaxInput>;
  min?: InputMaybe<XykpoolAssetsDataHavingMinInput>;
  stddevPopulation?: InputMaybe<XykpoolAssetsDataHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<XykpoolAssetsDataHavingStddevSampleInput>;
  sum?: InputMaybe<XykpoolAssetsDataHavingSumInput>;
  variancePopulation?: InputMaybe<XykpoolAssetsDataHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<XykpoolAssetsDataHavingVarianceSampleInput>;
};

export type XykpoolAssetsDataHavingMaxInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolAssetsDataHavingMinInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolAssetsDataHavingStddevPopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolAssetsDataHavingStddevSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolAssetsDataHavingSumInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolAssetsDataHavingVariancePopulationInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolAssetsDataHavingVarianceSampleInput = {
  assetId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Methods to use when ordering `XykpoolAssetsDatum`. */
export enum XykpoolAssetsDataOrderBy {
  AssetIdAsc = 'ASSET_ID_ASC',
  AssetIdDesc = 'ASSET_ID_DESC',
  BalancesAsc = 'BALANCES_ASC',
  BalancesDesc = 'BALANCES_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  ParaBlockHeightAsc = 'PARA_BLOCK_HEIGHT_ASC',
  ParaBlockHeightDesc = 'PARA_BLOCK_HEIGHT_DESC',
  PoolIdAsc = 'POOL_ID_ASC',
  PoolIdDesc = 'POOL_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type XykpoolAssetsDatum = {
  __typename?: 'XykpoolAssetsDatum';
  assetId: Scalars['Int']['output'];
  balances: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  paraBlockHeight: Scalars['Int']['output'];
  /** Reads a single `Xykpool` that is related to this `XykpoolAssetsDatum`. */
  pool?: Maybe<Xykpool>;
  poolId?: Maybe<Scalars['String']['output']>;
};

export type XykpoolAssetsDatumAggregates = {
  __typename?: 'XykpoolAssetsDatumAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<XykpoolAssetsDatumAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<XykpoolAssetsDatumDistinctCountAggregates>;
  keys?: Maybe<Array<Scalars['String']['output']>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<XykpoolAssetsDatumMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<XykpoolAssetsDatumMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<XykpoolAssetsDatumStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<XykpoolAssetsDatumStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<XykpoolAssetsDatumSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<XykpoolAssetsDatumVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<XykpoolAssetsDatumVarianceSampleAggregates>;
};

export type XykpoolAssetsDatumAverageAggregates = {
  __typename?: 'XykpoolAssetsDatumAverageAggregates';
  /** Mean average of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `XykpoolAssetsDatum` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type XykpoolAssetsDatumCondition = {
  /** Checks for equality with the object’s `assetId` field. */
  assetId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `balances` field. */
  balances?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolId` field. */
  poolId?: InputMaybe<Scalars['String']['input']>;
};

export type XykpoolAssetsDatumDistinctCountAggregates = {
  __typename?: 'XykpoolAssetsDatumDistinctCountAggregates';
  /** Distinct count of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of balances across the matching connection */
  balances?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolId across the matching connection */
  poolId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `XykpoolAssetsDatum` object types. All fields are combined with a logical ‘and.’ */
export type XykpoolAssetsDatumFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<XykpoolAssetsDatumFilter>>;
  /** Filter by the object’s `assetId` field. */
  assetId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `balances` field. */
  balances?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<XykpoolAssetsDatumFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<XykpoolAssetsDatumFilter>>;
  /** Filter by the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolId` field. */
  poolId?: InputMaybe<StringFilter>;
};

export type XykpoolAssetsDatumMaxAggregates = {
  __typename?: 'XykpoolAssetsDatumMaxAggregates';
  /** Maximum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type XykpoolAssetsDatumMinAggregates = {
  __typename?: 'XykpoolAssetsDatumMinAggregates';
  /** Minimum of assetId across the matching connection */
  assetId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type XykpoolAssetsDatumStddevPopulationAggregates = {
  __typename?: 'XykpoolAssetsDatumStddevPopulationAggregates';
  /** Population standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykpoolAssetsDatumStddevSampleAggregates = {
  __typename?: 'XykpoolAssetsDatumStddevSampleAggregates';
  /** Sample standard deviation of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykpoolAssetsDatumSumAggregates = {
  __typename?: 'XykpoolAssetsDatumSumAggregates';
  /** Sum of assetId across the matching connection */
  assetId: Scalars['BigInt']['output'];
  /** Sum of paraBlockHeight across the matching connection */
  paraBlockHeight: Scalars['BigInt']['output'];
};

export type XykpoolAssetsDatumVariancePopulationAggregates = {
  __typename?: 'XykpoolAssetsDatumVariancePopulationAggregates';
  /** Population variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykpoolAssetsDatumVarianceSampleAggregates = {
  __typename?: 'XykpoolAssetsDatumVarianceSampleAggregates';
  /** Sample variance of assetId across the matching connection */
  assetId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykpoolAverageAggregates = {
  __typename?: 'XykpoolAverageAggregates';
  /** Mean average of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/** A condition to be used against `Xykpool` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type XykpoolCondition = {
  /** Checks for equality with the object’s `assetAId` field. */
  assetAId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `assetBId` field. */
  assetBId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `shareTokenId` field. */
  shareTokenId?: InputMaybe<Scalars['String']['input']>;
};

export type XykpoolDistinctCountAggregates = {
  __typename?: 'XykpoolDistinctCountAggregates';
  /** Distinct count of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of id across the matching connection */
  id?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of poolAddress across the matching connection */
  poolAddress?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of shareTokenId across the matching connection */
  shareTokenId?: Maybe<Scalars['BigInt']['output']>;
};

/** A filter to be used against `Xykpool` object types. All fields are combined with a logical ‘and.’ */
export type XykpoolFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<XykpoolFilter>>;
  /** Filter by the object’s `assetAId` field. */
  assetAId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `assetBId` field. */
  assetBId?: InputMaybe<IntFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<XykpoolFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<XykpoolFilter>>;
  /** Filter by the object’s `paraBlockHeight` field. */
  paraBlockHeight?: InputMaybe<IntFilter>;
  /** Filter by the object’s `poolAddress` field. */
  poolAddress?: InputMaybe<StringFilter>;
  /** Filter by the object’s `shareTokenId` field. */
  shareTokenId?: InputMaybe<StringFilter>;
};

/** Grouping methods for `Xykpool` for usage during aggregation. */
export enum XykpoolGroupBy {
  AssetAId = 'ASSET_A_ID',
  AssetBId = 'ASSET_B_ID',
  ParaBlockHeight = 'PARA_BLOCK_HEIGHT',
  PoolAddress = 'POOL_ADDRESS',
  ShareTokenId = 'SHARE_TOKEN_ID'
}

export type XykpoolHavingAverageInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolHavingDistinctCountInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

/** Conditions for `Xykpool` aggregates. */
export type XykpoolHavingInput = {
  AND?: InputMaybe<Array<XykpoolHavingInput>>;
  OR?: InputMaybe<Array<XykpoolHavingInput>>;
  average?: InputMaybe<XykpoolHavingAverageInput>;
  distinctCount?: InputMaybe<XykpoolHavingDistinctCountInput>;
  max?: InputMaybe<XykpoolHavingMaxInput>;
  min?: InputMaybe<XykpoolHavingMinInput>;
  stddevPopulation?: InputMaybe<XykpoolHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<XykpoolHavingStddevSampleInput>;
  sum?: InputMaybe<XykpoolHavingSumInput>;
  variancePopulation?: InputMaybe<XykpoolHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<XykpoolHavingVarianceSampleInput>;
};

export type XykpoolHavingMaxInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolHavingMinInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolHavingStddevPopulationInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolHavingStddevSampleInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolHavingSumInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolHavingVariancePopulationInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolHavingVarianceSampleInput = {
  assetAId?: InputMaybe<HavingIntFilter>;
  assetBId?: InputMaybe<HavingIntFilter>;
  paraBlockHeight?: InputMaybe<HavingIntFilter>;
};

export type XykpoolMaxAggregates = {
  __typename?: 'XykpoolMaxAggregates';
  /** Maximum of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['Int']['output']>;
  /** Maximum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type XykpoolMinAggregates = {
  __typename?: 'XykpoolMinAggregates';
  /** Minimum of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['Int']['output']>;
  /** Minimum of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['Int']['output']>;
};

export type XykpoolStddevPopulationAggregates = {
  __typename?: 'XykpoolStddevPopulationAggregates';
  /** Population standard deviation of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykpoolStddevSampleAggregates = {
  __typename?: 'XykpoolStddevSampleAggregates';
  /** Sample standard deviation of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykpoolSumAggregates = {
  __typename?: 'XykpoolSumAggregates';
  /** Sum of assetAId across the matching connection */
  assetAId: Scalars['BigInt']['output'];
  /** Sum of assetBId across the matching connection */
  assetBId: Scalars['BigInt']['output'];
  /** Sum of paraBlockHeight across the matching connection */
  paraBlockHeight: Scalars['BigInt']['output'];
};

export type XykpoolVariancePopulationAggregates = {
  __typename?: 'XykpoolVariancePopulationAggregates';
  /** Population variance of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

export type XykpoolVarianceSampleAggregates = {
  __typename?: 'XykpoolVarianceSampleAggregates';
  /** Sample variance of assetAId across the matching connection */
  assetAId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of assetBId across the matching connection */
  assetBId?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of paraBlockHeight across the matching connection */
  paraBlockHeight?: Maybe<Scalars['BigFloat']['output']>;
};

/** A connection to a list of `Xykpool` values. */
export type XykpoolsConnection = {
  __typename?: 'XykpoolsConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<XykpoolAggregates>;
  /** A list of edges which contains the `Xykpool` and cursor to aid in pagination. */
  edges: Array<XykpoolsEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<XykpoolAggregates>>;
  /** A list of `Xykpool` objects. */
  nodes: Array<Maybe<Xykpool>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Xykpool` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Xykpool` values. */
export type XykpoolsConnectionGroupedAggregatesArgs = {
  groupBy: Array<XykpoolGroupBy>;
  having?: InputMaybe<XykpoolHavingInput>;
};

/** A `Xykpool` edge in the connection. */
export type XykpoolsEdge = {
  __typename?: 'XykpoolsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Xykpool` at the end of the edge. */
  node?: Maybe<Xykpool>;
};

/** Methods to use when ordering `Xykpool`. */
export enum XykpoolsOrderBy {
  AssetAIdAsc = 'ASSET_A_ID_ASC',
  AssetAIdDesc = 'ASSET_A_ID_DESC',
  AssetBIdAsc = 'ASSET_B_ID_ASC',
  AssetBIdDesc = 'ASSET_B_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  ParaBlockHeightAsc = 'PARA_BLOCK_HEIGHT_ASC',
  ParaBlockHeightDesc = 'PARA_BLOCK_HEIGHT_DESC',
  PoolAddressAsc = 'POOL_ADDRESS_ASC',
  PoolAddressDesc = 'POOL_ADDRESS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ShareTokenIdAsc = 'SHARE_TOKEN_ID_ASC',
  ShareTokenIdDesc = 'SHARE_TOKEN_ID_DESC',
  XykpoolAssetsDataByPoolIdAverageAssetIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_ASC',
  XykpoolAssetsDataByPoolIdAverageAssetIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ASSET_ID_DESC',
  XykpoolAssetsDataByPoolIdAverageBalancesAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_BALANCES_ASC',
  XykpoolAssetsDataByPoolIdAverageBalancesDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_BALANCES_DESC',
  XykpoolAssetsDataByPoolIdAverageIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ID_ASC',
  XykpoolAssetsDataByPoolIdAverageIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_ID_DESC',
  XykpoolAssetsDataByPoolIdAverageParaBlockHeightAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_PARA_BLOCK_HEIGHT_ASC',
  XykpoolAssetsDataByPoolIdAverageParaBlockHeightDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_PARA_BLOCK_HEIGHT_DESC',
  XykpoolAssetsDataByPoolIdAveragePoolIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_POOL_ID_ASC',
  XykpoolAssetsDataByPoolIdAveragePoolIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_AVERAGE_POOL_ID_DESC',
  XykpoolAssetsDataByPoolIdCountAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_COUNT_ASC',
  XykpoolAssetsDataByPoolIdCountDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_COUNT_DESC',
  XykpoolAssetsDataByPoolIdDistinctCountAssetIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_ASC',
  XykpoolAssetsDataByPoolIdDistinctCountAssetIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ASSET_ID_DESC',
  XykpoolAssetsDataByPoolIdDistinctCountBalancesAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_ASC',
  XykpoolAssetsDataByPoolIdDistinctCountBalancesDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_BALANCES_DESC',
  XykpoolAssetsDataByPoolIdDistinctCountIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_ASC',
  XykpoolAssetsDataByPoolIdDistinctCountIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_ID_DESC',
  XykpoolAssetsDataByPoolIdDistinctCountParaBlockHeightAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_ASC',
  XykpoolAssetsDataByPoolIdDistinctCountParaBlockHeightDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_PARA_BLOCK_HEIGHT_DESC',
  XykpoolAssetsDataByPoolIdDistinctCountPoolIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_ASC',
  XykpoolAssetsDataByPoolIdDistinctCountPoolIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_DISTINCT_COUNT_POOL_ID_DESC',
  XykpoolAssetsDataByPoolIdMaxAssetIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MAX_ASSET_ID_ASC',
  XykpoolAssetsDataByPoolIdMaxAssetIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MAX_ASSET_ID_DESC',
  XykpoolAssetsDataByPoolIdMaxBalancesAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MAX_BALANCES_ASC',
  XykpoolAssetsDataByPoolIdMaxBalancesDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MAX_BALANCES_DESC',
  XykpoolAssetsDataByPoolIdMaxIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MAX_ID_ASC',
  XykpoolAssetsDataByPoolIdMaxIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MAX_ID_DESC',
  XykpoolAssetsDataByPoolIdMaxParaBlockHeightAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MAX_PARA_BLOCK_HEIGHT_ASC',
  XykpoolAssetsDataByPoolIdMaxParaBlockHeightDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MAX_PARA_BLOCK_HEIGHT_DESC',
  XykpoolAssetsDataByPoolIdMaxPoolIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MAX_POOL_ID_ASC',
  XykpoolAssetsDataByPoolIdMaxPoolIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MAX_POOL_ID_DESC',
  XykpoolAssetsDataByPoolIdMinAssetIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MIN_ASSET_ID_ASC',
  XykpoolAssetsDataByPoolIdMinAssetIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MIN_ASSET_ID_DESC',
  XykpoolAssetsDataByPoolIdMinBalancesAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MIN_BALANCES_ASC',
  XykpoolAssetsDataByPoolIdMinBalancesDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MIN_BALANCES_DESC',
  XykpoolAssetsDataByPoolIdMinIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MIN_ID_ASC',
  XykpoolAssetsDataByPoolIdMinIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MIN_ID_DESC',
  XykpoolAssetsDataByPoolIdMinParaBlockHeightAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MIN_PARA_BLOCK_HEIGHT_ASC',
  XykpoolAssetsDataByPoolIdMinParaBlockHeightDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MIN_PARA_BLOCK_HEIGHT_DESC',
  XykpoolAssetsDataByPoolIdMinPoolIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MIN_POOL_ID_ASC',
  XykpoolAssetsDataByPoolIdMinPoolIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_MIN_POOL_ID_DESC',
  XykpoolAssetsDataByPoolIdStddevPopulationAssetIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_ASC',
  XykpoolAssetsDataByPoolIdStddevPopulationAssetIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ASSET_ID_DESC',
  XykpoolAssetsDataByPoolIdStddevPopulationBalancesAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_ASC',
  XykpoolAssetsDataByPoolIdStddevPopulationBalancesDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_BALANCES_DESC',
  XykpoolAssetsDataByPoolIdStddevPopulationIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_ASC',
  XykpoolAssetsDataByPoolIdStddevPopulationIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_ID_DESC',
  XykpoolAssetsDataByPoolIdStddevPopulationParaBlockHeightAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  XykpoolAssetsDataByPoolIdStddevPopulationParaBlockHeightDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  XykpoolAssetsDataByPoolIdStddevPopulationPoolIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_ASC',
  XykpoolAssetsDataByPoolIdStddevPopulationPoolIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_POPULATION_POOL_ID_DESC',
  XykpoolAssetsDataByPoolIdStddevSampleAssetIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_ASC',
  XykpoolAssetsDataByPoolIdStddevSampleAssetIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ASSET_ID_DESC',
  XykpoolAssetsDataByPoolIdStddevSampleBalancesAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_ASC',
  XykpoolAssetsDataByPoolIdStddevSampleBalancesDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_BALANCES_DESC',
  XykpoolAssetsDataByPoolIdStddevSampleIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_ASC',
  XykpoolAssetsDataByPoolIdStddevSampleIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_ID_DESC',
  XykpoolAssetsDataByPoolIdStddevSampleParaBlockHeightAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  XykpoolAssetsDataByPoolIdStddevSampleParaBlockHeightDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  XykpoolAssetsDataByPoolIdStddevSamplePoolIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_ASC',
  XykpoolAssetsDataByPoolIdStddevSamplePoolIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_STDDEV_SAMPLE_POOL_ID_DESC',
  XykpoolAssetsDataByPoolIdSumAssetIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_SUM_ASSET_ID_ASC',
  XykpoolAssetsDataByPoolIdSumAssetIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_SUM_ASSET_ID_DESC',
  XykpoolAssetsDataByPoolIdSumBalancesAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_SUM_BALANCES_ASC',
  XykpoolAssetsDataByPoolIdSumBalancesDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_SUM_BALANCES_DESC',
  XykpoolAssetsDataByPoolIdSumIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_SUM_ID_ASC',
  XykpoolAssetsDataByPoolIdSumIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_SUM_ID_DESC',
  XykpoolAssetsDataByPoolIdSumParaBlockHeightAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_SUM_PARA_BLOCK_HEIGHT_ASC',
  XykpoolAssetsDataByPoolIdSumParaBlockHeightDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_SUM_PARA_BLOCK_HEIGHT_DESC',
  XykpoolAssetsDataByPoolIdSumPoolIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_SUM_POOL_ID_ASC',
  XykpoolAssetsDataByPoolIdSumPoolIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_SUM_POOL_ID_DESC',
  XykpoolAssetsDataByPoolIdVariancePopulationAssetIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_ASC',
  XykpoolAssetsDataByPoolIdVariancePopulationAssetIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ASSET_ID_DESC',
  XykpoolAssetsDataByPoolIdVariancePopulationBalancesAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_ASC',
  XykpoolAssetsDataByPoolIdVariancePopulationBalancesDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_BALANCES_DESC',
  XykpoolAssetsDataByPoolIdVariancePopulationIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_ASC',
  XykpoolAssetsDataByPoolIdVariancePopulationIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_ID_DESC',
  XykpoolAssetsDataByPoolIdVariancePopulationParaBlockHeightAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_ASC',
  XykpoolAssetsDataByPoolIdVariancePopulationParaBlockHeightDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_PARA_BLOCK_HEIGHT_DESC',
  XykpoolAssetsDataByPoolIdVariancePopulationPoolIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_ASC',
  XykpoolAssetsDataByPoolIdVariancePopulationPoolIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_POPULATION_POOL_ID_DESC',
  XykpoolAssetsDataByPoolIdVarianceSampleAssetIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_ASC',
  XykpoolAssetsDataByPoolIdVarianceSampleAssetIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ASSET_ID_DESC',
  XykpoolAssetsDataByPoolIdVarianceSampleBalancesAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_ASC',
  XykpoolAssetsDataByPoolIdVarianceSampleBalancesDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_BALANCES_DESC',
  XykpoolAssetsDataByPoolIdVarianceSampleIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_ASC',
  XykpoolAssetsDataByPoolIdVarianceSampleIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_ID_DESC',
  XykpoolAssetsDataByPoolIdVarianceSampleParaBlockHeightAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_ASC',
  XykpoolAssetsDataByPoolIdVarianceSampleParaBlockHeightDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_PARA_BLOCK_HEIGHT_DESC',
  XykpoolAssetsDataByPoolIdVarianceSamplePoolIdAsc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_ASC',
  XykpoolAssetsDataByPoolIdVarianceSamplePoolIdDesc = 'XYKPOOL_ASSETS_DATA_BY_POOL_ID_VARIANCE_SAMPLE_POOL_ID_DESC'
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
  filter?: InputMaybe<OmnipoolFilter>;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<OmnipoolsOrderBy> | OmnipoolsOrderBy>;
}>;


export type GetOmnipoolBlocksStorageStateQuery = { __typename?: 'Query', omnipools?: { __typename?: 'OmnipoolsConnection', totalCount: number, nodes: Array<{ __typename?: 'Omnipool', id: string, poolAddress: string, hubAssetTradability: any, paraBlockHeight: number, omnipoolAssetDataByPoolId: { __typename?: 'OmnipoolAssetDataConnection', nodes: Array<{ __typename?: 'OmnipoolAssetDatum', assetId: number, assetState: any, balances: any, paraBlockHeight: number, id: string } | null> } } | null> } | null };

export type GetLbppoolBlocksStorageStateQueryVariables = Exact<{
  filter?: InputMaybe<LbppoolFilter>;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<LbppoolsOrderBy> | LbppoolsOrderBy>;
}>;


export type GetLbppoolBlocksStorageStateQuery = { __typename?: 'Query', lbppools?: { __typename?: 'LbppoolsConnection', totalCount: number, nodes: Array<{ __typename?: 'Lbppool', id: string, assetAId: number, assetBId: number, fee: Array<number | null>, start?: number | null, end?: number | null, weightCurve: string, initialWeight: number, finalWeight: number, feeCollector?: string | null, repayTarget: string, poolAddress: string, owner: string, lbppoolAssetsDataByPoolId: { __typename?: 'LbppoolAssetsDataConnection', nodes: Array<{ __typename?: 'LbppoolAssetsDatum', id: string, assetId: number, poolId?: string | null, balances: any, paraBlockHeight: number } | null> } } | null> } | null };

export type GetXykpoolBlocksStorageStateQueryVariables = Exact<{
  filter?: InputMaybe<XykpoolFilter>;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<XykpoolsOrderBy> | XykpoolsOrderBy>;
}>;


export type GetXykpoolBlocksStorageStateQuery = { __typename?: 'Query', xykpools?: { __typename?: 'XykpoolsConnection', totalCount: number, nodes: Array<{ __typename?: 'Xykpool', assetAId: number, assetBId: number, id: string, paraBlockHeight: number, poolAddress: string, shareTokenId?: string | null, xykpoolAssetsDataByPoolId: { __typename?: 'XykpoolAssetsDataConnection', nodes: Array<{ __typename?: 'XykpoolAssetsDatum', assetId: number, balances: any, id: string, paraBlockHeight: number, poolId?: string | null } | null> } } | null> } | null };

export type GetStableswapBlocksStorageStateQueryVariables = Exact<{
  filter?: InputMaybe<StableswapFilter>;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<StableswapsOrderBy> | StableswapsOrderBy>;
}>;


export type GetStableswapBlocksStorageStateQuery = { __typename?: 'Query', stableswaps?: { __typename?: 'StableswapsConnection', totalCount: number, nodes: Array<{ __typename?: 'Stableswap', fee: number, finalAmplification: number, finalBlock: number, id: string, initialAmplification: number, initialBlock: number, paraBlockHeight: number, poolAddress: string, poolId: number, pegs: any, pegSources?: any | null, maxPegUpdate?: number | null, stableswapAssetDataByPoolId: { __typename?: 'StableswapAssetDataConnection', nodes: Array<{ __typename?: 'StableswapAssetDatum', id: string, assetId: number, balances: any, poolId?: string | null, tradable?: any | null, paraBlockHeight: number } | null> } } | null> } | null };

export type GetAavePoolBlocksStorageStateQueryVariables = Exact<{
  filter?: InputMaybe<AavepoolFilter>;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<AavepoolsOrderBy> | AavepoolsOrderBy>;
}>;


export type GetAavePoolBlocksStorageStateQuery = { __typename?: 'Query', aavepools?: { __typename?: 'AavepoolsConnection', totalCount: number, nodes: Array<{ __typename?: 'Aavepool', id: string, aTokenId?: string | null, reserveAssetId?: string | null, liquidityIn: string, liquidityOut: string, paraBlockHeight: number, poolId: string } | null> } | null };

export type GetEmaOracleBlocksStorageStateQueryVariables = Exact<{
  filter?: InputMaybe<EmaOracleFilter>;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<EmaOraclesOrderBy> | EmaOraclesOrderBy>;
}>;


export type GetEmaOracleBlocksStorageStateQuery = { __typename?: 'Query', emaOracles?: { __typename?: 'EmaOraclesConnection', totalCount: number, nodes: Array<{ __typename?: 'EmaOracle', id: string, paraBlockHeight: number, entries: any } | null> } | null };

export type GetAssetHistDataBlocksStorageStateQueryVariables = Exact<{
  filter?: InputMaybe<AssetHistoricalDatumFilter>;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<AssetHistoricalDataOrderBy> | AssetHistoricalDataOrderBy>;
}>;


export type GetAssetHistDataBlocksStorageStateQuery = { __typename?: 'Query', assetHistoricalData?: { __typename?: 'AssetHistoricalDataConnection', totalCount: number, nodes: Array<{ __typename?: 'AssetHistoricalDatum', id: string, assetId?: string | null, dynamicFee?: any | null, existentialDeposit: string, totalIssuance: string, paraBlockHeight: number } | null> } | null };

export type GetBlockCompressedDataQueryVariables = Exact<{
  filter?: InputMaybe<BlockCompressedDatumFilter>;
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<BlockCompressedDataOrderBy> | BlockCompressedDataOrderBy>;
}>;


export type GetBlockCompressedDataQuery = { __typename?: 'Query', blockCompressedData?: { __typename?: 'BlockCompressedDataConnection', totalCount: number, nodes: Array<{ __typename?: 'BlockCompressedDatum', id: string, algo: string, compStrFormat: string, data: string, paraBlockHeight: number } | null> } | null };


export const GetOmnipoolBlocksStorageState = gql`
    query GetOmnipoolBlocksStorageState($filter: OmnipoolFilter, $first: Int!, $offset: Int!, $orderBy: [OmnipoolsOrderBy!]) {
  omnipools(filter: $filter, orderBy: $orderBy, first: $first, offset: $offset) {
    nodes {
      id
      poolAddress
      hubAssetTradability
      paraBlockHeight
      omnipoolAssetDataByPoolId {
        nodes {
          assetId
          assetState
          balances
          paraBlockHeight
          id
        }
      }
    }
    totalCount
  }
}
    `;
export const GetLbppoolBlocksStorageState = gql`
    query GetLbppoolBlocksStorageState($filter: LbppoolFilter, $first: Int!, $offset: Int!, $orderBy: [LbppoolsOrderBy!]) {
  lbppools(filter: $filter, orderBy: $orderBy, first: $first, offset: $offset) {
    nodes {
      id
      assetAId
      assetBId
      fee
      start
      end
      weightCurve
      initialWeight
      finalWeight
      feeCollector
      repayTarget
      poolAddress
      owner
      lbppoolAssetsDataByPoolId {
        nodes {
          id
          assetId
          poolId
          balances
          paraBlockHeight
        }
      }
    }
    totalCount
  }
}
    `;
export const GetXykpoolBlocksStorageState = gql`
    query GetXykpoolBlocksStorageState($filter: XykpoolFilter, $first: Int!, $offset: Int!, $orderBy: [XykpoolsOrderBy!]) {
  xykpools(filter: $filter, orderBy: $orderBy, first: $first, offset: $offset) {
    nodes {
      assetAId
      assetBId
      id
      paraBlockHeight
      poolAddress
      shareTokenId
      xykpoolAssetsDataByPoolId {
        nodes {
          assetId
          balances
          id
          paraBlockHeight
          poolId
        }
      }
    }
    totalCount
  }
}
    `;
export const GetStableswapBlocksStorageState = gql`
    query GetStableswapBlocksStorageState($filter: StableswapFilter, $first: Int!, $offset: Int!, $orderBy: [StableswapsOrderBy!]) {
  stableswaps(filter: $filter, orderBy: $orderBy, first: $first, offset: $offset) {
    nodes {
      fee
      finalAmplification
      finalBlock
      id
      initialAmplification
      initialBlock
      paraBlockHeight
      poolAddress
      poolId
      pegs
      pegSources
      maxPegUpdate
      stableswapAssetDataByPoolId {
        nodes {
          id
          assetId
          balances
          poolId
          tradable
          paraBlockHeight
        }
      }
    }
    totalCount
  }
}
    `;
export const GetAavePoolBlocksStorageState = gql`
    query GetAavePoolBlocksStorageState($filter: AavepoolFilter, $first: Int!, $offset: Int!, $orderBy: [AavepoolsOrderBy!]) {
  aavepools(filter: $filter, orderBy: $orderBy, first: $first, offset: $offset) {
    nodes {
      id
      aTokenId
      reserveAssetId
      liquidityIn
      liquidityOut
      paraBlockHeight
      poolId
    }
    totalCount
  }
}
    `;
export const GetEmaOracleBlocksStorageState = gql`
    query GetEmaOracleBlocksStorageState($filter: EmaOracleFilter, $first: Int!, $offset: Int!, $orderBy: [EmaOraclesOrderBy!]) {
  emaOracles(filter: $filter, orderBy: $orderBy, first: $first, offset: $offset) {
    nodes {
      id
      paraBlockHeight
      entries
    }
    totalCount
  }
}
    `;
export const GetAssetHistDataBlocksStorageState = gql`
    query GetAssetHistDataBlocksStorageState($filter: AssetHistoricalDatumFilter, $first: Int!, $offset: Int!, $orderBy: [AssetHistoricalDataOrderBy!]) {
  assetHistoricalData(
    filter: $filter
    orderBy: $orderBy
    first: $first
    offset: $offset
  ) {
    nodes {
      id
      assetId
      dynamicFee
      existentialDeposit
      totalIssuance
      paraBlockHeight
    }
    totalCount
  }
}
    `;
export const GetBlockCompressedData = gql`
    query GetBlockCompressedData($filter: BlockCompressedDatumFilter, $first: Int!, $offset: Int!, $orderBy: [BlockCompressedDataOrderBy!]) {
  blockCompressedData(
    filter: $filter
    orderBy: $orderBy
    first: $first
    offset: $offset
  ) {
    nodes {
      id
      algo
      compStrFormat
      data
      paraBlockHeight
    }
    totalCount
  }
}
    `;