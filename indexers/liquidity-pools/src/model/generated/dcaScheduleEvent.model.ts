import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {DcaSchedule} from "./dcaSchedule.model"
import {DcaScheduleStatus} from "./_dcaScheduleStatus"
import {DispatchError} from "./_dispatchError"
import {Event} from "./event.model"

@Entity_()
export class DcaScheduleEvent {
  constructor(props?: Partial<DcaScheduleEvent>) {
    Object.assign(this, props)
  }

  /**
   * <dcaScheduleId>-<eventId>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Index_()
  @ManyToOne_(() => DcaSchedule, {nullable: true})
  schedule!: DcaSchedule

  @Index_()
  @Column_("varchar", {length: 10, nullable: false})
  eventName!: DcaScheduleStatus

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new DispatchError(undefined, obj)}, nullable: true})
  errorState!: DispatchError | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
