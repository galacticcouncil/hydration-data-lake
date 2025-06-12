import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Stableswap} from "./stableswap.model"
import {StableswapAssetHistoricalVolume} from "./stableswapAssetHistoricalVolume.model"
import {Block} from "./block.model"

@Entity_()
export class StableswapHistoricalVolume {
  constructor(props?: Partial<StableswapHistoricalVolume>) {
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

  @OneToMany_(() => StableswapAssetHistoricalVolume, e => e.volumesCollection)
  assetVolumes!: StableswapAssetHistoricalVolume[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
