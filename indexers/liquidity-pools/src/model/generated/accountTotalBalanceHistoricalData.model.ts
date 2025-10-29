import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Account} from "./account.model"
import {Asset} from "./asset.model"

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

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  account!: Account

  @Index_()
  @ManyToOne_(() => Asset, {nullable: true})
  refAsset!: Asset

  @Column_("text", {nullable: false})
  totalTransferableNorm!: string

  @Column_("text", {nullable: false})
  totalLockedNorm!: string

  @Column_("text", {nullable: true})
  totalDebtNorm!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  paraBlockHeight!: number

  @Column_("int4", {nullable: false})
  relayBlockHeight!: number

  @Column_("text", {nullable: false})
  blockId!: string
}
