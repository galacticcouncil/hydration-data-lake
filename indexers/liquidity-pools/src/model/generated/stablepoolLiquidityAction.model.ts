import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Stablepool} from "./stablepool.model"
import {StablepoolAssetLiquidityAmount} from "./stablepoolAssetLiquidityAmount.model"
import {LiquidityActionType} from "./_liquidityActionType"

@Entity_()
export class StablepoolLiquidityAction {
  constructor(props?: Partial<StablepoolLiquidityAction>) {
    Object.assign(this, props)
  }

  /**
   * poolId-paraChainBlockHeight-indexInBlock
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Stablepool, {nullable: true})
  pool!: Stablepool

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  sharesAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  feeAmount!: bigint

  @OneToMany_(() => StablepoolAssetLiquidityAmount, e => e.liquidityAction)
  assetAmounts!: StablepoolAssetLiquidityAmount[]

  @Column_("varchar", {length: 6, nullable: false})
  actionType!: LiquidityActionType

  @Index_()
  @Column_("int4", {nullable: false})
  indexInBlock!: number

  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number
}
