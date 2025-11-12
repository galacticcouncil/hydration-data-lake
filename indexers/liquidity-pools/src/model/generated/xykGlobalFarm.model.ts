import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {FarmState} from "./_farmState"
import {XykYieldFarm} from "./xykYieldFarm.model"
import {FarmLifeState} from "./_farmLifeState"

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

  @Column_("text", {nullable: false})
  ownerAccountId!: string

  @Column_("int4", {nullable: true})
  updatedAtRelayBlock!: number | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalSharesZ!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalRewards!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  accumulatedRpz!: bigint | undefined | null

  @Column_("text", {nullable: true})
  rewardAssetId!: string | undefined | null

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

  @Column_("text", {nullable: true})
  incentivizedAssetId!: string | undefined | null

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

  @Column_("text", {nullable: true})
  eventId!: string | undefined | null
}
