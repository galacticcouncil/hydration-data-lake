import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {EventGroup} from "./_eventGroup"
import {TraceEntityType} from "./_traceEntityType"
import {Block} from "./block.model"
import {Call} from "./call.model"

@Entity_()
export class Event {
  constructor(props?: Partial<Event>) {
    Object.assign(this, props)
  }

  /**
   * <blockHeight>-<blockHashPrefix>-<indexInBlock> (e.g. 0000059948-e5832-000007)
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  traceId!: string

  @Column_("text", {nullable: true})
  args!: string | undefined | null

  @Column_("int4", {nullable: false})
  indexInBlock!: number

  @Column_("text", {nullable: false})
  name!: string

  @Column_("varchar", {length: 14, nullable: true})
  group!: EventGroup | undefined | null

  @Column_("text", {nullable: false})
  phase!: string

  @Column_("varchar", {length: 25, array: true, nullable: true})
  entityTypes!: (TraceEntityType | undefined | null)[] | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block

  @Index_()
  @ManyToOne_(() => Call, {nullable: true})
  call!: Call | undefined | null
}
