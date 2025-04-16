import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {FarmState} from "./_farmState"
import {XykYieldFarm} from "./xykYieldFarm.model"
import {FarmLifeState} from "./_farmLifeState"
import {Event} from "./event.model"

@Entity_()
export class XykGlobalFarm {
  constructor(props?: Partial<XykGlobalFarm>) {
    Object.assign(this, props)
  }

  /**
   * XYK global farm ID 
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  owner!: Account

  @Column_("int4", {nullable: true})
  updatedAtRelayBlock!: number | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalSharesZ!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalRewards!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  accumulatedRpz!: bigint | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  rewardAsset!: Asset | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  pendingRewards!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  accumulatedPaidRewards!: bigint | undefined | null

  @Column_("int4", {nullable: true})
  yieldPerPeriod!: number | undefined | null

  @Column_("int4", {nullable: true})
  plannedYieldingPeriods!: number | undefined | null

  @Column_("int4", {nullable: true})
  blocksPerPeriod!: number | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  incentivizedAsset!: Asset | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  maxRewardPerPeriod!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  minDeposit!: bigint | undefined | null

  @Column_("int4", {nullable: true})
  liveYieldFarmsCount!: number | undefined | null

  @Column_("int4", {nullable: true})
  totalYieldFarmsCount!: number | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  priceAdjustment!: bigint | undefined | null

  @Column_("varchar", {length: 10, nullable: false})
  state!: FarmState

  @OneToMany_(() => XykYieldFarm, e => e.globalFarm)
  yieldFarms!: XykYieldFarm[]

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new FarmLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
  lifeStates!: (FarmLifeState)[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event | undefined | null
}
