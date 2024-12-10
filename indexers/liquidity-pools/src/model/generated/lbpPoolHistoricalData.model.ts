import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {LbpPool} from "./lbpPool.model"
import {Asset} from "./asset.model"
import {Account} from "./account.model"

@Entity_()
export class LbpPoolHistoricalData {
  constructor(props?: Partial<LbpPoolHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * poolAddress-assetId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => LbpPool, {nullable: true})
  pool!: LbpPool

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

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  owner!: Account

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

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  feeCollector!: Account | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  repayTarget!: bigint

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
