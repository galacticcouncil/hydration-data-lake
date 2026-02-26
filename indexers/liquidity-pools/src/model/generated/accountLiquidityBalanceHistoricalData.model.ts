import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {AccountLiquidityType} from "./_accountLiquidityType"

@Entity_()
export class AccountLiquidityBalanceHistoricalData {
  constructor(props?: Partial<AccountLiquidityBalanceHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <address>-<positionId>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("varchar", {length: 16, nullable: false})
  liquidityType!: AccountLiquidityType

  @Index_()
  @Column_("text", {nullable: false})
  accountId!: string

  @Index_()
  @Column_("text", {nullable: false})
  assetId!: string

  @Column_("text", {nullable: true})
  positionId!: string | undefined | null

  @Column_("text", {nullable: true})
  depositId!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  liquidityAmount!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  hubLiquidityAmount!: bigint | undefined | null

  @Column_("text", {nullable: true})
  liquidityAmountNorm!: string | undefined | null

  @Column_("text", {nullable: true})
  hubLiquidityAmountNorm!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
