import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {OtcOrderActionKind} from "./_otcOrderActionKind"
import {OtcOrder} from "./otcOrder.model"
import {Account} from "./account.model"
import {Swap} from "./swap.model"

@Entity_()
export class OtcOrderAction {
  constructor(props?: Partial<OtcOrderAction>) {
    Object.assign(this, props)
  }

  /**
   * <otc_order_id>-<event_id>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("text", {nullable: true})
  operationId!: string | undefined | null

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Index_()
  @Column_("varchar", {length: 16, nullable: true})
  kind!: OtcOrderActionKind | undefined | null

  @Index_()
  @ManyToOne_(() => OtcOrder, {nullable: true})
  order!: OtcOrder

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amountIn!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amountOut!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  fee!: bigint | undefined | null

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  filler!: Account | undefined | null

  @Column_("int4", {nullable: false})
  eventIndex!: number

  @Index_()
  @ManyToOne_(() => Swap, {nullable: true})
  swap!: Swap | undefined | null

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
