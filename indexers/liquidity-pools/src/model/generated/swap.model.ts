import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
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

  @Column_("text", {nullable: true})
  operationId!: string | undefined | null

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Column_("int4", {nullable: true})
  swapIndex!: number | undefined | null

  @Column_("text", {nullable: false})
  swapperId!: string

  @Column_("text", {nullable: false})
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
  @Column_("text", {array: true, nullable: false})
  allInvolvedAssetIds!: (string)[]

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
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
