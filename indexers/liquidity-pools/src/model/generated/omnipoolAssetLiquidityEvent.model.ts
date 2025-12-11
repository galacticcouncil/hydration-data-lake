import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {LiquidityActionEvent} from "./_liquidityActionEvent"
import {OmnipoolLiquidityPositionEvent} from "./omnipoolLiquidityPositionEvent.model"

@Entity_()
export class OmnipoolAssetLiquidityEvent {
    constructor(props?: Partial<OmnipoolAssetLiquidityEvent>) {
        Object.assign(this, props)
    }

    /**
     * <omnipool_id>-<asset_id>-<event_id>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({array: true, nullable: true})
    traceIds!: (string)[] | undefined | null

    @StringColumn_({nullable: false})
    assetId!: string

    @Column_("varchar", {length: 6, nullable: false})
    actionType!: LiquidityActionEvent

    @StringColumn_({nullable: false})
    accountId!: string

    @StringColumn_({nullable: false})
    positionId!: string

    @Index_()
    @ManyToOne_(() => OmnipoolLiquidityPositionEvent, {nullable: true})
    positionEvent!: OmnipoolLiquidityPositionEvent | undefined | null

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @BigIntColumn_({nullable: true})
    fee!: bigint | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @StringColumn_({nullable: false})
    eventId!: string
}
