import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {Call} from "./call.model"
import {Block} from "./block.model"

@Entity_()
export class Extrinsic {
  constructor(props?: Partial<Extrinsic>) {
    Object.assign(this, props)
  }

  /**
   * 0003396328-000002-70ca4
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  hash!: string

  @OneToMany_(() => Call, e => e.extrinsic)
  calls!: Call[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
