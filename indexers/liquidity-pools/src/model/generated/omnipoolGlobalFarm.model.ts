import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, Index as Index_} from "@subsquid/typeorm-store"
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

    @StringColumn_({nullable: false})
    ownerAccountId!: string

    @IntColumn_({nullable: false})
    updatedAtRelayBlock!: number

    @BigIntColumn_({nullable: false})
    totalSharesZ!: bigint

    @BigIntColumn_({nullable: false})
    accumulatedRpz!: bigint

    @StringColumn_({nullable: false})
    rewardAssetId!: string

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

    @StringColumn_({nullable: false})
    incentivizedAssetId!: string

    @BigIntColumn_({nullable: false})
    maxRewardPerPeriod!: bigint

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

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new FarmLifeState(undefined, marshal.nonNull(val)))}, nullable: false})
    lifeStates!: (FarmLifeState)[]

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @StringColumn_({nullable: true})
    eventId!: string | undefined | null
}
