import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {EventGroup} from "./_eventGroup"
import {TraceEntityType} from "./_traceEntityType"
import {Call} from "./call.model"
import {Block} from "./block.model"

@Entity_()
export class Event {
  constructor(props?: Partial<Event>) {
    Object.assign(this, props)
  }

  /**
   * 0006508857-000017-d2fd9
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  traceId!: string

  @Column_("int4", {nullable: false})
  indexInBlock!: number

  @Column_("text", {nullable: false})
  name!: string

  @Column_("varchar", {length: 14, nullable: true})
  group!: EventGroup | undefined | null

  @Column_("text", {nullable: false})
  phase!: string

  @Column_("varchar", {length: 27, array: true, nullable: true})
  entityTypes!: (TraceEntityType | undefined | null)[] | undefined | null

  @Index_()
  @ManyToOne_(() => Call, {nullable: true})
  call!: Call | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
