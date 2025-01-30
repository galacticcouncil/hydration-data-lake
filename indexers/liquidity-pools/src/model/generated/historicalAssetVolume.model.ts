import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {Block} from "./block.model"

@Entity_()
export class HistoricalAssetVolume {
  constructor(props?: Partial<HistoricalAssetVolume>) {
    Object.assign(this, props)
  }

  /**
   * <assetId>-<paraBlockHeight>
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

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
