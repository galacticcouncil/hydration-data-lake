import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
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

  @Column_("text", {nullable: false})
  accountId!: string

  @Column_("text", {nullable: false})
  assetAId!: string

  @Column_("text", {nullable: false})
  assetBId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetABalance!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  assetBBalance!: bigint

  @Column_("text", {nullable: false})
  shareTokenId!: string

  @Column_("text", {nullable: true})
  tvlInRefAssetNorm!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  createdAtParaBlockHeight!: number

  @Column_("int4", {nullable: false})
  createdAtRelayBlockHeight!: number

  @Column_("text", {nullable: true})
  createdAtBlockId!: string | undefined | null

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
