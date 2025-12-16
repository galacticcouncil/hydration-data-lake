import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {HsmCollateral} from "./hsmCollateral.model"

@Entity_()
export class HsmCollateralConfigHistoricalData {
    constructor(props?: Partial<HsmCollateralConfigHistoricalData>) {
        Object.assign(this, props)
    }

    /**
     * <hsm_collateral_id>-<block_height>
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => HsmCollateral, {nullable: true})
    collateral!: HsmCollateral

    @BigIntColumn_({nullable: false})
    purchaseFee!: bigint

    @BigIntColumn_({nullable: false})
    maxBuyPriceCoefficient!: bigint

    @BigIntColumn_({nullable: false})
    buybackRate!: bigint

    @BigIntColumn_({nullable: false})
    buyBackFee!: bigint

    @BigIntColumn_({nullable: false})
    maxInHolding!: bigint

    @Index_()
    @DateTimeColumn_({nullable: false})
    paraTimestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number
}
