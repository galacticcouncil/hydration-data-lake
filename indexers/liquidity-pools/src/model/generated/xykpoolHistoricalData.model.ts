import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Xykpool} from "./xykpool.model"
import {Asset} from "./asset.model"

@Entity_()
export class XykpoolHistoricalData {
  constructor(props?: Partial<XykpoolHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * poolAddress-assetId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Xykpool, {nullable: true})
  pool!: Xykpool

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetA!: Asset

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetB!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetABalance!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBBalance!: bigint

  @Column_("text", {nullable: true})
  tvlInRefAssetNorm!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
