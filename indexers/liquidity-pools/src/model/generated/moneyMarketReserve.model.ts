import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Aavepool} from "./aavepool.model"
import {MmReserveIndexesHistoricalData} from "./mmReserveIndexesHistoricalData.model"
import {MmReserveConfigHistoricalData} from "./mmReserveConfigHistoricalData.model"

@Entity_()
export class MoneyMarketReserve {
  constructor(props?: Partial<MoneyMarketReserve>) {
    Object.assign(this, props)
  }

  /**
   * <underlying_asset_address>-<money-market-pool-address>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  aTokenId!: string

  @Column_("text", {nullable: false})
  underlyingAssetId!: string

  @Column_("text", {nullable: false})
  variableDebtTokenId!: string

  @Index_()
  @ManyToOne_(() => Aavepool, {nullable: true})
  aavePool!: Aavepool | undefined | null

  @Column_("text", {nullable: false})
  name!: string

  @Column_("text", {nullable: false})
  symbol!: string

  @Column_("int4", {nullable: false})
  decimals!: number

  @OneToMany_(() => MmReserveIndexesHistoricalData, e => e.reserve)
  indexesHistoricalData!: MmReserveIndexesHistoricalData[]

  @OneToMany_(() => MmReserveConfigHistoricalData, e => e.reserve)
  configHistoricalData!: MmReserveConfigHistoricalData[]
}
