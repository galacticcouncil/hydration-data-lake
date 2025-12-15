import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class AccountTotalBalanceHistoricalData {
  constructor(props?: Partial<AccountTotalBalanceHistoricalData>) {
    Object.assign(this, props)
  }

  /**
   * <address>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  accountId!: string

  @Column_("text", {nullable: false})
  refAssetId!: string

  @Column_("text", {nullable: false})
  totalTransferableNorm!: string

  @Column_("text", {nullable: false})
  totalLockedNorm!: string

  @Column_("text", {nullable: true})
  totalDebtNorm!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
