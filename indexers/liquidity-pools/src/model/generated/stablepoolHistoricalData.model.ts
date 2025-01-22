import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Stablepool} from "./stablepool.model"
import {StablepoolAssetHistoricalData} from "./stablepoolAssetHistoricalData.model"

@Entity_()
export class StablepoolHistoricalData {
  constructor(props?: Partial<StablepoolHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * stablepoolId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Stablepool, {nullable: true})
  pool!: Stablepool

  @OneToMany_(() => StablepoolAssetHistoricalData, e => e.poolHistoricalData)
  assetsData!: StablepoolAssetHistoricalData[]

  @Column_("int4", {nullable: false})
  initialAmplification!: number

  @Column_("int4", {nullable: false})
  finalAmplification!: number

  @Column_("int4", {nullable: false})
  initialBlock!: number

  @Column_("int4", {nullable: false})
  finalBlock!: number

  @Column_("int4", {nullable: false})
  fee!: number

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
