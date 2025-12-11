import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {AssetHistoricalData} from "./assetHistoricalData.model"

@Entity_()
export class AssetSpotPriceHistoricalData {
  constructor(props?: Partial<AssetSpotPriceHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <assetInId>-<assetOutId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => AssetHistoricalData, {nullable: true})
  assetInHistData!: AssetHistoricalData

  @Column_("text", {nullable: false})
  assetInId!: string

  @Column_("text", {nullable: false})
  assetOutId!: string

  @Column_("text", {nullable: true})
  assetInAssetRegistryId!: string | undefined | null

  @Column_("text", {nullable: true})
  assetOutAssetRegistryId!: string | undefined | null

  @Column_("int4", {nullable: false})
  assetOutDecimals!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  price!: bigint

  @Column_("text", {nullable: false})
  priceNormalised!: string

  @Column_("jsonb", {transformer: {to: obj => obj, from: obj => marshal.fromList(obj, val => marshal.fromList(val, val => marshal.string.fromJSON(val)))}, nullable: false})
  priceRoute!: ((string)[])[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: true})
  blockId!: string | undefined | null
}
