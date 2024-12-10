import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {OmnipoolAsset} from "./omnipoolAsset.model"

@Entity_()
export class OmnipoolAssetHistoricalVolume {
  constructor(props?: Partial<OmnipoolAssetHistoricalVolume>) {
    Object.assign(this, props)
  }

  /**
   * OmnipoolAssetId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => OmnipoolAsset, {nullable: true})
  omnipoolAsset!: OmnipoolAsset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetVolumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetVolumeOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetTotalVolumeIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetTotalVolumeOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetTotalFees!: bigint

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
