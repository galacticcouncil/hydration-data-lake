import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Omnipool} from "./omnipool.model"
import {OmnipoolAssetHistoricalData} from "./omnipoolAssetHistoricalData.model"
import {Asset} from "./asset.model"
import {Block} from "./block.model"

@Entity_()
export class OmnipoolHistoricalData {
  constructor(props?: Partial<OmnipoolHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <omnipoolId>-<paraBlockHeight> (e.g. 0x6d6f646c6f6d6e69706f6f6c0000000000000000000000000000000000000000-101312)
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Omnipool, {nullable: true})
  pool!: Omnipool

  @OneToMany_(() => OmnipoolAssetHistoricalData, e => e.poolHistoricalData)
  assetsHistoricalData!: OmnipoolAssetHistoricalData[]

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  maxInRatio!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  maxOutRatio!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  minTradingLimit!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  minPoolLiquidity!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  minWithdrawalFee!: bigint

  @Column_("int4", {nullable: false})
  burnProtocolFee!: number

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  hdxAsset!: Asset

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  hubAsset!: Asset

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Index_()
  @ManyToOne_(() => Block, {nullable: true})
  block!: Block
}
