import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
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

  @Column_("text", {nullable: false})
  interestRateStrategyAddress!: string

  @Column_("text", {nullable: true})
  priceOracle!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  reserveFactor!: bigint | undefined | null

  @Column_("bool", {nullable: true})
  usageAsCollateralEnabled!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  borrowingEnabled!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  isActive!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  isFrozen!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  isPaused!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  isSiloedBorrowing!: boolean | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  accruedToTreasury!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  unbacked!: bigint | undefined | null

  @Column_("bool", {nullable: true})
  flashLoanEnabled!: boolean | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  debtCeiling!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  debtCeilingDecimals!: bigint | undefined | null

  @Column_("int4", {nullable: true})
  eModeCategoryId!: number | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  borrowCap!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  supplyCap!: bigint | undefined | null

  @Column_("bool", {nullable: true})
  borrowableInIsolation!: boolean | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  baseLTVasCollateral!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  reserveLiquidationThreshold!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  reserveLiquidationBonus!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  variableRateSlope1!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  variableRateSlope2!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  baseVariableBorrowRate!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  optimalUsageRatio!: bigint | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  lastUpdateTimestamp!: Date | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: true})
  blockId!: string | undefined | null
}
