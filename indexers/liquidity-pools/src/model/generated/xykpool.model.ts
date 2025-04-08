import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {Block} from "./block.model"
import {XykpoolLifeState} from "./_xykpoolLifeState"
import {XykpoolPriceHistoricalData} from "./xykpoolPriceHistoricalData.model"
import {XykpoolVolumeHistoricalData} from "./xykpoolVolumeHistoricalData.model"
import {XykpoolHistoricalData} from "./xykpoolHistoricalData.model"

@Entity_()
export class Xykpool {
  constructor(props?: Partial<Xykpool>) {
    Object.assign(this, props)
  }

  /**
   * <address>
   */
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

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  shareToken!: Asset

  @Index_()
  @Column_("int4", {nullable: false})
  createdAtParaBlockHeight!: number

  @Column_("int4", {nullable: false})
  createdAtRelayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  createdAtBlock!: Block

  @Column_("bool", {nullable: true})
  isDestroyed!: boolean | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new XykpoolLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
  lifeStates!: (XykpoolLifeState)[]

  @OneToMany_(() => XykpoolPriceHistoricalData, e => e.pool)
  historicalBlockPrices!: XykpoolPriceHistoricalData[]

  @OneToMany_(() => XykpoolVolumeHistoricalData, e => e.pool)
  historicalVolume!: XykpoolVolumeHistoricalData[]

  @OneToMany_(() => XykpoolHistoricalData, e => e.pool)
  historicalData!: XykpoolHistoricalData[]
}
