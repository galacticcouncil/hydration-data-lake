import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {OtcOrderStatus} from "./_otcOrderStatus"
import {OtcOrderAction} from "./otcOrderAction.model"

@Entity_()
export class OtcOrder {
  constructor(props?: Partial<OtcOrder>) {
    Object.assign(this, props)
  }

  /**
   * order_id as string
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
  @Column_("varchar", {length: 16, nullable: true})
  status!: OtcOrderStatus | undefined | null

  @Column_("int4", {nullable: false})
  createdAtRelayBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  createdAtParaBlockHeight!: number

  @OneToMany_(() => OtcOrderAction, e => e.order)
  actions!: OtcOrderAction[]
}
