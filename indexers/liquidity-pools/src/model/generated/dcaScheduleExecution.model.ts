import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {DcaSchedule} from "./dcaSchedule.model"
import {DcaScheduleExecutionStatus} from "./_dcaScheduleExecutionStatus"
import {DcaScheduleExecutionEvent} from "./dcaScheduleExecutionEvent.model"

@Entity_()
export class DcaScheduleExecution {
  constructor(props?: Partial<DcaScheduleExecution>) {
    Object.assign(this, props)
  }

  /**
   * <dcaScheduleId>-<blockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => DcaSchedule, {nullable: true})
  schedule!: DcaSchedule

  @Index_()
  @Column_("varchar", {length: 8, nullable: true})
  status!: DcaScheduleExecutionStatus | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amountOut!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amountIn!: bigint | undefined | null

  @OneToMany_(() => DcaScheduleExecutionEvent, e => e.scheduleExecution)
  events!: DcaScheduleExecutionEvent[]
}
