import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Stableswap} from "./stableswap.model"
import {StableswapAssetLiquidityAmount} from "./stableswapAssetLiquidityAmount.model"
import {LiquidityActionEvent} from "./_liquidityActionEvent"
import {Event} from "./event.model"

@Entity_()
export class StableswapLiquidityEvent {
  constructor(props?: Partial<StableswapLiquidityEvent>) {
    Object.assign(this, props)
  }

  /**
   * <stableswapId>-<eventId>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {array: true, nullable: true})
  traceIds!: (string)[] | undefined | null

  @Index_()
  @ManyToOne_(() => Stableswap, {nullable: true})
  pool!: Stableswap

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  sharesAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  feeAmount!: bigint

  @OneToMany_(() => StableswapAssetLiquidityAmount, e => e.liquidityAction)
  assetAmounts!: StableswapAssetLiquidityAmount[]

  @Column_("varchar", {length: 6, nullable: false})
  actionType!: LiquidityActionEvent

  @Index_()
  @Column_("int4", {nullable: false})
  indexInBlock!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Event, {nullable: true})
  event!: Event
}
