import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {AssetSpotPriceRoute} from "./assetSpotPriceRoute.model"

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

  @Index_()
  @ManyToOne_(() => AssetSpotPriceRoute, {nullable: true})
  priceRoute!: AssetSpotPriceRoute | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
