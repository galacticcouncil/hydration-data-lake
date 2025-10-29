import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {OmnipoolGlobalFarm} from "./omnipoolGlobalFarm.model"
import {Asset} from "./asset.model"
import {FarmState} from "./_farmState"
import {YieldFarmLoyaltyCurve} from "./_yieldFarmLoyaltyCurve"
import {FarmLifeState} from "./_farmLifeState"
import {Event} from "./event.model"

@Entity_()
export class OmnipoolYieldFarm {
    constructor(props?: Partial<OmnipoolYieldFarm>) {
        Object.assign(this, props)
    }

    /**
     * global farm ID
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OmnipoolGlobalFarm, {nullable: true})
    globalFarm!: OmnipoolGlobalFarm

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @IntColumn_({nullable: false})
    updatedAtRelayBlock!: number

    @BigIntColumn_({nullable: false})
    totalShares!: bigint

    @BigIntColumn_({nullable: false})
    totalValuedShares!: bigint

    @BigIntColumn_({nullable: false})
    accumulatedRpvs!: bigint

    @BigIntColumn_({nullable: false})
    accumulatedRpz!: bigint

    @BigIntColumn_({nullable: false})
    multiplier!: bigint

    @Column_("varchar", {length: 10, nullable: false})
    state!: FarmState

    @IntColumn_({nullable: false})
    entriesCount!: number

    @BigIntColumn_({nullable: false})
    leftToDistribute!: bigint

    @BigIntColumn_({nullable: false})
    totalStopped!: bigint

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new YieldFarmLoyaltyCurve(undefined, obj)}, nullable: true})
    loyaltyCurve!: YieldFarmLoyaltyCurve | undefined | null

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
