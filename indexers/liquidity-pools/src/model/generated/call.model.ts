import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {TraceEntityType} from "./_traceEntityType"
import {Event} from "./event.model"
import {Block} from "./block.model"
import {Extrinsic} from "./extrinsic.model"

@Entity_()
export class Call {
  constructor(props?: Partial<Call>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  traceId!: string

  @Column_("text", {nullable: true})
  args!: string | undefined | null

  @Column_("bool", {nullable: true})
  success!: boolean | undefined | null

  @Column_("text", {nullable: false})
  name!: string

  @Column_("text", {nullable: false})
  originKind!: string

  @Column_("text", {nullable: true})
  originValueKind!: string | undefined | null

  @Column_("text", {nullable: true})
  originValue!: string | undefined | null

  @Column_("varchar", {length: 25, array: true, nullable: true})
  entityTypes!: (TraceEntityType | undefined | null)[] | undefined | null

  @OneToMany_(() => Call, e => e.parent)
  subcalls!: Call[]

  @OneToMany_(() => Event, e => e.call)
  events!: Event[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block

  @Index_()
  @ManyToOne_(() => Extrinsic, {nullable: true})
  extrinsic!: Extrinsic

  @Index_()
  @ManyToOne_(() => Call, {nullable: true})
  parent!: Call | undefined | null
}
