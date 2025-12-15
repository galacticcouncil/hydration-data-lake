import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

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

  @Column_("text", {nullable: false})
  assetInId!: string

  @Column_("text", {nullable: false})
  assetOutId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  price!: bigint

  @Column_("text", {nullable: false})
  priceNormalised!: string

  @Column_("jsonb", {transformer: {to: obj => obj, from: obj => marshal.fromList(obj, val => marshal.fromList(val, val => marshal.string.fromJSON(val)))}, nullable: false})
  priceRoute!: ((string)[])[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
