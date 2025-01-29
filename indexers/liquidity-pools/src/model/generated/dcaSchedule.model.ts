import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {DcaScheduleStatus} from "./_dcaScheduleStatus"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
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
   * schedule_id as string
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: true})
  operationId!: string | undefined | null

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Index_()
  @Column_("varchar", {length: 10, nullable: true})
  status!: DcaScheduleStatus | undefined | null

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  owner!: Account

  @Column_("int4", {nullable: true})
  startExecutionBlock!: number | undefined | null

  @Column_("int4", {nullable: true})
  period!: number | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalAmount!: bigint | undefined | null

  @Column_("int4", {nullable: true})
  slippage!: number | undefined | null

  @Column_("int4", {nullable: true})
  maxRetries!: number | undefined | null

  @Column_("int4", {nullable: true})
  stabilityThreshold!: number | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalExecutedAmountIn!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalExecutedAmountOut!: bigint | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetIn!: Asset | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amountIn!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  maxAmountIn!: bigint | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetOut!: Asset | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amountOut!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
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
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
