import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"

@Entity_()
export class HistoricalAssetVolume {
  constructor(props?: Partial<HistoricalAssetVolume>) {
    Object.assign(this, props)
  }

  /**
   * AssetId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  volumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  volumeOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalVolumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalVolumeOut!: bigint

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
