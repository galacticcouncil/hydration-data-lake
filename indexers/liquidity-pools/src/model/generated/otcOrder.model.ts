import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {OtcOrderStatus} from "./_otcOrderStatus"
import {OtcOrderEvent} from "./otcOrderEvent.model"

@Entity_()
export class OtcOrder {
  constructor(props?: Partial<OtcOrder>) {
    Object.assign(this, props)
  }

  /**
   * <orderId> as string
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  ownerId!: string

  @Column_("text", {nullable: false})
  assetInId!: string

  @Column_("text", {nullable: false})
  assetOutId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amountOut!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amountIn!: bigint

  @Column_("bool", {nullable: true})
  partiallyFillable!: boolean | undefined | null

  @Index_()
  @Column_("varchar", {length: 15, nullable: true})
  status!: OtcOrderStatus | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalFilledAmountIn!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  totalFilledAmountOut!: bigint | undefined | null

  @OneToMany_(() => OtcOrderEvent, e => e.order)
  events!: OtcOrderEvent[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: true})
  blockId!: string | undefined | null
}
