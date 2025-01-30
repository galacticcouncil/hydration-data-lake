import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {OtcOrderStatus} from "./_otcOrderStatus"
import {OtcOrderEvent} from "./otcOrderEvent.model"
import {Block} from "./block.model"

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

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  owner!: Account

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetIn!: Asset

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  assetOut!: Asset

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

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
