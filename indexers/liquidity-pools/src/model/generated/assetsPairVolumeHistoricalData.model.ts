import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"

@Entity_()
export class AssetsPairVolumeHistoricalData {
  constructor(props?: Partial<AssetsPairVolumeHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <assetAId>-<assetBId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetA!: Asset

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetB!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetAVolume!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBVolume!: bigint

  /**
   * totalVolumeNormalised is calculated in base asset (10:USDT) and normalised to decimal format
   */
  @Column_("text", {nullable: false})
  totalVolumeNormalised!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
