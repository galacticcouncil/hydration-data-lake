import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"
import {Account} from "./account.model"
import {Event} from "./event.model"

@Entity_()
export class MmLiquidationCall {
  constructor(props?: Partial<MmLiquidationCall>) {
    Object.assign(this, props)
  }

  /**
   * <otc_order_id>-<event_id>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  collateralAsset!: Asset

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  debtAsset!: Asset

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  debtToCoverAmount!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  liquidatedCollateralAmount!: bigint | undefined | null

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  liquidatorAccount!: Account

  @Column_("bool", {nullable: false})
  receiveAToken!: boolean

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
