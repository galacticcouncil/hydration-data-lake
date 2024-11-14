import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {LbpPoolAssetsData} from "./lbpPoolAssetsData.model"

@Entity_()
export class LbpPool {
  constructor(props?: Partial<LbpPool>) {
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

  @Column_("text", {nullable: false})
  owner!: string

  @Column_("int4", {nullable: true})
  start!: number | undefined | null

  @Column_("int4", {nullable: true})
  end!: number | undefined | null

  @Column_("int4", {nullable: false})
  initialWeight!: number

  @Column_("int4", {nullable: false})
  finalWeight!: number

  @Column_("text", {nullable: false})
  weightCurve!: string

  @Column_("int4", {array: true, nullable: false})
  fee!: (number)[]

  @Column_("text", {nullable: true})
  feeCollector!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  repayTarget!: bigint

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @OneToMany_(() => LbpPoolAssetsData, e => e.pool)
  assets!: LbpPoolAssetsData[]
}
