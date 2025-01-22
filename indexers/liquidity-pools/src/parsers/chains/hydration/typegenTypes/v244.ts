import {sts, Result, Option, Bytes, BitSequence} from './support'

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
        Council: Type_474,
        CumulusXcm: Type_478,
        Ethereum: Type_476,
        PolkadotXcm: Origin,
        TechnicalCommittee: Type_475,
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

export const Type_475: sts.Type<Type_475> = sts.closedEnum(() => {
    return  {
        Member: AccountId32,
        Members: sts.tuple(() => [sts.number(), sts.number()]),
        _Phantom: sts.unit(),
    }
})

export type Type_475 = Type_475_Member | Type_475_Members | Type_475__Phantom

export interface Type_475_Member {
    __kind: 'Member'
    value: AccountId32
}

export interface Type_475_Members {
    __kind: 'Members'
    value: [number, number]
}

export interface Type_475__Phantom {
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

export const Type_476: sts.Type<Type_476> = sts.closedEnum(() => {
    return  {
        EthereumTransaction: H160,
    }
})

export const H160 = sts.bytes()

export type Type_476 = Type_476_EthereumTransaction

export interface Type_476_EthereumTransaction {
    __kind: 'EthereumTransaction'
    value: H160
}

export type H160 = Bytes

export const Type_478: sts.Type<Type_478> = sts.closedEnum(() => {
    return  {
        Relay: sts.unit(),
        SiblingParachain: Id,
    }
})

export const Id = sts.number()

export type Type_478 = Type_478_Relay | Type_478_SiblingParachain

export interface Type_478_Relay {
    __kind: 'Relay'
}

export interface Type_478_SiblingParachain {
    __kind: 'SiblingParachain'
    value: Id
}

export type Id = number

export const Type_474: sts.Type<Type_474> = sts.closedEnum(() => {
    return  {
        Member: AccountId32,
        Members: sts.tuple(() => [sts.number(), sts.number()]),
        _Phantom: sts.unit(),
    }
})

export type Type_474 = Type_474_Member | Type_474_Members | Type_474__Phantom

export interface Type_474_Member {
    __kind: 'Member'
    value: AccountId32
}

export interface Type_474_Members {
    __kind: 'Members'
    value: [number, number]
}

export interface Type_474__Phantom {
    __kind: '_Phantom'
}

export type OriginCaller = OriginCaller_Council | OriginCaller_CumulusXcm | OriginCaller_Ethereum | OriginCaller_PolkadotXcm | OriginCaller_TechnicalCommittee | OriginCaller_Void | OriginCaller_system

export interface OriginCaller_Council {
    __kind: 'Council'
    value: Type_474
}

export interface OriginCaller_CumulusXcm {
    __kind: 'CumulusXcm'
    value: Type_478
}

export interface OriginCaller_Ethereum {
    __kind: 'Ethereum'
    value: Type_476
}

export interface OriginCaller_PolkadotXcm {
    __kind: 'PolkadotXcm'
    value: Origin
}

export interface OriginCaller_TechnicalCommittee {
    __kind: 'TechnicalCommittee'
    value: Type_475
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
 * See [`Pallet::claim_rewards`].
 */
export interface XYKLiquidityMiningCall_claim_rewards {
    __kind: 'claim_rewards'
    depositId: bigint
    yieldFarmId: number
}

/**
 * See [`Pallet::create_global_farm`].
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
 * See [`Pallet::create_yield_farm`].
 */
export interface XYKLiquidityMiningCall_create_yield_farm {
    __kind: 'create_yield_farm'
    globalFarmId: number
    assetPair: AssetPair
    multiplier: FixedU128
    loyaltyCurve?: (LoyaltyCurve | undefined)
}

/**
 * See [`Pallet::deposit_shares`].
 */
export interface XYKLiquidityMiningCall_deposit_shares {
    __kind: 'deposit_shares'
    globalFarmId: number
    yieldFarmId: number
    assetPair: AssetPair
    sharesAmount: bigint
}

/**
 * See [`Pallet::redeposit_shares`].
 */
export interface XYKLiquidityMiningCall_redeposit_shares {
    __kind: 'redeposit_shares'
    globalFarmId: number
    yieldFarmId: number
    assetPair: AssetPair
    depositId: bigint
}

/**
 * See [`Pallet::resume_yield_farm`].
 */
export interface XYKLiquidityMiningCall_resume_yield_farm {
    __kind: 'resume_yield_farm'
    globalFarmId: number
    yieldFarmId: number
    assetPair: AssetPair
    multiplier: FixedU128
}

/**
 * See [`Pallet::stop_yield_farm`].
 */
export interface XYKLiquidityMiningCall_stop_yield_farm {
    __kind: 'stop_yield_farm'
    globalFarmId: number
    assetPair: AssetPair
}

/**
 * See [`Pallet::terminate_global_farm`].
 */
export interface XYKLiquidityMiningCall_terminate_global_farm {
    __kind: 'terminate_global_farm'
    globalFarmId: number
}

/**
 * See [`Pallet::terminate_yield_farm`].
 */
export interface XYKLiquidityMiningCall_terminate_yield_farm {
    __kind: 'terminate_yield_farm'
    globalFarmId: number
    yieldFarmId: number
    assetPair: AssetPair
}

/**
 * See [`Pallet::update_global_farm`].
 */
export interface XYKLiquidityMiningCall_update_global_farm {
    __kind: 'update_global_farm'
    globalFarmId: number
    priceAdjustment: FixedU128
}

/**
 * See [`Pallet::update_yield_farm`].
 */
export interface XYKLiquidityMiningCall_update_yield_farm {
    __kind: 'update_yield_farm'
    globalFarmId: number
    assetPair: AssetPair
    multiplier: FixedU128
}

/**
 * See [`Pallet::withdraw_shares`].
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
 * See [`Pallet::add_liquidity`].
 */
export interface XYKCall_add_liquidity {
    __kind: 'add_liquidity'
    assetA: number
    assetB: number
    amountA: bigint
    amountBMaxLimit: bigint
}

/**
 * See [`Pallet::buy`].
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
 * See [`Pallet::create_pool`].
 */
export interface XYKCall_create_pool {
    __kind: 'create_pool'
    assetA: number
    amountA: bigint
    assetB: number
    amountB: bigint
}

/**
 * See [`Pallet::remove_liquidity`].
 */
export interface XYKCall_remove_liquidity {
    __kind: 'remove_liquidity'
    assetA: number
    assetB: number
    liquidityAmount: bigint
}

/**
 * See [`Pallet::sell`].
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
 * See [`Pallet::transfer`].
 */
export interface XTokensCall_transfer {
    __kind: 'transfer'
    currencyId: number
    amount: bigint
    dest: VersionedLocation
    destWeightLimit: V3WeightLimit
}

/**
 * See [`Pallet::transfer_multiasset`].
 */
export interface XTokensCall_transfer_multiasset {
    __kind: 'transfer_multiasset'
    asset: VersionedAsset
    dest: VersionedLocation
    destWeightLimit: V3WeightLimit
}

/**
 * See [`Pallet::transfer_multiasset_with_fee`].
 */
export interface XTokensCall_transfer_multiasset_with_fee {
    __kind: 'transfer_multiasset_with_fee'
    asset: VersionedAsset
    fee: VersionedAsset
    dest: VersionedLocation
    destWeightLimit: V3WeightLimit
}

/**
 * See [`Pallet::transfer_multiassets`].
 */
export interface XTokensCall_transfer_multiassets {
    __kind: 'transfer_multiassets'
    assets: VersionedAssets
    feeItem: number
    dest: VersionedLocation
    destWeightLimit: V3WeightLimit
}

/**
 * See [`Pallet::transfer_multicurrencies`].
 */
export interface XTokensCall_transfer_multicurrencies {
    __kind: 'transfer_multicurrencies'
    currencies: [number, bigint][]
    feeItem: number
    dest: VersionedLocation
    destWeightLimit: V3WeightLimit
}

/**
 * See [`Pallet::transfer_with_fee`].
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

/**
 * See [`Pallet::claim`].
 */
export interface VestingCall_claim {
    __kind: 'claim'
}

/**
 * See [`Pallet::claim_for`].
 */
export interface VestingCall_claim_for {
    __kind: 'claim_for'
    dest: AccountId32
}

/**
 * See [`Pallet::update_vesting_schedules`].
 */
export interface VestingCall_update_vesting_schedules {
    __kind: 'update_vesting_schedules'
    who: AccountId32
    vestingSchedules: VestingSchedule[]
}

/**
 * See [`Pallet::vested_transfer`].
 */
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
 * See [`Pallet::as_derivative`].
 */
export interface UtilityCall_as_derivative {
    __kind: 'as_derivative'
    index: number
    call: Call
}

/**
 * See [`Pallet::batch`].
 */
export interface UtilityCall_batch {
    __kind: 'batch'
    calls: Call[]
}

/**
 * See [`Pallet::batch_all`].
 */
export interface UtilityCall_batch_all {
    __kind: 'batch_all'
    calls: Call[]
}

/**
 * See [`Pallet::dispatch_as`].
 */
export interface UtilityCall_dispatch_as {
    __kind: 'dispatch_as'
    asOrigin: OriginCaller
    call: Call
}

/**
 * See [`Pallet::force_batch`].
 */
export interface UtilityCall_force_batch {
    __kind: 'force_batch'
    calls: Call[]
}

/**
 * See [`Pallet::with_weight`].
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
 * See [`Pallet::approve_transfer`].
 */
export interface UniquesCall_approve_transfer {
    __kind: 'approve_transfer'
    collection: bigint
    item: bigint
    delegate: AccountId32
}

/**
 * See [`Pallet::burn`].
 */
export interface UniquesCall_burn {
    __kind: 'burn'
    collection: bigint
    item: bigint
    checkOwner?: (AccountId32 | undefined)
}

/**
 * See [`Pallet::buy_item`].
 */
export interface UniquesCall_buy_item {
    __kind: 'buy_item'
    collection: bigint
    item: bigint
    bidPrice: bigint
}

/**
 * See [`Pallet::cancel_approval`].
 */
export interface UniquesCall_cancel_approval {
    __kind: 'cancel_approval'
    collection: bigint
    item: bigint
    maybeCheckDelegate?: (AccountId32 | undefined)
}

/**
 * See [`Pallet::clear_attribute`].
 */
export interface UniquesCall_clear_attribute {
    __kind: 'clear_attribute'
    collection: bigint
    maybeItem?: (bigint | undefined)
    key: Bytes
}

/**
 * See [`Pallet::clear_collection_metadata`].
 */
export interface UniquesCall_clear_collection_metadata {
    __kind: 'clear_collection_metadata'
    collection: bigint
}

/**
 * See [`Pallet::clear_metadata`].
 */
export interface UniquesCall_clear_metadata {
    __kind: 'clear_metadata'
    collection: bigint
    item: bigint
}

/**
 * See [`Pallet::create`].
 */
export interface UniquesCall_create {
    __kind: 'create'
    collection: bigint
    admin: AccountId32
}

/**
 * See [`Pallet::destroy`].
 */
export interface UniquesCall_destroy {
    __kind: 'destroy'
    collection: bigint
    witness: DestroyWitness
}

/**
 * See [`Pallet::force_create`].
 */
export interface UniquesCall_force_create {
    __kind: 'force_create'
    collection: bigint
    owner: AccountId32
    freeHolding: boolean
}

/**
 * See [`Pallet::force_item_status`].
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
 * See [`Pallet::freeze`].
 */
export interface UniquesCall_freeze {
    __kind: 'freeze'
    collection: bigint
    item: bigint
}

/**
 * See [`Pallet::freeze_collection`].
 */
export interface UniquesCall_freeze_collection {
    __kind: 'freeze_collection'
    collection: bigint
}

/**
 * See [`Pallet::mint`].
 */
export interface UniquesCall_mint {
    __kind: 'mint'
    collection: bigint
    item: bigint
    owner: AccountId32
}

/**
 * See [`Pallet::redeposit`].
 */
export interface UniquesCall_redeposit {
    __kind: 'redeposit'
    collection: bigint
    items: bigint[]
}

/**
 * See [`Pallet::set_accept_ownership`].
 */
export interface UniquesCall_set_accept_ownership {
    __kind: 'set_accept_ownership'
    maybeCollection?: (bigint | undefined)
}

/**
 * See [`Pallet::set_attribute`].
 */
export interface UniquesCall_set_attribute {
    __kind: 'set_attribute'
    collection: bigint
    maybeItem?: (bigint | undefined)
    key: Bytes
    value: Bytes
}

/**
 * See [`Pallet::set_collection_max_supply`].
 */
export interface UniquesCall_set_collection_max_supply {
    __kind: 'set_collection_max_supply'
    collection: bigint
    maxSupply: number
}

/**
 * See [`Pallet::set_collection_metadata`].
 */
export interface UniquesCall_set_collection_metadata {
    __kind: 'set_collection_metadata'
    collection: bigint
    data: Bytes
    isFrozen: boolean
}

/**
 * See [`Pallet::set_metadata`].
 */
export interface UniquesCall_set_metadata {
    __kind: 'set_metadata'
    collection: bigint
    item: bigint
    data: Bytes
    isFrozen: boolean
}

/**
 * See [`Pallet::set_price`].
 */
export interface UniquesCall_set_price {
    __kind: 'set_price'
    collection: bigint
    item: bigint
    price?: (bigint | undefined)
    whitelistedBuyer?: (AccountId32 | undefined)
}

/**
 * See [`Pallet::set_team`].
 */
export interface UniquesCall_set_team {
    __kind: 'set_team'
    collection: bigint
    issuer: AccountId32
    admin: AccountId32
    freezer: AccountId32
}

/**
 * See [`Pallet::thaw`].
 */
export interface UniquesCall_thaw {
    __kind: 'thaw'
    collection: bigint
    item: bigint
}

/**
 * See [`Pallet::thaw_collection`].
 */
export interface UniquesCall_thaw_collection {
    __kind: 'thaw_collection'
    collection: bigint
}

/**
 * See [`Pallet::transfer`].
 */
export interface UniquesCall_transfer {
    __kind: 'transfer'
    collection: bigint
    item: bigint
    dest: AccountId32
}

/**
 * See [`Pallet::transfer_ownership`].
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
 * See [`Pallet::approve_proposal`].
 */
export interface TreasuryCall_approve_proposal {
    __kind: 'approve_proposal'
    proposalId: number
}

/**
 * See [`Pallet::check_status`].
 */
export interface TreasuryCall_check_status {
    __kind: 'check_status'
    index: number
}

/**
 * See [`Pallet::payout`].
 */
export interface TreasuryCall_payout {
    __kind: 'payout'
    index: number
}

/**
 * See [`Pallet::propose_spend`].
 */
export interface TreasuryCall_propose_spend {
    __kind: 'propose_spend'
    value: bigint
    beneficiary: AccountId32
}

/**
 * See [`Pallet::reject_proposal`].
 */
export interface TreasuryCall_reject_proposal {
    __kind: 'reject_proposal'
    proposalId: number
}

/**
 * See [`Pallet::remove_approval`].
 */
export interface TreasuryCall_remove_approval {
    __kind: 'remove_approval'
    proposalId: number
}

/**
 * See [`Pallet::spend`].
 */
export interface TreasuryCall_spend {
    __kind: 'spend'
    amount: bigint
    beneficiary: AccountId32
    validFrom?: (number | undefined)
}

/**
 * See [`Pallet::spend_local`].
 */
export interface TreasuryCall_spend_local {
    __kind: 'spend_local'
    amount: bigint
    beneficiary: AccountId32
}

/**
 * See [`Pallet::void_spend`].
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

/**
 * See [`Pallet::pause_transaction`].
 */
export interface TransactionPauseCall_pause_transaction {
    __kind: 'pause_transaction'
    palletName: Bytes
    functionName: Bytes
}

/**
 * See [`Pallet::unpause_transaction`].
 */
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
 * See [`Pallet::force_transfer`].
 */
export interface TokensCall_force_transfer {
    __kind: 'force_transfer'
    source: AccountId32
    dest: AccountId32
    currencyId: number
    amount: bigint
}

/**
 * See [`Pallet::set_balance`].
 */
export interface TokensCall_set_balance {
    __kind: 'set_balance'
    who: AccountId32
    currencyId: number
    newFree: bigint
    newReserved: bigint
}

/**
 * See [`Pallet::transfer`].
 */
export interface TokensCall_transfer {
    __kind: 'transfer'
    dest: AccountId32
    currencyId: number
    amount: bigint
}

/**
 * See [`Pallet::transfer_all`].
 */
export interface TokensCall_transfer_all {
    __kind: 'transfer_all'
    dest: AccountId32
    currencyId: number
    keepAlive: boolean
}

/**
 * See [`Pallet::transfer_keep_alive`].
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
 * See [`Pallet::close_tip`].
 */
export interface TipsCall_close_tip {
    __kind: 'close_tip'
    hash: H256
}

/**
 * See [`Pallet::report_awesome`].
 */
export interface TipsCall_report_awesome {
    __kind: 'report_awesome'
    reason: Bytes
    who: AccountId32
}

/**
 * See [`Pallet::retract_tip`].
 */
export interface TipsCall_retract_tip {
    __kind: 'retract_tip'
    hash: H256
}

/**
 * See [`Pallet::slash_tip`].
 */
export interface TipsCall_slash_tip {
    __kind: 'slash_tip'
    hash: H256
}

/**
 * See [`Pallet::tip`].
 */
export interface TipsCall_tip {
    __kind: 'tip'
    hash: H256
    tipValue: bigint
}

/**
 * See [`Pallet::tip_new`].
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
 * See [`Pallet::set`].
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
 * See [`Pallet::close`].
 */
export interface TechnicalCommitteeCall_close {
    __kind: 'close'
    proposalHash: H256
    index: number
    proposalWeightBound: Weight
    lengthBound: number
}

/**
 * See [`Pallet::disapprove_proposal`].
 */
export interface TechnicalCommitteeCall_disapprove_proposal {
    __kind: 'disapprove_proposal'
    proposalHash: H256
}

/**
 * See [`Pallet::execute`].
 */
export interface TechnicalCommitteeCall_execute {
    __kind: 'execute'
    proposal: Call
    lengthBound: number
}

/**
 * See [`Pallet::propose`].
 */
export interface TechnicalCommitteeCall_propose {
    __kind: 'propose'
    threshold: number
    proposal: Call
    lengthBound: number
}

/**
 * See [`Pallet::set_members`].
 */
export interface TechnicalCommitteeCall_set_members {
    __kind: 'set_members'
    newMembers: AccountId32[]
    prime?: (AccountId32 | undefined)
    oldCount: number
}

/**
 * See [`Pallet::vote`].
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
 * See [`Pallet::apply_authorized_upgrade`].
 */
export interface SystemCall_apply_authorized_upgrade {
    __kind: 'apply_authorized_upgrade'
    code: Bytes
}

/**
 * See [`Pallet::authorize_upgrade`].
 */
export interface SystemCall_authorize_upgrade {
    __kind: 'authorize_upgrade'
    codeHash: H256
}

/**
 * See [`Pallet::authorize_upgrade_without_checks`].
 */
export interface SystemCall_authorize_upgrade_without_checks {
    __kind: 'authorize_upgrade_without_checks'
    codeHash: H256
}

/**
 * See [`Pallet::kill_prefix`].
 */
export interface SystemCall_kill_prefix {
    __kind: 'kill_prefix'
    prefix: Bytes
    subkeys: number
}

/**
 * See [`Pallet::kill_storage`].
 */
export interface SystemCall_kill_storage {
    __kind: 'kill_storage'
    keys: Bytes[]
}

/**
 * See [`Pallet::remark`].
 */
export interface SystemCall_remark {
    __kind: 'remark'
    remark: Bytes
}

/**
 * See [`Pallet::remark_with_event`].
 */
export interface SystemCall_remark_with_event {
    __kind: 'remark_with_event'
    remark: Bytes
}

/**
 * See [`Pallet::set_code`].
 */
export interface SystemCall_set_code {
    __kind: 'set_code'
    code: Bytes
}

/**
 * See [`Pallet::set_code_without_checks`].
 */
export interface SystemCall_set_code_without_checks {
    __kind: 'set_code_without_checks'
    code: Bytes
}

/**
 * See [`Pallet::set_heap_pages`].
 */
export interface SystemCall_set_heap_pages {
    __kind: 'set_heap_pages'
    pages: bigint
}

/**
 * See [`Pallet::set_storage`].
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
 * See [`Pallet::continue_migrate`].
 */
export interface StateTrieMigrationCall_continue_migrate {
    __kind: 'continue_migrate'
    limits: MigrationLimits
    realSizeUpper: number
    witnessTask: MigrationTask
}

/**
 * See [`Pallet::control_auto_migration`].
 */
export interface StateTrieMigrationCall_control_auto_migration {
    __kind: 'control_auto_migration'
    maybeConfig?: (MigrationLimits | undefined)
}

/**
 * See [`Pallet::force_set_progress`].
 */
export interface StateTrieMigrationCall_force_set_progress {
    __kind: 'force_set_progress'
    progressTop: Progress
    progressChild: Progress
}

/**
 * See [`Pallet::migrate_custom_child`].
 */
export interface StateTrieMigrationCall_migrate_custom_child {
    __kind: 'migrate_custom_child'
    root: Bytes
    childKeys: Bytes[]
    totalSize: number
}

/**
 * See [`Pallet::migrate_custom_top`].
 */
export interface StateTrieMigrationCall_migrate_custom_top {
    __kind: 'migrate_custom_top'
    keys: Bytes[]
    witnessSize: number
}

/**
 * See [`Pallet::set_signed_max_limits`].
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
 * See [`Pallet::claim`].
 */
export interface StakingCall_claim {
    __kind: 'claim'
    positionId: bigint
}

/**
 * See [`Pallet::increase_stake`].
 */
export interface StakingCall_increase_stake {
    __kind: 'increase_stake'
    positionId: bigint
    amount: bigint
}

/**
 * See [`Pallet::initialize_staking`].
 */
export interface StakingCall_initialize_staking {
    __kind: 'initialize_staking'
}

/**
 * See [`Pallet::stake`].
 */
export interface StakingCall_stake {
    __kind: 'stake'
    amount: bigint
}

/**
 * See [`Pallet::unstake`].
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
 * See [`Pallet::add_liquidity`].
 */
export interface StableswapCall_add_liquidity {
    __kind: 'add_liquidity'
    poolId: number
    assets: AssetAmount[]
}

/**
 * See [`Pallet::add_liquidity_shares`].
 */
export interface StableswapCall_add_liquidity_shares {
    __kind: 'add_liquidity_shares'
    poolId: number
    shares: bigint
    assetId: number
    maxAssetAmount: bigint
}

/**
 * See [`Pallet::buy`].
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
 * See [`Pallet::create_pool`].
 */
export interface StableswapCall_create_pool {
    __kind: 'create_pool'
    shareAsset: number
    assets: number[]
    amplification: number
    fee: Permill
}

/**
 * See [`Pallet::remove_liquidity_one_asset`].
 */
export interface StableswapCall_remove_liquidity_one_asset {
    __kind: 'remove_liquidity_one_asset'
    poolId: number
    assetId: number
    shareAmount: bigint
    minAmountOut: bigint
}

/**
 * See [`Pallet::sell`].
 */
export interface StableswapCall_sell {
    __kind: 'sell'
    poolId: number
    assetIn: number
    assetOut: number
    amountIn: bigint
    minBuyAmount: bigint
}

/**
 * See [`Pallet::set_asset_tradable_state`].
 */
export interface StableswapCall_set_asset_tradable_state {
    __kind: 'set_asset_tradable_state'
    poolId: number
    assetId: number
    state: Type_110
}

/**
 * See [`Pallet::update_amplification`].
 */
export interface StableswapCall_update_amplification {
    __kind: 'update_amplification'
    poolId: number
    finalAmplification: number
    startBlock: number
    endBlock: number
}

/**
 * See [`Pallet::update_pool_fee`].
 */
export interface StableswapCall_update_pool_fee {
    __kind: 'update_pool_fee'
    poolId: number
    fee: Permill
}

/**
 * See [`Pallet::withdraw_asset_amount`].
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
 * See [`Pallet::purge_keys`].
 */
export interface SessionCall_purge_keys {
    __kind: 'purge_keys'
}

/**
 * See [`Pallet::set_keys`].
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
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type SchedulerCall = SchedulerCall_cancel | SchedulerCall_cancel_named | SchedulerCall_schedule | SchedulerCall_schedule_after | SchedulerCall_schedule_named | SchedulerCall_schedule_named_after

/**
 * See [`Pallet::cancel`].
 */
export interface SchedulerCall_cancel {
    __kind: 'cancel'
    when: number
    index: number
}

/**
 * See [`Pallet::cancel_named`].
 */
export interface SchedulerCall_cancel_named {
    __kind: 'cancel_named'
    id: Bytes
}

/**
 * See [`Pallet::schedule`].
 */
export interface SchedulerCall_schedule {
    __kind: 'schedule'
    when: number
    maybePeriodic?: ([number, number] | undefined)
    priority: number
    call: Call
}

/**
 * See [`Pallet::schedule_after`].
 */
export interface SchedulerCall_schedule_after {
    __kind: 'schedule_after'
    after: number
    maybePeriodic?: ([number, number] | undefined)
    priority: number
    call: Call
}

/**
 * See [`Pallet::schedule_named`].
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
 * See [`Pallet::schedule_named_after`].
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
            assetPair: Type_373,
            newRoute: sts.array(() => Trade),
        }),
        sell: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            minAmountOut: sts.bigint(),
            route: sts.array(() => Trade),
        }),
        set_route: sts.enumStruct({
            assetPair: Type_373,
            newRoute: sts.array(() => Trade),
        }),
    }
})

export const Type_373: sts.Type<Type_373> = sts.struct(() => {
    return  {
        assetIn: sts.number(),
        assetOut: sts.number(),
    }
})

export interface Type_373 {
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
export type RouterCall = RouterCall_buy | RouterCall_force_insert_route | RouterCall_sell | RouterCall_set_route

/**
 * See [`Pallet::buy`].
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
 * See [`Pallet::force_insert_route`].
 */
export interface RouterCall_force_insert_route {
    __kind: 'force_insert_route'
    assetPair: Type_373
    newRoute: Trade[]
}

/**
 * See [`Pallet::sell`].
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
 * See [`Pallet::set_route`].
 */
export interface RouterCall_set_route {
    __kind: 'set_route'
    assetPair: Type_373
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
 * See [`Pallet::claim_rewards`].
 */
export interface ReferralsCall_claim_rewards {
    __kind: 'claim_rewards'
}

/**
 * See [`Pallet::convert`].
 */
export interface ReferralsCall_convert {
    __kind: 'convert'
    assetId: number
}

/**
 * See [`Pallet::link_code`].
 */
export interface ReferralsCall_link_code {
    __kind: 'link_code'
    code: Bytes
}

/**
 * See [`Pallet::register_code`].
 */
export interface ReferralsCall_register_code {
    __kind: 'register_code'
    code: Bytes
}

/**
 * See [`Pallet::set_reward_percentage`].
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
 * See [`Pallet::add_proxy`].
 */
export interface ProxyCall_add_proxy {
    __kind: 'add_proxy'
    delegate: AccountId32
    proxyType: ProxyType
    delay: number
}

/**
 * See [`Pallet::announce`].
 */
export interface ProxyCall_announce {
    __kind: 'announce'
    real: AccountId32
    callHash: H256
}

/**
 * See [`Pallet::create_pure`].
 */
export interface ProxyCall_create_pure {
    __kind: 'create_pure'
    proxyType: ProxyType
    delay: number
    index: number
}

/**
 * See [`Pallet::kill_pure`].
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
 * See [`Pallet::proxy`].
 */
export interface ProxyCall_proxy {
    __kind: 'proxy'
    real: AccountId32
    forceProxyType?: (ProxyType | undefined)
    call: Call
}

/**
 * See [`Pallet::proxy_announced`].
 */
export interface ProxyCall_proxy_announced {
    __kind: 'proxy_announced'
    delegate: AccountId32
    real: AccountId32
    forceProxyType?: (ProxyType | undefined)
    call: Call
}

/**
 * See [`Pallet::reject_announcement`].
 */
export interface ProxyCall_reject_announcement {
    __kind: 'reject_announcement'
    delegate: AccountId32
    callHash: H256
}

/**
 * See [`Pallet::remove_announcement`].
 */
export interface ProxyCall_remove_announcement {
    __kind: 'remove_announcement'
    real: AccountId32
    callHash: H256
}

/**
 * See [`Pallet::remove_proxies`].
 */
export interface ProxyCall_remove_proxies {
    __kind: 'remove_proxies'
}

/**
 * See [`Pallet::remove_proxy`].
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
 * See [`Pallet::ensure_updated`].
 */
export interface PreimageCall_ensure_updated {
    __kind: 'ensure_updated'
    hashes: H256[]
}

/**
 * See [`Pallet::note_preimage`].
 */
export interface PreimageCall_note_preimage {
    __kind: 'note_preimage'
    bytes: Bytes
}

/**
 * See [`Pallet::request_preimage`].
 */
export interface PreimageCall_request_preimage {
    __kind: 'request_preimage'
    hash: H256
}

/**
 * See [`Pallet::unnote_preimage`].
 */
export interface PreimageCall_unnote_preimage {
    __kind: 'unnote_preimage'
    hash: H256
}

/**
 * See [`Pallet::unrequest_preimage`].
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
        execute: sts.enumStruct({
            message: Type_449,
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
    }
})

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

export const Type_449: sts.Type<Type_449> = sts.closedEnum(() => {
    return  {
        V2: sts.array(() => Type_452),
        V3: sts.array(() => Type_456),
        V4: sts.array(() => Type_459),
    }
})

export const Type_459: sts.Type<Type_459> = sts.closedEnum(() => {
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
        SetAppendix: sts.array(() => Type_459),
        SetErrorHandler: sts.array(() => Type_459),
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
            call: Type_453,
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

export const Type_453: sts.Type<Type_453> = sts.struct(() => {
    return  {
        encoded: sts.bytes(),
    }
})

export interface Type_453 {
    encoded: Bytes
}

export type Type_459 = Type_459_AliasOrigin | Type_459_BurnAsset | Type_459_BuyExecution | Type_459_ClaimAsset | Type_459_ClearError | Type_459_ClearOrigin | Type_459_ClearTopic | Type_459_ClearTransactStatus | Type_459_DepositAsset | Type_459_DepositReserveAsset | Type_459_DescendOrigin | Type_459_ExchangeAsset | Type_459_ExpectAsset | Type_459_ExpectError | Type_459_ExpectOrigin | Type_459_ExpectPallet | Type_459_ExpectTransactStatus | Type_459_ExportMessage | Type_459_HrmpChannelAccepted | Type_459_HrmpChannelClosing | Type_459_HrmpNewChannelOpenRequest | Type_459_InitiateReserveWithdraw | Type_459_InitiateTeleport | Type_459_LockAsset | Type_459_NoteUnlockable | Type_459_QueryPallet | Type_459_QueryResponse | Type_459_ReceiveTeleportedAsset | Type_459_RefundSurplus | Type_459_ReportError | Type_459_ReportHolding | Type_459_ReportTransactStatus | Type_459_RequestUnlock | Type_459_ReserveAssetDeposited | Type_459_SetAppendix | Type_459_SetErrorHandler | Type_459_SetFeesMode | Type_459_SetTopic | Type_459_SubscribeVersion | Type_459_Transact | Type_459_TransferAsset | Type_459_TransferReserveAsset | Type_459_Trap | Type_459_UniversalOrigin | Type_459_UnlockAsset | Type_459_UnpaidExecution | Type_459_UnsubscribeVersion | Type_459_WithdrawAsset

export interface Type_459_AliasOrigin {
    __kind: 'AliasOrigin'
    value: V4Location
}

export interface Type_459_BurnAsset {
    __kind: 'BurnAsset'
    value: V4Asset[]
}

export interface Type_459_BuyExecution {
    __kind: 'BuyExecution'
    fees: V4Asset
    weightLimit: V3WeightLimit
}

export interface Type_459_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V4Asset[]
    ticket: V4Location
}

export interface Type_459_ClearError {
    __kind: 'ClearError'
}

export interface Type_459_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface Type_459_ClearTopic {
    __kind: 'ClearTopic'
}

export interface Type_459_ClearTransactStatus {
    __kind: 'ClearTransactStatus'
}

export interface Type_459_DepositAsset {
    __kind: 'DepositAsset'
    assets: V4AssetFilter
    beneficiary: V4Location
}

export interface Type_459_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V4AssetFilter
    dest: V4Location
    xcm: V4Instruction[]
}

export interface Type_459_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V4Junctions
}

export interface Type_459_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V4AssetFilter
    want: V4Asset[]
    maximal: boolean
}

export interface Type_459_ExpectAsset {
    __kind: 'ExpectAsset'
    value: V4Asset[]
}

export interface Type_459_ExpectError {
    __kind: 'ExpectError'
    value?: ([number, V3Error] | undefined)
}

export interface Type_459_ExpectOrigin {
    __kind: 'ExpectOrigin'
    value?: (V4Location | undefined)
}

export interface Type_459_ExpectPallet {
    __kind: 'ExpectPallet'
    index: number
    name: Bytes
    moduleName: Bytes
    crateMajor: number
    minCrateMinor: number
}

export interface Type_459_ExpectTransactStatus {
    __kind: 'ExpectTransactStatus'
    value: V3MaybeErrorCode
}

export interface Type_459_ExportMessage {
    __kind: 'ExportMessage'
    network: V4NetworkId
    destination: V4Junctions
    xcm: V4Instruction[]
}

export interface Type_459_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface Type_459_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface Type_459_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface Type_459_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V4AssetFilter
    reserve: V4Location
    xcm: V4Instruction[]
}

export interface Type_459_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V4AssetFilter
    dest: V4Location
    xcm: V4Instruction[]
}

export interface Type_459_LockAsset {
    __kind: 'LockAsset'
    asset: V4Asset
    unlocker: V4Location
}

export interface Type_459_NoteUnlockable {
    __kind: 'NoteUnlockable'
    asset: V4Asset
    owner: V4Location
}

export interface Type_459_QueryPallet {
    __kind: 'QueryPallet'
    moduleName: Bytes
    responseInfo: V4QueryResponseInfo
}

export interface Type_459_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V4Response
    maxWeight: Weight
    querier?: (V4Location | undefined)
}

export interface Type_459_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V4Asset[]
}

export interface Type_459_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface Type_459_ReportError {
    __kind: 'ReportError'
    value: V4QueryResponseInfo
}

export interface Type_459_ReportHolding {
    __kind: 'ReportHolding'
    responseInfo: V4QueryResponseInfo
    assets: V4AssetFilter
}

export interface Type_459_ReportTransactStatus {
    __kind: 'ReportTransactStatus'
    value: V4QueryResponseInfo
}

export interface Type_459_RequestUnlock {
    __kind: 'RequestUnlock'
    asset: V4Asset
    locker: V4Location
}

export interface Type_459_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V4Asset[]
}

export interface Type_459_SetAppendix {
    __kind: 'SetAppendix'
    value: Type_459[]
}

export interface Type_459_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: Type_459[]
}

export interface Type_459_SetFeesMode {
    __kind: 'SetFeesMode'
    jitWithdraw: boolean
}

export interface Type_459_SetTopic {
    __kind: 'SetTopic'
    value: Bytes
}

export interface Type_459_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: Weight
}

export interface Type_459_Transact {
    __kind: 'Transact'
    originKind: V2OriginKind
    requireWeightAtMost: Weight
    call: Type_453
}

export interface Type_459_TransferAsset {
    __kind: 'TransferAsset'
    assets: V4Asset[]
    beneficiary: V4Location
}

export interface Type_459_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V4Asset[]
    dest: V4Location
    xcm: V4Instruction[]
}

export interface Type_459_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface Type_459_UniversalOrigin {
    __kind: 'UniversalOrigin'
    value: V4Junction
}

export interface Type_459_UnlockAsset {
    __kind: 'UnlockAsset'
    asset: V4Asset
    target: V4Location
}

export interface Type_459_UnpaidExecution {
    __kind: 'UnpaidExecution'
    weightLimit: V3WeightLimit
    checkOrigin?: (V4Location | undefined)
}

export interface Type_459_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface Type_459_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V4Asset[]
}

export const Type_456: sts.Type<Type_456> = sts.closedEnum(() => {
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
            call: Type_453,
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

export type Type_456 = Type_456_AliasOrigin | Type_456_BurnAsset | Type_456_BuyExecution | Type_456_ClaimAsset | Type_456_ClearError | Type_456_ClearOrigin | Type_456_ClearTopic | Type_456_ClearTransactStatus | Type_456_DepositAsset | Type_456_DepositReserveAsset | Type_456_DescendOrigin | Type_456_ExchangeAsset | Type_456_ExpectAsset | Type_456_ExpectError | Type_456_ExpectOrigin | Type_456_ExpectPallet | Type_456_ExpectTransactStatus | Type_456_ExportMessage | Type_456_HrmpChannelAccepted | Type_456_HrmpChannelClosing | Type_456_HrmpNewChannelOpenRequest | Type_456_InitiateReserveWithdraw | Type_456_InitiateTeleport | Type_456_LockAsset | Type_456_NoteUnlockable | Type_456_QueryPallet | Type_456_QueryResponse | Type_456_ReceiveTeleportedAsset | Type_456_RefundSurplus | Type_456_ReportError | Type_456_ReportHolding | Type_456_ReportTransactStatus | Type_456_RequestUnlock | Type_456_ReserveAssetDeposited | Type_456_SetAppendix | Type_456_SetErrorHandler | Type_456_SetFeesMode | Type_456_SetTopic | Type_456_SubscribeVersion | Type_456_Transact | Type_456_TransferAsset | Type_456_TransferReserveAsset | Type_456_Trap | Type_456_UniversalOrigin | Type_456_UnlockAsset | Type_456_UnpaidExecution | Type_456_UnsubscribeVersion | Type_456_WithdrawAsset

export interface Type_456_AliasOrigin {
    __kind: 'AliasOrigin'
    value: V3MultiLocation
}

export interface Type_456_BurnAsset {
    __kind: 'BurnAsset'
    value: V3MultiAsset[]
}

export interface Type_456_BuyExecution {
    __kind: 'BuyExecution'
    fees: V3MultiAsset
    weightLimit: V3WeightLimit
}

export interface Type_456_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V3MultiAsset[]
    ticket: V3MultiLocation
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
    assets: V3MultiAssetFilter
    beneficiary: V3MultiLocation
}

export interface Type_456_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V3MultiAssetFilter
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface Type_456_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V3Junctions
}

export interface Type_456_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V3MultiAssetFilter
    want: V3MultiAsset[]
    maximal: boolean
}

export interface Type_456_ExpectAsset {
    __kind: 'ExpectAsset'
    value: V3MultiAsset[]
}

export interface Type_456_ExpectError {
    __kind: 'ExpectError'
    value?: ([number, V3Error] | undefined)
}

export interface Type_456_ExpectOrigin {
    __kind: 'ExpectOrigin'
    value?: (V3MultiLocation | undefined)
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
    network: V3NetworkId
    destination: V3Junctions
    xcm: V3Instruction[]
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
    assets: V3MultiAssetFilter
    reserve: V3MultiLocation
    xcm: V3Instruction[]
}

export interface Type_456_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V3MultiAssetFilter
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface Type_456_LockAsset {
    __kind: 'LockAsset'
    asset: V3MultiAsset
    unlocker: V3MultiLocation
}

export interface Type_456_NoteUnlockable {
    __kind: 'NoteUnlockable'
    asset: V3MultiAsset
    owner: V3MultiLocation
}

export interface Type_456_QueryPallet {
    __kind: 'QueryPallet'
    moduleName: Bytes
    responseInfo: V3QueryResponseInfo
}

export interface Type_456_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V3Response
    maxWeight: Weight
    querier?: (V3MultiLocation | undefined)
}

export interface Type_456_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V3MultiAsset[]
}

export interface Type_456_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface Type_456_ReportError {
    __kind: 'ReportError'
    value: V3QueryResponseInfo
}

export interface Type_456_ReportHolding {
    __kind: 'ReportHolding'
    responseInfo: V3QueryResponseInfo
    assets: V3MultiAssetFilter
}

export interface Type_456_ReportTransactStatus {
    __kind: 'ReportTransactStatus'
    value: V3QueryResponseInfo
}

export interface Type_456_RequestUnlock {
    __kind: 'RequestUnlock'
    asset: V3MultiAsset
    locker: V3MultiLocation
}

export interface Type_456_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V3MultiAsset[]
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
    call: Type_453
}

export interface Type_456_TransferAsset {
    __kind: 'TransferAsset'
    assets: V3MultiAsset[]
    beneficiary: V3MultiLocation
}

export interface Type_456_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V3MultiAsset[]
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface Type_456_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface Type_456_UniversalOrigin {
    __kind: 'UniversalOrigin'
    value: V3Junction
}

export interface Type_456_UnlockAsset {
    __kind: 'UnlockAsset'
    asset: V3MultiAsset
    target: V3MultiLocation
}

export interface Type_456_UnpaidExecution {
    __kind: 'UnpaidExecution'
    weightLimit: V3WeightLimit
    checkOrigin?: (V3MultiLocation | undefined)
}

export interface Type_456_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface Type_456_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V3MultiAsset[]
}

export const Type_452: sts.Type<Type_452> = sts.closedEnum(() => {
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
        SetAppendix: sts.array(() => Type_452),
        SetErrorHandler: sts.array(() => Type_452),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: sts.bigint(),
        }),
        Transact: sts.enumStruct({
            originType: V2OriginKind,
            requireWeightAtMost: sts.bigint(),
            call: Type_453,
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

export type Type_452 = Type_452_BuyExecution | Type_452_ClaimAsset | Type_452_ClearError | Type_452_ClearOrigin | Type_452_DepositAsset | Type_452_DepositReserveAsset | Type_452_DescendOrigin | Type_452_ExchangeAsset | Type_452_HrmpChannelAccepted | Type_452_HrmpChannelClosing | Type_452_HrmpNewChannelOpenRequest | Type_452_InitiateReserveWithdraw | Type_452_InitiateTeleport | Type_452_QueryHolding | Type_452_QueryResponse | Type_452_ReceiveTeleportedAsset | Type_452_RefundSurplus | Type_452_ReportError | Type_452_ReserveAssetDeposited | Type_452_SetAppendix | Type_452_SetErrorHandler | Type_452_SubscribeVersion | Type_452_Transact | Type_452_TransferAsset | Type_452_TransferReserveAsset | Type_452_Trap | Type_452_UnsubscribeVersion | Type_452_WithdrawAsset

export interface Type_452_BuyExecution {
    __kind: 'BuyExecution'
    fees: V2MultiAsset
    weightLimit: V2WeightLimit
}

export interface Type_452_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V2MultiAsset[]
    ticket: V2MultiLocation
}

export interface Type_452_ClearError {
    __kind: 'ClearError'
}

export interface Type_452_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface Type_452_DepositAsset {
    __kind: 'DepositAsset'
    assets: V2MultiAssetFilter
    maxAssets: number
    beneficiary: V2MultiLocation
}

export interface Type_452_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V2MultiAssetFilter
    maxAssets: number
    dest: V2MultiLocation
    xcm: V2Instruction[]
}

export interface Type_452_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V2Junctions
}

export interface Type_452_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V2MultiAssetFilter
    receive: V2MultiAsset[]
}

export interface Type_452_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface Type_452_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface Type_452_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface Type_452_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V2MultiAssetFilter
    reserve: V2MultiLocation
    xcm: V2Instruction[]
}

export interface Type_452_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V2MultiAssetFilter
    dest: V2MultiLocation
    xcm: V2Instruction[]
}

export interface Type_452_QueryHolding {
    __kind: 'QueryHolding'
    queryId: bigint
    dest: V2MultiLocation
    assets: V2MultiAssetFilter
    maxResponseWeight: bigint
}

export interface Type_452_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V2Response
    maxWeight: bigint
}

export interface Type_452_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V2MultiAsset[]
}

export interface Type_452_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface Type_452_ReportError {
    __kind: 'ReportError'
    queryId: bigint
    dest: V2MultiLocation
    maxResponseWeight: bigint
}

export interface Type_452_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V2MultiAsset[]
}

export interface Type_452_SetAppendix {
    __kind: 'SetAppendix'
    value: Type_452[]
}

export interface Type_452_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: Type_452[]
}

export interface Type_452_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: bigint
}

export interface Type_452_Transact {
    __kind: 'Transact'
    originType: V2OriginKind
    requireWeightAtMost: bigint
    call: Type_453
}

export interface Type_452_TransferAsset {
    __kind: 'TransferAsset'
    assets: V2MultiAsset[]
    beneficiary: V2MultiLocation
}

export interface Type_452_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V2MultiAsset[]
    dest: V2MultiLocation
    xcm: V2Instruction[]
}

export interface Type_452_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface Type_452_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface Type_452_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V2MultiAsset[]
}

export type Type_449 = Type_449_V2 | Type_449_V3 | Type_449_V4

export interface Type_449_V2 {
    __kind: 'V2'
    value: Type_452[]
}

export interface Type_449_V3 {
    __kind: 'V3'
    value: Type_456[]
}

export interface Type_449_V4 {
    __kind: 'V4'
    value: Type_459[]
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type PolkadotXcmCall = PolkadotXcmCall_execute | PolkadotXcmCall_force_default_xcm_version | PolkadotXcmCall_force_subscribe_version_notify | PolkadotXcmCall_force_suspension | PolkadotXcmCall_force_unsubscribe_version_notify | PolkadotXcmCall_force_xcm_version | PolkadotXcmCall_limited_reserve_transfer_assets | PolkadotXcmCall_limited_teleport_assets | PolkadotXcmCall_reserve_transfer_assets | PolkadotXcmCall_send | PolkadotXcmCall_teleport_assets | PolkadotXcmCall_transfer_assets

/**
 * See [`Pallet::execute`].
 */
export interface PolkadotXcmCall_execute {
    __kind: 'execute'
    message: Type_449
    maxWeight: Weight
}

/**
 * See [`Pallet::force_default_xcm_version`].
 */
export interface PolkadotXcmCall_force_default_xcm_version {
    __kind: 'force_default_xcm_version'
    maybeXcmVersion?: (number | undefined)
}

/**
 * See [`Pallet::force_subscribe_version_notify`].
 */
export interface PolkadotXcmCall_force_subscribe_version_notify {
    __kind: 'force_subscribe_version_notify'
    location: VersionedLocation
}

/**
 * See [`Pallet::force_suspension`].
 */
export interface PolkadotXcmCall_force_suspension {
    __kind: 'force_suspension'
    suspended: boolean
}

/**
 * See [`Pallet::force_unsubscribe_version_notify`].
 */
export interface PolkadotXcmCall_force_unsubscribe_version_notify {
    __kind: 'force_unsubscribe_version_notify'
    location: VersionedLocation
}

/**
 * See [`Pallet::force_xcm_version`].
 */
export interface PolkadotXcmCall_force_xcm_version {
    __kind: 'force_xcm_version'
    location: V4Location
    version: number
}

/**
 * See [`Pallet::limited_reserve_transfer_assets`].
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
 * See [`Pallet::limited_teleport_assets`].
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
 * See [`Pallet::reserve_transfer_assets`].
 */
export interface PolkadotXcmCall_reserve_transfer_assets {
    __kind: 'reserve_transfer_assets'
    dest: VersionedLocation
    beneficiary: VersionedLocation
    assets: VersionedAssets
    feeAssetItem: number
}

/**
 * See [`Pallet::send`].
 */
export interface PolkadotXcmCall_send {
    __kind: 'send'
    dest: VersionedLocation
    message: VersionedXcm
}

/**
 * See [`Pallet::teleport_assets`].
 */
export interface PolkadotXcmCall_teleport_assets {
    __kind: 'teleport_assets'
    dest: VersionedLocation
    beneficiary: VersionedLocation
    assets: VersionedAssets
    feeAssetItem: number
}

/**
 * See [`Pallet::transfer_assets`].
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
        validationData: V6PersistedValidationData,
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

export const V6PersistedValidationData: sts.Type<V6PersistedValidationData> = sts.struct(() => {
    return  {
        parentHead: HeadData,
        relayParentNumber: sts.number(),
        relayParentStorageRoot: H256,
        maxPovSize: sts.number(),
    }
})

export const HeadData = sts.bytes()

export interface V6PersistedValidationData {
    parentHead: HeadData
    relayParentNumber: number
    relayParentStorageRoot: H256
    maxPovSize: number
}

export type HeadData = Bytes

export interface ParachainInherentData {
    validationData: V6PersistedValidationData
    relayChainState: StorageProof
    downwardMessages: InboundDownwardMessage[]
    horizontalMessages: [Id, InboundHrmpMessage[]][]
}

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type ParachainSystemCall = ParachainSystemCall_authorize_upgrade | ParachainSystemCall_enact_authorized_upgrade | ParachainSystemCall_set_validation_data | ParachainSystemCall_sudo_send_upward_message

/**
 * See [`Pallet::authorize_upgrade`].
 */
export interface ParachainSystemCall_authorize_upgrade {
    __kind: 'authorize_upgrade'
    codeHash: H256
    checkVersion: boolean
}

/**
 * See [`Pallet::enact_authorized_upgrade`].
 */
export interface ParachainSystemCall_enact_authorized_upgrade {
    __kind: 'enact_authorized_upgrade'
    code: Bytes
}

/**
 * See [`Pallet::set_validation_data`].
 */
export interface ParachainSystemCall_set_validation_data {
    __kind: 'set_validation_data'
    data: ParachainInherentData
}

/**
 * See [`Pallet::sudo_send_upward_message`].
 */
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
 * See [`Pallet::settle_otc_order`].
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
 * See [`Pallet::send_as_sovereign`].
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
export type OmnipoolLiquidityMiningCall = OmnipoolLiquidityMiningCall_claim_rewards | OmnipoolLiquidityMiningCall_create_global_farm | OmnipoolLiquidityMiningCall_create_yield_farm | OmnipoolLiquidityMiningCall_deposit_shares | OmnipoolLiquidityMiningCall_redeposit_shares | OmnipoolLiquidityMiningCall_resume_yield_farm | OmnipoolLiquidityMiningCall_stop_yield_farm | OmnipoolLiquidityMiningCall_terminate_global_farm | OmnipoolLiquidityMiningCall_terminate_yield_farm | OmnipoolLiquidityMiningCall_update_yield_farm | OmnipoolLiquidityMiningCall_withdraw_shares

/**
 * See [`Pallet::claim_rewards`].
 */
export interface OmnipoolLiquidityMiningCall_claim_rewards {
    __kind: 'claim_rewards'
    depositId: bigint
    yieldFarmId: number
}

/**
 * See [`Pallet::create_global_farm`].
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
 * See [`Pallet::create_yield_farm`].
 */
export interface OmnipoolLiquidityMiningCall_create_yield_farm {
    __kind: 'create_yield_farm'
    globalFarmId: number
    assetId: number
    multiplier: FixedU128
    loyaltyCurve?: (LoyaltyCurve | undefined)
}

/**
 * See [`Pallet::deposit_shares`].
 */
export interface OmnipoolLiquidityMiningCall_deposit_shares {
    __kind: 'deposit_shares'
    globalFarmId: number
    yieldFarmId: number
    positionId: bigint
}

/**
 * See [`Pallet::redeposit_shares`].
 */
export interface OmnipoolLiquidityMiningCall_redeposit_shares {
    __kind: 'redeposit_shares'
    globalFarmId: number
    yieldFarmId: number
    depositId: bigint
}

/**
 * See [`Pallet::resume_yield_farm`].
 */
export interface OmnipoolLiquidityMiningCall_resume_yield_farm {
    __kind: 'resume_yield_farm'
    globalFarmId: number
    yieldFarmId: number
    assetId: number
    multiplier: FixedU128
}

/**
 * See [`Pallet::stop_yield_farm`].
 */
export interface OmnipoolLiquidityMiningCall_stop_yield_farm {
    __kind: 'stop_yield_farm'
    globalFarmId: number
    assetId: number
}

/**
 * See [`Pallet::terminate_global_farm`].
 */
export interface OmnipoolLiquidityMiningCall_terminate_global_farm {
    __kind: 'terminate_global_farm'
    globalFarmId: number
}

/**
 * See [`Pallet::terminate_yield_farm`].
 */
export interface OmnipoolLiquidityMiningCall_terminate_yield_farm {
    __kind: 'terminate_yield_farm'
    globalFarmId: number
    yieldFarmId: number
    assetId: number
}

/**
 * See [`Pallet::update_yield_farm`].
 */
export interface OmnipoolLiquidityMiningCall_update_yield_farm {
    __kind: 'update_yield_farm'
    globalFarmId: number
    assetId: number
    multiplier: FixedU128
}

/**
 * See [`Pallet::withdraw_shares`].
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
 * See [`Pallet::add_liquidity`].
 */
export interface OmnipoolCall_add_liquidity {
    __kind: 'add_liquidity'
    asset: number
    amount: bigint
}

/**
 * See [`Pallet::add_liquidity_with_limit`].
 */
export interface OmnipoolCall_add_liquidity_with_limit {
    __kind: 'add_liquidity_with_limit'
    asset: number
    amount: bigint
    minSharesLimit: bigint
}

/**
 * See [`Pallet::add_token`].
 */
export interface OmnipoolCall_add_token {
    __kind: 'add_token'
    asset: number
    initialPrice: FixedU128
    weightCap: Permill
    positionOwner: AccountId32
}

/**
 * See [`Pallet::buy`].
 */
export interface OmnipoolCall_buy {
    __kind: 'buy'
    assetOut: number
    assetIn: number
    amount: bigint
    maxSellAmount: bigint
}

/**
 * See [`Pallet::refund_refused_asset`].
 */
export interface OmnipoolCall_refund_refused_asset {
    __kind: 'refund_refused_asset'
    assetId: number
    amount: bigint
    recipient: AccountId32
}

/**
 * See [`Pallet::remove_liquidity`].
 */
export interface OmnipoolCall_remove_liquidity {
    __kind: 'remove_liquidity'
    positionId: bigint
    amount: bigint
}

/**
 * See [`Pallet::remove_liquidity_with_limit`].
 */
export interface OmnipoolCall_remove_liquidity_with_limit {
    __kind: 'remove_liquidity_with_limit'
    positionId: bigint
    amount: bigint
    minLimit: bigint
}

/**
 * See [`Pallet::remove_token`].
 */
export interface OmnipoolCall_remove_token {
    __kind: 'remove_token'
    assetId: number
    beneficiary: AccountId32
}

/**
 * See [`Pallet::sacrifice_position`].
 */
export interface OmnipoolCall_sacrifice_position {
    __kind: 'sacrifice_position'
    positionId: bigint
}

/**
 * See [`Pallet::sell`].
 */
export interface OmnipoolCall_sell {
    __kind: 'sell'
    assetIn: number
    assetOut: number
    amount: bigint
    minBuyAmount: bigint
}

/**
 * See [`Pallet::set_asset_tradable_state`].
 */
export interface OmnipoolCall_set_asset_tradable_state {
    __kind: 'set_asset_tradable_state'
    assetId: number
    state: Tradability
}

/**
 * See [`Pallet::set_asset_weight_cap`].
 */
export interface OmnipoolCall_set_asset_weight_cap {
    __kind: 'set_asset_weight_cap'
    assetId: number
    cap: Permill
}

/**
 * See [`Pallet::withdraw_protocol_liquidity`].
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
 * See [`Pallet::cancel_order`].
 */
export interface OTCCall_cancel_order {
    __kind: 'cancel_order'
    orderId: number
}

/**
 * See [`Pallet::fill_order`].
 */
export interface OTCCall_fill_order {
    __kind: 'fill_order'
    orderId: number
}

/**
 * See [`Pallet::partial_fill_order`].
 */
export interface OTCCall_partial_fill_order {
    __kind: 'partial_fill_order'
    orderId: number
    amountIn: bigint
}

/**
 * See [`Pallet::place_order`].
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
 * See [`Pallet::approve_as_multi`].
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
 * See [`Pallet::as_multi`].
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
 * See [`Pallet::as_multi_threshold_1`].
 */
export interface MultisigCall_as_multi_threshold_1 {
    __kind: 'as_multi_threshold_1'
    otherSignatories: AccountId32[]
    call: Call
}

/**
 * See [`Pallet::cancel_as_multi`].
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
 * See [`Pallet::add_currency`].
 */
export interface MultiTransactionPaymentCall_add_currency {
    __kind: 'add_currency'
    currency: number
    price: FixedU128
}

/**
 * See [`Pallet::dispatch_permit`].
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
 * See [`Pallet::remove_currency`].
 */
export interface MultiTransactionPaymentCall_remove_currency {
    __kind: 'remove_currency'
    currency: number
}

/**
 * See [`Pallet::reset_payment_currency`].
 */
export interface MultiTransactionPaymentCall_reset_payment_currency {
    __kind: 'reset_payment_currency'
    accountId: AccountId32
}

/**
 * See [`Pallet::set_currency`].
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
 * See [`Pallet::execute_overweight`].
 */
export interface MessageQueueCall_execute_overweight {
    __kind: 'execute_overweight'
    messageOrigin: AggregateMessageOrigin
    page: number
    index: number
    weightLimit: Weight
}

/**
 * See [`Pallet::reap_page`].
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
 * See [`Pallet::add_liquidity`].
 */
export interface LBPCall_add_liquidity {
    __kind: 'add_liquidity'
    amountA: [number, bigint]
    amountB: [number, bigint]
}

/**
 * See [`Pallet::buy`].
 */
export interface LBPCall_buy {
    __kind: 'buy'
    assetOut: number
    assetIn: number
    amount: bigint
    maxLimit: bigint
}

/**
 * See [`Pallet::create_pool`].
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
 * See [`Pallet::remove_liquidity`].
 */
export interface LBPCall_remove_liquidity {
    __kind: 'remove_liquidity'
    poolId: AccountId32
}

/**
 * See [`Pallet::sell`].
 */
export interface LBPCall_sell {
    __kind: 'sell'
    assetIn: number
    assetOut: number
    amount: bigint
    maxLimit: bigint
}

/**
 * See [`Pallet::update_pool_data`].
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
        Ed25519: Signature,
        Sr25519: sts.bytes(),
    }
})

export const Signature = sts.bytes()

export type MultiSignature = MultiSignature_Ecdsa | MultiSignature_Ed25519 | MultiSignature_Sr25519

export interface MultiSignature_Ecdsa {
    __kind: 'Ecdsa'
    value: Bytes
}

export interface MultiSignature_Ed25519 {
    __kind: 'Ed25519'
    value: Signature
}

export interface MultiSignature_Sr25519 {
    __kind: 'Sr25519'
    value: Bytes
}

export type Signature = Bytes

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
 * See [`Pallet::accept_username`].
 */
export interface IdentityCall_accept_username {
    __kind: 'accept_username'
    username: BoundedVec
}

/**
 * See [`Pallet::add_registrar`].
 */
export interface IdentityCall_add_registrar {
    __kind: 'add_registrar'
    account: AccountId32
}

/**
 * See [`Pallet::add_sub`].
 */
export interface IdentityCall_add_sub {
    __kind: 'add_sub'
    sub: AccountId32
    data: Data
}

/**
 * See [`Pallet::add_username_authority`].
 */
export interface IdentityCall_add_username_authority {
    __kind: 'add_username_authority'
    authority: AccountId32
    suffix: Bytes
    allocation: number
}

/**
 * See [`Pallet::cancel_request`].
 */
export interface IdentityCall_cancel_request {
    __kind: 'cancel_request'
    regIndex: number
}

/**
 * See [`Pallet::clear_identity`].
 */
export interface IdentityCall_clear_identity {
    __kind: 'clear_identity'
}

/**
 * See [`Pallet::kill_identity`].
 */
export interface IdentityCall_kill_identity {
    __kind: 'kill_identity'
    target: AccountId32
}

/**
 * See [`Pallet::provide_judgement`].
 */
export interface IdentityCall_provide_judgement {
    __kind: 'provide_judgement'
    regIndex: number
    target: AccountId32
    judgement: Judgement
    identity: H256
}

/**
 * See [`Pallet::quit_sub`].
 */
export interface IdentityCall_quit_sub {
    __kind: 'quit_sub'
}

/**
 * See [`Pallet::remove_dangling_username`].
 */
export interface IdentityCall_remove_dangling_username {
    __kind: 'remove_dangling_username'
    username: BoundedVec
}

/**
 * See [`Pallet::remove_expired_approval`].
 */
export interface IdentityCall_remove_expired_approval {
    __kind: 'remove_expired_approval'
    username: BoundedVec
}

/**
 * See [`Pallet::remove_sub`].
 */
export interface IdentityCall_remove_sub {
    __kind: 'remove_sub'
    sub: AccountId32
}

/**
 * See [`Pallet::remove_username_authority`].
 */
export interface IdentityCall_remove_username_authority {
    __kind: 'remove_username_authority'
    authority: AccountId32
}

/**
 * See [`Pallet::rename_sub`].
 */
export interface IdentityCall_rename_sub {
    __kind: 'rename_sub'
    sub: AccountId32
    data: Data
}

/**
 * See [`Pallet::request_judgement`].
 */
export interface IdentityCall_request_judgement {
    __kind: 'request_judgement'
    regIndex: number
    maxFee: bigint
}

/**
 * See [`Pallet::set_account_id`].
 */
export interface IdentityCall_set_account_id {
    __kind: 'set_account_id'
    index: number
    new: AccountId32
}

/**
 * See [`Pallet::set_fee`].
 */
export interface IdentityCall_set_fee {
    __kind: 'set_fee'
    index: number
    fee: bigint
}

/**
 * See [`Pallet::set_fields`].
 */
export interface IdentityCall_set_fields {
    __kind: 'set_fields'
    index: number
    fields: bigint
}

/**
 * See [`Pallet::set_identity`].
 */
export interface IdentityCall_set_identity {
    __kind: 'set_identity'
    info: IdentityInfo
}

/**
 * See [`Pallet::set_primary_username`].
 */
export interface IdentityCall_set_primary_username {
    __kind: 'set_primary_username'
    username: BoundedVec
}

/**
 * See [`Pallet::set_subs`].
 */
export interface IdentityCall_set_subs {
    __kind: 'set_subs'
    subs: [AccountId32, Data][]
}

/**
 * See [`Pallet::set_username_for`].
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
 * See [`Pallet::transact`].
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

/**
 * See [`Pallet::add_oracle`].
 */
export interface EmaOracleCall_add_oracle {
    __kind: 'add_oracle'
    source: Bytes
    assets: [number, number]
}

/**
 * See [`Pallet::remove_oracle`].
 */
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
 * See [`Pallet::clean_defunct_voters`].
 */
export interface ElectionsCall_clean_defunct_voters {
    __kind: 'clean_defunct_voters'
    numVoters: number
    numDefunct: number
}

/**
 * See [`Pallet::remove_member`].
 */
export interface ElectionsCall_remove_member {
    __kind: 'remove_member'
    who: AccountId32
    slashBond: boolean
    rerunElection: boolean
}

/**
 * See [`Pallet::remove_voter`].
 */
export interface ElectionsCall_remove_voter {
    __kind: 'remove_voter'
}

/**
 * See [`Pallet::renounce_candidacy`].
 */
export interface ElectionsCall_renounce_candidacy {
    __kind: 'renounce_candidacy'
    renouncing: Renouncing
}

/**
 * See [`Pallet::submit_candidacy`].
 */
export interface ElectionsCall_submit_candidacy {
    __kind: 'submit_candidacy'
    candidateCount: number
}

/**
 * See [`Pallet::vote`].
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
        bind_evm_address: sts.unit(),
        remove_contract_deployer: sts.enumStruct({
            address: H160,
        }),
        renounce_contract_deployer: sts.unit(),
    }
})

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type EVMAccountsCall = EVMAccountsCall_add_contract_deployer | EVMAccountsCall_bind_evm_address | EVMAccountsCall_remove_contract_deployer | EVMAccountsCall_renounce_contract_deployer

/**
 * See [`Pallet::add_contract_deployer`].
 */
export interface EVMAccountsCall_add_contract_deployer {
    __kind: 'add_contract_deployer'
    address: H160
}

/**
 * See [`Pallet::bind_evm_address`].
 */
export interface EVMAccountsCall_bind_evm_address {
    __kind: 'bind_evm_address'
}

/**
 * See [`Pallet::remove_contract_deployer`].
 */
export interface EVMAccountsCall_remove_contract_deployer {
    __kind: 'remove_contract_deployer'
    address: H160
}

/**
 * See [`Pallet::renounce_contract_deployer`].
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
 * See [`Pallet::call`].
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
 * See [`Pallet::create`].
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
 * See [`Pallet::create2`].
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
 * See [`Pallet::withdraw`].
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
 * See [`Pallet::add_nondustable_account`].
 */
export interface DusterCall_add_nondustable_account {
    __kind: 'add_nondustable_account'
    account: AccountId32
}

/**
 * See [`Pallet::dust_account`].
 */
export interface DusterCall_dust_account {
    __kind: 'dust_account'
    account: AccountId32
    currencyId: number
}

/**
 * See [`Pallet::remove_nondustable_account`].
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
export type DemocracyCall = DemocracyCall_blacklist | DemocracyCall_cancel_proposal | DemocracyCall_cancel_referendum | DemocracyCall_clear_public_proposals | DemocracyCall_delegate | DemocracyCall_emergency_cancel | DemocracyCall_external_propose | DemocracyCall_external_propose_default | DemocracyCall_external_propose_majority | DemocracyCall_fast_track | DemocracyCall_propose | DemocracyCall_remove_other_vote | DemocracyCall_remove_vote | DemocracyCall_second | DemocracyCall_set_metadata | DemocracyCall_undelegate | DemocracyCall_unlock | DemocracyCall_veto_external | DemocracyCall_vote

/**
 * See [`Pallet::blacklist`].
 */
export interface DemocracyCall_blacklist {
    __kind: 'blacklist'
    proposalHash: H256
    maybeRefIndex?: (number | undefined)
}

/**
 * See [`Pallet::cancel_proposal`].
 */
export interface DemocracyCall_cancel_proposal {
    __kind: 'cancel_proposal'
    propIndex: number
}

/**
 * See [`Pallet::cancel_referendum`].
 */
export interface DemocracyCall_cancel_referendum {
    __kind: 'cancel_referendum'
    refIndex: number
}

/**
 * See [`Pallet::clear_public_proposals`].
 */
export interface DemocracyCall_clear_public_proposals {
    __kind: 'clear_public_proposals'
}

/**
 * See [`Pallet::delegate`].
 */
export interface DemocracyCall_delegate {
    __kind: 'delegate'
    to: AccountId32
    conviction: Conviction
    balance: bigint
}

/**
 * See [`Pallet::emergency_cancel`].
 */
export interface DemocracyCall_emergency_cancel {
    __kind: 'emergency_cancel'
    refIndex: number
}

/**
 * See [`Pallet::external_propose`].
 */
export interface DemocracyCall_external_propose {
    __kind: 'external_propose'
    proposal: Bounded
}

/**
 * See [`Pallet::external_propose_default`].
 */
export interface DemocracyCall_external_propose_default {
    __kind: 'external_propose_default'
    proposal: Bounded
}

/**
 * See [`Pallet::external_propose_majority`].
 */
export interface DemocracyCall_external_propose_majority {
    __kind: 'external_propose_majority'
    proposal: Bounded
}

/**
 * See [`Pallet::fast_track`].
 */
export interface DemocracyCall_fast_track {
    __kind: 'fast_track'
    proposalHash: H256
    votingPeriod: number
    delay: number
}

/**
 * See [`Pallet::propose`].
 */
export interface DemocracyCall_propose {
    __kind: 'propose'
    proposal: Bounded
    value: bigint
}

/**
 * See [`Pallet::remove_other_vote`].
 */
export interface DemocracyCall_remove_other_vote {
    __kind: 'remove_other_vote'
    target: AccountId32
    index: number
}

/**
 * See [`Pallet::remove_vote`].
 */
export interface DemocracyCall_remove_vote {
    __kind: 'remove_vote'
    index: number
}

/**
 * See [`Pallet::second`].
 */
export interface DemocracyCall_second {
    __kind: 'second'
    proposal: number
}

/**
 * See [`Pallet::set_metadata`].
 */
export interface DemocracyCall_set_metadata {
    __kind: 'set_metadata'
    owner: MetadataOwner
    maybeHash?: (H256 | undefined)
}

/**
 * See [`Pallet::undelegate`].
 */
export interface DemocracyCall_undelegate {
    __kind: 'undelegate'
}

/**
 * See [`Pallet::unlock`].
 */
export interface DemocracyCall_unlock {
    __kind: 'unlock'
    target: AccountId32
}

/**
 * See [`Pallet::veto_external`].
 */
export interface DemocracyCall_veto_external {
    __kind: 'veto_external'
    proposalHash: H256
}

/**
 * See [`Pallet::vote`].
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
 * See [`Pallet::schedule`].
 */
export interface DCACall_schedule {
    __kind: 'schedule'
    schedule: Schedule
    startExecutionBlock?: (number | undefined)
}

/**
 * See [`Pallet::terminate`].
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
 * See [`Pallet::transfer`].
 */
export interface CurrenciesCall_transfer {
    __kind: 'transfer'
    dest: AccountId32
    currencyId: number
    amount: bigint
}

/**
 * See [`Pallet::transfer_native_currency`].
 */
export interface CurrenciesCall_transfer_native_currency {
    __kind: 'transfer_native_currency'
    dest: AccountId32
    amount: bigint
}

/**
 * See [`Pallet::update_balance`].
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
 * See [`Pallet::close`].
 */
export interface CouncilCall_close {
    __kind: 'close'
    proposalHash: H256
    index: number
    proposalWeightBound: Weight
    lengthBound: number
}

/**
 * See [`Pallet::disapprove_proposal`].
 */
export interface CouncilCall_disapprove_proposal {
    __kind: 'disapprove_proposal'
    proposalHash: H256
}

/**
 * See [`Pallet::execute`].
 */
export interface CouncilCall_execute {
    __kind: 'execute'
    proposal: Call
    lengthBound: number
}

/**
 * See [`Pallet::propose`].
 */
export interface CouncilCall_propose {
    __kind: 'propose'
    threshold: number
    proposal: Call
    lengthBound: number
}

/**
 * See [`Pallet::set_members`].
 */
export interface CouncilCall_set_members {
    __kind: 'set_members'
    newMembers: AccountId32[]
    prime?: (AccountId32 | undefined)
    oldCount: number
}

/**
 * See [`Pallet::vote`].
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
 * See [`Pallet::add_invulnerable`].
 */
export interface CollatorSelectionCall_add_invulnerable {
    __kind: 'add_invulnerable'
    who: AccountId32
}

/**
 * See [`Pallet::leave_intent`].
 */
export interface CollatorSelectionCall_leave_intent {
    __kind: 'leave_intent'
}

/**
 * See [`Pallet::register_as_candidate`].
 */
export interface CollatorSelectionCall_register_as_candidate {
    __kind: 'register_as_candidate'
}

/**
 * See [`Pallet::remove_invulnerable`].
 */
export interface CollatorSelectionCall_remove_invulnerable {
    __kind: 'remove_invulnerable'
    who: AccountId32
}

/**
 * See [`Pallet::set_candidacy_bond`].
 */
export interface CollatorSelectionCall_set_candidacy_bond {
    __kind: 'set_candidacy_bond'
    bond: bigint
}

/**
 * See [`Pallet::set_desired_candidates`].
 */
export interface CollatorSelectionCall_set_desired_candidates {
    __kind: 'set_desired_candidates'
    max: number
}

/**
 * See [`Pallet::set_invulnerables`].
 */
export interface CollatorSelectionCall_set_invulnerables {
    __kind: 'set_invulnerables'
    new: AccountId32[]
}

/**
 * See [`Pallet::take_candidate_slot`].
 */
export interface CollatorSelectionCall_take_candidate_slot {
    __kind: 'take_candidate_slot'
    deposit: bigint
    target: AccountId32
}

/**
 * See [`Pallet::update_bond`].
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
 * See [`Pallet::claim`].
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
 * See [`Pallet::set_add_liquidity_limit`].
 */
export interface CircuitBreakerCall_set_add_liquidity_limit {
    __kind: 'set_add_liquidity_limit'
    assetId: number
    liquidityLimit?: ([number, number] | undefined)
}

/**
 * See [`Pallet::set_remove_liquidity_limit`].
 */
export interface CircuitBreakerCall_set_remove_liquidity_limit {
    __kind: 'set_remove_liquidity_limit'
    assetId: number
    liquidityLimit?: ([number, number] | undefined)
}

/**
 * See [`Pallet::set_trade_volume_limit`].
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
 * See [`Pallet::issue`].
 */
export interface BondsCall_issue {
    __kind: 'issue'
    assetId: number
    amount: bigint
    maturity: bigint
}

/**
 * See [`Pallet::redeem`].
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

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type BalancesCall = BalancesCall_force_adjust_total_issuance | BalancesCall_force_set_balance | BalancesCall_force_transfer | BalancesCall_force_unreserve | BalancesCall_transfer_all | BalancesCall_transfer_allow_death | BalancesCall_transfer_keep_alive | BalancesCall_upgrade_accounts

/**
 * See [`Pallet::force_adjust_total_issuance`].
 */
export interface BalancesCall_force_adjust_total_issuance {
    __kind: 'force_adjust_total_issuance'
    direction: AdjustmentDirection
    delta: bigint
}

/**
 * See [`Pallet::force_set_balance`].
 */
export interface BalancesCall_force_set_balance {
    __kind: 'force_set_balance'
    who: AccountId32
    newFree: bigint
}

/**
 * See [`Pallet::force_transfer`].
 */
export interface BalancesCall_force_transfer {
    __kind: 'force_transfer'
    source: AccountId32
    dest: AccountId32
    value: bigint
}

/**
 * See [`Pallet::force_unreserve`].
 */
export interface BalancesCall_force_unreserve {
    __kind: 'force_unreserve'
    who: AccountId32
    amount: bigint
}

/**
 * See [`Pallet::transfer_all`].
 */
export interface BalancesCall_transfer_all {
    __kind: 'transfer_all'
    dest: AccountId32
    keepAlive: boolean
}

/**
 * See [`Pallet::transfer_allow_death`].
 */
export interface BalancesCall_transfer_allow_death {
    __kind: 'transfer_allow_death'
    dest: AccountId32
    value: bigint
}

/**
 * See [`Pallet::transfer_keep_alive`].
 */
export interface BalancesCall_transfer_keep_alive {
    __kind: 'transfer_keep_alive'
    dest: AccountId32
    value: bigint
}

/**
 * See [`Pallet::upgrade_accounts`].
 */
export interface BalancesCall_upgrade_accounts {
    __kind: 'upgrade_accounts'
    who: AccountId32[]
}

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

export const AssetType: sts.Type<AssetType> = sts.closedEnum(() => {
    return  {
        Bond: sts.unit(),
        External: sts.unit(),
        StableSwap: sts.unit(),
        Token: sts.unit(),
        XYK: sts.unit(),
    }
})

export type AssetType = AssetType_Bond | AssetType_External | AssetType_StableSwap | AssetType_Token | AssetType_XYK

export interface AssetType_Bond {
    __kind: 'Bond'
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

/**
 * Contains a variant per dispatchable extrinsic that this pallet has.
 */
export type AssetRegistryCall = AssetRegistryCall_ban_asset | AssetRegistryCall_register | AssetRegistryCall_register_external | AssetRegistryCall_unban_asset | AssetRegistryCall_update

/**
 * See [`Pallet::ban_asset`].
 */
export interface AssetRegistryCall_ban_asset {
    __kind: 'ban_asset'
    assetId: number
}

/**
 * See [`Pallet::register`].
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

/**
 * See [`Pallet::register_external`].
 */
export interface AssetRegistryCall_register_external {
    __kind: 'register_external'
    location: AssetLocation
}

/**
 * See [`Pallet::unban_asset`].
 */
export interface AssetRegistryCall_unban_asset {
    __kind: 'unban_asset'
    assetId: number
}

/**
 * See [`Pallet::update`].
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

export const AdjustmentDirection: sts.Type<AdjustmentDirection> = sts.closedEnum(() => {
    return  {
        Decrease: sts.unit(),
        Increase: sts.unit(),
    }
})
