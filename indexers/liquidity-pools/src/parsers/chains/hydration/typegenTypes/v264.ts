import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface AssetDetails {
    name?: (Bytes | undefined)
    assetType: AssetType
    existentialDeposit: bigint
    symbol?: (Bytes | undefined)
    decimals?: (number | undefined)
    xcmRateLimit?: (bigint | undefined)
    isSufficient: boolean
}

export type AssetType = AssetType_Bond | AssetType_Erc20 | AssetType_External | AssetType_StableSwap | AssetType_Token | AssetType_XYK

export interface AssetType_Bond {
    __kind: 'Bond'
}

export interface AssetType_Erc20 {
    __kind: 'Erc20'
}

export interface AssetType_External {
    __kind: 'External'
}

export interface AssetType_StableSwap {
    __kind: 'StableSwap'
}

export interface AssetType_Token {
    __kind: 'Token'
}

export interface AssetType_XYK {
    __kind: 'XYK'
}

export const AssetDetails: sts.Type<AssetDetails> = sts.struct(() => {
    return  {
        name: sts.option(() => sts.bytes()),
        assetType: AssetType,
        existentialDeposit: sts.bigint(),
        symbol: sts.option(() => sts.bytes()),
        decimals: sts.option(() => sts.number()),
        xcmRateLimit: sts.option(() => sts.bigint()),
        isSufficient: sts.boolean(),
    }
})

export const Weight: sts.Type<Weight> = sts.struct(() => {
    return  {
        refTime: sts.bigint(),
        proofSize: sts.bigint(),
    }
})

export interface Weight {
    refTime: bigint
    proofSize: bigint
}

export const OriginCaller: sts.Type<OriginCaller> = sts.closedEnum(() => {
    return  {
        Council: Type_472,
        CumulusXcm: Type_476,
        Ethereum: Type_474,
        PolkadotXcm: Origin,
        TechnicalCommittee: Type_473,
        Void: Void,
        system: RawOrigin,
    }
})

export const RawOrigin: sts.Type<RawOrigin> = sts.closedEnum(() => {
    return  {
        None: sts.unit(),
        Root: sts.unit(),
        Signed: AccountId32,
    }
})

export const AccountId32 = sts.bytes()

export type RawOrigin = RawOrigin_None | RawOrigin_Root | RawOrigin_Signed

export interface RawOrigin_None {
    __kind: 'None'
}

export interface RawOrigin_Root {
    __kind: 'Root'
}

export interface RawOrigin_Signed {
    __kind: 'Signed'
    value: AccountId32
}

export type AccountId32 = Bytes

export const Void: sts.Type<Void> = sts.closedEnum(() => {
    return  {
    }
})

export type Void = never

export const Type_473: sts.Type<Type_473> = sts.closedEnum(() => {
    return  {
        Member: AccountId32,
        Members: sts.tuple(() => [sts.number(), sts.number()]),
        _Phantom: sts.unit(),
    }
})

export type Type_473 = Type_473_Member | Type_473_Members | Type_473__Phantom

export interface Type_473_Member {
    __kind: 'Member'
    value: AccountId32
}

export interface Type_473_Members {
    __kind: 'Members'
    value: [number, number]
}

export interface Type_473__Phantom {
    __kind: '_Phantom'
}

export const Origin: sts.Type<Origin> = sts.closedEnum(() => {
    return  {
        Response: V4Location,
        Xcm: V4Location,
    }
})

export const V4Location: sts.Type<V4Location> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V4Junctions,
    }
})

export const V4Junctions: sts.Type<V4Junctions> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: sts.array(() => V4Junction),
        X2: sts.array(() => V4Junction),
        X3: sts.array(() => V4Junction),
        X4: sts.array(() => V4Junction),
        X5: sts.array(() => V4Junction),
        X6: sts.array(() => V4Junction),
        X7: sts.array(() => V4Junction),
        X8: sts.array(() => V4Junction),
    }
})

export const V4Junction: sts.Type<V4Junction> = sts.closedEnum(() => {
    return  {
        AccountId32: sts.enumStruct({
            network: sts.option(() => V4NetworkId),
            id: sts.bytes(),
        }),
        AccountIndex64: sts.enumStruct({
            network: sts.option(() => V4NetworkId),
            index: sts.bigint(),
        }),
        AccountKey20: sts.enumStruct({
            network: sts.option(() => V4NetworkId),
            key: sts.bytes(),
        }),
        GeneralIndex: sts.bigint(),
        GeneralKey: sts.enumStruct({
            length: sts.number(),
            data: sts.bytes(),
        }),
        GlobalConsensus: V4NetworkId,
        OnlyChild: sts.unit(),
        PalletInstance: sts.number(),
        Parachain: sts.number(),
        Plurality: sts.enumStruct({
            id: V3BodyId,
            part: V3BodyPart,
        }),
    }
})

export const V3BodyPart: sts.Type<V3BodyPart> = sts.closedEnum(() => {
    return  {
        AtLeastProportion: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Fraction: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Members: sts.enumStruct({
            count: sts.number(),
        }),
        MoreThanProportion: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Voice: sts.unit(),
    }
})

export type V3BodyPart = V3BodyPart_AtLeastProportion | V3BodyPart_Fraction | V3BodyPart_Members | V3BodyPart_MoreThanProportion | V3BodyPart_Voice

export interface V3BodyPart_AtLeastProportion {
    __kind: 'AtLeastProportion'
    nom: number
    denom: number
}

export interface V3BodyPart_Fraction {
    __kind: 'Fraction'
    nom: number
    denom: number
}

export interface V3BodyPart_Members {
    __kind: 'Members'
    count: number
}

export interface V3BodyPart_MoreThanProportion {
    __kind: 'MoreThanProportion'
    nom: number
    denom: number
}

export interface V3BodyPart_Voice {
    __kind: 'Voice'
}

export const V3BodyId: sts.Type<V3BodyId> = sts.closedEnum(() => {
    return  {
        Administration: sts.unit(),
        Defense: sts.unit(),
        Executive: sts.unit(),
        Index: sts.number(),
        Judicial: sts.unit(),
        Legislative: sts.unit(),
        Moniker: sts.bytes(),
        Technical: sts.unit(),
        Treasury: sts.unit(),
        Unit: sts.unit(),
    }
})

export type V3BodyId = V3BodyId_Administration | V3BodyId_Defense | V3BodyId_Executive | V3BodyId_Index | V3BodyId_Judicial | V3BodyId_Legislative | V3BodyId_Moniker | V3BodyId_Technical | V3BodyId_Treasury | V3BodyId_Unit

export interface V3BodyId_Administration {
    __kind: 'Administration'
}

export interface V3BodyId_Defense {
    __kind: 'Defense'
}

export interface V3BodyId_Executive {
    __kind: 'Executive'
}

export interface V3BodyId_Index {
    __kind: 'Index'
    value: number
}

export interface V3BodyId_Judicial {
    __kind: 'Judicial'
}

export interface V3BodyId_Legislative {
    __kind: 'Legislative'
}

export interface V3BodyId_Moniker {
    __kind: 'Moniker'
    value: Bytes
}

export interface V3BodyId_Technical {
    __kind: 'Technical'
}

export interface V3BodyId_Treasury {
    __kind: 'Treasury'
}

export interface V3BodyId_Unit {
    __kind: 'Unit'
}

export const V4NetworkId: sts.Type<V4NetworkId> = sts.closedEnum(() => {
    return  {
        BitcoinCash: sts.unit(),
        BitcoinCore: sts.unit(),
        ByFork: sts.enumStruct({
            blockNumber: sts.bigint(),
            blockHash: sts.bytes(),
        }),
        ByGenesis: sts.bytes(),
        Ethereum: sts.enumStruct({
            chainId: sts.bigint(),
        }),
        Kusama: sts.unit(),
        Polkadot: sts.unit(),
        PolkadotBulletin: sts.unit(),
        Rococo: sts.unit(),
        Westend: sts.unit(),
        Wococo: sts.unit(),
    }
})

export type V4NetworkId = V4NetworkId_BitcoinCash | V4NetworkId_BitcoinCore | V4NetworkId_ByFork | V4NetworkId_ByGenesis | V4NetworkId_Ethereum | V4NetworkId_Kusama | V4NetworkId_Polkadot | V4NetworkId_PolkadotBulletin | V4NetworkId_Rococo | V4NetworkId_Westend | V4NetworkId_Wococo

export interface V4NetworkId_BitcoinCash {
    __kind: 'BitcoinCash'
}

export interface V4NetworkId_BitcoinCore {
    __kind: 'BitcoinCore'
}

export interface V4NetworkId_ByFork {
    __kind: 'ByFork'
    blockNumber: bigint
    blockHash: Bytes
}

export interface V4NetworkId_ByGenesis {
    __kind: 'ByGenesis'
    value: Bytes
}

export interface V4NetworkId_Ethereum {
    __kind: 'Ethereum'
    chainId: bigint
}

export interface V4NetworkId_Kusama {
    __kind: 'Kusama'
}

export interface V4NetworkId_Polkadot {
    __kind: 'Polkadot'
}

export interface V4NetworkId_PolkadotBulletin {
    __kind: 'PolkadotBulletin'
}

export interface V4NetworkId_Rococo {
    __kind: 'Rococo'
}

export interface V4NetworkId_Westend {
    __kind: 'Westend'
}

export interface V4NetworkId_Wococo {
    __kind: 'Wococo'
}

export type V4Junction = V4Junction_AccountId32 | V4Junction_AccountIndex64 | V4Junction_AccountKey20 | V4Junction_GeneralIndex | V4Junction_GeneralKey | V4Junction_GlobalConsensus | V4Junction_OnlyChild | V4Junction_PalletInstance | V4Junction_Parachain | V4Junction_Plurality

export interface V4Junction_AccountId32 {
    __kind: 'AccountId32'
    network?: (V4NetworkId | undefined)
    id: Bytes
}

export interface V4Junction_AccountIndex64 {
    __kind: 'AccountIndex64'
    network?: (V4NetworkId | undefined)
    index: bigint
}

export interface V4Junction_AccountKey20 {
    __kind: 'AccountKey20'
    network?: (V4NetworkId | undefined)
    key: Bytes
}

export interface V4Junction_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface V4Junction_GeneralKey {
    __kind: 'GeneralKey'
    length: number
    data: Bytes
}

export interface V4Junction_GlobalConsensus {
    __kind: 'GlobalConsensus'
    value: V4NetworkId
}

export interface V4Junction_OnlyChild {
    __kind: 'OnlyChild'
}

export interface V4Junction_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface V4Junction_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface V4Junction_Plurality {
    __kind: 'Plurality'
    id: V3BodyId
    part: V3BodyPart
}

export type V4Junctions = V4Junctions_Here | V4Junctions_X1 | V4Junctions_X2 | V4Junctions_X3 | V4Junctions_X4 | V4Junctions_X5 | V4Junctions_X6 | V4Junctions_X7 | V4Junctions_X8

export interface V4Junctions_Here {
    __kind: 'Here'
}

export interface V4Junctions_X1 {
    __kind: 'X1'
    value: V4Junction[]
}

export interface V4Junctions_X2 {
    __kind: 'X2'
    value: V4Junction[]
}

export interface V4Junctions_X3 {
    __kind: 'X3'
    value: V4Junction[]
}

export interface V4Junctions_X4 {
    __kind: 'X4'
    value: V4Junction[]
}

export interface V4Junctions_X5 {
    __kind: 'X5'
    value: V4Junction[]
}

export interface V4Junctions_X6 {
    __kind: 'X6'
    value: V4Junction[]
}

export interface V4Junctions_X7 {
    __kind: 'X7'
    value: V4Junction[]
}

export interface V4Junctions_X8 {
    __kind: 'X8'
    value: V4Junction[]
}

export interface V4Location {
    parents: number
    interior: V4Junctions
}

export type Origin = Origin_Response | Origin_Xcm

export interface Origin_Response {
    __kind: 'Response'
    value: V4Location
}

export interface Origin_Xcm {
    __kind: 'Xcm'
    value: V4Location
}

export const Type_474: sts.Type<Type_474> = sts.closedEnum(() => {
    return  {
        EthereumTransaction: H160,
    }
})

export const H160 = sts.bytes()

export type Type_474 = Type_474_EthereumTransaction

export interface Type_474_EthereumTransaction {
    __kind: 'EthereumTransaction'
    value: H160
}

export type H160 = Bytes

export const Type_476: sts.Type<Type_476> = sts.closedEnum(() => {
    return  {
        Relay: sts.unit(),
        SiblingParachain: Id,
    }
})

export const Id = sts.number()

export type Type_476 = Type_476_Relay | Type_476_SiblingParachain

export interface Type_476_Relay {
    __kind: 'Relay'
}

export interface Type_476_SiblingParachain {
    __kind: 'SiblingParachain'
    value: Id
}

export type Id = number

export const Type_472: sts.Type<Type_472> = sts.closedEnum(() => {
    return  {
        Member: AccountId32,
        Members: sts.tuple(() => [sts.number(), sts.number()]),
        _Phantom: sts.unit(),
    }
})

export type Type_472 = Type_472_Member | Type_472_Members | Type_472__Phantom

export interface Type_472_Member {
    __kind: 'Member'
    value: AccountId32
}

export interface Type_472_Members {
    __kind: 'Members'
    value: [number, number]
}

export interface Type_472__Phantom {
    __kind: '_Phantom'
}

export type OriginCaller = OriginCaller_Council | OriginCaller_CumulusXcm | OriginCaller_Ethereum | OriginCaller_PolkadotXcm | OriginCaller_TechnicalCommittee | OriginCaller_Void | OriginCaller_system

export interface OriginCaller_Council {
    __kind: 'Council'
    value: Type_472
}

export interface OriginCaller_CumulusXcm {
    __kind: 'CumulusXcm'
    value: Type_476
}

export interface OriginCaller_Ethereum {
    __kind: 'Ethereum'
    value: Type_474
}

export interface OriginCaller_PolkadotXcm {
    __kind: 'PolkadotXcm'
    value: Origin
}

export interface OriginCaller_TechnicalCommittee {
    __kind: 'TechnicalCommittee'
    value: Type_473
}

export interface OriginCaller_Void {
    __kind: 'Void'
    value: Void
}

export interface OriginCaller_system {
    __kind: 'system'
    value: RawOrigin
}

export const Call: sts.Type<Call> = sts.closedEnum(() => {
    return  {
        AssetRegistry: AssetRegistryCall,
        Balances: BalancesCall,
        Bonds: BondsCall,
        CircuitBreaker: CircuitBreakerCall,
        Claims: ClaimsCall,
        CollatorSelection: CollatorSelectionCall,
        Council: CouncilCall,
        CumulusXcm: CumulusXcmCall,
        Currencies: CurrenciesCall,
        DCA: DCACall,
        Democracy: DemocracyCall,
        Duster: DusterCall,
        DynamicFees: DynamicFeesCall,
        EVM: EVMCall,
        EVMAccounts: EVMAccountsCall,
        Elections: ElectionsCall,
        EmaOracle: EmaOracleCall,
        Ethereum: EthereumCall,
        GenesisHistory: GenesisHistoryCall,
        Identity: IdentityCall,
        LBP: LBPCall,
        MessageQueue: MessageQueueCall,
        MultiTransactionPayment: MultiTransactionPaymentCall,
        Multisig: MultisigCall,
        OTC: OTCCall,
        Omnipool: OmnipoolCall,
        OmnipoolLiquidityMining: OmnipoolLiquidityMiningCall,
        OmnipoolWarehouseLM: OmnipoolWarehouseLMCall,
        OrmlXcm: OrmlXcmCall,
        OtcSettlements: OtcSettlementsCall,
        ParachainInfo: ParachainInfoCall,
        ParachainSystem: ParachainSystemCall,
        PolkadotXcm: PolkadotXcmCall,
        Preimage: PreimageCall,
        Proxy: ProxyCall,
        Referrals: ReferralsCall,
        RelayChainInfo: RelayChainInfoCall,
        Router: RouterCall,
        Scheduler: SchedulerCall,
        Session: SessionCall,
        Stableswap: StableswapCall,
        Staking: StakingCall,
        StateTrieMigration: StateTrieMigrationCall,
        System: SystemCall,
        TechnicalCommittee: TechnicalCommitteeCall,
        Timestamp: TimestampCall,
        Tips: TipsCall,
        Tokens: TokensCall,
        TransactionPause: TransactionPauseCall,
        Treasury: TreasuryCall,
        Uniques: UniquesCall,
        Utility: UtilityCall,
        Vesting: VestingCall,
        XTokens: XTokensCall,
        XYK: XYKCall,
        XYKLiquidityMining: XYKLiquidityMiningCall,
        XYKWarehouseLM: XYKWarehouseLMCall,
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const XYKWarehouseLMCall: sts.Type<XYKWarehouseLMCall> = sts.closedEnum(() => {
    return  {
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type XYKWarehouseLMCall = never

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const XYKLiquidityMiningCall: sts.Type<XYKLiquidityMiningCall> = sts.closedEnum(() => {
    return  {
        claim_rewards: sts.enumStruct({
            depositId: sts.bigint(),
            yieldFarmId: sts.number(),
        }),
        create_global_farm: sts.enumStruct({
            totalRewards: sts.bigint(),
            plannedYieldingPeriods: sts.number(),
            blocksPerPeriod: sts.number(),
            incentivizedAsset: sts.number(),
            rewardCurrency: sts.number(),
            owner: AccountId32,
            yieldPerPeriod: Perquintill,
            minDeposit: sts.bigint(),
            priceAdjustment: FixedU128,
        }),
        create_yield_farm: sts.enumStruct({
            globalFarmId: sts.number(),
            assetPair: AssetPair,
            multiplier: FixedU128,
            loyaltyCurve: sts.option(() => LoyaltyCurve),
        }),
        deposit_shares: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetPair: AssetPair,
            sharesAmount: sts.bigint(),
        }),
        redeposit_shares: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetPair: AssetPair,
            depositId: sts.bigint(),
        }),
        resume_yield_farm: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetPair: AssetPair,
            multiplier: FixedU128,
        }),
        stop_yield_farm: sts.enumStruct({
            globalFarmId: sts.number(),
            assetPair: AssetPair,
        }),
        terminate_global_farm: sts.enumStruct({
            globalFarmId: sts.number(),
        }),
        terminate_yield_farm: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetPair: AssetPair,
        }),
        update_global_farm: sts.enumStruct({
            globalFarmId: sts.number(),
            priceAdjustment: FixedU128,
        }),
        update_yield_farm: sts.enumStruct({
            globalFarmId: sts.number(),
            assetPair: AssetPair,
            multiplier: FixedU128,
        }),
        withdraw_shares: sts.enumStruct({
            depositId: sts.bigint(),
            yieldFarmId: sts.number(),
            assetPair: AssetPair,
        }),
    }
})

export const LoyaltyCurve: sts.Type<LoyaltyCurve> = sts.struct(() => {
    return  {
        initialRewardPercentage: FixedU128,
        scaleCoef: sts.number(),
    }
})

export interface LoyaltyCurve {
    initialRewardPercentage: FixedU128
    scaleCoef: number
}

export type FixedU128 = bigint

export const AssetPair: sts.Type<AssetPair> = sts.struct(() => {
    return  {
        assetIn: sts.number(),
        assetOut: sts.number(),
    }
})

export interface AssetPair {
    assetIn: number
    assetOut: number
}

export const FixedU128 = sts.bigint()

export const Perquintill = sts.bigint()

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type XYKLiquidityMiningCall = XYKLiquidityMiningCall_claim_rewards | XYKLiquidityMiningCall_create_global_farm | XYKLiquidityMiningCall_create_yield_farm | XYKLiquidityMiningCall_deposit_shares | XYKLiquidityMiningCall_redeposit_shares | XYKLiquidityMiningCall_resume_yield_farm | XYKLiquidityMiningCall_stop_yield_farm | XYKLiquidityMiningCall_terminate_global_farm | XYKLiquidityMiningCall_terminate_yield_farm | XYKLiquidityMiningCall_update_global_farm | XYKLiquidityMiningCall_update_yield_farm | XYKLiquidityMiningCall_withdraw_shares

/**
 * Claim rewards from liq. mining for deposit represented by `nft_id`.
 * 
 * This function calculate user rewards from liq. mining and transfer rewards to `origin`
 * account. Claiming in the same period is allowed only once.
 * 
 * Parameters:
 * - `origin`: account owner of deposit(nft).
 * - `deposit_id`: nft id representing deposit in the yield farm.
 * - `yield_farm_id`: yield farm identifier to claim rewards from.
 * 
 * Emits `RewardClaimed` event when successful.
 */
export interface XYKLiquidityMiningCall_claim_rewards {
    __kind: 'claim_rewards'
    depositId: bigint
    yieldFarmId: number
}

/**
 * Create new liquidity mining program with provided parameters.
 * 
 * `owner` account has to have at least `total_rewards` balance. This fund will be
 * transferred from `owner` to farm account.
 * In case of `reward_currency` is insufficient asset, farm's `owner` has to pay existential
 * deposit for global farm account and for liquidity mining `pot` account.
 * 
 * The dispatch origin for this call must be `T::CreateOrigin`.
 * !!!WARN: `T::CreateOrigin` has power over funds of `owner`'s account and it should be
 * configured to trusted origin e.g Sudo or Governance.
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `total_rewards`: total rewards planned to distribute. This rewards will be
 * distributed between all yield farms in the global farm.
 * - `planned_yielding_periods`: planned number of periods to distribute `total_rewards`.
 * WARN: THIS IS NOT HARD DEADLINE. Not all rewards have to be distributed in
 * `planned_yielding_periods`. Rewards are distributed based on the situation in the yield
 * farms and can be distributed in a longer time frame but never in the shorter time frame.
 * - `blocks_per_period`:  number of blocks in a single period. Min. number of blocks per
 * period is 1.
 * - `incentivized_asset`: asset to be incentivized in XYK pools. All yield farms added into
 * liq. mining program have to have `incentivized_asset` in their pair.
 * - `reward_currency`: payoff currency of rewards.
 * - `owner`: liq. mining program owner.
 * - `yield_per_period`: percentage return on `reward_currency` of all farms p.a.
 * - `min_deposit`: minimum amount which can be deposited to the farm
 * - `price_adjustment`:
 * Emits `GlobalFarmCreated` event when successful.
 */
export interface XYKLiquidityMiningCall_create_global_farm {
    __kind: 'create_global_farm'
    totalRewards: bigint
    plannedYieldingPeriods: number
    blocksPerPeriod: number
    incentivizedAsset: number
    rewardCurrency: number
    owner: AccountId32
    yieldPerPeriod: Perquintill
    minDeposit: bigint
    priceAdjustment: FixedU128
}

/**
 * Add yield farm for given `asset_pair` XYK pool.
 *  
 * Only farm owner can perform this action.
 * 
 * Only XYKs with `asset_pair` with `incentivized_asset` can be added into the farm. XYK
 * pool for `asset_pair` has to exist to successfully create yield farm.
 * Yield farm for same `asset_pair` can exist only once in the global farm.
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `farm_id`: global farm id to which a yield farm will be added.
 * - `asset_pair`: asset pair identifying yield farm. Liq. mining will be allowed for this
 * `asset_pair` and one of the assets in the pair must be `incentivized_asset`.
 * - `multiplier`: yield farm multiplier.
 * - `loyalty_curve`: curve to calculate loyalty multiplier to distribute rewards to users
 * with time incentive. `None` means no loyalty multiplier.
 * 
 * Emits `YieldFarmCreated` event when successful.
 */
export interface XYKLiquidityMiningCall_create_yield_farm {
    __kind: 'create_yield_farm'
    globalFarmId: number
    assetPair: AssetPair
    multiplier: FixedU128
    loyaltyCurve?: (LoyaltyCurve | undefined)
}

/**
 * Deposit LP shares to a liq. mining.
 * 
 * This function transfers LP shares from `origin` to pallet's account and mint nft for
 * `origin` account. Minted nft represents deposit in the liq. mining.
 * 
 * Parameters:
 * - `origin`: account depositing LP shares. This account has to have at least
 * `shares_amount` of LP shares.
 * - `global_farm_id`: id of global farm to which user wants to deposit LP shares.
 * - `yield_farm_id`: id of yield farm to deposit to.
 * - `asset_pair`: asset pair identifying LP shares user wants to deposit.
 * - `shares_amount`: amount of LP shares user wants to deposit.
 * 
 * Emits `SharesDeposited` event when successful.
 */
export interface XYKLiquidityMiningCall_deposit_shares {
    __kind: 'deposit_shares'
    globalFarmId: number
    yieldFarmId: number
    assetPair: AssetPair
    sharesAmount: bigint
}

/**
 * Redeposit already locked LP shares to another yield farm.
 * 
 * This function create yield farm entry for existing deposit. LP shares are not transferred
 * and amount of LP shares is based on existing deposit.
 * 
 * This function DOESN'T create new deposit.
 * 
 * Parameters:
 * - `origin`: account depositing LP shares. This account have to have at least
 * - `global_farm_id`: global farm identifier.
 * - `yield_farm_id`: yield farm identifier redepositing to.
 * - `asset_pair`: asset pair identifying LP shares user want to deposit.
 * - `deposit_id`: identifier of the deposit.
 * 
 * Emits `SharesRedeposited` event when successful.
 */
export interface XYKLiquidityMiningCall_redeposit_shares {
    __kind: 'redeposit_shares'
    globalFarmId: number
    yieldFarmId: number
    assetPair: AssetPair
    depositId: bigint
}

/**
 * Resume yield farm for stopped yield farm.
 * 
 * This function resume incentivization from `GlobalFarm` and restore full functionality
 * for yield farm. Users will be able to deposit, claim and withdraw again.
 * 
 * WARN: Yield farm is NOT rewarded for time it was stopped.
 * 
 * Only farm owner can perform this action.
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `global_farm_id`: global farm id in which yield farm will be resumed.
 * - `yield_farm_id`: id of yield farm to be resumed.
 * - `asset_pair`: asset pair identifying yield farm in global farm.
 * - `multiplier`: yield farm multiplier in the farm.
 * 
 * Emits `YieldFarmResumed` event when successful.
 */
export interface XYKLiquidityMiningCall_resume_yield_farm {
    __kind: 'resume_yield_farm'
    globalFarmId: number
    yieldFarmId: number
    assetPair: AssetPair
    multiplier: FixedU128
}

/**
 * Stop liq. miming for specific yield farm.
 * 
 * This function claims rewards from `GlobalFarm` last time and stops yield farm
 * incentivization from a `GlobalFarm`. Users will be able to only withdraw
 * shares(with claiming) after calling this function.
 * `deposit_shares()` and `claim_rewards()` are not allowed on canceled yield farm.
 *  
 * Only farm owner can perform this action.
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `global_farm_id`: farm id in which yield farm will be canceled.
 * - `asset_pair`: asset pair identifying yield farm in the farm.
 * 
 * Emits `YieldFarmStopped` event when successful.
 */
export interface XYKLiquidityMiningCall_stop_yield_farm {
    __kind: 'stop_yield_farm'
    globalFarmId: number
    assetPair: AssetPair
}

/**
 * Terminate existing liq. mining program.
 * 
 * Only farm owner can perform this action.
 * 
 * WARN: To successfully terminate a farm, farm have to be empty(all yield farms in he global farm must be terminated).
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `global_farm_id`: id of global farm to be terminated.
 * 
 * Emits `GlobalFarmTerminated` event when successful.
 */
export interface XYKLiquidityMiningCall_terminate_global_farm {
    __kind: 'terminate_global_farm'
    globalFarmId: number
}

/**
 * Remove yield farm
 * 
 * This function marks a yield farm as ready to be removed from storage when it's empty. Users will
 * be able to only withdraw shares(without claiming rewards from yield farm). Unpaid rewards
 * will be transferred back to global farm and will be used to distribute to other yield farms.
 * 
 * Yield farm must be stopped before calling this function.
 * 
 * Only global farm's owner can perform this action. Yield farm stays in the storage until it's
 * empty(all farm entries are withdrawn). Last withdrawn from yield farm trigger removing from
 * the storage.
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `global_farm_id`: farm id from which yield farm should be terminated.
 * - `yield_farm_id`: id of yield farm to be terminated.
 * - `asset_pair`: asset pair identifying yield farm in the global farm.
 * 
 * Emits `YieldFarmTerminated` event when successful.
 */
export interface XYKLiquidityMiningCall_terminate_yield_farm {
    __kind: 'terminate_yield_farm'
    globalFarmId: number
    yieldFarmId: number
    assetPair: AssetPair
}

/**
 * Update global farm's prices adjustment.
 * 
 * Only farm's owner can perform this action.
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `global_farm_id`: id of the global farm to update
 * - `price_adjustment`: new value for price adjustment
 * 
 * Emits `GlobalFarmUpdated` event when successful.
 */
export interface XYKLiquidityMiningCall_update_global_farm {
    __kind: 'update_global_farm'
    globalFarmId: number
    priceAdjustment: FixedU128
}

/**
 * Update yield farm multiplier.
 *  
 * Only farm owner can perform this action.
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `global_farm_id`: global farm id in which yield farm will be updated.
 * - `asset_pair`: asset pair identifying yield farm in global farm.
 * - `multiplier`: new yield farm multiplier.
 * 
 * Emits `YieldFarmUpdated` event when successful.
 */
export interface XYKLiquidityMiningCall_update_yield_farm {
    __kind: 'update_yield_farm'
    globalFarmId: number
    assetPair: AssetPair
    multiplier: FixedU128
}

/**
 * Withdraw LP shares from liq. mining with reward claiming if possible.
 * 
 * List of possible cases of transfers of LP shares and claimed rewards:
 * 
 * * yield farm is active(yield farm is not stopped) - claim and transfer rewards(if it
 * wasn't claimed in this period) and transfer LP shares.
 * * liq. mining is stopped - claim and transfer rewards(if it
 * wasn't claimed in this period) and transfer LP shares.
 * * yield farm was terminated - only LP shares will be transferred.
 * * farm was terminated - only LP shares will be transferred.
 * 
 * User's unclaimable rewards will be transferred back to global farm's account.
 * 
 * Parameters:
 * - `origin`: account owner of deposit(nft).
 * - `deposit_id`: nft id representing deposit in the yield farm.
 * - `yield_farm_id`: yield farm identifier to dithdraw shares from.
 * - `asset_pair`: asset pair identifying yield farm in global farm.
 * 
 * Emits:
 * * `RewardClaimed` if claim happen
 * * `SharesWithdrawn` event when successful
 */
export interface XYKLiquidityMiningCall_withdraw_shares {
    __kind: 'withdraw_shares'
    depositId: bigint
    yieldFarmId: number
    assetPair: AssetPair
}

export type Perquintill = bigint

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const XYKCall: sts.Type<XYKCall> = sts.closedEnum(() => {
    return  {
        add_liquidity: sts.enumStruct({
            assetA: sts.number(),
            assetB: sts.number(),
            amountA: sts.bigint(),
            amountBMaxLimit: sts.bigint(),
        }),
        buy: sts.enumStruct({
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            maxLimit: sts.bigint(),
            discount: sts.boolean(),
        }),
        create_pool: sts.enumStruct({
            assetA: sts.number(),
            amountA: sts.bigint(),
            assetB: sts.number(),
            amountB: sts.bigint(),
        }),
        remove_liquidity: sts.enumStruct({
            assetA: sts.number(),
            assetB: sts.number(),
            liquidityAmount: sts.bigint(),
        }),
        sell: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amount: sts.bigint(),
            maxLimit: sts.bigint(),
            discount: sts.boolean(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type XYKCall = XYKCall_add_liquidity | XYKCall_buy | XYKCall_create_pool | XYKCall_remove_liquidity | XYKCall_sell

/**
 * Add liquidity to previously created asset pair pool.
 * 
 * Shares are issued with current price.
 * 
 * Emits `LiquidityAdded` event when successful.
 */
export interface XYKCall_add_liquidity {
    __kind: 'add_liquidity'
    assetA: number
    assetB: number
    amountA: bigint
    amountBMaxLimit: bigint
}

/**
 * Trade asset in for asset out.
 * 
 * Executes a swap of `asset_in` for `asset_out`. Price is determined by the liquidity pool.
 * 
 * `max_limit` - maximum amount of `asset_in` to be sold in exchange for `asset_out`.
 * 
 * Emits `BuyExecuted` when successful.
 */
export interface XYKCall_buy {
    __kind: 'buy'
    assetOut: number
    assetIn: number
    amount: bigint
    maxLimit: bigint
    discount: boolean
}

/**
 * Create new pool for given asset pair.
 * 
 * Registers new pool for given asset pair (`asset a` and `asset b`) in asset registry.
 * Asset registry creates new id or returns previously created one if such pool existed before.
 * 
 * Pool is created with initial liquidity provided by `origin`.
 * Shares are issued with specified initial price and represents proportion of asset in the pool.
 * 
 * Emits `PoolCreated` event when successful.
 */
export interface XYKCall_create_pool {
    __kind: 'create_pool'
    assetA: number
    amountA: bigint
    assetB: number
    amountB: bigint
}

/**
 * Remove liquidity from specific liquidity pool in the form of burning shares.
 * 
 * If liquidity in the pool reaches 0, it is destroyed.
 * 
 * Emits 'LiquidityRemoved' when successful.
 * Emits 'PoolDestroyed' when pool is destroyed.
 */
export interface XYKCall_remove_liquidity {
    __kind: 'remove_liquidity'
    assetA: number
    assetB: number
    liquidityAmount: bigint
}

/**
 * Trade asset in for asset out.
 * 
 * Executes a swap of `asset_in` for `asset_out`. Price is determined by the liquidity pool.
 * 
 * `max_limit` - minimum amount of `asset_out` / amount of asset_out to be obtained from the pool in exchange for `asset_in`.
 * 
 * Emits `SellExecuted` when successful.
 */
export interface XYKCall_sell {
    __kind: 'sell'
    assetIn: number
    assetOut: number
    amount: bigint
    maxLimit: bigint
    discount: boolean
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const XTokensCall: sts.Type<XTokensCall> = sts.closedEnum(() => {
    return  {
        transfer: sts.enumStruct({
            currencyId: sts.number(),
            amount: sts.bigint(),
            dest: VersionedLocation,
            destWeightLimit: V3WeightLimit,
        }),
        transfer_multiasset: sts.enumStruct({
            asset: VersionedAsset,
            dest: VersionedLocation,
            destWeightLimit: V3WeightLimit,
        }),
        transfer_multiasset_with_fee: sts.enumStruct({
            asset: VersionedAsset,
            fee: VersionedAsset,
            dest: VersionedLocation,
            destWeightLimit: V3WeightLimit,
        }),
        transfer_multiassets: sts.enumStruct({
            assets: VersionedAssets,
            feeItem: sts.number(),
            dest: VersionedLocation,
            destWeightLimit: V3WeightLimit,
        }),
        transfer_multicurrencies: sts.enumStruct({
            currencies: sts.array(() => sts.tuple(() => [sts.number(), sts.bigint()])),
            feeItem: sts.number(),
            dest: VersionedLocation,
            destWeightLimit: V3WeightLimit,
        }),
        transfer_with_fee: sts.enumStruct({
            currencyId: sts.number(),
            amount: sts.bigint(),
            fee: sts.bigint(),
            dest: VersionedLocation,
            destWeightLimit: V3WeightLimit,
        }),
    }
})

export const VersionedAssets: sts.Type<VersionedAssets> = sts.closedEnum(() => {
    return  {
        V2: sts.array(() => V2MultiAsset),
        V3: sts.array(() => V3MultiAsset),
        V4: sts.array(() => V4Asset),
    }
})

export const V4Asset: sts.Type<V4Asset> = sts.struct(() => {
    return  {
        id: V4AssetId,
        fun: V4Fungibility,
    }
})

export const V4Fungibility: sts.Type<V4Fungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.bigint(),
        NonFungible: V4AssetInstance,
    }
})

export const V4AssetInstance: sts.Type<V4AssetInstance> = sts.closedEnum(() => {
    return  {
        Array16: sts.bytes(),
        Array32: sts.bytes(),
        Array4: sts.bytes(),
        Array8: sts.bytes(),
        Index: sts.bigint(),
        Undefined: sts.unit(),
    }
})

export type V4AssetInstance = V4AssetInstance_Array16 | V4AssetInstance_Array32 | V4AssetInstance_Array4 | V4AssetInstance_Array8 | V4AssetInstance_Index | V4AssetInstance_Undefined

export interface V4AssetInstance_Array16 {
    __kind: 'Array16'
    value: Bytes
}

export interface V4AssetInstance_Array32 {
    __kind: 'Array32'
    value: Bytes
}

export interface V4AssetInstance_Array4 {
    __kind: 'Array4'
    value: Bytes
}

export interface V4AssetInstance_Array8 {
    __kind: 'Array8'
    value: Bytes
}

export interface V4AssetInstance_Index {
    __kind: 'Index'
    value: bigint
}

export interface V4AssetInstance_Undefined {
    __kind: 'Undefined'
}

export type V4Fungibility = V4Fungibility_Fungible | V4Fungibility_NonFungible

export interface V4Fungibility_Fungible {
    __kind: 'Fungible'
    value: bigint
}

export interface V4Fungibility_NonFungible {
    __kind: 'NonFungible'
    value: V4AssetInstance
}

export const V4AssetId: sts.Type<V4AssetId> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V4Junctions,
    }
})

export interface V4AssetId {
    parents: number
    interior: V4Junctions
}

export interface V4Asset {
    id: V4AssetId
    fun: V4Fungibility
}

export const V3MultiAsset: sts.Type<V3MultiAsset> = sts.struct(() => {
    return  {
        id: V3AssetId,
        fun: V3Fungibility,
    }
})

export const V3Fungibility: sts.Type<V3Fungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.bigint(),
        NonFungible: V3AssetInstance,
    }
})

export const V3AssetInstance: sts.Type<V3AssetInstance> = sts.closedEnum(() => {
    return  {
        Array16: sts.bytes(),
        Array32: sts.bytes(),
        Array4: sts.bytes(),
        Array8: sts.bytes(),
        Index: sts.bigint(),
        Undefined: sts.unit(),
    }
})

export type V3AssetInstance = V3AssetInstance_Array16 | V3AssetInstance_Array32 | V3AssetInstance_Array4 | V3AssetInstance_Array8 | V3AssetInstance_Index | V3AssetInstance_Undefined

export interface V3AssetInstance_Array16 {
    __kind: 'Array16'
    value: Bytes
}

export interface V3AssetInstance_Array32 {
    __kind: 'Array32'
    value: Bytes
}

export interface V3AssetInstance_Array4 {
    __kind: 'Array4'
    value: Bytes
}

export interface V3AssetInstance_Array8 {
    __kind: 'Array8'
    value: Bytes
}

export interface V3AssetInstance_Index {
    __kind: 'Index'
    value: bigint
}

export interface V3AssetInstance_Undefined {
    __kind: 'Undefined'
}

export type V3Fungibility = V3Fungibility_Fungible | V3Fungibility_NonFungible

export interface V3Fungibility_Fungible {
    __kind: 'Fungible'
    value: bigint
}

export interface V3Fungibility_NonFungible {
    __kind: 'NonFungible'
    value: V3AssetInstance
}

export const V3AssetId: sts.Type<V3AssetId> = sts.closedEnum(() => {
    return  {
        Abstract: sts.bytes(),
        Concrete: V3MultiLocation,
    }
})

export const V3MultiLocation: sts.Type<V3MultiLocation> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V3Junctions,
    }
})

export const V3Junctions: sts.Type<V3Junctions> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: V3Junction,
        X2: sts.tuple(() => [V3Junction, V3Junction]),
        X3: sts.tuple(() => [V3Junction, V3Junction, V3Junction]),
        X4: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction]),
        X5: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]),
        X6: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]),
        X7: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]),
        X8: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]),
    }
})

export const V3Junction: sts.Type<V3Junction> = sts.closedEnum(() => {
    return  {
        AccountId32: sts.enumStruct({
            network: sts.option(() => V3NetworkId),
            id: sts.bytes(),
        }),
        AccountIndex64: sts.enumStruct({
            network: sts.option(() => V3NetworkId),
            index: sts.bigint(),
        }),
        AccountKey20: sts.enumStruct({
            network: sts.option(() => V3NetworkId),
            key: sts.bytes(),
        }),
        GeneralIndex: sts.bigint(),
        GeneralKey: sts.enumStruct({
            length: sts.number(),
            data: sts.bytes(),
        }),
        GlobalConsensus: V3NetworkId,
        OnlyChild: sts.unit(),
        PalletInstance: sts.number(),
        Parachain: sts.number(),
        Plurality: sts.enumStruct({
            id: V3BodyId,
            part: V3BodyPart,
        }),
    }
})

export const V3NetworkId: sts.Type<V3NetworkId> = sts.closedEnum(() => {
    return  {
        BitcoinCash: sts.unit(),
        BitcoinCore: sts.unit(),
        ByFork: sts.enumStruct({
            blockNumber: sts.bigint(),
            blockHash: sts.bytes(),
        }),
        ByGenesis: sts.bytes(),
        Ethereum: sts.enumStruct({
            chainId: sts.bigint(),
        }),
        Kusama: sts.unit(),
        Polkadot: sts.unit(),
        PolkadotBulletin: sts.unit(),
        Rococo: sts.unit(),
        Westend: sts.unit(),
        Wococo: sts.unit(),
    }
})

export type V3NetworkId = V3NetworkId_BitcoinCash | V3NetworkId_BitcoinCore | V3NetworkId_ByFork | V3NetworkId_ByGenesis | V3NetworkId_Ethereum | V3NetworkId_Kusama | V3NetworkId_Polkadot | V3NetworkId_PolkadotBulletin | V3NetworkId_Rococo | V3NetworkId_Westend | V3NetworkId_Wococo

export interface V3NetworkId_BitcoinCash {
    __kind: 'BitcoinCash'
}

export interface V3NetworkId_BitcoinCore {
    __kind: 'BitcoinCore'
}

export interface V3NetworkId_ByFork {
    __kind: 'ByFork'
    blockNumber: bigint
    blockHash: Bytes
}

export interface V3NetworkId_ByGenesis {
    __kind: 'ByGenesis'
    value: Bytes
}

export interface V3NetworkId_Ethereum {
    __kind: 'Ethereum'
    chainId: bigint
}

export interface V3NetworkId_Kusama {
    __kind: 'Kusama'
}

export interface V3NetworkId_Polkadot {
    __kind: 'Polkadot'
}

export interface V3NetworkId_PolkadotBulletin {
    __kind: 'PolkadotBulletin'
}

export interface V3NetworkId_Rococo {
    __kind: 'Rococo'
}

export interface V3NetworkId_Westend {
    __kind: 'Westend'
}

export interface V3NetworkId_Wococo {
    __kind: 'Wococo'
}

export type V3Junction = V3Junction_AccountId32 | V3Junction_AccountIndex64 | V3Junction_AccountKey20 | V3Junction_GeneralIndex | V3Junction_GeneralKey | V3Junction_GlobalConsensus | V3Junction_OnlyChild | V3Junction_PalletInstance | V3Junction_Parachain | V3Junction_Plurality

export interface V3Junction_AccountId32 {
    __kind: 'AccountId32'
    network?: (V3NetworkId | undefined)
    id: Bytes
}

export interface V3Junction_AccountIndex64 {
    __kind: 'AccountIndex64'
    network?: (V3NetworkId | undefined)
    index: bigint
}

export interface V3Junction_AccountKey20 {
    __kind: 'AccountKey20'
    network?: (V3NetworkId | undefined)
    key: Bytes
}

export interface V3Junction_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface V3Junction_GeneralKey {
    __kind: 'GeneralKey'
    length: number
    data: Bytes
}

export interface V3Junction_GlobalConsensus {
    __kind: 'GlobalConsensus'
    value: V3NetworkId
}

export interface V3Junction_OnlyChild {
    __kind: 'OnlyChild'
}

export interface V3Junction_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface V3Junction_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface V3Junction_Plurality {
    __kind: 'Plurality'
    id: V3BodyId
    part: V3BodyPart
}

export type V3Junctions = V3Junctions_Here | V3Junctions_X1 | V3Junctions_X2 | V3Junctions_X3 | V3Junctions_X4 | V3Junctions_X5 | V3Junctions_X6 | V3Junctions_X7 | V3Junctions_X8

export interface V3Junctions_Here {
    __kind: 'Here'
}

export interface V3Junctions_X1 {
    __kind: 'X1'
    value: V3Junction
}

export interface V3Junctions_X2 {
    __kind: 'X2'
    value: [V3Junction, V3Junction]
}

export interface V3Junctions_X3 {
    __kind: 'X3'
    value: [V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X4 {
    __kind: 'X4'
    value: [V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X5 {
    __kind: 'X5'
    value: [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X6 {
    __kind: 'X6'
    value: [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X7 {
    __kind: 'X7'
    value: [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X8 {
    __kind: 'X8'
    value: [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3MultiLocation {
    parents: number
    interior: V3Junctions
}

export type V3AssetId = V3AssetId_Abstract | V3AssetId_Concrete

export interface V3AssetId_Abstract {
    __kind: 'Abstract'
    value: Bytes
}

export interface V3AssetId_Concrete {
    __kind: 'Concrete'
    value: V3MultiLocation
}

export interface V3MultiAsset {
    id: V3AssetId
    fun: V3Fungibility
}

export const V2MultiAsset: sts.Type<V2MultiAsset> = sts.struct(() => {
    return  {
        id: V2AssetId,
        fun: V2Fungibility,
    }
})

export const V2Fungibility: sts.Type<V2Fungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.bigint(),
        NonFungible: V2AssetInstance,
    }
})

export const V2AssetInstance: sts.Type<V2AssetInstance> = sts.closedEnum(() => {
    return  {
        Array16: sts.bytes(),
        Array32: sts.bytes(),
        Array4: sts.bytes(),
        Array8: sts.bytes(),
        Blob: sts.bytes(),
        Index: sts.bigint(),
        Undefined: sts.unit(),
    }
})

export type V2AssetInstance = V2AssetInstance_Array16 | V2AssetInstance_Array32 | V2AssetInstance_Array4 | V2AssetInstance_Array8 | V2AssetInstance_Blob | V2AssetInstance_Index | V2AssetInstance_Undefined

export interface V2AssetInstance_Array16 {
    __kind: 'Array16'
    value: Bytes
}

export interface V2AssetInstance_Array32 {
    __kind: 'Array32'
    value: Bytes
}

export interface V2AssetInstance_Array4 {
    __kind: 'Array4'
    value: Bytes
}

export interface V2AssetInstance_Array8 {
    __kind: 'Array8'
    value: Bytes
}

export interface V2AssetInstance_Blob {
    __kind: 'Blob'
    value: Bytes
}

export interface V2AssetInstance_Index {
    __kind: 'Index'
    value: bigint
}

export interface V2AssetInstance_Undefined {
    __kind: 'Undefined'
}

export type V2Fungibility = V2Fungibility_Fungible | V2Fungibility_NonFungible

export interface V2Fungibility_Fungible {
    __kind: 'Fungible'
    value: bigint
}

export interface V2Fungibility_NonFungible {
    __kind: 'NonFungible'
    value: V2AssetInstance
}

export const V2AssetId: sts.Type<V2AssetId> = sts.closedEnum(() => {
    return  {
        Abstract: sts.bytes(),
        Concrete: V2MultiLocation,
    }
})

export const V2MultiLocation: sts.Type<V2MultiLocation> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V2Junctions,
    }
})

export const V2Junctions: sts.Type<V2Junctions> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: V2Junction,
        X2: sts.tuple(() => [V2Junction, V2Junction]),
        X3: sts.tuple(() => [V2Junction, V2Junction, V2Junction]),
        X4: sts.tuple(() => [V2Junction, V2Junction, V2Junction, V2Junction]),
        X5: sts.tuple(() => [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]),
        X6: sts.tuple(() => [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]),
        X7: sts.tuple(() => [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]),
        X8: sts.tuple(() => [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]),
    }
})

export const V2Junction: sts.Type<V2Junction> = sts.closedEnum(() => {
    return  {
        AccountId32: sts.enumStruct({
            network: V2NetworkId,
            id: sts.bytes(),
        }),
        AccountIndex64: sts.enumStruct({
            network: V2NetworkId,
            index: sts.bigint(),
        }),
        AccountKey20: sts.enumStruct({
            network: V2NetworkId,
            key: sts.bytes(),
        }),
        GeneralIndex: sts.bigint(),
        GeneralKey: WeakBoundedVec,
        OnlyChild: sts.unit(),
        PalletInstance: sts.number(),
        Parachain: sts.number(),
        Plurality: sts.enumStruct({
            id: V2BodyId,
            part: V2BodyPart,
        }),
    }
})

export const V2BodyPart: sts.Type<V2BodyPart> = sts.closedEnum(() => {
    return  {
        AtLeastProportion: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Fraction: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Members: sts.enumStruct({
            count: sts.number(),
        }),
        MoreThanProportion: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Voice: sts.unit(),
    }
})

export type V2BodyPart = V2BodyPart_AtLeastProportion | V2BodyPart_Fraction | V2BodyPart_Members | V2BodyPart_MoreThanProportion | V2BodyPart_Voice

export interface V2BodyPart_AtLeastProportion {
    __kind: 'AtLeastProportion'
    nom: number
    denom: number
}

export interface V2BodyPart_Fraction {
    __kind: 'Fraction'
    nom: number
    denom: number
}

export interface V2BodyPart_Members {
    __kind: 'Members'
    count: number
}

export interface V2BodyPart_MoreThanProportion {
    __kind: 'MoreThanProportion'
    nom: number
    denom: number
}

export interface V2BodyPart_Voice {
    __kind: 'Voice'
}

export const V2BodyId: sts.Type<V2BodyId> = sts.closedEnum(() => {
    return  {
        Administration: sts.unit(),
        Defense: sts.unit(),
        Executive: sts.unit(),
        Index: sts.number(),
        Judicial: sts.unit(),
        Legislative: sts.unit(),
        Named: WeakBoundedVec,
        Technical: sts.unit(),
        Treasury: sts.unit(),
        Unit: sts.unit(),
    }
})

export type V2BodyId = V2BodyId_Administration | V2BodyId_Defense | V2BodyId_Executive | V2BodyId_Index | V2BodyId_Judicial | V2BodyId_Legislative | V2BodyId_Named | V2BodyId_Technical | V2BodyId_Treasury | V2BodyId_Unit

export interface V2BodyId_Administration {
    __kind: 'Administration'
}

export interface V2BodyId_Defense {
    __kind: 'Defense'
}

export interface V2BodyId_Executive {
    __kind: 'Executive'
}

export interface V2BodyId_Index {
    __kind: 'Index'
    value: number
}

export interface V2BodyId_Judicial {
    __kind: 'Judicial'
}

export interface V2BodyId_Legislative {
    __kind: 'Legislative'
}

export interface V2BodyId_Named {
    __kind: 'Named'
    value: WeakBoundedVec
}

export interface V2BodyId_Technical {
    __kind: 'Technical'
}

export interface V2BodyId_Treasury {
    __kind: 'Treasury'
}

export interface V2BodyId_Unit {
    __kind: 'Unit'
}

export type WeakBoundedVec = Bytes

export const WeakBoundedVec = sts.bytes()

export const V2NetworkId: sts.Type<V2NetworkId> = sts.closedEnum(() => {
    return  {
        Any: sts.unit(),
        Kusama: sts.unit(),
        Named: WeakBoundedVec,
        Polkadot: sts.unit(),
    }
})

export type V2NetworkId = V2NetworkId_Any | V2NetworkId_Kusama | V2NetworkId_Named | V2NetworkId_Polkadot

export interface V2NetworkId_Any {
    __kind: 'Any'
}

export interface V2NetworkId_Kusama {
    __kind: 'Kusama'
}

export interface V2NetworkId_Named {
    __kind: 'Named'
    value: WeakBoundedVec
}

export interface V2NetworkId_Polkadot {
    __kind: 'Polkadot'
}

export type V2Junction = V2Junction_AccountId32 | V2Junction_AccountIndex64 | V2Junction_AccountKey20 | V2Junction_GeneralIndex | V2Junction_GeneralKey | V2Junction_OnlyChild | V2Junction_PalletInstance | V2Junction_Parachain | V2Junction_Plurality

export interface V2Junction_AccountId32 {
    __kind: 'AccountId32'
    network: V2NetworkId
    id: Bytes
}

export interface V2Junction_AccountIndex64 {
    __kind: 'AccountIndex64'
    network: V2NetworkId
    index: bigint
}

export interface V2Junction_AccountKey20 {
    __kind: 'AccountKey20'
    network: V2NetworkId
    key: Bytes
}

export interface V2Junction_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface V2Junction_GeneralKey {
    __kind: 'GeneralKey'
    value: WeakBoundedVec
}

export interface V2Junction_OnlyChild {
    __kind: 'OnlyChild'
}

export interface V2Junction_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface V2Junction_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface V2Junction_Plurality {
    __kind: 'Plurality'
    id: V2BodyId
    part: V2BodyPart
}

export type V2Junctions = V2Junctions_Here | V2Junctions_X1 | V2Junctions_X2 | V2Junctions_X3 | V2Junctions_X4 | V2Junctions_X5 | V2Junctions_X6 | V2Junctions_X7 | V2Junctions_X8

export interface V2Junctions_Here {
    __kind: 'Here'
}

export interface V2Junctions_X1 {
    __kind: 'X1'
    value: V2Junction
}

export interface V2Junctions_X2 {
    __kind: 'X2'
    value: [V2Junction, V2Junction]
}

export interface V2Junctions_X3 {
    __kind: 'X3'
    value: [V2Junction, V2Junction, V2Junction]
}

export interface V2Junctions_X4 {
    __kind: 'X4'
    value: [V2Junction, V2Junction, V2Junction, V2Junction]
}

export interface V2Junctions_X5 {
    __kind: 'X5'
    value: [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]
}

export interface V2Junctions_X6 {
    __kind: 'X6'
    value: [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]
}

export interface V2Junctions_X7 {
    __kind: 'X7'
    value: [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]
}

export interface V2Junctions_X8 {
    __kind: 'X8'
    value: [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]
}

export interface V2MultiLocation {
    parents: number
    interior: V2Junctions
}

export type V2AssetId = V2AssetId_Abstract | V2AssetId_Concrete

export interface V2AssetId_Abstract {
    __kind: 'Abstract'
    value: Bytes
}

export interface V2AssetId_Concrete {
    __kind: 'Concrete'
    value: V2MultiLocation
}

export interface V2MultiAsset {
    id: V2AssetId
    fun: V2Fungibility
}

export type VersionedAssets = VersionedAssets_V2 | VersionedAssets_V3 | VersionedAssets_V4

export interface VersionedAssets_V2 {
    __kind: 'V2'
    value: V2MultiAsset[]
}

export interface VersionedAssets_V3 {
    __kind: 'V3'
    value: V3MultiAsset[]
}

export interface VersionedAssets_V4 {
    __kind: 'V4'
    value: V4Asset[]
}

export const VersionedAsset: sts.Type<VersionedAsset> = sts.closedEnum(() => {
    return  {
        V2: V2MultiAsset,
        V3: V3MultiAsset,
        V4: V4Asset,
    }
})

export type VersionedAsset = VersionedAsset_V2 | VersionedAsset_V3 | VersionedAsset_V4

export interface VersionedAsset_V2 {
    __kind: 'V2'
    value: V2MultiAsset
}

export interface VersionedAsset_V3 {
    __kind: 'V3'
    value: V3MultiAsset
}

export interface VersionedAsset_V4 {
    __kind: 'V4'
    value: V4Asset
}

export const V3WeightLimit: sts.Type<V3WeightLimit> = sts.closedEnum(() => {
    return  {
        Limited: Weight,
        Unlimited: sts.unit(),
    }
})

export type V3WeightLimit = V3WeightLimit_Limited | V3WeightLimit_Unlimited

export interface V3WeightLimit_Limited {
    __kind: 'Limited'
    value: Weight
}

export interface V3WeightLimit_Unlimited {
    __kind: 'Unlimited'
}

export const VersionedLocation: sts.Type<VersionedLocation> = sts.closedEnum(() => {
    return  {
        V2: V2MultiLocation,
        V3: V3MultiLocation,
        V4: V4Location,
    }
})

export type VersionedLocation = VersionedLocation_V2 | VersionedLocation_V3 | VersionedLocation_V4

export interface VersionedLocation_V2 {
    __kind: 'V2'
    value: V2MultiLocation
}

export interface VersionedLocation_V3 {
    __kind: 'V3'
    value: V3MultiLocation
}

export interface VersionedLocation_V4 {
    __kind: 'V4'
    value: V4Location
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type XTokensCall = XTokensCall_transfer | XTokensCall_transfer_multiasset | XTokensCall_transfer_multiasset_with_fee | XTokensCall_transfer_multiassets | XTokensCall_transfer_multicurrencies | XTokensCall_transfer_with_fee

/**
 * Transfer native currencies.
 * 
 * `dest_weight_limit` is the weight for XCM execution on the dest
 * chain, and it would be charged from the transferred assets. If set
 * below requirements, the execution may fail and assets wouldn't be
 * received.
 * 
 * It's a no-op if any error on local XCM execution or message sending.
 * Note sending assets out per se doesn't guarantee they would be
 * received. Receiving depends on if the XCM message could be delivered
 * by the network, and if the receiving chain would handle
 * messages correctly.
 */
export interface XTokensCall_transfer {
    __kind: 'transfer'
    currencyId: number
    amount: bigint
    dest: VersionedLocation
    destWeightLimit: V3WeightLimit
}

/**
 * Transfer `Asset`.
 * 
 * `dest_weight_limit` is the weight for XCM execution on the dest
 * chain, and it would be charged from the transferred assets. If set
 * below requirements, the execution may fail and assets wouldn't be
 * received.
 * 
 * It's a no-op if any error on local XCM execution or message sending.
 * Note sending assets out per se doesn't guarantee they would be
 * received. Receiving depends on if the XCM message could be delivered
 * by the network, and if the receiving chain would handle
 * messages correctly.
 */
export interface XTokensCall_transfer_multiasset {
    __kind: 'transfer_multiasset'
    asset: VersionedAsset
    dest: VersionedLocation
    destWeightLimit: V3WeightLimit
}

/**
 * Transfer `Asset` specifying the fee and amount as separate.
 * 
 * `dest_weight_limit` is the weight for XCM execution on the dest
 * chain, and it would be charged from the transferred assets. If set
 * below requirements, the execution may fail and assets wouldn't be
 * received.
 * 
 * `fee` is the Asset to be spent to pay for execution in
 * destination chain. Both fee and amount will be subtracted form the
 * callers balance For now we only accept fee and asset having the same
 * `Location` id.
 * 
 * If `fee` is not high enough to cover for the execution costs in the
 * destination chain, then the assets will be trapped in the
 * destination chain
 * 
 * It's a no-op if any error on local XCM execution or message sending.
 * Note sending assets out per se doesn't guarantee they would be
 * received. Receiving depends on if the XCM message could be delivered
 * by the network, and if the receiving chain would handle
 * messages correctly.
 */
export interface XTokensCall_transfer_multiasset_with_fee {
    __kind: 'transfer_multiasset_with_fee'
    asset: VersionedAsset
    fee: VersionedAsset
    dest: VersionedLocation
    destWeightLimit: V3WeightLimit
}

/**
 * Transfer several `Asset` specifying the item to be used as fee
 * 
 * `dest_weight_limit` is the weight for XCM execution on the dest
 * chain, and it would be charged from the transferred assets. If set
 * below requirements, the execution may fail and assets wouldn't be
 * received.
 * 
 * `fee_item` is index of the Assets that we want to use for
 * payment
 * 
 * It's a no-op if any error on local XCM execution or message sending.
 * Note sending assets out per se doesn't guarantee they would be
 * received. Receiving depends on if the XCM message could be delivered
 * by the network, and if the receiving chain would handle
 * messages correctly.
 */
export interface XTokensCall_transfer_multiassets {
    __kind: 'transfer_multiassets'
    assets: VersionedAssets
    feeItem: number
    dest: VersionedLocation
    destWeightLimit: V3WeightLimit
}

/**
 * Transfer several currencies specifying the item to be used as fee
 * 
 * `dest_weight_limit` is the weight for XCM execution on the dest
 * chain, and it would be charged from the transferred assets. If set
 * below requirements, the execution may fail and assets wouldn't be
 * received.
 * 
 * `fee_item` is index of the currencies tuple that we want to use for
 * payment
 * 
 * It's a no-op if any error on local XCM execution or message sending.
 * Note sending assets out per se doesn't guarantee they would be
 * received. Receiving depends on if the XCM message could be delivered
 * by the network, and if the receiving chain would handle
 * messages correctly.
 */
export interface XTokensCall_transfer_multicurrencies {
    __kind: 'transfer_multicurrencies'
    currencies: [number, bigint][]
    feeItem: number
    dest: VersionedLocation
    destWeightLimit: V3WeightLimit
}

/**
 * Transfer native currencies specifying the fee and amount as
 * separate.
 * 
 * `dest_weight_limit` is the weight for XCM execution on the dest
 * chain, and it would be charged from the transferred assets. If set
 * below requirements, the execution may fail and assets wouldn't be
 * received.
 * 
 * `fee` is the amount to be spent to pay for execution in destination
 * chain. Both fee and amount will be subtracted form the callers
 * balance.
 * 
 * If `fee` is not high enough to cover for the execution costs in the
 * destination chain, then the assets will be trapped in the
 * destination chain
 * 
 * It's a no-op if any error on local XCM execution or message sending.
 * Note sending assets out per se doesn't guarantee they would be
 * received. Receiving depends on if the XCM message could be delivered
 * by the network, and if the receiving chain would handle
 * messages correctly.
 */
export interface XTokensCall_transfer_with_fee {
    __kind: 'transfer_with_fee'
    currencyId: number
    amount: bigint
    fee: bigint
    dest: VersionedLocation
    destWeightLimit: V3WeightLimit
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const VestingCall: sts.Type<VestingCall> = sts.closedEnum(() => {
    return  {
        claim: sts.unit(),
        claim_for: sts.enumStruct({
            dest: AccountId32,
        }),
        update_vesting_schedules: sts.enumStruct({
            who: AccountId32,
            vestingSchedules: sts.array(() => VestingSchedule),
        }),
        vested_transfer: sts.enumStruct({
            dest: AccountId32,
            schedule: VestingSchedule,
        }),
    }
})

export const VestingSchedule: sts.Type<VestingSchedule> = sts.struct(() => {
    return  {
        start: sts.number(),
        period: sts.number(),
        periodCount: sts.number(),
        perPeriod: sts.bigint(),
    }
})

export interface VestingSchedule {
    start: number
    period: number
    periodCount: number
    perPeriod: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type VestingCall = VestingCall_claim | VestingCall_claim_for | VestingCall_update_vesting_schedules | VestingCall_vested_transfer

export interface VestingCall_claim {
    __kind: 'claim'
}

export interface VestingCall_claim_for {
    __kind: 'claim_for'
    dest: AccountId32
}

export interface VestingCall_update_vesting_schedules {
    __kind: 'update_vesting_schedules'
    who: AccountId32
    vestingSchedules: VestingSchedule[]
}

export interface VestingCall_vested_transfer {
    __kind: 'vested_transfer'
    dest: AccountId32
    schedule: VestingSchedule
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const UtilityCall: sts.Type<UtilityCall> = sts.closedEnum(() => {
    return  {
        as_derivative: sts.enumStruct({
            index: sts.number(),
            call: Call,
        }),
        batch: sts.enumStruct({
            calls: sts.array(() => Call),
        }),
        batch_all: sts.enumStruct({
            calls: sts.array(() => Call),
        }),
        dispatch_as: sts.enumStruct({
            asOrigin: OriginCaller,
            call: Call,
        }),
        force_batch: sts.enumStruct({
            calls: sts.array(() => Call),
        }),
        with_weight: sts.enumStruct({
            call: Call,
            weight: Weight,
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type UtilityCall = UtilityCall_as_derivative | UtilityCall_batch | UtilityCall_batch_all | UtilityCall_dispatch_as | UtilityCall_force_batch | UtilityCall_with_weight

/**
 * Send a call through an indexed pseudonym of the sender.
 * 
 * Filter from origin are passed along. The call will be dispatched with an origin which
 * use the same filter as the origin of this call.
 * 
 * NOTE: If you need to ensure that any account-based filtering is not honored (i.e.
 * because you expect `proxy` to have been used prior in the call stack and you do not want
 * the call restrictions to apply to any sub-accounts), then use `as_multi_threshold_1`
 * in the Multisig pallet instead.
 * 
 * NOTE: Prior to version *12, this was called `as_limited_sub`.
 * 
 * The dispatch origin for this call must be _Signed_.
 */
export interface UtilityCall_as_derivative {
    __kind: 'as_derivative'
    index: number
    call: Call
}

/**
 * Send a batch of dispatch calls.
 * 
 * May be called from any origin except `None`.
 * 
 * - `calls`: The calls to be dispatched from the same origin. The number of call must not
 *   exceed the constant: `batched_calls_limit` (available in constant metadata).
 * 
 * If origin is root then the calls are dispatched without checking origin filter. (This
 * includes bypassing `frame_system::Config::BaseCallFilter`).
 * 
 * ## Complexity
 * - O(C) where C is the number of calls to be batched.
 * 
 * This will return `Ok` in all circumstances. To determine the success of the batch, an
 * event is deposited. If a call failed and the batch was interrupted, then the
 * `BatchInterrupted` event is deposited, along with the number of successful calls made
 * and the error of the failed call. If all were successful, then the `BatchCompleted`
 * event is deposited.
 */
export interface UtilityCall_batch {
    __kind: 'batch'
    calls: Call[]
}

/**
 * Send a batch of dispatch calls and atomically execute them.
 * The whole transaction will rollback and fail if any of the calls failed.
 * 
 * May be called from any origin except `None`.
 * 
 * - `calls`: The calls to be dispatched from the same origin. The number of call must not
 *   exceed the constant: `batched_calls_limit` (available in constant metadata).
 * 
 * If origin is root then the calls are dispatched without checking origin filter. (This
 * includes bypassing `frame_system::Config::BaseCallFilter`).
 * 
 * ## Complexity
 * - O(C) where C is the number of calls to be batched.
 */
export interface UtilityCall_batch_all {
    __kind: 'batch_all'
    calls: Call[]
}

/**
 * Dispatches a function call with a provided origin.
 * 
 * The dispatch origin for this call must be _Root_.
 * 
 * ## Complexity
 * - O(1).
 */
export interface UtilityCall_dispatch_as {
    __kind: 'dispatch_as'
    asOrigin: OriginCaller
    call: Call
}

/**
 * Send a batch of dispatch calls.
 * Unlike `batch`, it allows errors and won't interrupt.
 * 
 * May be called from any origin except `None`.
 * 
 * - `calls`: The calls to be dispatched from the same origin. The number of call must not
 *   exceed the constant: `batched_calls_limit` (available in constant metadata).
 * 
 * If origin is root then the calls are dispatch without checking origin filter. (This
 * includes bypassing `frame_system::Config::BaseCallFilter`).
 * 
 * ## Complexity
 * - O(C) where C is the number of calls to be batched.
 */
export interface UtilityCall_force_batch {
    __kind: 'force_batch'
    calls: Call[]
}

/**
 * Dispatch a function call with a specified weight.
 * 
 * This function does not check the weight of the call, and instead allows the
 * Root origin to specify the weight of the call.
 * 
 * The dispatch origin for this call must be _Root_.
 */
export interface UtilityCall_with_weight {
    __kind: 'with_weight'
    call: Call
    weight: Weight
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const UniquesCall: sts.Type<UniquesCall> = sts.closedEnum(() => {
    return  {
        approve_transfer: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            delegate: AccountId32,
        }),
        burn: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            checkOwner: sts.option(() => AccountId32),
        }),
        buy_item: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            bidPrice: sts.bigint(),
        }),
        cancel_approval: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            maybeCheckDelegate: sts.option(() => AccountId32),
        }),
        clear_attribute: sts.enumStruct({
            collection: sts.bigint(),
            maybeItem: sts.option(() => sts.bigint()),
            key: sts.bytes(),
        }),
        clear_collection_metadata: sts.enumStruct({
            collection: sts.bigint(),
        }),
        clear_metadata: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
        }),
        create: sts.enumStruct({
            collection: sts.bigint(),
            admin: AccountId32,
        }),
        destroy: sts.enumStruct({
            collection: sts.bigint(),
            witness: DestroyWitness,
        }),
        force_create: sts.enumStruct({
            collection: sts.bigint(),
            owner: AccountId32,
            freeHolding: sts.boolean(),
        }),
        force_item_status: sts.enumStruct({
            collection: sts.bigint(),
            owner: AccountId32,
            issuer: AccountId32,
            admin: AccountId32,
            freezer: AccountId32,
            freeHolding: sts.boolean(),
            isFrozen: sts.boolean(),
        }),
        freeze: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
        }),
        freeze_collection: sts.enumStruct({
            collection: sts.bigint(),
        }),
        mint: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            owner: AccountId32,
        }),
        redeposit: sts.enumStruct({
            collection: sts.bigint(),
            items: sts.array(() => sts.bigint()),
        }),
        set_accept_ownership: sts.enumStruct({
            maybeCollection: sts.option(() => sts.bigint()),
        }),
        set_attribute: sts.enumStruct({
            collection: sts.bigint(),
            maybeItem: sts.option(() => sts.bigint()),
            key: sts.bytes(),
            value: sts.bytes(),
        }),
        set_collection_max_supply: sts.enumStruct({
            collection: sts.bigint(),
            maxSupply: sts.number(),
        }),
        set_collection_metadata: sts.enumStruct({
            collection: sts.bigint(),
            data: sts.bytes(),
            isFrozen: sts.boolean(),
        }),
        set_metadata: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            data: sts.bytes(),
            isFrozen: sts.boolean(),
        }),
        set_price: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            price: sts.option(() => sts.bigint()),
            whitelistedBuyer: sts.option(() => AccountId32),
        }),
        set_team: sts.enumStruct({
            collection: sts.bigint(),
            issuer: AccountId32,
            admin: AccountId32,
            freezer: AccountId32,
        }),
        thaw: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
        }),
        thaw_collection: sts.enumStruct({
            collection: sts.bigint(),
        }),
        transfer: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            dest: AccountId32,
        }),
        transfer_ownership: sts.enumStruct({
            collection: sts.bigint(),
            newOwner: AccountId32,
        }),
    }
})

export const DestroyWitness: sts.Type<DestroyWitness> = sts.struct(() => {
    return  {
        items: sts.number(),
        itemMetadatas: sts.number(),
        attributes: sts.number(),
    }
})

export interface DestroyWitness {
    items: number
    itemMetadatas: number
    attributes: number
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type UniquesCall = UniquesCall_approve_transfer | UniquesCall_burn | UniquesCall_buy_item | UniquesCall_cancel_approval | UniquesCall_clear_attribute | UniquesCall_clear_collection_metadata | UniquesCall_clear_metadata | UniquesCall_create | UniquesCall_destroy | UniquesCall_force_create | UniquesCall_force_item_status | UniquesCall_freeze | UniquesCall_freeze_collection | UniquesCall_mint | UniquesCall_redeposit | UniquesCall_set_accept_ownership | UniquesCall_set_attribute | UniquesCall_set_collection_max_supply | UniquesCall_set_collection_metadata | UniquesCall_set_metadata | UniquesCall_set_price | UniquesCall_set_team | UniquesCall_thaw | UniquesCall_thaw_collection | UniquesCall_transfer | UniquesCall_transfer_ownership

/**
 * Approve an item to be transferred by a delegated third-party account.
 * 
 * The origin must conform to `ForceOrigin` or must be `Signed` and the sender must be
 * either the owner of the `item` or the admin of the collection.
 * 
 * - `collection`: The collection of the item to be approved for delegated transfer.
 * - `item`: The item of the item to be approved for delegated transfer.
 * - `delegate`: The account to delegate permission to transfer the item.
 * 
 * Important NOTE: The `approved` account gets reset after each transfer.
 * 
 * Emits `ApprovedTransfer` on success.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_approve_transfer {
    __kind: 'approve_transfer'
    collection: bigint
    item: bigint
    delegate: AccountId32
}

/**
 * Destroy a single item.
 * 
 * Origin must be Signed and the signing account must be either:
 * - the Admin of the `collection`;
 * - the Owner of the `item`;
 * 
 * - `collection`: The collection of the item to be burned.
 * - `item`: The item of the item to be burned.
 * - `check_owner`: If `Some` then the operation will fail with `WrongOwner` unless the
 *   item is owned by this value.
 * 
 * Emits `Burned` with the actual amount burned.
 * 
 * Weight: `O(1)`
 * Modes: `check_owner.is_some()`.
 */
export interface UniquesCall_burn {
    __kind: 'burn'
    collection: bigint
    item: bigint
    checkOwner?: (AccountId32 | undefined)
}

/**
 * Allows to buy an item if it's up for sale.
 * 
 * Origin must be Signed and must not be the owner of the `item`.
 * 
 * - `collection`: The collection of the item.
 * - `item`: The item the sender wants to buy.
 * - `bid_price`: The price the sender is willing to pay.
 * 
 * Emits `ItemBought` on success.
 */
export interface UniquesCall_buy_item {
    __kind: 'buy_item'
    collection: bigint
    item: bigint
    bidPrice: bigint
}

/**
 * Cancel the prior approval for the transfer of an item by a delegate.
 * 
 * Origin must be either:
 * - the `Force` origin;
 * - `Signed` with the signer being the Admin of the `collection`;
 * - `Signed` with the signer being the Owner of the `item`;
 * 
 * Arguments:
 * - `collection`: The collection of the item of whose approval will be cancelled.
 * - `item`: The item of the item of whose approval will be cancelled.
 * - `maybe_check_delegate`: If `Some` will ensure that the given account is the one to
 *   which permission of transfer is delegated.
 * 
 * Emits `ApprovalCancelled` on success.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_cancel_approval {
    __kind: 'cancel_approval'
    collection: bigint
    item: bigint
    maybeCheckDelegate?: (AccountId32 | undefined)
}

/**
 * Clear an attribute for a collection or item.
 * 
 * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
 * `collection`.
 * 
 * Any deposit is freed for the collection's owner.
 * 
 * - `collection`: The identifier of the collection whose item's metadata to clear.
 * - `maybe_item`: The identifier of the item whose metadata to clear.
 * - `key`: The key of the attribute.
 * 
 * Emits `AttributeCleared`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_clear_attribute {
    __kind: 'clear_attribute'
    collection: bigint
    maybeItem?: (bigint | undefined)
    key: Bytes
}

/**
 * Clear the metadata for a collection.
 * 
 * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Owner of
 * the `collection`.
 * 
 * Any deposit is freed for the collection's owner.
 * 
 * - `collection`: The identifier of the collection whose metadata to clear.
 * 
 * Emits `CollectionMetadataCleared`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_clear_collection_metadata {
    __kind: 'clear_collection_metadata'
    collection: bigint
}

/**
 * Clear the metadata for an item.
 * 
 * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
 * `item`.
 * 
 * Any deposit is freed for the collection's owner.
 * 
 * - `collection`: The identifier of the collection whose item's metadata to clear.
 * - `item`: The identifier of the item whose metadata to clear.
 * 
 * Emits `MetadataCleared`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_clear_metadata {
    __kind: 'clear_metadata'
    collection: bigint
    item: bigint
}

/**
 * Issue a new collection of non-fungible items from a public origin.
 * 
 * This new collection has no items initially and its owner is the origin.
 * 
 * The origin must conform to the configured `CreateOrigin` and have sufficient funds free.
 * 
 * `ItemDeposit` funds of sender are reserved.
 * 
 * Parameters:
 * - `collection`: The identifier of the new collection. This must not be currently in use.
 * - `admin`: The admin of this collection. The admin is the initial address of each
 * member of the collection's admin team.
 * 
 * Emits `Created` event when successful.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_create {
    __kind: 'create'
    collection: bigint
    admin: AccountId32
}

/**
 * Destroy a collection of fungible items.
 * 
 * The origin must conform to `ForceOrigin` or must be `Signed` and the sender must be the
 * owner of the `collection`.
 * 
 * - `collection`: The identifier of the collection to be destroyed.
 * - `witness`: Information on the items minted in the collection. This must be
 * correct.
 * 
 * Emits `Destroyed` event when successful.
 * 
 * Weight: `O(n + m)` where:
 * - `n = witness.items`
 * - `m = witness.item_metadatas`
 * - `a = witness.attributes`
 */
export interface UniquesCall_destroy {
    __kind: 'destroy'
    collection: bigint
    witness: DestroyWitness
}

/**
 * Issue a new collection of non-fungible items from a privileged origin.
 * 
 * This new collection has no items initially.
 * 
 * The origin must conform to `ForceOrigin`.
 * 
 * Unlike `create`, no funds are reserved.
 * 
 * - `collection`: The identifier of the new item. This must not be currently in use.
 * - `owner`: The owner of this collection of items. The owner has full superuser
 *   permissions
 * over this item, but may later change and configure the permissions using
 * `transfer_ownership` and `set_team`.
 * 
 * Emits `ForceCreated` event when successful.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_force_create {
    __kind: 'force_create'
    collection: bigint
    owner: AccountId32
    freeHolding: boolean
}

/**
 * Alter the attributes of a given item.
 * 
 * Origin must be `ForceOrigin`.
 * 
 * - `collection`: The identifier of the item.
 * - `owner`: The new Owner of this item.
 * - `issuer`: The new Issuer of this item.
 * - `admin`: The new Admin of this item.
 * - `freezer`: The new Freezer of this item.
 * - `free_holding`: Whether a deposit is taken for holding an item of this collection.
 * - `is_frozen`: Whether this collection is frozen except for permissioned/admin
 * instructions.
 * 
 * Emits `ItemStatusChanged` with the identity of the item.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_force_item_status {
    __kind: 'force_item_status'
    collection: bigint
    owner: AccountId32
    issuer: AccountId32
    admin: AccountId32
    freezer: AccountId32
    freeHolding: boolean
    isFrozen: boolean
}

/**
 * Disallow further unprivileged transfer of an item.
 * 
 * Origin must be Signed and the sender should be the Freezer of the `collection`.
 * 
 * - `collection`: The collection of the item to be frozen.
 * - `item`: The item of the item to be frozen.
 * 
 * Emits `Frozen`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_freeze {
    __kind: 'freeze'
    collection: bigint
    item: bigint
}

/**
 * Disallow further unprivileged transfers for a whole collection.
 * 
 * Origin must be Signed and the sender should be the Freezer of the `collection`.
 * 
 * - `collection`: The collection to be frozen.
 * 
 * Emits `CollectionFrozen`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_freeze_collection {
    __kind: 'freeze_collection'
    collection: bigint
}

/**
 * Mint an item of a particular collection.
 * 
 * The origin must be Signed and the sender must be the Issuer of the `collection`.
 * 
 * - `collection`: The collection of the item to be minted.
 * - `item`: The item value of the item to be minted.
 * - `beneficiary`: The initial owner of the minted item.
 * 
 * Emits `Issued` event when successful.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_mint {
    __kind: 'mint'
    collection: bigint
    item: bigint
    owner: AccountId32
}

/**
 * Reevaluate the deposits on some items.
 * 
 * Origin must be Signed and the sender should be the Owner of the `collection`.
 * 
 * - `collection`: The collection to be frozen.
 * - `items`: The items of the collection whose deposits will be reevaluated.
 * 
 * NOTE: This exists as a best-effort function. Any items which are unknown or
 * in the case that the owner account does not have reservable funds to pay for a
 * deposit increase are ignored. Generally the owner isn't going to call this on items
 * whose existing deposit is less than the refreshed deposit as it would only cost them,
 * so it's of little consequence.
 * 
 * It will still return an error in the case that the collection is unknown of the signer
 * is not permitted to call it.
 * 
 * Weight: `O(items.len())`
 */
export interface UniquesCall_redeposit {
    __kind: 'redeposit'
    collection: bigint
    items: bigint[]
}

/**
 * Set (or reset) the acceptance of ownership for a particular account.
 * 
 * Origin must be `Signed` and if `maybe_collection` is `Some`, then the signer must have a
 * provider reference.
 * 
 * - `maybe_collection`: The identifier of the collection whose ownership the signer is
 *   willing to accept, or if `None`, an indication that the signer is willing to accept no
 *   ownership transferal.
 * 
 * Emits `OwnershipAcceptanceChanged`.
 */
export interface UniquesCall_set_accept_ownership {
    __kind: 'set_accept_ownership'
    maybeCollection?: (bigint | undefined)
}

/**
 * Set an attribute for a collection or item.
 * 
 * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
 * `collection`.
 * 
 * If the origin is Signed, then funds of signer are reserved according to the formula:
 * `MetadataDepositBase + DepositPerByte * (key.len + value.len)` taking into
 * account any already reserved funds.
 * 
 * - `collection`: The identifier of the collection whose item's metadata to set.
 * - `maybe_item`: The identifier of the item whose metadata to set.
 * - `key`: The key of the attribute.
 * - `value`: The value to which to set the attribute.
 * 
 * Emits `AttributeSet`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_set_attribute {
    __kind: 'set_attribute'
    collection: bigint
    maybeItem?: (bigint | undefined)
    key: Bytes
    value: Bytes
}

/**
 * Set the maximum amount of items a collection could have.
 * 
 * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Owner of
 * the `collection`.
 * 
 * Note: This function can only succeed once per collection.
 * 
 * - `collection`: The identifier of the collection to change.
 * - `max_supply`: The maximum amount of items a collection could have.
 * 
 * Emits `CollectionMaxSupplySet` event when successful.
 */
export interface UniquesCall_set_collection_max_supply {
    __kind: 'set_collection_max_supply'
    collection: bigint
    maxSupply: number
}

/**
 * Set the metadata for a collection.
 * 
 * Origin must be either `ForceOrigin` or `Signed` and the sender should be the Owner of
 * the `collection`.
 * 
 * If the origin is `Signed`, then funds of signer are reserved according to the formula:
 * `MetadataDepositBase + DepositPerByte * data.len` taking into
 * account any already reserved funds.
 * 
 * - `collection`: The identifier of the item whose metadata to update.
 * - `data`: The general information of this item. Limited in length by `StringLimit`.
 * - `is_frozen`: Whether the metadata should be frozen against further changes.
 * 
 * Emits `CollectionMetadataSet`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_set_collection_metadata {
    __kind: 'set_collection_metadata'
    collection: bigint
    data: Bytes
    isFrozen: boolean
}

/**
 * Set the metadata for an item.
 * 
 * Origin must be either `ForceOrigin` or Signed and the sender should be the Owner of the
 * `collection`.
 * 
 * If the origin is Signed, then funds of signer are reserved according to the formula:
 * `MetadataDepositBase + DepositPerByte * data.len` taking into
 * account any already reserved funds.
 * 
 * - `collection`: The identifier of the collection whose item's metadata to set.
 * - `item`: The identifier of the item whose metadata to set.
 * - `data`: The general information of this item. Limited in length by `StringLimit`.
 * - `is_frozen`: Whether the metadata should be frozen against further changes.
 * 
 * Emits `MetadataSet`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_set_metadata {
    __kind: 'set_metadata'
    collection: bigint
    item: bigint
    data: Bytes
    isFrozen: boolean
}

/**
 * Set (or reset) the price for an item.
 * 
 * Origin must be Signed and must be the owner of the asset `item`.
 * 
 * - `collection`: The collection of the item.
 * - `item`: The item to set the price for.
 * - `price`: The price for the item. Pass `None`, to reset the price.
 * - `buyer`: Restricts the buy operation to a specific account.
 * 
 * Emits `ItemPriceSet` on success if the price is not `None`.
 * Emits `ItemPriceRemoved` on success if the price is `None`.
 */
export interface UniquesCall_set_price {
    __kind: 'set_price'
    collection: bigint
    item: bigint
    price?: (bigint | undefined)
    whitelistedBuyer?: (AccountId32 | undefined)
}

/**
 * Change the Issuer, Admin and Freezer of a collection.
 * 
 * Origin must be Signed and the sender should be the Owner of the `collection`.
 * 
 * - `collection`: The collection whose team should be changed.
 * - `issuer`: The new Issuer of this collection.
 * - `admin`: The new Admin of this collection.
 * - `freezer`: The new Freezer of this collection.
 * 
 * Emits `TeamChanged`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_set_team {
    __kind: 'set_team'
    collection: bigint
    issuer: AccountId32
    admin: AccountId32
    freezer: AccountId32
}

/**
 * Re-allow unprivileged transfer of an item.
 * 
 * Origin must be Signed and the sender should be the Freezer of the `collection`.
 * 
 * - `collection`: The collection of the item to be thawed.
 * - `item`: The item of the item to be thawed.
 * 
 * Emits `Thawed`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_thaw {
    __kind: 'thaw'
    collection: bigint
    item: bigint
}

/**
 * Re-allow unprivileged transfers for a whole collection.
 * 
 * Origin must be Signed and the sender should be the Admin of the `collection`.
 * 
 * - `collection`: The collection to be thawed.
 * 
 * Emits `CollectionThawed`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_thaw_collection {
    __kind: 'thaw_collection'
    collection: bigint
}

/**
 * Move an item from the sender account to another.
 * 
 * This resets the approved account of the item.
 * 
 * Origin must be Signed and the signing account must be either:
 * - the Admin of the `collection`;
 * - the Owner of the `item`;
 * - the approved delegate for the `item` (in this case, the approval is reset).
 * 
 * Arguments:
 * - `collection`: The collection of the item to be transferred.
 * - `item`: The item of the item to be transferred.
 * - `dest`: The account to receive ownership of the item.
 * 
 * Emits `Transferred`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_transfer {
    __kind: 'transfer'
    collection: bigint
    item: bigint
    dest: AccountId32
}

/**
 * Change the Owner of a collection.
 * 
 * Origin must be Signed and the sender should be the Owner of the `collection`.
 * 
 * - `collection`: The collection whose owner should be changed.
 * - `owner`: The new Owner of this collection. They must have called
 *   `set_accept_ownership` with `collection` in order for this operation to succeed.
 * 
 * Emits `OwnerChanged`.
 * 
 * Weight: `O(1)`
 */
export interface UniquesCall_transfer_ownership {
    __kind: 'transfer_ownership'
    collection: bigint
    newOwner: AccountId32
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const TreasuryCall: sts.Type<TreasuryCall> = sts.closedEnum(() => {
    return  {
        approve_proposal: sts.enumStruct({
            proposalId: sts.number(),
        }),
        check_status: sts.enumStruct({
            index: sts.number(),
        }),
        payout: sts.enumStruct({
            index: sts.number(),
        }),
        propose_spend: sts.enumStruct({
            value: sts.bigint(),
            beneficiary: AccountId32,
        }),
        reject_proposal: sts.enumStruct({
            proposalId: sts.number(),
        }),
        remove_approval: sts.enumStruct({
            proposalId: sts.number(),
        }),
        spend: sts.enumStruct({
            amount: sts.bigint(),
            beneficiary: AccountId32,
            validFrom: sts.option(() => sts.number()),
        }),
        spend_local: sts.enumStruct({
            amount: sts.bigint(),
            beneficiary: AccountId32,
        }),
        void_spend: sts.enumStruct({
            index: sts.number(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type TreasuryCall = TreasuryCall_approve_proposal | TreasuryCall_check_status | TreasuryCall_payout | TreasuryCall_propose_spend | TreasuryCall_reject_proposal | TreasuryCall_remove_approval | TreasuryCall_spend | TreasuryCall_spend_local | TreasuryCall_void_spend

/**
 * Approve a proposal.
 * 
 * ## Dispatch Origin
 * 
 * Must be [`Config::ApproveOrigin`].
 * 
 * ## Details
 * 
 * At a later time, the proposal will be allocated to the beneficiary and the original
 * deposit will be returned.
 * 
 * ### Complexity
 *  - O(1).
 * 
 * ## Events
 * 
 * No events are emitted from this dispatch.
 */
export interface TreasuryCall_approve_proposal {
    __kind: 'approve_proposal'
    proposalId: number
}

/**
 * Check the status of the spend and remove it from the storage if processed.
 * 
 * ## Dispatch Origin
 * 
 * Must be signed.
 * 
 * ## Details
 * 
 * The status check is a prerequisite for retrying a failed payout.
 * If a spend has either succeeded or expired, it is removed from the storage by this
 * function. In such instances, transaction fees are refunded.
 * 
 * ### Parameters
 * - `index`: The spend index.
 * 
 * ## Events
 * 
 * Emits [`Event::PaymentFailed`] if the spend payout has failed.
 * Emits [`Event::SpendProcessed`] if the spend payout has succeed.
 */
export interface TreasuryCall_check_status {
    __kind: 'check_status'
    index: number
}

/**
 * Claim a spend.
 * 
 * ## Dispatch Origin
 * 
 * Must be signed.
 * 
 * ## Details
 * 
 * Spends must be claimed within some temporal bounds. A spend may be claimed within one
 * [`Config::PayoutPeriod`] from the `valid_from` block.
 * In case of a payout failure, the spend status must be updated with the `check_status`
 * dispatchable before retrying with the current function.
 * 
 * ### Parameters
 * - `index`: The spend index.
 * 
 * ## Events
 * 
 * Emits [`Event::Paid`] if successful.
 */
export interface TreasuryCall_payout {
    __kind: 'payout'
    index: number
}

/**
 * Put forward a suggestion for spending.
 * 
 * ## Dispatch Origin
 * 
 * Must be signed.
 * 
 * ## Details
 * A deposit proportional to the value is reserved and slashed if the proposal is rejected.
 * It is returned once the proposal is awarded.
 * 
 * ### Complexity
 * - O(1)
 * 
 * ## Events
 * 
 * Emits [`Event::Proposed`] if successful.
 */
export interface TreasuryCall_propose_spend {
    __kind: 'propose_spend'
    value: bigint
    beneficiary: AccountId32
}

/**
 * Reject a proposed spend.
 * 
 * ## Dispatch Origin
 * 
 * Must be [`Config::RejectOrigin`].
 * 
 * ## Details
 * The original deposit will be slashed.
 * 
 * ### Complexity
 * - O(1)
 * 
 * ## Events
 * 
 * Emits [`Event::Rejected`] if successful.
 */
export interface TreasuryCall_reject_proposal {
    __kind: 'reject_proposal'
    proposalId: number
}

/**
 * Force a previously approved proposal to be removed from the approval queue.
 * 
 * ## Dispatch Origin
 * 
 * Must be [`Config::RejectOrigin`].
 * 
 * ## Details
 * 
 * The original deposit will no longer be returned.
 * 
 * ### Parameters
 * - `proposal_id`: The index of a proposal
 * 
 * ### Complexity
 * - O(A) where `A` is the number of approvals
 * 
 * ### Errors
 * - [`Error::ProposalNotApproved`]: The `proposal_id` supplied was not found in the
 *   approval queue, i.e., the proposal has not been approved. This could also mean the
 *   proposal does not exist altogether, thus there is no way it would have been approved
 *   in the first place.
 */
export interface TreasuryCall_remove_approval {
    __kind: 'remove_approval'
    proposalId: number
}

/**
 * Propose and approve a spend of treasury funds.
 * 
 * ## Dispatch Origin
 * 
 * Must be [`Config::SpendOrigin`] with the `Success` value being at least
 * `amount` of `asset_kind` in the native asset. The amount of `asset_kind` is converted
 * for assertion using the [`Config::BalanceConverter`].
 * 
 * ## Details
 * 
 * Create an approved spend for transferring a specific `amount` of `asset_kind` to a
 * designated beneficiary. The spend must be claimed using the `payout` dispatchable within
 * the [`Config::PayoutPeriod`].
 * 
 * ### Parameters
 * - `asset_kind`: An indicator of the specific asset class to be spent.
 * - `amount`: The amount to be transferred from the treasury to the `beneficiary`.
 * - `beneficiary`: The beneficiary of the spend.
 * - `valid_from`: The block number from which the spend can be claimed. It can refer to
 *   the past if the resulting spend has not yet expired according to the
 *   [`Config::PayoutPeriod`]. If `None`, the spend can be claimed immediately after
 *   approval.
 * 
 * ## Events
 * 
 * Emits [`Event::AssetSpendApproved`] if successful.
 */
export interface TreasuryCall_spend {
    __kind: 'spend'
    amount: bigint
    beneficiary: AccountId32
    validFrom?: (number | undefined)
}

/**
 * Propose and approve a spend of treasury funds.
 * 
 * ## Dispatch Origin
 * 
 * Must be [`Config::SpendOrigin`] with the `Success` value being at least `amount`.
 * 
 * ### Details
 * NOTE: For record-keeping purposes, the proposer is deemed to be equivalent to the
 * beneficiary.
 * 
 * ### Parameters
 * - `amount`: The amount to be transferred from the treasury to the `beneficiary`.
 * - `beneficiary`: The destination account for the transfer.
 * 
 * ## Events
 * 
 * Emits [`Event::SpendApproved`] if successful.
 */
export interface TreasuryCall_spend_local {
    __kind: 'spend_local'
    amount: bigint
    beneficiary: AccountId32
}

/**
 * Void previously approved spend.
 * 
 * ## Dispatch Origin
 * 
 * Must be [`Config::RejectOrigin`].
 * 
 * ## Details
 * 
 * A spend void is only possible if the payout has not been attempted yet.
 * 
 * ### Parameters
 * - `index`: The spend index.
 * 
 * ## Events
 * 
 * Emits [`Event::AssetSpendVoided`] if successful.
 */
export interface TreasuryCall_void_spend {
    __kind: 'void_spend'
    index: number
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const TransactionPauseCall: sts.Type<TransactionPauseCall> = sts.closedEnum(() => {
    return  {
        pause_transaction: sts.enumStruct({
            palletName: sts.bytes(),
            functionName: sts.bytes(),
        }),
        unpause_transaction: sts.enumStruct({
            palletName: sts.bytes(),
            functionName: sts.bytes(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type TransactionPauseCall = TransactionPauseCall_pause_transaction | TransactionPauseCall_unpause_transaction

export interface TransactionPauseCall_pause_transaction {
    __kind: 'pause_transaction'
    palletName: Bytes
    functionName: Bytes
}

export interface TransactionPauseCall_unpause_transaction {
    __kind: 'unpause_transaction'
    palletName: Bytes
    functionName: Bytes
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const TokensCall: sts.Type<TokensCall> = sts.closedEnum(() => {
    return  {
        force_transfer: sts.enumStruct({
            source: AccountId32,
            dest: AccountId32,
            currencyId: sts.number(),
            amount: sts.bigint(),
        }),
        set_balance: sts.enumStruct({
            who: AccountId32,
            currencyId: sts.number(),
            newFree: sts.bigint(),
            newReserved: sts.bigint(),
        }),
        transfer: sts.enumStruct({
            dest: AccountId32,
            currencyId: sts.number(),
            amount: sts.bigint(),
        }),
        transfer_all: sts.enumStruct({
            dest: AccountId32,
            currencyId: sts.number(),
            keepAlive: sts.boolean(),
        }),
        transfer_keep_alive: sts.enumStruct({
            dest: AccountId32,
            currencyId: sts.number(),
            amount: sts.bigint(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type TokensCall = TokensCall_force_transfer | TokensCall_set_balance | TokensCall_transfer | TokensCall_transfer_all | TokensCall_transfer_keep_alive

/**
 * Exactly as `transfer`, except the origin must be root and the source
 * account may be specified.
 * 
 * The dispatch origin for this call must be _Root_.
 * 
 * - `source`: The sender of the transfer.
 * - `dest`: The recipient of the transfer.
 * - `currency_id`: currency type.
 * - `amount`: free balance amount to tranfer.
 */
export interface TokensCall_force_transfer {
    __kind: 'force_transfer'
    source: AccountId32
    dest: AccountId32
    currencyId: number
    amount: bigint
}

/**
 * Set the balances of a given account.
 * 
 * This will alter `FreeBalance` and `ReservedBalance` in storage. it
 * will also decrease the total issuance of the system
 * (`TotalIssuance`). If the new free or reserved balance is below the
 * existential deposit, it will reap the `AccountInfo`.
 * 
 * The dispatch origin for this call is `root`.
 */
export interface TokensCall_set_balance {
    __kind: 'set_balance'
    who: AccountId32
    currencyId: number
    newFree: bigint
    newReserved: bigint
}

/**
 * Transfer some liquid free balance to another account.
 * 
 * `transfer` will set the `FreeBalance` of the sender and receiver.
 * It will decrease the total issuance of the system by the
 * `TransferFee`. If the sender's account is below the existential
 * deposit as a result of the transfer, the account will be reaped.
 * 
 * The dispatch origin for this call must be `Signed` by the
 * transactor.
 * 
 * - `dest`: The recipient of the transfer.
 * - `currency_id`: currency type.
 * - `amount`: free balance amount to tranfer.
 */
export interface TokensCall_transfer {
    __kind: 'transfer'
    dest: AccountId32
    currencyId: number
    amount: bigint
}

/**
 * Transfer all remaining balance to the given account.
 * 
 * NOTE: This function only attempts to transfer _transferable_
 * balances. This means that any locked, reserved, or existential
 * deposits (when `keep_alive` is `true`), will not be transferred by
 * this function. To ensure that this function results in a killed
 * account, you might need to prepare the account by removing any
 * reference counters, storage deposits, etc...
 * 
 * The dispatch origin for this call must be `Signed` by the
 * transactor.
 * 
 * - `dest`: The recipient of the transfer.
 * - `currency_id`: currency type.
 * - `keep_alive`: A boolean to determine if the `transfer_all`
 *   operation should send all of the funds the account has, causing
 *   the sender account to be killed (false), or transfer everything
 *   except at least the existential deposit, which will guarantee to
 *   keep the sender account alive (true).
 */
export interface TokensCall_transfer_all {
    __kind: 'transfer_all'
    dest: AccountId32
    currencyId: number
    keepAlive: boolean
}

/**
 * Same as the [`transfer`] call, but with a check that the transfer
 * will not kill the origin account.
 * 
 * 99% of the time you want [`transfer`] instead.
 * 
 * The dispatch origin for this call must be `Signed` by the
 * transactor.
 * 
 * - `dest`: The recipient of the transfer.
 * - `currency_id`: currency type.
 * - `amount`: free balance amount to tranfer.
 */
export interface TokensCall_transfer_keep_alive {
    __kind: 'transfer_keep_alive'
    dest: AccountId32
    currencyId: number
    amount: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const TipsCall: sts.Type<TipsCall> = sts.closedEnum(() => {
    return  {
        close_tip: sts.enumStruct({
            hash: H256,
        }),
        report_awesome: sts.enumStruct({
            reason: sts.bytes(),
            who: AccountId32,
        }),
        retract_tip: sts.enumStruct({
            hash: H256,
        }),
        slash_tip: sts.enumStruct({
            hash: H256,
        }),
        tip: sts.enumStruct({
            hash: H256,
            tipValue: sts.bigint(),
        }),
        tip_new: sts.enumStruct({
            reason: sts.bytes(),
            who: AccountId32,
            tipValue: sts.bigint(),
        }),
    }
})

export const H256 = sts.bytes()

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type TipsCall = TipsCall_close_tip | TipsCall_report_awesome | TipsCall_retract_tip | TipsCall_slash_tip | TipsCall_tip | TipsCall_tip_new

/**
 * Close and payout a tip.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * The tip identified by `hash` must have finished its countdown period.
 * 
 * - `hash`: The identity of the open tip for which a tip value is declared. This is formed
 *   as the hash of the tuple of the original tip `reason` and the beneficiary account ID.
 * 
 * ## Complexity
 * - : `O(T)` where `T` is the number of tippers. decoding `Tipper` vec of length `T`. `T`
 *   is charged as upper bound given by `ContainsLengthBound`. The actual cost depends on
 *   the implementation of `T::Tippers`.
 */
export interface TipsCall_close_tip {
    __kind: 'close_tip'
    hash: H256
}

/**
 * Report something `reason` that deserves a tip and claim any eventual the finder's fee.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * Payment: `TipReportDepositBase` will be reserved from the origin account, as well as
 * `DataDepositPerByte` for each byte in `reason`.
 * 
 * - `reason`: The reason for, or the thing that deserves, the tip; generally this will be
 *   a UTF-8-encoded URL.
 * - `who`: The account which should be credited for the tip.
 * 
 * Emits `NewTip` if successful.
 * 
 * ## Complexity
 * - `O(R)` where `R` length of `reason`.
 *   - encoding and hashing of 'reason'
 */
export interface TipsCall_report_awesome {
    __kind: 'report_awesome'
    reason: Bytes
    who: AccountId32
}

/**
 * Retract a prior tip-report from `report_awesome`, and cancel the process of tipping.
 * 
 * If successful, the original deposit will be unreserved.
 * 
 * The dispatch origin for this call must be _Signed_ and the tip identified by `hash`
 * must have been reported by the signing account through `report_awesome` (and not
 * through `tip_new`).
 * 
 * - `hash`: The identity of the open tip for which a tip value is declared. This is formed
 *   as the hash of the tuple of the original tip `reason` and the beneficiary account ID.
 * 
 * Emits `TipRetracted` if successful.
 * 
 * ## Complexity
 * - `O(1)`
 *   - Depends on the length of `T::Hash` which is fixed.
 */
export interface TipsCall_retract_tip {
    __kind: 'retract_tip'
    hash: H256
}

/**
 * Remove and slash an already-open tip.
 * 
 * May only be called from `T::RejectOrigin`.
 * 
 * As a result, the finder is slashed and the deposits are lost.
 * 
 * Emits `TipSlashed` if successful.
 * 
 * ## Complexity
 * - O(1).
 */
export interface TipsCall_slash_tip {
    __kind: 'slash_tip'
    hash: H256
}

/**
 * Declare a tip value for an already-open tip.
 * 
 * The dispatch origin for this call must be _Signed_ and the signing account must be a
 * member of the `Tippers` set.
 * 
 * - `hash`: The identity of the open tip for which a tip value is declared. This is formed
 *   as the hash of the tuple of the hash of the original tip `reason` and the beneficiary
 *   account ID.
 * - `tip_value`: The amount of tip that the sender would like to give. The median tip
 *   value of active tippers will be given to the `who`.
 * 
 * Emits `TipClosing` if the threshold of tippers has been reached and the countdown period
 * has started.
 * 
 * ## Complexity
 * - `O(T)` where `T` is the number of tippers. decoding `Tipper` vec of length `T`, insert
 *   tip and check closing, `T` is charged as upper bound given by `ContainsLengthBound`.
 *   The actual cost depends on the implementation of `T::Tippers`.
 * 
 *   Actually weight could be lower as it depends on how many tips are in `OpenTip` but it
 *   is weighted as if almost full i.e of length `T-1`.
 */
export interface TipsCall_tip {
    __kind: 'tip'
    hash: H256
    tipValue: bigint
}

/**
 * Give a tip for something new; no finder's fee will be taken.
 * 
 * The dispatch origin for this call must be _Signed_ and the signing account must be a
 * member of the `Tippers` set.
 * 
 * - `reason`: The reason for, or the thing that deserves, the tip; generally this will be
 *   a UTF-8-encoded URL.
 * - `who`: The account which should be credited for the tip.
 * - `tip_value`: The amount of tip that the sender would like to give. The median tip
 *   value of active tippers will be given to the `who`.
 * 
 * Emits `NewTip` if successful.
 * 
 * ## Complexity
 * - `O(R + T)` where `R` length of `reason`, `T` is the number of tippers.
 *   - `O(T)`: decoding `Tipper` vec of length `T`. `T` is charged as upper bound given by
 *     `ContainsLengthBound`. The actual cost depends on the implementation of
 *     `T::Tippers`.
 *   - `O(R)`: hashing and encoding of reason of length `R`
 */
export interface TipsCall_tip_new {
    __kind: 'tip_new'
    reason: Bytes
    who: AccountId32
    tipValue: bigint
}

export type H256 = Bytes

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const TimestampCall: sts.Type<TimestampCall> = sts.closedEnum(() => {
    return  {
        set: sts.enumStruct({
            now: sts.bigint(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type TimestampCall = TimestampCall_set

/**
 * Set the current time.
 * 
 * This call should be invoked exactly once per block. It will panic at the finalization
 * phase, if this call hasn't been invoked by that time.
 * 
 * The timestamp should be greater than the previous one by the amount specified by
 * [`Config::MinimumPeriod`].
 * 
 * The dispatch origin for this call must be _None_.
 * 
 * This dispatch class is _Mandatory_ to ensure it gets executed in the block. Be aware
 * that changing the complexity of this call could result exhausting the resources in a
 * block to execute any other calls.
 * 
 * ## Complexity
 * - `O(1)` (Note that implementations of `OnTimestampSet` must also be `O(1)`)
 * - 1 storage read and 1 storage mutation (codec `O(1)` because of `DidUpdate::take` in
 *   `on_finalize`)
 * - 1 event handler `on_timestamp_set`. Must be `O(1)`.
 */
export interface TimestampCall_set {
    __kind: 'set'
    now: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const TechnicalCommitteeCall: sts.Type<TechnicalCommitteeCall> = sts.closedEnum(() => {
    return  {
        close: sts.enumStruct({
            proposalHash: H256,
            index: sts.number(),
            proposalWeightBound: Weight,
            lengthBound: sts.number(),
        }),
        disapprove_proposal: sts.enumStruct({
            proposalHash: H256,
        }),
        execute: sts.enumStruct({
            proposal: Call,
            lengthBound: sts.number(),
        }),
        propose: sts.enumStruct({
            threshold: sts.number(),
            proposal: Call,
            lengthBound: sts.number(),
        }),
        set_members: sts.enumStruct({
            newMembers: sts.array(() => AccountId32),
            prime: sts.option(() => AccountId32),
            oldCount: sts.number(),
        }),
        vote: sts.enumStruct({
            proposal: H256,
            index: sts.number(),
            approve: sts.boolean(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type TechnicalCommitteeCall = TechnicalCommitteeCall_close | TechnicalCommitteeCall_disapprove_proposal | TechnicalCommitteeCall_execute | TechnicalCommitteeCall_propose | TechnicalCommitteeCall_set_members | TechnicalCommitteeCall_vote

/**
 * Close a vote that is either approved, disapproved or whose voting period has ended.
 * 
 * May be called by any signed account in order to finish voting and close the proposal.
 * 
 * If called before the end of the voting period it will only close the vote if it is
 * has enough votes to be approved or disapproved.
 * 
 * If called after the end of the voting period abstentions are counted as rejections
 * unless there is a prime member set and the prime member cast an approval.
 * 
 * If the close operation completes successfully with disapproval, the transaction fee will
 * be waived. Otherwise execution of the approved operation will be charged to the caller.
 * 
 * + `proposal_weight_bound`: The maximum amount of weight consumed by executing the closed
 * proposal.
 * + `length_bound`: The upper bound for the length of the proposal in storage. Checked via
 * `storage::read` so it is `size_of::<u32>() == 4` larger than the pure length.
 * 
 * ## Complexity
 * - `O(B + M + P1 + P2)` where:
 *   - `B` is `proposal` size in bytes (length-fee-bounded)
 *   - `M` is members-count (code- and governance-bounded)
 *   - `P1` is the complexity of `proposal` preimage.
 *   - `P2` is proposal-count (code-bounded)
 */
export interface TechnicalCommitteeCall_close {
    __kind: 'close'
    proposalHash: H256
    index: number
    proposalWeightBound: Weight
    lengthBound: number
}

/**
 * Disapprove a proposal, close, and remove it from the system, regardless of its current
 * state.
 * 
 * Must be called by the Root origin.
 * 
 * Parameters:
 * * `proposal_hash`: The hash of the proposal that should be disapproved.
 * 
 * ## Complexity
 * O(P) where P is the number of max proposals
 */
export interface TechnicalCommitteeCall_disapprove_proposal {
    __kind: 'disapprove_proposal'
    proposalHash: H256
}

/**
 * Dispatch a proposal from a member using the `Member` origin.
 * 
 * Origin must be a member of the collective.
 * 
 * ## Complexity:
 * - `O(B + M + P)` where:
 * - `B` is `proposal` size in bytes (length-fee-bounded)
 * - `M` members-count (code-bounded)
 * - `P` complexity of dispatching `proposal`
 */
export interface TechnicalCommitteeCall_execute {
    __kind: 'execute'
    proposal: Call
    lengthBound: number
}

/**
 * Add a new proposal to either be voted on or executed directly.
 * 
 * Requires the sender to be member.
 * 
 * `threshold` determines whether `proposal` is executed directly (`threshold < 2`)
 * or put up for voting.
 * 
 * ## Complexity
 * - `O(B + M + P1)` or `O(B + M + P2)` where:
 *   - `B` is `proposal` size in bytes (length-fee-bounded)
 *   - `M` is members-count (code- and governance-bounded)
 *   - branching is influenced by `threshold` where:
 *     - `P1` is proposal execution complexity (`threshold < 2`)
 *     - `P2` is proposals-count (code-bounded) (`threshold >= 2`)
 */
export interface TechnicalCommitteeCall_propose {
    __kind: 'propose'
    threshold: number
    proposal: Call
    lengthBound: number
}

/**
 * Set the collective's membership.
 * 
 * - `new_members`: The new member list. Be nice to the chain and provide it sorted.
 * - `prime`: The prime member whose vote sets the default.
 * - `old_count`: The upper bound for the previous number of members in storage. Used for
 *   weight estimation.
 * 
 * The dispatch of this call must be `SetMembersOrigin`.
 * 
 * NOTE: Does not enforce the expected `MaxMembers` limit on the amount of members, but
 *       the weight estimations rely on it to estimate dispatchable weight.
 * 
 * # WARNING:
 * 
 * The `pallet-collective` can also be managed by logic outside of the pallet through the
 * implementation of the trait [`ChangeMembers`].
 * Any call to `set_members` must be careful that the member set doesn't get out of sync
 * with other logic managing the member set.
 * 
 * ## Complexity:
 * - `O(MP + N)` where:
 *   - `M` old-members-count (code- and governance-bounded)
 *   - `N` new-members-count (code- and governance-bounded)
 *   - `P` proposals-count (code-bounded)
 */
export interface TechnicalCommitteeCall_set_members {
    __kind: 'set_members'
    newMembers: AccountId32[]
    prime?: (AccountId32 | undefined)
    oldCount: number
}

/**
 * Add an aye or nay vote for the sender to the given proposal.
 * 
 * Requires the sender to be a member.
 * 
 * Transaction fees will be waived if the member is voting on any particular proposal
 * for the first time and the call is successful. Subsequent vote changes will charge a
 * fee.
 * ## Complexity
 * - `O(M)` where `M` is members-count (code- and governance-bounded)
 */
export interface TechnicalCommitteeCall_vote {
    __kind: 'vote'
    proposal: H256
    index: number
    approve: boolean
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const SystemCall: sts.Type<SystemCall> = sts.closedEnum(() => {
    return  {
        apply_authorized_upgrade: sts.enumStruct({
            code: sts.bytes(),
        }),
        authorize_upgrade: sts.enumStruct({
            codeHash: H256,
        }),
        authorize_upgrade_without_checks: sts.enumStruct({
            codeHash: H256,
        }),
        kill_prefix: sts.enumStruct({
            prefix: sts.bytes(),
            subkeys: sts.number(),
        }),
        kill_storage: sts.enumStruct({
            keys: sts.array(() => sts.bytes()),
        }),
        remark: sts.enumStruct({
            remark: sts.bytes(),
        }),
        remark_with_event: sts.enumStruct({
            remark: sts.bytes(),
        }),
        set_code: sts.enumStruct({
            code: sts.bytes(),
        }),
        set_code_without_checks: sts.enumStruct({
            code: sts.bytes(),
        }),
        set_heap_pages: sts.enumStruct({
            pages: sts.bigint(),
        }),
        set_storage: sts.enumStruct({
            items: sts.array(() => sts.tuple(() => [sts.bytes(), sts.bytes()])),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type SystemCall = SystemCall_apply_authorized_upgrade | SystemCall_authorize_upgrade | SystemCall_authorize_upgrade_without_checks | SystemCall_kill_prefix | SystemCall_kill_storage | SystemCall_remark | SystemCall_remark_with_event | SystemCall_set_code | SystemCall_set_code_without_checks | SystemCall_set_heap_pages | SystemCall_set_storage

/**
 * Provide the preimage (runtime binary) `code` for an upgrade that has been authorized.
 * 
 * If the authorization required a version check, this call will ensure the spec name
 * remains unchanged and that the spec version has increased.
 * 
 * Depending on the runtime's `OnSetCode` configuration, this function may directly apply
 * the new `code` in the same block or attempt to schedule the upgrade.
 * 
 * All origins are allowed.
 */
export interface SystemCall_apply_authorized_upgrade {
    __kind: 'apply_authorized_upgrade'
    code: Bytes
}

/**
 * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
 * later.
 * 
 * This call requires Root origin.
 */
export interface SystemCall_authorize_upgrade {
    __kind: 'authorize_upgrade'
    codeHash: H256
}

/**
 * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
 * later.
 * 
 * WARNING: This authorizes an upgrade that will take place without any safety checks, for
 * example that the spec name remains the same and that the version number increases. Not
 * recommended for normal use. Use `authorize_upgrade` instead.
 * 
 * This call requires Root origin.
 */
export interface SystemCall_authorize_upgrade_without_checks {
    __kind: 'authorize_upgrade_without_checks'
    codeHash: H256
}

/**
 * Kill all storage items with a key that starts with the given prefix.
 * 
 * **NOTE:** We rely on the Root origin to provide us the number of subkeys under
 * the prefix we are removing to accurately calculate the weight of this function.
 */
export interface SystemCall_kill_prefix {
    __kind: 'kill_prefix'
    prefix: Bytes
    subkeys: number
}

/**
 * Kill some items from storage.
 */
export interface SystemCall_kill_storage {
    __kind: 'kill_storage'
    keys: Bytes[]
}

/**
 * Make some on-chain remark.
 * 
 * Can be executed by every `origin`.
 */
export interface SystemCall_remark {
    __kind: 'remark'
    remark: Bytes
}

/**
 * Make some on-chain remark and emit event.
 */
export interface SystemCall_remark_with_event {
    __kind: 'remark_with_event'
    remark: Bytes
}

/**
 * Set the new runtime code.
 */
export interface SystemCall_set_code {
    __kind: 'set_code'
    code: Bytes
}

/**
 * Set the new runtime code without doing any checks of the given `code`.
 * 
 * Note that runtime upgrades will not run if this is called with a not-increasing spec
 * version!
 */
export interface SystemCall_set_code_without_checks {
    __kind: 'set_code_without_checks'
    code: Bytes
}

/**
 * Set the number of pages in the WebAssembly environment's heap.
 */
export interface SystemCall_set_heap_pages {
    __kind: 'set_heap_pages'
    pages: bigint
}

/**
 * Set some items of storage.
 */
export interface SystemCall_set_storage {
    __kind: 'set_storage'
    items: [Bytes, Bytes][]
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const StateTrieMigrationCall: sts.Type<StateTrieMigrationCall> = sts.closedEnum(() => {
    return  {
        continue_migrate: sts.enumStruct({
            limits: MigrationLimits,
            realSizeUpper: sts.number(),
            witnessTask: MigrationTask,
        }),
        control_auto_migration: sts.enumStruct({
            maybeConfig: sts.option(() => MigrationLimits),
        }),
        force_set_progress: sts.enumStruct({
            progressTop: Progress,
            progressChild: Progress,
        }),
        migrate_custom_child: sts.enumStruct({
            root: sts.bytes(),
            childKeys: sts.array(() => sts.bytes()),
            totalSize: sts.number(),
        }),
        migrate_custom_top: sts.enumStruct({
            keys: sts.array(() => sts.bytes()),
            witnessSize: sts.number(),
        }),
        set_signed_max_limits: sts.enumStruct({
            limits: MigrationLimits,
        }),
    }
})

export const Progress: sts.Type<Progress> = sts.closedEnum(() => {
    return  {
        Complete: sts.unit(),
        LastKey: sts.bytes(),
        ToStart: sts.unit(),
    }
})

export type Progress = Progress_Complete | Progress_LastKey | Progress_ToStart

export interface Progress_Complete {
    __kind: 'Complete'
}

export interface Progress_LastKey {
    __kind: 'LastKey'
    value: Bytes
}

export interface Progress_ToStart {
    __kind: 'ToStart'
}

export const MigrationTask: sts.Type<MigrationTask> = sts.struct(() => {
    return  {
        progressTop: Progress,
        progressChild: Progress,
        size: sts.number(),
        topItems: sts.number(),
        childItems: sts.number(),
    }
})

export interface MigrationTask {
    progressTop: Progress
    progressChild: Progress
    size: number
    topItems: number
    childItems: number
}

export const MigrationLimits: sts.Type<MigrationLimits> = sts.struct(() => {
    return  {
        size: sts.number(),
        item: sts.number(),
    }
})

export interface MigrationLimits {
    size: number
    item: number
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type StateTrieMigrationCall = StateTrieMigrationCall_continue_migrate | StateTrieMigrationCall_control_auto_migration | StateTrieMigrationCall_force_set_progress | StateTrieMigrationCall_migrate_custom_child | StateTrieMigrationCall_migrate_custom_top | StateTrieMigrationCall_set_signed_max_limits

/**
 * Continue the migration for the given `limits`.
 * 
 * The dispatch origin of this call can be any signed account.
 * 
 * This transaction has NO MONETARY INCENTIVES. calling it will not reward anyone. Albeit,
 * Upon successful execution, the transaction fee is returned.
 * 
 * The (potentially over-estimated) of the byte length of all the data read must be
 * provided for up-front fee-payment and weighing. In essence, the caller is guaranteeing
 * that executing the current `MigrationTask` with the given `limits` will not exceed
 * `real_size_upper` bytes of read data.
 * 
 * The `witness_task` is merely a helper to prevent the caller from being slashed or
 * generally trigger a migration that they do not intend. This parameter is just a message
 * from caller, saying that they believed `witness_task` was the last state of the
 * migration, and they only wish for their transaction to do anything, if this assumption
 * holds. In case `witness_task` does not match, the transaction fails.
 * 
 * Based on the documentation of [`MigrationTask::migrate_until_exhaustion`], the
 * recommended way of doing this is to pass a `limit` that only bounds `count`, as the
 * `size` limit can always be overwritten.
 */
export interface StateTrieMigrationCall_continue_migrate {
    __kind: 'continue_migrate'
    limits: MigrationLimits
    realSizeUpper: number
    witnessTask: MigrationTask
}

/**
 * Control the automatic migration.
 * 
 * The dispatch origin of this call must be [`Config::ControlOrigin`].
 */
export interface StateTrieMigrationCall_control_auto_migration {
    __kind: 'control_auto_migration'
    maybeConfig?: (MigrationLimits | undefined)
}

/**
 * Forcefully set the progress the running migration.
 * 
 * This is only useful in one case: the next key to migrate is too big to be migrated with
 * a signed account, in a parachain context, and we simply want to skip it. A reasonable
 * example of this would be `:code:`, which is both very expensive to migrate, and commonly
 * used, so probably it is already migrated.
 * 
 * In case you mess things up, you can also, in principle, use this to reset the migration
 * process.
 */
export interface StateTrieMigrationCall_force_set_progress {
    __kind: 'force_set_progress'
    progressTop: Progress
    progressChild: Progress
}

/**
 * Migrate the list of child keys by iterating each of them one by one.
 * 
 * All of the given child keys must be present under one `child_root`.
 * 
 * This does not affect the global migration process tracker ([`MigrationProcess`]), and
 * should only be used in case any keys are leftover due to a bug.
 */
export interface StateTrieMigrationCall_migrate_custom_child {
    __kind: 'migrate_custom_child'
    root: Bytes
    childKeys: Bytes[]
    totalSize: number
}

/**
 * Migrate the list of top keys by iterating each of them one by one.
 * 
 * This does not affect the global migration process tracker ([`MigrationProcess`]), and
 * should only be used in case any keys are leftover due to a bug.
 */
export interface StateTrieMigrationCall_migrate_custom_top {
    __kind: 'migrate_custom_top'
    keys: Bytes[]
    witnessSize: number
}

/**
 * Set the maximum limit of the signed migration.
 */
export interface StateTrieMigrationCall_set_signed_max_limits {
    __kind: 'set_signed_max_limits'
    limits: MigrationLimits
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const StakingCall: sts.Type<StakingCall> = sts.closedEnum(() => {
    return  {
        claim: sts.enumStruct({
            positionId: sts.bigint(),
        }),
        increase_stake: sts.enumStruct({
            positionId: sts.bigint(),
            amount: sts.bigint(),
        }),
        initialize_staking: sts.unit(),
        stake: sts.enumStruct({
            amount: sts.bigint(),
        }),
        unstake: sts.enumStruct({
            positionId: sts.bigint(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type StakingCall = StakingCall_claim | StakingCall_increase_stake | StakingCall_initialize_staking | StakingCall_stake | StakingCall_unstake

/**
 * Claim rewards accumulated for specific staking position.
 * 
 * Function calculates amount of rewards to pay for specified staking position based on
 * the amount of points position accumulated. Function also unlocks all the rewards locked
 * from `increase_stake` based on the amount of the points.
 * 
 * This action is penalized by removing all the points and returning allocated unpaid rewards
 * for redistribution.
 * 
 * Parameters:
 * - `position_id`: The identifier of the position to claim rewards for.
 * 
 * Emits `RewardsClaimed` event when successful.
 * 
 */
export interface StakingCall_claim {
    __kind: 'claim'
    positionId: bigint
}

/**
 * Extrinsic to increase staked amount of existing staking position by specified `amount`.
 * 
 * `increase_stake` increases staked amount of position specified by `postion_id` by the
 * `amount` specified by the user.
 * Staking position must exist and `origin` has to be the owner of the position.
 * Users can stake tokens which are not vested or already staked.
 * Position's params e.g points are updated to offset stake increase and rewards
 * accumulated until this point are paid and locked to the user.
 * 
 * Parameters:
 * - `position_id`: The identifier of the position which stake will be increased.
 * - `amount`: Amount of native asset to be added to staked amount. `amount` can't be vested or
 * already staked
 * 
 * Emits `StakeAdded` event when successful.
 * 
 */
export interface StakingCall_increase_stake {
    __kind: 'increase_stake'
    positionId: bigint
    amount: bigint
}

/**
 * Staking pallet initialization. This call will reserved `pot`'s balance to prevent
 * account dusting and start collecting fees from trades as rewards.
 * 
 * `pot`’s account has to have a balance which will be reserved to prevent account dusting.
 * 
 * Emits `StakingInitialized` event when successful.
 * 
 */
export interface StakingCall_initialize_staking {
    __kind: 'initialize_staking'
}

/**
 * Stake `amount` into a new staking position.
 * 
 * `stake` locks specified `amount` into staking and creates new NFT representing staking
 * position.
 * Users can stake `NativeAssetId` balance which is not vested or already staked.
 * 
 * Staking pallet must be initialized otherwise extrinsic will fail with error.
 * 
 * Parameters:
 * - `amount`: Amount of native asset to be staked. `amount` can't be vested or already
 * staked
 * 
 * Emits `PositionCreated` event when successful.
 * 
 */
export interface StakingCall_stake {
    __kind: 'stake'
    amount: bigint
}

/**
 * Function pays rewards, unlocks all the staked assets and destroys staking position
 * specified by `position_id`.
 * 
 * Function calculates and pays latest rewards, unlocks all the locked rewards and staked
 * tokens for staking position and burns NFT representing staking position.
 * Unpaid allocated rewards are returned to the Staking for redistribution.
 * 
 * Parameters:
 * - `position_id`: The identifier of the position to be destroyed.
 * 
 * Emits `RewardsClaimed` and `Unstaked` events when successful.
 * 
 */
export interface StakingCall_unstake {
    __kind: 'unstake'
    positionId: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const StableswapCall: sts.Type<StableswapCall> = sts.closedEnum(() => {
    return  {
        add_liquidity: sts.enumStruct({
            poolId: sts.number(),
            assets: sts.array(() => AssetAmount),
        }),
        add_liquidity_shares: sts.enumStruct({
            poolId: sts.number(),
            shares: sts.bigint(),
            assetId: sts.number(),
            maxAssetAmount: sts.bigint(),
        }),
        buy: sts.enumStruct({
            poolId: sts.number(),
            assetOut: sts.number(),
            assetIn: sts.number(),
            amountOut: sts.bigint(),
            maxSellAmount: sts.bigint(),
        }),
        create_pool: sts.enumStruct({
            shareAsset: sts.number(),
            assets: sts.array(() => sts.number()),
            amplification: sts.number(),
            fee: Permill,
        }),
        remove_liquidity_one_asset: sts.enumStruct({
            poolId: sts.number(),
            assetId: sts.number(),
            shareAmount: sts.bigint(),
            minAmountOut: sts.bigint(),
        }),
        sell: sts.enumStruct({
            poolId: sts.number(),
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            minBuyAmount: sts.bigint(),
        }),
        set_asset_tradable_state: sts.enumStruct({
            poolId: sts.number(),
            assetId: sts.number(),
            state: Type_110,
        }),
        update_amplification: sts.enumStruct({
            poolId: sts.number(),
            finalAmplification: sts.number(),
            startBlock: sts.number(),
            endBlock: sts.number(),
        }),
        update_pool_fee: sts.enumStruct({
            poolId: sts.number(),
            fee: Permill,
        }),
        withdraw_asset_amount: sts.enumStruct({
            poolId: sts.number(),
            assetId: sts.number(),
            amount: sts.bigint(),
            maxShareAmount: sts.bigint(),
        }),
    }
})

export const Type_110: sts.Type<Type_110> = sts.struct(() => {
    return  {
        bits: sts.number(),
    }
})

export interface Type_110 {
    bits: number
}

export const Permill = sts.number()

export const AssetAmount: sts.Type<AssetAmount> = sts.struct(() => {
    return  {
        assetId: sts.number(),
        amount: sts.bigint(),
    }
})

export interface AssetAmount {
    assetId: number
    amount: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type StableswapCall = StableswapCall_add_liquidity | StableswapCall_add_liquidity_shares | StableswapCall_buy | StableswapCall_create_pool | StableswapCall_remove_liquidity_one_asset | StableswapCall_sell | StableswapCall_set_asset_tradable_state | StableswapCall_update_amplification | StableswapCall_update_pool_fee | StableswapCall_withdraw_asset_amount

/**
 * Add liquidity to selected pool.
 * 
 * First call of `add_liquidity` must provide "initial liquidity" of all assets.
 * 
 * If there is liquidity already in the pool, LP can provide liquidity of any number of pool assets.
 * 
 * LP must have sufficient amount of each asset.
 * 
 * Origin is given corresponding amount of shares.
 * 
 * Parameters:
 * - `origin`: liquidity provider
 * - `pool_id`: Pool Id
 * - `assets`: asset id and liquidity amount provided
 * 
 * Emits `LiquidityAdded` event when successful.
 */
export interface StableswapCall_add_liquidity {
    __kind: 'add_liquidity'
    poolId: number
    assets: AssetAmount[]
}

/**
 * Add liquidity to selected pool given exact amount of shares to receive.
 * 
 * Similar to `add_liquidity` but LP specifies exact amount of shares to receive.
 * 
 * This functionality is used mainly by on-chain routing when a swap between Omnipool asset and stable asset is performed.
 * 
 * Parameters:
 * - `origin`: liquidity provider
 * - `pool_id`: Pool Id
 * - `shares`: amount of shares to receive
 * - `asset_id`: asset id of an asset to provide as liquidity
 * - `max_asset_amount`: slippage limit. Max amount of asset.
 * 
 * Emits `LiquidityAdded` event when successful.
 */
export interface StableswapCall_add_liquidity_shares {
    __kind: 'add_liquidity_shares'
    poolId: number
    shares: bigint
    assetId: number
    maxAssetAmount: bigint
}

/**
 * Execute a swap of `asset_in` for `asset_out`.
 * 
 * Parameters:
 * - `origin`:
 * - `pool_id`: Id of a pool
 * - `asset_out`: ID of asset bought from the pool
 * - `asset_in`: ID of asset sold to the pool
 * - `amount_out`: Amount of asset to receive from the pool
 * - `max_sell_amount`: Maximum amount allowed to be sold
 * 
 * Emits `BuyExecuted` event when successful.
 * 
 */
export interface StableswapCall_buy {
    __kind: 'buy'
    poolId: number
    assetOut: number
    assetIn: number
    amountOut: bigint
    maxSellAmount: bigint
}

/**
 * Create a stable pool with given list of assets.
 * 
 * All assets must be correctly registered in `T::AssetRegistry`.
 * Note that this does not seed the pool with liquidity. Use `add_liquidity` to provide
 * initial liquidity.
 * 
 * Parameters:
 * - `origin`: Must be T::AuthorityOrigin
 * - `share_asset`: Preregistered share asset identifier
 * - `assets`: List of Asset ids
 * - `amplification`: Pool amplification
 * - `fee`: fee to be applied on trade and liquidity operations
 * 
 * Emits `PoolCreated` event if successful.
 */
export interface StableswapCall_create_pool {
    __kind: 'create_pool'
    shareAsset: number
    assets: number[]
    amplification: number
    fee: Permill
}

/**
 * Remove liquidity from selected pool.
 * 
 * Withdraws liquidity of selected asset from a pool.
 * 
 * Share amount is burned and LP receives corresponding amount of chosen asset.
 * 
 * Withdraw fee is applied to the asset amount.
 * 
 * Parameters:
 * - `origin`: liquidity provider
 * - `pool_id`: Pool Id
 * - `asset_id`: id of asset to receive
 * - 'share_amount': amount of shares to withdraw
 * - 'min_amount_out': minimum amount to receive
 * 
 * Emits `LiquidityRemoved` event when successful.
 */
export interface StableswapCall_remove_liquidity_one_asset {
    __kind: 'remove_liquidity_one_asset'
    poolId: number
    assetId: number
    shareAmount: bigint
    minAmountOut: bigint
}

/**
 * Execute a swap of `asset_in` for `asset_out`.
 * 
 * Parameters:
 * - `origin`: origin of the caller
 * - `pool_id`: Id of a pool
 * - `asset_in`: ID of asset sold to the pool
 * - `asset_out`: ID of asset bought from the pool
 * - `amount_in`: Amount of asset to be sold to the pool
 * - `min_buy_amount`: Minimum amount required to receive
 * 
 * Emits `SellExecuted` event when successful.
 * 
 */
export interface StableswapCall_sell {
    __kind: 'sell'
    poolId: number
    assetIn: number
    assetOut: number
    amountIn: bigint
    minBuyAmount: bigint
}

export interface StableswapCall_set_asset_tradable_state {
    __kind: 'set_asset_tradable_state'
    poolId: number
    assetId: number
    state: Type_110
}

/**
 * Update pool's amplification.
 * 
 * Parameters:
 * - `origin`: Must be T::AuthorityOrigin
 * - `pool_id`: pool to update
 * - `future_amplification`: new desired pool amplification
 * - `future_block`: future block number when the amplification is updated
 * 
 * Emits `AmplificationUpdated` event if successful.
 */
export interface StableswapCall_update_amplification {
    __kind: 'update_amplification'
    poolId: number
    finalAmplification: number
    startBlock: number
    endBlock: number
}

/**
 * Update pool's fee.
 * 
 * if pool does not exist, `PoolNotFound` is returned.
 * 
 * Parameters:
 * - `origin`: Must be T::AuthorityOrigin
 * - `pool_id`: pool to update
 * - `fee`: new pool fee
 * 
 * Emits `FeeUpdated` event if successful.
 */
export interface StableswapCall_update_pool_fee {
    __kind: 'update_pool_fee'
    poolId: number
    fee: Permill
}

/**
 * Remove liquidity from selected pool by specifying exact amount of asset to receive.
 * 
 * Similar to `remove_liquidity_one_asset` but LP specifies exact amount of asset to receive instead of share amount.
 * 
 * Parameters:
 * - `origin`: liquidity provider
 * - `pool_id`: Pool Id
 * - `asset_id`: id of asset to receive
 * - 'amount': amount of asset to receive
 * - 'max_share_amount': Slippage limit. Max amount of shares to burn.
 * 
 * Emits `LiquidityRemoved` event when successful.
 */
export interface StableswapCall_withdraw_asset_amount {
    __kind: 'withdraw_asset_amount'
    poolId: number
    assetId: number
    amount: bigint
    maxShareAmount: bigint
}

export type Permill = number

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const SessionCall: sts.Type<SessionCall> = sts.closedEnum(() => {
    return  {
        purge_keys: sts.unit(),
        set_keys: sts.enumStruct({
            keys: SessionKeys,
            proof: sts.bytes(),
        }),
    }
})

export const SessionKeys: sts.Type<SessionKeys> = sts.struct(() => {
    return  {
        aura: Public,
    }
})

export const Public = sts.bytes()

export interface SessionKeys {
    aura: Public
}

export type Public = Bytes

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type SessionCall = SessionCall_purge_keys | SessionCall_set_keys

/**
 * Removes any session key(s) of the function caller.
 * 
 * This doesn't take effect until the next session.
 * 
 * The dispatch origin of this function must be Signed and the account must be either be
 * convertible to a validator ID using the chain's typical addressing system (this usually
 * means being a controller account) or directly convertible into a validator ID (which
 * usually means being a stash account).
 * 
 * ## Complexity
 * - `O(1)` in number of key types. Actual cost depends on the number of length of
 *   `T::Keys::key_ids()` which is fixed.
 */
export interface SessionCall_purge_keys {
    __kind: 'purge_keys'
}

/**
 * Sets the session key(s) of the function caller to `keys`.
 * Allows an account to set its session key prior to becoming a validator.
 * This doesn't take effect until the next session.
 * 
 * The dispatch origin of this function must be signed.
 * 
 * ## Complexity
 * - `O(1)`. Actual cost depends on the number of length of `T::Keys::key_ids()` which is
 *   fixed.
 */
export interface SessionCall_set_keys {
    __kind: 'set_keys'
    keys: SessionKeys
    proof: Bytes
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const SchedulerCall: sts.Type<SchedulerCall> = sts.closedEnum(() => {
    return  {
        cancel: sts.enumStruct({
            when: sts.number(),
            index: sts.number(),
        }),
        cancel_named: sts.enumStruct({
            id: sts.bytes(),
        }),
        cancel_retry: sts.enumStruct({
            task: sts.tuple(() => [sts.number(), sts.number()]),
        }),
        cancel_retry_named: sts.enumStruct({
            id: sts.bytes(),
        }),
        schedule: sts.enumStruct({
            when: sts.number(),
            maybePeriodic: sts.option(() => sts.tuple(() => [sts.number(), sts.number()])),
            priority: sts.number(),
            call: Call,
        }),
        schedule_after: sts.enumStruct({
            after: sts.number(),
            maybePeriodic: sts.option(() => sts.tuple(() => [sts.number(), sts.number()])),
            priority: sts.number(),
            call: Call,
        }),
        schedule_named: sts.enumStruct({
            id: sts.bytes(),
            when: sts.number(),
            maybePeriodic: sts.option(() => sts.tuple(() => [sts.number(), sts.number()])),
            priority: sts.number(),
            call: Call,
        }),
        schedule_named_after: sts.enumStruct({
            id: sts.bytes(),
            after: sts.number(),
            maybePeriodic: sts.option(() => sts.tuple(() => [sts.number(), sts.number()])),
            priority: sts.number(),
            call: Call,
        }),
        set_retry: sts.enumStruct({
            task: sts.tuple(() => [sts.number(), sts.number()]),
            retries: sts.number(),
            period: sts.number(),
        }),
        set_retry_named: sts.enumStruct({
            id: sts.bytes(),
            retries: sts.number(),
            period: sts.number(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type SchedulerCall = SchedulerCall_cancel | SchedulerCall_cancel_named | SchedulerCall_cancel_retry | SchedulerCall_cancel_retry_named | SchedulerCall_schedule | SchedulerCall_schedule_after | SchedulerCall_schedule_named | SchedulerCall_schedule_named_after | SchedulerCall_set_retry | SchedulerCall_set_retry_named

/**
 * Cancel an anonymously scheduled task.
 */
export interface SchedulerCall_cancel {
    __kind: 'cancel'
    when: number
    index: number
}

/**
 * Cancel a named scheduled task.
 */
export interface SchedulerCall_cancel_named {
    __kind: 'cancel_named'
    id: Bytes
}

/**
 * Removes the retry configuration of a task.
 */
export interface SchedulerCall_cancel_retry {
    __kind: 'cancel_retry'
    task: [number, number]
}

/**
 * Cancel the retry configuration of a named task.
 */
export interface SchedulerCall_cancel_retry_named {
    __kind: 'cancel_retry_named'
    id: Bytes
}

/**
 * Anonymously schedule a task.
 */
export interface SchedulerCall_schedule {
    __kind: 'schedule'
    when: number
    maybePeriodic?: ([number, number] | undefined)
    priority: number
    call: Call
}

/**
 * Anonymously schedule a task after a delay.
 */
export interface SchedulerCall_schedule_after {
    __kind: 'schedule_after'
    after: number
    maybePeriodic?: ([number, number] | undefined)
    priority: number
    call: Call
}

/**
 * Schedule a named task.
 */
export interface SchedulerCall_schedule_named {
    __kind: 'schedule_named'
    id: Bytes
    when: number
    maybePeriodic?: ([number, number] | undefined)
    priority: number
    call: Call
}

/**
 * Schedule a named task after a delay.
 */
export interface SchedulerCall_schedule_named_after {
    __kind: 'schedule_named_after'
    id: Bytes
    after: number
    maybePeriodic?: ([number, number] | undefined)
    priority: number
    call: Call
}

/**
 * Set a retry configuration for a task so that, in case its scheduled run fails, it will
 * be retried after `period` blocks, for a total amount of `retries` retries or until it
 * succeeds.
 * 
 * Tasks which need to be scheduled for a retry are still subject to weight metering and
 * agenda space, same as a regular task. If a periodic task fails, it will be scheduled
 * normally while the task is retrying.
 * 
 * Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic
 * clones of the original task. Their retry configuration will be derived from the
 * original task's configuration, but will have a lower value for `remaining` than the
 * original `total_retries`.
 */
export interface SchedulerCall_set_retry {
    __kind: 'set_retry'
    task: [number, number]
    retries: number
    period: number
}

/**
 * Set a retry configuration for a named task so that, in case its scheduled run fails, it
 * will be retried after `period` blocks, for a total amount of `retries` retries or until
 * it succeeds.
 * 
 * Tasks which need to be scheduled for a retry are still subject to weight metering and
 * agenda space, same as a regular task. If a periodic task fails, it will be scheduled
 * normally while the task is retrying.
 * 
 * Tasks scheduled as a result of a retry for a periodic task are unnamed, non-periodic
 * clones of the original task. Their retry configuration will be derived from the
 * original task's configuration, but will have a lower value for `remaining` than the
 * original `total_retries`.
 */
export interface SchedulerCall_set_retry_named {
    __kind: 'set_retry_named'
    id: Bytes
    retries: number
    period: number
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const RouterCall: sts.Type<RouterCall> = sts.closedEnum(() => {
    return  {
        buy: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountOut: sts.bigint(),
            maxAmountIn: sts.bigint(),
            route: sts.array(() => Trade),
        }),
        force_insert_route: sts.enumStruct({
            assetPair: Type_370,
            newRoute: sts.array(() => Trade),
        }),
        sell: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            minAmountOut: sts.bigint(),
            route: sts.array(() => Trade),
        }),
        sell_all: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            minAmountOut: sts.bigint(),
            route: sts.array(() => Trade),
        }),
        set_route: sts.enumStruct({
            assetPair: Type_370,
            newRoute: sts.array(() => Trade),
        }),
    }
})

export const Type_370: sts.Type<Type_370> = sts.struct(() => {
    return  {
        assetIn: sts.number(),
        assetOut: sts.number(),
    }
})

export interface Type_370 {
    assetIn: number
    assetOut: number
}

export const Trade: sts.Type<Trade> = sts.struct(() => {
    return  {
        pool: PoolType,
        assetIn: sts.number(),
        assetOut: sts.number(),
    }
})

export const PoolType: sts.Type<PoolType> = sts.closedEnum(() => {
    return  {
        LBP: sts.unit(),
        Omnipool: sts.unit(),
        Stableswap: sts.number(),
        XYK: sts.unit(),
    }
})

export type PoolType = PoolType_LBP | PoolType_Omnipool | PoolType_Stableswap | PoolType_XYK

export interface PoolType_LBP {
    __kind: 'LBP'
}

export interface PoolType_Omnipool {
    __kind: 'Omnipool'
}

export interface PoolType_Stableswap {
    __kind: 'Stableswap'
    value: number
}

export interface PoolType_XYK {
    __kind: 'XYK'
}

export interface Trade {
    pool: PoolType
    assetIn: number
    assetOut: number
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type RouterCall = RouterCall_buy | RouterCall_force_insert_route | RouterCall_sell | RouterCall_sell_all | RouterCall_set_route

/**
 * Executes a buy with a series of trades specified in the route.
 * The price for each trade is determined by the corresponding AMM.
 * 
 * - `origin`: The executor of the trade
 * - `asset_in`: The identifier of the asset to be swapped to buy `asset_out`
 * - `asset_out`: The identifier of the asset to buy
 * - `amount_out`: The amount of `asset_out` to buy
 * - `max_amount_in`: The max amount of `asset_in` to spend on the buy.
 * - `route`: Series of [`Trade<AssetId>`] to be executed. A [`Trade<AssetId>`] specifies the asset pair (`asset_in`, `asset_out`) and the AMM (`pool`) in which the trade is executed.
 * 		   If not specified, than the on-chain route is used.
 * 		   If no on-chain is present, then omnipool route is used as default
 * 
 * Emits `RouteExecuted` when successful.
 */
export interface RouterCall_buy {
    __kind: 'buy'
    assetIn: number
    assetOut: number
    amountOut: bigint
    maxAmountIn: bigint
    route: Trade[]
}

/**
 * Force inserts the on-chain route for a given asset pair, so there is no any validation for the route
 * 
 * Can only be called by technical origin
 * 
 * The route is stored in an ordered manner, based on the oder of the ids in the asset pair.
 * 
 * If the route is set successfully, then the fee is payed back.
 * 
 * - `origin`: The origin of the route setter
 * - `asset_pair`: The identifier of the asset-pair for which the route is set
 * - `new_route`: Series of [`Trade<AssetId>`] to be executed. A [`Trade<AssetId>`] specifies the asset pair (`asset_in`, `asset_out`) and the AMM (`pool`) in which the trade is executed.
 * 
 * Emits `RouteUpdated` when successful.
 * 
 */
export interface RouterCall_force_insert_route {
    __kind: 'force_insert_route'
    assetPair: Type_370
    newRoute: Trade[]
}

/**
 * Executes a sell with a series of trades specified in the route.
 * The price for each trade is determined by the corresponding AMM.
 * 
 * - `origin`: The executor of the trade
 * - `asset_in`: The identifier of the asset to sell
 * - `asset_out`: The identifier of the asset to receive
 * - `amount_in`: The amount of `asset_in` to sell
 * - `min_amount_out`: The minimum amount of `asset_out` to receive.
 * - `route`: Series of [`Trade<AssetId>`] to be executed. A [`Trade<AssetId>`] specifies the asset pair (`asset_in`, `asset_out`) and the AMM (`pool`) in which the trade is executed.
 * 		   If not specified, than the on-chain route is used.
 * 		   If no on-chain is present, then omnipool route is used as default
 * 
 * Emits `RouteExecuted` when successful.
 */
export interface RouterCall_sell {
    __kind: 'sell'
    assetIn: number
    assetOut: number
    amountIn: bigint
    minAmountOut: bigint
    route: Trade[]
}

/**
 * Executes a sell with a series of trades specified in the route.
 * It sells all reducible user balance of `asset_in`
 * The price for each trade is determined by the corresponding AMM.
 * 
 * - `origin`: The executor of the trade
 * - `asset_in`: The identifier of the asset to sell
 * - `asset_out`: The identifier of the asset to receive
 * - `min_amount_out`: The minimum amount of `asset_out` to receive.
 * - `route`: Series of [`Trade<AssetId>`] to be executed. A [`Trade<AssetId>`] specifies the asset pair (`asset_in`, `asset_out`) and the AMM (`pool`) in which the trade is executed.
 * 		   If not specified, than the on-chain route is used.
 * 		   If no on-chain is present, then omnipool route is used as default
 * 
 * Emits `RouteExecuted` when successful.
 * 
 */
export interface RouterCall_sell_all {
    __kind: 'sell_all'
    assetIn: number
    assetOut: number
    minAmountOut: bigint
    route: Trade[]
}

/**
 * Sets the on-chain route for a given asset pair.
 * 
 * The new route is validated by being executed in a dry-run mode
 * 
 * If there is no route explicitly set for an asset pair, then we use the omnipool route as default.
 * 
 * When a new route is set, we compare it to the existing (or default) route.
 * The comparison happens by calculating sell amount_outs for the routes, but also for the inversed routes.
 * 
 * The route is stored in an ordered manner, based on the oder of the ids in the asset pair.
 * 
 * If the route is set successfully, then the fee is payed back.
 * 
 * - `origin`: The origin of the route setter
 * - `asset_pair`: The identifier of the asset-pair for which the route is set
 * - `new_route`: Series of [`Trade<AssetId>`] to be executed. A [`Trade<AssetId>`] specifies the asset pair (`asset_in`, `asset_out`) and the AMM (`pool`) in which the trade is executed.
 * 
 * Emits `RouteUpdated` when successful.
 * 
 * Fails with `RouteUpdateIsNotSuccessful` error when failed to set the route
 * 
 */
export interface RouterCall_set_route {
    __kind: 'set_route'
    assetPair: Type_370
    newRoute: Trade[]
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const RelayChainInfoCall: sts.Type<RelayChainInfoCall> = sts.closedEnum(() => {
    return  {
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type RelayChainInfoCall = never

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const ReferralsCall: sts.Type<ReferralsCall> = sts.closedEnum(() => {
    return  {
        claim_rewards: sts.unit(),
        convert: sts.enumStruct({
            assetId: sts.number(),
        }),
        link_code: sts.enumStruct({
            code: sts.bytes(),
        }),
        register_code: sts.enumStruct({
            code: sts.bytes(),
        }),
        set_reward_percentage: sts.enumStruct({
            assetId: sts.number(),
            level: Level,
            rewards: FeeDistribution,
        }),
    }
})

export const FeeDistribution: sts.Type<FeeDistribution> = sts.struct(() => {
    return  {
        referrer: Permill,
        trader: Permill,
        external: Permill,
    }
})

export interface FeeDistribution {
    referrer: Permill
    trader: Permill
    external: Permill
}

export const Level: sts.Type<Level> = sts.closedEnum(() => {
    return  {
        None: sts.unit(),
        Tier0: sts.unit(),
        Tier1: sts.unit(),
        Tier2: sts.unit(),
        Tier3: sts.unit(),
        Tier4: sts.unit(),
    }
})

export type Level = Level_None | Level_Tier0 | Level_Tier1 | Level_Tier2 | Level_Tier3 | Level_Tier4

export interface Level_None {
    __kind: 'None'
}

export interface Level_Tier0 {
    __kind: 'Tier0'
}

export interface Level_Tier1 {
    __kind: 'Tier1'
}

export interface Level_Tier2 {
    __kind: 'Tier2'
}

export interface Level_Tier3 {
    __kind: 'Tier3'
}

export interface Level_Tier4 {
    __kind: 'Tier4'
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type ReferralsCall = ReferralsCall_claim_rewards | ReferralsCall_convert | ReferralsCall_link_code | ReferralsCall_register_code | ReferralsCall_set_reward_percentage

/**
 * Claim accumulated rewards
 * 
 * IF there is any asset in the reward pot, all is converted to RewardCurrency first.
 * 
 * Reward amount is calculated based on the shares of the signer account.
 * 
 * if the signer account is referrer account, total accumulated rewards is updated as well as referrer level if reached.
 * 
 * Emits `Claimed` event when successful.
 */
export interface ReferralsCall_claim_rewards {
    __kind: 'claim_rewards'
}

/**
 * Convert accrued asset amount to reward currency.
 * 
 * Parameters:
 * - `asset_id`: Id of an asset to convert to RewardAsset.
 * 
 * Emits `Converted` event when successful.
 */
export interface ReferralsCall_convert {
    __kind: 'convert'
    assetId: number
}

/**
 * Link a code to an account.
 * 
 * `Code` must be valid registered code. Otherwise `InvalidCode` is returned.
 * 
 * Signer account is linked to the referral account of the code.
 * 
 * Parameters:
 * - `code`: Code to use to link the signer account to.
 * 
 * Emits `CodeLinked` event when successful.
 */
export interface ReferralsCall_link_code {
    __kind: 'link_code'
    code: Bytes
}

/**
 * Register new referral code.
 * 
 * `origin` pays the registration fee.
 * `code` is assigned to the given `account`.
 * 
 * Length of the `code` must be at least `T::MinCodeLength`.
 * Maximum length is limited to `T::CodeLength`.
 * `code` must contain only alfa-numeric characters and all characters will be converted to upper case.
 * 
 * Parameters:
 * - `code`: Code to register. Must follow the restrictions.
 * 
 * Emits `CodeRegistered` event when successful.
 */
export interface ReferralsCall_register_code {
    __kind: 'register_code'
    code: Bytes
}

/**
 * Set asset reward percentages
 * 
 * Parameters:
 * - `asset_id`: asset id
 * - `level`: level
 * - `rewards`: reward fee percentages
 * 
 * Emits `AssetRewardsUpdated` event when successful.
 */
export interface ReferralsCall_set_reward_percentage {
    __kind: 'set_reward_percentage'
    assetId: number
    level: Level
    rewards: FeeDistribution
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const ProxyCall: sts.Type<ProxyCall> = sts.closedEnum(() => {
    return  {
        add_proxy: sts.enumStruct({
            delegate: AccountId32,
            proxyType: ProxyType,
            delay: sts.number(),
        }),
        announce: sts.enumStruct({
            real: AccountId32,
            callHash: H256,
        }),
        create_pure: sts.enumStruct({
            proxyType: ProxyType,
            delay: sts.number(),
            index: sts.number(),
        }),
        kill_pure: sts.enumStruct({
            spawner: AccountId32,
            proxyType: ProxyType,
            index: sts.number(),
            height: sts.number(),
            extIndex: sts.number(),
        }),
        proxy: sts.enumStruct({
            real: AccountId32,
            forceProxyType: sts.option(() => ProxyType),
            call: Call,
        }),
        proxy_announced: sts.enumStruct({
            delegate: AccountId32,
            real: AccountId32,
            forceProxyType: sts.option(() => ProxyType),
            call: Call,
        }),
        reject_announcement: sts.enumStruct({
            delegate: AccountId32,
            callHash: H256,
        }),
        remove_announcement: sts.enumStruct({
            real: AccountId32,
            callHash: H256,
        }),
        remove_proxies: sts.unit(),
        remove_proxy: sts.enumStruct({
            delegate: AccountId32,
            proxyType: ProxyType,
            delay: sts.number(),
        }),
    }
})

export const ProxyType: sts.Type<ProxyType> = sts.closedEnum(() => {
    return  {
        Any: sts.unit(),
        CancelProxy: sts.unit(),
        Governance: sts.unit(),
        Liquidity: sts.unit(),
        LiquidityMining: sts.unit(),
        Transfer: sts.unit(),
    }
})

export type ProxyType = ProxyType_Any | ProxyType_CancelProxy | ProxyType_Governance | ProxyType_Liquidity | ProxyType_LiquidityMining | ProxyType_Transfer

export interface ProxyType_Any {
    __kind: 'Any'
}

export interface ProxyType_CancelProxy {
    __kind: 'CancelProxy'
}

export interface ProxyType_Governance {
    __kind: 'Governance'
}

export interface ProxyType_Liquidity {
    __kind: 'Liquidity'
}

export interface ProxyType_LiquidityMining {
    __kind: 'LiquidityMining'
}

export interface ProxyType_Transfer {
    __kind: 'Transfer'
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type ProxyCall = ProxyCall_add_proxy | ProxyCall_announce | ProxyCall_create_pure | ProxyCall_kill_pure | ProxyCall_proxy | ProxyCall_proxy_announced | ProxyCall_reject_announcement | ProxyCall_remove_announcement | ProxyCall_remove_proxies | ProxyCall_remove_proxy

/**
 * Register a proxy account for the sender that is able to make calls on its behalf.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * Parameters:
 * - `proxy`: The account that the `caller` would like to make a proxy.
 * - `proxy_type`: The permissions allowed for this proxy account.
 * - `delay`: The announcement period required of the initial proxy. Will generally be
 * zero.
 */
export interface ProxyCall_add_proxy {
    __kind: 'add_proxy'
    delegate: AccountId32
    proxyType: ProxyType
    delay: number
}

/**
 * Publish the hash of a proxy-call that will be made in the future.
 * 
 * This must be called some number of blocks before the corresponding `proxy` is attempted
 * if the delay associated with the proxy relationship is greater than zero.
 * 
 * No more than `MaxPending` announcements may be made at any one time.
 * 
 * This will take a deposit of `AnnouncementDepositFactor` as well as
 * `AnnouncementDepositBase` if there are no other pending announcements.
 * 
 * The dispatch origin for this call must be _Signed_ and a proxy of `real`.
 * 
 * Parameters:
 * - `real`: The account that the proxy will make a call on behalf of.
 * - `call_hash`: The hash of the call to be made by the `real` account.
 */
export interface ProxyCall_announce {
    __kind: 'announce'
    real: AccountId32
    callHash: H256
}

/**
 * Spawn a fresh new account that is guaranteed to be otherwise inaccessible, and
 * initialize it with a proxy of `proxy_type` for `origin` sender.
 * 
 * Requires a `Signed` origin.
 * 
 * - `proxy_type`: The type of the proxy that the sender will be registered as over the
 * new account. This will almost always be the most permissive `ProxyType` possible to
 * allow for maximum flexibility.
 * - `index`: A disambiguation index, in case this is called multiple times in the same
 * transaction (e.g. with `utility::batch`). Unless you're using `batch` you probably just
 * want to use `0`.
 * - `delay`: The announcement period required of the initial proxy. Will generally be
 * zero.
 * 
 * Fails with `Duplicate` if this has already been called in this transaction, from the
 * same sender, with the same parameters.
 * 
 * Fails if there are insufficient funds to pay for deposit.
 */
export interface ProxyCall_create_pure {
    __kind: 'create_pure'
    proxyType: ProxyType
    delay: number
    index: number
}

/**
 * Removes a previously spawned pure proxy.
 * 
 * WARNING: **All access to this account will be lost.** Any funds held in it will be
 * inaccessible.
 * 
 * Requires a `Signed` origin, and the sender account must have been created by a call to
 * `pure` with corresponding parameters.
 * 
 * - `spawner`: The account that originally called `pure` to create this account.
 * - `index`: The disambiguation index originally passed to `pure`. Probably `0`.
 * - `proxy_type`: The proxy type originally passed to `pure`.
 * - `height`: The height of the chain when the call to `pure` was processed.
 * - `ext_index`: The extrinsic index in which the call to `pure` was processed.
 * 
 * Fails with `NoPermission` in case the caller is not a previously created pure
 * account whose `pure` call has corresponding parameters.
 */
export interface ProxyCall_kill_pure {
    __kind: 'kill_pure'
    spawner: AccountId32
    proxyType: ProxyType
    index: number
    height: number
    extIndex: number
}

/**
 * Dispatch the given `call` from an account that the sender is authorised for through
 * `add_proxy`.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * Parameters:
 * - `real`: The account that the proxy will make a call on behalf of.
 * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
 * - `call`: The call to be made by the `real` account.
 */
export interface ProxyCall_proxy {
    __kind: 'proxy'
    real: AccountId32
    forceProxyType?: (ProxyType | undefined)
    call: Call
}

/**
 * Dispatch the given `call` from an account that the sender is authorized for through
 * `add_proxy`.
 * 
 * Removes any corresponding announcement(s).
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * Parameters:
 * - `real`: The account that the proxy will make a call on behalf of.
 * - `force_proxy_type`: Specify the exact proxy type to be used and checked for this call.
 * - `call`: The call to be made by the `real` account.
 */
export interface ProxyCall_proxy_announced {
    __kind: 'proxy_announced'
    delegate: AccountId32
    real: AccountId32
    forceProxyType?: (ProxyType | undefined)
    call: Call
}

/**
 * Remove the given announcement of a delegate.
 * 
 * May be called by a target (proxied) account to remove a call that one of their delegates
 * (`delegate`) has announced they want to execute. The deposit is returned.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * Parameters:
 * - `delegate`: The account that previously announced the call.
 * - `call_hash`: The hash of the call to be made.
 */
export interface ProxyCall_reject_announcement {
    __kind: 'reject_announcement'
    delegate: AccountId32
    callHash: H256
}

/**
 * Remove a given announcement.
 * 
 * May be called by a proxy account to remove a call they previously announced and return
 * the deposit.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * Parameters:
 * - `real`: The account that the proxy will make a call on behalf of.
 * - `call_hash`: The hash of the call to be made by the `real` account.
 */
export interface ProxyCall_remove_announcement {
    __kind: 'remove_announcement'
    real: AccountId32
    callHash: H256
}

/**
 * Unregister all proxy accounts for the sender.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * WARNING: This may be called on accounts created by `pure`, however if done, then
 * the unreserved fees will be inaccessible. **All access to this account will be lost.**
 */
export interface ProxyCall_remove_proxies {
    __kind: 'remove_proxies'
}

/**
 * Unregister a proxy account for the sender.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * Parameters:
 * - `proxy`: The account that the `caller` would like to remove as a proxy.
 * - `proxy_type`: The permissions currently enabled for the removed proxy account.
 */
export interface ProxyCall_remove_proxy {
    __kind: 'remove_proxy'
    delegate: AccountId32
    proxyType: ProxyType
    delay: number
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const PreimageCall: sts.Type<PreimageCall> = sts.closedEnum(() => {
    return  {
        ensure_updated: sts.enumStruct({
            hashes: sts.array(() => H256),
        }),
        note_preimage: sts.enumStruct({
            bytes: sts.bytes(),
        }),
        request_preimage: sts.enumStruct({
            hash: H256,
        }),
        unnote_preimage: sts.enumStruct({
            hash: H256,
        }),
        unrequest_preimage: sts.enumStruct({
            hash: H256,
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type PreimageCall = PreimageCall_ensure_updated | PreimageCall_note_preimage | PreimageCall_request_preimage | PreimageCall_unnote_preimage | PreimageCall_unrequest_preimage

/**
 * Ensure that the a bulk of pre-images is upgraded.
 * 
 * The caller pays no fee if at least 90% of pre-images were successfully updated.
 */
export interface PreimageCall_ensure_updated {
    __kind: 'ensure_updated'
    hashes: H256[]
}

/**
 * Register a preimage on-chain.
 * 
 * If the preimage was previously requested, no fees or deposits are taken for providing
 * the preimage. Otherwise, a deposit is taken proportional to the size of the preimage.
 */
export interface PreimageCall_note_preimage {
    __kind: 'note_preimage'
    bytes: Bytes
}

/**
 * Request a preimage be uploaded to the chain without paying any fees or deposits.
 * 
 * If the preimage requests has already been provided on-chain, we unreserve any deposit
 * a user may have paid, and take the control of the preimage out of their hands.
 */
export interface PreimageCall_request_preimage {
    __kind: 'request_preimage'
    hash: H256
}

/**
 * Clear an unrequested preimage from the runtime storage.
 * 
 * If `len` is provided, then it will be a much cheaper operation.
 * 
 * - `hash`: The hash of the preimage to be removed from the store.
 * - `len`: The length of the preimage of `hash`.
 */
export interface PreimageCall_unnote_preimage {
    __kind: 'unnote_preimage'
    hash: H256
}

/**
 * Clear a previously made request for a preimage.
 * 
 * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
 */
export interface PreimageCall_unrequest_preimage {
    __kind: 'unrequest_preimage'
    hash: H256
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const PolkadotXcmCall: sts.Type<PolkadotXcmCall> = sts.closedEnum(() => {
    return  {
        claim_assets: sts.enumStruct({
            assets: VersionedAssets,
            beneficiary: VersionedLocation,
        }),
        execute: sts.enumStruct({
            message: Type_446,
            maxWeight: Weight,
        }),
        force_default_xcm_version: sts.enumStruct({
            maybeXcmVersion: sts.option(() => sts.number()),
        }),
        force_subscribe_version_notify: sts.enumStruct({
            location: VersionedLocation,
        }),
        force_suspension: sts.enumStruct({
            suspended: sts.boolean(),
        }),
        force_unsubscribe_version_notify: sts.enumStruct({
            location: VersionedLocation,
        }),
        force_xcm_version: sts.enumStruct({
            location: V4Location,
            version: sts.number(),
        }),
        limited_reserve_transfer_assets: sts.enumStruct({
            dest: VersionedLocation,
            beneficiary: VersionedLocation,
            assets: VersionedAssets,
            feeAssetItem: sts.number(),
            weightLimit: V3WeightLimit,
        }),
        limited_teleport_assets: sts.enumStruct({
            dest: VersionedLocation,
            beneficiary: VersionedLocation,
            assets: VersionedAssets,
            feeAssetItem: sts.number(),
            weightLimit: V3WeightLimit,
        }),
        reserve_transfer_assets: sts.enumStruct({
            dest: VersionedLocation,
            beneficiary: VersionedLocation,
            assets: VersionedAssets,
            feeAssetItem: sts.number(),
        }),
        send: sts.enumStruct({
            dest: VersionedLocation,
            message: VersionedXcm,
        }),
        teleport_assets: sts.enumStruct({
            dest: VersionedLocation,
            beneficiary: VersionedLocation,
            assets: VersionedAssets,
            feeAssetItem: sts.number(),
        }),
        transfer_assets: sts.enumStruct({
            dest: VersionedLocation,
            beneficiary: VersionedLocation,
            assets: VersionedAssets,
            feeAssetItem: sts.number(),
            weightLimit: V3WeightLimit,
        }),
        transfer_assets_using_type_and_then: sts.enumStruct({
            dest: VersionedLocation,
            assets: VersionedAssets,
            assetsTransferType: TransferType,
            remoteFeesId: VersionedAssetId,
            feesTransferType: TransferType,
            customXcmOnDest: VersionedXcm,
            weightLimit: V3WeightLimit,
        }),
    }
})

export const VersionedAssetId: sts.Type<VersionedAssetId> = sts.closedEnum(() => {
    return  {
        V3: V3AssetId,
        V4: V4AssetId,
    }
})

export type VersionedAssetId = VersionedAssetId_V3 | VersionedAssetId_V4

export interface VersionedAssetId_V3 {
    __kind: 'V3'
    value: V3AssetId
}

export interface VersionedAssetId_V4 {
    __kind: 'V4'
    value: V4AssetId
}

export const TransferType: sts.Type<TransferType> = sts.closedEnum(() => {
    return  {
        DestinationReserve: sts.unit(),
        LocalReserve: sts.unit(),
        RemoteReserve: VersionedLocation,
        Teleport: sts.unit(),
    }
})

export type TransferType = TransferType_DestinationReserve | TransferType_LocalReserve | TransferType_RemoteReserve | TransferType_Teleport

export interface TransferType_DestinationReserve {
    __kind: 'DestinationReserve'
}

export interface TransferType_LocalReserve {
    __kind: 'LocalReserve'
}

export interface TransferType_RemoteReserve {
    __kind: 'RemoteReserve'
    value: VersionedLocation
}

export interface TransferType_Teleport {
    __kind: 'Teleport'
}

export const VersionedXcm: sts.Type<VersionedXcm> = sts.closedEnum(() => {
    return  {
        V2: sts.array(() => V2Instruction),
        V3: sts.array(() => V3Instruction),
        V4: sts.array(() => V4Instruction),
    }
})

export const V4Instruction: sts.Type<V4Instruction> = sts.closedEnum(() => {
    return  {
        AliasOrigin: V4Location,
        BurnAsset: sts.array(() => V4Asset),
        BuyExecution: sts.enumStruct({
            fees: V4Asset,
            weightLimit: V3WeightLimit,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => V4Asset),
            ticket: V4Location,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        ClearTopic: sts.unit(),
        ClearTransactStatus: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: V4AssetFilter,
            beneficiary: V4Location,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: V4AssetFilter,
            dest: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        DescendOrigin: V4Junctions,
        ExchangeAsset: sts.enumStruct({
            give: V4AssetFilter,
            want: sts.array(() => V4Asset),
            maximal: sts.boolean(),
        }),
        ExpectAsset: sts.array(() => V4Asset),
        ExpectError: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        ExpectOrigin: sts.option(() => V4Location),
        ExpectPallet: sts.enumStruct({
            index: sts.number(),
            name: sts.bytes(),
            moduleName: sts.bytes(),
            crateMajor: sts.number(),
            minCrateMinor: sts.number(),
        }),
        ExpectTransactStatus: V3MaybeErrorCode,
        ExportMessage: sts.enumStruct({
            network: V4NetworkId,
            destination: V4Junctions,
            xcm: sts.array(() => V4Instruction),
        }),
        HrmpChannelAccepted: sts.enumStruct({
            recipient: sts.number(),
        }),
        HrmpChannelClosing: sts.enumStruct({
            initiator: sts.number(),
            sender: sts.number(),
            recipient: sts.number(),
        }),
        HrmpNewChannelOpenRequest: sts.enumStruct({
            sender: sts.number(),
            maxMessageSize: sts.number(),
            maxCapacity: sts.number(),
        }),
        InitiateReserveWithdraw: sts.enumStruct({
            assets: V4AssetFilter,
            reserve: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: V4AssetFilter,
            dest: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        LockAsset: sts.enumStruct({
            asset: V4Asset,
            unlocker: V4Location,
        }),
        NoteUnlockable: sts.enumStruct({
            asset: V4Asset,
            owner: V4Location,
        }),
        QueryPallet: sts.enumStruct({
            moduleName: sts.bytes(),
            responseInfo: V4QueryResponseInfo,
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: V4Response,
            maxWeight: Weight,
            querier: sts.option(() => V4Location),
        }),
        ReceiveTeleportedAsset: sts.array(() => V4Asset),
        RefundSurplus: sts.unit(),
        ReportError: V4QueryResponseInfo,
        ReportHolding: sts.enumStruct({
            responseInfo: V4QueryResponseInfo,
            assets: V4AssetFilter,
        }),
        ReportTransactStatus: V4QueryResponseInfo,
        RequestUnlock: sts.enumStruct({
            asset: V4Asset,
            locker: V4Location,
        }),
        ReserveAssetDeposited: sts.array(() => V4Asset),
        SetAppendix: sts.array(() => V4Instruction),
        SetErrorHandler: sts.array(() => V4Instruction),
        SetFeesMode: sts.enumStruct({
            jitWithdraw: sts.boolean(),
        }),
        SetTopic: sts.bytes(),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: Weight,
        }),
        Transact: sts.enumStruct({
            originKind: V2OriginKind,
            requireWeightAtMost: Weight,
            call: DoubleEncoded,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => V4Asset),
            beneficiary: V4Location,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => V4Asset),
            dest: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        Trap: sts.bigint(),
        UniversalOrigin: V4Junction,
        UnlockAsset: sts.enumStruct({
            asset: V4Asset,
            target: V4Location,
        }),
        UnpaidExecution: sts.enumStruct({
            weightLimit: V3WeightLimit,
            checkOrigin: sts.option(() => V4Location),
        }),
        UnsubscribeVersion: sts.unit(),
        WithdrawAsset: sts.array(() => V4Asset),
    }
})

export const DoubleEncoded: sts.Type<DoubleEncoded> = sts.struct(() => {
    return  {
        encoded: sts.bytes(),
    }
})

export interface DoubleEncoded {
    encoded: Bytes
}

export const V2OriginKind: sts.Type<V2OriginKind> = sts.closedEnum(() => {
    return  {
        Native: sts.unit(),
        SovereignAccount: sts.unit(),
        Superuser: sts.unit(),
        Xcm: sts.unit(),
    }
})

export type V2OriginKind = V2OriginKind_Native | V2OriginKind_SovereignAccount | V2OriginKind_Superuser | V2OriginKind_Xcm

export interface V2OriginKind_Native {
    __kind: 'Native'
}

export interface V2OriginKind_SovereignAccount {
    __kind: 'SovereignAccount'
}

export interface V2OriginKind_Superuser {
    __kind: 'Superuser'
}

export interface V2OriginKind_Xcm {
    __kind: 'Xcm'
}

export const V4Response: sts.Type<V4Response> = sts.closedEnum(() => {
    return  {
        Assets: sts.array(() => V4Asset),
        DispatchResult: V3MaybeErrorCode,
        ExecutionResult: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        Null: sts.unit(),
        PalletsInfo: sts.array(() => V4PalletInfo),
        Version: sts.number(),
    }
})

export const V4PalletInfo: sts.Type<V4PalletInfo> = sts.struct(() => {
    return  {
        index: sts.number(),
        name: sts.bytes(),
        moduleName: sts.bytes(),
        major: sts.number(),
        minor: sts.number(),
        patch: sts.number(),
    }
})

export interface V4PalletInfo {
    index: number
    name: Bytes
    moduleName: Bytes
    major: number
    minor: number
    patch: number
}

export type V4Response = V4Response_Assets | V4Response_DispatchResult | V4Response_ExecutionResult | V4Response_Null | V4Response_PalletsInfo | V4Response_Version

export interface V4Response_Assets {
    __kind: 'Assets'
    value: V4Asset[]
}

export interface V4Response_DispatchResult {
    __kind: 'DispatchResult'
    value: V3MaybeErrorCode
}

export interface V4Response_ExecutionResult {
    __kind: 'ExecutionResult'
    value?: ([number, V3Error] | undefined)
}

export interface V4Response_Null {
    __kind: 'Null'
}

export interface V4Response_PalletsInfo {
    __kind: 'PalletsInfo'
    value: V4PalletInfo[]
}

export interface V4Response_Version {
    __kind: 'Version'
    value: number
}

export type V3Error = V3Error_AssetNotFound | V3Error_BadOrigin | V3Error_Barrier | V3Error_DestinationUnsupported | V3Error_ExceedsMaxMessageSize | V3Error_ExceedsStackLimit | V3Error_ExpectationFalse | V3Error_ExportError | V3Error_FailedToDecode | V3Error_FailedToTransactAsset | V3Error_FeesNotMet | V3Error_HoldingWouldOverflow | V3Error_InvalidLocation | V3Error_LocationCannotHold | V3Error_LocationFull | V3Error_LocationNotInvertible | V3Error_LockError | V3Error_MaxWeightInvalid | V3Error_NameMismatch | V3Error_NoDeal | V3Error_NoPermission | V3Error_NotDepositable | V3Error_NotHoldingFees | V3Error_NotWithdrawable | V3Error_Overflow | V3Error_PalletNotFound | V3Error_ReanchorFailed | V3Error_TooExpensive | V3Error_Transport | V3Error_Trap | V3Error_Unanchored | V3Error_UnhandledXcmVersion | V3Error_Unimplemented | V3Error_UnknownClaim | V3Error_Unroutable | V3Error_UntrustedReserveLocation | V3Error_UntrustedTeleportLocation | V3Error_VersionIncompatible | V3Error_WeightLimitReached | V3Error_WeightNotComputable

export interface V3Error_AssetNotFound {
    __kind: 'AssetNotFound'
}

export interface V3Error_BadOrigin {
    __kind: 'BadOrigin'
}

export interface V3Error_Barrier {
    __kind: 'Barrier'
}

export interface V3Error_DestinationUnsupported {
    __kind: 'DestinationUnsupported'
}

export interface V3Error_ExceedsMaxMessageSize {
    __kind: 'ExceedsMaxMessageSize'
}

export interface V3Error_ExceedsStackLimit {
    __kind: 'ExceedsStackLimit'
}

export interface V3Error_ExpectationFalse {
    __kind: 'ExpectationFalse'
}

export interface V3Error_ExportError {
    __kind: 'ExportError'
}

export interface V3Error_FailedToDecode {
    __kind: 'FailedToDecode'
}

export interface V3Error_FailedToTransactAsset {
    __kind: 'FailedToTransactAsset'
}

export interface V3Error_FeesNotMet {
    __kind: 'FeesNotMet'
}

export interface V3Error_HoldingWouldOverflow {
    __kind: 'HoldingWouldOverflow'
}

export interface V3Error_InvalidLocation {
    __kind: 'InvalidLocation'
}

export interface V3Error_LocationCannotHold {
    __kind: 'LocationCannotHold'
}

export interface V3Error_LocationFull {
    __kind: 'LocationFull'
}

export interface V3Error_LocationNotInvertible {
    __kind: 'LocationNotInvertible'
}

export interface V3Error_LockError {
    __kind: 'LockError'
}

export interface V3Error_MaxWeightInvalid {
    __kind: 'MaxWeightInvalid'
}

export interface V3Error_NameMismatch {
    __kind: 'NameMismatch'
}

export interface V3Error_NoDeal {
    __kind: 'NoDeal'
}

export interface V3Error_NoPermission {
    __kind: 'NoPermission'
}

export interface V3Error_NotDepositable {
    __kind: 'NotDepositable'
}

export interface V3Error_NotHoldingFees {
    __kind: 'NotHoldingFees'
}

export interface V3Error_NotWithdrawable {
    __kind: 'NotWithdrawable'
}

export interface V3Error_Overflow {
    __kind: 'Overflow'
}

export interface V3Error_PalletNotFound {
    __kind: 'PalletNotFound'
}

export interface V3Error_ReanchorFailed {
    __kind: 'ReanchorFailed'
}

export interface V3Error_TooExpensive {
    __kind: 'TooExpensive'
}

export interface V3Error_Transport {
    __kind: 'Transport'
}

export interface V3Error_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V3Error_Unanchored {
    __kind: 'Unanchored'
}

export interface V3Error_UnhandledXcmVersion {
    __kind: 'UnhandledXcmVersion'
}

export interface V3Error_Unimplemented {
    __kind: 'Unimplemented'
}

export interface V3Error_UnknownClaim {
    __kind: 'UnknownClaim'
}

export interface V3Error_Unroutable {
    __kind: 'Unroutable'
}

export interface V3Error_UntrustedReserveLocation {
    __kind: 'UntrustedReserveLocation'
}

export interface V3Error_UntrustedTeleportLocation {
    __kind: 'UntrustedTeleportLocation'
}

export interface V3Error_VersionIncompatible {
    __kind: 'VersionIncompatible'
}

export interface V3Error_WeightLimitReached {
    __kind: 'WeightLimitReached'
    value: Weight
}

export interface V3Error_WeightNotComputable {
    __kind: 'WeightNotComputable'
}

export type V3MaybeErrorCode = V3MaybeErrorCode_Error | V3MaybeErrorCode_Success | V3MaybeErrorCode_TruncatedError

export interface V3MaybeErrorCode_Error {
    __kind: 'Error'
    value: Bytes
}

export interface V3MaybeErrorCode_Success {
    __kind: 'Success'
}

export interface V3MaybeErrorCode_TruncatedError {
    __kind: 'TruncatedError'
    value: Bytes
}

export const V4QueryResponseInfo: sts.Type<V4QueryResponseInfo> = sts.struct(() => {
    return  {
        destination: V4Location,
        queryId: sts.bigint(),
        maxWeight: Weight,
    }
})

export interface V4QueryResponseInfo {
    destination: V4Location
    queryId: bigint
    maxWeight: Weight
}

export const V3MaybeErrorCode: sts.Type<V3MaybeErrorCode> = sts.closedEnum(() => {
    return  {
        Error: sts.bytes(),
        Success: sts.unit(),
        TruncatedError: sts.bytes(),
    }
})

export const V3Error: sts.Type<V3Error> = sts.closedEnum(() => {
    return  {
        AssetNotFound: sts.unit(),
        BadOrigin: sts.unit(),
        Barrier: sts.unit(),
        DestinationUnsupported: sts.unit(),
        ExceedsMaxMessageSize: sts.unit(),
        ExceedsStackLimit: sts.unit(),
        ExpectationFalse: sts.unit(),
        ExportError: sts.unit(),
        FailedToDecode: sts.unit(),
        FailedToTransactAsset: sts.unit(),
        FeesNotMet: sts.unit(),
        HoldingWouldOverflow: sts.unit(),
        InvalidLocation: sts.unit(),
        LocationCannotHold: sts.unit(),
        LocationFull: sts.unit(),
        LocationNotInvertible: sts.unit(),
        LockError: sts.unit(),
        MaxWeightInvalid: sts.unit(),
        NameMismatch: sts.unit(),
        NoDeal: sts.unit(),
        NoPermission: sts.unit(),
        NotDepositable: sts.unit(),
        NotHoldingFees: sts.unit(),
        NotWithdrawable: sts.unit(),
        Overflow: sts.unit(),
        PalletNotFound: sts.unit(),
        ReanchorFailed: sts.unit(),
        TooExpensive: sts.unit(),
        Transport: sts.unit(),
        Trap: sts.bigint(),
        Unanchored: sts.unit(),
        UnhandledXcmVersion: sts.unit(),
        Unimplemented: sts.unit(),
        UnknownClaim: sts.unit(),
        Unroutable: sts.unit(),
        UntrustedReserveLocation: sts.unit(),
        UntrustedTeleportLocation: sts.unit(),
        VersionIncompatible: sts.unit(),
        WeightLimitReached: Weight,
        WeightNotComputable: sts.unit(),
    }
})

export const V4AssetFilter: sts.Type<V4AssetFilter> = sts.closedEnum(() => {
    return  {
        Definite: sts.array(() => V4Asset),
        Wild: V4WildAsset,
    }
})

export const V4WildAsset: sts.Type<V4WildAsset> = sts.closedEnum(() => {
    return  {
        All: sts.unit(),
        AllCounted: sts.number(),
        AllOf: sts.enumStruct({
            id: V4AssetId,
            fun: V4WildFungibility,
        }),
        AllOfCounted: sts.enumStruct({
            id: V4AssetId,
            fun: V4WildFungibility,
            count: sts.number(),
        }),
    }
})

export const V4WildFungibility: sts.Type<V4WildFungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.unit(),
        NonFungible: sts.unit(),
    }
})

export type V4WildFungibility = V4WildFungibility_Fungible | V4WildFungibility_NonFungible

export interface V4WildFungibility_Fungible {
    __kind: 'Fungible'
}

export interface V4WildFungibility_NonFungible {
    __kind: 'NonFungible'
}

export type V4WildAsset = V4WildAsset_All | V4WildAsset_AllCounted | V4WildAsset_AllOf | V4WildAsset_AllOfCounted

export interface V4WildAsset_All {
    __kind: 'All'
}

export interface V4WildAsset_AllCounted {
    __kind: 'AllCounted'
    value: number
}

export interface V4WildAsset_AllOf {
    __kind: 'AllOf'
    id: V4AssetId
    fun: V4WildFungibility
}

export interface V4WildAsset_AllOfCounted {
    __kind: 'AllOfCounted'
    id: V4AssetId
    fun: V4WildFungibility
    count: number
}

export type V4AssetFilter = V4AssetFilter_Definite | V4AssetFilter_Wild

export interface V4AssetFilter_Definite {
    __kind: 'Definite'
    value: V4Asset[]
}

export interface V4AssetFilter_Wild {
    __kind: 'Wild'
    value: V4WildAsset
}

export type V4Instruction = V4Instruction_AliasOrigin | V4Instruction_BurnAsset | V4Instruction_BuyExecution | V4Instruction_ClaimAsset | V4Instruction_ClearError | V4Instruction_ClearOrigin | V4Instruction_ClearTopic | V4Instruction_ClearTransactStatus | V4Instruction_DepositAsset | V4Instruction_DepositReserveAsset | V4Instruction_DescendOrigin | V4Instruction_ExchangeAsset | V4Instruction_ExpectAsset | V4Instruction_ExpectError | V4Instruction_ExpectOrigin | V4Instruction_ExpectPallet | V4Instruction_ExpectTransactStatus | V4Instruction_ExportMessage | V4Instruction_HrmpChannelAccepted | V4Instruction_HrmpChannelClosing | V4Instruction_HrmpNewChannelOpenRequest | V4Instruction_InitiateReserveWithdraw | V4Instruction_InitiateTeleport | V4Instruction_LockAsset | V4Instruction_NoteUnlockable | V4Instruction_QueryPallet | V4Instruction_QueryResponse | V4Instruction_ReceiveTeleportedAsset | V4Instruction_RefundSurplus | V4Instruction_ReportError | V4Instruction_ReportHolding | V4Instruction_ReportTransactStatus | V4Instruction_RequestUnlock | V4Instruction_ReserveAssetDeposited | V4Instruction_SetAppendix | V4Instruction_SetErrorHandler | V4Instruction_SetFeesMode | V4Instruction_SetTopic | V4Instruction_SubscribeVersion | V4Instruction_Transact | V4Instruction_TransferAsset | V4Instruction_TransferReserveAsset | V4Instruction_Trap | V4Instruction_UniversalOrigin | V4Instruction_UnlockAsset | V4Instruction_UnpaidExecution | V4Instruction_UnsubscribeVersion | V4Instruction_WithdrawAsset

export interface V4Instruction_AliasOrigin {
    __kind: 'AliasOrigin'
    value: V4Location
}

export interface V4Instruction_BurnAsset {
    __kind: 'BurnAsset'
    value: V4Asset[]
}

export interface V4Instruction_BuyExecution {
    __kind: 'BuyExecution'
    fees: V4Asset
    weightLimit: V3WeightLimit
}

export interface V4Instruction_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V4Asset[]
    ticket: V4Location
}

export interface V4Instruction_ClearError {
    __kind: 'ClearError'
}

export interface V4Instruction_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface V4Instruction_ClearTopic {
    __kind: 'ClearTopic'
}

export interface V4Instruction_ClearTransactStatus {
    __kind: 'ClearTransactStatus'
}

export interface V4Instruction_DepositAsset {
    __kind: 'DepositAsset'
    assets: V4AssetFilter
    beneficiary: V4Location
}

export interface V4Instruction_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V4AssetFilter
    dest: V4Location
    xcm: V4Instruction[]
}

export interface V4Instruction_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V4Junctions
}

export interface V4Instruction_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V4AssetFilter
    want: V4Asset[]
    maximal: boolean
}

export interface V4Instruction_ExpectAsset {
    __kind: 'ExpectAsset'
    value: V4Asset[]
}

export interface V4Instruction_ExpectError {
    __kind: 'ExpectError'
    value?: ([number, V3Error] | undefined)
}

export interface V4Instruction_ExpectOrigin {
    __kind: 'ExpectOrigin'
    value?: (V4Location | undefined)
}

export interface V4Instruction_ExpectPallet {
    __kind: 'ExpectPallet'
    index: number
    name: Bytes
    moduleName: Bytes
    crateMajor: number
    minCrateMinor: number
}

export interface V4Instruction_ExpectTransactStatus {
    __kind: 'ExpectTransactStatus'
    value: V3MaybeErrorCode
}

export interface V4Instruction_ExportMessage {
    __kind: 'ExportMessage'
    network: V4NetworkId
    destination: V4Junctions
    xcm: V4Instruction[]
}

export interface V4Instruction_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface V4Instruction_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface V4Instruction_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface V4Instruction_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V4AssetFilter
    reserve: V4Location
    xcm: V4Instruction[]
}

export interface V4Instruction_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V4AssetFilter
    dest: V4Location
    xcm: V4Instruction[]
}

export interface V4Instruction_LockAsset {
    __kind: 'LockAsset'
    asset: V4Asset
    unlocker: V4Location
}

export interface V4Instruction_NoteUnlockable {
    __kind: 'NoteUnlockable'
    asset: V4Asset
    owner: V4Location
}

export interface V4Instruction_QueryPallet {
    __kind: 'QueryPallet'
    moduleName: Bytes
    responseInfo: V4QueryResponseInfo
}

export interface V4Instruction_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V4Response
    maxWeight: Weight
    querier?: (V4Location | undefined)
}

export interface V4Instruction_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V4Asset[]
}

export interface V4Instruction_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface V4Instruction_ReportError {
    __kind: 'ReportError'
    value: V4QueryResponseInfo
}

export interface V4Instruction_ReportHolding {
    __kind: 'ReportHolding'
    responseInfo: V4QueryResponseInfo
    assets: V4AssetFilter
}

export interface V4Instruction_ReportTransactStatus {
    __kind: 'ReportTransactStatus'
    value: V4QueryResponseInfo
}

export interface V4Instruction_RequestUnlock {
    __kind: 'RequestUnlock'
    asset: V4Asset
    locker: V4Location
}

export interface V4Instruction_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V4Asset[]
}

export interface V4Instruction_SetAppendix {
    __kind: 'SetAppendix'
    value: V4Instruction[]
}

export interface V4Instruction_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: V4Instruction[]
}

export interface V4Instruction_SetFeesMode {
    __kind: 'SetFeesMode'
    jitWithdraw: boolean
}

export interface V4Instruction_SetTopic {
    __kind: 'SetTopic'
    value: Bytes
}

export interface V4Instruction_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: Weight
}

export interface V4Instruction_Transact {
    __kind: 'Transact'
    originKind: V2OriginKind
    requireWeightAtMost: Weight
    call: DoubleEncoded
}

export interface V4Instruction_TransferAsset {
    __kind: 'TransferAsset'
    assets: V4Asset[]
    beneficiary: V4Location
}

export interface V4Instruction_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V4Asset[]
    dest: V4Location
    xcm: V4Instruction[]
}

export interface V4Instruction_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V4Instruction_UniversalOrigin {
    __kind: 'UniversalOrigin'
    value: V4Junction
}

export interface V4Instruction_UnlockAsset {
    __kind: 'UnlockAsset'
    asset: V4Asset
    target: V4Location
}

export interface V4Instruction_UnpaidExecution {
    __kind: 'UnpaidExecution'
    weightLimit: V3WeightLimit
    checkOrigin?: (V4Location | undefined)
}

export interface V4Instruction_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface V4Instruction_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V4Asset[]
}

export const V3Instruction: sts.Type<V3Instruction> = sts.closedEnum(() => {
    return  {
        AliasOrigin: V3MultiLocation,
        BurnAsset: sts.array(() => V3MultiAsset),
        BuyExecution: sts.enumStruct({
            fees: V3MultiAsset,
            weightLimit: V3WeightLimit,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => V3MultiAsset),
            ticket: V3MultiLocation,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        ClearTopic: sts.unit(),
        ClearTransactStatus: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: V3MultiAssetFilter,
            beneficiary: V3MultiLocation,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: V3MultiAssetFilter,
            dest: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        DescendOrigin: V3Junctions,
        ExchangeAsset: sts.enumStruct({
            give: V3MultiAssetFilter,
            want: sts.array(() => V3MultiAsset),
            maximal: sts.boolean(),
        }),
        ExpectAsset: sts.array(() => V3MultiAsset),
        ExpectError: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        ExpectOrigin: sts.option(() => V3MultiLocation),
        ExpectPallet: sts.enumStruct({
            index: sts.number(),
            name: sts.bytes(),
            moduleName: sts.bytes(),
            crateMajor: sts.number(),
            minCrateMinor: sts.number(),
        }),
        ExpectTransactStatus: V3MaybeErrorCode,
        ExportMessage: sts.enumStruct({
            network: V3NetworkId,
            destination: V3Junctions,
            xcm: sts.array(() => V3Instruction),
        }),
        HrmpChannelAccepted: sts.enumStruct({
            recipient: sts.number(),
        }),
        HrmpChannelClosing: sts.enumStruct({
            initiator: sts.number(),
            sender: sts.number(),
            recipient: sts.number(),
        }),
        HrmpNewChannelOpenRequest: sts.enumStruct({
            sender: sts.number(),
            maxMessageSize: sts.number(),
            maxCapacity: sts.number(),
        }),
        InitiateReserveWithdraw: sts.enumStruct({
            assets: V3MultiAssetFilter,
            reserve: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: V3MultiAssetFilter,
            dest: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        LockAsset: sts.enumStruct({
            asset: V3MultiAsset,
            unlocker: V3MultiLocation,
        }),
        NoteUnlockable: sts.enumStruct({
            asset: V3MultiAsset,
            owner: V3MultiLocation,
        }),
        QueryPallet: sts.enumStruct({
            moduleName: sts.bytes(),
            responseInfo: V3QueryResponseInfo,
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: V3Response,
            maxWeight: Weight,
            querier: sts.option(() => V3MultiLocation),
        }),
        ReceiveTeleportedAsset: sts.array(() => V3MultiAsset),
        RefundSurplus: sts.unit(),
        ReportError: V3QueryResponseInfo,
        ReportHolding: sts.enumStruct({
            responseInfo: V3QueryResponseInfo,
            assets: V3MultiAssetFilter,
        }),
        ReportTransactStatus: V3QueryResponseInfo,
        RequestUnlock: sts.enumStruct({
            asset: V3MultiAsset,
            locker: V3MultiLocation,
        }),
        ReserveAssetDeposited: sts.array(() => V3MultiAsset),
        SetAppendix: sts.array(() => V3Instruction),
        SetErrorHandler: sts.array(() => V3Instruction),
        SetFeesMode: sts.enumStruct({
            jitWithdraw: sts.boolean(),
        }),
        SetTopic: sts.bytes(),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: Weight,
        }),
        Transact: sts.enumStruct({
            originKind: V2OriginKind,
            requireWeightAtMost: Weight,
            call: DoubleEncoded,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => V3MultiAsset),
            beneficiary: V3MultiLocation,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => V3MultiAsset),
            dest: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        Trap: sts.bigint(),
        UniversalOrigin: V3Junction,
        UnlockAsset: sts.enumStruct({
            asset: V3MultiAsset,
            target: V3MultiLocation,
        }),
        UnpaidExecution: sts.enumStruct({
            weightLimit: V3WeightLimit,
            checkOrigin: sts.option(() => V3MultiLocation),
        }),
        UnsubscribeVersion: sts.unit(),
        WithdrawAsset: sts.array(() => V3MultiAsset),
    }
})

export const V3Response: sts.Type<V3Response> = sts.closedEnum(() => {
    return  {
        Assets: sts.array(() => V3MultiAsset),
        DispatchResult: V3MaybeErrorCode,
        ExecutionResult: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        Null: sts.unit(),
        PalletsInfo: sts.array(() => V3PalletInfo),
        Version: sts.number(),
    }
})

export const V3PalletInfo: sts.Type<V3PalletInfo> = sts.struct(() => {
    return  {
        index: sts.number(),
        name: sts.bytes(),
        moduleName: sts.bytes(),
        major: sts.number(),
        minor: sts.number(),
        patch: sts.number(),
    }
})

export interface V3PalletInfo {
    index: number
    name: Bytes
    moduleName: Bytes
    major: number
    minor: number
    patch: number
}

export type V3Response = V3Response_Assets | V3Response_DispatchResult | V3Response_ExecutionResult | V3Response_Null | V3Response_PalletsInfo | V3Response_Version

export interface V3Response_Assets {
    __kind: 'Assets'
    value: V3MultiAsset[]
}

export interface V3Response_DispatchResult {
    __kind: 'DispatchResult'
    value: V3MaybeErrorCode
}

export interface V3Response_ExecutionResult {
    __kind: 'ExecutionResult'
    value?: ([number, V3Error] | undefined)
}

export interface V3Response_Null {
    __kind: 'Null'
}

export interface V3Response_PalletsInfo {
    __kind: 'PalletsInfo'
    value: V3PalletInfo[]
}

export interface V3Response_Version {
    __kind: 'Version'
    value: number
}

export const V3QueryResponseInfo: sts.Type<V3QueryResponseInfo> = sts.struct(() => {
    return  {
        destination: V3MultiLocation,
        queryId: sts.bigint(),
        maxWeight: Weight,
    }
})

export interface V3QueryResponseInfo {
    destination: V3MultiLocation
    queryId: bigint
    maxWeight: Weight
}

export const V3MultiAssetFilter: sts.Type<V3MultiAssetFilter> = sts.closedEnum(() => {
    return  {
        Definite: sts.array(() => V3MultiAsset),
        Wild: V3WildMultiAsset,
    }
})

export const V3WildMultiAsset: sts.Type<V3WildMultiAsset> = sts.closedEnum(() => {
    return  {
        All: sts.unit(),
        AllCounted: sts.number(),
        AllOf: sts.enumStruct({
            id: V3AssetId,
            fun: V3WildFungibility,
        }),
        AllOfCounted: sts.enumStruct({
            id: V3AssetId,
            fun: V3WildFungibility,
            count: sts.number(),
        }),
    }
})

export const V3WildFungibility: sts.Type<V3WildFungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.unit(),
        NonFungible: sts.unit(),
    }
})

export type V3WildFungibility = V3WildFungibility_Fungible | V3WildFungibility_NonFungible

export interface V3WildFungibility_Fungible {
    __kind: 'Fungible'
}

export interface V3WildFungibility_NonFungible {
    __kind: 'NonFungible'
}

export type V3WildMultiAsset = V3WildMultiAsset_All | V3WildMultiAsset_AllCounted | V3WildMultiAsset_AllOf | V3WildMultiAsset_AllOfCounted

export interface V3WildMultiAsset_All {
    __kind: 'All'
}

export interface V3WildMultiAsset_AllCounted {
    __kind: 'AllCounted'
    value: number
}

export interface V3WildMultiAsset_AllOf {
    __kind: 'AllOf'
    id: V3AssetId
    fun: V3WildFungibility
}

export interface V3WildMultiAsset_AllOfCounted {
    __kind: 'AllOfCounted'
    id: V3AssetId
    fun: V3WildFungibility
    count: number
}

export type V3MultiAssetFilter = V3MultiAssetFilter_Definite | V3MultiAssetFilter_Wild

export interface V3MultiAssetFilter_Definite {
    __kind: 'Definite'
    value: V3MultiAsset[]
}

export interface V3MultiAssetFilter_Wild {
    __kind: 'Wild'
    value: V3WildMultiAsset
}

export type V3Instruction = V3Instruction_AliasOrigin | V3Instruction_BurnAsset | V3Instruction_BuyExecution | V3Instruction_ClaimAsset | V3Instruction_ClearError | V3Instruction_ClearOrigin | V3Instruction_ClearTopic | V3Instruction_ClearTransactStatus | V3Instruction_DepositAsset | V3Instruction_DepositReserveAsset | V3Instruction_DescendOrigin | V3Instruction_ExchangeAsset | V3Instruction_ExpectAsset | V3Instruction_ExpectError | V3Instruction_ExpectOrigin | V3Instruction_ExpectPallet | V3Instruction_ExpectTransactStatus | V3Instruction_ExportMessage | V3Instruction_HrmpChannelAccepted | V3Instruction_HrmpChannelClosing | V3Instruction_HrmpNewChannelOpenRequest | V3Instruction_InitiateReserveWithdraw | V3Instruction_InitiateTeleport | V3Instruction_LockAsset | V3Instruction_NoteUnlockable | V3Instruction_QueryPallet | V3Instruction_QueryResponse | V3Instruction_ReceiveTeleportedAsset | V3Instruction_RefundSurplus | V3Instruction_ReportError | V3Instruction_ReportHolding | V3Instruction_ReportTransactStatus | V3Instruction_RequestUnlock | V3Instruction_ReserveAssetDeposited | V3Instruction_SetAppendix | V3Instruction_SetErrorHandler | V3Instruction_SetFeesMode | V3Instruction_SetTopic | V3Instruction_SubscribeVersion | V3Instruction_Transact | V3Instruction_TransferAsset | V3Instruction_TransferReserveAsset | V3Instruction_Trap | V3Instruction_UniversalOrigin | V3Instruction_UnlockAsset | V3Instruction_UnpaidExecution | V3Instruction_UnsubscribeVersion | V3Instruction_WithdrawAsset

export interface V3Instruction_AliasOrigin {
    __kind: 'AliasOrigin'
    value: V3MultiLocation
}

export interface V3Instruction_BurnAsset {
    __kind: 'BurnAsset'
    value: V3MultiAsset[]
}

export interface V3Instruction_BuyExecution {
    __kind: 'BuyExecution'
    fees: V3MultiAsset
    weightLimit: V3WeightLimit
}

export interface V3Instruction_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V3MultiAsset[]
    ticket: V3MultiLocation
}

export interface V3Instruction_ClearError {
    __kind: 'ClearError'
}

export interface V3Instruction_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface V3Instruction_ClearTopic {
    __kind: 'ClearTopic'
}

export interface V3Instruction_ClearTransactStatus {
    __kind: 'ClearTransactStatus'
}

export interface V3Instruction_DepositAsset {
    __kind: 'DepositAsset'
    assets: V3MultiAssetFilter
    beneficiary: V3MultiLocation
}

export interface V3Instruction_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V3MultiAssetFilter
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface V3Instruction_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V3Junctions
}

export interface V3Instruction_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V3MultiAssetFilter
    want: V3MultiAsset[]
    maximal: boolean
}

export interface V3Instruction_ExpectAsset {
    __kind: 'ExpectAsset'
    value: V3MultiAsset[]
}

export interface V3Instruction_ExpectError {
    __kind: 'ExpectError'
    value?: ([number, V3Error] | undefined)
}

export interface V3Instruction_ExpectOrigin {
    __kind: 'ExpectOrigin'
    value?: (V3MultiLocation | undefined)
}

export interface V3Instruction_ExpectPallet {
    __kind: 'ExpectPallet'
    index: number
    name: Bytes
    moduleName: Bytes
    crateMajor: number
    minCrateMinor: number
}

export interface V3Instruction_ExpectTransactStatus {
    __kind: 'ExpectTransactStatus'
    value: V3MaybeErrorCode
}

export interface V3Instruction_ExportMessage {
    __kind: 'ExportMessage'
    network: V3NetworkId
    destination: V3Junctions
    xcm: V3Instruction[]
}

export interface V3Instruction_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface V3Instruction_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface V3Instruction_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface V3Instruction_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V3MultiAssetFilter
    reserve: V3MultiLocation
    xcm: V3Instruction[]
}

export interface V3Instruction_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V3MultiAssetFilter
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface V3Instruction_LockAsset {
    __kind: 'LockAsset'
    asset: V3MultiAsset
    unlocker: V3MultiLocation
}

export interface V3Instruction_NoteUnlockable {
    __kind: 'NoteUnlockable'
    asset: V3MultiAsset
    owner: V3MultiLocation
}

export interface V3Instruction_QueryPallet {
    __kind: 'QueryPallet'
    moduleName: Bytes
    responseInfo: V3QueryResponseInfo
}

export interface V3Instruction_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V3Response
    maxWeight: Weight
    querier?: (V3MultiLocation | undefined)
}

export interface V3Instruction_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V3MultiAsset[]
}

export interface V3Instruction_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface V3Instruction_ReportError {
    __kind: 'ReportError'
    value: V3QueryResponseInfo
}

export interface V3Instruction_ReportHolding {
    __kind: 'ReportHolding'
    responseInfo: V3QueryResponseInfo
    assets: V3MultiAssetFilter
}

export interface V3Instruction_ReportTransactStatus {
    __kind: 'ReportTransactStatus'
    value: V3QueryResponseInfo
}

export interface V3Instruction_RequestUnlock {
    __kind: 'RequestUnlock'
    asset: V3MultiAsset
    locker: V3MultiLocation
}

export interface V3Instruction_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V3MultiAsset[]
}

export interface V3Instruction_SetAppendix {
    __kind: 'SetAppendix'
    value: V3Instruction[]
}

export interface V3Instruction_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: V3Instruction[]
}

export interface V3Instruction_SetFeesMode {
    __kind: 'SetFeesMode'
    jitWithdraw: boolean
}

export interface V3Instruction_SetTopic {
    __kind: 'SetTopic'
    value: Bytes
}

export interface V3Instruction_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: Weight
}

export interface V3Instruction_Transact {
    __kind: 'Transact'
    originKind: V2OriginKind
    requireWeightAtMost: Weight
    call: DoubleEncoded
}

export interface V3Instruction_TransferAsset {
    __kind: 'TransferAsset'
    assets: V3MultiAsset[]
    beneficiary: V3MultiLocation
}

export interface V3Instruction_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V3MultiAsset[]
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface V3Instruction_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V3Instruction_UniversalOrigin {
    __kind: 'UniversalOrigin'
    value: V3Junction
}

export interface V3Instruction_UnlockAsset {
    __kind: 'UnlockAsset'
    asset: V3MultiAsset
    target: V3MultiLocation
}

export interface V3Instruction_UnpaidExecution {
    __kind: 'UnpaidExecution'
    weightLimit: V3WeightLimit
    checkOrigin?: (V3MultiLocation | undefined)
}

export interface V3Instruction_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface V3Instruction_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V3MultiAsset[]
}

export const V2Instruction: sts.Type<V2Instruction> = sts.closedEnum(() => {
    return  {
        BuyExecution: sts.enumStruct({
            fees: V2MultiAsset,
            weightLimit: V2WeightLimit,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => V2MultiAsset),
            ticket: V2MultiLocation,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: V2MultiAssetFilter,
            maxAssets: sts.number(),
            beneficiary: V2MultiLocation,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: V2MultiAssetFilter,
            maxAssets: sts.number(),
            dest: V2MultiLocation,
            xcm: sts.array(() => V2Instruction),
        }),
        DescendOrigin: V2Junctions,
        ExchangeAsset: sts.enumStruct({
            give: V2MultiAssetFilter,
            receive: sts.array(() => V2MultiAsset),
        }),
        HrmpChannelAccepted: sts.enumStruct({
            recipient: sts.number(),
        }),
        HrmpChannelClosing: sts.enumStruct({
            initiator: sts.number(),
            sender: sts.number(),
            recipient: sts.number(),
        }),
        HrmpNewChannelOpenRequest: sts.enumStruct({
            sender: sts.number(),
            maxMessageSize: sts.number(),
            maxCapacity: sts.number(),
        }),
        InitiateReserveWithdraw: sts.enumStruct({
            assets: V2MultiAssetFilter,
            reserve: V2MultiLocation,
            xcm: sts.array(() => V2Instruction),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: V2MultiAssetFilter,
            dest: V2MultiLocation,
            xcm: sts.array(() => V2Instruction),
        }),
        QueryHolding: sts.enumStruct({
            queryId: sts.bigint(),
            dest: V2MultiLocation,
            assets: V2MultiAssetFilter,
            maxResponseWeight: sts.bigint(),
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: V2Response,
            maxWeight: sts.bigint(),
        }),
        ReceiveTeleportedAsset: sts.array(() => V2MultiAsset),
        RefundSurplus: sts.unit(),
        ReportError: sts.enumStruct({
            queryId: sts.bigint(),
            dest: V2MultiLocation,
            maxResponseWeight: sts.bigint(),
        }),
        ReserveAssetDeposited: sts.array(() => V2MultiAsset),
        SetAppendix: sts.array(() => V2Instruction),
        SetErrorHandler: sts.array(() => V2Instruction),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: sts.bigint(),
        }),
        Transact: sts.enumStruct({
            originType: V2OriginKind,
            requireWeightAtMost: sts.bigint(),
            call: DoubleEncoded,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => V2MultiAsset),
            beneficiary: V2MultiLocation,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => V2MultiAsset),
            dest: V2MultiLocation,
            xcm: sts.array(() => V2Instruction),
        }),
        Trap: sts.bigint(),
        UnsubscribeVersion: sts.unit(),
        WithdrawAsset: sts.array(() => V2MultiAsset),
    }
})

export const V2Response: sts.Type<V2Response> = sts.closedEnum(() => {
    return  {
        Assets: sts.array(() => V2MultiAsset),
        ExecutionResult: sts.option(() => sts.tuple(() => [sts.number(), V2Error])),
        Null: sts.unit(),
        Version: sts.number(),
    }
})

export const V2Error: sts.Type<V2Error> = sts.closedEnum(() => {
    return  {
        AssetNotFound: sts.unit(),
        BadOrigin: sts.unit(),
        Barrier: sts.unit(),
        DestinationUnsupported: sts.unit(),
        ExceedsMaxMessageSize: sts.unit(),
        FailedToDecode: sts.unit(),
        FailedToTransactAsset: sts.unit(),
        InvalidLocation: sts.unit(),
        LocationCannotHold: sts.unit(),
        MaxWeightInvalid: sts.unit(),
        MultiLocationFull: sts.unit(),
        MultiLocationNotInvertible: sts.unit(),
        NotHoldingFees: sts.unit(),
        NotWithdrawable: sts.unit(),
        Overflow: sts.unit(),
        TooExpensive: sts.unit(),
        Transport: sts.unit(),
        Trap: sts.bigint(),
        UnhandledXcmVersion: sts.unit(),
        Unimplemented: sts.unit(),
        UnknownClaim: sts.unit(),
        Unroutable: sts.unit(),
        UntrustedReserveLocation: sts.unit(),
        UntrustedTeleportLocation: sts.unit(),
        WeightLimitReached: sts.bigint(),
        WeightNotComputable: sts.unit(),
    }
})

export type V2Error = V2Error_AssetNotFound | V2Error_BadOrigin | V2Error_Barrier | V2Error_DestinationUnsupported | V2Error_ExceedsMaxMessageSize | V2Error_FailedToDecode | V2Error_FailedToTransactAsset | V2Error_InvalidLocation | V2Error_LocationCannotHold | V2Error_MaxWeightInvalid | V2Error_MultiLocationFull | V2Error_MultiLocationNotInvertible | V2Error_NotHoldingFees | V2Error_NotWithdrawable | V2Error_Overflow | V2Error_TooExpensive | V2Error_Transport | V2Error_Trap | V2Error_UnhandledXcmVersion | V2Error_Unimplemented | V2Error_UnknownClaim | V2Error_Unroutable | V2Error_UntrustedReserveLocation | V2Error_UntrustedTeleportLocation | V2Error_WeightLimitReached | V2Error_WeightNotComputable

export interface V2Error_AssetNotFound {
    __kind: 'AssetNotFound'
}

export interface V2Error_BadOrigin {
    __kind: 'BadOrigin'
}

export interface V2Error_Barrier {
    __kind: 'Barrier'
}

export interface V2Error_DestinationUnsupported {
    __kind: 'DestinationUnsupported'
}

export interface V2Error_ExceedsMaxMessageSize {
    __kind: 'ExceedsMaxMessageSize'
}

export interface V2Error_FailedToDecode {
    __kind: 'FailedToDecode'
}

export interface V2Error_FailedToTransactAsset {
    __kind: 'FailedToTransactAsset'
}

export interface V2Error_InvalidLocation {
    __kind: 'InvalidLocation'
}

export interface V2Error_LocationCannotHold {
    __kind: 'LocationCannotHold'
}

export interface V2Error_MaxWeightInvalid {
    __kind: 'MaxWeightInvalid'
}

export interface V2Error_MultiLocationFull {
    __kind: 'MultiLocationFull'
}

export interface V2Error_MultiLocationNotInvertible {
    __kind: 'MultiLocationNotInvertible'
}

export interface V2Error_NotHoldingFees {
    __kind: 'NotHoldingFees'
}

export interface V2Error_NotWithdrawable {
    __kind: 'NotWithdrawable'
}

export interface V2Error_Overflow {
    __kind: 'Overflow'
}

export interface V2Error_TooExpensive {
    __kind: 'TooExpensive'
}

export interface V2Error_Transport {
    __kind: 'Transport'
}

export interface V2Error_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V2Error_UnhandledXcmVersion {
    __kind: 'UnhandledXcmVersion'
}

export interface V2Error_Unimplemented {
    __kind: 'Unimplemented'
}

export interface V2Error_UnknownClaim {
    __kind: 'UnknownClaim'
}

export interface V2Error_Unroutable {
    __kind: 'Unroutable'
}

export interface V2Error_UntrustedReserveLocation {
    __kind: 'UntrustedReserveLocation'
}

export interface V2Error_UntrustedTeleportLocation {
    __kind: 'UntrustedTeleportLocation'
}

export interface V2Error_WeightLimitReached {
    __kind: 'WeightLimitReached'
    value: bigint
}

export interface V2Error_WeightNotComputable {
    __kind: 'WeightNotComputable'
}

export type V2Response = V2Response_Assets | V2Response_ExecutionResult | V2Response_Null | V2Response_Version

export interface V2Response_Assets {
    __kind: 'Assets'
    value: V2MultiAsset[]
}

export interface V2Response_ExecutionResult {
    __kind: 'ExecutionResult'
    value?: ([number, V2Error] | undefined)
}

export interface V2Response_Null {
    __kind: 'Null'
}

export interface V2Response_Version {
    __kind: 'Version'
    value: number
}

export const V2MultiAssetFilter: sts.Type<V2MultiAssetFilter> = sts.closedEnum(() => {
    return  {
        Definite: sts.array(() => V2MultiAsset),
        Wild: V2WildMultiAsset,
    }
})

export const V2WildMultiAsset: sts.Type<V2WildMultiAsset> = sts.closedEnum(() => {
    return  {
        All: sts.unit(),
        AllOf: sts.enumStruct({
            id: V2AssetId,
            fun: V2WildFungibility,
        }),
    }
})

export const V2WildFungibility: sts.Type<V2WildFungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.unit(),
        NonFungible: sts.unit(),
    }
})

export type V2WildFungibility = V2WildFungibility_Fungible | V2WildFungibility_NonFungible

export interface V2WildFungibility_Fungible {
    __kind: 'Fungible'
}

export interface V2WildFungibility_NonFungible {
    __kind: 'NonFungible'
}

export type V2WildMultiAsset = V2WildMultiAsset_All | V2WildMultiAsset_AllOf

export interface V2WildMultiAsset_All {
    __kind: 'All'
}

export interface V2WildMultiAsset_AllOf {
    __kind: 'AllOf'
    id: V2AssetId
    fun: V2WildFungibility
}

export type V2MultiAssetFilter = V2MultiAssetFilter_Definite | V2MultiAssetFilter_Wild

export interface V2MultiAssetFilter_Definite {
    __kind: 'Definite'
    value: V2MultiAsset[]
}

export interface V2MultiAssetFilter_Wild {
    __kind: 'Wild'
    value: V2WildMultiAsset
}

export const V2WeightLimit: sts.Type<V2WeightLimit> = sts.closedEnum(() => {
    return  {
        Limited: sts.bigint(),
        Unlimited: sts.unit(),
    }
})

export type V2WeightLimit = V2WeightLimit_Limited | V2WeightLimit_Unlimited

export interface V2WeightLimit_Limited {
    __kind: 'Limited'
    value: bigint
}

export interface V2WeightLimit_Unlimited {
    __kind: 'Unlimited'
}

export type V2Instruction = V2Instruction_BuyExecution | V2Instruction_ClaimAsset | V2Instruction_ClearError | V2Instruction_ClearOrigin | V2Instruction_DepositAsset | V2Instruction_DepositReserveAsset | V2Instruction_DescendOrigin | V2Instruction_ExchangeAsset | V2Instruction_HrmpChannelAccepted | V2Instruction_HrmpChannelClosing | V2Instruction_HrmpNewChannelOpenRequest | V2Instruction_InitiateReserveWithdraw | V2Instruction_InitiateTeleport | V2Instruction_QueryHolding | V2Instruction_QueryResponse | V2Instruction_ReceiveTeleportedAsset | V2Instruction_RefundSurplus | V2Instruction_ReportError | V2Instruction_ReserveAssetDeposited | V2Instruction_SetAppendix | V2Instruction_SetErrorHandler | V2Instruction_SubscribeVersion | V2Instruction_Transact | V2Instruction_TransferAsset | V2Instruction_TransferReserveAsset | V2Instruction_Trap | V2Instruction_UnsubscribeVersion | V2Instruction_WithdrawAsset

export interface V2Instruction_BuyExecution {
    __kind: 'BuyExecution'
    fees: V2MultiAsset
    weightLimit: V2WeightLimit
}

export interface V2Instruction_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V2MultiAsset[]
    ticket: V2MultiLocation
}

export interface V2Instruction_ClearError {
    __kind: 'ClearError'
}

export interface V2Instruction_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface V2Instruction_DepositAsset {
    __kind: 'DepositAsset'
    assets: V2MultiAssetFilter
    maxAssets: number
    beneficiary: V2MultiLocation
}

export interface V2Instruction_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V2MultiAssetFilter
    maxAssets: number
    dest: V2MultiLocation
    xcm: V2Instruction[]
}

export interface V2Instruction_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V2Junctions
}

export interface V2Instruction_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V2MultiAssetFilter
    receive: V2MultiAsset[]
}

export interface V2Instruction_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface V2Instruction_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface V2Instruction_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface V2Instruction_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V2MultiAssetFilter
    reserve: V2MultiLocation
    xcm: V2Instruction[]
}

export interface V2Instruction_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V2MultiAssetFilter
    dest: V2MultiLocation
    xcm: V2Instruction[]
}

export interface V2Instruction_QueryHolding {
    __kind: 'QueryHolding'
    queryId: bigint
    dest: V2MultiLocation
    assets: V2MultiAssetFilter
    maxResponseWeight: bigint
}

export interface V2Instruction_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V2Response
    maxWeight: bigint
}

export interface V2Instruction_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V2MultiAsset[]
}

export interface V2Instruction_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface V2Instruction_ReportError {
    __kind: 'ReportError'
    queryId: bigint
    dest: V2MultiLocation
    maxResponseWeight: bigint
}

export interface V2Instruction_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V2MultiAsset[]
}

export interface V2Instruction_SetAppendix {
    __kind: 'SetAppendix'
    value: V2Instruction[]
}

export interface V2Instruction_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: V2Instruction[]
}

export interface V2Instruction_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: bigint
}

export interface V2Instruction_Transact {
    __kind: 'Transact'
    originType: V2OriginKind
    requireWeightAtMost: bigint
    call: DoubleEncoded
}

export interface V2Instruction_TransferAsset {
    __kind: 'TransferAsset'
    assets: V2MultiAsset[]
    beneficiary: V2MultiLocation
}

export interface V2Instruction_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V2MultiAsset[]
    dest: V2MultiLocation
    xcm: V2Instruction[]
}

export interface V2Instruction_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V2Instruction_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface V2Instruction_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V2MultiAsset[]
}

export type VersionedXcm = VersionedXcm_V2 | VersionedXcm_V3 | VersionedXcm_V4

export interface VersionedXcm_V2 {
    __kind: 'V2'
    value: V2Instruction[]
}

export interface VersionedXcm_V3 {
    __kind: 'V3'
    value: V3Instruction[]
}

export interface VersionedXcm_V4 {
    __kind: 'V4'
    value: V4Instruction[]
}

export const Type_446: sts.Type<Type_446> = sts.closedEnum(() => {
    return  {
        V2: sts.array(() => Type_449),
        V3: sts.array(() => Type_453),
        V4: sts.array(() => Type_456),
    }
})

export const Type_456: sts.Type<Type_456> = sts.closedEnum(() => {
    return  {
        AliasOrigin: V4Location,
        BurnAsset: sts.array(() => V4Asset),
        BuyExecution: sts.enumStruct({
            fees: V4Asset,
            weightLimit: V3WeightLimit,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => V4Asset),
            ticket: V4Location,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        ClearTopic: sts.unit(),
        ClearTransactStatus: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: V4AssetFilter,
            beneficiary: V4Location,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: V4AssetFilter,
            dest: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        DescendOrigin: V4Junctions,
        ExchangeAsset: sts.enumStruct({
            give: V4AssetFilter,
            want: sts.array(() => V4Asset),
            maximal: sts.boolean(),
        }),
        ExpectAsset: sts.array(() => V4Asset),
        ExpectError: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        ExpectOrigin: sts.option(() => V4Location),
        ExpectPallet: sts.enumStruct({
            index: sts.number(),
            name: sts.bytes(),
            moduleName: sts.bytes(),
            crateMajor: sts.number(),
            minCrateMinor: sts.number(),
        }),
        ExpectTransactStatus: V3MaybeErrorCode,
        ExportMessage: sts.enumStruct({
            network: V4NetworkId,
            destination: V4Junctions,
            xcm: sts.array(() => V4Instruction),
        }),
        HrmpChannelAccepted: sts.enumStruct({
            recipient: sts.number(),
        }),
        HrmpChannelClosing: sts.enumStruct({
            initiator: sts.number(),
            sender: sts.number(),
            recipient: sts.number(),
        }),
        HrmpNewChannelOpenRequest: sts.enumStruct({
            sender: sts.number(),
            maxMessageSize: sts.number(),
            maxCapacity: sts.number(),
        }),
        InitiateReserveWithdraw: sts.enumStruct({
            assets: V4AssetFilter,
            reserve: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: V4AssetFilter,
            dest: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        LockAsset: sts.enumStruct({
            asset: V4Asset,
            unlocker: V4Location,
        }),
        NoteUnlockable: sts.enumStruct({
            asset: V4Asset,
            owner: V4Location,
        }),
        QueryPallet: sts.enumStruct({
            moduleName: sts.bytes(),
            responseInfo: V4QueryResponseInfo,
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: V4Response,
            maxWeight: Weight,
            querier: sts.option(() => V4Location),
        }),
        ReceiveTeleportedAsset: sts.array(() => V4Asset),
        RefundSurplus: sts.unit(),
        ReportError: V4QueryResponseInfo,
        ReportHolding: sts.enumStruct({
            responseInfo: V4QueryResponseInfo,
            assets: V4AssetFilter,
        }),
        ReportTransactStatus: V4QueryResponseInfo,
        RequestUnlock: sts.enumStruct({
            asset: V4Asset,
            locker: V4Location,
        }),
        ReserveAssetDeposited: sts.array(() => V4Asset),
        SetAppendix: sts.array(() => Type_456),
        SetErrorHandler: sts.array(() => Type_456),
        SetFeesMode: sts.enumStruct({
            jitWithdraw: sts.boolean(),
        }),
        SetTopic: sts.bytes(),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: Weight,
        }),
        Transact: sts.enumStruct({
            originKind: V2OriginKind,
            requireWeightAtMost: Weight,
            call: Type_450,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => V4Asset),
            beneficiary: V4Location,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => V4Asset),
            dest: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        Trap: sts.bigint(),
        UniversalOrigin: V4Junction,
        UnlockAsset: sts.enumStruct({
            asset: V4Asset,
            target: V4Location,
        }),
        UnpaidExecution: sts.enumStruct({
            weightLimit: V3WeightLimit,
            checkOrigin: sts.option(() => V4Location),
        }),
        UnsubscribeVersion: sts.unit(),
        WithdrawAsset: sts.array(() => V4Asset),
    }
})

export const Type_450: sts.Type<Type_450> = sts.struct(() => {
    return  {
        encoded: sts.bytes(),
    }
})

export interface Type_450 {
    encoded: Bytes
}

export type Type_456 = Type_456_AliasOrigin | Type_456_BurnAsset | Type_456_BuyExecution | Type_456_ClaimAsset | Type_456_ClearError | Type_456_ClearOrigin | Type_456_ClearTopic | Type_456_ClearTransactStatus | Type_456_DepositAsset | Type_456_DepositReserveAsset | Type_456_DescendOrigin | Type_456_ExchangeAsset | Type_456_ExpectAsset | Type_456_ExpectError | Type_456_ExpectOrigin | Type_456_ExpectPallet | Type_456_ExpectTransactStatus | Type_456_ExportMessage | Type_456_HrmpChannelAccepted | Type_456_HrmpChannelClosing | Type_456_HrmpNewChannelOpenRequest | Type_456_InitiateReserveWithdraw | Type_456_InitiateTeleport | Type_456_LockAsset | Type_456_NoteUnlockable | Type_456_QueryPallet | Type_456_QueryResponse | Type_456_ReceiveTeleportedAsset | Type_456_RefundSurplus | Type_456_ReportError | Type_456_ReportHolding | Type_456_ReportTransactStatus | Type_456_RequestUnlock | Type_456_ReserveAssetDeposited | Type_456_SetAppendix | Type_456_SetErrorHandler | Type_456_SetFeesMode | Type_456_SetTopic | Type_456_SubscribeVersion | Type_456_Transact | Type_456_TransferAsset | Type_456_TransferReserveAsset | Type_456_Trap | Type_456_UniversalOrigin | Type_456_UnlockAsset | Type_456_UnpaidExecution | Type_456_UnsubscribeVersion | Type_456_WithdrawAsset

export interface Type_456_AliasOrigin {
    __kind: 'AliasOrigin'
    value: V4Location
}

export interface Type_456_BurnAsset {
    __kind: 'BurnAsset'
    value: V4Asset[]
}

export interface Type_456_BuyExecution {
    __kind: 'BuyExecution'
    fees: V4Asset
    weightLimit: V3WeightLimit
}

export interface Type_456_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V4Asset[]
    ticket: V4Location
}

export interface Type_456_ClearError {
    __kind: 'ClearError'
}

export interface Type_456_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface Type_456_ClearTopic {
    __kind: 'ClearTopic'
}

export interface Type_456_ClearTransactStatus {
    __kind: 'ClearTransactStatus'
}

export interface Type_456_DepositAsset {
    __kind: 'DepositAsset'
    assets: V4AssetFilter
    beneficiary: V4Location
}

export interface Type_456_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V4AssetFilter
    dest: V4Location
    xcm: V4Instruction[]
}

export interface Type_456_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V4Junctions
}

export interface Type_456_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V4AssetFilter
    want: V4Asset[]
    maximal: boolean
}

export interface Type_456_ExpectAsset {
    __kind: 'ExpectAsset'
    value: V4Asset[]
}

export interface Type_456_ExpectError {
    __kind: 'ExpectError'
    value?: ([number, V3Error] | undefined)
}

export interface Type_456_ExpectOrigin {
    __kind: 'ExpectOrigin'
    value?: (V4Location | undefined)
}

export interface Type_456_ExpectPallet {
    __kind: 'ExpectPallet'
    index: number
    name: Bytes
    moduleName: Bytes
    crateMajor: number
    minCrateMinor: number
}

export interface Type_456_ExpectTransactStatus {
    __kind: 'ExpectTransactStatus'
    value: V3MaybeErrorCode
}

export interface Type_456_ExportMessage {
    __kind: 'ExportMessage'
    network: V4NetworkId
    destination: V4Junctions
    xcm: V4Instruction[]
}

export interface Type_456_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface Type_456_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface Type_456_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface Type_456_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V4AssetFilter
    reserve: V4Location
    xcm: V4Instruction[]
}

export interface Type_456_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V4AssetFilter
    dest: V4Location
    xcm: V4Instruction[]
}

export interface Type_456_LockAsset {
    __kind: 'LockAsset'
    asset: V4Asset
    unlocker: V4Location
}

export interface Type_456_NoteUnlockable {
    __kind: 'NoteUnlockable'
    asset: V4Asset
    owner: V4Location
}

export interface Type_456_QueryPallet {
    __kind: 'QueryPallet'
    moduleName: Bytes
    responseInfo: V4QueryResponseInfo
}

export interface Type_456_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V4Response
    maxWeight: Weight
    querier?: (V4Location | undefined)
}

export interface Type_456_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V4Asset[]
}

export interface Type_456_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface Type_456_ReportError {
    __kind: 'ReportError'
    value: V4QueryResponseInfo
}

export interface Type_456_ReportHolding {
    __kind: 'ReportHolding'
    responseInfo: V4QueryResponseInfo
    assets: V4AssetFilter
}

export interface Type_456_ReportTransactStatus {
    __kind: 'ReportTransactStatus'
    value: V4QueryResponseInfo
}

export interface Type_456_RequestUnlock {
    __kind: 'RequestUnlock'
    asset: V4Asset
    locker: V4Location
}

export interface Type_456_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V4Asset[]
}

export interface Type_456_SetAppendix {
    __kind: 'SetAppendix'
    value: Type_456[]
}

export interface Type_456_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: Type_456[]
}

export interface Type_456_SetFeesMode {
    __kind: 'SetFeesMode'
    jitWithdraw: boolean
}

export interface Type_456_SetTopic {
    __kind: 'SetTopic'
    value: Bytes
}

export interface Type_456_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: Weight
}

export interface Type_456_Transact {
    __kind: 'Transact'
    originKind: V2OriginKind
    requireWeightAtMost: Weight
    call: Type_450
}

export interface Type_456_TransferAsset {
    __kind: 'TransferAsset'
    assets: V4Asset[]
    beneficiary: V4Location
}

export interface Type_456_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V4Asset[]
    dest: V4Location
    xcm: V4Instruction[]
}

export interface Type_456_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface Type_456_UniversalOrigin {
    __kind: 'UniversalOrigin'
    value: V4Junction
}

export interface Type_456_UnlockAsset {
    __kind: 'UnlockAsset'
    asset: V4Asset
    target: V4Location
}

export interface Type_456_UnpaidExecution {
    __kind: 'UnpaidExecution'
    weightLimit: V3WeightLimit
    checkOrigin?: (V4Location | undefined)
}

export interface Type_456_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface Type_456_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V4Asset[]
}

export const Type_453: sts.Type<Type_453> = sts.closedEnum(() => {
    return  {
        AliasOrigin: V3MultiLocation,
        BurnAsset: sts.array(() => V3MultiAsset),
        BuyExecution: sts.enumStruct({
            fees: V3MultiAsset,
            weightLimit: V3WeightLimit,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => V3MultiAsset),
            ticket: V3MultiLocation,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        ClearTopic: sts.unit(),
        ClearTransactStatus: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: V3MultiAssetFilter,
            beneficiary: V3MultiLocation,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: V3MultiAssetFilter,
            dest: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        DescendOrigin: V3Junctions,
        ExchangeAsset: sts.enumStruct({
            give: V3MultiAssetFilter,
            want: sts.array(() => V3MultiAsset),
            maximal: sts.boolean(),
        }),
        ExpectAsset: sts.array(() => V3MultiAsset),
        ExpectError: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        ExpectOrigin: sts.option(() => V3MultiLocation),
        ExpectPallet: sts.enumStruct({
            index: sts.number(),
            name: sts.bytes(),
            moduleName: sts.bytes(),
            crateMajor: sts.number(),
            minCrateMinor: sts.number(),
        }),
        ExpectTransactStatus: V3MaybeErrorCode,
        ExportMessage: sts.enumStruct({
            network: V3NetworkId,
            destination: V3Junctions,
            xcm: sts.array(() => V3Instruction),
        }),
        HrmpChannelAccepted: sts.enumStruct({
            recipient: sts.number(),
        }),
        HrmpChannelClosing: sts.enumStruct({
            initiator: sts.number(),
            sender: sts.number(),
            recipient: sts.number(),
        }),
        HrmpNewChannelOpenRequest: sts.enumStruct({
            sender: sts.number(),
            maxMessageSize: sts.number(),
            maxCapacity: sts.number(),
        }),
        InitiateReserveWithdraw: sts.enumStruct({
            assets: V3MultiAssetFilter,
            reserve: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: V3MultiAssetFilter,
            dest: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        LockAsset: sts.enumStruct({
            asset: V3MultiAsset,
            unlocker: V3MultiLocation,
        }),
        NoteUnlockable: sts.enumStruct({
            asset: V3MultiAsset,
            owner: V3MultiLocation,
        }),
        QueryPallet: sts.enumStruct({
            moduleName: sts.bytes(),
            responseInfo: V3QueryResponseInfo,
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: V3Response,
            maxWeight: Weight,
            querier: sts.option(() => V3MultiLocation),
        }),
        ReceiveTeleportedAsset: sts.array(() => V3MultiAsset),
        RefundSurplus: sts.unit(),
        ReportError: V3QueryResponseInfo,
        ReportHolding: sts.enumStruct({
            responseInfo: V3QueryResponseInfo,
            assets: V3MultiAssetFilter,
        }),
        ReportTransactStatus: V3QueryResponseInfo,
        RequestUnlock: sts.enumStruct({
            asset: V3MultiAsset,
            locker: V3MultiLocation,
        }),
        ReserveAssetDeposited: sts.array(() => V3MultiAsset),
        SetAppendix: sts.array(() => Type_453),
        SetErrorHandler: sts.array(() => Type_453),
        SetFeesMode: sts.enumStruct({
            jitWithdraw: sts.boolean(),
        }),
        SetTopic: sts.bytes(),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: Weight,
        }),
        Transact: sts.enumStruct({
            originKind: V2OriginKind,
            requireWeightAtMost: Weight,
            call: Type_450,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => V3MultiAsset),
            beneficiary: V3MultiLocation,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => V3MultiAsset),
            dest: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        Trap: sts.bigint(),
        UniversalOrigin: V3Junction,
        UnlockAsset: sts.enumStruct({
            asset: V3MultiAsset,
            target: V3MultiLocation,
        }),
        UnpaidExecution: sts.enumStruct({
            weightLimit: V3WeightLimit,
            checkOrigin: sts.option(() => V3MultiLocation),
        }),
        UnsubscribeVersion: sts.unit(),
        WithdrawAsset: sts.array(() => V3MultiAsset),
    }
})

export type Type_453 = Type_453_AliasOrigin | Type_453_BurnAsset | Type_453_BuyExecution | Type_453_ClaimAsset | Type_453_ClearError | Type_453_ClearOrigin | Type_453_ClearTopic | Type_453_ClearTransactStatus | Type_453_DepositAsset | Type_453_DepositReserveAsset | Type_453_DescendOrigin | Type_453_ExchangeAsset | Type_453_ExpectAsset | Type_453_ExpectError | Type_453_ExpectOrigin | Type_453_ExpectPallet | Type_453_ExpectTransactStatus | Type_453_ExportMessage | Type_453_HrmpChannelAccepted | Type_453_HrmpChannelClosing | Type_453_HrmpNewChannelOpenRequest | Type_453_InitiateReserveWithdraw | Type_453_InitiateTeleport | Type_453_LockAsset | Type_453_NoteUnlockable | Type_453_QueryPallet | Type_453_QueryResponse | Type_453_ReceiveTeleportedAsset | Type_453_RefundSurplus | Type_453_ReportError | Type_453_ReportHolding | Type_453_ReportTransactStatus | Type_453_RequestUnlock | Type_453_ReserveAssetDeposited | Type_453_SetAppendix | Type_453_SetErrorHandler | Type_453_SetFeesMode | Type_453_SetTopic | Type_453_SubscribeVersion | Type_453_Transact | Type_453_TransferAsset | Type_453_TransferReserveAsset | Type_453_Trap | Type_453_UniversalOrigin | Type_453_UnlockAsset | Type_453_UnpaidExecution | Type_453_UnsubscribeVersion | Type_453_WithdrawAsset

export interface Type_453_AliasOrigin {
    __kind: 'AliasOrigin'
    value: V3MultiLocation
}

export interface Type_453_BurnAsset {
    __kind: 'BurnAsset'
    value: V3MultiAsset[]
}

export interface Type_453_BuyExecution {
    __kind: 'BuyExecution'
    fees: V3MultiAsset
    weightLimit: V3WeightLimit
}

export interface Type_453_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V3MultiAsset[]
    ticket: V3MultiLocation
}

export interface Type_453_ClearError {
    __kind: 'ClearError'
}

export interface Type_453_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface Type_453_ClearTopic {
    __kind: 'ClearTopic'
}

export interface Type_453_ClearTransactStatus {
    __kind: 'ClearTransactStatus'
}

export interface Type_453_DepositAsset {
    __kind: 'DepositAsset'
    assets: V3MultiAssetFilter
    beneficiary: V3MultiLocation
}

export interface Type_453_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V3MultiAssetFilter
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface Type_453_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V3Junctions
}

export interface Type_453_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V3MultiAssetFilter
    want: V3MultiAsset[]
    maximal: boolean
}

export interface Type_453_ExpectAsset {
    __kind: 'ExpectAsset'
    value: V3MultiAsset[]
}

export interface Type_453_ExpectError {
    __kind: 'ExpectError'
    value?: ([number, V3Error] | undefined)
}

export interface Type_453_ExpectOrigin {
    __kind: 'ExpectOrigin'
    value?: (V3MultiLocation | undefined)
}

export interface Type_453_ExpectPallet {
    __kind: 'ExpectPallet'
    index: number
    name: Bytes
    moduleName: Bytes
    crateMajor: number
    minCrateMinor: number
}

export interface Type_453_ExpectTransactStatus {
    __kind: 'ExpectTransactStatus'
    value: V3MaybeErrorCode
}

export interface Type_453_ExportMessage {
    __kind: 'ExportMessage'
    network: V3NetworkId
    destination: V3Junctions
    xcm: V3Instruction[]
}

export interface Type_453_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface Type_453_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface Type_453_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface Type_453_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V3MultiAssetFilter
    reserve: V3MultiLocation
    xcm: V3Instruction[]
}

export interface Type_453_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V3MultiAssetFilter
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface Type_453_LockAsset {
    __kind: 'LockAsset'
    asset: V3MultiAsset
    unlocker: V3MultiLocation
}

export interface Type_453_NoteUnlockable {
    __kind: 'NoteUnlockable'
    asset: V3MultiAsset
    owner: V3MultiLocation
}

export interface Type_453_QueryPallet {
    __kind: 'QueryPallet'
    moduleName: Bytes
    responseInfo: V3QueryResponseInfo
}

export interface Type_453_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V3Response
    maxWeight: Weight
    querier?: (V3MultiLocation | undefined)
}

export interface Type_453_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V3MultiAsset[]
}

export interface Type_453_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface Type_453_ReportError {
    __kind: 'ReportError'
    value: V3QueryResponseInfo
}

export interface Type_453_ReportHolding {
    __kind: 'ReportHolding'
    responseInfo: V3QueryResponseInfo
    assets: V3MultiAssetFilter
}

export interface Type_453_ReportTransactStatus {
    __kind: 'ReportTransactStatus'
    value: V3QueryResponseInfo
}

export interface Type_453_RequestUnlock {
    __kind: 'RequestUnlock'
    asset: V3MultiAsset
    locker: V3MultiLocation
}

export interface Type_453_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V3MultiAsset[]
}

export interface Type_453_SetAppendix {
    __kind: 'SetAppendix'
    value: Type_453[]
}

export interface Type_453_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: Type_453[]
}

export interface Type_453_SetFeesMode {
    __kind: 'SetFeesMode'
    jitWithdraw: boolean
}

export interface Type_453_SetTopic {
    __kind: 'SetTopic'
    value: Bytes
}

export interface Type_453_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: Weight
}

export interface Type_453_Transact {
    __kind: 'Transact'
    originKind: V2OriginKind
    requireWeightAtMost: Weight
    call: Type_450
}

export interface Type_453_TransferAsset {
    __kind: 'TransferAsset'
    assets: V3MultiAsset[]
    beneficiary: V3MultiLocation
}

export interface Type_453_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V3MultiAsset[]
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface Type_453_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface Type_453_UniversalOrigin {
    __kind: 'UniversalOrigin'
    value: V3Junction
}

export interface Type_453_UnlockAsset {
    __kind: 'UnlockAsset'
    asset: V3MultiAsset
    target: V3MultiLocation
}

export interface Type_453_UnpaidExecution {
    __kind: 'UnpaidExecution'
    weightLimit: V3WeightLimit
    checkOrigin?: (V3MultiLocation | undefined)
}

export interface Type_453_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface Type_453_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V3MultiAsset[]
}

export const Type_449: sts.Type<Type_449> = sts.closedEnum(() => {
    return  {
        BuyExecution: sts.enumStruct({
            fees: V2MultiAsset,
            weightLimit: V2WeightLimit,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => V2MultiAsset),
            ticket: V2MultiLocation,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: V2MultiAssetFilter,
            maxAssets: sts.number(),
            beneficiary: V2MultiLocation,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: V2MultiAssetFilter,
            maxAssets: sts.number(),
            dest: V2MultiLocation,
            xcm: sts.array(() => V2Instruction),
        }),
        DescendOrigin: V2Junctions,
        ExchangeAsset: sts.enumStruct({
            give: V2MultiAssetFilter,
            receive: sts.array(() => V2MultiAsset),
        }),
        HrmpChannelAccepted: sts.enumStruct({
            recipient: sts.number(),
        }),
        HrmpChannelClosing: sts.enumStruct({
            initiator: sts.number(),
            sender: sts.number(),
            recipient: sts.number(),
        }),
        HrmpNewChannelOpenRequest: sts.enumStruct({
            sender: sts.number(),
            maxMessageSize: sts.number(),
            maxCapacity: sts.number(),
        }),
        InitiateReserveWithdraw: sts.enumStruct({
            assets: V2MultiAssetFilter,
            reserve: V2MultiLocation,
            xcm: sts.array(() => V2Instruction),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: V2MultiAssetFilter,
            dest: V2MultiLocation,
            xcm: sts.array(() => V2Instruction),
        }),
        QueryHolding: sts.enumStruct({
            queryId: sts.bigint(),
            dest: V2MultiLocation,
            assets: V2MultiAssetFilter,
            maxResponseWeight: sts.bigint(),
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: V2Response,
            maxWeight: sts.bigint(),
        }),
        ReceiveTeleportedAsset: sts.array(() => V2MultiAsset),
        RefundSurplus: sts.unit(),
        ReportError: sts.enumStruct({
            queryId: sts.bigint(),
            dest: V2MultiLocation,
            maxResponseWeight: sts.bigint(),
        }),
        ReserveAssetDeposited: sts.array(() => V2MultiAsset),
        SetAppendix: sts.array(() => Type_449),
        SetErrorHandler: sts.array(() => Type_449),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: sts.bigint(),
        }),
        Transact: sts.enumStruct({
            originType: V2OriginKind,
            requireWeightAtMost: sts.bigint(),
            call: Type_450,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => V2MultiAsset),
            beneficiary: V2MultiLocation,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => V2MultiAsset),
            dest: V2MultiLocation,
            xcm: sts.array(() => V2Instruction),
        }),
        Trap: sts.bigint(),
        UnsubscribeVersion: sts.unit(),
        WithdrawAsset: sts.array(() => V2MultiAsset),
    }
})

export type Type_449 = Type_449_BuyExecution | Type_449_ClaimAsset | Type_449_ClearError | Type_449_ClearOrigin | Type_449_DepositAsset | Type_449_DepositReserveAsset | Type_449_DescendOrigin | Type_449_ExchangeAsset | Type_449_HrmpChannelAccepted | Type_449_HrmpChannelClosing | Type_449_HrmpNewChannelOpenRequest | Type_449_InitiateReserveWithdraw | Type_449_InitiateTeleport | Type_449_QueryHolding | Type_449_QueryResponse | Type_449_ReceiveTeleportedAsset | Type_449_RefundSurplus | Type_449_ReportError | Type_449_ReserveAssetDeposited | Type_449_SetAppendix | Type_449_SetErrorHandler | Type_449_SubscribeVersion | Type_449_Transact | Type_449_TransferAsset | Type_449_TransferReserveAsset | Type_449_Trap | Type_449_UnsubscribeVersion | Type_449_WithdrawAsset

export interface Type_449_BuyExecution {
    __kind: 'BuyExecution'
    fees: V2MultiAsset
    weightLimit: V2WeightLimit
}

export interface Type_449_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V2MultiAsset[]
    ticket: V2MultiLocation
}

export interface Type_449_ClearError {
    __kind: 'ClearError'
}

export interface Type_449_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface Type_449_DepositAsset {
    __kind: 'DepositAsset'
    assets: V2MultiAssetFilter
    maxAssets: number
    beneficiary: V2MultiLocation
}

export interface Type_449_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V2MultiAssetFilter
    maxAssets: number
    dest: V2MultiLocation
    xcm: V2Instruction[]
}

export interface Type_449_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V2Junctions
}

export interface Type_449_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V2MultiAssetFilter
    receive: V2MultiAsset[]
}

export interface Type_449_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface Type_449_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface Type_449_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface Type_449_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V2MultiAssetFilter
    reserve: V2MultiLocation
    xcm: V2Instruction[]
}

export interface Type_449_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V2MultiAssetFilter
    dest: V2MultiLocation
    xcm: V2Instruction[]
}

export interface Type_449_QueryHolding {
    __kind: 'QueryHolding'
    queryId: bigint
    dest: V2MultiLocation
    assets: V2MultiAssetFilter
    maxResponseWeight: bigint
}

export interface Type_449_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V2Response
    maxWeight: bigint
}

export interface Type_449_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V2MultiAsset[]
}

export interface Type_449_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface Type_449_ReportError {
    __kind: 'ReportError'
    queryId: bigint
    dest: V2MultiLocation
    maxResponseWeight: bigint
}

export interface Type_449_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V2MultiAsset[]
}

export interface Type_449_SetAppendix {
    __kind: 'SetAppendix'
    value: Type_449[]
}

export interface Type_449_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: Type_449[]
}

export interface Type_449_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: bigint
}

export interface Type_449_Transact {
    __kind: 'Transact'
    originType: V2OriginKind
    requireWeightAtMost: bigint
    call: Type_450
}

export interface Type_449_TransferAsset {
    __kind: 'TransferAsset'
    assets: V2MultiAsset[]
    beneficiary: V2MultiLocation
}

export interface Type_449_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V2MultiAsset[]
    dest: V2MultiLocation
    xcm: V2Instruction[]
}

export interface Type_449_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface Type_449_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface Type_449_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V2MultiAsset[]
}

export type Type_446 = Type_446_V2 | Type_446_V3 | Type_446_V4

export interface Type_446_V2 {
    __kind: 'V2'
    value: Type_449[]
}

export interface Type_446_V3 {
    __kind: 'V3'
    value: Type_453[]
}

export interface Type_446_V4 {
    __kind: 'V4'
    value: Type_456[]
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type PolkadotXcmCall = PolkadotXcmCall_claim_assets | PolkadotXcmCall_execute | PolkadotXcmCall_force_default_xcm_version | PolkadotXcmCall_force_subscribe_version_notify | PolkadotXcmCall_force_suspension | PolkadotXcmCall_force_unsubscribe_version_notify | PolkadotXcmCall_force_xcm_version | PolkadotXcmCall_limited_reserve_transfer_assets | PolkadotXcmCall_limited_teleport_assets | PolkadotXcmCall_reserve_transfer_assets | PolkadotXcmCall_send | PolkadotXcmCall_teleport_assets | PolkadotXcmCall_transfer_assets | PolkadotXcmCall_transfer_assets_using_type_and_then

/**
 * Claims assets trapped on this pallet because of leftover assets during XCM execution.
 * 
 * - `origin`: Anyone can call this extrinsic.
 * - `assets`: The exact assets that were trapped. Use the version to specify what version
 * was the latest when they were trapped.
 * - `beneficiary`: The location/account where the claimed assets will be deposited.
 */
export interface PolkadotXcmCall_claim_assets {
    __kind: 'claim_assets'
    assets: VersionedAssets
    beneficiary: VersionedLocation
}

/**
 * Execute an XCM message from a local, signed, origin.
 * 
 * An event is deposited indicating whether `msg` could be executed completely or only
 * partially.
 * 
 * No more than `max_weight` will be used in its attempted execution. If this is less than
 * the maximum amount of weight that the message could take to be executed, then no
 * execution attempt will be made.
 */
export interface PolkadotXcmCall_execute {
    __kind: 'execute'
    message: Type_446
    maxWeight: Weight
}

/**
 * Set a safe XCM version (the version that XCM should be encoded with if the most recent
 * version a destination can accept is unknown).
 * 
 * - `origin`: Must be an origin specified by AdminOrigin.
 * - `maybe_xcm_version`: The default XCM encoding version, or `None` to disable.
 */
export interface PolkadotXcmCall_force_default_xcm_version {
    __kind: 'force_default_xcm_version'
    maybeXcmVersion?: (number | undefined)
}

/**
 * Ask a location to notify us regarding their XCM version and any changes to it.
 * 
 * - `origin`: Must be an origin specified by AdminOrigin.
 * - `location`: The location to which we should subscribe for XCM version notifications.
 */
export interface PolkadotXcmCall_force_subscribe_version_notify {
    __kind: 'force_subscribe_version_notify'
    location: VersionedLocation
}

/**
 * Set or unset the global suspension state of the XCM executor.
 * 
 * - `origin`: Must be an origin specified by AdminOrigin.
 * - `suspended`: `true` to suspend, `false` to resume.
 */
export interface PolkadotXcmCall_force_suspension {
    __kind: 'force_suspension'
    suspended: boolean
}

/**
 * Require that a particular destination should no longer notify us regarding any XCM
 * version changes.
 * 
 * - `origin`: Must be an origin specified by AdminOrigin.
 * - `location`: The location to which we are currently subscribed for XCM version
 *   notifications which we no longer desire.
 */
export interface PolkadotXcmCall_force_unsubscribe_version_notify {
    __kind: 'force_unsubscribe_version_notify'
    location: VersionedLocation
}

/**
 * Extoll that a particular destination can be communicated with through a particular
 * version of XCM.
 * 
 * - `origin`: Must be an origin specified by AdminOrigin.
 * - `location`: The destination that is being described.
 * - `xcm_version`: The latest version of XCM that `location` supports.
 */
export interface PolkadotXcmCall_force_xcm_version {
    __kind: 'force_xcm_version'
    location: V4Location
    version: number
}

/**
 * Transfer some assets from the local chain to the destination chain through their local,
 * destination or remote reserve.
 * 
 * `assets` must have same reserve location and may not be teleportable to `dest`.
 *  - `assets` have local reserve: transfer assets to sovereign account of destination
 *    chain and forward a notification XCM to `dest` to mint and deposit reserve-based
 *    assets to `beneficiary`.
 *  - `assets` have destination reserve: burn local assets and forward a notification to
 *    `dest` chain to withdraw the reserve assets from this chain's sovereign account and
 *    deposit them to `beneficiary`.
 *  - `assets` have remote reserve: burn local assets, forward XCM to reserve chain to move
 *    reserves from this chain's SA to `dest` chain's SA, and forward another XCM to `dest`
 *    to mint and deposit reserve-based assets to `beneficiary`.
 * 
 * Fee payment on the destination side is made from the asset in the `assets` vector of
 * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
 * is needed than `weight_limit`, then the operation will fail and the sent assets may be
 * at risk.
 * 
 * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
 * - `dest`: Destination context for the assets. Will typically be `[Parent,
 *   Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
 *   relay to parachain.
 * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
 *   generally be an `AccountId32` value.
 * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
 *   fee on the `dest` (and possibly reserve) chains.
 * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
 *   fees.
 * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
 */
export interface PolkadotXcmCall_limited_reserve_transfer_assets {
    __kind: 'limited_reserve_transfer_assets'
    dest: VersionedLocation
    beneficiary: VersionedLocation
    assets: VersionedAssets
    feeAssetItem: number
    weightLimit: V3WeightLimit
}

/**
 * Teleport some assets from the local chain to some destination chain.
 * 
 * Fee payment on the destination side is made from the asset in the `assets` vector of
 * index `fee_asset_item`, up to enough to pay for `weight_limit` of weight. If more weight
 * is needed than `weight_limit`, then the operation will fail and the sent assets may be
 * at risk.
 * 
 * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
 * - `dest`: Destination context for the assets. Will typically be `[Parent,
 *   Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
 *   relay to parachain.
 * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
 *   generally be an `AccountId32` value.
 * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
 *   fee on the `dest` chain.
 * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
 *   fees.
 * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
 */
export interface PolkadotXcmCall_limited_teleport_assets {
    __kind: 'limited_teleport_assets'
    dest: VersionedLocation
    beneficiary: VersionedLocation
    assets: VersionedAssets
    feeAssetItem: number
    weightLimit: V3WeightLimit
}

/**
 * Transfer some assets from the local chain to the destination chain through their local,
 * destination or remote reserve.
 * 
 * `assets` must have same reserve location and may not be teleportable to `dest`.
 *  - `assets` have local reserve: transfer assets to sovereign account of destination
 *    chain and forward a notification XCM to `dest` to mint and deposit reserve-based
 *    assets to `beneficiary`.
 *  - `assets` have destination reserve: burn local assets and forward a notification to
 *    `dest` chain to withdraw the reserve assets from this chain's sovereign account and
 *    deposit them to `beneficiary`.
 *  - `assets` have remote reserve: burn local assets, forward XCM to reserve chain to move
 *    reserves from this chain's SA to `dest` chain's SA, and forward another XCM to `dest`
 *    to mint and deposit reserve-based assets to `beneficiary`.
 * 
 * **This function is deprecated: Use `limited_reserve_transfer_assets` instead.**
 * 
 * Fee payment on the destination side is made from the asset in the `assets` vector of
 * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
 * with all fees taken as needed from the asset.
 * 
 * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
 * - `dest`: Destination context for the assets. Will typically be `[Parent,
 *   Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
 *   relay to parachain.
 * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
 *   generally be an `AccountId32` value.
 * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
 *   fee on the `dest` (and possibly reserve) chains.
 * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
 *   fees.
 */
export interface PolkadotXcmCall_reserve_transfer_assets {
    __kind: 'reserve_transfer_assets'
    dest: VersionedLocation
    beneficiary: VersionedLocation
    assets: VersionedAssets
    feeAssetItem: number
}

export interface PolkadotXcmCall_send {
    __kind: 'send'
    dest: VersionedLocation
    message: VersionedXcm
}

/**
 * Teleport some assets from the local chain to some destination chain.
 * 
 * **This function is deprecated: Use `limited_teleport_assets` instead.**
 * 
 * Fee payment on the destination side is made from the asset in the `assets` vector of
 * index `fee_asset_item`. The weight limit for fees is not provided and thus is unlimited,
 * with all fees taken as needed from the asset.
 * 
 * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
 * - `dest`: Destination context for the assets. Will typically be `[Parent,
 *   Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
 *   relay to parachain.
 * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
 *   generally be an `AccountId32` value.
 * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
 *   fee on the `dest` chain.
 * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
 *   fees.
 */
export interface PolkadotXcmCall_teleport_assets {
    __kind: 'teleport_assets'
    dest: VersionedLocation
    beneficiary: VersionedLocation
    assets: VersionedAssets
    feeAssetItem: number
}

/**
 * Transfer some assets from the local chain to the destination chain through their local,
 * destination or remote reserve, or through teleports.
 * 
 * Fee payment on the destination side is made from the asset in the `assets` vector of
 * index `fee_asset_item` (hence referred to as `fees`), up to enough to pay for
 * `weight_limit` of weight. If more weight is needed than `weight_limit`, then the
 * operation will fail and the sent assets may be at risk.
 * 
 * `assets` (excluding `fees`) must have same reserve location or otherwise be teleportable
 * to `dest`, no limitations imposed on `fees`.
 *  - for local reserve: transfer assets to sovereign account of destination chain and
 *    forward a notification XCM to `dest` to mint and deposit reserve-based assets to
 *    `beneficiary`.
 *  - for destination reserve: burn local assets and forward a notification to `dest` chain
 *    to withdraw the reserve assets from this chain's sovereign account and deposit them
 *    to `beneficiary`.
 *  - for remote reserve: burn local assets, forward XCM to reserve chain to move reserves
 *    from this chain's SA to `dest` chain's SA, and forward another XCM to `dest` to mint
 *    and deposit reserve-based assets to `beneficiary`.
 *  - for teleports: burn local assets and forward XCM to `dest` chain to mint/teleport
 *    assets and deposit them to `beneficiary`.
 * 
 * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
 * - `dest`: Destination context for the assets. Will typically be `X2(Parent,
 *   Parachain(..))` to send from parachain to parachain, or `X1(Parachain(..))` to send
 *   from relay to parachain.
 * - `beneficiary`: A beneficiary location for the assets in the context of `dest`. Will
 *   generally be an `AccountId32` value.
 * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
 *   fee on the `dest` (and possibly reserve) chains.
 * - `fee_asset_item`: The index into `assets` of the item which should be used to pay
 *   fees.
 * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
 */
export interface PolkadotXcmCall_transfer_assets {
    __kind: 'transfer_assets'
    dest: VersionedLocation
    beneficiary: VersionedLocation
    assets: VersionedAssets
    feeAssetItem: number
    weightLimit: V3WeightLimit
}

/**
 * Transfer assets from the local chain to the destination chain using explicit transfer
 * types for assets and fees.
 * 
 * `assets` must have same reserve location or may be teleportable to `dest`. Caller must
 * provide the `assets_transfer_type` to be used for `assets`:
 *  - `TransferType::LocalReserve`: transfer assets to sovereign account of destination
 *    chain and forward a notification XCM to `dest` to mint and deposit reserve-based
 *    assets to `beneficiary`.
 *  - `TransferType::DestinationReserve`: burn local assets and forward a notification to
 *    `dest` chain to withdraw the reserve assets from this chain's sovereign account and
 *    deposit them to `beneficiary`.
 *  - `TransferType::RemoteReserve(reserve)`: burn local assets, forward XCM to `reserve`
 *    chain to move reserves from this chain's SA to `dest` chain's SA, and forward another
 *    XCM to `dest` to mint and deposit reserve-based assets to `beneficiary`. Typically
 *    the remote `reserve` is Asset Hub.
 *  - `TransferType::Teleport`: burn local assets and forward XCM to `dest` chain to
 *    mint/teleport assets and deposit them to `beneficiary`.
 * 
 * On the destination chain, as well as any intermediary hops, `BuyExecution` is used to
 * buy execution using transferred `assets` identified by `remote_fees_id`.
 * Make sure enough of the specified `remote_fees_id` asset is included in the given list
 * of `assets`. `remote_fees_id` should be enough to pay for `weight_limit`. If more weight
 * is needed than `weight_limit`, then the operation will fail and the sent assets may be
 * at risk.
 * 
 * `remote_fees_id` may use different transfer type than rest of `assets` and can be
 * specified through `fees_transfer_type`.
 * 
 * The caller needs to specify what should happen to the transferred assets once they reach
 * the `dest` chain. This is done through the `custom_xcm_on_dest` parameter, which
 * contains the instructions to execute on `dest` as a final step.
 *   This is usually as simple as:
 *   `Xcm(vec![DepositAsset { assets: Wild(AllCounted(assets.len())), beneficiary }])`,
 *   but could be something more exotic like sending the `assets` even further.
 * 
 * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
 * - `dest`: Destination context for the assets. Will typically be `[Parent,
 *   Parachain(..)]` to send from parachain to parachain, or `[Parachain(..)]` to send from
 *   relay to parachain, or `(parents: 2, (GlobalConsensus(..), ..))` to send from
 *   parachain across a bridge to another ecosystem destination.
 * - `assets`: The assets to be withdrawn. This should include the assets used to pay the
 *   fee on the `dest` (and possibly reserve) chains.
 * - `assets_transfer_type`: The XCM `TransferType` used to transfer the `assets`.
 * - `remote_fees_id`: One of the included `assets` to be be used to pay fees.
 * - `fees_transfer_type`: The XCM `TransferType` used to transfer the `fees` assets.
 * - `custom_xcm_on_dest`: The XCM to be executed on `dest` chain as the last step of the
 *   transfer, which also determines what happens to the assets on the destination chain.
 * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
 */
export interface PolkadotXcmCall_transfer_assets_using_type_and_then {
    __kind: 'transfer_assets_using_type_and_then'
    dest: VersionedLocation
    assets: VersionedAssets
    assetsTransferType: TransferType
    remoteFeesId: VersionedAssetId
    feesTransferType: TransferType
    customXcmOnDest: VersionedXcm
    weightLimit: V3WeightLimit
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const ParachainSystemCall: sts.Type<ParachainSystemCall> = sts.closedEnum(() => {
    return  {
        authorize_upgrade: sts.enumStruct({
            codeHash: H256,
            checkVersion: sts.boolean(),
        }),
        enact_authorized_upgrade: sts.enumStruct({
            code: sts.bytes(),
        }),
        set_validation_data: sts.enumStruct({
            data: ParachainInherentData,
        }),
        sudo_send_upward_message: sts.enumStruct({
            message: sts.bytes(),
        }),
    }
})

export const ParachainInherentData: sts.Type<ParachainInherentData> = sts.struct(() => {
    return  {
        validationData: V7PersistedValidationData,
        relayChainState: StorageProof,
        downwardMessages: sts.array(() => InboundDownwardMessage),
        horizontalMessages: sts.array(() => sts.tuple(() => [Id, sts.array(() => InboundHrmpMessage)])),
    }
})

export const InboundHrmpMessage: sts.Type<InboundHrmpMessage> = sts.struct(() => {
    return  {
        sentAt: sts.number(),
        data: sts.bytes(),
    }
})

export interface InboundHrmpMessage {
    sentAt: number
    data: Bytes
}

export const InboundDownwardMessage: sts.Type<InboundDownwardMessage> = sts.struct(() => {
    return  {
        sentAt: sts.number(),
        msg: sts.bytes(),
    }
})

export interface InboundDownwardMessage {
    sentAt: number
    msg: Bytes
}

export const StorageProof: sts.Type<StorageProof> = sts.struct(() => {
    return  {
        trieNodes: sts.array(() => sts.bytes()),
    }
})

export interface StorageProof {
    trieNodes: Bytes[]
}

export const V7PersistedValidationData: sts.Type<V7PersistedValidationData> = sts.struct(() => {
    return  {
        parentHead: HeadData,
        relayParentNumber: sts.number(),
        relayParentStorageRoot: H256,
        maxPovSize: sts.number(),
    }
})

export const HeadData = sts.bytes()

export interface V7PersistedValidationData {
    parentHead: HeadData
    relayParentNumber: number
    relayParentStorageRoot: H256
    maxPovSize: number
}

export type HeadData = Bytes

export interface ParachainInherentData {
    validationData: V7PersistedValidationData
    relayChainState: StorageProof
    downwardMessages: InboundDownwardMessage[]
    horizontalMessages: [Id, InboundHrmpMessage[]][]
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type ParachainSystemCall = ParachainSystemCall_authorize_upgrade | ParachainSystemCall_enact_authorized_upgrade | ParachainSystemCall_set_validation_data | ParachainSystemCall_sudo_send_upward_message

/**
 * Authorize an upgrade to a given `code_hash` for the runtime. The runtime can be supplied
 * later.
 * 
 * The `check_version` parameter sets a boolean flag for whether or not the runtime's spec
 * version and name should be verified on upgrade. Since the authorization only has a hash,
 * it cannot actually perform the verification.
 * 
 * This call requires Root origin.
 */
export interface ParachainSystemCall_authorize_upgrade {
    __kind: 'authorize_upgrade'
    codeHash: H256
    checkVersion: boolean
}

/**
 * Provide the preimage (runtime binary) `code` for an upgrade that has been authorized.
 * 
 * If the authorization required a version check, this call will ensure the spec name
 * remains unchanged and that the spec version has increased.
 * 
 * Note that this function will not apply the new `code`, but only attempt to schedule the
 * upgrade with the Relay Chain.
 * 
 * All origins are allowed.
 */
export interface ParachainSystemCall_enact_authorized_upgrade {
    __kind: 'enact_authorized_upgrade'
    code: Bytes
}

/**
 * Set the current validation data.
 * 
 * This should be invoked exactly once per block. It will panic at the finalization
 * phase if the call was not invoked.
 * 
 * The dispatch origin for this call must be `Inherent`
 * 
 * As a side effect, this function upgrades the current validation function
 * if the appropriate time has come.
 */
export interface ParachainSystemCall_set_validation_data {
    __kind: 'set_validation_data'
    data: ParachainInherentData
}

export interface ParachainSystemCall_sudo_send_upward_message {
    __kind: 'sudo_send_upward_message'
    message: Bytes
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const ParachainInfoCall: sts.Type<ParachainInfoCall> = sts.closedEnum(() => {
    return  {
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type ParachainInfoCall = never

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const OtcSettlementsCall: sts.Type<OtcSettlementsCall> = sts.closedEnum(() => {
    return  {
        settle_otc_order: sts.enumStruct({
            otcId: sts.number(),
            amount: sts.bigint(),
            route: sts.array(() => Trade),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type OtcSettlementsCall = OtcSettlementsCall_settle_otc_order

/**
 * Close an existing OTC arbitrage opportunity.
 * 
 * Executes a trade between an OTC order and some route.
 * If the OTC order is partially fillable, the extrinsic fails if the existing arbitrage
 * opportunity is not closed or reduced after the trade.
 * If the OTC order is not partially fillable, fails if there is no profit after the trade.
 * 
 * `Origin` calling this extrinsic is not paying or receiving anything.
 * 
 * The profit made by closing the arbitrage is transferred to `FeeReceiver`.
 * 
 * Parameters:
 * - `origin`: Signed or unsigned origin. Unsigned origin doesn't pay the TX fee,
 * 			but can be submitted only by a collator.
 * - `otc_id`: ID of the OTC order with existing arbitrage opportunity.
 * - `amount`: Amount necessary to close the arb.
 * - `route`: The route we trade against. Required for the fee calculation.
 * 
 * Emits `Executed` event when successful.
 * 
 */
export interface OtcSettlementsCall_settle_otc_order {
    __kind: 'settle_otc_order'
    otcId: number
    amount: bigint
    route: Trade[]
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const OrmlXcmCall: sts.Type<OrmlXcmCall> = sts.closedEnum(() => {
    return  {
        send_as_sovereign: sts.enumStruct({
            dest: VersionedLocation,
            message: VersionedXcm,
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type OrmlXcmCall = OrmlXcmCall_send_as_sovereign

/**
 * Send an XCM message as parachain sovereign.
 */
export interface OrmlXcmCall_send_as_sovereign {
    __kind: 'send_as_sovereign'
    dest: VersionedLocation
    message: VersionedXcm
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const OmnipoolWarehouseLMCall: sts.Type<OmnipoolWarehouseLMCall> = sts.closedEnum(() => {
    return  {
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type OmnipoolWarehouseLMCall = never

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const OmnipoolLiquidityMiningCall: sts.Type<OmnipoolLiquidityMiningCall> = sts.closedEnum(() => {
    return  {
        claim_rewards: sts.enumStruct({
            depositId: sts.bigint(),
            yieldFarmId: sts.number(),
        }),
        create_global_farm: sts.enumStruct({
            totalRewards: sts.bigint(),
            plannedYieldingPeriods: sts.number(),
            blocksPerPeriod: sts.number(),
            rewardCurrency: sts.number(),
            owner: AccountId32,
            yieldPerPeriod: Perquintill,
            minDeposit: sts.bigint(),
            lrnaPriceAdjustment: FixedU128,
        }),
        create_yield_farm: sts.enumStruct({
            globalFarmId: sts.number(),
            assetId: sts.number(),
            multiplier: FixedU128,
            loyaltyCurve: sts.option(() => LoyaltyCurve),
        }),
        deposit_shares: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            positionId: sts.bigint(),
        }),
        redeposit_shares: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            depositId: sts.bigint(),
        }),
        resume_yield_farm: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            multiplier: FixedU128,
        }),
        stop_yield_farm: sts.enumStruct({
            globalFarmId: sts.number(),
            assetId: sts.number(),
        }),
        terminate_global_farm: sts.enumStruct({
            globalFarmId: sts.number(),
        }),
        terminate_yield_farm: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
        }),
        update_global_farm: sts.enumStruct({
            globalFarmId: sts.number(),
            plannedYieldingPeriods: sts.number(),
            yieldPerPeriod: Perquintill,
            minDeposit: sts.bigint(),
        }),
        update_yield_farm: sts.enumStruct({
            globalFarmId: sts.number(),
            assetId: sts.number(),
            multiplier: FixedU128,
        }),
        withdraw_shares: sts.enumStruct({
            depositId: sts.bigint(),
            yieldFarmId: sts.number(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type OmnipoolLiquidityMiningCall = OmnipoolLiquidityMiningCall_claim_rewards | OmnipoolLiquidityMiningCall_create_global_farm | OmnipoolLiquidityMiningCall_create_yield_farm | OmnipoolLiquidityMiningCall_deposit_shares | OmnipoolLiquidityMiningCall_redeposit_shares | OmnipoolLiquidityMiningCall_resume_yield_farm | OmnipoolLiquidityMiningCall_stop_yield_farm | OmnipoolLiquidityMiningCall_terminate_global_farm | OmnipoolLiquidityMiningCall_terminate_yield_farm | OmnipoolLiquidityMiningCall_update_global_farm | OmnipoolLiquidityMiningCall_update_yield_farm | OmnipoolLiquidityMiningCall_withdraw_shares

/**
 * Claim rewards from liquidity mining program for deposit represented by the `deposit_id`.
 * 
 * This function calculate user rewards from liquidity mining and transfer rewards to `origin`
 * account. Claiming multiple time the same period is not allowed.
 * 
 * Parameters:
 * - `origin`: owner of deposit.
 * - `deposit_id`: id of the deposit to claim rewards for.
 * - `yield_farm_id`: id of the yield farm to claim rewards from.
 * 
 * Emits `RewardClaimed` event when successful.
 * 
 */
export interface OmnipoolLiquidityMiningCall_claim_rewards {
    __kind: 'claim_rewards'
    depositId: bigint
    yieldFarmId: number
}

/**
 * Create a new liquidity mining program with provided parameters.
 * 
 * `owner` account has to have at least `total_rewards` balance. These funds will be
 * transferred from `owner` to farm account.
 * 
 * The dispatch origin for this call must be `T::CreateOrigin`.
 * !!!WARN: `T::CreateOrigin` has power over funds of `owner`'s account and it should be
 * configured to trusted origin e.g Sudo or Governance.
 * 
 * Parameters:
 * - `origin`: account allowed to create new liquidity mining program(root, governance).
 * - `total_rewards`: total rewards planned to distribute. These rewards will be
 * distributed between all yield farms in the global farm.
 * - `planned_yielding_periods`: planned number of periods to distribute `total_rewards`.
 * WARN: THIS IS NOT HARD DEADLINE. Not all rewards have to be distributed in
 * `planned_yielding_periods`. Rewards are distributed based on the situation in the yield
 * farms and can be distributed in a longer, though never in a shorter, time frame.
 * - `blocks_per_period`:  number of blocks in a single period. Min. number of blocks per
 * period is 1.
 * - `reward_currency`: payoff currency of rewards.
 * - `owner`: liq. mining farm owner. This account will be able to manage created
 * liquidity mining program.
 * - `yield_per_period`: percentage return on `reward_currency` of all farms.
 * - `min_deposit`: minimum amount of LP shares to be deposited into the liquidity mining by each user.
 * - `lrna_price_adjustment`: price adjustment between `[LRNA]` and `reward_currency`.
 * 
 * Emits `GlobalFarmCreated` when successful.
 * 
 */
export interface OmnipoolLiquidityMiningCall_create_global_farm {
    __kind: 'create_global_farm'
    totalRewards: bigint
    plannedYieldingPeriods: number
    blocksPerPeriod: number
    rewardCurrency: number
    owner: AccountId32
    yieldPerPeriod: Perquintill
    minDeposit: bigint
    lrnaPriceAdjustment: FixedU128
}

/**
 * Create yield farm for given `asset_id` in the omnipool.
 *  
 * Only farm owner can perform this action.
 * 
 * Asset with `asset_id` has to be registered in the omnipool.
 * At most one `active` yield farm can exist in one global farm for the same `asset_id`.
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `global_farm_id`: global farm id to which a yield farm will be added.
 * - `asset_id`: id of a asset in the omnipool. Yield farm will be created
 * for this asset and user will be able to lock LP shares into this yield farm immediately.
 * - `multiplier`: yield farm's multiplier.
 * - `loyalty_curve`: curve to calculate loyalty multiplier to distribute rewards to users
 * with time incentive. `None` means no loyalty multiplier.
 * 
 * Emits `YieldFarmCreated` event when successful.
 * 
 */
export interface OmnipoolLiquidityMiningCall_create_yield_farm {
    __kind: 'create_yield_farm'
    globalFarmId: number
    assetId: number
    multiplier: FixedU128
    loyaltyCurve?: (LoyaltyCurve | undefined)
}

/**
 * Deposit omnipool position(LP shares) to a liquidity mining.
 * 
 * This function transfers omnipool position from `origin` to pallet's account and mint NFT for
 * `origin` account. Minted NFT represents deposit in the liquidity mining. User can
 * deposit omnipool position as a whole(all the LP shares in the position).
 * 
 * Parameters:
 * - `origin`: owner of the omnipool position to deposit into the liquidity mining.
 * - `global_farm_id`: id of global farm to which user wants to deposit LP shares.
 * - `yield_farm_id`: id of yield farm to deposit to.
 * - `position_id`: id of the omnipool position to be deposited into the liquidity mining.
 * 
 * Emits `SharesDeposited` event when successful.
 * 
 */
export interface OmnipoolLiquidityMiningCall_deposit_shares {
    __kind: 'deposit_shares'
    globalFarmId: number
    yieldFarmId: number
    positionId: bigint
}

/**
 * Redeposit LP shares in the already locked omnipool position.
 * 
 * This function create yield farm entry for existing deposit. Amount of redeposited LP
 * shares is same as amount shares which are already deposited in the deposit.
 * 
 * This function DOESN'T create new deposit(NFT).
 * 
 * Parameters:
 * - `origin`: owner of the deposit to redeposit.
 * - `global_farm_id`: id of the global farm to which user wants to redeposit LP shares.
 * - `yield_farm_id`: id of the yield farm to redeposit to.
 * - `deposit_id`: identifier of the deposit to redeposit.
 * 
 * Emits `SharesRedeposited` event when successful.
 * 
 */
export interface OmnipoolLiquidityMiningCall_redeposit_shares {
    __kind: 'redeposit_shares'
    globalFarmId: number
    yieldFarmId: number
    depositId: bigint
}

/**
 * Resume incentivization of the asset represented by yield farm.
 * 
 * This function resume incentivization of the asset from the `GlobalFarm` and
 * restore full functionality or the yield farm. Users will be able to deposit,
 * claim and withdraw again.
 * 
 * WARN: Yield farm(and users) is NOT rewarded for time it was stopped.
 * 
 * Only farm owner can perform this action.
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `global_farm_id`: global farm id in which yield farm will be resumed.
 * - `yield_farm_id`: id of the yield farm to be resumed.
 * - `asset_id`: id of the asset identifying yield farm in the global farm.
 * - `multiplier`: yield farm multiplier.
 * 
 * Emits `YieldFarmResumed` event when successful.
 * 
 */
export interface OmnipoolLiquidityMiningCall_resume_yield_farm {
    __kind: 'resume_yield_farm'
    globalFarmId: number
    yieldFarmId: number
    assetId: number
    multiplier: FixedU128
}

/**
 * Stop liquidity miming for specific yield farm.
 * 
 * This function claims rewards from `GlobalFarm` last time and stop yield farm
 * incentivization from a `GlobalFarm`. Users will be able to only withdraw
 * shares(with claiming) after calling this function.
 * `deposit_shares()` is not allowed on stopped yield farm.
 *  
 * Only farm owner can perform this action.
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `global_farm_id`: farm id in which yield farm will be canceled.
 * - `asset_id`: id of the asset identifying yield farm in the global farm.
 * 
 * Emits `YieldFarmStopped` event when successful.
 * 
 */
export interface OmnipoolLiquidityMiningCall_stop_yield_farm {
    __kind: 'stop_yield_farm'
    globalFarmId: number
    assetId: number
}

/**
 * Terminate existing liq. mining program.
 * 
 * Only farm owner can perform this action.
 * 
 * WARN: To successfully terminate a global farm, farm have to be empty
 * (all yield farms in the global farm must be terminated).
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `global_farm_id`: id of global farm to be terminated.
 * 
 * Emits `GlobalFarmTerminated` event when successful.
 * 
 */
export interface OmnipoolLiquidityMiningCall_terminate_global_farm {
    __kind: 'terminate_global_farm'
    globalFarmId: number
}

/**
 * Terminate yield farm.
 * 
 * This function marks a yield farm as ready to be removed from storage when it's empty. Users will
 * be able to only withdraw shares(without claiming rewards from yield farm). Unpaid rewards
 * will be transferred back to global farm and it will be used to distribute to other yield farms.
 * 
 * Yield farm must be stopped before it can be terminated.
 * 
 * Only global farm's owner can perform this action. Yield farm stays in the storage until it's
 * empty(all farm entries are withdrawn). Last withdrawn from yield farm trigger removing from
 * the storage.
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `global_farm_id`: global farm id in which yield farm should be terminated.
 * - `yield_farm_id`: id of yield farm to be terminated.
 * - `asset_id`: id of the asset identifying yield farm.
 * 
 * Emits `YieldFarmTerminated` event when successful.
 * 
 */
export interface OmnipoolLiquidityMiningCall_terminate_yield_farm {
    __kind: 'terminate_yield_farm'
    globalFarmId: number
    yieldFarmId: number
    assetId: number
}

/**
 * This extrinsic updates global farm's main parameters.
 * 
 * The dispatch origin for this call must be `T::CreateOrigin`.
 * !!!WARN: `T::CreateOrigin` has power over funds of `owner`'s account and it should be
 * configured to trusted origin e.g Sudo or Governance.
 * 
 * Parameters:
 * - `origin`: account allowed to create new liquidity mining program(root, governance).
 * - `global_farm_id`: id of the global farm to update.
 * - `planned_yielding_periods`: planned number of periods to distribute `total_rewards`.
 * - `yield_per_period`: percentage return on `reward_currency` of all farms.
 * - `min_deposit`: minimum amount of LP shares to be deposited into the liquidity mining by each user.
 * 
 * Emits `GlobalFarmUpdated` event when successful.
 */
export interface OmnipoolLiquidityMiningCall_update_global_farm {
    __kind: 'update_global_farm'
    globalFarmId: number
    plannedYieldingPeriods: number
    yieldPerPeriod: Perquintill
    minDeposit: bigint
}

/**
 * Update yield farm's multiplier.
 *  
 * Only farm owner can perform this action.
 * 
 * Parameters:
 * - `origin`: global farm's owner.
 * - `global_farm_id`: global farm id in which yield farm will be updated.
 * - `asset_id`: id of the asset identifying yield farm in the global farm.
 * - `multiplier`: new yield farm's multiplier.
 * 
 * Emits `YieldFarmUpdated` event when successful.
 * 
 */
export interface OmnipoolLiquidityMiningCall_update_yield_farm {
    __kind: 'update_yield_farm'
    globalFarmId: number
    assetId: number
    multiplier: FixedU128
}

/**
 * This function claim rewards and withdraw LP shares from yield farm. Omnipool position
 * is transferred to origin only if this is last withdraw in the deposit and deposit is
 * destroyed. This function claim rewards only if yield farm is not terminated and user
 * didn't already claim rewards in current period.
 * 
 * Unclaimable rewards represents rewards which user won't be able to claim because of
 * exiting early and these rewards will be transferred back to global farm for future
 * redistribution.
 * 
 * Parameters:
 * - `origin`: owner of deposit.
 * - `deposit_id`: id of the deposit to claim rewards for.
 * - `yield_farm_id`: id of the yield farm to claim rewards from.
 * 
 * Emits:
 * * `RewardClaimed` event if claimed rewards is > 0
 * * `SharesWithdrawn` event when successful
 * * `DepositDestroyed` event when this was last withdraw from the deposit and deposit was
 * destroyed.
 * 
 */
export interface OmnipoolLiquidityMiningCall_withdraw_shares {
    __kind: 'withdraw_shares'
    depositId: bigint
    yieldFarmId: number
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const OmnipoolCall: sts.Type<OmnipoolCall> = sts.closedEnum(() => {
    return  {
        add_liquidity: sts.enumStruct({
            asset: sts.number(),
            amount: sts.bigint(),
        }),
        add_liquidity_with_limit: sts.enumStruct({
            asset: sts.number(),
            amount: sts.bigint(),
            minSharesLimit: sts.bigint(),
        }),
        add_token: sts.enumStruct({
            asset: sts.number(),
            initialPrice: FixedU128,
            weightCap: Permill,
            positionOwner: AccountId32,
        }),
        buy: sts.enumStruct({
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            maxSellAmount: sts.bigint(),
        }),
        refund_refused_asset: sts.enumStruct({
            assetId: sts.number(),
            amount: sts.bigint(),
            recipient: AccountId32,
        }),
        remove_liquidity: sts.enumStruct({
            positionId: sts.bigint(),
            amount: sts.bigint(),
        }),
        remove_liquidity_with_limit: sts.enumStruct({
            positionId: sts.bigint(),
            amount: sts.bigint(),
            minLimit: sts.bigint(),
        }),
        remove_token: sts.enumStruct({
            assetId: sts.number(),
            beneficiary: AccountId32,
        }),
        sacrifice_position: sts.enumStruct({
            positionId: sts.bigint(),
        }),
        sell: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amount: sts.bigint(),
            minBuyAmount: sts.bigint(),
        }),
        set_asset_tradable_state: sts.enumStruct({
            assetId: sts.number(),
            state: Tradability,
        }),
        set_asset_weight_cap: sts.enumStruct({
            assetId: sts.number(),
            cap: Permill,
        }),
        withdraw_protocol_liquidity: sts.enumStruct({
            assetId: sts.number(),
            amount: sts.bigint(),
            price: sts.tuple(() => [sts.bigint(), sts.bigint()]),
            dest: AccountId32,
        }),
    }
})

export const Tradability: sts.Type<Tradability> = sts.struct(() => {
    return  {
        bits: sts.number(),
    }
})

export interface Tradability {
    bits: number
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type OmnipoolCall = OmnipoolCall_add_liquidity | OmnipoolCall_add_liquidity_with_limit | OmnipoolCall_add_token | OmnipoolCall_buy | OmnipoolCall_refund_refused_asset | OmnipoolCall_remove_liquidity | OmnipoolCall_remove_liquidity_with_limit | OmnipoolCall_remove_token | OmnipoolCall_sacrifice_position | OmnipoolCall_sell | OmnipoolCall_set_asset_tradable_state | OmnipoolCall_set_asset_weight_cap | OmnipoolCall_withdraw_protocol_liquidity

/**
 * Add liquidity of asset `asset` in quantity `amount` to Omnipool
 * 
 * `add_liquidity` adds specified asset amount to Omnipool and in exchange gives the origin
 * corresponding shares amount in form of NFT at current price.
 * 
 * Asset's tradable state must contain ADD_LIQUIDITY flag, otherwise `NotAllowed` error is returned.
 * 
 * NFT is minted using NTFHandler which implements non-fungibles traits from frame_support.
 * 
 * Asset weight cap must be respected, otherwise `AssetWeightExceeded` error is returned.
 * Asset weight is ratio between new HubAsset reserve and total reserve of Hub asset in Omnipool.
 * 
 * Add liquidity fails if price difference between spot price and oracle price is higher than allowed by `PriceBarrier`.
 * 
 * Parameters:
 * - `asset`: The identifier of the new asset added to the pool. Must be already in the pool
 * - `amount`: Amount of asset added to omnipool
 * 
 * Emits `LiquidityAdded` event when successful.
 * 
 */
export interface OmnipoolCall_add_liquidity {
    __kind: 'add_liquidity'
    asset: number
    amount: bigint
}

/**
 * Add liquidity of asset `asset` in quantity `amount` to Omnipool.
 * 
 * Limit protection is applied.
 * 
 * `add_liquidity` adds specified asset amount to Omnipool and in exchange gives the origin
 * corresponding shares amount in form of NFT at current price.
 * 
 * Asset's tradable state must contain ADD_LIQUIDITY flag, otherwise `NotAllowed` error is returned.
 * 
 * NFT is minted using NTFHandler which implements non-fungibles traits from frame_support.
 * 
 * Asset weight cap must be respected, otherwise `AssetWeightExceeded` error is returned.
 * Asset weight is ratio between new HubAsset reserve and total reserve of Hub asset in Omnipool.
 * 
 * Add liquidity fails if price difference between spot price and oracle price is higher than allowed by `PriceBarrier`.
 * 
 * Parameters:
 * - `asset`: The identifier of the new asset added to the pool. Must be already in the pool
 * - `amount`: Amount of asset added to omnipool
 * - `min_shares_limit`: The min amount of delta share asset the user should receive in the position
 * 
 * Emits `LiquidityAdded` event when successful.
 * 
 */
export interface OmnipoolCall_add_liquidity_with_limit {
    __kind: 'add_liquidity_with_limit'
    asset: number
    amount: bigint
    minSharesLimit: bigint
}

/**
 * Add new token to omnipool in quantity `amount` at price `initial_price`
 * 
 * Initial liquidity must be transferred to pool's account for this new token manually prior to calling `add_token`.
 * 
 * Initial liquidity is pool's account balance of the token.
 * 
 * Position NFT token is minted for `position_owner`.
 * 
 * Parameters:
 * - `asset`: The identifier of the new asset added to the pool. Must be registered in Asset registry
 * - `initial_price`: Initial price
 * - `position_owner`: account id for which share are distributed in form on NFT
 * - `weight_cap`: asset weight cap
 * 
 * Emits `TokenAdded` event when successful.
 * 
 */
export interface OmnipoolCall_add_token {
    __kind: 'add_token'
    asset: number
    initialPrice: FixedU128
    weightCap: Permill
    positionOwner: AccountId32
}

/**
 * Execute a swap of `asset_out` for `asset_in`.
 * 
 * Price is determined by the Omnipool.
 * 
 * Hub asset is traded separately.
 * 
 * Asset's tradable states must contain SELL flag for asset_in and BUY flag for asset_out, otherwise `NotAllowed` error is returned.
 * 
 * Parameters:
 * - `asset_in`: ID of asset sold to the pool
 * - `asset_out`: ID of asset bought from the pool
 * - `amount`: Amount of asset sold
 * - `max_sell_amount`: Maximum amount to be sold.
 * 
 * Emits `BuyExecuted` event when successful.
 * 
 */
export interface OmnipoolCall_buy {
    __kind: 'buy'
    assetOut: number
    assetIn: number
    amount: bigint
    maxSellAmount: bigint
}

/**
 * Refund given amount of asset to a recipient.
 * 
 * A refund is needed when a token is refused to be added to Omnipool, and initial liquidity of the asset has been already transferred to pool's account.
 * 
 * Transfer can be executed only if asset is not in Omnipool and pool's balance has sufficient amount.
 * 
 * Only `AuthorityOrigin` can perform this operation.
 * 
 * Emits `AssetRefunded`
 */
export interface OmnipoolCall_refund_refused_asset {
    __kind: 'refund_refused_asset'
    assetId: number
    amount: bigint
    recipient: AccountId32
}

/**
 * Remove liquidity of asset `asset` in quantity `amount` from Omnipool
 * 
 * `remove_liquidity` removes specified shares amount from given PositionId (NFT instance).
 * 
 * Asset's tradable state must contain REMOVE_LIQUIDITY flag, otherwise `NotAllowed` error is returned.
 * 
 * if all shares from given position are removed, position is destroyed and NFT is burned.
 * 
 * Remove liquidity fails if price difference between spot price and oracle price is higher than allowed by `PriceBarrier`.
 * 
 * Dynamic withdrawal fee is applied if withdrawal is not safe. It is calculated using spot price and external price oracle.
 * Withdrawal is considered safe when trading is disabled.
 * 
 * Parameters:
 * - `position_id`: The identifier of position which liquidity is removed from.
 * - `amount`: Amount of shares removed from omnipool
 * 
 * Emits `LiquidityRemoved` event when successful.
 * 
 */
export interface OmnipoolCall_remove_liquidity {
    __kind: 'remove_liquidity'
    positionId: bigint
    amount: bigint
}

/**
 * Remove liquidity of asset `asset` in quantity `amount` from Omnipool
 * 
 * Limit protection is applied.
 * 
 * `remove_liquidity` removes specified shares amount from given PositionId (NFT instance).
 * 
 * Asset's tradable state must contain REMOVE_LIQUIDITY flag, otherwise `NotAllowed` error is returned.
 * 
 * if all shares from given position are removed, position is destroyed and NFT is burned.
 * 
 * Remove liquidity fails if price difference between spot price and oracle price is higher than allowed by `PriceBarrier`.
 * 
 * Dynamic withdrawal fee is applied if withdrawal is not safe. It is calculated using spot price and external price oracle.
 * Withdrawal is considered safe when trading is disabled.
 * 
 * Parameters:
 * - `position_id`: The identifier of position which liquidity is removed from.
 * - `amount`: Amount of shares removed from omnipool
 * - `min_limit`: The min amount of asset to be removed for the user
 * 
 * Emits `LiquidityRemoved` event when successful.
 * 
 */
export interface OmnipoolCall_remove_liquidity_with_limit {
    __kind: 'remove_liquidity_with_limit'
    positionId: bigint
    amount: bigint
    minLimit: bigint
}

/**
 * Removes token from Omnipool.
 * 
 * Asset's tradability must be FROZEN, otherwise `AssetNotFrozen` error is returned.
 * 
 * Remaining shares must belong to protocol, otherwise `SharesRemaining` error is returned.
 * 
 * Protocol's liquidity is transferred to the beneficiary account and hub asset amount is burned.
 * 
 * Only `AuthorityOrigin` can perform this call.
 * 
 * Emits `TokenRemoved` event when successful.
 */
export interface OmnipoolCall_remove_token {
    __kind: 'remove_token'
    assetId: number
    beneficiary: AccountId32
}

/**
 * Sacrifice LP position in favor of pool.
 * 
 * A position is destroyed and liquidity owned by LP becomes pool owned liquidity.
 * 
 * Only owner of position can perform this action.
 * 
 * Emits `PositionDestroyed`.
 */
export interface OmnipoolCall_sacrifice_position {
    __kind: 'sacrifice_position'
    positionId: bigint
}

/**
 * Execute a swap of `asset_in` for `asset_out`.
 * 
 * Price is determined by the Omnipool.
 * 
 * Hub asset is traded separately.
 * 
 * Asset's tradable states must contain SELL flag for asset_in and BUY flag for asset_out, otherwise `NotAllowed` error is returned.
 * 
 * Parameters:
 * - `asset_in`: ID of asset sold to the pool
 * - `asset_out`: ID of asset bought from the pool
 * - `amount`: Amount of asset sold
 * - `min_buy_amount`: Minimum amount required to receive
 * 
 * Emits `SellExecuted` event when successful.
 * 
 */
export interface OmnipoolCall_sell {
    __kind: 'sell'
    assetIn: number
    assetOut: number
    amount: bigint
    minBuyAmount: bigint
}

/**
 * Update asset's tradable state.
 * 
 * Parameters:
 * - `asset_id`: asset id
 * - `state`: new state
 * 
 * Emits `TradableStateUpdated` event when successful.
 * 
 */
export interface OmnipoolCall_set_asset_tradable_state {
    __kind: 'set_asset_tradable_state'
    assetId: number
    state: Tradability
}

/**
 * Update asset's weight cap
 * 
 * Parameters:
 * - `asset_id`: asset id
 * - `cap`: new weight cap
 * 
 * Emits `AssetWeightCapUpdated` event when successful.
 * 
 */
export interface OmnipoolCall_set_asset_weight_cap {
    __kind: 'set_asset_weight_cap'
    assetId: number
    cap: Permill
}

/**
 * Removes protocol liquidity.
 * 
 * Protocol liquidity is liquidity from sacrificed positions. In order to remove protocol liquidity,
 * we need the know the price of the position at the time of sacrifice. Hence this specific call.
 * 
 * Only `AuthorityOrigin` can perform this call.
 * 
 * Note that sacrifice position will be deprecated in future. There is no longer a need for that.
 * 
 * It works the same way as remove liquidity call, but position is temporary reconstructed.
 * 
 */
export interface OmnipoolCall_withdraw_protocol_liquidity {
    __kind: 'withdraw_protocol_liquidity'
    assetId: number
    amount: bigint
    price: [bigint, bigint]
    dest: AccountId32
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const OTCCall: sts.Type<OTCCall> = sts.closedEnum(() => {
    return  {
        cancel_order: sts.enumStruct({
            orderId: sts.number(),
        }),
        fill_order: sts.enumStruct({
            orderId: sts.number(),
        }),
        partial_fill_order: sts.enumStruct({
            orderId: sts.number(),
            amountIn: sts.bigint(),
        }),
        place_order: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            partiallyFillable: sts.boolean(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type OTCCall = OTCCall_cancel_order | OTCCall_fill_order | OTCCall_partial_fill_order | OTCCall_place_order

/**
 * Cancel an open OTC order
 *  
 * Parameters:
 * - `order_id`: ID of the order
 * - `asset`: Asset which is being filled
 * - `amount`: Amount which is being filled
 * 
 * Validations:
 * - caller is order owner
 * 
 * Emits `Cancelled` event when successful.
 */
export interface OTCCall_cancel_order {
    __kind: 'cancel_order'
    orderId: number
}

/**
 * Fill an OTC order (completely)
 *  
 * Parameters:
 * - `order_id`: ID of the order
 * 
 * Events:
 * `Filled` event when successful.
 */
export interface OTCCall_fill_order {
    __kind: 'fill_order'
    orderId: number
}

/**
 * Fill an OTC order (partially)
 *  
 * Parameters:
 * - `order_id`: ID of the order
 * - `amount_in`: Amount with which the order is being filled
 * 
 * Validations:
 * - order must be partially_fillable
 * - after the partial_fill, the remaining order.amount_in must be higher than the existential deposit
 *   of asset_in multiplied by ExistentialDepositMultiplier
 * - after the partial_fill, the remaining order.amount_out must be higher than the existential deposit
 *   of asset_out multiplied by ExistentialDepositMultiplier
 * 
 * Events:
 * `PartiallyFilled` event when successful.
 */
export interface OTCCall_partial_fill_order {
    __kind: 'partial_fill_order'
    orderId: number
    amountIn: bigint
}

/**
 * Create a new OTC order
 *  
 * Parameters:
 * - `asset_in`: Asset which is being bought
 * - `asset_out`: Asset which is being sold
 * - `amount_in`: Amount that the order is seeking to buy
 * - `amount_out`: Amount that the order is selling
 * - `partially_fillable`: Flag indicating whether users can fill the order partially
 * 
 * Validations:
 * - asset_in must be registered
 * - amount_in must be higher than the existential deposit of asset_in multiplied by
 *   ExistentialDepositMultiplier
 * - amount_out must be higher than the existential deposit of asset_out multiplied by
 *   ExistentialDepositMultiplier
 * 
 * Events:
 * - `Placed` event when successful.
 */
export interface OTCCall_place_order {
    __kind: 'place_order'
    assetIn: number
    assetOut: number
    amountIn: bigint
    amountOut: bigint
    partiallyFillable: boolean
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const MultisigCall: sts.Type<MultisigCall> = sts.closedEnum(() => {
    return  {
        approve_as_multi: sts.enumStruct({
            threshold: sts.number(),
            otherSignatories: sts.array(() => AccountId32),
            maybeTimepoint: sts.option(() => Timepoint),
            callHash: sts.bytes(),
            maxWeight: Weight,
        }),
        as_multi: sts.enumStruct({
            threshold: sts.number(),
            otherSignatories: sts.array(() => AccountId32),
            maybeTimepoint: sts.option(() => Timepoint),
            call: Call,
            maxWeight: Weight,
        }),
        as_multi_threshold_1: sts.enumStruct({
            otherSignatories: sts.array(() => AccountId32),
            call: Call,
        }),
        cancel_as_multi: sts.enumStruct({
            threshold: sts.number(),
            otherSignatories: sts.array(() => AccountId32),
            timepoint: Timepoint,
            callHash: sts.bytes(),
        }),
    }
})

export const Timepoint: sts.Type<Timepoint> = sts.struct(() => {
    return  {
        height: sts.number(),
        index: sts.number(),
    }
})

export interface Timepoint {
    height: number
    index: number
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type MultisigCall = MultisigCall_approve_as_multi | MultisigCall_as_multi | MultisigCall_as_multi_threshold_1 | MultisigCall_cancel_as_multi

/**
 * Register approval for a dispatch to be made from a deterministic composite account if
 * approved by a total of `threshold - 1` of `other_signatories`.
 * 
 * Payment: `DepositBase` will be reserved if this is the first approval, plus
 * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
 * is cancelled.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * - `threshold`: The total number of approvals for this dispatch before it is executed.
 * - `other_signatories`: The accounts (other than the sender) who can approve this
 * dispatch. May not be empty.
 * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
 * not the first approval, then it must be `Some`, with the timepoint (block number and
 * transaction index) of the first approval transaction.
 * - `call_hash`: The hash of the call to be executed.
 * 
 * NOTE: If this is the final approval, you will want to use `as_multi` instead.
 * 
 * ## Complexity
 * - `O(S)`.
 * - Up to one balance-reserve or unreserve operation.
 * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
 *   signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
 * - One encode & hash, both of complexity `O(S)`.
 * - Up to one binary search and insert (`O(logS + S)`).
 * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
 * - One event.
 * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
 *   taken for its lifetime of `DepositBase + threshold * DepositFactor`.
 */
export interface MultisigCall_approve_as_multi {
    __kind: 'approve_as_multi'
    threshold: number
    otherSignatories: AccountId32[]
    maybeTimepoint?: (Timepoint | undefined)
    callHash: Bytes
    maxWeight: Weight
}

/**
 * Register approval for a dispatch to be made from a deterministic composite account if
 * approved by a total of `threshold - 1` of `other_signatories`.
 * 
 * If there are enough, then dispatch the call.
 * 
 * Payment: `DepositBase` will be reserved if this is the first approval, plus
 * `threshold` times `DepositFactor`. It is returned once this dispatch happens or
 * is cancelled.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * - `threshold`: The total number of approvals for this dispatch before it is executed.
 * - `other_signatories`: The accounts (other than the sender) who can approve this
 * dispatch. May not be empty.
 * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
 * not the first approval, then it must be `Some`, with the timepoint (block number and
 * transaction index) of the first approval transaction.
 * - `call`: The call to be executed.
 * 
 * NOTE: Unless this is the final approval, you will generally want to use
 * `approve_as_multi` instead, since it only requires a hash of the call.
 * 
 * Result is equivalent to the dispatched result if `threshold` is exactly `1`. Otherwise
 * on success, result is `Ok` and the result from the interior call, if it was executed,
 * may be found in the deposited `MultisigExecuted` event.
 * 
 * ## Complexity
 * - `O(S + Z + Call)`.
 * - Up to one balance-reserve or unreserve operation.
 * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
 *   signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
 * - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len.
 * - One encode & hash, both of complexity `O(S)`.
 * - Up to one binary search and insert (`O(logS + S)`).
 * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
 * - One event.
 * - The weight of the `call`.
 * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a deposit
 *   taken for its lifetime of `DepositBase + threshold * DepositFactor`.
 */
export interface MultisigCall_as_multi {
    __kind: 'as_multi'
    threshold: number
    otherSignatories: AccountId32[]
    maybeTimepoint?: (Timepoint | undefined)
    call: Call
    maxWeight: Weight
}

/**
 * Immediately dispatch a multi-signature call using a single approval from the caller.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * - `other_signatories`: The accounts (other than the sender) who are part of the
 * multi-signature, but do not participate in the approval process.
 * - `call`: The call to be executed.
 * 
 * Result is equivalent to the dispatched result.
 * 
 * ## Complexity
 * O(Z + C) where Z is the length of the call and C its execution weight.
 */
export interface MultisigCall_as_multi_threshold_1 {
    __kind: 'as_multi_threshold_1'
    otherSignatories: AccountId32[]
    call: Call
}

/**
 * Cancel a pre-existing, on-going multisig transaction. Any deposit reserved previously
 * for this operation will be unreserved on success.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * - `threshold`: The total number of approvals for this dispatch before it is executed.
 * - `other_signatories`: The accounts (other than the sender) who can approve this
 * dispatch. May not be empty.
 * - `timepoint`: The timepoint (block number and transaction index) of the first approval
 * transaction for this dispatch.
 * - `call_hash`: The hash of the call to be executed.
 * 
 * ## Complexity
 * - `O(S)`.
 * - Up to one balance-reserve or unreserve operation.
 * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
 *   signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
 * - One encode & hash, both of complexity `O(S)`.
 * - One event.
 * - I/O: 1 read `O(S)`, one remove.
 * - Storage: removes one item.
 */
export interface MultisigCall_cancel_as_multi {
    __kind: 'cancel_as_multi'
    threshold: number
    otherSignatories: AccountId32[]
    timepoint: Timepoint
    callHash: Bytes
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const MultiTransactionPaymentCall: sts.Type<MultiTransactionPaymentCall> = sts.closedEnum(() => {
    return  {
        add_currency: sts.enumStruct({
            currency: sts.number(),
            price: FixedU128,
        }),
        dispatch_permit: sts.enumStruct({
            from: H160,
            to: H160,
            value: sts.bigint(),
            data: sts.bytes(),
            gasLimit: sts.bigint(),
            deadline: sts.bigint(),
            v: sts.number(),
            r: H256,
            s: H256,
        }),
        remove_currency: sts.enumStruct({
            currency: sts.number(),
        }),
        reset_payment_currency: sts.enumStruct({
            accountId: AccountId32,
        }),
        set_currency: sts.enumStruct({
            currency: sts.number(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type MultiTransactionPaymentCall = MultiTransactionPaymentCall_add_currency | MultiTransactionPaymentCall_dispatch_permit | MultiTransactionPaymentCall_remove_currency | MultiTransactionPaymentCall_reset_payment_currency | MultiTransactionPaymentCall_set_currency

/**
 * Add a currency to the list of accepted currencies.
 * 
 * Only member can perform this action.
 * 
 * Currency must not be already accepted. Core asset id cannot be explicitly added.
 * 
 * Emits `CurrencyAdded` event when successful.
 */
export interface MultiTransactionPaymentCall_add_currency {
    __kind: 'add_currency'
    currency: number
    price: FixedU128
}

/**
 * Dispatch EVM permit.
 * The main purpose of this function is to allow EVM accounts to pay for the transaction fee in non-native currency
 * by allowing them to self-dispatch pre-signed permit.
 * The EVM fee is paid in the currency set for the account.
 */
export interface MultiTransactionPaymentCall_dispatch_permit {
    __kind: 'dispatch_permit'
    from: H160
    to: H160
    value: bigint
    data: Bytes
    gasLimit: bigint
    deadline: bigint
    v: number
    r: H256
    s: H256
}

/**
 * Remove currency from the list of supported currencies
 * Only selected members can perform this action
 * 
 * Core asset cannot be removed.
 * 
 * Emits `CurrencyRemoved` when successful.
 */
export interface MultiTransactionPaymentCall_remove_currency {
    __kind: 'remove_currency'
    currency: number
}

/**
 * Reset currency of the specified account to HDX.
 * If the account is EVM account, the payment currency is reset to WETH.
 * Only selected members can perform this action.
 * 
 * Emits `CurrencySet` when successful.
 */
export interface MultiTransactionPaymentCall_reset_payment_currency {
    __kind: 'reset_payment_currency'
    accountId: AccountId32
}

/**
 * Set selected currency for given account.
 * 
 * This allows to set a currency for an account in which all transaction fees will be paid.
 * Account balance cannot be zero.
 * 
 * In case of sufficient asset, the chosen currency must be in the list of accepted currencies
 * In case of insufficient asset, the chosen currency must have a XYK pool with DOT
 * 
 * When currency is set, fixed fee is withdrawn from the account to pay for the currency change
 * 
 * EVM accounts are now allowed to change thier payment currency.
 * 
 * Emits `CurrencySet` event when successful.
 */
export interface MultiTransactionPaymentCall_set_currency {
    __kind: 'set_currency'
    currency: number
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const MessageQueueCall: sts.Type<MessageQueueCall> = sts.closedEnum(() => {
    return  {
        execute_overweight: sts.enumStruct({
            messageOrigin: AggregateMessageOrigin,
            page: sts.number(),
            index: sts.number(),
            weightLimit: Weight,
        }),
        reap_page: sts.enumStruct({
            messageOrigin: AggregateMessageOrigin,
            pageIndex: sts.number(),
        }),
    }
})

export const AggregateMessageOrigin: sts.Type<AggregateMessageOrigin> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        Parent: sts.unit(),
        Sibling: Id,
    }
})

export type AggregateMessageOrigin = AggregateMessageOrigin_Here | AggregateMessageOrigin_Parent | AggregateMessageOrigin_Sibling

export interface AggregateMessageOrigin_Here {
    __kind: 'Here'
}

export interface AggregateMessageOrigin_Parent {
    __kind: 'Parent'
}

export interface AggregateMessageOrigin_Sibling {
    __kind: 'Sibling'
    value: Id
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type MessageQueueCall = MessageQueueCall_execute_overweight | MessageQueueCall_reap_page

/**
 * Execute an overweight message.
 * 
 * Temporary processing errors will be propagated whereas permanent errors are treated
 * as success condition.
 * 
 * - `origin`: Must be `Signed`.
 * - `message_origin`: The origin from which the message to be executed arrived.
 * - `page`: The page in the queue in which the message to be executed is sitting.
 * - `index`: The index into the queue of the message to be executed.
 * - `weight_limit`: The maximum amount of weight allowed to be consumed in the execution
 *   of the message.
 * 
 * Benchmark complexity considerations: O(index + weight_limit).
 */
export interface MessageQueueCall_execute_overweight {
    __kind: 'execute_overweight'
    messageOrigin: AggregateMessageOrigin
    page: number
    index: number
    weightLimit: Weight
}

/**
 * Remove a page which has no more messages remaining to be processed or is stale.
 */
export interface MessageQueueCall_reap_page {
    __kind: 'reap_page'
    messageOrigin: AggregateMessageOrigin
    pageIndex: number
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const LBPCall: sts.Type<LBPCall> = sts.closedEnum(() => {
    return  {
        add_liquidity: sts.enumStruct({
            amountA: sts.tuple(() => [sts.number(), sts.bigint()]),
            amountB: sts.tuple(() => [sts.number(), sts.bigint()]),
        }),
        buy: sts.enumStruct({
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            maxLimit: sts.bigint(),
        }),
        create_pool: sts.enumStruct({
            poolOwner: AccountId32,
            assetA: sts.number(),
            assetAAmount: sts.bigint(),
            assetB: sts.number(),
            assetBAmount: sts.bigint(),
            initialWeight: sts.number(),
            finalWeight: sts.number(),
            weightCurve: WeightCurveType,
            fee: sts.tuple(() => [sts.number(), sts.number()]),
            feeCollector: AccountId32,
            repayTarget: sts.bigint(),
        }),
        remove_liquidity: sts.enumStruct({
            poolId: AccountId32,
        }),
        sell: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amount: sts.bigint(),
            maxLimit: sts.bigint(),
        }),
        update_pool_data: sts.enumStruct({
            poolId: AccountId32,
            poolOwner: sts.option(() => AccountId32),
            start: sts.option(() => sts.number()),
            end: sts.option(() => sts.number()),
            initialWeight: sts.option(() => sts.number()),
            finalWeight: sts.option(() => sts.number()),
            fee: sts.option(() => sts.tuple(() => [sts.number(), sts.number()])),
            feeCollector: sts.option(() => AccountId32),
            repayTarget: sts.option(() => sts.bigint()),
        }),
    }
})

export const WeightCurveType: sts.Type<WeightCurveType> = sts.closedEnum(() => {
    return  {
        Linear: sts.unit(),
    }
})

export type WeightCurveType = WeightCurveType_Linear

export interface WeightCurveType_Linear {
    __kind: 'Linear'
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type LBPCall = LBPCall_add_liquidity | LBPCall_buy | LBPCall_create_pool | LBPCall_remove_liquidity | LBPCall_sell | LBPCall_update_pool_data

/**
 * Add liquidity to a pool.
 * 
 * Assets to add has to match the pool assets. At least one amount has to be non-zero.
 * 
 * The dispatch origin for this call must be signed by the pool owner.
 * 
 * Parameters:
 * - `pool_id`: The identifier of the pool
 * - `amount_a`: The identifier of the asset and the amount to add.
 * - `amount_b`: The identifier of the second asset and the amount to add.
 * 
 * Emits `LiquidityAdded` event when successful.
 */
export interface LBPCall_add_liquidity {
    __kind: 'add_liquidity'
    amountA: [number, bigint]
    amountB: [number, bigint]
}

/**
 * Trade `asset_in` for `asset_out`.
 * 
 * Executes a swap of `asset_in` for `asset_out`. Price is determined by the pool and is
 * affected by the amount and the proportion of the pool assets and the weights.
 * 
 * Trading `fee` is distributed to the `fee_collector`.
 * 
 * Parameters:
 * - `asset_in`: The identifier of the asset being transferred from the account to the pool.
 * - `asset_out`: The identifier of the asset being transferred from the pool to the account.
 * - `amount`: The amount of `asset_out`.
 * - `max_limit`: maximum amount of `asset_in` to be sold in exchange for `asset_out`.
 * 
 * Emits `BuyExecuted` when successful.
 */
export interface LBPCall_buy {
    __kind: 'buy'
    assetOut: number
    assetIn: number
    amount: bigint
    maxLimit: bigint
}

/**
 * Create a new liquidity bootstrapping pool for given asset pair.
 * 
 * For any asset pair, only one pool can exist at a time.
 * 
 * The dispatch origin for this call must be `T::CreatePoolOrigin`.
 * The pool is created with initial liquidity provided by the `pool_owner` who must have
 * sufficient funds free.
 * 
 * The pool starts uninitialized and update_pool call should be called once created to set the start block.
 * 
 * This function should be dispatched from governing entity `T::CreatePoolOrigin`
 * 
 * Parameters:
 * - `pool_owner`: the future owner of the new pool.
 * - `asset_a`: { asset_id, amount } Asset ID and initial liquidity amount.
 * - `asset_b`: { asset_id, amount } Asset ID and initial liquidity amount.
 * - `initial_weight`: Initial weight of the asset_a. 1_000_000 corresponding to 1% and 100_000_000 to 100%
 * this should be higher than final weight
 * - `final_weight`: Final weight of the asset_a. 1_000_000 corresponding to 1% and 100_000_000 to 100%
 * this should be lower than initial weight
 * - `weight_curve`: The weight function used to update the LBP weights. Currently,
 * there is only one weight function implemented, the linear function.
 * - `fee`: The trading fee charged on every trade distributed to `fee_collector`.
 * - `fee_collector`: The account to which trading fees will be transferred.
 * - `repay_target`: The amount of tokens to repay to separate fee_collector account. Until this amount is
 * reached, fee will be increased to 20% and taken from the pool
 * 
 * Emits `PoolCreated` event when successful.
 * 
 * BEWARE: We are taking the fee from the accumulated asset. If the accumulated asset is sold to the pool,
 * the fee cost is transferred to the pool. If its bought from the pool the buyer bears the cost.
 * This increases the price of the sold asset on every trade. Make sure to only run this with
 * previously illiquid assets.
 */
export interface LBPCall_create_pool {
    __kind: 'create_pool'
    poolOwner: AccountId32
    assetA: number
    assetAAmount: bigint
    assetB: number
    assetBAmount: bigint
    initialWeight: number
    finalWeight: number
    weightCurve: WeightCurveType
    fee: [number, number]
    feeCollector: AccountId32
    repayTarget: bigint
}

/**
 * Transfer all the liquidity from a pool back to the pool owner and destroy the pool.
 * The pool data are also removed from the storage.
 * 
 * The pool can't be destroyed during the sale.
 * 
 * The dispatch origin for this call must be signed by the pool owner.
 * 
 * Parameters:
 * - `amount_a`: The identifier of the asset and the amount to add.
 * 
 * Emits 'LiquidityRemoved' when successful.
 */
export interface LBPCall_remove_liquidity {
    __kind: 'remove_liquidity'
    poolId: AccountId32
}

/**
 * Trade `asset_in` for `asset_out`.
 * 
 * Executes a swap of `asset_in` for `asset_out`. Price is determined by the pool and is
 * affected by the amount and proportion of the pool assets and the weights.
 * 
 * Trading `fee` is distributed to the `fee_collector`.
 * 
 * Parameters:
 * - `asset_in`: The identifier of the asset being transferred from the account to the pool.
 * - `asset_out`: The identifier of the asset being transferred from the pool to the account.
 * - `amount`: The amount of `asset_in`
 * - `max_limit`: minimum amount of `asset_out` / amount of asset_out to be obtained from the pool in exchange for `asset_in`.
 * 
 * Emits `SellExecuted` when successful.
 */
export interface LBPCall_sell {
    __kind: 'sell'
    assetIn: number
    assetOut: number
    amount: bigint
    maxLimit: bigint
}

/**
 * Update pool data of a pool.
 * 
 * The dispatch origin for this call must be signed by the pool owner.
 * 
 * The pool can be updated only if the sale has not already started.
 * 
 * At least one of the following optional parameters has to be specified.
 * 
 * Parameters:
 * - `pool_id`: The identifier of the pool to be updated.
 * - `start`: The new starting time of the sale. This parameter is optional.
 * - `end`: The new ending time of the sale. This parameter is optional.
 * - `initial_weight`: The new initial weight. This parameter is optional.
 * - `final_weight`: The new final weight. This parameter is optional.
 * - `fee`: The new trading fee charged on every trade. This parameter is optional.
 * - `fee_collector`: The new receiver of trading fees. This parameter is optional.
 * 
 * Emits `PoolUpdated` event when successful.
 */
export interface LBPCall_update_pool_data {
    __kind: 'update_pool_data'
    poolId: AccountId32
    poolOwner?: (AccountId32 | undefined)
    start?: (number | undefined)
    end?: (number | undefined)
    initialWeight?: (number | undefined)
    finalWeight?: (number | undefined)
    fee?: ([number, number] | undefined)
    feeCollector?: (AccountId32 | undefined)
    repayTarget?: (bigint | undefined)
}

/**
 * Identity pallet declaration.
 */
export const IdentityCall: sts.Type<IdentityCall> = sts.closedEnum(() => {
    return  {
        accept_username: sts.enumStruct({
            username: BoundedVec,
        }),
        add_registrar: sts.enumStruct({
            account: AccountId32,
        }),
        add_sub: sts.enumStruct({
            sub: AccountId32,
            data: Data,
        }),
        add_username_authority: sts.enumStruct({
            authority: AccountId32,
            suffix: sts.bytes(),
            allocation: sts.number(),
        }),
        cancel_request: sts.enumStruct({
            regIndex: sts.number(),
        }),
        clear_identity: sts.unit(),
        kill_identity: sts.enumStruct({
            target: AccountId32,
        }),
        provide_judgement: sts.enumStruct({
            regIndex: sts.number(),
            target: AccountId32,
            judgement: Judgement,
            identity: H256,
        }),
        quit_sub: sts.unit(),
        remove_dangling_username: sts.enumStruct({
            username: BoundedVec,
        }),
        remove_expired_approval: sts.enumStruct({
            username: BoundedVec,
        }),
        remove_sub: sts.enumStruct({
            sub: AccountId32,
        }),
        remove_username_authority: sts.enumStruct({
            authority: AccountId32,
        }),
        rename_sub: sts.enumStruct({
            sub: AccountId32,
            data: Data,
        }),
        request_judgement: sts.enumStruct({
            regIndex: sts.number(),
            maxFee: sts.bigint(),
        }),
        set_account_id: sts.enumStruct({
            index: sts.number(),
            new: AccountId32,
        }),
        set_fee: sts.enumStruct({
            index: sts.number(),
            fee: sts.bigint(),
        }),
        set_fields: sts.enumStruct({
            index: sts.number(),
            fields: sts.bigint(),
        }),
        set_identity: sts.enumStruct({
            info: IdentityInfo,
        }),
        set_primary_username: sts.enumStruct({
            username: BoundedVec,
        }),
        set_subs: sts.enumStruct({
            subs: sts.array(() => sts.tuple(() => [AccountId32, Data])),
        }),
        set_username_for: sts.enumStruct({
            who: AccountId32,
            username: sts.bytes(),
            signature: sts.option(() => MultiSignature),
        }),
    }
})

export const MultiSignature: sts.Type<MultiSignature> = sts.closedEnum(() => {
    return  {
        Ecdsa: sts.bytes(),
        Ed25519: sts.bytes(),
        Sr25519: sts.bytes(),
    }
})

export type MultiSignature = MultiSignature_Ecdsa | MultiSignature_Ed25519 | MultiSignature_Sr25519

export interface MultiSignature_Ecdsa {
    __kind: 'Ecdsa'
    value: Bytes
}

export interface MultiSignature_Ed25519 {
    __kind: 'Ed25519'
    value: Bytes
}

export interface MultiSignature_Sr25519 {
    __kind: 'Sr25519'
    value: Bytes
}

export const IdentityInfo: sts.Type<IdentityInfo> = sts.struct(() => {
    return  {
        additional: sts.array(() => sts.tuple(() => [Data, Data])),
        display: Data,
        legal: Data,
        web: Data,
        riot: Data,
        email: Data,
        pgpFingerprint: sts.option(() => sts.bytes()),
        image: Data,
        twitter: Data,
    }
})

export interface IdentityInfo {
    additional: [Data, Data][]
    display: Data
    legal: Data
    web: Data
    riot: Data
    email: Data
    pgpFingerprint?: (Bytes | undefined)
    image: Data
    twitter: Data
}

export type Data = Data_BlakeTwo256 | Data_Keccak256 | Data_None | Data_Raw0 | Data_Raw1 | Data_Raw10 | Data_Raw11 | Data_Raw12 | Data_Raw13 | Data_Raw14 | Data_Raw15 | Data_Raw16 | Data_Raw17 | Data_Raw18 | Data_Raw19 | Data_Raw2 | Data_Raw20 | Data_Raw21 | Data_Raw22 | Data_Raw23 | Data_Raw24 | Data_Raw25 | Data_Raw26 | Data_Raw27 | Data_Raw28 | Data_Raw29 | Data_Raw3 | Data_Raw30 | Data_Raw31 | Data_Raw32 | Data_Raw4 | Data_Raw5 | Data_Raw6 | Data_Raw7 | Data_Raw8 | Data_Raw9 | Data_Sha256 | Data_ShaThree256

export interface Data_BlakeTwo256 {
    __kind: 'BlakeTwo256'
    value: Bytes
}

export interface Data_Keccak256 {
    __kind: 'Keccak256'
    value: Bytes
}

export interface Data_None {
    __kind: 'None'
}

export interface Data_Raw0 {
    __kind: 'Raw0'
    value: Bytes
}

export interface Data_Raw1 {
    __kind: 'Raw1'
    value: Bytes
}

export interface Data_Raw10 {
    __kind: 'Raw10'
    value: Bytes
}

export interface Data_Raw11 {
    __kind: 'Raw11'
    value: Bytes
}

export interface Data_Raw12 {
    __kind: 'Raw12'
    value: Bytes
}

export interface Data_Raw13 {
    __kind: 'Raw13'
    value: Bytes
}

export interface Data_Raw14 {
    __kind: 'Raw14'
    value: Bytes
}

export interface Data_Raw15 {
    __kind: 'Raw15'
    value: Bytes
}

export interface Data_Raw16 {
    __kind: 'Raw16'
    value: Bytes
}

export interface Data_Raw17 {
    __kind: 'Raw17'
    value: Bytes
}

export interface Data_Raw18 {
    __kind: 'Raw18'
    value: Bytes
}

export interface Data_Raw19 {
    __kind: 'Raw19'
    value: Bytes
}

export interface Data_Raw2 {
    __kind: 'Raw2'
    value: Bytes
}

export interface Data_Raw20 {
    __kind: 'Raw20'
    value: Bytes
}

export interface Data_Raw21 {
    __kind: 'Raw21'
    value: Bytes
}

export interface Data_Raw22 {
    __kind: 'Raw22'
    value: Bytes
}

export interface Data_Raw23 {
    __kind: 'Raw23'
    value: Bytes
}

export interface Data_Raw24 {
    __kind: 'Raw24'
    value: Bytes
}

export interface Data_Raw25 {
    __kind: 'Raw25'
    value: Bytes
}

export interface Data_Raw26 {
    __kind: 'Raw26'
    value: Bytes
}

export interface Data_Raw27 {
    __kind: 'Raw27'
    value: Bytes
}

export interface Data_Raw28 {
    __kind: 'Raw28'
    value: Bytes
}

export interface Data_Raw29 {
    __kind: 'Raw29'
    value: Bytes
}

export interface Data_Raw3 {
    __kind: 'Raw3'
    value: Bytes
}

export interface Data_Raw30 {
    __kind: 'Raw30'
    value: Bytes
}

export interface Data_Raw31 {
    __kind: 'Raw31'
    value: Bytes
}

export interface Data_Raw32 {
    __kind: 'Raw32'
    value: Bytes
}

export interface Data_Raw4 {
    __kind: 'Raw4'
    value: Bytes
}

export interface Data_Raw5 {
    __kind: 'Raw5'
    value: Bytes
}

export interface Data_Raw6 {
    __kind: 'Raw6'
    value: Bytes
}

export interface Data_Raw7 {
    __kind: 'Raw7'
    value: Bytes
}

export interface Data_Raw8 {
    __kind: 'Raw8'
    value: Bytes
}

export interface Data_Raw9 {
    __kind: 'Raw9'
    value: Bytes
}

export interface Data_Sha256 {
    __kind: 'Sha256'
    value: Bytes
}

export interface Data_ShaThree256 {
    __kind: 'ShaThree256'
    value: Bytes
}

export const Judgement: sts.Type<Judgement> = sts.closedEnum(() => {
    return  {
        Erroneous: sts.unit(),
        FeePaid: sts.bigint(),
        KnownGood: sts.unit(),
        LowQuality: sts.unit(),
        OutOfDate: sts.unit(),
        Reasonable: sts.unit(),
        Unknown: sts.unit(),
    }
})

export type Judgement = Judgement_Erroneous | Judgement_FeePaid | Judgement_KnownGood | Judgement_LowQuality | Judgement_OutOfDate | Judgement_Reasonable | Judgement_Unknown

export interface Judgement_Erroneous {
    __kind: 'Erroneous'
}

export interface Judgement_FeePaid {
    __kind: 'FeePaid'
    value: bigint
}

export interface Judgement_KnownGood {
    __kind: 'KnownGood'
}

export interface Judgement_LowQuality {
    __kind: 'LowQuality'
}

export interface Judgement_OutOfDate {
    __kind: 'OutOfDate'
}

export interface Judgement_Reasonable {
    __kind: 'Reasonable'
}

export interface Judgement_Unknown {
    __kind: 'Unknown'
}

export const Data: sts.Type<Data> = sts.closedEnum(() => {
    return  {
        BlakeTwo256: sts.bytes(),
        Keccak256: sts.bytes(),
        None: sts.unit(),
        Raw0: sts.bytes(),
        Raw1: sts.bytes(),
        Raw10: sts.bytes(),
        Raw11: sts.bytes(),
        Raw12: sts.bytes(),
        Raw13: sts.bytes(),
        Raw14: sts.bytes(),
        Raw15: sts.bytes(),
        Raw16: sts.bytes(),
        Raw17: sts.bytes(),
        Raw18: sts.bytes(),
        Raw19: sts.bytes(),
        Raw2: sts.bytes(),
        Raw20: sts.bytes(),
        Raw21: sts.bytes(),
        Raw22: sts.bytes(),
        Raw23: sts.bytes(),
        Raw24: sts.bytes(),
        Raw25: sts.bytes(),
        Raw26: sts.bytes(),
        Raw27: sts.bytes(),
        Raw28: sts.bytes(),
        Raw29: sts.bytes(),
        Raw3: sts.bytes(),
        Raw30: sts.bytes(),
        Raw31: sts.bytes(),
        Raw32: sts.bytes(),
        Raw4: sts.bytes(),
        Raw5: sts.bytes(),
        Raw6: sts.bytes(),
        Raw7: sts.bytes(),
        Raw8: sts.bytes(),
        Raw9: sts.bytes(),
        Sha256: sts.bytes(),
        ShaThree256: sts.bytes(),
    }
})

export const BoundedVec = sts.bytes()

/**
 * Identity pallet declaration.
 */
export type IdentityCall = IdentityCall_accept_username | IdentityCall_add_registrar | IdentityCall_add_sub | IdentityCall_add_username_authority | IdentityCall_cancel_request | IdentityCall_clear_identity | IdentityCall_kill_identity | IdentityCall_provide_judgement | IdentityCall_quit_sub | IdentityCall_remove_dangling_username | IdentityCall_remove_expired_approval | IdentityCall_remove_sub | IdentityCall_remove_username_authority | IdentityCall_rename_sub | IdentityCall_request_judgement | IdentityCall_set_account_id | IdentityCall_set_fee | IdentityCall_set_fields | IdentityCall_set_identity | IdentityCall_set_primary_username | IdentityCall_set_subs | IdentityCall_set_username_for

/**
 * Accept a given username that an `authority` granted. The call must include the full
 * username, as in `username.suffix`.
 */
export interface IdentityCall_accept_username {
    __kind: 'accept_username'
    username: BoundedVec
}

/**
 * Add a registrar to the system.
 * 
 * The dispatch origin for this call must be `T::RegistrarOrigin`.
 * 
 * - `account`: the account of the registrar.
 * 
 * Emits `RegistrarAdded` if successful.
 */
export interface IdentityCall_add_registrar {
    __kind: 'add_registrar'
    account: AccountId32
}

/**
 * Add the given account to the sender's subs.
 * 
 * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
 * to the sender.
 * 
 * The dispatch origin for this call must be _Signed_ and the sender must have a registered
 * sub identity of `sub`.
 */
export interface IdentityCall_add_sub {
    __kind: 'add_sub'
    sub: AccountId32
    data: Data
}

/**
 * Add an `AccountId` with permission to grant usernames with a given `suffix` appended.
 * 
 * The authority can grant up to `allocation` usernames. To top up their allocation, they
 * should just issue (or request via governance) a new `add_username_authority` call.
 */
export interface IdentityCall_add_username_authority {
    __kind: 'add_username_authority'
    authority: AccountId32
    suffix: Bytes
    allocation: number
}

/**
 * Cancel a previous request.
 * 
 * Payment: A previously reserved deposit is returned on success.
 * 
 * The dispatch origin for this call must be _Signed_ and the sender must have a
 * registered identity.
 * 
 * - `reg_index`: The index of the registrar whose judgement is no longer requested.
 * 
 * Emits `JudgementUnrequested` if successful.
 */
export interface IdentityCall_cancel_request {
    __kind: 'cancel_request'
    regIndex: number
}

/**
 * Clear an account's identity info and all sub-accounts and return all deposits.
 * 
 * Payment: All reserved balances on the account are returned.
 * 
 * The dispatch origin for this call must be _Signed_ and the sender must have a registered
 * identity.
 * 
 * Emits `IdentityCleared` if successful.
 */
export interface IdentityCall_clear_identity {
    __kind: 'clear_identity'
}

/**
 * Remove an account's identity and sub-account information and slash the deposits.
 * 
 * Payment: Reserved balances from `set_subs` and `set_identity` are slashed and handled by
 * `Slash`. Verification request deposits are not returned; they should be cancelled
 * manually using `cancel_request`.
 * 
 * The dispatch origin for this call must match `T::ForceOrigin`.
 * 
 * - `target`: the account whose identity the judgement is upon. This must be an account
 *   with a registered identity.
 * 
 * Emits `IdentityKilled` if successful.
 */
export interface IdentityCall_kill_identity {
    __kind: 'kill_identity'
    target: AccountId32
}

/**
 * Provide a judgement for an account's identity.
 * 
 * The dispatch origin for this call must be _Signed_ and the sender must be the account
 * of the registrar whose index is `reg_index`.
 * 
 * - `reg_index`: the index of the registrar whose judgement is being made.
 * - `target`: the account whose identity the judgement is upon. This must be an account
 *   with a registered identity.
 * - `judgement`: the judgement of the registrar of index `reg_index` about `target`.
 * - `identity`: The hash of the [`IdentityInformationProvider`] for that the judgement is
 *   provided.
 * 
 * Note: Judgements do not apply to a username.
 * 
 * Emits `JudgementGiven` if successful.
 */
export interface IdentityCall_provide_judgement {
    __kind: 'provide_judgement'
    regIndex: number
    target: AccountId32
    judgement: Judgement
    identity: H256
}

/**
 * Remove the sender as a sub-account.
 * 
 * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
 * to the sender (*not* the original depositor).
 * 
 * The dispatch origin for this call must be _Signed_ and the sender must have a registered
 * super-identity.
 * 
 * NOTE: This should not normally be used, but is provided in the case that the non-
 * controller of an account is maliciously registered as a sub-account.
 */
export interface IdentityCall_quit_sub {
    __kind: 'quit_sub'
}

/**
 * Remove a username that corresponds to an account with no identity. Exists when a user
 * gets a username but then calls `clear_identity`.
 */
export interface IdentityCall_remove_dangling_username {
    __kind: 'remove_dangling_username'
    username: BoundedVec
}

/**
 * Remove an expired username approval. The username was approved by an authority but never
 * accepted by the user and must now be beyond its expiration. The call must include the
 * full username, as in `username.suffix`.
 */
export interface IdentityCall_remove_expired_approval {
    __kind: 'remove_expired_approval'
    username: BoundedVec
}

/**
 * Remove the given account from the sender's subs.
 * 
 * Payment: Balance reserved by a previous `set_subs` call for one sub will be repatriated
 * to the sender.
 * 
 * The dispatch origin for this call must be _Signed_ and the sender must have a registered
 * sub identity of `sub`.
 */
export interface IdentityCall_remove_sub {
    __kind: 'remove_sub'
    sub: AccountId32
}

/**
 * Remove `authority` from the username authorities.
 */
export interface IdentityCall_remove_username_authority {
    __kind: 'remove_username_authority'
    authority: AccountId32
}

/**
 * Alter the associated name of the given sub-account.
 * 
 * The dispatch origin for this call must be _Signed_ and the sender must have a registered
 * sub identity of `sub`.
 */
export interface IdentityCall_rename_sub {
    __kind: 'rename_sub'
    sub: AccountId32
    data: Data
}

/**
 * Request a judgement from a registrar.
 * 
 * Payment: At most `max_fee` will be reserved for payment to the registrar if judgement
 * given.
 * 
 * The dispatch origin for this call must be _Signed_ and the sender must have a
 * registered identity.
 * 
 * - `reg_index`: The index of the registrar whose judgement is requested.
 * - `max_fee`: The maximum fee that may be paid. This should just be auto-populated as:
 * 
 * ```nocompile
 * Self::registrars().get(reg_index).unwrap().fee
 * ```
 * 
 * Emits `JudgementRequested` if successful.
 */
export interface IdentityCall_request_judgement {
    __kind: 'request_judgement'
    regIndex: number
    maxFee: bigint
}

/**
 * Change the account associated with a registrar.
 * 
 * The dispatch origin for this call must be _Signed_ and the sender must be the account
 * of the registrar whose index is `index`.
 * 
 * - `index`: the index of the registrar whose fee is to be set.
 * - `new`: the new account ID.
 */
export interface IdentityCall_set_account_id {
    __kind: 'set_account_id'
    index: number
    new: AccountId32
}

/**
 * Set the fee required for a judgement to be requested from a registrar.
 * 
 * The dispatch origin for this call must be _Signed_ and the sender must be the account
 * of the registrar whose index is `index`.
 * 
 * - `index`: the index of the registrar whose fee is to be set.
 * - `fee`: the new fee.
 */
export interface IdentityCall_set_fee {
    __kind: 'set_fee'
    index: number
    fee: bigint
}

/**
 * Set the field information for a registrar.
 * 
 * The dispatch origin for this call must be _Signed_ and the sender must be the account
 * of the registrar whose index is `index`.
 * 
 * - `index`: the index of the registrar whose fee is to be set.
 * - `fields`: the fields that the registrar concerns themselves with.
 */
export interface IdentityCall_set_fields {
    __kind: 'set_fields'
    index: number
    fields: bigint
}

/**
 * Set an account's identity information and reserve the appropriate deposit.
 * 
 * If the account already has identity information, the deposit is taken as part payment
 * for the new deposit.
 * 
 * The dispatch origin for this call must be _Signed_.
 * 
 * - `info`: The identity information.
 * 
 * Emits `IdentitySet` if successful.
 */
export interface IdentityCall_set_identity {
    __kind: 'set_identity'
    info: IdentityInfo
}

/**
 * Set a given username as the primary. The username should include the suffix.
 */
export interface IdentityCall_set_primary_username {
    __kind: 'set_primary_username'
    username: BoundedVec
}

/**
 * Set the sub-accounts of the sender.
 * 
 * Payment: Any aggregate balance reserved by previous `set_subs` calls will be returned
 * and an amount `SubAccountDeposit` will be reserved for each item in `subs`.
 * 
 * The dispatch origin for this call must be _Signed_ and the sender must have a registered
 * identity.
 * 
 * - `subs`: The identity's (new) sub-accounts.
 */
export interface IdentityCall_set_subs {
    __kind: 'set_subs'
    subs: [AccountId32, Data][]
}

/**
 * Set the username for `who`. Must be called by a username authority.
 * 
 * The authority must have an `allocation`. Users can either pre-sign their usernames or
 * accept them later.
 * 
 * Usernames must:
 *   - Only contain lowercase ASCII characters or digits.
 *   - When combined with the suffix of the issuing authority be _less than_ the
 *     `MaxUsernameLength`.
 */
export interface IdentityCall_set_username_for {
    __kind: 'set_username_for'
    who: AccountId32
    username: Bytes
    signature?: (MultiSignature | undefined)
}

export type BoundedVec = Bytes

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const GenesisHistoryCall: sts.Type<GenesisHistoryCall> = sts.closedEnum(() => {
    return  {
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type GenesisHistoryCall = never

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const EthereumCall: sts.Type<EthereumCall> = sts.closedEnum(() => {
    return  {
        transact: sts.enumStruct({
            transaction: TransactionV2,
        }),
    }
})

export const TransactionV2: sts.Type<TransactionV2> = sts.closedEnum(() => {
    return  {
        EIP1559: EIP1559Transaction,
        EIP2930: EIP2930Transaction,
        Legacy: LegacyTransaction,
    }
})

export const LegacyTransaction: sts.Type<LegacyTransaction> = sts.struct(() => {
    return  {
        nonce: sts.bigint(),
        gasPrice: sts.bigint(),
        gasLimit: sts.bigint(),
        action: TransactionAction,
        value: sts.bigint(),
        input: sts.bytes(),
        signature: TransactionSignature,
    }
})

export const TransactionSignature: sts.Type<TransactionSignature> = sts.struct(() => {
    return  {
        v: TransactionRecoveryId,
        r: H256,
        s: H256,
    }
})

export const TransactionRecoveryId = sts.bigint()

export interface TransactionSignature {
    v: TransactionRecoveryId
    r: H256
    s: H256
}

export type TransactionRecoveryId = bigint

export const TransactionAction: sts.Type<TransactionAction> = sts.closedEnum(() => {
    return  {
        Call: H160,
        Create: sts.unit(),
    }
})

export type TransactionAction = TransactionAction_Call | TransactionAction_Create

export interface TransactionAction_Call {
    __kind: 'Call'
    value: H160
}

export interface TransactionAction_Create {
    __kind: 'Create'
}

export interface LegacyTransaction {
    nonce: bigint
    gasPrice: bigint
    gasLimit: bigint
    action: TransactionAction
    value: bigint
    input: Bytes
    signature: TransactionSignature
}

export const EIP2930Transaction: sts.Type<EIP2930Transaction> = sts.struct(() => {
    return  {
        chainId: sts.bigint(),
        nonce: sts.bigint(),
        gasPrice: sts.bigint(),
        gasLimit: sts.bigint(),
        action: TransactionAction,
        value: sts.bigint(),
        input: sts.bytes(),
        accessList: sts.array(() => AccessListItem),
        oddYParity: sts.boolean(),
        r: H256,
        s: H256,
    }
})

export const AccessListItem: sts.Type<AccessListItem> = sts.struct(() => {
    return  {
        address: H160,
        storageKeys: sts.array(() => H256),
    }
})

export interface AccessListItem {
    address: H160
    storageKeys: H256[]
}

export interface EIP2930Transaction {
    chainId: bigint
    nonce: bigint
    gasPrice: bigint
    gasLimit: bigint
    action: TransactionAction
    value: bigint
    input: Bytes
    accessList: AccessListItem[]
    oddYParity: boolean
    r: H256
    s: H256
}

export const EIP1559Transaction: sts.Type<EIP1559Transaction> = sts.struct(() => {
    return  {
        chainId: sts.bigint(),
        nonce: sts.bigint(),
        maxPriorityFeePerGas: sts.bigint(),
        maxFeePerGas: sts.bigint(),
        gasLimit: sts.bigint(),
        action: TransactionAction,
        value: sts.bigint(),
        input: sts.bytes(),
        accessList: sts.array(() => AccessListItem),
        oddYParity: sts.boolean(),
        r: H256,
        s: H256,
    }
})

export interface EIP1559Transaction {
    chainId: bigint
    nonce: bigint
    maxPriorityFeePerGas: bigint
    maxFeePerGas: bigint
    gasLimit: bigint
    action: TransactionAction
    value: bigint
    input: Bytes
    accessList: AccessListItem[]
    oddYParity: boolean
    r: H256
    s: H256
}

export type TransactionV2 = TransactionV2_EIP1559 | TransactionV2_EIP2930 | TransactionV2_Legacy

export interface TransactionV2_EIP1559 {
    __kind: 'EIP1559'
    value: EIP1559Transaction
}

export interface TransactionV2_EIP2930 {
    __kind: 'EIP2930'
    value: EIP2930Transaction
}

export interface TransactionV2_Legacy {
    __kind: 'Legacy'
    value: LegacyTransaction
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type EthereumCall = EthereumCall_transact

/**
 * Transact an Ethereum transaction.
 */
export interface EthereumCall_transact {
    __kind: 'transact'
    transaction: TransactionV2
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const EmaOracleCall: sts.Type<EmaOracleCall> = sts.closedEnum(() => {
    return  {
        add_oracle: sts.enumStruct({
            source: sts.bytes(),
            assets: sts.tuple(() => [sts.number(), sts.number()]),
        }),
        remove_oracle: sts.enumStruct({
            source: sts.bytes(),
            assets: sts.tuple(() => [sts.number(), sts.number()]),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type EmaOracleCall = EmaOracleCall_add_oracle | EmaOracleCall_remove_oracle

export interface EmaOracleCall_add_oracle {
    __kind: 'add_oracle'
    source: Bytes
    assets: [number, number]
}

export interface EmaOracleCall_remove_oracle {
    __kind: 'remove_oracle'
    source: Bytes
    assets: [number, number]
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const ElectionsCall: sts.Type<ElectionsCall> = sts.closedEnum(() => {
    return  {
        clean_defunct_voters: sts.enumStruct({
            numVoters: sts.number(),
            numDefunct: sts.number(),
        }),
        remove_member: sts.enumStruct({
            who: AccountId32,
            slashBond: sts.boolean(),
            rerunElection: sts.boolean(),
        }),
        remove_voter: sts.unit(),
        renounce_candidacy: sts.enumStruct({
            renouncing: Renouncing,
        }),
        submit_candidacy: sts.enumStruct({
            candidateCount: sts.number(),
        }),
        vote: sts.enumStruct({
            votes: sts.array(() => AccountId32),
            value: sts.bigint(),
        }),
    }
})

export const Renouncing: sts.Type<Renouncing> = sts.closedEnum(() => {
    return  {
        Candidate: sts.number(),
        Member: sts.unit(),
        RunnerUp: sts.unit(),
    }
})

export type Renouncing = Renouncing_Candidate | Renouncing_Member | Renouncing_RunnerUp

export interface Renouncing_Candidate {
    __kind: 'Candidate'
    value: number
}

export interface Renouncing_Member {
    __kind: 'Member'
}

export interface Renouncing_RunnerUp {
    __kind: 'RunnerUp'
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type ElectionsCall = ElectionsCall_clean_defunct_voters | ElectionsCall_remove_member | ElectionsCall_remove_voter | ElectionsCall_renounce_candidacy | ElectionsCall_submit_candidacy | ElectionsCall_vote

/**
 * Clean all voters who are defunct (i.e. they do not serve any purpose at all). The
 * deposit of the removed voters are returned.
 * 
 * This is an root function to be used only for cleaning the state.
 * 
 * The dispatch origin of this call must be root.
 * 
 * ## Complexity
 * - Check is_defunct_voter() details.
 */
export interface ElectionsCall_clean_defunct_voters {
    __kind: 'clean_defunct_voters'
    numVoters: number
    numDefunct: number
}

/**
 * Remove a particular member from the set. This is effective immediately and the bond of
 * the outgoing member is slashed.
 * 
 * If a runner-up is available, then the best runner-up will be removed and replaces the
 * outgoing member. Otherwise, if `rerun_election` is `true`, a new phragmen election is
 * started, else, nothing happens.
 * 
 * If `slash_bond` is set to true, the bond of the member being removed is slashed. Else,
 * it is returned.
 * 
 * The dispatch origin of this call must be root.
 * 
 * Note that this does not affect the designated block number of the next election.
 * 
 * ## Complexity
 * - Check details of remove_and_replace_member() and do_phragmen().
 */
export interface ElectionsCall_remove_member {
    __kind: 'remove_member'
    who: AccountId32
    slashBond: boolean
    rerunElection: boolean
}

/**
 * Remove `origin` as a voter.
 * 
 * This removes the lock and returns the deposit.
 * 
 * The dispatch origin of this call must be signed and be a voter.
 */
export interface ElectionsCall_remove_voter {
    __kind: 'remove_voter'
}

/**
 * Renounce one's intention to be a candidate for the next election round. 3 potential
 * outcomes exist:
 * 
 * - `origin` is a candidate and not elected in any set. In this case, the deposit is
 *   unreserved, returned and origin is removed as a candidate.
 * - `origin` is a current runner-up. In this case, the deposit is unreserved, returned and
 *   origin is removed as a runner-up.
 * - `origin` is a current member. In this case, the deposit is unreserved and origin is
 *   removed as a member, consequently not being a candidate for the next round anymore.
 *   Similar to [`remove_member`](Self::remove_member), if replacement runners exists, they
 *   are immediately used. If the prime is renouncing, then no prime will exist until the
 *   next round.
 * 
 * The dispatch origin of this call must be signed, and have one of the above roles.
 * The type of renouncing must be provided as witness data.
 * 
 * ## Complexity
 *   - Renouncing::Candidate(count): O(count + log(count))
 *   - Renouncing::Member: O(1)
 *   - Renouncing::RunnerUp: O(1)
 */
export interface ElectionsCall_renounce_candidacy {
    __kind: 'renounce_candidacy'
    renouncing: Renouncing
}

/**
 * Submit oneself for candidacy. A fixed amount of deposit is recorded.
 * 
 * All candidates are wiped at the end of the term. They either become a member/runner-up,
 * or leave the system while their deposit is slashed.
 * 
 * The dispatch origin of this call must be signed.
 * 
 * ### Warning
 * 
 * Even if a candidate ends up being a member, they must call [`Call::renounce_candidacy`]
 * to get their deposit back. Losing the spot in an election will always lead to a slash.
 * 
 * The number of current candidates must be provided as witness data.
 * ## Complexity
 * O(C + log(C)) where C is candidate_count.
 */
export interface ElectionsCall_submit_candidacy {
    __kind: 'submit_candidacy'
    candidateCount: number
}

/**
 * Vote for a set of candidates for the upcoming round of election. This can be called to
 * set the initial votes, or update already existing votes.
 * 
 * Upon initial voting, `value` units of `who`'s balance is locked and a deposit amount is
 * reserved. The deposit is based on the number of votes and can be updated over time.
 * 
 * The `votes` should:
 *   - not be empty.
 *   - be less than the number of possible candidates. Note that all current members and
 *     runners-up are also automatically candidates for the next round.
 * 
 * If `value` is more than `who`'s free balance, then the maximum of the two is used.
 * 
 * The dispatch origin of this call must be signed.
 * 
 * ### Warning
 * 
 * It is the responsibility of the caller to **NOT** place all of their balance into the
 * lock and keep some for further operations.
 */
export interface ElectionsCall_vote {
    __kind: 'vote'
    votes: AccountId32[]
    value: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const EVMAccountsCall: sts.Type<EVMAccountsCall> = sts.closedEnum(() => {
    return  {
        add_contract_deployer: sts.enumStruct({
            address: H160,
        }),
        approve_contract: sts.enumStruct({
            address: H160,
        }),
        bind_evm_address: sts.unit(),
        disapprove_contract: sts.enumStruct({
            address: H160,
        }),
        remove_contract_deployer: sts.enumStruct({
            address: H160,
        }),
        renounce_contract_deployer: sts.unit(),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type EVMAccountsCall = EVMAccountsCall_add_contract_deployer | EVMAccountsCall_approve_contract | EVMAccountsCall_bind_evm_address | EVMAccountsCall_disapprove_contract | EVMAccountsCall_remove_contract_deployer | EVMAccountsCall_renounce_contract_deployer

/**
 * Adds an EVM address to the list of addresses that are allowed to deploy smart contracts.
 * 
 * Parameters:
 * - `origin`: Substrate account whitelisting an address. Must be `ControllerOrigin`.
 * - `address`: EVM address that is whitelisted
 * 
 * Emits `DeployerAdded` event when successful.
 */
export interface EVMAccountsCall_add_contract_deployer {
    __kind: 'add_contract_deployer'
    address: H160
}

/**
 * Adds address of the contract to the list of approved contracts to manage balances.
 * 
 * Effectively giving it allowance to for any balances and tokens.
 * 
 * Parameters:
 * - `origin`:  Must be `ControllerOrigin`.
 * - `address`: Contract address that will be approved
 * 
 * Emits `ContractApproved` event when successful.
 */
export interface EVMAccountsCall_approve_contract {
    __kind: 'approve_contract'
    address: H160
}

/**
 * Binds a Substrate address to EVM address.
 * After binding, the EVM is able to convert an EVM address to the original Substrate address.
 * Without binding, the EVM converts an EVM address to a truncated Substrate address, which doesn't correspond
 * to the origin address.
 * 
 * Binding an address is not necessary for interacting with the EVM.
 * 
 * Parameters:
 * - `origin`: Substrate account binding an address
 * 
 * Emits `EvmAccountBound` event when successful.
 */
export interface EVMAccountsCall_bind_evm_address {
    __kind: 'bind_evm_address'
}

/**
 * Removes address of the contract from the list of approved contracts to manage balances.
 * 
 * Parameters:
 * - `origin`:  Must be `ControllerOrigin`.
 * - `address`: Contract address that will be disapproved
 * 
 * Emits `ContractDisapproved` event when successful.
 */
export interface EVMAccountsCall_disapprove_contract {
    __kind: 'disapprove_contract'
    address: H160
}

/**
 * Removes an EVM address from the list of addresses that are allowed to deploy smart contracts.
 * 
 * Parameters:
 * - `origin`: Substrate account removing the EVM address from the whitelist. Must be `ControllerOrigin`.
 * - `address`: EVM address that is removed from the whitelist
 * 
 * Emits `DeployerRemoved` event when successful.
 */
export interface EVMAccountsCall_remove_contract_deployer {
    __kind: 'remove_contract_deployer'
    address: H160
}

/**
 * Removes the account's EVM address from the list of addresses that are allowed to deploy smart contracts.
 * Based on the best practices, this extrinsic can be called by any whitelisted account to renounce their own permission.
 * 
 * Parameters:
 * - `origin`: Substrate account removing their EVM address from the whitelist.
 * 
 * Emits `DeployerRemoved` event when successful.
 */
export interface EVMAccountsCall_renounce_contract_deployer {
    __kind: 'renounce_contract_deployer'
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const EVMCall: sts.Type<EVMCall> = sts.closedEnum(() => {
    return  {
        call: sts.enumStruct({
            source: H160,
            target: H160,
            input: sts.bytes(),
            value: sts.bigint(),
            gasLimit: sts.bigint(),
            maxFeePerGas: sts.bigint(),
            maxPriorityFeePerGas: sts.option(() => sts.bigint()),
            nonce: sts.option(() => sts.bigint()),
            accessList: sts.array(() => sts.tuple(() => [H160, sts.array(() => H256)])),
        }),
        create: sts.enumStruct({
            source: H160,
            init: sts.bytes(),
            value: sts.bigint(),
            gasLimit: sts.bigint(),
            maxFeePerGas: sts.bigint(),
            maxPriorityFeePerGas: sts.option(() => sts.bigint()),
            nonce: sts.option(() => sts.bigint()),
            accessList: sts.array(() => sts.tuple(() => [H160, sts.array(() => H256)])),
        }),
        create2: sts.enumStruct({
            source: H160,
            init: sts.bytes(),
            salt: H256,
            value: sts.bigint(),
            gasLimit: sts.bigint(),
            maxFeePerGas: sts.bigint(),
            maxPriorityFeePerGas: sts.option(() => sts.bigint()),
            nonce: sts.option(() => sts.bigint()),
            accessList: sts.array(() => sts.tuple(() => [H160, sts.array(() => H256)])),
        }),
        withdraw: sts.enumStruct({
            address: H160,
            value: sts.bigint(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type EVMCall = EVMCall_call | EVMCall_create | EVMCall_create2 | EVMCall_withdraw

/**
 * Issue an EVM call operation. This is similar to a message call transaction in Ethereum.
 */
export interface EVMCall_call {
    __kind: 'call'
    source: H160
    target: H160
    input: Bytes
    value: bigint
    gasLimit: bigint
    maxFeePerGas: bigint
    maxPriorityFeePerGas?: (bigint | undefined)
    nonce?: (bigint | undefined)
    accessList: [H160, H256[]][]
}

/**
 * Issue an EVM create operation. This is similar to a contract creation transaction in
 * Ethereum.
 */
export interface EVMCall_create {
    __kind: 'create'
    source: H160
    init: Bytes
    value: bigint
    gasLimit: bigint
    maxFeePerGas: bigint
    maxPriorityFeePerGas?: (bigint | undefined)
    nonce?: (bigint | undefined)
    accessList: [H160, H256[]][]
}

/**
 * Issue an EVM create2 operation.
 */
export interface EVMCall_create2 {
    __kind: 'create2'
    source: H160
    init: Bytes
    salt: H256
    value: bigint
    gasLimit: bigint
    maxFeePerGas: bigint
    maxPriorityFeePerGas?: (bigint | undefined)
    nonce?: (bigint | undefined)
    accessList: [H160, H256[]][]
}

/**
 * Withdraw balance from EVM into currency/balances pallet.
 */
export interface EVMCall_withdraw {
    __kind: 'withdraw'
    address: H160
    value: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const DynamicFeesCall: sts.Type<DynamicFeesCall> = sts.closedEnum(() => {
    return  {
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type DynamicFeesCall = never

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const DusterCall: sts.Type<DusterCall> = sts.closedEnum(() => {
    return  {
        add_nondustable_account: sts.enumStruct({
            account: AccountId32,
        }),
        dust_account: sts.enumStruct({
            account: AccountId32,
            currencyId: sts.number(),
        }),
        remove_nondustable_account: sts.enumStruct({
            account: AccountId32,
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type DusterCall = DusterCall_add_nondustable_account | DusterCall_dust_account | DusterCall_remove_nondustable_account

/**
 * Add account to list of non-dustable account. Account whihc are excluded from udsting.
 * If such account should be dusted - `AccountBlacklisted` error is returned.
 * Only root can perform this action.
 */
export interface DusterCall_add_nondustable_account {
    __kind: 'add_nondustable_account'
    account: AccountId32
}

/**
 * Dust specified account.
 * IF account balance is < min. existential deposit of given currency, and account is allowed to
 * be dusted, the remaining balance is transferred to selected account (usually treasury).
 * 
 * Caller is rewarded with chosen reward in native currency.
 */
export interface DusterCall_dust_account {
    __kind: 'dust_account'
    account: AccountId32
    currencyId: number
}

/**
 * Remove account from list of non-dustable accounts. That means account can be dusted again.
 */
export interface DusterCall_remove_nondustable_account {
    __kind: 'remove_nondustable_account'
    account: AccountId32
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const DemocracyCall: sts.Type<DemocracyCall> = sts.closedEnum(() => {
    return  {
        blacklist: sts.enumStruct({
            proposalHash: H256,
            maybeRefIndex: sts.option(() => sts.number()),
        }),
        cancel_proposal: sts.enumStruct({
            propIndex: sts.number(),
        }),
        cancel_referendum: sts.enumStruct({
            refIndex: sts.number(),
        }),
        clear_public_proposals: sts.unit(),
        delegate: sts.enumStruct({
            to: AccountId32,
            conviction: Conviction,
            balance: sts.bigint(),
        }),
        emergency_cancel: sts.enumStruct({
            refIndex: sts.number(),
        }),
        external_propose: sts.enumStruct({
            proposal: Bounded,
        }),
        external_propose_default: sts.enumStruct({
            proposal: Bounded,
        }),
        external_propose_majority: sts.enumStruct({
            proposal: Bounded,
        }),
        fast_track: sts.enumStruct({
            proposalHash: H256,
            votingPeriod: sts.number(),
            delay: sts.number(),
        }),
        force_remove_vote: sts.enumStruct({
            target: AccountId32,
            index: sts.number(),
        }),
        propose: sts.enumStruct({
            proposal: Bounded,
            value: sts.bigint(),
        }),
        remove_other_vote: sts.enumStruct({
            target: AccountId32,
            index: sts.number(),
        }),
        remove_vote: sts.enumStruct({
            index: sts.number(),
        }),
        second: sts.enumStruct({
            proposal: sts.number(),
        }),
        set_metadata: sts.enumStruct({
            owner: MetadataOwner,
            maybeHash: sts.option(() => H256),
        }),
        undelegate: sts.unit(),
        unlock: sts.enumStruct({
            target: AccountId32,
        }),
        veto_external: sts.enumStruct({
            proposalHash: H256,
        }),
        vote: sts.enumStruct({
            refIndex: sts.number(),
            vote: AccountVote,
        }),
    }
})

export const AccountVote: sts.Type<AccountVote> = sts.closedEnum(() => {
    return  {
        Split: sts.enumStruct({
            aye: sts.bigint(),
            nay: sts.bigint(),
        }),
        Standard: sts.enumStruct({
            vote: sts.number(),
            balance: sts.bigint(),
        }),
    }
})

export type AccountVote = AccountVote_Split | AccountVote_Standard

export interface AccountVote_Split {
    __kind: 'Split'
    aye: bigint
    nay: bigint
}

export interface AccountVote_Standard {
    __kind: 'Standard'
    vote: number
    balance: bigint
}

export const MetadataOwner: sts.Type<MetadataOwner> = sts.closedEnum(() => {
    return  {
        External: sts.unit(),
        Proposal: sts.number(),
        Referendum: sts.number(),
    }
})

export type MetadataOwner = MetadataOwner_External | MetadataOwner_Proposal | MetadataOwner_Referendum

export interface MetadataOwner_External {
    __kind: 'External'
}

export interface MetadataOwner_Proposal {
    __kind: 'Proposal'
    value: number
}

export interface MetadataOwner_Referendum {
    __kind: 'Referendum'
    value: number
}

export const Bounded: sts.Type<Bounded> = sts.closedEnum(() => {
    return  {
        Inline: sts.bytes(),
        Legacy: sts.enumStruct({
            hash: H256,
        }),
        Lookup: sts.enumStruct({
            hash: H256,
            len: sts.number(),
        }),
    }
})

export type Bounded = Bounded_Inline | Bounded_Legacy | Bounded_Lookup

export interface Bounded_Inline {
    __kind: 'Inline'
    value: Bytes
}

export interface Bounded_Legacy {
    __kind: 'Legacy'
    hash: H256
}

export interface Bounded_Lookup {
    __kind: 'Lookup'
    hash: H256
    len: number
}

export const Conviction: sts.Type<Conviction> = sts.closedEnum(() => {
    return  {
        Locked1x: sts.unit(),
        Locked2x: sts.unit(),
        Locked3x: sts.unit(),
        Locked4x: sts.unit(),
        Locked5x: sts.unit(),
        Locked6x: sts.unit(),
        None: sts.unit(),
    }
})

export type Conviction = Conviction_Locked1x | Conviction_Locked2x | Conviction_Locked3x | Conviction_Locked4x | Conviction_Locked5x | Conviction_Locked6x | Conviction_None

export interface Conviction_Locked1x {
    __kind: 'Locked1x'
}

export interface Conviction_Locked2x {
    __kind: 'Locked2x'
}

export interface Conviction_Locked3x {
    __kind: 'Locked3x'
}

export interface Conviction_Locked4x {
    __kind: 'Locked4x'
}

export interface Conviction_Locked5x {
    __kind: 'Locked5x'
}

export interface Conviction_Locked6x {
    __kind: 'Locked6x'
}

export interface Conviction_None {
    __kind: 'None'
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type DemocracyCall = DemocracyCall_blacklist | DemocracyCall_cancel_proposal | DemocracyCall_cancel_referendum | DemocracyCall_clear_public_proposals | DemocracyCall_delegate | DemocracyCall_emergency_cancel | DemocracyCall_external_propose | DemocracyCall_external_propose_default | DemocracyCall_external_propose_majority | DemocracyCall_fast_track | DemocracyCall_force_remove_vote | DemocracyCall_propose | DemocracyCall_remove_other_vote | DemocracyCall_remove_vote | DemocracyCall_second | DemocracyCall_set_metadata | DemocracyCall_undelegate | DemocracyCall_unlock | DemocracyCall_veto_external | DemocracyCall_vote

/**
 * Permanently place a proposal into the blacklist. This prevents it from ever being
 * proposed again.
 * 
 * If called on a queued public or external proposal, then this will result in it being
 * removed. If the `ref_index` supplied is an active referendum with the proposal hash,
 * then it will be cancelled.
 * 
 * The dispatch origin of this call must be `BlacklistOrigin`.
 * 
 * - `proposal_hash`: The proposal hash to blacklist permanently.
 * - `ref_index`: An ongoing referendum whose hash is `proposal_hash`, which will be
 * cancelled.
 * 
 * Weight: `O(p)` (though as this is an high-privilege dispatch, we assume it has a
 *   reasonable value).
 */
export interface DemocracyCall_blacklist {
    __kind: 'blacklist'
    proposalHash: H256
    maybeRefIndex?: (number | undefined)
}

/**
 * Remove a proposal.
 * 
 * The dispatch origin of this call must be `CancelProposalOrigin`.
 * 
 * - `prop_index`: The index of the proposal to cancel.
 * 
 * Weight: `O(p)` where `p = PublicProps::<T>::decode_len()`
 */
export interface DemocracyCall_cancel_proposal {
    __kind: 'cancel_proposal'
    propIndex: number
}

/**
 * Remove a referendum.
 * 
 * The dispatch origin of this call must be _Root_.
 * 
 * - `ref_index`: The index of the referendum to cancel.
 * 
 * # Weight: `O(1)`.
 */
export interface DemocracyCall_cancel_referendum {
    __kind: 'cancel_referendum'
    refIndex: number
}

/**
 * Clears all public proposals.
 * 
 * The dispatch origin of this call must be _Root_.
 * 
 * Weight: `O(1)`.
 */
export interface DemocracyCall_clear_public_proposals {
    __kind: 'clear_public_proposals'
}

/**
 * Delegate the voting power (with some given conviction) of the sending account.
 * 
 * The balance delegated is locked for as long as it's delegated, and thereafter for the
 * time appropriate for the conviction's lock period.
 * 
 * The dispatch origin of this call must be _Signed_, and the signing account must either:
 *   - be delegating already; or
 *   - have no voting activity (if there is, then it will need to be removed/consolidated
 *     through `reap_vote` or `unvote`).
 * 
 * - `to`: The account whose voting the `target` account's voting power will follow.
 * - `conviction`: The conviction that will be attached to the delegated votes. When the
 *   account is undelegated, the funds will be locked for the corresponding period.
 * - `balance`: The amount of the account's balance to be used in delegating. This must not
 *   be more than the account's current balance.
 * 
 * Emits `Delegated`.
 * 
 * Weight: `O(R)` where R is the number of referendums the voter delegating to has
 *   voted on. Weight is charged as if maximum votes.
 */
export interface DemocracyCall_delegate {
    __kind: 'delegate'
    to: AccountId32
    conviction: Conviction
    balance: bigint
}

/**
 * Schedule an emergency cancellation of a referendum. Cannot happen twice to the same
 * referendum.
 * 
 * The dispatch origin of this call must be `CancellationOrigin`.
 * 
 * -`ref_index`: The index of the referendum to cancel.
 * 
 * Weight: `O(1)`.
 */
export interface DemocracyCall_emergency_cancel {
    __kind: 'emergency_cancel'
    refIndex: number
}

/**
 * Schedule a referendum to be tabled once it is legal to schedule an external
 * referendum.
 * 
 * The dispatch origin of this call must be `ExternalOrigin`.
 * 
 * - `proposal_hash`: The preimage hash of the proposal.
 */
export interface DemocracyCall_external_propose {
    __kind: 'external_propose'
    proposal: Bounded
}

/**
 * Schedule a negative-turnout-bias referendum to be tabled next once it is legal to
 * schedule an external referendum.
 * 
 * The dispatch of this call must be `ExternalDefaultOrigin`.
 * 
 * - `proposal_hash`: The preimage hash of the proposal.
 * 
 * Unlike `external_propose`, blacklisting has no effect on this and it may replace a
 * pre-scheduled `external_propose` call.
 * 
 * Weight: `O(1)`
 */
export interface DemocracyCall_external_propose_default {
    __kind: 'external_propose_default'
    proposal: Bounded
}

/**
 * Schedule a majority-carries referendum to be tabled next once it is legal to schedule
 * an external referendum.
 * 
 * The dispatch of this call must be `ExternalMajorityOrigin`.
 * 
 * - `proposal_hash`: The preimage hash of the proposal.
 * 
 * Unlike `external_propose`, blacklisting has no effect on this and it may replace a
 * pre-scheduled `external_propose` call.
 * 
 * Weight: `O(1)`
 */
export interface DemocracyCall_external_propose_majority {
    __kind: 'external_propose_majority'
    proposal: Bounded
}

/**
 * Schedule the currently externally-proposed majority-carries referendum to be tabled
 * immediately. If there is no externally-proposed referendum currently, or if there is one
 * but it is not a majority-carries referendum then it fails.
 * 
 * The dispatch of this call must be `FastTrackOrigin`.
 * 
 * - `proposal_hash`: The hash of the current external proposal.
 * - `voting_period`: The period that is allowed for voting on this proposal. Increased to
 * 	Must be always greater than zero.
 * 	For `FastTrackOrigin` must be equal or greater than `FastTrackVotingPeriod`.
 * - `delay`: The number of block after voting has ended in approval and this should be
 *   enacted. This doesn't have a minimum amount.
 * 
 * Emits `Started`.
 * 
 * Weight: `O(1)`
 */
export interface DemocracyCall_fast_track {
    __kind: 'fast_track'
    proposalHash: H256
    votingPeriod: number
    delay: number
}

/**
 * Allow to force remove a vote for a referendum.
 * 
 * Same as `remove_other_vote`, except the scope is overriden by forced flag.
 * The dispatch origin of this call must be `VoteRemovalOrigin`.
 * 
 * Only allowed if the referendum is finished.
 * 
 * The dispatch origin of this call must be _Signed_.
 * 
 * - `target`: The account of the vote to be removed; this account must have voted for
 *   referendum `index`.
 * - `index`: The index of referendum of the vote to be removed.
 * 
 * Weight: `O(R + log R)` where R is the number of referenda that `target` has voted on.
 *   Weight is calculated for the maximum number of vote.
 */
export interface DemocracyCall_force_remove_vote {
    __kind: 'force_remove_vote'
    target: AccountId32
    index: number
}

/**
 * Propose a sensitive action to be taken.
 * 
 * The dispatch origin of this call must be _Signed_ and the sender must
 * have funds to cover the deposit.
 * 
 * - `proposal_hash`: The hash of the proposal preimage.
 * - `value`: The amount of deposit (must be at least `MinimumDeposit`).
 * 
 * Emits `Proposed`.
 */
export interface DemocracyCall_propose {
    __kind: 'propose'
    proposal: Bounded
    value: bigint
}

/**
 * Remove a vote for a referendum.
 * 
 * If the `target` is equal to the signer, then this function is exactly equivalent to
 * `remove_vote`. If not equal to the signer, then the vote must have expired,
 * either because the referendum was cancelled, because the voter lost the referendum or
 * because the conviction period is over.
 * 
 * The dispatch origin of this call must be _Signed_.
 * 
 * - `target`: The account of the vote to be removed; this account must have voted for
 *   referendum `index`.
 * - `index`: The index of referendum of the vote to be removed.
 * 
 * Weight: `O(R + log R)` where R is the number of referenda that `target` has voted on.
 *   Weight is calculated for the maximum number of vote.
 */
export interface DemocracyCall_remove_other_vote {
    __kind: 'remove_other_vote'
    target: AccountId32
    index: number
}

/**
 * Remove a vote for a referendum.
 * 
 * If:
 * - the referendum was cancelled, or
 * - the referendum is ongoing, or
 * - the referendum has ended such that
 *   - the vote of the account was in opposition to the result; or
 *   - there was no conviction to the account's vote; or
 *   - the account made a split vote
 * ...then the vote is removed cleanly and a following call to `unlock` may result in more
 * funds being available.
 * 
 * If, however, the referendum has ended and:
 * - it finished corresponding to the vote of the account, and
 * - the account made a standard vote with conviction, and
 * - the lock period of the conviction is not over
 * ...then the lock will be aggregated into the overall account's lock, which may involve
 * *overlocking* (where the two locks are combined into a single lock that is the maximum
 * of both the amount locked and the time is it locked for).
 * 
 * The dispatch origin of this call must be _Signed_, and the signer must have a vote
 * registered for referendum `index`.
 * 
 * - `index`: The index of referendum of the vote to be removed.
 * 
 * Weight: `O(R + log R)` where R is the number of referenda that `target` has voted on.
 *   Weight is calculated for the maximum number of vote.
 */
export interface DemocracyCall_remove_vote {
    __kind: 'remove_vote'
    index: number
}

/**
 * Signals agreement with a particular proposal.
 * 
 * The dispatch origin of this call must be _Signed_ and the sender
 * must have funds to cover the deposit, equal to the original deposit.
 * 
 * - `proposal`: The index of the proposal to second.
 */
export interface DemocracyCall_second {
    __kind: 'second'
    proposal: number
}

/**
 * Set or clear a metadata of a proposal or a referendum.
 * 
 * Parameters:
 * - `origin`: Must correspond to the `MetadataOwner`.
 *     - `ExternalOrigin` for an external proposal with the `SuperMajorityApprove`
 *       threshold.
 *     - `ExternalDefaultOrigin` for an external proposal with the `SuperMajorityAgainst`
 *       threshold.
 *     - `ExternalMajorityOrigin` for an external proposal with the `SimpleMajority`
 *       threshold.
 *     - `Signed` by a creator for a public proposal.
 *     - `Signed` to clear a metadata for a finished referendum.
 *     - `Root` to set a metadata for an ongoing referendum.
 * - `owner`: an identifier of a metadata owner.
 * - `maybe_hash`: The hash of an on-chain stored preimage. `None` to clear a metadata.
 */
export interface DemocracyCall_set_metadata {
    __kind: 'set_metadata'
    owner: MetadataOwner
    maybeHash?: (H256 | undefined)
}

/**
 * Undelegate the voting power of the sending account.
 * 
 * Tokens may be unlocked following once an amount of time consistent with the lock period
 * of the conviction with which the delegation was issued.
 * 
 * The dispatch origin of this call must be _Signed_ and the signing account must be
 * currently delegating.
 * 
 * Emits `Undelegated`.
 * 
 * Weight: `O(R)` where R is the number of referendums the voter delegating to has
 *   voted on. Weight is charged as if maximum votes.
 */
export interface DemocracyCall_undelegate {
    __kind: 'undelegate'
}

/**
 * Unlock tokens that have an expired lock.
 * 
 * The dispatch origin of this call must be _Signed_.
 * 
 * - `target`: The account to remove the lock on.
 * 
 * Weight: `O(R)` with R number of vote of target.
 */
export interface DemocracyCall_unlock {
    __kind: 'unlock'
    target: AccountId32
}

/**
 * Veto and blacklist the external proposal hash.
 * 
 * The dispatch origin of this call must be `VetoOrigin`.
 * 
 * - `proposal_hash`: The preimage hash of the proposal to veto and blacklist.
 * 
 * Emits `Vetoed`.
 * 
 * Weight: `O(V + log(V))` where V is number of `existing vetoers`
 */
export interface DemocracyCall_veto_external {
    __kind: 'veto_external'
    proposalHash: H256
}

/**
 * Vote in a referendum. If `vote.is_aye()`, the vote is to enact the proposal;
 * otherwise it is a vote to keep the status quo.
 * 
 * The dispatch origin of this call must be _Signed_.
 * 
 * - `ref_index`: The index of the referendum to vote for.
 * - `vote`: The vote configuration.
 */
export interface DemocracyCall_vote {
    __kind: 'vote'
    refIndex: number
    vote: AccountVote
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const DCACall: sts.Type<DCACall> = sts.closedEnum(() => {
    return  {
        schedule: sts.enumStruct({
            schedule: Schedule,
            startExecutionBlock: sts.option(() => sts.number()),
        }),
        terminate: sts.enumStruct({
            scheduleId: sts.number(),
            nextExecutionBlock: sts.option(() => sts.number()),
        }),
    }
})

export const Schedule: sts.Type<Schedule> = sts.struct(() => {
    return  {
        owner: AccountId32,
        period: sts.number(),
        totalAmount: sts.bigint(),
        maxRetries: sts.option(() => sts.number()),
        stabilityThreshold: sts.option(() => Permill),
        slippage: sts.option(() => Permill),
        order: Order,
    }
})

export const Order: sts.Type<Order> = sts.closedEnum(() => {
    return  {
        Buy: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountOut: sts.bigint(),
            maxAmountIn: sts.bigint(),
            route: sts.array(() => Trade),
        }),
        Sell: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            minAmountOut: sts.bigint(),
            route: sts.array(() => Trade),
        }),
    }
})

export type Order = Order_Buy | Order_Sell

export interface Order_Buy {
    __kind: 'Buy'
    assetIn: number
    assetOut: number
    amountOut: bigint
    maxAmountIn: bigint
    route: Trade[]
}

export interface Order_Sell {
    __kind: 'Sell'
    assetIn: number
    assetOut: number
    amountIn: bigint
    minAmountOut: bigint
    route: Trade[]
}

export interface Schedule {
    owner: AccountId32
    period: number
    totalAmount: bigint
    maxRetries?: (number | undefined)
    stabilityThreshold?: (Permill | undefined)
    slippage?: (Permill | undefined)
    order: Order
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type DCACall = DCACall_schedule | DCACall_terminate

/**
 * Creates a new DCA (Dollar-Cost Averaging) schedule and plans the next execution
 * for the specified block.
 * 
 * If the block is not specified, the execution is planned for the next block.
 * If the given block is full, the execution will be planned in the subsequent block.
 * 
 * Once the schedule is created, the specified `total_amount` will be reserved for DCA.
 * The reservation currency will be the `amount_in` currency of the order.
 * 
 * Trades are executed as long as there is budget remaining
 * from the initial `total_amount` allocation.
 * 
 * If a trade fails due to slippage limit or price stability errors, it will be retried.
 * If the number of retries reaches the maximum allowed,
 * the schedule will be terminated permanently.
 * In the case of a successful trade, the retry counter is reset.
 * 
 * Parameters:
 * - `origin`: schedule owner
 * - `schedule`: schedule details
 * - `start_execution_block`: first possible execution block for the schedule
 * 
 * Emits `Scheduled` and `ExecutionPlanned` event when successful.
 * 
 */
export interface DCACall_schedule {
    __kind: 'schedule'
    schedule: Schedule
    startExecutionBlock?: (number | undefined)
}

/**
 * Terminates a DCA schedule and remove it completely from the chain.
 * 
 * This can be called by both schedule owner or the configured `T::TechnicalOrigin`
 * 
 * Parameters:
 * - `origin`: schedule owner
 * - `schedule_id`: schedule id
 * - `next_execution_block`: block number where the schedule is planned.
 * 
 * Emits `Terminated` event when successful.
 * 
 */
export interface DCACall_terminate {
    __kind: 'terminate'
    scheduleId: number
    nextExecutionBlock?: (number | undefined)
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const CurrenciesCall: sts.Type<CurrenciesCall> = sts.closedEnum(() => {
    return  {
        transfer: sts.enumStruct({
            dest: AccountId32,
            currencyId: sts.number(),
            amount: sts.bigint(),
        }),
        transfer_native_currency: sts.enumStruct({
            dest: AccountId32,
            amount: sts.bigint(),
        }),
        update_balance: sts.enumStruct({
            who: AccountId32,
            currencyId: sts.number(),
            amount: sts.bigint(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type CurrenciesCall = CurrenciesCall_transfer | CurrenciesCall_transfer_native_currency | CurrenciesCall_update_balance

/**
 * Transfer some balance to another account under `currency_id`.
 * 
 * The dispatch origin for this call must be `Signed` by the
 * transactor.
 */
export interface CurrenciesCall_transfer {
    __kind: 'transfer'
    dest: AccountId32
    currencyId: number
    amount: bigint
}

/**
 * Transfer some native currency to another account.
 * 
 * The dispatch origin for this call must be `Signed` by the
 * transactor.
 */
export interface CurrenciesCall_transfer_native_currency {
    __kind: 'transfer_native_currency'
    dest: AccountId32
    amount: bigint
}

/**
 * update amount of account `who` under `currency_id`.
 * 
 * The dispatch origin of this call must be _Root_.
 */
export interface CurrenciesCall_update_balance {
    __kind: 'update_balance'
    who: AccountId32
    currencyId: number
    amount: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const CumulusXcmCall: sts.Type<CumulusXcmCall> = sts.closedEnum(() => {
    return  {
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type CumulusXcmCall = never

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const CouncilCall: sts.Type<CouncilCall> = sts.closedEnum(() => {
    return  {
        close: sts.enumStruct({
            proposalHash: H256,
            index: sts.number(),
            proposalWeightBound: Weight,
            lengthBound: sts.number(),
        }),
        disapprove_proposal: sts.enumStruct({
            proposalHash: H256,
        }),
        execute: sts.enumStruct({
            proposal: Call,
            lengthBound: sts.number(),
        }),
        propose: sts.enumStruct({
            threshold: sts.number(),
            proposal: Call,
            lengthBound: sts.number(),
        }),
        set_members: sts.enumStruct({
            newMembers: sts.array(() => AccountId32),
            prime: sts.option(() => AccountId32),
            oldCount: sts.number(),
        }),
        vote: sts.enumStruct({
            proposal: H256,
            index: sts.number(),
            approve: sts.boolean(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type CouncilCall = CouncilCall_close | CouncilCall_disapprove_proposal | CouncilCall_execute | CouncilCall_propose | CouncilCall_set_members | CouncilCall_vote

/**
 * Close a vote that is either approved, disapproved or whose voting period has ended.
 * 
 * May be called by any signed account in order to finish voting and close the proposal.
 * 
 * If called before the end of the voting period it will only close the vote if it is
 * has enough votes to be approved or disapproved.
 * 
 * If called after the end of the voting period abstentions are counted as rejections
 * unless there is a prime member set and the prime member cast an approval.
 * 
 * If the close operation completes successfully with disapproval, the transaction fee will
 * be waived. Otherwise execution of the approved operation will be charged to the caller.
 * 
 * + `proposal_weight_bound`: The maximum amount of weight consumed by executing the closed
 * proposal.
 * + `length_bound`: The upper bound for the length of the proposal in storage. Checked via
 * `storage::read` so it is `size_of::<u32>() == 4` larger than the pure length.
 * 
 * ## Complexity
 * - `O(B + M + P1 + P2)` where:
 *   - `B` is `proposal` size in bytes (length-fee-bounded)
 *   - `M` is members-count (code- and governance-bounded)
 *   - `P1` is the complexity of `proposal` preimage.
 *   - `P2` is proposal-count (code-bounded)
 */
export interface CouncilCall_close {
    __kind: 'close'
    proposalHash: H256
    index: number
    proposalWeightBound: Weight
    lengthBound: number
}

/**
 * Disapprove a proposal, close, and remove it from the system, regardless of its current
 * state.
 * 
 * Must be called by the Root origin.
 * 
 * Parameters:
 * * `proposal_hash`: The hash of the proposal that should be disapproved.
 * 
 * ## Complexity
 * O(P) where P is the number of max proposals
 */
export interface CouncilCall_disapprove_proposal {
    __kind: 'disapprove_proposal'
    proposalHash: H256
}

/**
 * Dispatch a proposal from a member using the `Member` origin.
 * 
 * Origin must be a member of the collective.
 * 
 * ## Complexity:
 * - `O(B + M + P)` where:
 * - `B` is `proposal` size in bytes (length-fee-bounded)
 * - `M` members-count (code-bounded)
 * - `P` complexity of dispatching `proposal`
 */
export interface CouncilCall_execute {
    __kind: 'execute'
    proposal: Call
    lengthBound: number
}

/**
 * Add a new proposal to either be voted on or executed directly.
 * 
 * Requires the sender to be member.
 * 
 * `threshold` determines whether `proposal` is executed directly (`threshold < 2`)
 * or put up for voting.
 * 
 * ## Complexity
 * - `O(B + M + P1)` or `O(B + M + P2)` where:
 *   - `B` is `proposal` size in bytes (length-fee-bounded)
 *   - `M` is members-count (code- and governance-bounded)
 *   - branching is influenced by `threshold` where:
 *     - `P1` is proposal execution complexity (`threshold < 2`)
 *     - `P2` is proposals-count (code-bounded) (`threshold >= 2`)
 */
export interface CouncilCall_propose {
    __kind: 'propose'
    threshold: number
    proposal: Call
    lengthBound: number
}

/**
 * Set the collective's membership.
 * 
 * - `new_members`: The new member list. Be nice to the chain and provide it sorted.
 * - `prime`: The prime member whose vote sets the default.
 * - `old_count`: The upper bound for the previous number of members in storage. Used for
 *   weight estimation.
 * 
 * The dispatch of this call must be `SetMembersOrigin`.
 * 
 * NOTE: Does not enforce the expected `MaxMembers` limit on the amount of members, but
 *       the weight estimations rely on it to estimate dispatchable weight.
 * 
 * # WARNING:
 * 
 * The `pallet-collective` can also be managed by logic outside of the pallet through the
 * implementation of the trait [`ChangeMembers`].
 * Any call to `set_members` must be careful that the member set doesn't get out of sync
 * with other logic managing the member set.
 * 
 * ## Complexity:
 * - `O(MP + N)` where:
 *   - `M` old-members-count (code- and governance-bounded)
 *   - `N` new-members-count (code- and governance-bounded)
 *   - `P` proposals-count (code-bounded)
 */
export interface CouncilCall_set_members {
    __kind: 'set_members'
    newMembers: AccountId32[]
    prime?: (AccountId32 | undefined)
    oldCount: number
}

/**
 * Add an aye or nay vote for the sender to the given proposal.
 * 
 * Requires the sender to be a member.
 * 
 * Transaction fees will be waived if the member is voting on any particular proposal
 * for the first time and the call is successful. Subsequent vote changes will charge a
 * fee.
 * ## Complexity
 * - `O(M)` where `M` is members-count (code- and governance-bounded)
 */
export interface CouncilCall_vote {
    __kind: 'vote'
    proposal: H256
    index: number
    approve: boolean
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const CollatorSelectionCall: sts.Type<CollatorSelectionCall> = sts.closedEnum(() => {
    return  {
        add_invulnerable: sts.enumStruct({
            who: AccountId32,
        }),
        leave_intent: sts.unit(),
        register_as_candidate: sts.unit(),
        remove_invulnerable: sts.enumStruct({
            who: AccountId32,
        }),
        set_candidacy_bond: sts.enumStruct({
            bond: sts.bigint(),
        }),
        set_desired_candidates: sts.enumStruct({
            max: sts.number(),
        }),
        set_invulnerables: sts.enumStruct({
            new: sts.array(() => AccountId32),
        }),
        take_candidate_slot: sts.enumStruct({
            deposit: sts.bigint(),
            target: AccountId32,
        }),
        update_bond: sts.enumStruct({
            newDeposit: sts.bigint(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type CollatorSelectionCall = CollatorSelectionCall_add_invulnerable | CollatorSelectionCall_leave_intent | CollatorSelectionCall_register_as_candidate | CollatorSelectionCall_remove_invulnerable | CollatorSelectionCall_set_candidacy_bond | CollatorSelectionCall_set_desired_candidates | CollatorSelectionCall_set_invulnerables | CollatorSelectionCall_take_candidate_slot | CollatorSelectionCall_update_bond

/**
 * Add a new account `who` to the list of `Invulnerables` collators. `who` must have
 * registered session keys. If `who` is a candidate, they will be removed.
 * 
 * The origin for this call must be the `UpdateOrigin`.
 */
export interface CollatorSelectionCall_add_invulnerable {
    __kind: 'add_invulnerable'
    who: AccountId32
}

/**
 * Deregister `origin` as a collator candidate. Note that the collator can only leave on
 * session change. The `CandidacyBond` will be unreserved immediately.
 * 
 * This call will fail if the total number of candidates would drop below
 * `MinEligibleCollators`.
 */
export interface CollatorSelectionCall_leave_intent {
    __kind: 'leave_intent'
}

/**
 * Register this account as a collator candidate. The account must (a) already have
 * registered session keys and (b) be able to reserve the `CandidacyBond`.
 * 
 * This call is not available to `Invulnerable` collators.
 */
export interface CollatorSelectionCall_register_as_candidate {
    __kind: 'register_as_candidate'
}

/**
 * Remove an account `who` from the list of `Invulnerables` collators. `Invulnerables` must
 * be sorted.
 * 
 * The origin for this call must be the `UpdateOrigin`.
 */
export interface CollatorSelectionCall_remove_invulnerable {
    __kind: 'remove_invulnerable'
    who: AccountId32
}

/**
 * Set the candidacy bond amount.
 * 
 * If the candidacy bond is increased by this call, all current candidates which have a
 * deposit lower than the new bond will be kicked from the list and get their deposits
 * back.
 * 
 * The origin for this call must be the `UpdateOrigin`.
 */
export interface CollatorSelectionCall_set_candidacy_bond {
    __kind: 'set_candidacy_bond'
    bond: bigint
}

/**
 * Set the ideal number of non-invulnerable collators. If lowering this number, then the
 * number of running collators could be higher than this figure. Aside from that edge case,
 * there should be no other way to have more candidates than the desired number.
 * 
 * The origin for this call must be the `UpdateOrigin`.
 */
export interface CollatorSelectionCall_set_desired_candidates {
    __kind: 'set_desired_candidates'
    max: number
}

/**
 * Set the list of invulnerable (fixed) collators. These collators must do some
 * preparation, namely to have registered session keys.
 * 
 * The call will remove any accounts that have not registered keys from the set. That is,
 * it is non-atomic; the caller accepts all `AccountId`s passed in `new` _individually_ as
 * acceptable Invulnerables, and is not proposing a _set_ of new Invulnerables.
 * 
 * This call does not maintain mutual exclusivity of `Invulnerables` and `Candidates`. It
 * is recommended to use a batch of `add_invulnerable` and `remove_invulnerable` instead. A
 * `batch_all` can also be used to enforce atomicity. If any candidates are included in
 * `new`, they should be removed with `remove_invulnerable_candidate` after execution.
 * 
 * Must be called by the `UpdateOrigin`.
 */
export interface CollatorSelectionCall_set_invulnerables {
    __kind: 'set_invulnerables'
    new: AccountId32[]
}

/**
 * The caller `origin` replaces a candidate `target` in the collator candidate list by
 * reserving `deposit`. The amount `deposit` reserved by the caller must be greater than
 * the existing bond of the target it is trying to replace.
 * 
 * This call will fail if the caller is already a collator candidate or invulnerable, the
 * caller does not have registered session keys, the target is not a collator candidate,
 * and/or the `deposit` amount cannot be reserved.
 */
export interface CollatorSelectionCall_take_candidate_slot {
    __kind: 'take_candidate_slot'
    deposit: bigint
    target: AccountId32
}

/**
 * Update the candidacy bond of collator candidate `origin` to a new amount `new_deposit`.
 * 
 * Setting a `new_deposit` that is lower than the current deposit while `origin` is
 * occupying a top-`DesiredCandidates` slot is not allowed.
 * 
 * This call will fail if `origin` is not a collator candidate, the updated bond is lower
 * than the minimum candidacy bond, and/or the amount cannot be reserved.
 */
export interface CollatorSelectionCall_update_bond {
    __kind: 'update_bond'
    newDeposit: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const ClaimsCall: sts.Type<ClaimsCall> = sts.closedEnum(() => {
    return  {
        claim: sts.enumStruct({
            ethereumSignature: EcdsaSignature,
        }),
    }
})

export const EcdsaSignature = sts.bytes()

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type ClaimsCall = ClaimsCall_claim

/**
 * Claim xHDX by providing signed message with Ethereum address.
 */
export interface ClaimsCall_claim {
    __kind: 'claim'
    ethereumSignature: EcdsaSignature
}

export type EcdsaSignature = Bytes

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const CircuitBreakerCall: sts.Type<CircuitBreakerCall> = sts.closedEnum(() => {
    return  {
        set_add_liquidity_limit: sts.enumStruct({
            assetId: sts.number(),
            liquidityLimit: sts.option(() => sts.tuple(() => [sts.number(), sts.number()])),
        }),
        set_remove_liquidity_limit: sts.enumStruct({
            assetId: sts.number(),
            liquidityLimit: sts.option(() => sts.tuple(() => [sts.number(), sts.number()])),
        }),
        set_trade_volume_limit: sts.enumStruct({
            assetId: sts.number(),
            tradeVolumeLimit: sts.tuple(() => [sts.number(), sts.number()]),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type CircuitBreakerCall = CircuitBreakerCall_set_add_liquidity_limit | CircuitBreakerCall_set_remove_liquidity_limit | CircuitBreakerCall_set_trade_volume_limit

/**
 * Set add liquidity limit for an asset.
 * 
 * Parameters:
 * - `origin`: The dispatch origin for this call. Must be `TechnicalOrigin`
 * - `asset_id`: The identifier of an asset
 * - `liquidity_limit`: Optional add liquidity limit represented as a percentage
 * 
 * Emits `AddLiquidityLimitChanged` event when successful.
 * 
 */
export interface CircuitBreakerCall_set_add_liquidity_limit {
    __kind: 'set_add_liquidity_limit'
    assetId: number
    liquidityLimit?: ([number, number] | undefined)
}

/**
 * Set remove liquidity limit for an asset.
 * 
 * Parameters:
 * - `origin`: The dispatch origin for this call. Must be `TechnicalOrigin`
 * - `asset_id`: The identifier of an asset
 * - `liquidity_limit`: Optional remove liquidity limit represented as a percentage
 * 
 * Emits `RemoveLiquidityLimitChanged` event when successful.
 * 
 */
export interface CircuitBreakerCall_set_remove_liquidity_limit {
    __kind: 'set_remove_liquidity_limit'
    assetId: number
    liquidityLimit?: ([number, number] | undefined)
}

/**
 * Set trade volume limit for an asset.
 * 
 * Parameters:
 * - `origin`: The dispatch origin for this call. Must be `TechnicalOrigin`
 * - `asset_id`: The identifier of an asset
 * - `trade_volume_limit`: New trade volume limit represented as a percentage
 * 
 * Emits `TradeVolumeLimitChanged` event when successful.
 * 
 */
export interface CircuitBreakerCall_set_trade_volume_limit {
    __kind: 'set_trade_volume_limit'
    assetId: number
    tradeVolumeLimit: [number, number]
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const BondsCall: sts.Type<BondsCall> = sts.closedEnum(() => {
    return  {
        issue: sts.enumStruct({
            assetId: sts.number(),
            amount: sts.bigint(),
            maturity: sts.bigint(),
        }),
        redeem: sts.enumStruct({
            bondId: sts.number(),
            amount: sts.bigint(),
        }),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type BondsCall = BondsCall_issue | BondsCall_redeem

/**
 * Issue new fungible bonds.
 * New asset id is registered and assigned to the bonds.
 * The number of bonds the issuer receives is 1:1 to the `amount` of the underlying asset
 * minus the protocol fee.
 * The bond asset is registered with the empty string for the asset name,
 * and with the same existential deposit as of the underlying asset.
 * Bonds can be redeemed for the underlying asset once mature.
 * Protocol fee is applied to the amount, and transferred to `T::FeeReceiver`.
 * When issuing new bonds with the underlying asset and maturity that matches existing bonds,
 * new amount of these existing bonds is issued, instead of registering new bonds.
 * It's possible to issue new bonds for bonds that are already mature.
 * 
 * Parameters:
 * - `origin`: issuer of new bonds, needs to be `T::IssueOrigin`
 * - `asset_id`: underlying asset id
 * - `amount`: the amount of the underlying asset
 * - `maturity`: Unix time in milliseconds, when the bonds will be mature.
 * 
 * Emits `BondTokenCreated` event when successful and new bonds were registered.
 * Emits `BondsIssued` event when successful.
 * 
 */
export interface BondsCall_issue {
    __kind: 'issue'
    assetId: number
    amount: bigint
    maturity: bigint
}

/**
 * Redeem bonds for the underlying asset.
 * The amount of the underlying asset the `origin` receives is 1:1 to the `amount` of the bonds.
 * Anyone who holds the bonds is able to redeem them.
 * Bonds can be both partially or fully redeemed.
 * 
 * Parameters:
 * - `origin`: account id
 * - `asset_id`: bond asset id
 * - `amount`: the amount of the bonds to redeem for the underlying asset
 * 
 * Emits `BondsRedeemed` event when successful.
 * 
 */
export interface BondsCall_redeem {
    __kind: 'redeem'
    bondId: number
    amount: bigint
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const BalancesCall: sts.Type<BalancesCall> = sts.closedEnum(() => {
    return  {
        force_adjust_total_issuance: sts.enumStruct({
            direction: AdjustmentDirection,
            delta: sts.bigint(),
        }),
        force_set_balance: sts.enumStruct({
            who: AccountId32,
            newFree: sts.bigint(),
        }),
        force_transfer: sts.enumStruct({
            source: AccountId32,
            dest: AccountId32,
            value: sts.bigint(),
        }),
        force_unreserve: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        transfer_all: sts.enumStruct({
            dest: AccountId32,
            keepAlive: sts.boolean(),
        }),
        transfer_allow_death: sts.enumStruct({
            dest: AccountId32,
            value: sts.bigint(),
        }),
        transfer_keep_alive: sts.enumStruct({
            dest: AccountId32,
            value: sts.bigint(),
        }),
        upgrade_accounts: sts.enumStruct({
            who: sts.array(() => AccountId32),
        }),
    }
})

export const AdjustmentDirection: sts.Type<AdjustmentDirection> = sts.closedEnum(() => {
    return  {
        Decrease: sts.unit(),
        Increase: sts.unit(),
    }
})

export type AdjustmentDirection = AdjustmentDirection_Decrease | AdjustmentDirection_Increase

export interface AdjustmentDirection_Decrease {
    __kind: 'Decrease'
}

export interface AdjustmentDirection_Increase {
    __kind: 'Increase'
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type BalancesCall = BalancesCall_force_adjust_total_issuance | BalancesCall_force_set_balance | BalancesCall_force_transfer | BalancesCall_force_unreserve | BalancesCall_transfer_all | BalancesCall_transfer_allow_death | BalancesCall_transfer_keep_alive | BalancesCall_upgrade_accounts

/**
 * Adjust the total issuance in a saturating way.
 * 
 * Can only be called by root and always needs a positive `delta`.
 * 
 * # Example
 */
export interface BalancesCall_force_adjust_total_issuance {
    __kind: 'force_adjust_total_issuance'
    direction: AdjustmentDirection
    delta: bigint
}

/**
 * Set the regular balance of a given account.
 * 
 * The dispatch origin for this call is `root`.
 */
export interface BalancesCall_force_set_balance {
    __kind: 'force_set_balance'
    who: AccountId32
    newFree: bigint
}

/**
 * Exactly as `transfer_allow_death`, except the origin must be root and the source account
 * may be specified.
 */
export interface BalancesCall_force_transfer {
    __kind: 'force_transfer'
    source: AccountId32
    dest: AccountId32
    value: bigint
}

/**
 * Unreserve some balance from a user by force.
 * 
 * Can only be called by ROOT.
 */
export interface BalancesCall_force_unreserve {
    __kind: 'force_unreserve'
    who: AccountId32
    amount: bigint
}

/**
 * Transfer the entire transferable balance from the caller account.
 * 
 * NOTE: This function only attempts to transfer _transferable_ balances. This means that
 * any locked, reserved, or existential deposits (when `keep_alive` is `true`), will not be
 * transferred by this function. To ensure that this function results in a killed account,
 * you might need to prepare the account by removing any reference counters, storage
 * deposits, etc...
 * 
 * The dispatch origin of this call must be Signed.
 * 
 * - `dest`: The recipient of the transfer.
 * - `keep_alive`: A boolean to determine if the `transfer_all` operation should send all
 *   of the funds the account has, causing the sender account to be killed (false), or
 *   transfer everything except at least the existential deposit, which will guarantee to
 *   keep the sender account alive (true).
 */
export interface BalancesCall_transfer_all {
    __kind: 'transfer_all'
    dest: AccountId32
    keepAlive: boolean
}

/**
 * Transfer some liquid free balance to another account.
 * 
 * `transfer_allow_death` will set the `FreeBalance` of the sender and receiver.
 * If the sender's account is below the existential deposit as a result
 * of the transfer, the account will be reaped.
 * 
 * The dispatch origin for this call must be `Signed` by the transactor.
 */
export interface BalancesCall_transfer_allow_death {
    __kind: 'transfer_allow_death'
    dest: AccountId32
    value: bigint
}

/**
 * Same as the [`transfer_allow_death`] call, but with a check that the transfer will not
 * kill the origin account.
 * 
 * 99% of the time you want [`transfer_allow_death`] instead.
 * 
 * [`transfer_allow_death`]: struct.Pallet.html#method.transfer
 */
export interface BalancesCall_transfer_keep_alive {
    __kind: 'transfer_keep_alive'
    dest: AccountId32
    value: bigint
}

/**
 * Upgrade a specified account.
 * 
 * - `origin`: Must be `Signed`.
 * - `who`: The account to be upgraded.
 * 
 * This will waive the transaction fee if at least all but 10% of the accounts needed to
 * be upgraded. (We let some not have to be upgraded just in order to allow for the
 * possibility of churn).
 */
export interface BalancesCall_upgrade_accounts {
    __kind: 'upgrade_accounts'
    who: AccountId32[]
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export const AssetRegistryCall: sts.Type<AssetRegistryCall> = sts.closedEnum(() => {
    return  {
        ban_asset: sts.enumStruct({
            assetId: sts.number(),
        }),
        register: sts.enumStruct({
            assetId: sts.option(() => sts.number()),
            name: sts.option(() => sts.bytes()),
            assetType: AssetType,
            existentialDeposit: sts.option(() => sts.bigint()),
            symbol: sts.option(() => sts.bytes()),
            decimals: sts.option(() => sts.number()),
            location: sts.option(() => AssetLocation),
            xcmRateLimit: sts.option(() => sts.bigint()),
            isSufficient: sts.boolean(),
        }),
        register_external: sts.enumStruct({
            location: AssetLocation,
        }),
        unban_asset: sts.enumStruct({
            assetId: sts.number(),
        }),
        update: sts.enumStruct({
            assetId: sts.number(),
            name: sts.option(() => sts.bytes()),
            assetType: sts.option(() => AssetType),
            existentialDeposit: sts.option(() => sts.bigint()),
            xcmRateLimit: sts.option(() => sts.bigint()),
            isSufficient: sts.option(() => sts.boolean()),
            symbol: sts.option(() => sts.bytes()),
            decimals: sts.option(() => sts.number()),
            location: sts.option(() => AssetLocation),
        }),
    }
})

export const AssetLocation: sts.Type<AssetLocation> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V3Junctions,
    }
})

export interface AssetLocation {
    parents: number
    interior: V3Junctions
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type AssetRegistryCall = AssetRegistryCall_ban_asset | AssetRegistryCall_register | AssetRegistryCall_register_external | AssetRegistryCall_unban_asset | AssetRegistryCall_update

export interface AssetRegistryCall_ban_asset {
    __kind: 'ban_asset'
    assetId: number
}

/**
 * Register a new asset.
 * 
 * New asset is given `NextAssetId` - sequential asset id
 * 
 * Asset's id is optional and it can't be used by another asset if it's provided.
 * Provided `asset_id` must be from within reserved range.
 * If `asset_id` is `None`, new asset is given id for sequential ids.
 * 
 * Asset's name is optional and it can't be used by another asset if it's provided.
 * Adds mapping between `name` and assigned `asset_id` so asset id can be retrieved by name too (Note: this approach is used in AMM implementation (xyk))
 * 
 * Emits 'Registered` event when successful.
 */
export interface AssetRegistryCall_register {
    __kind: 'register'
    assetId?: (number | undefined)
    name?: (Bytes | undefined)
    assetType: AssetType
    existentialDeposit?: (bigint | undefined)
    symbol?: (Bytes | undefined)
    decimals?: (number | undefined)
    location?: (AssetLocation | undefined)
    xcmRateLimit?: (bigint | undefined)
    isSufficient: boolean
}

export interface AssetRegistryCall_register_external {
    __kind: 'register_external'
    location: AssetLocation
}

export interface AssetRegistryCall_unban_asset {
    __kind: 'unban_asset'
    assetId: number
}

/**
 * Update registered asset.
 * 
 * All parameteres are optional and value is not updated if param is `None`.
 * 
 * `decimals` - can be update by `UpdateOrigin` only if it wasn't set yet. Only
 * `RegistryOrigin` can update `decimals` if it was previously set.
 * 
 * `location` - can be updated only by `RegistryOrigin`.
 * 
 * Emits `Updated` event when successful.
 */
export interface AssetRegistryCall_update {
    __kind: 'update'
    assetId: number
    name?: (Bytes | undefined)
    assetType?: (AssetType | undefined)
    existentialDeposit?: (bigint | undefined)
    xcmRateLimit?: (bigint | undefined)
    isSufficient?: (boolean | undefined)
    symbol?: (Bytes | undefined)
    decimals?: (number | undefined)
    location?: (AssetLocation | undefined)
}

export type Call = Call_AssetRegistry | Call_Balances | Call_Bonds | Call_CircuitBreaker | Call_Claims | Call_CollatorSelection | Call_Council | Call_CumulusXcm | Call_Currencies | Call_DCA | Call_Democracy | Call_Duster | Call_DynamicFees | Call_EVM | Call_EVMAccounts | Call_Elections | Call_EmaOracle | Call_Ethereum | Call_GenesisHistory | Call_Identity | Call_LBP | Call_MessageQueue | Call_MultiTransactionPayment | Call_Multisig | Call_OTC | Call_Omnipool | Call_OmnipoolLiquidityMining | Call_OmnipoolWarehouseLM | Call_OrmlXcm | Call_OtcSettlements | Call_ParachainInfo | Call_ParachainSystem | Call_PolkadotXcm | Call_Preimage | Call_Proxy | Call_Referrals | Call_RelayChainInfo | Call_Router | Call_Scheduler | Call_Session | Call_Stableswap | Call_Staking | Call_StateTrieMigration | Call_System | Call_TechnicalCommittee | Call_Timestamp | Call_Tips | Call_Tokens | Call_TransactionPause | Call_Treasury | Call_Uniques | Call_Utility | Call_Vesting | Call_XTokens | Call_XYK | Call_XYKLiquidityMining | Call_XYKWarehouseLM

export interface Call_AssetRegistry {
    __kind: 'AssetRegistry'
    value: AssetRegistryCall
}

export interface Call_Balances {
    __kind: 'Balances'
    value: BalancesCall
}

export interface Call_Bonds {
    __kind: 'Bonds'
    value: BondsCall
}

export interface Call_CircuitBreaker {
    __kind: 'CircuitBreaker'
    value: CircuitBreakerCall
}

export interface Call_Claims {
    __kind: 'Claims'
    value: ClaimsCall
}

export interface Call_CollatorSelection {
    __kind: 'CollatorSelection'
    value: CollatorSelectionCall
}

export interface Call_Council {
    __kind: 'Council'
    value: CouncilCall
}

export interface Call_CumulusXcm {
    __kind: 'CumulusXcm'
    value: CumulusXcmCall
}

export interface Call_Currencies {
    __kind: 'Currencies'
    value: CurrenciesCall
}

export interface Call_DCA {
    __kind: 'DCA'
    value: DCACall
}

export interface Call_Democracy {
    __kind: 'Democracy'
    value: DemocracyCall
}

export interface Call_Duster {
    __kind: 'Duster'
    value: DusterCall
}

export interface Call_DynamicFees {
    __kind: 'DynamicFees'
    value: DynamicFeesCall
}

export interface Call_EVM {
    __kind: 'EVM'
    value: EVMCall
}

export interface Call_EVMAccounts {
    __kind: 'EVMAccounts'
    value: EVMAccountsCall
}

export interface Call_Elections {
    __kind: 'Elections'
    value: ElectionsCall
}

export interface Call_EmaOracle {
    __kind: 'EmaOracle'
    value: EmaOracleCall
}

export interface Call_Ethereum {
    __kind: 'Ethereum'
    value: EthereumCall
}

export interface Call_GenesisHistory {
    __kind: 'GenesisHistory'
    value: GenesisHistoryCall
}

export interface Call_Identity {
    __kind: 'Identity'
    value: IdentityCall
}

export interface Call_LBP {
    __kind: 'LBP'
    value: LBPCall
}

export interface Call_MessageQueue {
    __kind: 'MessageQueue'
    value: MessageQueueCall
}

export interface Call_MultiTransactionPayment {
    __kind: 'MultiTransactionPayment'
    value: MultiTransactionPaymentCall
}

export interface Call_Multisig {
    __kind: 'Multisig'
    value: MultisigCall
}

export interface Call_OTC {
    __kind: 'OTC'
    value: OTCCall
}

export interface Call_Omnipool {
    __kind: 'Omnipool'
    value: OmnipoolCall
}

export interface Call_OmnipoolLiquidityMining {
    __kind: 'OmnipoolLiquidityMining'
    value: OmnipoolLiquidityMiningCall
}

export interface Call_OmnipoolWarehouseLM {
    __kind: 'OmnipoolWarehouseLM'
    value: OmnipoolWarehouseLMCall
}

export interface Call_OrmlXcm {
    __kind: 'OrmlXcm'
    value: OrmlXcmCall
}

export interface Call_OtcSettlements {
    __kind: 'OtcSettlements'
    value: OtcSettlementsCall
}

export interface Call_ParachainInfo {
    __kind: 'ParachainInfo'
    value: ParachainInfoCall
}

export interface Call_ParachainSystem {
    __kind: 'ParachainSystem'
    value: ParachainSystemCall
}

export interface Call_PolkadotXcm {
    __kind: 'PolkadotXcm'
    value: PolkadotXcmCall
}

export interface Call_Preimage {
    __kind: 'Preimage'
    value: PreimageCall
}

export interface Call_Proxy {
    __kind: 'Proxy'
    value: ProxyCall
}

export interface Call_Referrals {
    __kind: 'Referrals'
    value: ReferralsCall
}

export interface Call_RelayChainInfo {
    __kind: 'RelayChainInfo'
    value: RelayChainInfoCall
}

export interface Call_Router {
    __kind: 'Router'
    value: RouterCall
}

export interface Call_Scheduler {
    __kind: 'Scheduler'
    value: SchedulerCall
}

export interface Call_Session {
    __kind: 'Session'
    value: SessionCall
}

export interface Call_Stableswap {
    __kind: 'Stableswap'
    value: StableswapCall
}

export interface Call_Staking {
    __kind: 'Staking'
    value: StakingCall
}

export interface Call_StateTrieMigration {
    __kind: 'StateTrieMigration'
    value: StateTrieMigrationCall
}

export interface Call_System {
    __kind: 'System'
    value: SystemCall
}

export interface Call_TechnicalCommittee {
    __kind: 'TechnicalCommittee'
    value: TechnicalCommitteeCall
}

export interface Call_Timestamp {
    __kind: 'Timestamp'
    value: TimestampCall
}

export interface Call_Tips {
    __kind: 'Tips'
    value: TipsCall
}

export interface Call_Tokens {
    __kind: 'Tokens'
    value: TokensCall
}

export interface Call_TransactionPause {
    __kind: 'TransactionPause'
    value: TransactionPauseCall
}

export interface Call_Treasury {
    __kind: 'Treasury'
    value: TreasuryCall
}

export interface Call_Uniques {
    __kind: 'Uniques'
    value: UniquesCall
}

export interface Call_Utility {
    __kind: 'Utility'
    value: UtilityCall
}

export interface Call_Vesting {
    __kind: 'Vesting'
    value: VestingCall
}

export interface Call_XTokens {
    __kind: 'XTokens'
    value: XTokensCall
}

export interface Call_XYK {
    __kind: 'XYK'
    value: XYKCall
}

export interface Call_XYKLiquidityMining {
    __kind: 'XYKLiquidityMining'
    value: XYKLiquidityMiningCall
}

export interface Call_XYKWarehouseLM {
    __kind: 'XYKWarehouseLM'
    value: XYKWarehouseLMCall
}

export const AssetType: sts.Type<AssetType> = sts.closedEnum(() => {
    return  {
        Bond: sts.unit(),
        Erc20: sts.unit(),
        External: sts.unit(),
        StableSwap: sts.unit(),
        Token: sts.unit(),
        XYK: sts.unit(),
    }
})
