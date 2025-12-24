import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {LbppoolLifeState} from "./_lbppoolLifeState"
import {LbppoolPriceHistoricalData} from "./lbppoolPriceHistoricalData.model"
import {LbppoolVolumeHistoricalData} from "./lbppoolVolumeHistoricalData.model"
import {LbppoolHistoricalData} from "./lbppoolHistoricalData.model"

@Entity_()
export class Lbppool {
  constructor(props?: Partial<Lbppool>) {
    Object.assign(this, props)
  }

  /**
   * <poolAccountAddress>
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

  @Column_("text", {nullable: true})
  ownerId!: string | undefined | null

  @Column_("text", {nullable: true})
  feeCollectorId!: string | undefined | null

  @Column_("int4", {nullable: true})
  startBlockNumber!: number | undefined | null

  @Column_("int4", {nullable: true})
  endBlockNumber!: number | undefined | null

  @Column_("int4", {nullable: true})
  initialWeight!: number | undefined | null

  @Column_("int4", {nullable: true})
  finalWeight!: number | undefined | null

  @Column_("int4", {array: true, nullable: true})
  fee!: (number | undefined | null)[] | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  repayTarget!: bigint | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  createdAtParaBlockHeight!: number

  @Column_("int4", {nullable: false})
  createdAtRelayBlockHeight!: number

  @Column_("text", {nullable: true})
  createdAtBlockId!: string | undefined | null

  @Column_("bool", {nullable: true})
  isDestroyed!: boolean | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new LbppoolLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
  lifeStates!: (LbppoolLifeState)[]

  @OneToMany_(() => LbppoolPriceHistoricalData, e => e.pool)
  historicalBlockPrices!: LbppoolPriceHistoricalData[]

  @OneToMany_(() => LbppoolVolumeHistoricalData, e => e.pool)
  historicalVolume!: LbppoolVolumeHistoricalData[]

  @OneToMany_(() => LbppoolHistoricalData, e => e.pool)
  historicalData!: LbppoolHistoricalData[]
}
