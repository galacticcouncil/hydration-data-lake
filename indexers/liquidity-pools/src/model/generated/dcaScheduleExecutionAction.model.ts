import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Swap} from "./swap.model"
import {DcaScheduleExecution} from "./dcaScheduleExecution.model"
import {DcaScheduleExecutionStatus} from "./_dcaScheduleExecutionStatus"
import {DispatchError} from "./_dispatchError"

@Entity_()
export class DcaScheduleExecutionAction {
  constructor(props?: Partial<DcaScheduleExecutionAction>) {
    Object.assign(this, props)
  }

  /**
   * <dca_schedule_execution_id>-<dca_schedule_execution_status>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {array: true, nullable: true})
  operationIds!: (string | undefined | null)[] | undefined | null

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @OneToMany_(() => Swap, e => e.dcaScheduleExecutionAction)
  swaps!: Swap[]

  @Index_()
  @ManyToOne_(() => DcaScheduleExecution, {nullable: true})
  scheduleExecution!: DcaScheduleExecution

  @Index_()
  @Column_("varchar", {length: 8, nullable: true})
  status!: DcaScheduleExecutionStatus | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new DispatchError(undefined, obj)}, nullable: true})
  statusMemo!: DispatchError | undefined | null

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
