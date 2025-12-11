import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {Event} from "./event.model"

@Entity_()
export class MmReserveUsedAsCollateralEnabledEvent {
  constructor(props?: Partial<MmReserveUsedAsCollateralEnabledEvent>) {
    Object.assign(this, props)
  }

  /**
   * <event_id>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Column_("text", {nullable: false})
  accountId!: string

  @Column_("text", {nullable: false})
  assetId!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
