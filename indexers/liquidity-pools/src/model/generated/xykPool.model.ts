import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {XykPoolHistoricalPrice} from "./xykPoolHistoricalPrice.model"
import {XykPoolHistoricalVolume} from "./xykPoolHistoricalVolume.model"
import {XykPoolHistoricalData} from "./xykPoolHistoricalData.model"

@Entity_()
export class XykPool {
  constructor(props?: Partial<XykPool>) {
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

  @Column_("int4", {nullable: false})
  shareTokenId!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetABalance!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBBalance!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  initialSharesAmount!: bigint

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("int4", {nullable: false})
  createdAtParaBlock!: number

  @Column_("bool", {nullable: true})
  isDestroyed!: boolean | undefined | null

  @Column_("int4", {nullable: true})
  destroyedAtParaBlock!: number | undefined | null

  @OneToMany_(() => XykPoolHistoricalPrice, e => e.pool)
  historicalBlockPrices!: XykPoolHistoricalPrice[]

  @OneToMany_(() => XykPoolHistoricalVolume, e => e.pool)
  historicalVolume!: XykPoolHistoricalVolume[]

  @OneToMany_(() => XykPoolHistoricalData, e => e.pool)
  historicalData!: XykPoolHistoricalData[]
}
