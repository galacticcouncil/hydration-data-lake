import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {OtcOrder} from "./otcOrder.model"
import {OtcOrderEventName} from "./_otcOrderEventName"
import {Account} from "./account.model"
import {Swap} from "./swap.model"
import {Event} from "./event.model"

@Entity_()
export class OtcOrderEvent {
  constructor(props?: Partial<OtcOrderEvent>) {
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
  @ManyToOne_(() => OtcOrder, {nullable: true})
  order!: OtcOrder

  @Index_()
  @Column_("varchar", {length: 15, nullable: true})
  eventName!: OtcOrderEventName | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amountIn!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amountOut!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  fee!: bigint | undefined | null

  @Column_("int4", {nullable: false})
  eventIndex!: number

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  filler!: Account | undefined | null

  @Index_()
  @ManyToOne_(() => Swap, {nullable: true})
  swap!: Swap | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
