import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {ChainActivityTrace} from "./chainActivityTrace.model"

@Entity_()
export class ChainActivityTraceRelation {
  constructor(props?: Partial<ChainActivityTraceRelation>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => ChainActivityTrace, {nullable: true})
  childTrace!: ChainActivityTrace

  @Index_()
  @ManyToOne_(() => ChainActivityTrace, {nullable: true})
  parentTrace!: ChainActivityTrace

  @Column_("int4", {nullable: false})
  createdAtParaChainBlockHeight!: number
}
