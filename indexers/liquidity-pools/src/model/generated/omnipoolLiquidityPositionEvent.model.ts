import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {OmnipoolLiquidityPosition} from "./omnipoolLiquidityPosition.model"
import {OmnipoolLiquidityPositionStatus} from "./_omnipoolLiquidityPositionStatus"

@Entity_()
export class OmnipoolLiquidityPositionEvent {
    constructor(props?: Partial<OmnipoolLiquidityPositionEvent>) {
        Object.assign(this, props)
    }

    /**
     * <position_id>-<event_id>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({array: true, nullable: true})
    traceIds!: (string)[] | undefined | null

    @Index_()
    @ManyToOne_(() => OmnipoolLiquidityPosition, {nullable: true})
    position!: OmnipoolLiquidityPosition

    @Column_("varchar", {length: 24, nullable: false})
    eventName!: OmnipoolLiquidityPositionStatus

    @StringColumn_({nullable: true})
    accountId!: string | undefined | null

    @StringColumn_({nullable: true})
    assetId!: string | undefined | null

    @BigIntColumn_({nullable: true})
    amount!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    sharesAmount!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    price!: bigint | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @StringColumn_({nullable: false})
    eventId!: string
}
