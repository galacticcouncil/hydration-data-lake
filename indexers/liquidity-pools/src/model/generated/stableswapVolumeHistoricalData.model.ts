import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Stableswap} from "./stableswap.model"
import {StableswapAssetVolumeHistoricalData} from "./stableswapAssetVolumeHistoricalData.model"

@Entity_()
export class StableswapVolumeHistoricalData {
  constructor(props?: Partial<StableswapVolumeHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <stableswapId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Stableswap, {nullable: true})
  pool!: Stableswap

  @OneToMany_(() => StableswapAssetVolumeHistoricalData, e => e.volumesCollection)
  assetVolumes!: StableswapAssetVolumeHistoricalData[]

  @Column_("text", {nullable: false})
  poolVolInNorm!: string

  @Column_("text", {nullable: false})
  poolVolOutNorm!: string

  @Column_("text", {nullable: false})
  poolFeesVolNorm!: string

  @Column_("text", {nullable: false})
  poolTotalVolInNorm!: string

  @Column_("text", {nullable: false})
  poolTotalVolOutNorm!: string

  @Column_("text", {nullable: false})
  poolTotalFeesVolNorm!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
