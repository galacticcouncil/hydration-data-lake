import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {Call} from "./call.model"
import {Block} from "./block.model"

@Entity_()
export class Extrinsic {
  constructor(props?: Partial<Extrinsic>) {
    Object.assign(this, props)
  }

  /**
   * <blockHeight>-<blockHash prefix>-<indexInBlock> e.g. 0000065722-4721a-000002
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  hash!: string

  @Column_("int4", {nullable: false})
  indexInBlock!: number

  @OneToMany_(() => Call, e => e.extrinsic)
  calls!: Call[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
