import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, Index as Index_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {FarmState} from "./_farmState"
import {YieldFarmLoyaltyCurve} from "./_yieldFarmLoyaltyCurve"
import {FarmLifeState} from "./_farmLifeState"

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

    @StringColumn_({nullable: false})
    globalFarmId!: string

    @StringColumn_({nullable: false})
    assetId!: string

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

    @StringColumn_({nullable: true})
    eventId!: string | undefined | null
}
