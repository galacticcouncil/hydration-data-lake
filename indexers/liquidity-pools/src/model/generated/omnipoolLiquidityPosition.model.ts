import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {OmnipoolLiquidityPositionStatus} from "./_omnipoolLiquidityPositionStatus"
import {OmnipoolLiquidityPositionEvent} from "./omnipoolLiquidityPositionEvent.model"

@Entity_()
export class OmnipoolLiquidityPosition {
  constructor(props?: Partial<OmnipoolLiquidityPosition>) {
    Object.assign(this, props)
  }

  /**
   * <position ID>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("text", {nullable: false})
  omnipoolAssetId!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  initialAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  sharesAmount!: bigint

  @Column_("text", {nullable: true})
  positionNftId!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  price!: bigint | undefined | null

  /**
   * should be either PositionCreated or PositionDestroyed
   */
  @Column_("varchar", {length: 24, nullable: false})
  status!: OmnipoolLiquidityPositionStatus

  @OneToMany_(() => OmnipoolLiquidityPositionEvent, e => e.position)
  positionEvents!: OmnipoolLiquidityPositionEvent[]

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: true})
  eventId!: string | undefined | null
}
