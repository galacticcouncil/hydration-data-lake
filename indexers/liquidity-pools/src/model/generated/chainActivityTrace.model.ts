import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Account} from "./account.model"
import {AccountChainActivityTrace} from "./accountChainActivityTrace.model"
import {ChainActivityTraceRelation} from "./chainActivityTraceRelation.model"
import {Block} from "./block.model"

@Entity_()
export class ChainActivityTrace {
  constructor(props?: Partial<ChainActivityTrace>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {array: true, nullable: true})
  operationIds!: (string)[] | undefined | null

  @Column_("text", {array: true, nullable: false})
  traceIds!: (string)[]

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  originator!: Account | undefined | null

  @OneToMany_(() => AccountChainActivityTrace, e => e.chainActivityTrace)
  participants!: AccountChainActivityTrace[]

  @Column_("text", {array: true, nullable: false})
  participantAccounts!: (string)[]

  @OneToMany_(() => ChainActivityTraceRelation, e => e.parentTrace)
  childTraces!: ChainActivityTraceRelation[]

  @OneToMany_(() => ChainActivityTraceRelation, e => e.childTrace)
  parentTraces!: ChainActivityTraceRelation[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
