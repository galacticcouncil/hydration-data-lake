import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {XykPoolAssetsData} from "./xykPoolAssetsData.model"

@Entity_()
export class XykPool {
  constructor(props?: Partial<XykPool>) {
    Object.assign(this, props)
  }

  /**
   * xykPoolAddress-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  /**
   * XYK pool address
   */
  @Index_()
  @Column_("text", {nullable: false})
  poolAddress!: string

  @Index_()
  @Column_("int4", {nullable: false})
  assetAId!: number

  @Index_()
  @Column_("int4", {nullable: false})
  assetBId!: number

  @Column_("int4", {array: true, nullable: true})
  exchangeFee!: (number)[] | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  maxInRatio!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  maxOutRatio!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  minPoolLiquidity!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  minTradingLimit!: bigint | undefined | null

  @Column_("int4", {nullable: true})
  nativeAssetId!: number | undefined | null

  @Column_("text", {nullable: true})
  oracleSource!: string | undefined | null

  @OneToMany_(() => XykPoolAssetsData, e => e.pool)
  assets!: XykPoolAssetsData[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number
}
