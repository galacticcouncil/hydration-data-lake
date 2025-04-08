import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Xykpool} from "./xykpool.model"
import {Asset} from "./asset.model"
import {Block} from "./block.model"

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

  @Column_("int4", {array: true, nullable: false})
  exchangeFee!: (number | undefined | null)[]

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

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
