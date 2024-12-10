import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {LbpPoolHistoricalPrice} from "./lbpPoolHistoricalPrice.model"
import {LbpPoolHistoricalVolume} from "./lbpPoolHistoricalVolume.model"
import {LbpPoolHistoricalData} from "./lbpPoolHistoricalData.model"

@Entity_()
export class LbpPool {
  constructor(props?: Partial<LbpPool>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

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

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("int4", {nullable: false})
  createdAtParaBlock!: number

  @Column_("bool", {nullable: true})
  isDestroyed!: boolean | undefined | null

  @Column_("int4", {nullable: true})
  destroyedAtParaBlock!: number | undefined | null

  @Column_("int4", {nullable: true})
  startBlockNumber!: number | undefined | null

  @Column_("int4", {nullable: true})
  endBlockNumber!: number | undefined | null

  @Column_("int4", {array: true, nullable: true})
  fee!: (number | undefined | null)[] | undefined | null

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  feeCollector!: Account | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  repayTarget!: bigint | undefined | null

  @Column_("int4", {nullable: true})
  initialWeight!: number | undefined | null

  @Column_("int4", {nullable: true})
  finalWeight!: number | undefined | null

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  owner!: Account | undefined | null

  @OneToMany_(() => LbpPoolHistoricalPrice, e => e.pool)
  historicalBlockPrices!: LbpPoolHistoricalPrice[]

  @OneToMany_(() => LbpPoolHistoricalVolume, e => e.pool)
  historicalVolume!: LbpPoolHistoricalVolume[]

  @OneToMany_(() => LbpPoolHistoricalData, e => e.pool)
  historicalData!: LbpPoolHistoricalData[]
}
