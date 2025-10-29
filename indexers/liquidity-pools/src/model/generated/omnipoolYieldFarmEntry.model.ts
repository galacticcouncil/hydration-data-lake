import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {OmnipoolYieldFarmDeposit} from "./omnipoolYieldFarmDeposit.model"

@Entity_()
export class OmnipoolYieldFarmEntry {
    constructor(props?: Partial<OmnipoolYieldFarmEntry>) {
        Object.assign(this, props)
    }

    /**
     * <deposit_id>-<omnipool_global_farm_id>-<omnipool_yield_farm_id>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OmnipoolYieldFarmDeposit, {nullable: true})
    deposit!: OmnipoolYieldFarmDeposit

    @BigIntColumn_({nullable: false})
    valuedShares!: bigint

    @BigIntColumn_({nullable: false})
    accumulatedRpvs!: bigint

    @BigIntColumn_({nullable: false})
    accumulatedClaimedRewards!: bigint

    @IntColumn_({nullable: false})
    enteredAtRelayBlock!: number

    @IntColumn_({nullable: false})
    updatedAtRelayBlock!: number

    @IntColumn_({nullable: false})
    stoppedAtCreation!: number
}
