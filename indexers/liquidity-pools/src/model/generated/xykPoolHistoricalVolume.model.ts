import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Xykpool} from "./xykpool.model"
import {Asset} from "./asset.model"
import {Block} from "./block.model"

@Entity_()
export class XykpoolHistoricalVolume {
  constructor(props?: Partial<XykpoolHistoricalVolume>) {
    Object.assign(this, props)
  }

  /**
   * PoolId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Xykpool, {nullable: true})
  pool!: Xykpool

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetA!: Asset

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetB!: Asset

  @Column_("numeric", {nullable: false})
  averagePrice!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetAVolumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetAVolumeOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetATotalVolumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetATotalVolumeOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetAFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetATotalFees!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBTotalFees!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBVolumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBVolumeOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBTotalVolumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBTotalVolumeOut!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
