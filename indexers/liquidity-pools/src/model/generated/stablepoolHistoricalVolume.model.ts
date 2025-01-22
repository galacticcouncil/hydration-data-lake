import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Stablepool} from "./stablepool.model"
import {StablepoolAssetHistoricalVolume} from "./stablepoolAssetHistoricalVolume.model"

@Entity_()
export class StablepoolHistoricalVolume {
  constructor(props?: Partial<StablepoolHistoricalVolume>) {
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

  @OneToMany_(() => StablepoolAssetHistoricalVolume, e => e.volumesCollection)
  assetVolumes!: StablepoolAssetHistoricalVolume[]

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
