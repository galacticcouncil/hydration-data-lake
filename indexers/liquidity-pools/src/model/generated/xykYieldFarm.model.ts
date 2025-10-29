import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {XykGlobalFarm} from "./xykGlobalFarm.model"
import {Xykpool} from "./xykpool.model"
import {FarmState} from "./_farmState"
import {YieldFarmLoyaltyCurve} from "./_yieldFarmLoyaltyCurve"
import {FarmLifeState} from "./_farmLifeState"
import {Event} from "./event.model"

@Entity_()
export class XykYieldFarm {
    constructor(props?: Partial<XykYieldFarm>) {
        Object.assign(this, props)
    }

    /**
     * yield farm ID
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => XykGlobalFarm, {nullable: true})
    globalFarm!: XykGlobalFarm

    @StringColumn_({array: true, nullable: false})
    allInvolvedAssetIds!: (string)[]

    @StringColumn_({array: true, nullable: false})
    allInvolvedAssetRegistryIds!: (string)[]

    @Index_()
    @ManyToOne_(() => Xykpool, {nullable: true})
    pool!: Xykpool

    @Column_("varchar", {length: 10, nullable: false})
    state!: FarmState

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
