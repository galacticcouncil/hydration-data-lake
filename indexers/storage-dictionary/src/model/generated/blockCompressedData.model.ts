import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class BlockCompressedData {
  constructor(props?: Partial<BlockCompressedData>) {
    Object.assign(this, props)
  }

  /**
   * block_number
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  algo!: string

  @Column_("text", {nullable: false})
  compStrFormat!: string

  @Column_("text", {nullable: false})
  data!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
