import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class TransactionPaymentHistoricalData {
  constructor(props?: Partial<TransactionPaymentHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * block_height
   */
  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  nextFeeMultiplier!: bigint | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
