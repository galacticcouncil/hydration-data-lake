import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {OmnipoolAssetData} from "./omnipoolAssetData.model"

@Entity_()
export class Omnipool {
  constructor(props?: Partial<Omnipool>) {
    Object.assign(this, props)
  }

  /**
   * omnipoolId-paraChainBlockHeight
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("text", {nullable: false})
  poolAddress!: string

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

  @Column_("int4", {nullable: false})
  hdxAssetId!: number

  @Column_("int4", {nullable: false})
  hubAssetId!: number

  @Index_()
  @Column_("int4", {nullable: false})
  paraChainBlockHeight!: number

  @Index_()
  @Column_("int4", {nullable: false})
  relayChainBlockHeight!: number

  @OneToMany_(() => OmnipoolAssetData, e => e.pool)
  assets!: OmnipoolAssetData[]
}
