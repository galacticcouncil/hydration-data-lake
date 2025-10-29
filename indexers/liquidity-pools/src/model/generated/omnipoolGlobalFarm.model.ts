import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
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

    @IntColumn_({nullable: false})
    updatedAtRelayBlock!: number

    @BigIntColumn_({nullable: false})
    totalSharesZ!: bigint

    @BigIntColumn_({nullable: false})
    accumulatedRpz!: bigint

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    rewardAsset!: Asset

    @BigIntColumn_({nullable: false})
    pendingRewards!: bigint

    @BigIntColumn_({nullable: false})
    accumulatedPaidRewards!: bigint

    @BigIntColumn_({nullable: false})
    yieldPerPeriod!: bigint

    @IntColumn_({nullable: false})
    plannedYieldingPeriods!: number

    @IntColumn_({nullable: false})
    blocksPerPeriod!: number

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    incentivizedAsset!: Asset

    @IntColumn_({nullable: false})
    maxRewardPerPeriod!: number

    @BigIntColumn_({nullable: false})
    minDeposit!: bigint

    @IntColumn_({nullable: false})
    liveYieldFarmsCount!: number

    @IntColumn_({nullable: false})
    totalYieldFarmsCount!: number

    @BigIntColumn_({nullable: false})
    priceAdjustment!: bigint

    @Column_("varchar", {length: 10, nullable: false})
    state!: FarmState

    @BigIntColumn_({nullable: false})
    lrnaPriceAdjustment!: bigint

    @BigIntColumn_({nullable: false})
    totalRewards!: bigint

    @OneToMany_(() => OmnipoolYieldFarm, e => e.globalFarm)
    yieldFarms!: OmnipoolYieldFarm[]

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new FarmLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
    lifeStates!: (FarmLifeState)[]

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
