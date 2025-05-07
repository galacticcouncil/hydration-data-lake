import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {AssetDynamicFee} from "./_assetDynamicFee"
import {AssetSpotPriceHistoricalData} from "./assetSpotPriceHistoricalData.model"
import {Block} from "./block.model"

@Entity_()
export class AssetHistoricalData {
  constructor(props?: Partial<AssetHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <assetId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalIssuance!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  existentialDeposit!: bigint

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new AssetDynamicFee(undefined, obj)}, nullable: true})
  dynamicFee!: AssetDynamicFee | undefined | null

  @OneToMany_(() => AssetSpotPriceHistoricalData, e => e.assetInHistData)
  spotPrices!: AssetSpotPriceHistoricalData[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
