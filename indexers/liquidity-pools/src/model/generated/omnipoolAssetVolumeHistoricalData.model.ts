import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {OmnipoolAsset} from "./omnipoolAsset.model"
import {Block} from "./block.model"

@Entity_()
export class OmnipoolAssetVolumeHistoricalData {
  constructor(props?: Partial<OmnipoolAssetVolumeHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <omnipoolAssetId>-<paraBlockHeight> (e.g. 0x6d6f646c6f6d6e69706f6f6c0000000000000000000000000000000000000000-0-101312)
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => OmnipoolAsset, {nullable: true})
  omnipoolAsset!: OmnipoolAsset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetVolIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetVolOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetTotalVolIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetTotalVolOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetFeeVol!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetTotalFeesVol!: bigint

  @Column_("text", {nullable: false})
  assetVolInNorm!: string

  @Column_("text", {nullable: false})
  assetVolOutNorm!: string

  @Column_("text", {nullable: false})
  assetFeeVolNorm!: string

  @Column_("text", {nullable: false})
  assetTotalVolInNorm!: string

  @Column_("text", {nullable: false})
  assetTotalVolOutNorm!: string

  @Column_("text", {nullable: false})
  assetTotalFeesVolNorm!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
