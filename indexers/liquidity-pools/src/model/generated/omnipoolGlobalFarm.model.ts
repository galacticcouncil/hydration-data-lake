import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {FarmState} from "./_farmState"
import {OmnipoolYieldFarm} from "./omnipoolYieldFarm.model"
import {FarmLifeState} from "./_farmLifeState"
import {Event} from "./event.model"

@Entity_()
export class OmnipoolGlobalFarm {
  constructor(props?: Partial<OmnipoolGlobalFarm>) {
    Object.assign(this, props)
  }

  /**
   * omnipool global farm ID 
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  owner!: Account

  @Column_("int4", {nullable: false})
  updatedAtRelayBlock!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalSharesZ!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  accumulatedRpz!: bigint

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  rewardAsset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  pendingRewards!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  accumulatedPaidRewards!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  yieldPerPeriod!: bigint

  @Column_("int4", {nullable: false})
  plannedYieldingPeriods!: number

  @Column_("int4", {nullable: false})
  blocksPerPeriod!: number

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  incentivizedAsset!: Asset

  @Column_("int4", {nullable: false})
  maxRewardPerPeriod!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  minDeposit!: bigint

  @Column_("int4", {nullable: false})
  liveYieldFarmsCount!: number

  @Column_("int4", {nullable: false})
  totalYieldFarmsCount!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  priceAdjustment!: bigint

  @Column_("varchar", {length: 10, nullable: false})
  state!: FarmState

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  lrnaPriceAdjustment!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalRewards!: bigint

  @OneToMany_(() => OmnipoolYieldFarm, e => e.globalFarm)
  yieldFarms!: OmnipoolYieldFarm[]

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new FarmLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
  lifeStates!: (FarmLifeState)[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
