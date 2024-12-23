import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {TraceEntityType} from "./_traceEntityType"
import {Extrinsic} from "./extrinsic.model"
import {Event} from "./event.model"
import {Block} from "./block.model"

@Entity_()
export class Call {
  constructor(props?: Partial<Call>) {
    Object.assign(this, props)
  }

  /**
   * 0003396328-000002-70ca4-000003
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  traceId!: string

  @Column_("text", {nullable: false})
  name!: string

  @Column_("bool", {nullable: true})
  success!: boolean | undefined | null

  @Column_("text", {nullable: false})
  originKind!: string

  @Column_("text", {nullable: true})
  originValueKind!: string | undefined | null

  @Column_("text", {nullable: true})
  originValue!: string | undefined | null

  @Column_("varchar", {length: 27, array: true, nullable: true})
  entityTypes!: (TraceEntityType | undefined | null)[] | undefined | null

  @Index_()
  @ManyToOne_(() => Extrinsic, {nullable: true})
  extrinsic!: Extrinsic

  @Index_()
  @ManyToOne_(() => Call, {nullable: true})
  parent!: Call | undefined | null

  @OneToMany_(() => Call, e => e.parent)
  subcalls!: Call[]

  @OneToMany_(() => Event, e => e.call)
  events!: Event[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
