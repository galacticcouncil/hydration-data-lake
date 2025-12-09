import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, OneToMany as OneToMany_, ManyToOne as ManyToOne_, Index as Index_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {SwapFillerType} from "./_swapFillerType"
import {TradeOperationType} from "./_tradeOperationType"
import {SwapAssetBalance} from "./swapAssetBalance.model"
import {SwapFee} from "./swapFee.model"
import {DcaScheduleExecutionEvent} from "./dcaScheduleExecutionEvent.model"
import {OtcOrderEvent} from "./otcOrderEvent.model"
import {RoutedTrade} from "./routedTrade.model"
import {Event} from "./event.model"

@Entity_()
export class Swap {
    constructor(props?: Partial<Swap>) {
        Object.assign(this, props)
    }

    /**
     * <eventId> (e.g. 0006516718-9965d-000107)
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: true})
    operationId!: string | undefined | null

    @StringColumn_({array: true, nullable: true})
    traceIds!: (string)[] | undefined | null

    @IntColumn_({nullable: true})
    swapIndex!: number | undefined | null

    @StringColumn_({nullable: false})
    swapperId!: string

    @StringColumn_({nullable: false})
    fillerId!: string

    @Column_("varchar", {length: 10, nullable: false})
    fillerType!: SwapFillerType

    @Column_("varchar", {length: 15, nullable: false})
    operationType!: TradeOperationType

    @OneToMany_(() => SwapAssetBalance, e => e.swap)
    inputs!: SwapAssetBalance[]

    @OneToMany_(() => SwapAssetBalance, e => e.swap)
    outputs!: SwapAssetBalance[]

    @OneToMany_(() => SwapFee, e => e.swap)
    fees!: SwapFee[]

    /**
     * List of all asset IDs involved in the swap, including those used for fees.
     */
    @StringColumn_({array: true, nullable: false})
    allInvolvedAssetIds!: (string)[]

    @StringColumn_({array: true, nullable: false})
    allInvolvedAssetRegistryIds!: (string)[]

    @Index_()
    @ManyToOne_(() => DcaScheduleExecutionEvent, {nullable: true})
    dcaScheduleExecutionEvent!: DcaScheduleExecutionEvent | undefined | null

    @Index_()
    @ManyToOne_(() => OtcOrderEvent, {nullable: true})
    otcOrderFulfillment!: OtcOrderEvent | undefined | null

    @Index_()
    @ManyToOne_(() => RoutedTrade, {nullable: true})
    routedTrade!: RoutedTrade | undefined | null

    @Index_()
    @DateTimeColumn_({nullable: false})
    paraTimestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    paraBlockHeight!: number

    @IntColumn_({nullable: false})
    relayBlockHeight!: number

    @Index_()
    @ManyToOne_(() => Event, {nullable: true})
    event!: Event
}
