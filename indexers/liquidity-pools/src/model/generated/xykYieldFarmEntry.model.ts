import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {XykYieldFarmDeposit} from "./xykYieldFarmDeposit.model"

@Entity_()
export class XykYieldFarmEntry {
    constructor(props?: Partial<XykYieldFarmEntry>) {
        Object.assign(this, props)
    }

    /**
     * <deposit_id>-<xyk_global_farm_id>-<xyk_yield_farm_id>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => XykYieldFarmDeposit, {nullable: true})
    deposit!: XykYieldFarmDeposit

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
