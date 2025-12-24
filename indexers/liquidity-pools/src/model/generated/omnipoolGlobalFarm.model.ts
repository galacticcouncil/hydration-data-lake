import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {FarmState} from "./_farmState"
import {FarmLifeState} from "./_farmLifeState"

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

  @Column_("text", {nullable: false})
  ownerAccountId!: string

  @Column_("int4", {nullable: false})
  updatedAtRelayBlock!: number

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalSharesZ!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  accumulatedRpz!: bigint

  @Column_("text", {nullable: false})
  rewardAssetId!: string

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

  @Column_("text", {nullable: false})
  incentivizedAssetId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  maxRewardPerPeriod!: bigint

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

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new FarmLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
  lifeStates!: (FarmLifeState)[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("text", {nullable: true})
  eventId!: string | undefined | null
}
