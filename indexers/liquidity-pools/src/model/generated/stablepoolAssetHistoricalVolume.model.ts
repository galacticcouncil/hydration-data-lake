import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {StablepoolHistoricalVolume} from "./stablepoolHistoricalVolume.model"
import {Asset} from "./asset.model"

@Entity_()
export class StablepoolAssetHistoricalVolume {
  constructor(props?: Partial<StablepoolAssetHistoricalVolume>) {
    Object.assign(this, props)
  }

  /**
   * stablepoolId-assetId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => StablepoolHistoricalVolume, {nullable: true})
  volumesCollection!: StablepoolHistoricalVolume

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapTotalFees!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liqFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liqTotalFees!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  routedLiqFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  routedLiqTotalFees!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapVolumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapVolumeOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapTotalVolumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapTotalVolumeOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liqAddedAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liqRemovedAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liqAddedTotalAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liqRemovedTotalAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  routedLiqAddedAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  routedLiqRemovedAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  routedLiqAddedTotalAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  routedLiqRemovedTotalAmount!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
