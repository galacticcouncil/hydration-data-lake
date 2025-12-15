import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Swap} from "./swap.model"
import {SwapFeeDestinationType} from "./_swapFeeDestinationType"

@Entity_()
export class SwapFee {
  constructor(props?: Partial<SwapFee>) {
    Object.assign(this, props)
  }

  /**
   * <swapId>-<assetId>-<recipientId || destinationType> e.g. 0006516718-9965d-000107-0
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Swap, {nullable: true})
  swap!: Swap

  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint

  @Column_("varchar", {length: 7, nullable: false})
  destinationType!: SwapFeeDestinationType

  @Column_("text", {nullable: true})
  recipientId!: string | undefined | null
}
