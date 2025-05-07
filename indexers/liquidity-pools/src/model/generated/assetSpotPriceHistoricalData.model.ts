import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {AssetHistoricalData} from "./assetHistoricalData.model"
import {Asset} from "./asset.model"

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

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetIn!: Asset

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetOut!: Asset

  @Column_("text", {nullable: true})
  assetInAssetRegistryId!: string | undefined | null

  @Column_("text", {nullable: true})
  assetOutAssetRegistryId!: string | undefined | null

  @Column_("int4", {nullable: true})
  assetOutDecimals!: number | undefined | null

  @Column_("text", {nullable: false})
  price!: string

  @Column_("text", {nullable: false})
  routerLog!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayBlockHeight!: number
}
