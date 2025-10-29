import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Account} from "./account.model"

@Entity_()
export class AccountMmPositionHistoricalData {
  constructor(props?: Partial<AccountMmPositionHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <address>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Column_("text", {nullable: true})
  accountBoundEvmAddress!: string | undefined | null

  @Column_("text", {nullable: false})
  totalCollateralBase!: string

  @Column_("text", {nullable: false})
  totalDebtBase!: string

  @Column_("text", {nullable: false})
  availableBorrowsBase!: string

  @Column_("text", {nullable: false})
  currentLiquidationThreshold!: string

  @Column_("text", {nullable: false})
  ltv!: string

  @Column_("text", {nullable: true})
  healthFactor!: string | undefined | null

  @Column_("text", {nullable: false})
  poolAddress!: string

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
