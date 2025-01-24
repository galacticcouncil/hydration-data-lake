import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {ChainActivityTrace} from "./chainActivityTrace.model"
import {Block} from "./block.model"

@Entity_()
export class ChainActivityTraceRelation {
  constructor(props?: Partial<ChainActivityTraceRelation>) {
    Object.assign(this, props)
  }

  /**
   * <parentTraceId>-<childTraceId>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => ChainActivityTrace, {nullable: true})
  parentTrace!: ChainActivityTrace

  @Index_()
  @ManyToOne_(() => ChainActivityTrace, {nullable: true})
  childTrace!: ChainActivityTrace

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
