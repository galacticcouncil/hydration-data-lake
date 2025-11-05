import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {LiquidityActionEvent} from "./_liquidityActionEvent"
import {OmnipoolLiquidityPositionEvent} from "./omnipoolLiquidityPositionEvent.model"

@Entity_()
export class OmnipoolAssetLiquidityEvent {
  constructor(props?: Partial<OmnipoolAssetLiquidityEvent>) {
    Object.assign(this, props)
  }

  /**
   * <omnipool_id>-<asset_id>-<event_id>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("varchar", {length: 6, nullable: false})
  actionType!: LiquidityActionEvent

  @Column_("text", {nullable: false})
  accountId!: string

  @Column_("text", {nullable: false})
  positionId!: string

  @Index_()
  @ManyToOne_(() => OmnipoolLiquidityPositionEvent, {nullable: true})
  positionEvent!: OmnipoolLiquidityPositionEvent | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  fee!: bigint | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  eventId!: string
}
