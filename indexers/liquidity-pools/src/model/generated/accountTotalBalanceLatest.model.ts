import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class AccountTotalBalanceLatest {
  constructor(props?: Partial<AccountTotalBalanceLatest>) {
    Object.assign(this, props)
  }

  /**
   * <address>
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  refAssetId!: string

  @Column_("text", {nullable: false})
  totalTransferableNorm!: string

  @Column_("text", {nullable: false})
  totalLockedNorm!: string

  @Column_("text", {nullable: true})
  totalDebtNorm!: string | undefined | null

  @Column_("int4", {nullable: false})
  paraBlockHeight!: number
}
