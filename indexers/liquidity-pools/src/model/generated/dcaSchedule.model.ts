import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {DcaScheduleStatus} from "./_dcaScheduleStatus"
import {DcaScheduleOrderType} from "./_dcaScheduleOrderType"
import {DcaScheduleOrderRouteHop} from "./dcaScheduleOrderRouteHop.model"
import {DcaScheduleExecution} from "./dcaScheduleExecution.model"
import {DcaScheduleEvent} from "./dcaScheduleEvent.model"
import {Event} from "./event.model"

@Entity_()
export class DcaSchedule {
    constructor(props?: Partial<DcaSchedule>) {
        Object.assign(this, props)
    }

    /**
     * <scheduleId> - DCA schedule as a string
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: true})
    operationId!: string | undefined | null

    @StringColumn_({array: true, nullable: true})
    traceIds!: (string)[] | undefined | null

    @Index_()
    @Column_("varchar", {length: 10, nullable: true})
    status!: DcaScheduleStatus | undefined | null

    @StringColumn_({nullable: false})
    ownerId!: string

    @IntColumn_({nullable: true})
    startExecutionBlock!: number | undefined | null

    @IntColumn_({nullable: true})
    period!: number | undefined | null

    @BigIntColumn_({nullable: true})
    totalAmount!: bigint | undefined | null

    @IntColumn_({nullable: true})
    slippage!: number | undefined | null

    @IntColumn_({nullable: true})
    maxRetries!: number | undefined | null

    @IntColumn_({nullable: true})
    stabilityThreshold!: number | undefined | null

    @BigIntColumn_({nullable: true})
    totalExecutedAmountIn!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    totalExecutedAmountOut!: bigint | undefined | null

    @StringColumn_({nullable: true})
    assetInId!: string | undefined | null

    @BigIntColumn_({nullable: true})
    amountIn!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    maxAmountIn!: bigint | undefined | null

    @StringColumn_({nullable: true})
    assetOutId!: string | undefined | null

    @BigIntColumn_({nullable: true})
    amountOut!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    minAmountOut!: bigint | undefined | null

    @Column_("varchar", {length: 4, nullable: false})
    orderType!: DcaScheduleOrderType

    @OneToMany_(() => DcaScheduleOrderRouteHop, e => e.schedule)
    orderRouteHops!: DcaScheduleOrderRouteHop[]

    @OneToMany_(() => DcaScheduleExecution, e => e.schedule)
    executions!: DcaScheduleExecution[]

    @OneToMany_(() => DcaScheduleEvent, e => e.schedule)
    events!: DcaScheduleEvent[]

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
