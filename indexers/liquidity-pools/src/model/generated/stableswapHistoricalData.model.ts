import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Stableswap} from "./stableswap.model"
import {StableswapAssetHistoricalData} from "./stableswapAssetHistoricalData.model"
import {Block} from "./block.model"

@Entity_()
export class StableswapHistoricalData {
  constructor(props?: Partial<StableswapHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <stableswapId>-<paraChainBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Stableswap, {nullable: true})
  pool!: Stableswap

  @OneToMany_(() => StableswapAssetHistoricalData, e => e.poolHistoricalData)
  assetsData!: StableswapAssetHistoricalData[]

  @Column_("int4", {nullable: false})
  initialAmplification!: number

  @Column_("int4", {nullable: false})
  finalAmplification!: number

  @Column_("int4", {nullable: false})
  initialAmplificationChangeAt!: number

  @Column_("int4", {nullable: false})
  finalAmplificationChangeAt!: number

  @Column_("int4", {nullable: false})
  fee!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
