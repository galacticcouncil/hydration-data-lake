import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Block {
  constructor(props?: Partial<Block>) {
    Object.assign(this, props)
  }

  /**
   * block_id
   */
  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  height!: number

  @Column_("text", {nullable: false})
  hash!: string

  @Column_("text", {nullable: false})
  timestamp!: string

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number
}
