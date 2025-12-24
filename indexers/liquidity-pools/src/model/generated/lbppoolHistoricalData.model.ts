import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Lbppool} from "./lbppool.model"

@Entity_()
export class LbppoolHistoricalData {
  constructor(props?: Partial<LbppoolHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * poolAddress-assetId-paraBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Lbppool, {nullable: true})
  pool!: Lbppool

  @Column_("text", {nullable: false})
  assetAId!: string

  @Column_("text", {nullable: false})
  assetBId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetABalance!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBBalance!: bigint

  @Column_("text", {nullable: false})
  ownerId!: string

  @Column_("text", {nullable: true})
  feeCollectorId!: string | undefined | null

  @Column_("int4", {nullable: true})
  startBlockNumber!: number | undefined | null

  @Column_("int4", {nullable: true})
  endBlockNumber!: number | undefined | null

  @Column_("int4", {nullable: false})
  initialWeight!: number

  @Column_("int4", {nullable: false})
  finalWeight!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  repayTarget!: bigint

  @Column_("text", {nullable: false})
  weightCurve!: string

  @Column_("int4", {array: true, nullable: false})
  fee!: (number)[]

  @Column_("text", {nullable: true})
  tvlInRefAssetNorm!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
