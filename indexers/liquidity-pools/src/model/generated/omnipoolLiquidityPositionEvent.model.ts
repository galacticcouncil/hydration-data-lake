import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {OmnipoolLiquidityPosition} from "./omnipoolLiquidityPosition.model"
import {OmnipoolLiquidityPositionStatus} from "./_omnipoolLiquidityPositionStatus"
import {Account} from "./account.model"
import {Asset} from "./asset.model"
import {Event} from "./event.model"

@Entity_()
export class OmnipoolLiquidityPositionEvent {
  constructor(props?: Partial<OmnipoolLiquidityPositionEvent>) {
    Object.assign(this, props)
  }

  /**
   * event ID
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => OmnipoolLiquidityPosition, {nullable: true})
  position!: OmnipoolLiquidityPosition

  @Column_("varchar", {length: 24, nullable: false})
  eventName!: OmnipoolLiquidityPositionStatus

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account | undefined | null

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  amount!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  sharesAmount!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  price!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  fee!: bigint | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
