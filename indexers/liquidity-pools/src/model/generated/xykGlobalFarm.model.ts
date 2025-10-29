import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
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

    @IntColumn_({nullable: true})
    updatedAtRelayBlock!: number | undefined | null

    @BigIntColumn_({nullable: true})
    totalSharesZ!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    totalRewards!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    accumulatedRpz!: bigint | undefined | null

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    rewardAsset!: Asset | undefined | null

    @BigIntColumn_({nullable: true})
    pendingRewards!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    accumulatedPaidRewards!: bigint | undefined | null

    @IntColumn_({nullable: true})
    yieldPerPeriod!: number | undefined | null

    @IntColumn_({nullable: true})
    plannedYieldingPeriods!: number | undefined | null

    @IntColumn_({nullable: true})
    blocksPerPeriod!: number | undefined | null

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    incentivizedAsset!: Asset | undefined | null

    @BigIntColumn_({nullable: true})
    maxRewardPerPeriod!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    minDeposit!: bigint | undefined | null

    @IntColumn_({nullable: true})
    liveYieldFarmsCount!: number | undefined | null

    @IntColumn_({nullable: true})
    totalYieldFarmsCount!: number | undefined | null

    @BigIntColumn_({nullable: true})
    priceAdjustment!: bigint | undefined | null

    @Column_("varchar", {length: 10, nullable: false})
    state!: FarmState

    @OneToMany_(() => XykYieldFarm, e => e.globalFarm)
    yieldFarms!: XykYieldFarm[]

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new FarmLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
    lifeStates!: (FarmLifeState)[]

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event | undefined | null
}
