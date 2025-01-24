import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {Block} from "./block.model"
import {StableswapLifeState} from "./_stableswapLifeState"
import {LbppoolHistoricalPrice} from "./lbppoolHistoricalPrice.model"
import {LbppoolHistoricalVolume} from "./lbppoolHistoricalVolume.model"
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
  @ManyToOne_(() => Account, {nullable: true})
  owner!: Account | undefined | null

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  feeCollector!: Account | undefined | null

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
  createdAtParaChainBlockHeight!: number

  @Column_("int4", {nullable: false})
  createdAtRelayChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  createdAtBlock!: Block

  @Column_("bool", {nullable: true})
  isDestroyed!: boolean | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new StableswapLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
  lifeStates!: (StableswapLifeState)[]

  @OneToMany_(() => LbppoolHistoricalPrice, e => e.pool)
  historicalBlockPrices!: LbppoolHistoricalPrice[]

  @OneToMany_(() => LbppoolHistoricalVolume, e => e.pool)
  historicalVolume!: LbppoolHistoricalVolume[]

  @OneToMany_(() => LbppoolHistoricalData, e => e.pool)
  historicalData!: LbppoolHistoricalData[]
}
