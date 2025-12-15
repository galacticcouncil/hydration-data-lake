import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Hsmpool} from "./hsmpool.model"

@Entity_()
export class HsmpoolHistoricalData {
  constructor(props?: Partial<HsmpoolHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <hsm_collateral_id>-<block_height>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Hsmpool, {nullable: true})
  pool!: Hsmpool

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  bucketCapacity!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  bucketLevel!: bigint

  @Index_()
  @Column_("timestamp with time zone", {nullable: false})
  paraTimestamp!: Date

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
