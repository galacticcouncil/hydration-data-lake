import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {StableswapVolumeHistoricalData} from "./stableswapVolumeHistoricalData.model"
import {Asset} from "./asset.model"
import {Block} from "./block.model"

@Entity_()
export class StableswapAssetVolumeHistoricalData {
  constructor(props?: Partial<StableswapAssetVolumeHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <stableswapId>-<assetId>-<paraBlockHeight> (e.g. 100-10-101332)
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => StableswapVolumeHistoricalData, {nullable: true})
  volumesCollection!: StableswapVolumeHistoricalData

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetFeeVol!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetTotalFeesVol!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetVolIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetVolOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetTotalVolIn!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetTotalVolOut!: bigint

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
