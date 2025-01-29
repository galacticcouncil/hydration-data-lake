import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {DcaScheduleExecution} from "./dcaScheduleExecution.model"
import {Swap} from "./swap.model"
import {DcaScheduleExecutionEventName} from "./_dcaScheduleExecutionEventName"
import {DispatchError} from "./_dispatchError"
import {Event} from "./event.model"

@Entity_()
export class DcaScheduleExecutionEvent {
  constructor(props?: Partial<DcaScheduleExecutionEvent>) {
    Object.assign(this, props)
  }

  /**
   * <dcaScheduleExecutionId>-<dcaScheduleExecutionStatus>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {array: true, nullable: true})
  operationIds!: (string | undefined | null)[] | undefined | null

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Index_()
  @ManyToOne_(() => DcaScheduleExecution, {nullable: true})
  scheduleExecution!: DcaScheduleExecution

  @OneToMany_(() => Swap, e => e.dcaScheduleExecutionAction)
  swaps!: Swap[]

  @Index_()
  @Column_("varchar", {length: 8, nullable: true})
  eventName!: DcaScheduleExecutionEventName | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new DispatchError(undefined, obj)}, nullable: true})
  memo!: DispatchError | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
