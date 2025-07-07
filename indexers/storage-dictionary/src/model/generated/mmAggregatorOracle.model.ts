import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class MmAggregatorOracle {
  constructor(props?: Partial<MmAggregatorOracle>) {
    Object.assign(this, props)
  }

  /**
   * <oracle_address>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  address!: string

  @Column_("text", {nullable: false})
  price!: string

  @Column_("int4", {nullable: false})
  decimals!: number

  @Column_("int4", {nullable: false})
  updatedAt!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
