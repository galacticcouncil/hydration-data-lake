import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Asset} from "./asset.model"
import {MoneyMarketReserveHistoricalData} from "./moneyMarketReserveHistoricalData.model"

@Entity_()
export class MoneyMarketReserve {
  constructor(props?: Partial<MoneyMarketReserve>) {
    Object.assign(this, props)
  }

  /**
   * <a_token_address>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  aToken!: Asset | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  underlyingAsset!: Asset | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  variableDebtToken!: Asset | undefined | null

  @Column_("text", {nullable: false})
  name!: string

  @Column_("text", {nullable: false})
  symbol!: string

  @Column_("text", {nullable: false})
  decimals!: string

  @Column_("text", {nullable: false})
  interestRateStrategyAddress!: string

  @Column_("bool", {nullable: true})
  isPaused!: boolean | undefined | null

  @Column_("bool", {nullable: true})
  isSiloedBorrowing!: boolean | undefined | null

  @OneToMany_(() => MoneyMarketReserveHistoricalData, e => e.reserve)
  historicalData!: MoneyMarketReserveHistoricalData[]
}
