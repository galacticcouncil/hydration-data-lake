import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

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

  @Column_("text", {nullable: false})
  assetAId!: string

  @Column_("text", {nullable: false})
  assetRegistryAId!: string

  @Column_("text", {nullable: false})
  assetBId!: string

  @Column_("text", {nullable: false})
  assetRegistryBId!: string

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
}
