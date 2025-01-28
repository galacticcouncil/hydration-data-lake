import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Swap} from "./swap.model"
import {SwapAssetBalanceType} from "./_swapAssetBalanceType"
import {Asset} from "./asset.model"

@Entity_()
export class SwapAssetBalance {
  constructor(props?: Partial<SwapAssetBalance>) {
    Object.assign(this, props)
  }

  /**
   * <swapId>-<assetId>-<SwapAssetBalanceType> e.g. 0006516718-9965d-000107-0-INPUT
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Swap, {nullable: true})
  swap!: Swap

  @Column_("varchar", {length: 6, nullable: false})
  assetBalanceType!: SwapAssetBalanceType

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint
}
