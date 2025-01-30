import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {SwapFillerType} from "./_swapFillerType"
import {TradeOperationType} from "./_tradeOperationType"
import {SwapAssetBalance} from "./swapAssetBalance.model"
import {SwapFee} from "./swapFee.model"
import {DcaScheduleExecutionEvent} from "./dcaScheduleExecutionEvent.model"
import {OtcOrderEvent} from "./otcOrderEvent.model"
import {RouteTrade} from "./routeTrade.model"
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

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  swapper!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  filler!: Account

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
  @ManyToOne_(() => RouteTrade, {nullable: true})
  routeTrade!: RouteTrade | undefined | null

  @Index_()
  @Column_("timestamp with time zone", {nullable: false})
  paraTimestamp!: Date

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
