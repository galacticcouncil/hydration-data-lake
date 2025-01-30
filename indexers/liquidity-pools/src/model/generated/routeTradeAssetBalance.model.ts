import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {RouteTrade} from "./routeTrade.model"
import {SwapAssetBalanceType} from "./_swapAssetBalanceType"
import {Asset} from "./asset.model"

@Entity_()
export class RouteTradeAssetBalance {
  constructor(props?: Partial<RouteTradeAssetBalance>) {
    Object.assign(this, props)
  }

  /**
   * <routeTradeId>-<assetId>-<SwapAssetBalanceType> e.g. 6516718-3094-0-INPUT
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => RouteTrade, {nullable: true})
  routeTrade!: RouteTrade

  @Column_("varchar", {length: 6, nullable: false})
  assetBalanceType!: SwapAssetBalanceType

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  asset!: Asset

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  amount!: bigint
}
