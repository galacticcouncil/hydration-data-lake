import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {AssetSpotPriceHistoricalData} from "./_assetSpotPriceHistoricalData"
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

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val == null ? undefined : val.toJSON()), from: obj => marshal.fromList(obj, val => val == null ? undefined : new AssetSpotPriceHistoricalData(undefined, val))}, nullable: false})
  spotPrices!: (AssetSpotPriceHistoricalData | undefined | null)[]

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
