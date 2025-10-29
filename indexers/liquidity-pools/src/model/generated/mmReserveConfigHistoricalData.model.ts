import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {MoneyMarketReserve} from "./moneyMarketReserve.model"

@Entity_()
export class MmReserveConfigHistoricalData {
    constructor(props?: Partial<MmReserveConfigHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <underlying_asset_address>-<para_block_height>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => MoneyMarketReserve, {nullable: true})
    reserve!: MoneyMarketReserve

    @StringColumn_({nullable: false})
    interestRateStrategyAddress!: string

    @StringColumn_({nullable: true})
    priceOracle!: string | undefined | null

    @BigIntColumn_({nullable: true})
    reserveFactor!: bigint | undefined | null

    @BooleanColumn_({nullable: true})
    usageAsCollateralEnabled!: boolean | undefined | null

    @BooleanColumn_({nullable: true})
    borrowingEnabled!: boolean | undefined | null

    @BooleanColumn_({nullable: true})
    isActive!: boolean | undefined | null

    @BooleanColumn_({nullable: true})
    isFrozen!: boolean | undefined | null

    @BooleanColumn_({nullable: true})
    isPaused!: boolean | undefined | null

    @BooleanColumn_({nullable: true})
    isSiloedBorrowing!: boolean | undefined | null

    @BigIntColumn_({nullable: true})
    accruedToTreasury!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    unbacked!: bigint | undefined | null

    @BooleanColumn_({nullable: true})
    flashLoanEnabled!: boolean | undefined | null

    @BigIntColumn_({nullable: true})
    debtCeiling!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    debtCeilingDecimals!: bigint | undefined | null

    @IntColumn_({nullable: true})
    eModeCategoryId!: number | undefined | null

    @BigIntColumn_({nullable: true})
    borrowCap!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    supplyCap!: bigint | undefined | null

    @BooleanColumn_({nullable: true})
    borrowableInIsolation!: boolean | undefined | null

    @BigIntColumn_({nullable: true})
    baseLTVasCollateral!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    reserveLiquidationThreshold!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    reserveLiquidationBonus!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    variableRateSlope1!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    variableRateSlope2!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    baseVariableBorrowRate!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    optimalUsageRatio!: bigint | undefined | null

    @DateTimeColumn_({nullable: true})
    lastUpdateTimestamp!: Date | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number
}
